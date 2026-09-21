# Visual inspection technical gate

No web route or published claims should be added until the experiment gate passes.
Python is an offline development dependency; it is not part of the Next.js build.

## Version 2 staged experiment

### Background counterfactuals and locked final evaluation

`docs/ai-visual-inspection-v2-holdout-protocol.md` freezes this stage. Reconstruct
the original development pixels exactly, then swap only the background to each
of the next two boards. Defects and capture parameters remain fixed. Run each
evaluation command separately (175-second limit, no overwrites):

```sh
python scripts/ai-visual-inspection/holdout_v2.py prepare
python scripts/ai-visual-inspection/holdout_v2.py background rules
python scripts/ai-visual-inspection/holdout_v2.py background balanced 17
# Repeat background evaluation for all 12 recipe/seed pairs.
python scripts/ai-visual-inspection/holdout_v2.py freeze
# Only after all declared gates pass; these commands permanently open final data:
python scripts/ai-visual-inspection/holdout_v2.py final rules
python scripts/ai-visual-inspection/holdout_v2.py final balanced 17
# Repeat final evaluation for all 12 recipe/seed pairs, without retuning.
python scripts/ai-visual-inspection/report_holdout_v2.py
python scripts/ai-visual-inspection/test_holdout_v2.py
```

The lock contains model, data, processing-source and protocol hashes; the runner
checks it before opening final images. Artifacts and the persistent opening
ledger live in `.cache/ai-visual-inspection/v2/holdout/`. The report checks cached
masks and OR combinations and shows errors as well as metadata-selected examples.
Any subsequent model/processing changes informed by final results require
retiring this cohort to development and creating an independent new holdout.
Passing these checks does not validate Worker/WASM, UI or factory performance.

### Rules, brightness and OR combinations

`docs/ai-visual-inspection-v2-lighting-protocol.md` freezes the rule grids,
tuning objective and brightness gains before evaluation. Run rules first, then
each of the 12 matched recipe/seed models in a separate bounded command:

```sh
python scripts/ai-visual-inspection/lighting_v2.py rules
python scripts/ai-visual-inspection/lighting_v2.py balanced 17
# Repeat separately for all declared recipes and seeds 17 / 29 / 43.
python scripts/ai-visual-inspection/report_lighting_v2.py
python scripts/ai-visual-inspection/test_lighting_v2.py
node tests/unit/ai-visual-inspection.cjs
```

Each evaluator has a 175-second limit and refuses overwrites. At brightness 1.0,
existing scores are verified and reused; 0.7 / 1.3 require actual ONNX inference.
The rule and AI input pixel hashes must match. Reports verify cached masks,
counts and OR monotonicity, retain threshold curves and changed-image IDs, and
render metadata-selected examples. Artifacts live under
`.cache/ai-visual-inspection/v2/lighting/`. Timing is native CPU, not browser timing.
Background swaps and final evaluation remain separate steps.

### Matched continuation for all training recipes

After baseline stability passes, `matched_v2.py` applies the identical continuation
to each of `dirt-biased`, `normal-poor`, `label-errors` and seeds 17, 29, 43.
The runner shares the baseline fitting/evaluation functions with explicit recipe
and output arguments. It checks baseline success, preserves old artifacts, and
limits each invocation to 175 seconds. A biased model does not have to meet the
baseline accuracy target to be evaluated; its measured failure is part of the lesson.

```sh
# One model; run each declared recipe / seed separately.
python scripts/ai-visual-inspection/matched_v2.py train dirt-biased 17
python scripts/ai-visual-inspection/matched_v2.py development dirt-biased 17
# After all nine new evaluations finish:
python scripts/ai-visual-inspection/report_matched_v2.py
```

Conditions: `docs/ai-visual-inspection-v2-matched-protocol.md`. Outputs:
`.cache/ai-visual-inspection/v2/matched/<recipe>/`. The report checks all twelve
models' hashes, training counts, thresholds and cached mask/count agreement,
then records paired changes and renders examples. It reuses the three stability
baselines without rerunning their inference. The final holdout remains untouched.

### Baseline stability continuation

The 2026-09-22 continuation is frozen in
`docs/ai-visual-inspection-v2-stability-protocol.md`. Apply six extra epochs at
learning rate 0.0003 to each existing baseline seed, resetting Adam and the RNG.
Keep the score threshold, area and acceptance criteria unchanged. Run each command
separately (175-second limit), and do not overwrite earlier runs.

```sh
python scripts/ai-visual-inspection/stability_v2.py train 17
python scripts/ai-visual-inspection/stability_v2.py train 29
python scripts/ai-visual-inspection/stability_v2.py train 43
# Only after all three tuning runs pass:
python scripts/ai-visual-inspection/stability_v2.py development 17
python scripts/ai-visual-inspection/stability_v2.py development 29
python scripts/ai-visual-inspection/stability_v2.py development 43
python scripts/ai-visual-inspection/report_stability_v2.py
```

