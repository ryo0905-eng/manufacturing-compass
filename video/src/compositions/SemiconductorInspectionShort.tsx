import {AbsoluteFill, Easing, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {semiconductorInspectionManifest as manifest} from "../../manifests/semiconductor-inspection";
import {Checkpoint} from "../components/Checkpoint";
import {Chrome} from "../components/Chrome";
import {Scene} from "../components/Scene";
import {theme} from "../theme";

const BigTitle = ({children}: {children: React.ReactNode}) => (
  <div style={{fontSize: 76, lineHeight: 1.24, fontWeight: 780, letterSpacing: "-0.045em"}}>{children}</div>
);

const AudioTracks = () => {
  const {durationInFrames} = useVideoConfig();

  return (
    <>
      <Sequence from={12} layout="none">
        <Html5Audio
          name="Narration"
          src={staticFile(manifest.audio.narrationFile)}
          volume={1}
        />
      </Sequence>
      <Html5Audio
        name="Background music"
        src={staticFile(manifest.audio.bgmFile)}
        volume={(frame) => interpolate(
          frame,
          [0, 30, durationInFrames - 75, durationInFrames],
          [0, 0.28, 0.28, 0],
          {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
        )}
      />
    </>
  );
};

const Wafer = ({scan = false}: {scan?: boolean}) => {
  const frame = useCurrentFrame();
  const scanX = interpolate(frame % 100, [0, 100], [70, 430], {easing: Easing.inOut(Easing.ease)});
  const defects = [
    {left: 178, top: 142, size: 18},
    {left: 305, top: 228, size: 13},
    {left: 230, top: 340, size: 20},
    {left: 380, top: 318, size: 12},
  ];

  return (
    <div style={{position: "relative", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle at 35% 28%, #ffffff 0 8%, #e9edf1 34%, #cbd4dc 74%, #aeb9c3 100%)`, border: `4px solid ${theme.borderStrong}`, overflow: "hidden"}}>
      {Array.from({length: 7}).map((_, index) => (
        <div key={`v-${index}`} style={{position: "absolute", left: 72 + index * 58, top: 54, width: 2, height: 392, backgroundColor: "rgba(76,114,176,0.17)"}} />
      ))}
      {Array.from({length: 7}).map((_, index) => (
        <div key={`h-${index}`} style={{position: "absolute", top: 72 + index * 58, left: 54, height: 2, width: 392, backgroundColor: "rgba(76,114,176,0.17)"}} />
      ))}
      {defects.map((defect, index) => (
        <div key={index} style={{position: "absolute", left: defect.left, top: defect.top, width: defect.size, height: defect.size, borderRadius: "50%", backgroundColor: theme.warning, boxShadow: `0 0 0 8px rgba(155,107,38,0.14)`}} />
      ))}
      {scan ? <div style={{position: "absolute", left: scanX, top: 42, bottom: 42, width: 5, backgroundColor: theme.action, boxShadow: "0 0 24px rgba(23,105,170,0.65)"}} /> : null}
    </div>
  );
};

const ProcessRail = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [210, 330], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const steps = ["成膜", "パターン形成", "加工", "計測・検査", "次工程"];

  return (
    <div style={{marginTop: 100, position: "relative", paddingTop: 54}}>
      <div style={{position: "absolute", top: 86, left: 48, right: 48, height: 6, backgroundColor: theme.border}} />
      <div style={{position: "absolute", top: 86, left: 48, width: `calc((100% - 96px) * ${fill / 100})`, height: 6, backgroundColor: theme.chart}} />
      <div style={{display: "flex", justifyContent: "space-between", position: "relative"}}>
        {steps.map((step, index) => (
          <div key={step} style={{width: 150, textAlign: "center"}}>
            <div style={{margin: "0 auto 22px", width: index === 3 ? 72 : 60, height: index === 3 ? 72 : 60, borderRadius: 999, backgroundColor: index === 3 ? theme.action : theme.surface, border: `4px solid ${index === 3 ? theme.action : theme.borderStrong}`, color: index === 3 ? "white" : theme.text, display: "grid", placeItems: "center", fontSize: 25, fontWeight: 800}}>{index + 1}</div>
            <div style={{fontSize: 24, lineHeight: 1.35, fontWeight: index === 3 ? 750 : 550, color: index === 3 ? theme.action : theme.muted}}>{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeedbackLoop = () => {
  const frame = useCurrentFrame();
  const dash = interpolate(frame % 90, [0, 90], [0, -120]);

  return (
    <div style={{marginTop: 72, position: "relative", height: 610}}>
      <svg width="936" height="520" viewBox="0 0 936 520" style={{position: "absolute", inset: 0}}>
        <path d="M175 120 H760 Q835 120 835 195 V330 Q835 405 760 405 H230 Q150 405 150 330 V275" fill="none" stroke={theme.border} strokeWidth="22" strokeLinecap="round" />
        <path d="M175 120 H760 Q835 120 835 195 V330 Q835 405 760 405 H230 Q150 405 150 330 V275" fill="none" stroke={theme.chart} strokeWidth="8" strokeLinecap="round" strokeDasharray="30 24" strokeDashoffset={dash} />
        <path d="M116 292 L150 244 L184 292" fill={theme.chart} />
      </svg>
      <div style={{position: "absolute", left: 40, top: 50, width: 270, padding: 26, backgroundColor: theme.surface, border: `2px solid ${theme.border}`, borderRadius: 14, fontSize: 29, fontWeight: 700, textAlign: "center"}}>工程・装置条件</div>
      <div style={{position: "absolute", right: 22, top: 50, width: 270, padding: 26, backgroundColor: theme.selected, border: `2px solid ${theme.chart}`, borderRadius: 14, fontSize: 29, fontWeight: 700, textAlign: "center"}}>測定・検査</div>
      <div style={{position: "absolute", left: 275, top: 340, width: 390, padding: 26, backgroundColor: theme.surface, border: `2px solid ${theme.border}`, borderRadius: 14, fontSize: 29, fontWeight: 700, textAlign: "center"}}>結果を工程管理へ返す</div>
    </div>
  );
};

export const SemiconductorInspectionShort = () => (
  <Chrome>
    <AudioTracks />
    <AbsoluteFill>
      <Scene start={0} end={204} style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <div style={{fontSize: 25, color: theme.action, fontWeight: 750, letterSpacing: "0.12em", marginBottom: 34}}>QUESTION</div>
        <BigTitle>
          {manifest.hook[0]}<br />
          <span style={{fontSize: 112}}>{manifest.hook[1]}</span>
        </BigTitle>
        <div style={{marginTop: 80, display: "flex", alignItems: "center", gap: 30}}>
          <Wafer />
          <div style={{fontSize: 116, fontWeight: 300, color: theme.borderStrong}}>?</div>
        </div>
      </Scene>

      <Scene start={192} end={366} style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <div style={{fontSize: 25, color: theme.action, fontWeight: 750, letterSpacing: "0.12em", marginBottom: 28}}>ANSWER</div>
        <BigTitle>
          工程の途中に<br />
          <span style={{color: theme.action}}>何度も入ります</span>
        </BigTitle>
        <ProcessRail />
      </Scene>

      <Scene start={348} end={606}>
        <div style={{fontSize: 25, color: theme.action, fontWeight: 750, letterSpacing: "0.12em", marginTop: 54, marginBottom: 28}}>01 / METROLOGY</div>
        <BigTitle>狙った値になったか測る</BigTitle>
        <div style={{marginTop: 70, display: "grid", gap: 28}}>
          <Checkpoint number="A" label="DIMENSION" title="寸法">線幅や形状を測る</Checkpoint>
          <Checkpoint number="B" label="THICKNESS" title="膜厚">必要な厚さになったか測る</Checkpoint>
          <Checkpoint number="C" label="OVERLAY" title="位置合わせ">前の層とのずれを測る</Checkpoint>
        </div>
      </Scene>

      <Scene start={588} end={774}>
        <div style={{fontSize: 25, color: theme.warning, fontWeight: 750, letterSpacing: "0.12em", marginTop: 36, marginBottom: 28}}>02 / INSPECTION</div>
        <BigTitle>欠陥の候補を見つける</BigTitle>
        <div style={{marginTop: 55, display: "grid", justifyItems: "center"}}>
          <Wafer scan />
          <div style={{marginTop: 55, display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center"}}>
            {["粒子", "パターン異常", "表面欠陥"].map((item) => (
              <div key={item} style={{padding: "18px 28px", borderRadius: 999, border: `2px solid ${theme.border}`, backgroundColor: theme.surface, fontSize: 27, fontWeight: 650}}>{item}</div>
            ))}
          </div>
        </div>
      </Scene>

      <Scene start={756} end={1032}>
        <div style={{fontSize: 25, color: theme.action, fontWeight: 750, letterSpacing: "0.12em", marginTop: 56, marginBottom: 28}}>03 / FEEDBACK</div>
        <BigTitle>結果を工程へ戻す</BigTitle>
        <div style={{fontSize: 31, lineHeight: 1.6, color: theme.muted, marginTop: 32}}>測定・検査データを装置条件や工程管理へ返し、変動を追います。</div>
        <FeedbackLoop />
      </Scene>

      <Scene start={1008} end={1212} style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <div style={{fontSize: 25, color: theme.warning, fontWeight: 750, letterSpacing: "0.12em", marginBottom: 34}}>WHY IT MATTERS</div>
        <BigTitle>
          完成後に分けるだけでは、<br />
          <span style={{color: theme.warning}}>どの工程で変化したか</span><br />
          追いにくい。
        </BigTitle>
        <div style={{marginTop: 78, height: 6, width: 180, backgroundColor: theme.warning}} />
      </Scene>

      <Scene start={1188} end={1395} style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center"}}>
        <div style={{fontSize: 25, color: theme.action, fontWeight: 750, letterSpacing: "0.12em", marginBottom: 34}}>CONTINUE LEARNING</div>
        <BigTitle>
          {manifest.cta[0]}<br />
          <span style={{color: theme.action}}>{manifest.cta[1]}</span>
        </BigTitle>
        <div style={{marginTop: 72, padding: "24px 38px", borderRadius: 10, backgroundColor: theme.text, color: "white", fontSize: 28, fontWeight: 700}}>「半導体の製造工程」で確認</div>
      </Scene>
    </AbsoluteFill>
  </Chrome>
);
