type DiagnosisStepNavigationProps = {
  currentIndex: number;
  currentLabel: string;
  total: number;
};

const phases = [
  { endAt: 4, label: "経験を整理" },
  { endAt: 8, label: "強みを確認" },
  { endAt: 12, label: "希望条件" },
];

export function DiagnosisStepNavigation({
  currentIndex,
  currentLabel,
  total,
}: DiagnosisStepNavigationProps) {
  const currentQuestion = currentIndex + 1;
  const remaining = Math.max(total - currentQuestion, 0);
  const progress = (currentQuestion / total) * 100;

  return (
    <section className="diagnosis-step-nav" aria-label="診断の進捗">
      <div className="diagnosis-step-nav__summary">
        <div>
          <span>Question {String(currentQuestion).padStart(2, "0")}</span>
          <strong>{currentLabel}</strong>
        </div>
        <p>
          {currentQuestion} / {total}
          <small>{remaining === 0 ? "最後の質問" : `残り${remaining}問`}</small>
        </p>
      </div>

      <div
        className="diagnosis-step-nav__bar"
        role="progressbar"
        aria-label={`全${total}問中${currentQuestion}問目`}
        aria-valuemax={total}
        aria-valuemin={1}
        aria-valuenow={currentQuestion}
      >
        <i style={{ width: `${progress}%` }} />
      </div>

      <ol className="diagnosis-step-nav__phases">
        {phases.map((phase, index) => {
          const startsAt = index === 0 ? 1 : phases[index - 1].endAt + 1;
          const isComplete = currentQuestion > phase.endAt;
          const isCurrent = currentQuestion >= startsAt && currentQuestion <= phase.endAt;
          const state = isComplete ? "complete" : isCurrent ? "current" : "upcoming";

          return (
            <li
              className={`diagnosis-step-nav__phase diagnosis-step-nav__phase--${state}`}
              key={phase.label}
              aria-current={isCurrent ? "step" : undefined}
            >
              <i aria-hidden="true">{isComplete ? "✓" : index + 1}</i>
              <span>{phase.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="diagnosis-step-nav__outcome">
        <span>診断後に分かること</span>
        <p>近い職種・想定年収・伸ばすスキル・Today Quest</p>
      </div>
    </section>
  );
}