Artifacts live in `.cache/ai-visual-inspection/v2/stability/`. The report also
renders cached masks for metadata-first examples and first errors. The final
holdout remains untouched. Do not compare these updated baselines fairly against
the old biased models; those need the same continuation first.

### Fixed recipe / seed comparison

The next experiment uses four recipes and seeds 17, 29, 43 under
`docs/ai-visual-inspection-v2-comparison-protocol.md`. Every model uses exactly
10 epochs / 750 updates. The balanced seed 17 checkpoint is reused, not selected
from the best of the new results. Each training/evaluation invocation has a
175-second guard and refuses to overwrite its record. Run jobs separately;
do not wrap the full experiment in a single shell command exceeding three minutes.

```sh
# Example for one new model; repeat separately for each declared recipe/seed.
python scripts/ai-visual-inspection/compare_v2.py train dirt-biased 17
python scripts/ai-visual-inspection/compare_v2.py evaluate dirt-biased 17
# Reused model: evaluation only.
python scripts/ai-visual-inspection/compare_v2.py evaluate balanced 17
# Read stored outputs, with no fitting or inference.
python scripts/ai-visual-inspection/report_comparison_v2.py
python scripts/ai-visual-inspection/inspect_comparison_v2.py
python -m unittest discover -s scripts/ai-visual-inspection -p 'test*.py'
```

Outputs: `.cache/ai-visual-inspection/v2/comparison/`. The report retains all
seeds, paired decision changes, actual training counts, ONNX parity and missing
runs. A recipe need not worsen every metric. The preview uses metadata-first
examples and the first changed decisions, not a selection of attractive successes.
The final holdout and browser execution remain separate steps.

### Successful baseline follow-up

The later user-authorized continuation is recorded separately in
`docs/ai-visual-inspection-v2-followup-protocol.md`. It preserves the original
failed tiny-fit run and its criteria. The follow-up passed the tiny-fit gate,
then the fresh 2,400-image baseline passed tuning and fixed development evaluation.

```sh
python scripts/ai-visual-inspection/followup_v2.py tiny-extension
python scripts/ai-visual-inspection/followup_v2.py baseline
python scripts/ai-visual-inspection/followup_v2.py development
python scripts/ai-visual-inspection/inspect_followup_v2.py
python scripts/ai-visual-inspection/report_followup_v2.py
```

These stages have already run; the runner refuses to overwrite their records.
Outputs use `.cache/ai-visual-inspection/v2/followup/`. Inspection and reporting
consume cached results without fitting or tuning. This is one baseline seed,
not completion of the multi-recipe experiment or a browser release. See
`docs/ai-visual-inspection-v2-followup-validation.md` for measured results.

### Original 320-update attempt

The follow-up was explicitly authorized by the user. Its predeclared conditions
are in `docs/ai-visual-inspection-v2-protocol.md`; v1 artifacts remain unchanged.

```sh
python scripts/ai-visual-inspection/data_v2.py
python scripts/ai-visual-inspection/test_v2.py
python scripts/ai-visual-inspection/audit_v2.py
python scripts/ai-visual-inspection/train_v2.py tiny
python scripts/ai-visual-inspection/report_v2.py
```

Outputs use `.cache/ai-visual-inspection/v2/`. Metadata and array checks verify
capture-gain pairing and intervention isolation. `train_v2.py baseline` requires
the tiny-fit gate to pass and must not be run for this attempt: the 320-update
tiny-fit result did not meet its predeclared limits. The script refuses to
overwrite a recorded run. Training/holdout scores must never be conflated.

The tiny-fit attempt found every defective image but rejected two clean images
of the same striped board. See `docs/ai-visual-inspection-v2-validation.md` for
the learning curve and remaining limitations. Do not change the run budget or
threshold after inspecting the result and call the original attempt a pass.

## Version 1 retained experiment

**v1 is a failed experiment, not a release candidate.** The second clean capture
alone receives a 0.97 brightness gain. This is a known label-correlated nuisance;
the audit and gate explicitly reject it. Preserve this version to reproduce the
record, and fix capture independence in a separately versioned experiment before
any future training. Do not relabel the current model/data as validated.

Use an isolated virtual environment and `requirements.txt`. Commands must finish
within 180 seconds. `train.py` terminates at 175 seconds and never exports a
partially trained model. A timed-out run is incomplete: do not change its settings
and retry to bypass the repository policy.

The recorded experiment used macOS arm64 with PyTorch MPS for training and native
ONNX Runtime CPU for evaluation. MPS may be unavailable inside a sandbox; this is
an execution-permission limitation, not evidence of missing hardware. The Python
environment lives outside the repository and does not modify system packages.

