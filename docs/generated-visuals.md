# 生成イラストの記録

作成日: 2026-10-16

## 用途と取り扱い

- 内蔵の `image_gen` ツールで生成した装飾用のコンセプトイラスト。実在企業の設備写真、製品仕様、工程図、測定結果として扱わない。
- 記事タイトル・職務群ラベルはHTMLで表示し、画像の代替テキストは空にする。本文の技術図や既存の計算・選択ロジックは変更しない。
- 元画像は各1536×1024pxのPNG。`next/image`で表示サイズに応じて配信し、今回追加した画像は遅延読み込みを使う。
- 生成結果はエージェントが目視確認。ブラウザ・実端末での表示確認は未実施。

## 保存先

| 用途 | ファイル |
| --- | --- |
| 記事：半導体製造工程 | `public/images/guides/semiconductor-manufacturing-process.png` |
| 記事：半導体製造装置メーカー | `public/images/guides/semiconductor-equipment-manufacturers.png` |
| 記事：半導体への転職準備 | `public/images/guides/semiconductor-career-start.png` |
| トップ：企業・業界研究 | `public/images/home/semiconductor-industry.png` |
| 職種マップ：工程・歩留まり | `public/images/roles/process.png` |
| 職種マップ：生産性 | `public/images/roles/productivity.png` |
| 職種マップ：設備・制御 | `public/images/roles/equipment.png` |
| 職種マップ：品質・顧客支援・データ | `public/images/roles/quality.png` |

## 最終生成・編集プロンプト

各画像に使用したプロンプト。装置メーカー記事用は、初回生成画像に入った人物を取り除く編集を行い、修正後の画像のみを保存した。

### 記事：半導体製造工程

```text
Use case: stylized-concept.
Asset type: wide 3:2 editorial thumbnail illustration for a Japanese semiconductor education and career website.
Style: premium minimalist product-style 3D still life. Pure white studio background and outer edges, neutral silver, matte white and small graphite details, soft diffuse illumination, precise surfaces, very subtle short shadows, no strong reflections. A calm, professional family matching a silver silicon wafer on a white background. The subjects must remain fully within the frame with generous white margins. An editorial concept, not an actual company's facility or an engineering diagram.
Constraints: no words, letters, digits, captions, logos, brands, arrows, graphs, people, neon, glow, gradients, dramatic rainbow reflections or watermark. No instructional or measured technical claims.
Subject: a single neutral-silver patterned silicon wafer on the left, and three individual finished square semiconductor packages neatly arranged beside it on the right. Oblique tabletop viewpoint. Convey the broad idea from wafer to chip without depicting manufacturing stages, arrows or a process diagram. Balanced composition, the wafer is the main focus.
```

### 記事：半導体製造装置メーカー

```text
Edit the supplied conceptual wafer-processing machine illustration. Remove all three people completely, and replace their entire area with the same pure white studio background. The final image must depict ONLY the existing generic silver and matte-white semiconductor processing machine with its wafer carrier. Center this standalone machine in the landscape composition with generous white margins on all sides. Preserve its chamber, surfaces, lighting and style. This is an editorial concept image, not an actual company's facility. Absolutely no people, body parts, silhouettes, words, logos, marks, graphs, scenery, furniture or additional objects.
```

### 記事：半導体への転職準備

```text
Use case: stylized-concept.
Asset type: wide 3:2 editorial thumbnail illustration for a Japanese semiconductor education and career website.
Style: premium minimalist product-style 3D still life. Pure white studio background and outer edges, neutral silver, matte white and small graphite details, soft diffuse illumination, precise surfaces, very subtle short shadows, no strong reflections. A calm, professional family matching a silver silicon wafer on a white background. The subjects must remain fully within the frame with generous white margins. An editorial concept, not an actual company's facility or an engineering diagram.
Constraints: no words, letters, digits, captions, logos, brands, arrows, graphs, people, neon, glow, gradients, dramatic rainbow reflections or watermark. No instructional or measured technical claims.
Subject: a neatly open blank cream-white notebook and a simple silver pen, alongside one small patterned silicon wafer and a graphite semiconductor package. Overhead oblique desk still life. The notebook and pen are the primary subjects, suggesting thoughtfully organizing work experience and next steps. Both notebook pages completely blank. No people or hands, no text, checkmarks, charts or currency.
```

### トップ：企業・業界研究

