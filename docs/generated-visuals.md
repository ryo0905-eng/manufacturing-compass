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

## 業界地図・企業一覧の改善（2026-10-16）

### 画像とロゴ

- 業界地図の8領域は72×48px、企業一覧の6分類は96×64pxの装飾画像を表示する。領域名、説明、社数はHTMLのまま保持する。
- 既存画像は、ファウンドリに `public/images/home/semiconductor-hero.png`、IDMに `public/images/guides/semiconductor-manufacturing-process.png`、製造装置に `public/images/guides/semiconductor-equipment-manufacturers.png`、検査・計測に `public/images/roles/quality.png` を再利用する。メモリの製品分類とIDMの事業モデルは別の画像・分類として保持する。
- 新規5枚は内蔵の `image_gen` で生成した各1536×1024pxのコンセプトイラスト。目視で人物・文字・ロゴがないことを確認した。実在製品や正確な工程図を示す画像ではない。
- 企業一覧のロゴは `public/images/company-logos/README.md` に出典を記録した既存26社の資産を使う。企業IDと画像・比率の対応は `src/data/company-logos.ts` に独立管理し、SCREENは `screen` → `screen-holdings.png` とする。
- 未収録11社（Skyworks、キオクシア、ソシオネクスト、GlobalFoundries、Teradyne、onsemi、Marvell、Qorvo、日立ハイテク、ニコン、キヤノン）と画像読込失敗時は中立色のイニシャルを表示する。会社名の文字表示は維持する。
- ロゴ枠はPC112×40px、720px以下88×32px。元画像と色を変更せず、正方形PNG内の透過余白を考慮して表示する。ロゴ追加は企業一覧に限定し、ランキング表示部は変更しない。

| 新規画像 | 保存先 |
| --- | --- |
| EDA・IP | `public/images/industry/eda-ip.png` |
| ファブレス | `public/images/industry/fabless.png` |
| OSAT・後工程 | `public/images/industry/osat.png` |
| 材料 | `public/images/industry/materials.png` |
| メモリ | `public/images/industry/memory.png` |

### 検索導線と公開後の計測

- 企業一覧の紹介文直後から `#company-search` へ移動できる。移動先はフォーカス可能とし、固定ヘッダーを避ける88pxのスクロール余白を確保する。検索セクションの順序、初期検索語、フィルターと結果件数は維持する。
- UI版は `directory-visuals-v1`。`companies_search_jump` は `placement: hero` とUI版を送り、`companies_company_open` は `placement: company_card`・企業ID・UI版を送る。検索語などの自由入力は送信しない。既存のAnalytics経路を利用する。
- 本番反映日をDとし、既存の絞り込み利用はD−14〜D−1とD〜D＋13を端末別に比較する。`/companies` のページビューを分母に、同じ集計単位で利用傾向を確認する。
- 新設2イベントには過去データがないため、最初の公開後14日間を基準値とする。公開前をゼロとみなした増加率は算出しない。クリックイベント数÷ページビューは1訪問あたりのクリック頻度として扱い、利用者単位の転換率と混同しない。
- 公開・計測結果の評価は未実施。ブラウザ・実端末での表示確認は未実施。画像追加の効果を検証済みとは扱わない。

### 新規画像の最終生成プロンプト

#### EDA・IP

```text
Use case: stylized-concept.
Asset type: wide 3:2 decorative editorial illustration for a semiconductor industry directory. It will appear at only 72x48 or 96x64 pixels, so use a simple recognizable silhouette and two or three large objects, no tiny details.
Style: restrained premium product-style 3D still life; pure white background and outer edges, matte white and neutral silver surfaces with small graphite details, soft diffuse studio light and very subtle shadows. Match the existing silver-wafer illustrations on a clean white website. Keep the subjects entirely within the frame with generous white margins.
Constraints: editorial concept only, not a technical schematic or an actual company's product. No text, letters, digits, logos, brands, watermarks, arrows, charts, people, hands, plants, glow, gradients or dramatic reflections. No numeric or technical claims.
Subject: a single simple silver desktop design monitor showing three large unlabelled rectangular circuit blocks on a blank pale screen, with one small graphite processor block beside its stand. Focus on design software and reusable circuit blocks. No complex wiring, graphs, keyboard, labels, menus, text or extra props.
```