```sh
python scripts/ai-visual-inspection/data.py
python scripts/ai-visual-inspection/audit.py
python scripts/ai-visual-inspection/train.py balanced 17
python scripts/ai-visual-inspection/evaluate.py rules 17
python scripts/ai-visual-inspection/evaluate.py balanced 17
```

The remaining training jobs are the Cartesian product of four recipes
(`balanced`, `dirt-biased`, `normal-poor`, `label-errors`) and three seeds
(`17`, `29`, `43`), each an independent model. Run the first job before launching
the others. All jobs use the same 2,400-image count, architecture, epochs,
optimizer, batch size, and initialization seed schedule. Do not select a seed
because its demonstration looks better.

Evaluate the balanced model first for each seed, then that seed's other recipes.
All four use the score threshold selected for the balanced model on **tuning**
images. The per-recipe optimum is also recorded for transparency but does not
silently change the threshold when comparing training interventions.

After all 12 development evaluations:

```sh
python scripts/ai-visual-inspection/reference.py
python scripts/ai-visual-inspection/test_processing.py
node tests/unit/ai-visual-inspection.cjs
python scripts/ai-visual-inspection/gate.py
python scripts/ai-visual-inspection/report.py
```

The command gate produces a scientific pass/fail record; `passed: false` is not
a software exception and must not be disguised by relaxing criteria. It requires
each training intervention's expected error increase on at least two images in
**each of three seeds**, baseline defect IoU >= 0.25, simple-rule error rates <=
5%, no patterned near-duplicate pairs, and models under 1MB. Localization must
also be reviewed by defect type: an aggregate IoU can hide failure on scratches.

`reference.py` generates the committed independent SciPy fixture. The JavaScript
test consumes that fixture; it does not require Python or installed ML packages.

`evaluate.py --split final` is locked until this gate passes. Do not open it for
the current unsuccessful experiment. Final scores must never drive another
training or threshold decision. Once a final set is used to make changes, retire
it into development and version a new final set.

Outputs stay in `.cache/ai-visual-inspection`, which is ignored by Git and not
served by Next.js. Training image corruption is recorded separately from true
defect presence; evaluation targets are immutable. Raw source arrays are uint8;
brightness is rounded and clipped before conversion to float32 / 255. Model
inputs contain only pixels, never ground truth or generation metadata.

The model is a supervised segmenter. Its sigmoid output is an uncalibrated defect
score, not an accuracy or a guarantee. A UI must say it switches **previously
trained** models. Generated images do not simulate an actual optical system.

All images are generated from code. No external dataset or pretrained weights
are used. Dependency licenses must accompany any distributed runtime. See
`docs/ai-visual-inspection-spec.md` for the planned experience and release gate.

## Web runtime assets (2026-09-22)

After the offline gate, export the frozen seed-17 models and development references:

```sh
/private/tmp/mc-visual-inspection-venv/bin/python scripts/ai-visual-inspection/export_web.py
node scripts/ai-visual-inspection/sync_web.cjs
node tests/unit/ai-visual-inspection-client.cjs
node tests/unit/ai-visual-inspection-runtime.cjs
node tests/unit/ai-visual-inspection-wasm.cjs
```

Use Node 22. The last test runs real WASM under Node, not a browser benchmark,
and is capped at 175 seconds. Its initial run failed strict score range validation.
After identifying endpoint roundoff, normalization bounded by 2^-23 was added;
all 12 conditions now pass pixel/rule/AI mask parity with score error below 1e-4.
`diagnose_wasm.cjs` records raw model outputs without treating them as a passing gate. See `docs/ai-visual-inspection-web-runtime.md`.
Do not repeat a failed verification in the same turn with alternate settings.
The export copies only locked models into `public`; evaluation images and
Python reference scores remain in the ignored cache. The frozen experiment
scripts and final evaluation data are not modified by this stage.

## Lesson UI assets

`export_lesson.py` exports the first 24 development images and first 24 already-opened final images without inference-based selection. It also exports actual training-group representatives. Run it with the Python environment above, then run `sync_web.cjs`. Labels stay separate from worker inputs.

```sh
node tests/unit/ai-visual-inspection-lesson.cjs
node tests/unit/ai-visual-inspection-ui.cjs
```

These are data and simulated-hook/SSR checks, not browser interaction tests. See `docs/ai-visual-inspection-ui.md` for the unverified browser and release gates.

## Browser check

`node scripts/ai-visual-inspection/check_browser.cjs` starts and stops a Webpack dev server on port 3100, then drives Chromium. Use Node 22 and keep port 3100 free. The script is capped at 175 seconds. Its first ad-hoc run stopped at the reflection label lookup; the committed runner has only been syntax-checked. See `docs/ai-visual-inspection-browser-validation.md` before reporting results or rerunning.
