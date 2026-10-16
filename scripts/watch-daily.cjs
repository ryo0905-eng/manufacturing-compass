// Invoked by the local scheduled agent. No scheduler, API key or model calls live here.
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { validateSnapshot, assertEarningsTransition } = require('./earnings-publish.cjs');
const { validateCalendar, checkRedaction, assertCalendarTransition } = require('./watch-data.cjs');
const { validateSnapshot: validateNews } = require('./chip-pulse-editor-publish.cjs');
const root = path.resolve(__dirname, '..');
const runDeadline = Date.now() + 175000;
const stateDir = path.join(root, '.private/watch-daily');
const lock = path.join(stateDir, 'active.json');
const allowedPaths = [
  'src/data/chip-pulse-media.json',
  'src/data/chip-pulse-operations.json',
  'src/data/watch-editorial.json',
  'src/data/earnings-snapshot.json',
  'src/data/watch-calendar.json',
  'docs/data/chip-pulse-supply-audit.json',
];
function validateDailyDiff(entries) {
  return entries.filter(entry => entry.status !== 'M' || !allowedPaths.includes(entry.path))
    .map(entry => `Not permitted in a daily data commit: ${entry.status} ${entry.path}`);
}
function assertNewsTransition(previous, next) {
  for (const old of previous.articles) {
    const article = next.articles.find(item => item.id === old.id);
    if (!article) throw new Error('Published articles cannot be removed by a daily task');
    const content = item => { const { sourceCheck, ...rest } = item; return rest; };
    if (JSON.stringify(content(old)) === JSON.stringify(content(article))) continue;
    const history = article.history.at(-1);
    if (article.version !== old.version + 1 || article.firstPublishedAt !== old.firstPublishedAt || article.publishedAt !== old.publishedAt || article.updatedAt < old.updatedAt || history?.version !== old.version || history?.title !== old.title || history?.summary !== old.summary || article.validation !== 'editor-verified') throw new Error('Changed article needs checked revision and original publication history');
  }
  const oldIds = new Set(previous.articles.map(article => article.id));
  const added = next.articles.filter(article => !oldIds.has(article.id));
  if (added.length > 3 || added.some(article => article.validation !== 'editor-verified' || article.version !== 1)) throw new Error('At most three new checked news articles per daily run');
}
function command(cmd, args, cwd = root, timeout = 180000, env = process.env) {
  if (Date.now() >= runDeadline) throw new Error('Daily command exceeded its execution window');
  const result = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout: Math.min(timeout, runDeadline - Date.now()), killSignal: 'SIGTERM', env, maxBuffer: 4 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed or timed out: ${result.error?.message ?? result.stderr?.slice(-1200) ?? result.status}`);
  return result.stdout.trim();
}
function git(args, cwd = root) { return command('git', args, cwd); }
function read(filename) { return JSON.parse(fs.readFileSync(filename, 'utf8')); }
function prepare() {
  fs.mkdirSync(stateDir, { recursive: true });
  // Never clear a previous run's lock automatically: it may still be checking sources.
  const fd = fs.openSync(lock, 'wx');
  const run = { id: randomUUID(), startedAt: new Date().toISOString(), phase: 'preparing' };
  fs.writeFileSync(fd, JSON.stringify(run)); fs.closeSync(fd);
  try {
    git(['fetch', 'origin']);
    const remoteHead = git(['symbolic-ref', '--short', 'refs/remotes/origin/HEAD']);
    if (!remoteHead.startsWith('origin/')) throw new Error('Default branch is unknown');
    run.target = remoteHead.slice(7);
    run.base = git(['rev-parse', remoteHead]);
    run.worktree = path.join(stateDir, `worktree-${run.id}`);
    run.branch = `automation/watch-${run.id}`;
    git(['worktree', 'add', '-b', run.branch, run.worktree, run.base]);
    if (!fs.existsSync(path.join(run.worktree, 'scripts/watch-daily.cjs'))) throw new Error('Implementation is not present on the default branch; deploy the code before scheduling');
    const localLock = fs.readFileSync(path.join(root, 'package-lock.json'));
    const workerLock = fs.readFileSync(path.join(run.worktree, 'package-lock.json'));
    if (!localLock.equals(workerLock) || !fs.existsSync(path.join(root, 'node_modules/typescript'))) throw new Error('Install matching dependencies before scheduling');
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(run.worktree, 'node_modules'), 'dir');
    const privateDir = path.join(run.worktree, '.private'); fs.mkdirSync(privateDir, { recursive: true });
    fs.copyFileSync(path.join(root, '.private/content-redaction-dictionary.md'), path.join(privateDir, 'content-redaction-dictionary.md'));
    run.phase = 'reviewing';
    fs.writeFileSync(lock, JSON.stringify(run, null, 2) + '\n');
    console.log(JSON.stringify(run, null, 2));
  } catch (error) {
    run.phase = 'failed'; run.error = error.message;
    fs.writeFileSync(lock, JSON.stringify(run, null, 2) + '\n');
    throw error;
  }
}
function activeRun() {
  const run = read(lock);
  const prefix = stateDir + path.sep;
  if (!run.worktree?.startsWith(prefix) || !fs.existsSync(run.worktree)) throw new Error('Invalid active worktree');
  return run;
}
function collect() {
  const run = activeRun();
  const policy = read(path.join(run.worktree, 'src/data/chip-pulse-ai-policy.json'));
  if (policy.approved !== false) throw new Error('Unapproved AI publishing boundary changed; stop for a separate review');
  require('@next/env').loadEnvConfig(root, true, { info() {}, error() {} });
  // Discovery only: never use the old AI publication path in this scheduled task.
  const output = command('npm', ['run', 'chip-pulse:refresh'], run.worktree, 180000, { ...process.env, CHIP_PULSE_AI_ENABLED: 'false' });
  console.log(output);
  console.log('Run npm run watch:queue in the worktree. Collection status and source changes are recorded; discovery is not source verification.');
}
function publish() {
  const run = activeRun();
  if (run.phase !== 'reviewing') throw new Error('Run is not in the reviewing phase');
  const cwd = run.worktree;
  if (git(['rev-parse', 'HEAD'], cwd) !== run.base || git(['branch', '--show-current'], cwd) !== run.branch) throw new Error('Unexpected branch or pre-existing commit');
  if (git(['ls-files', '--others', '--exclude-standard'], cwd)) throw new Error('Unexpected untracked public files');
  const changes = git(['diff', 'HEAD', '--name-status', '--no-renames'], cwd).split('\n').filter(Boolean).map(line => { const [status, filename] = line.split('\t'); return { status, path: filename }; });
  const errors = validateDailyDiff(changes);
  if (errors.length) throw new Error(errors.join('\n'));
  const load = name => read(path.join(cwd, 'src/data', name));
  const earnings = load('earnings-snapshot.json'), media = load('chip-pulse-media.json'), calendar = load('watch-calendar.json');
  errors.push(...validateSnapshot(earnings), ...validateCalendar(calendar, earnings, media));
  if (errors.length) throw new Error(errors.join('\n'));
  validateNews(media);
  checkRedaction(changes.map(entry => read(path.join(cwd, entry.path))), path.join(root, '.private/content-redaction-dictionary.md'));
  if (changes.length === 0) { console.log('No data changes; no commit or push. Run --finish after recording the result.'); return; }
  const before = filename => JSON.parse(git(['show', `${run.base}:src/data/${filename}`], cwd));
  assertEarningsTransition(before('earnings-snapshot.json'), earnings);
  assertCalendarTransition(before('watch-calendar.json'), calendar);
  assertNewsTransition(before('chip-pulse-media.json'), media);
  git(['diff', '--check'], cwd);
  // This is the only typecheck in a scheduled run. All checks together get under three minutes.
  const deadline = runDeadline;
  console.log(command('npm', ['run', 'watch:test'], cwd, Math.max(1, deadline - Date.now())));
  console.log(command('npm', ['run', 'watch:check'], cwd, Math.max(1, deadline - Date.now())));
  console.log(command('npm', ['run', 'typecheck'], cwd, Math.max(1, deadline - Date.now())));
  git(['fetch', 'origin'], cwd);
  if (git(['rev-parse', `origin/${run.target}`], cwd) !== run.base) throw new Error('Default branch changed during review; preserve this worktree and reconcile before any push');
  git(['add', '--', ...changes.map(entry => entry.path)], cwd);
  const staged = git(['diff', '--cached', '--name-status', '--no-renames'], cwd).split('\n').filter(Boolean).map(line => { const [status, filename] = line.split('\t'); return { status, path: filename }; });
  if (validateDailyDiff(staged).length || staged.length !== changes.length) throw new Error('Unexpected staged changes');
  git(['commit', '-m', 'data: update semiconductor watch verified daily data'], cwd);
  const sha = git(['rev-parse', 'HEAD'], cwd);
  // A concurrent push is rejected by Git; never rebase, force push or retry automatically.
  git(['push', 'origin', `HEAD:refs/heads/${run.target}`], cwd);
  run.phase = 'pushed'; run.sha = sha; run.pushedAt = new Date().toISOString();
  fs.writeFileSync(lock, JSON.stringify(run, null, 2) + '\n');
  console.log(`Pushed ${sha}. Vercel deployment and production content remain UNVERIFIED until checked by the agent. Keep the run locked until the result is recorded, then use --finish.`);
}
function finish() {
  const run = read(lock);
  // Retain worktree and evidence for inspection. Releasing the lock never discards data.
  fs.writeFileSync(path.join(stateDir, `${run.id}.json`), JSON.stringify({ ...run, finishedAt: new Date().toISOString() }, null, 2) + '\n', { flag: 'wx' });
  fs.unlinkSync(lock);
  console.log('Run recorded and lock released. Worktree and evidence retained.');
}
if (require.main === module) {
  try {
    const action = { '--prepare': prepare, '--collect': collect, '--publish': publish, '--finish': finish }[process.argv[2]];
    if (!action) throw new Error('Use --prepare, --collect, --publish or --finish');
    action();
  } catch (error) { console.error(`Daily watch stopped: ${error.message}`); process.exitCode = 1; }
}
module.exports = { allowedPaths, validateDailyDiff, assertNewsTransition };