#### ファブレス

```text
Use case: stylized-concept.
Asset type: wide 3:2 decorative editorial illustration for a semiconductor industry directory. It will appear at only 72x48 or 96x64 pixels, so use a simple recognizable silhouette and two or three large objects, no tiny details.
Style: restrained premium product-style 3D still life; pure white background and outer edges, matte white and neutral silver surfaces with small graphite details, soft diffuse studio light and very subtle shadows. Match the existing silver-wafer illustrations on a clean white website. Keep the subjects entirely within the frame with generous white margins.
Constraints: editorial concept only, not a technical schematic or an actual company's product. No text, letters, digits, logos, brands, watermarks, arrows, charts, people, hands, plants, glow, gradients or dramatic reflections. No numeric or technical claims.
Subject: a clean slightly curled white design sheet with a few large simple embossed silver rectangular blocks, one precise silver drawing pen and a single graphite semiconductor chip beside the sheet. Focus on planning and chip design. No monitor, factory, wafer, handwritten marks, text, dimensions, measurement scales or true circuit schematic.
```

#### OSAT・後工程

```text
Use case: stylized-concept.
Asset type: wide 3:2 decorative editorial illustration for a semiconductor industry directory. It will appear at only 72x48 or 96x64 pixels, so use a simple recognizable silhouette and two or three large objects, no tiny details.
Style: restrained premium product-style 3D still life; pure white background and outer edges, matte white and neutral silver surfaces with small graphite details, soft diffuse studio light and very subtle shadows. Match the existing silver-wafer illustrations on a clean white website. Keep the subjects entirely within the frame with generous white margins.
Constraints: editorial concept only, not a technical schematic or an actual company's product. No text, letters, digits, logos, brands, watermarks, arrows, charts, people, hands, plants, glow, gradients or dramatic reflections. No numeric or technical claims.
Subject: a large square graphite semiconductor package above a small neutral silver circuit substrate, and a second finished package beside them. Simple exploded product-like arrangement with a visible gap to suggest packaging and assembly. No exposed complex internal connections or manufacturing instructions. No wafer, workstation, labels, text, pins with unrealistic tangles or extra props.
```

#### 材料

```text
Use case: stylized-concept.
Asset type: wide 3:2 decorative editorial illustration for a semiconductor industry directory. It will appear at only 72x48 or 96x64 pixels, so use a simple recognizable silhouette and two or three large objects, no tiny details.
Style: restrained premium product-style 3D still life; pure white background and outer edges, matte white and neutral silver surfaces with small graphite details, soft diffuse studio light and very subtle shadows. Match the existing silver-wafer illustrations on a clean white website. Keep the subjects entirely within the frame with generous white margins.
Constraints: editorial concept only, not a technical schematic or an actual company's product. No text, letters, digits, logos, brands, watermarks, arrows, charts, people, hands, plants, glow, gradients or dramatic reflections. No numeric or technical claims.
Subject: two smooth blank circular silver silicon wafers, one leaning gently behind the other, beside a plain closed matte-white industrial materials container. A compact balanced tabletop still life. The wafers have smooth unpatterned surfaces to suggest raw materials, no die grid. No hazard markings, labels, liquid, glass beakers, text or people.
```

#### メモリ

```text
Use case: stylized-concept.
Asset type: wide 3:2 decorative editorial illustration for a semiconductor industry directory. It will appear at only 72x48 or 96x64 pixels, so use a simple recognizable silhouette and two or three large objects, no tiny details.
Style: restrained premium product-style 3D still life; pure white background and outer edges, matte white and neutral silver surfaces with small graphite details, soft diffuse studio light and very subtle shadows. Match the existing silver-wafer illustrations on a clean white website. Keep the subjects entirely within the frame with generous white margins.
Constraints: editorial concept only, not a technical schematic or an actual company's product. No text, letters, digits, logos, brands, watermarks, arrows, charts, people, hands, plants, glow, gradients or dramatic reflections. No numeric or technical claims.
Subject: one simple graphite memory module board on a small white stand, with a row of four large unlabelled black rectangular memory packages and a neutral-silver edge connector. A second individual memory package lies in front. Strong recognizable memory-module silhouette, restrained oblique angle. No rainbow light, gold accents, fan, computer case, heatsink, labels, text or logos.
```

