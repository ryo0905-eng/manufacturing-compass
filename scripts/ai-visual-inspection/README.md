# Visual inspection technical gate

No web route or published claims should be added until the experiment gate passes.
Python is an offline development dependency; it is not part of the Next.js build.

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