```text
Use case: stylized-concept.
Asset type: wide 3:2 editorial thumbnail illustration for a Japanese semiconductor education and career website.
Style: premium minimalist product-style 3D still life. Pure white studio background and outer edges, neutral silver, matte white and small graphite details, soft diffuse illumination, precise surfaces, very subtle short shadows, no strong reflections. Match the calm, professional visual style of a silver silicon wafer on a white background. The subjects must remain fully within the frame with generous white margins. An editorial concept, not an actual company's facility or an engineering diagram.
Constraints: no words, letters, digits, captions, logos, brands, arrows, graphs, people, neon, glow, gradients, dramatic rainbow reflections or watermark. No instructional or measured technical claims.
Subject: a precise miniature still life with three separate objects arranged in a compact balanced group: one generic white wafer processing cabinet with a circular silver chamber at the back, a silver patterned silicon wafer leaning on a small neutral stand to its left, and a single graphite semiconductor package in front. Oblique studio viewpoint. Convey the semiconductor industry's equipment, materials and devices without any real brand identity. Not a process diagram, not actual relative sizes. No screens, graphs, people or props.
```

### 職種マップ：工程・歩留まり

```text
Use case: stylized-concept.
Asset type: wide 3:2 editorial thumbnail illustration for a Japanese semiconductor education and career website.
Style: premium minimalist product-style 3D still life. Pure white studio background and outer edges, neutral silver, matte white and small graphite details, soft diffuse illumination, precise surfaces, very subtle short shadows, no strong reflections. Match the calm, professional visual style of a silver silicon wafer on a white background. The subjects must remain fully within the frame with generous white margins. An editorial concept, not an actual company's facility or an engineering diagram.
Constraints: no words, letters, digits, captions, logos, brands, arrows, graphs, people, neon, glow, gradients, dramatic rainbow reflections or watermark. No instructional or measured technical claims.
Subject: a small silver patterned silicon wafer on a low white sample holder, with three small round specimen discs neatly arranged in a sample tray beside it, and a simple precision adjustment dial behind them. Compact tabletop composition. Suggest comparing manufacturing conditions and samples. Distinct focus on samples and their adjustment. No numbers or markings on the dial, no graph, no wrench, no microscope or people.
```

### 職種マップ：生産性

```text
Use case: stylized-concept.
Asset type: wide 3:2 editorial thumbnail illustration for a Japanese semiconductor education and career website.
Style: premium minimalist product-style 3D still life. Pure white studio background and outer edges, neutral silver, matte white and small graphite details, soft diffuse illumination, precise surfaces, very subtle short shadows, no strong reflections. Match the calm, professional visual style of a silver silicon wafer on a white background. The subjects must remain fully within the frame with generous white margins. An editorial concept, not an actual company's facility or an engineering diagram.
Constraints: no words, letters, digits, captions, logos, brands, arrows, graphs, people, neon, glow, gradients, dramatic rainbow reflections or watermark. No instructional or measured technical claims.
Subject: an isometric miniature production line with three neatly aligned compact matte-white processing modules linked by one short silver carrier track, with a few simple wafer carriers on the track. Compact standalone tabletop model with clearly spaced modules. Suggest smooth production flow and capacity planning. No arrows, charts, numbers, labels, screens, people or factory environment.
```

### 職種マップ：設備・制御

```text
Use case: stylized-concept.
Asset type: wide 3:2 editorial thumbnail illustration for a Japanese semiconductor education and career website.
Style: premium minimalist product-style 3D still life. Pure white studio background and outer edges, neutral silver, matte white and small graphite details, soft diffuse illumination, precise surfaces, very subtle short shadows, no strong reflections. Match the calm, professional visual style of a silver silicon wafer on a white background. The subjects must remain fully within the frame with generous white margins. An editorial concept, not an actual company's facility or an engineering diagram.
Constraints: no words, letters, digits, captions, logos, brands, arrows, graphs, people, neon, glow, gradients, dramatic rainbow reflections or watermark. No instructional or measured technical claims.
Subject: a single small generic matte-white equipment cabinet with one open service panel exposing a few neatly arranged silver mechanical modules. A silver wrench and a compact screwdriver lie neatly in front, not touching the circuitry. Standalone equipment maintenance still life at a three-quarter angle. No labels, brands, display text, dials with numbers, hands, people or sparks.
```

### 職種マップ：品質・顧客支援・データ

```text
Use case: stylized-concept.
Asset type: wide 3:2 editorial thumbnail illustration for a Japanese semiconductor education and career website.
Style: premium minimalist product-style 3D still life. Pure white studio background and outer edges, neutral silver, matte white and small graphite details, soft diffuse illumination, precise surfaces, very subtle short shadows, no strong reflections. Match the calm, professional visual style of a silver silicon wafer on a white background. The subjects must remain fully within the frame with generous white margins. An editorial concept, not an actual company's facility or an engineering diagram.
Constraints: no words, letters, digits, captions, logos, brands, arrows, graphs, people, neon, glow, gradients, dramatic rainbow reflections or watermark. No instructional or measured technical claims.
Subject: a precision inspection microscope in matte white and silver with a single small square graphite semiconductor package on its clean sample stage, plus two other small packages in a white specimen tray beside it. Compact balanced tabletop still life, unmistakable microscope silhouette. Suggest inspection and quality analysis. No labels, graphs, documents, people, numbers, logos or measurement claims.
```

