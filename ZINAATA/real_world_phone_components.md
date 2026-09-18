# Real-World Android Phone Components Catalog

Companion file to `component_vocabulary.py`. That file has the coarse
component-TYPE buckets (soc_processor, battery, accelerometer, ...). This
file is the specific, named, real-world parts market that fills those
buckets — actual chip/part model numbers found in real teardowns, spec
sheets, and vendor datasheets across the Android market (flagship,
midrange, and budget tiers), 2018-2026 era with emphasis on 2022-2026.

Not all entries are independently teardown-confirmed to chip-marking
precision; where a datasheet/press-release/GSMArena spec-sheet source was
used instead of a physical teardown photo, treat the model number as
"vendor-published, market-deployed" rather than "seen under a
microscope." Sourcing is noted at the bottom.

---

## 1. SoCs / Chipsets

### Qualcomm Snapdragon — Flagship (8-series)
- **Snapdragon 8 Elite Gen 5** — Qualcomm — 2026 flagships (Galaxy S26 series, Xiaomi 17 series) — successor to 8 Elite, all-new Oryon v3 cores
- **Snapdragon 8 Elite** (SM8750) — Qualcomm — Galaxy S25 series, OnePlus 13, Xiaomi 15 series, iQOO 13, RedMagic 10 Pro — 3nm (TSMC N3E), custom Oryon cores, announced Oct 2024
- **Snapdragon 8 Gen 3** (SM8650) — Qualcomm — Galaxy S24 Ultra, OnePlus 12, Xiaomi 14 series, iQOO 12, ASUS ROG Phone 8, RedMagic 9 Pro, Sony Xperia 1 VI — 4nm, Cortex-X4 prime core
- **Snapdragon 8 Gen 3 for Galaxy** — Qualcomm/Samsung — Galaxy S24/S24+/S24 Ultra (global) — binned/overclocked variant
- **Snapdragon 8 Gen 2** (SM8550) — Qualcomm — Galaxy S23 series, OnePlus 11, Xiaomi 13 series, ASUS Zenfone 10 — 4nm TSMC, Cortex-X3 prime
- **Snapdragon 8 Gen 2 for Galaxy** — Qualcomm/Samsung — Galaxy S23 series (global variant) — ~5-6% higher clocks than standard Gen 2, also found in RedMagic 8S Pro
- **Snapdragon 8 Gen 1** (SM8450) — Qualcomm — Galaxy S22 series (US/some markets), Xiaomi 12 series, Motorola Edge 30 Ultra — 4nm Samsung foundry
- **Snapdragon 8+ Gen 1** (SM8475) — Qualcomm — ASUS Zenfone 9, Nothing Phone (2), OnePlus 10T, Xiaomi 12T Pro — TSMC 4nm re-spin of 8 Gen 1
- **Snapdragon 888 / 888+** — Qualcomm — Galaxy S21 series, Xiaomi Mi 11, OnePlus 9 series — 5nm Samsung foundry
- **Snapdragon 865 / 865+** — Qualcomm — Galaxy S20 series, OnePlus 8/8 Pro — 7nm
- **Snapdragon 8s Gen 3** — Qualcomm — iQOO Neo 10R, Realme GT 6T, Redmi Turbo 3 — mid-flagship derivative, early 2025
- **Snapdragon 855 / 855+** — Qualcomm — Galaxy S10 series, OnePlus 7 Pro, Xiaomi Mi 9 — 7nm, legacy flagship
- **Snapdragon 845** — Qualcomm — Galaxy S9 series, OnePlus 6 — 10nm, legacy flagship
- **Snapdragon 835** — Qualcomm — Galaxy S8 series, Google Pixel 2 — 10nm Samsung foundry, legacy flagship

### Qualcomm Snapdragon — Upper-mid (7-series)
- **Snapdragon 7+ Gen 3** — Qualcomm — Redmi K70E, iQOO Neo 9S, POCO F6 — near-flagship, 4nm TSMC
- **Snapdragon 7 Gen 3** — Qualcomm — mid-range 2024 devices — Cortex-A715/A510 mix
- **Snapdragon 7s Gen 3** — Qualcomm — Redmi Note 13 Turbo variants — 4nm
- **Snapdragon 7+ Gen 2** — Qualcomm — POCO F5 Pro, iQOO Neo 7 Pro, Redmi K60 — TSMC 4nm
- **Snapdragon 7 Gen 1** — Qualcomm — Redmi Note 12 Turbo, Moto Edge 40 — 4nm
- **Snapdragon 7s Gen 2** — Qualcomm — Redmi Note 13 Pro 5G — 4nm
- **Snapdragon 782G** — Qualcomm — Redmi Note 12 Pro+, POCO X5 Pro — 6nm
- **Snapdragon 778G / 778G+** — Qualcomm — Galaxy A53, Motorola Edge 20, Xiaomi 11 Lite 5G NE — 6nm
- **Snapdragon 765G / 765** — Qualcomm — Google Pixel 5, Pixel 4a 5G, LG Velvet — 7nm, first integrated 5G Snapdragon
- **Snapdragon 730 / 730G** — Qualcomm — Redmi K20 Pro/Pocophone (some SKUs), Google Pixel 4a — 8nm, legacy upper-midrange gaming variant
- **Snapdragon 675 / 670** — Qualcomm — Redmi Note 7 Pro, Redmi K20 — 11nm, legacy upper-midrange

### Qualcomm Snapdragon — Midrange (6-series)
- **Snapdragon 6 Gen 3** — Qualcomm — Redmi Note 13 Pro, Moto Edge 50 Fusion — 4nm
- **Snapdragon 6 Gen 1** — Qualcomm — POCO X5, Redmi Note 12 5G — 4nm
- **Snapdragon 6s Gen 3** — Qualcomm — 2025 budget-mid devices — 144Hz display support
- **Snapdragon 690 5G** — Qualcomm — Pixel 6a, Moto G 5G Plus — 8nm, first 6-series with integrated 5G
- **Snapdragon 695 5G** (SM6375) — Qualcomm — Redmi Note 11 Pro 5G, POCO X5, Realme 10 Pro 5G, Moto Edge 30 — 6nm, very widely deployed sub-$300 chip

### Qualcomm Snapdragon — Budget (4-series)
- **Snapdragon 4 Gen 2** — Qualcomm — Redmi 13C 5G, POCO C65 5G — 4nm, 2x Cortex-A78 + 6x Cortex-A55
- **Snapdragon 4 Gen 1** — Qualcomm — Galaxy A14 5G, Redmi Note 12 — 6nm
- **Snapdragon 480 / 480+ 5G** — Qualcomm — Galaxy A22 5G, Moto G 5G (2021), Nokia X20 — 8nm, first sub-$200 5G chip
- **Snapdragon 460 / 662 / 665** — Qualcomm — older Galaxy A-series, Redmi 9 series — 11nm, LTE only

### MediaTek Dimensity — Flagship (9000-series)
- **Dimensity 9400+** — MediaTek — Vivo X200 Pro variants, Redmi Turbo 4 Pro — 3nm 2nd-gen, all-big-core
- **Dimensity 9400** — MediaTek — Vivo X200 series, Oppo Find X8 series — TSMC 3nm, all-big-core Cortex-X925/A725
- **Dimensity 9300+** — MediaTek — Redmi K70 Ultra, iQOO Neo 9S Pro+ — launched May 2024
- **Dimensity 9300** — MediaTek — Vivo X100 series (first globally), Oppo Find X7 series — 4nm all-big-core design, no efficiency-only cores
- **Dimensity 9200+ / 9200** — MediaTek — Vivo X90 Pro, Redmi K60 Pro, iQOO 11 — TSMC 4nm

### MediaTek Dimensity — Premium (8000-series)
- **Dimensity 8400** — MediaTek — 2025 premium mid-range — all-big-core design brought down-tier
- **Dimensity 8300 / 8300 Ultra** — MediaTek — Redmi Note 13 Pro+, POCO X6 Pro — 4nm
- **Dimensity 8200 / 8200 Ultra** — MediaTek — Redmi Note 12 Turbo, iQOO Neo 7 — 4nm TSMC
- **Dimensity 8100 / 8100 Max** — MediaTek — Redmi K50, iQOO Neo 6 — TSMC 5nm

### MediaTek Dimensity — Midrange (7000-series)
- **Dimensity 7400 / 7400X** — MediaTek — 2025 midrange — 4nm
- **Dimensity 7300 / 7300X** — MediaTek — Motorola Razr 50 (2024), Redmi Note 13 Pro 4G — 4nm ultra-efficient
- **Dimensity 7200 / 7200 Ultra** — MediaTek — Redmi Note 12 Turbo variants — 4nm TSMC
- **Dimensity 7050 / 7020** — MediaTek — Realme 11x, Redmi Note 12 5G — 6nm

### MediaTek Dimensity — Entry (6000/1000/900-series legacy)
- **Dimensity 6100+** — MediaTek — Redmi 13C 5G, Realme C67 5G — 6nm
- **Dimensity 6020** — MediaTek — Galaxy A15 5G, Galaxy A25 5G — 6nm
- **Dimensity 1200 / 1100** — MediaTek — Redmi Note 10 Pro (China), Realme GT Neo 2 — 6nm, legacy flagship-tier
- **Dimensity 1080** — MediaTek — Redmi Note 12 Pro+ (some markets) — 6nm
- **Dimensity 920 / 900** — MediaTek — Redmi Note 11 Pro+, Realme 9 Pro+ — 6nm

### MediaTek Helio — Budget
- **Helio G99 / G99 Ultra** — MediaTek — Redmi Note 12, POCO M6 Pro, Realme 10 — 6nm, extremely widely deployed budget chip
- **Helio G96** — MediaTek — Redmi Note 11S, Realme 9i — 12nm
- **Helio G88** — MediaTek — Redmi 10, Infinix Hot 12 — 12nm
- **Helio G85** — MediaTek — Redmi Note 9, Realme Narzo — 12nm
- **Helio G70** — MediaTek — Redmi 10A — 12nm
- **Helio G37 / G36** — MediaTek — Redmi A2, Infinix Smart series — 12nm entry
- **Helio A22** — MediaTek — Redmi 9A/9C, entry-level 4G — 12nm quad-core
- **Helio P35 / P22** — MediaTek — older Redmi/Realme entry devices — 12nm

### Samsung Exynos
- **Exynos 2400 / 2400e** — Samsung LSI — Galaxy S24, S24+, S24 FE (Europe/global outside US-China) — 4nm Samsung foundry, deca-core
- **Exynos 2200** — Samsung LSI — Galaxy S22 series (Europe) — 4nm, AMD RDNA2-based Xclipse 920 GPU
- **Exynos 2100** — Samsung LSI — Galaxy S21 series (global ex-US/China) — 5nm
- **Exynos 1380** — Samsung LSI — Galaxy A54, Galaxy A34 — 5nm midrange
- **Exynos 1330** — Samsung LSI — Galaxy A14 5G, Galaxy A05s region variants — 5nm entry
- **Exynos 1280** — Samsung LSI — Galaxy A53 5G (some regions), Galaxy A33 — 5nm
- **Exynos 850** — Samsung LSI — Galaxy A21s, Galaxy A03 — 8nm, LTE-only budget chip
- **Exynos 9820 / 9825** — Samsung LSI — Galaxy S10 series, Note 10 (Europe) — 8nm legacy
- **Exynos 990** — Samsung LSI — Galaxy S20 series, Note20 series (Europe/global ex-US) — 7nm, paired with external Exynos Modem 5123
- **Exynos 980** — Samsung LSI — Galaxy A90 5G, Vivo X30 — 8nm, Samsung's first integrated-5G Exynos
- **Exynos 9611** — Samsung LSI — Galaxy A51, Galaxy M31 — 10nm midrange

### Google Tensor
- **Tensor G5** — Google/TSMC — Pixel 10, Pixel 10 Pro, Pixel 10 Pro Fold — first Google TSMC-built Tensor, 3nm N3E, custom ISP
- **Tensor G4** — Google/Samsung Foundry — Pixel 9 series, Pixel 9a — 4nm Samsung
- **Tensor G3** — Google/Samsung Foundry — Pixel 8, Pixel 8 Pro, Pixel 8a — 4nm Samsung, Cortex-X3 prime
- **Tensor G2** — Google/Samsung Foundry — Pixel 7 series, Pixel 7a — 5nm
- **Tensor (G1)** — Google/Samsung Foundry — Pixel 6, Pixel 6 Pro, Pixel 6a — 5nm, first Tensor

### Unisoc / Spreadtrum
- **Unisoc T616** — Unisoc — Realme C31, Redmi 12C region variants — 12nm, rebadged as Tiger T7255
- **Unisoc T612** — Unisoc — Vivo Y03t, sub-$100 devices — 12nm
- **Unisoc T606** — Unisoc — Redmi 10C, Infinix Hot 11 — 12nm, rebadged as T7200
- **Unisoc T760** — Unisoc — mid budget 5G devices — 6nm
- **Unisoc T770** — Unisoc — Unisoc's top-end tier chip — 6nm
- **Unisoc T7250** — Unisoc — Tecno/Infinix budget devices — 6nm rebadge line
- **Unisoc SC9863A** — Unisoc/Spreadtrum — ultra-budget entry Android tablets/phones — 28nm, LTE-only octa-core

### Legacy / Other (HiSilicon Kirin — pre-sanctions Huawei Android phones)
- **Kirin 9000 / 9000E** — HiSilicon (Huawei) — Huawei Mate 40 Pro, P50 Pro (Android/AOSP-based, pre-HarmonyOS switch) — 5nm, last TSMC-fabbed Kirin before US sanctions
- **Kirin 990 / 990 5G** — HiSilicon (Huawei) — Huawei Mate 30 Pro, P40 Pro — 7nm
- **Kirin 980** — HiSilicon — Huawei Mate 20 Pro, P30 Pro — 7nm
- **Kirin 820 / 810** — HiSilicon — Huawei Nova/P40 lite-tier midrange devices — 7nm
- **Kirin 710** — HiSilicon — Huawei P Smart, Honor budget-midrange line (pre-Honor divestiture) — 12nm

### GPUs (integrated in SoC)
- **Adreno 750 / 830 / 890** — Qualcomm — paired with Snapdragon 8 Gen 3 / 8 Elite / 8 Elite Gen 5 flagship SoCs
- **Adreno 740** — Qualcomm — Snapdragon 8 Gen 2
- **Adreno 730** — Qualcomm — Snapdragon 8 Gen 1
- **Adreno 619 / 619L / 610** — Qualcomm — Snapdragon 6/7-series midrange chips
- **Adreno 613 / 619** — Qualcomm — Snapdragon 695/480 budget-tier
- **Mali-G720 Immortalis** — ARM — Dimensity 9400
- **Mali-G720 (Immortalis-G720 MC12)** — ARM — Dimensity 9300
- **Mali-G715 Immortalis** — ARM — Dimensity 9200
- **Mali-G710 MC10** — ARM — Dimensity 9000/9000+
- **Mali-G68 / G57** — ARM — Dimensity 8000/7000-series and Exynos midrange
- **Mali-G52** — ARM — Exynos 850, Helio G-series
- **Xclipse 940** — Samsung/AMD (RDNA3-based) — Exynos 2400
- **Xclipse 920** — Samsung/AMD (RDNA2-based) — Exynos 2200
- **PowerVR GE8320** — Imagination Technologies — Unisoc T-series budget chips
- **PowerVR IMG BXM** — Imagination — some Unisoc mid-tier chips

---

## 2. Camera Image Sensors

### Sony (IMX / LYT series)
- **Sony IMX989** — 1-inch, 50.3MP — Xiaomi 12S Ultra, Xiaomi 13 Ultra, Oppo Find X6 Pro — flagship 1-inch main sensor
- **Sony LYT-900** — 1-inch class — Xiaomi 14 Ultra, Vivo X100 Ultra — co-developed "LYTIA" branding sensor
- **Sony LYT-818** — 50MP, 1/1.28" — Vivo X200 Pro — successor to LYT-808
- **Sony LYT-808** — 50MP, 1/1.4" — OnePlus 12, Oppo Find X8 Pro — large 1/1.4" main sensor
- **Sony LYT-600** — 50MP — OnePlus 12R, midrange main cameras
- **Sony LYT-700** — 50MP — various 2024 midrange flagships
- **Sony IMX906** — periscope telephoto — flagship telephoto modules 2023-2024
- **Sony IMX890** — 50.3MP, 1/1.56" — Oppo Find X6 Pro (ultrawide/periscope), Nothing Phone (2), ASUS ROG Phone 8, OnePlus 12R — successor to IMX766, widely deployed upper-mid main sensor
- **Sony IMX800** — 1/1.49" — Vivo X90 Pro main sensor
- **Sony IMX786** — 50MP, 1/1.49" — Vivo X70 Pro+, OnePlus 9RT
- **Sony IMX766** — 50MP, 1/1.56" — OnePlus 9 Pro, Oppo Find X5 Pro (ultrawide), Realme GT2 Pro — very widely used flagship/upper-mid main and ultrawide sensor
- **Sony IMX703** — custom variant for Google Pixel 7 Pro telephoto
- **Sony IMX787** — Google Pixel main sensor variant, custom co-designed
- **Sony IMX686** — 64MP, 1/1.7" — Redmi Note 8 Pro, Realme X2 Pro — first widely deployed 64MP sensor
- **Sony IMX682** — 64MP — midrange 2020-2021 devices, 4K@30fps cap
- **Sony IMX600** — 12MP, dual-PD — Google Pixel 4/5 main sensor
- **Sony IMX586** — 48MP Quad Bayer — Xiaomi Mi 9, Honor View20 — first widely deployed 48MP sensor
- **Sony IMX519** — 48MP — Xiaomi Redmi Note 7 Pro
- **Sony IMX376** — 12MP — older midrange Xiaomi/Oppo devices
- **Sony IMX363** — 12.2MP dual-PD — Google Pixel 3/3a, Xiaomi Mi A2
- **Sony IMX355** — 13MP — budget ultrawide sensor, widely used across brands
- **Sony IMX350** — 12MP — Sony Xperia 1 series telephoto
- **Sony IMX615** — 32MP — Nothing Phone (2) front camera
- **Sony IMX471** — 16MP — Nothing Phone (1) front camera
- **Sony IMX615/IMX616** — 32MP under-display/front sensors — various 2022-2023 midrange selfie cameras
- **Sony IMX703** — Pixel 7 Pro telephoto custom sensor
- **Sony IMX398** — dual-pixel PDAF sensor — Huawei P10 series
- **Sony IMX333/IMX338** — 12MP — Sony Xperia XZ-era and early 2018-2019 midrange main cameras
- **Sony IMX230** — 21MP — early Xiaomi/Oppo flagship main sensor, 2015-2016 era
- **Sony IMX214** — 13MP — extremely widely deployed 2015-2017 era midrange main sensor (OnePlus 2/3, Redmi Note series)
- **Sony IMX377** — 12MP large-pixel (1.55μm) sensor — Google Pixel/Pixel XL (2016), Xiaomi Mi 5s

### Samsung ISOCELL
- **ISOCELL HP2** — 200MP, 0.6μm — Galaxy S23 Ultra, Galaxy S24 Ultra — flagship 200MP main sensor
- **ISOCELL HP9** — 200MP — 2023-announced sensor for periscope/main tier
- **ISOCELL HP3** — 200MP, 0.56μm — flagship-tier successor sensor
- **ISOCELL HPX** — 200MP — mid-flagship main camera sensor, Xiaomi/Motorola devices
- **ISOCELL GNJ** — 50MP — mid-tier main camera sensor announced alongside HP9/JN5
- **ISOCELL GN2** — 50MP, 1.4μm — Xiaomi Mi 11 Ultra, Vivo X60 Pro+ — large-pixel flagship main sensor
- **ISOCELL GN1** — 50MP, 1.2μm — Xiaomi Mi 11, Samsung Galaxy S21 Ultra (secondary)
- **ISOCELL GNK** — 50MP — Dual Pixel Pro autofocus, mid-flagship main sensor
- **ISOCELL GW3 / GW2 / GW1** — 50MP/64MP — Galaxy A-series and S-series main cameras
- **ISOCELL HM6** — 108MP, 0.64μm, Nonapixel Plus — Galaxy A54-tier and midrange 108MP cameras
- **ISOCELL HM2** — 108MP — Xiaomi Mi 10T Pro, Redmi Note 10 Pro (108MP variant), Samsung Galaxy S20 Ultra — nine-pixel binning
- **ISOCELL HMX** — 108MP — Xiaomi Mi Note 10, Samsung Galaxy S20 Ultra (early variant) — first 108MP mobile sensor
- **ISOCELL 2LD (S5K2LD)** — 12MP, 1.8μm — Samsung Galaxy S8/Note series main sensor
- **ISOCELL 3L6 (S5K3L6)** — 12MP — Samsung Galaxy A-series main sensor
- **ISOCELL JN1** — 50MP, 0.64μm — Galaxy S21 FE, Vivo X60 Pro (ultrawide), Nothing Phone (2) (ultrawide) — industry's first 0.64μm sensor
- **ISOCELL JN5** — 50MP — updated JN1 successor, ultrawide/macro tier
- **ISOCELL S5KGW1** — 64MP — Galaxy A71/A72 main camera
- **ISOCELL S5KGM1/GM2** — 48MP — Galaxy A50/A51 main camera
- **ISOCELL GD1/GD2** — 32MP — Galaxy A-series front/main camera sensors
- **ISOCELL 3P9** — 48MP — budget-midrange Android main sensor
- **ISOCELL 4H5** — 5MP depth/macro sensor — Galaxy A-series filler camera
- **ISOCELL HP1** — 108MP — later-gen 108MP sensor generation, midrange 2022-2023 devices
- **ISOCELL Slim GH1** — 43MP — under-display and compact camera modules

### OmniVision
- **OV50H** — 50MP, 1/1.3", dual conversion gain — high-end to premium tier main cameras
- **OV50E** — 50MP — high-end/mainstream main cameras, staggered HDR + DCG
- **OV50A** — 50MP, 1.0μm, 1/1.5" — high-end/mid-high tier
- **OV50C** — 50MP — low/mid-tier smartphone cameras
- **OV50X50** — 50MP flagship-tier sensor — premium smartphone main cameras
- **OV50K40** — 50MP — recent premium tier sensor
- **OV64C** — 64MP, 1/1.7", 0.8μm — first OmniVision 64MP smartphone sensor, budget/midrange
- **OV48C** — 48MP, 1/1.3", 1.2μm — flagship-tier sensor generation
- **OV13B10** — 13MP — budget ultrawide/macro cameras, widely deployed across Chinese OEM budget phones
- **OV02B10** — 2MP — depth/macro sensor, budget device filler cameras
- **OV08D10** — 8MP — front camera sensor, budget/midrange devices
- **OV64B** — 64MP — budget/midrange main camera sensor generation
- **OV32A** — 32MP — midrange front camera sensor
- **OV16A** — 16MP — budget front camera sensor
- **OV12A** — 12MP — entry-tier main/front camera sensor

### GalaxyCore
- **GC5035** — 5MP — budget front/macro camera sensor, extremely widely deployed in sub-$150 phones
- **GC08A3** — 8MP — budget device front camera
- **GC02M1** — 2MP — depth/macro filler sensor in budget multi-camera setups
- **GC16B3C** — 16MP — budget front-facing camera sensor

---

## 3. Camera Actuators, OIS & Lens Modules

- **Voice Coil Motor (VCM) actuators** — Alps Alpine, Mitsumi, TDK, LG Innotek, Samsung Electro-Mechanics (SEMCO), Jahwa Electronics — autofocus lens movement in essentially all smartphone camera modules; these six vendors account for 60%+ of market share
- **SMA (Shape Memory Alloy) actuators** — Alps Alpine (mass production since 2023), Cambridge Mechatronics (IP licensor) — used for compact OIS/AF in slim flagship camera modules
- **Piezoelectric actuators** — Alps Alpine — added to lineup for periscope/continuous optical zoom modules
- **Periscope telephoto actuator modules** — Jahwa Electronics, LG Innotek, Sunny Optical, Largan Precision (lens barrels) — 3x/5x/10x zoom modules in Galaxy S Ultra, Huawei P/Mate series, Oppo Find X, Vivo X100 Pro
- **Lens elements (glass/plastic barrels)** — Largan Precision, Sunny Optical Technology, Genius Electronic Optical (GSEO), Kantatsu — supply the actual lens stacks paired with the above sensors across nearly all Android OEMs

---

## 4. Display Panels

### Samsung Display (AMOLED/LTPO)
- **Samsung M13 AMOLED** — Samsung Display — Galaxy S24 Ultra — LTPO, up to 2600 nits peak brightness
- **Samsung M12 AMOLED** — Samsung Display — Galaxy S23 Ultra — LTPO gen
- **Samsung M11 AMOLED (Dynamic AMOLED 2X)** — Samsung Display — Galaxy S22 Ultra
- **Samsung E7 OLED emitter generation** — Samsung Display — used across recent flagship panel generations (blue emitter efficiency improvements)
- **Samsung E6 OLED emitter generation** — Samsung Display — Galaxy S23/S24-era panels
- **Dynamic AMOLED 2X (LTPO, 1-120Hz)** — Samsung Display — Galaxy S22/S23/S24/S25 Ultra, Galaxy Z Fold/Flip series
- **Super AMOLED (rigid, LTPS, fixed refresh)** — Samsung Display — Galaxy A-series lower tiers (A14, A05)
- **Foldable UTG (Ultra Thin Glass) AMOLED** — Samsung Display — Galaxy Z Fold/Flip series inner displays

### BOE
- **BOE Q9 AMOLED / flexible LTPO OLED** — BOE — Xiaomi 13/14 series (some panels), Honor Magic series, Huawei Mate/P series
- **BOE B16 OLED** — BOE — Honor, Xiaomi midrange flagship panels
- **BOE LCD IPS panels** — BOE — budget Android LCD-tier devices (Redmi A-series, Realme C-series)

### Visionox
- **Visionox AMOLED (rigid & flexible)** — Visionox — Xiaomi Redmi Note series, iQOO, some Honor devices — mid-tier flexible AMOLED supply
- **Visionox foldable AMOLED** — Visionox — supplies limited foldable panel volume to Samsung/Chinese OEMs

### Tianma
- **Tianma LTPS LCD** — Tianma Microelectronics — budget/midrange Android LCD panels (Poco F1-era, Redmi budget line)
- **Tianma AMOLED (flexible)** — Tianma — supplies volume to Samsung's lower-cost Galaxy M-series and Chinese OEM midrange phones

### CSOT (China Star Optoelectronics)
- **CSOT flexible AMOLED** — CSOT (TCL) — Samsung Galaxy M-series, Honor, Xiaomi midrange — growing OLED supplier, LTPS/LTPO variants
- **CSOT LTPS LCD** — CSOT — budget LCD Android panels

### LG Display / JDI / Sharp / Innolux / AUO
- **LG Display P-OLED** — LG Display — historically used in some Google Pixel and LG smartphones (LG's own Android line, discontinued)
- **JDI (Japan Display Inc.) LCD** — JDI — Sony Xperia LCD-based models (historically), some budget Android LCDs
- **Sharp IGZO LCD** — Sharp — Motorola/Sony budget-midrange LCD panels
- **Innolux LCD** — Innolux — budget Android LCD panels (Nokia, TCL, low-end Motorola)
- **AUO (AU Optronics) LCD** — AU Optronics — budget/entry LCD panel supply

### Panel driving tech / backplane types (cross-vendor)
- **LTPO (Low-Temperature Polycrystalline Oxide) backplane** — enables variable refresh rate 1-120Hz — flagship tier (Galaxy S Ultra, Pixel Pro, OnePlus, Xiaomi Ultra)
- **LTPS (Low-Temperature Polysilicon) backplane** — fixed/stepped refresh rate — midrange AMOLED tier
- **a-Si TFT LCD backplane** — budget LCD panels, lowest cost tier

---

## 5. Display Driver ICs & Touch Controllers

- **Samsung S6E3HA/S6E3FC series DDIC** — Samsung LSI — Samsung's own AMOLED panels (Galaxy S/Note/Z series) — custom in-house display driver ICs
- **Novatek NT36672A / NT36672C** — Novatek Microelectronics — Poco F1, various LCD/AMOLED DSI panels — widely deployed third-party DDIC
- **Novatek NT36523** — Novatek — foldable/high-res AMOLED panel driver
- **Himax HX83xx series DDIC** — Himax Technologies — flexible OLED driver ICs for Chinese OEM panels (BOE/Visionox/Tianma supply chain)
- **Synaptics R63350/R69 series DDIC** — Synaptics (formerly Renesas SP Drivers) — LCD/OLED driver ICs for various Android LCD panels
- **FocalTech FT8xxx touch controller** — FocalTech Systems — extremely widely deployed budget/midrange touchscreen controller (Redmi, Realme, Infinix, Tecno budget lines)
- **Goodix GT9xx series touch controller** — Goodix — in-cell touch controllers, 1B+ device deployment across mobile/tablet
- **Synaptics ClearPad / TouchPoint series** — Synaptics — flagship and midrange touch controllers, multi-touch gesture recognition
- **Himax HX852x touch controller** — Himax — combined touch+display driver (TDDI) chips for budget LCD panels

---

## 6. IMU / Motion Sensors (Accelerometer / Gyroscope)

### Bosch Sensortec
- **BMI323** — Bosch — general-purpose low-power 6-axis IMU, recent midrange/flagship devices
- **BMI270** — Bosch — widely deployed flagship/midrange 6-axis IMU (accelerometer+gyroscope)
- **BMI263** — Bosch — newer-gen IMU, low power motion tracking
- **BMI260** — Bosch — flagship IMU family, self-calibrating gyroscope (motionless CRT), OIS/EIS support, ~700μA draw at 6.4kHz ODR
- **BMI160** — Bosch — widely deployed 2016-2020 era flagship/midrange IMU, pin-compatible predecessor to BMI260
- **BMI120 / BMI055** — Bosch — older/budget-tier accelerometer+gyro combos
- **BMC150 / BMC156** — Bosch — accelerometer+magnetometer combo sensors, budget-midrange devices
- **BMA400 / BMA420** — Bosch — ultra-low-power standalone accelerometers (always-on step counting)
- **BMM150** — Bosch — standalone 3-axis magnetometer/digital compass

### STMicroelectronics
- **LSM6DSV320X / LSM6DSV** — STMicroelectronics — recent-gen 6-axis IMU with AI/edge processing features
- **LSM6DSO** — STMicroelectronics — flagship-tier IMU, OIS/EIS auxiliary SPI support
- **LSM6DSM** — STMicroelectronics — Samsung Galaxy A31/A33, Huawei Mate 9 — competes with InvenSense OIS IMU
- **LSM6DS3 / LSM6DSL** — STMicroelectronics — widely deployed midrange 6-axis IMU
- **LIS2DH12 / LIS3DH** — STMicroelectronics — standalone low-power 3-axis accelerometers, budget devices
- **LPS22HB / LPS25H** — STMicroelectronics — barometric pressure sensors (see Barometers section)
- **LIS2MDL** — STMicroelectronics — standalone 3-axis magnetometer

### InvenSense / TDK
- **ICM-42607-P / ICM-42607-C** — TDK InvenSense — recent-gen 6-axis MotionTracking IMU, ±16g/±2000dps range
- **ICM-40607** — TDK InvenSense — budget/midrange 6-axis IMU
- **ICM-4x6xx family (ICM-42688, ICM-42670)** — TDK InvenSense — flagship-tier high-precision IMUs
- **ICM-20690 / ICM-20602** — TDK InvenSense — widely deployed 2017-2020 era flagship IMU (e.g., early Pixel, Galaxy devices)
- **MPU-6500 / MPU-6050** — InvenSense (legacy, pre-TDK acquisition) — extremely widely deployed 2013-2018 era 6-axis IMU across nearly all Android OEMs
- **ICM-20948** — TDK InvenSense — 9-axis IMU (accel+gyro+mag) for wearables and some phones

### Others
- **AK09918 / AK09915 magnetometer** — Asahi Kasei Microdevices (AKM) — widely deployed compass sensor across Android flagships
- **Memsic MMC5603NJ magnetometer** — Memsic — budget/midrange compass sensor

---

## 7. Fingerprint Sensors

### Goodix
- **Goodix optical in-display fingerprint sensor (various generations)** — Goodix — OnePlus, Huawei, Vivo, Redmi, Oppo — dominant optical under-display FP vendor for Chinese OEMs
- **Goodix ultrasonic fingerprint sensor** — Goodix — flagship-tier Chinese OEM devices — proprietary ultrasonic 3D fingerprint tech, alternative to Qualcomm's
- **Goodix capacitive fingerprint sensor (side-mounted/rear)** — Goodix — budget/midrange devices with physical FP button — extremely widely deployed
- **Goodix touch+fingerprint combined module** — Goodix — Samsung Galaxy Z TriFold, Galaxy foldables — combined touch and FP biometric solution

### Qualcomm
- **Qualcomm 3D Sonic Max** — Qualcomm — Samsung Galaxy S22 Ultra, S21 Ultra — 17x larger ultrasonic sensing area than Gen 1
- **Qualcomm 3D Sonic Gen 2 (QFS2608)** — Qualcomm — Galaxy S20/Note20 series and other Snapdragon flagships — 50% faster, 77% larger than Gen 1, foldable-compatible
- **Qualcomm 3D Sonic Sensor (Gen 1)** — Qualcomm — Galaxy S10 series — first mass-market ultrasonic in-display FP sensor

### Others
- **Synaptics optical in-display fingerprint (Natural ID / TouchDNA)** — Synaptics — various Android OEM devices
- **Egis Technology optical/capacitive FP sensor** — Egis Technology — budget/midrange Android devices, Taiwan-based supplier
- **Fingerprint Cards (FPC) capacitive sensor** — Fingerprint Cards AB — budget-midrange Android rear/side FP modules, historically very widely deployed

---

## 8. Battery Chemistry, Cells & Capacity Tiers

### Chemistry types
- **Li-ion (graphite anode) pouch cell** — standard chemistry, most Android phones through ~2023
- **Li-Po (lithium polymer) pouch cell** — flexible-form-factor variant, common in slim/curved-body phones
- **Silicon-carbon anode Li-ion ("silicon-carbon battery")** — higher energy density per volume, enables bigger capacity in same chassis size — Xiaomi 14 Ultra ("Xiaomi Jinshajiang" battery, first launched Feb 2024), Redmi Turbo 4 Pro (7550mAh Jinshajiang battery), OnePlus 13 (6000mAh, silicon-carbon), OnePlus 13 global (7300mAh some regions), Honor, Huawei, Vivo — by H1 2025 penetration exceeded 60% of Chinese flagship launches
- **Dual-cell / split-battery configurations** — used in some fast-charging flagship phones (Oppo/OnePlus SuperVOOC-era) to allow simultaneous parallel charging of two smaller cells for faster charge rates

### Cell / pack suppliers
- **ATL (Amperex Technology Limited)** — major Li-ion/Li-Po pouch cell supplier across many Android OEMs (Xiaomi, Oppo, Vivo, and historically Samsung Note 7 supply)
- **Samsung SDI** — cylindrical and prismatic cell supply, anchors Galaxy S-series battery supply
- **LG Energy Solution (formerly LG Chem)** — battery cell supplier to various Android OEMs
- **Sunwoda Electronic** — Chinese battery pack/module assembler, supplies Android OEM battery packs
- **Desay Battery (Desay SV)** — Chinese battery pack assembler, module-level Li-ion integration for Android OEMs
- **China BAK Battery** — cell supplier for budget/midrange Android devices
- **Boston-Power / TWS** — additional cell suppliers referenced in mobile battery supply chain

### Typical capacity/voltage by tier (2024-2026 era)
- **Flagship tier**: 4500-6000mAh single-cell nominal 3.87V-4.53V chemistry, up to 7300mAh in silicon-carbon flagships (OnePlus 13 region variant)
- **Midrange tier**: 4500-5500mAh, standard Li-ion/Li-Po
- **Budget tier**: 4000-6000mAh (budget phones often oversized battery to compensate for less efficient older-node chipsets), standard Li-ion
- **Foldable tier**: dual-cell configurations summing to 4000-5000mAh split across hinge (Galaxy Z Fold, Fold foldables)

### Specific device battery capacities (illustrative cross-tier sample)
- Galaxy S24 Ultra — 5000mAh Li-ion, 4.53V chemistry
- Google Pixel 8 Pro — 5050mAh Li-ion
- OnePlus 12 — 5400mAh silicon-carbon
- OnePlus 13 — 6000mAh (global)/7300mAh (some region SKUs) silicon-carbon, 100W wired + 50W wireless
- Xiaomi 14 Ultra — 5300mAh Jinshajiang silicon-carbon, 90W wired
- Redmi Turbo 4 Pro — 7550mAh Jinshajiang silicon-carbon (largest to date at launch)
- ASUS ROG Phone 8 — 5500mAh dual-cell, 65W wired
- Samsung Galaxy Z Fold6 — 4400mAh dual-cell split pack

---

## 9. Charging ICs / PMICs

### Qualcomm PMICs
- **PM8550 / PM8550B / PM8550VE / PM8550VS** — Qualcomm — paired with Snapdragon 8 Gen 2 (SM8550) platform — SPMI-bus power management ICs handling charging, battery gauge, multi-rail regulation
- **PMK8550** — Qualcomm — companion PMIC in SM8550 platform PMIC set
- **PM8350 / PM7550** — Qualcomm — paired with Snapdragon 7-series and 6-series midrange platforms
- **PM7250B** — Qualcomm — Snapdragon 4/6-series budget-tier PMIC

### MediaTek PMICs
- **MT6375 / MT6377** — MediaTek — companion PMICs for Dimensity 9000/9300 series flagship platforms
- **MT6768 / MT6765-series PMIC** — MediaTek — companion PMICs for Helio G-series budget chipsets

### OEM proprietary fast-charge chips
- **OPPO SUPERVOOC S (full-link power management chip)** — OPPO — OnePlus 11R (first device), OPPO/OnePlus SuperVOOC-era flagships — industry-first full-link charge/discharge management chip, enables 50% charge in ~10 minutes
- **OPPO/OnePlus VOOC/SuperVOOC charge pump IC** — OPPO — proprietary flash-charge protocol ICs across OPPO/OnePlus/Realme lineup (licensed tech)
- **Xiaomi Surge P1** — Xiaomi — Xiaomi Mi 12 Pro — Xiaomi's first self-developed charging chip, 120W single-cell charging, supports 1:1/2:1/4:1 conversion modes, ~0.83W/mm² power density
- **Xiaomi Surge P2** — Xiaomi — Xiaomi 14 Ultra — intelligent fast-charging chip, 90W wired charging management
- **Xiaomi Surge P3** — Xiaomi — supports up to 90W charging tier, successor charge-pump chip in Xiaomi's self-developed silicon lineup

### Third-party charge-pump / PMIC vendors
- **Halo Microelectronics charge pump IC** — Halo Microelectronics — third-party fast-charge charge-pump ICs used across various Android OEM fast-charging implementations
- **Silergy Corp PMIC / charge-pump IC** — Silergy — battery charging and power management ICs for midrange Android devices
- **Richtek Technology PMIC** — Richtek (MediaTek subsidiary) — power management support chips for MediaTek-based devices
- **Texas Instruments BQ25xxx battery charger IC** — Texas Instruments — widely used standalone charger ICs in budget/midrange Android designs
- **Injoinic Technology (INJOINIC) IP6xxx fast-charge protocol IC** — Injoinic — budget Android fast-charge protocol negotiation chips

---

## 10. Modems (Cellular Baseband)

### Qualcomm Snapdragon X-series
- **Snapdragon X80 Modem-RF System** — Qualcomm — Snapdragon 8 Elite platform — AI-enhanced 5G Advanced modem
- **Snapdragon X75 Modem-RF System** — Qualcomm — Snapdragon 8 Gen 3 platform — first 5G-Advanced-ready modem-RF system
- **Snapdragon X72 Modem-RF System** — Qualcomm — Snapdragon 8 Gen 2 platform — mobile-focused companion to X75
- **Snapdragon X70 Modem-RF System** — Qualcomm — Snapdragon 8 Gen 1/8+ Gen 1 platform — 2022-2023 flagship modem, 4x carrier aggregation
- **Snapdragon X65** — Qualcomm — Snapdragon 888/8 Gen 1-era, 10Gbps class modem
- **Snapdragon X62 / X61** — Qualcomm — midrange 5G modem integrated into Snapdragon 7-series SoCs
- **Snapdragon X12 / X51 LTE modem** — Qualcomm — integrated into budget 4-series/6-series SoCs

### MediaTek modems
- **MediaTek M80 5G modem** — MediaTek — integrated into Dimensity 9000/9300/9400 flagship SoCs
- **MediaTek M70 5G modem** — MediaTek — baseband IP block, 3GPP-compliant, up to 5Gbps class
- **MediaTek Helio M70** — MediaTek — integrated 5G modem for Dimensity 1000/1200-era SoCs

### Samsung Exynos Modems
- **Exynos Modem 5400 (5400C / 5400i variants)** — Samsung — Galaxy S24/S24+ (Exynos variant), Google Pixel 9 series, Pixel Fold 2, Pixel Tablet 2, Pixel 10 series — NTN satellite connectivity support
- **Exynos Modem 5300** — Samsung — Google Pixel 7 series, Pixel 8 series, part of would-be Exynos 2300 platform — 10Gbps downlink class
- **Exynos Modem 5100** — Samsung — Galaxy S10 5G — first standalone 5G modem chip from Samsung

---

## 11. WiFi / Bluetooth / NFC / UWB Combo Chips

### Qualcomm FastConnect
- **FastConnect 7900** — Qualcomm — Snapdragon 8 Elite — AI-enhanced Wi-Fi 7 + Bluetooth + UWB single-chip, 6nm, 40% lower power than 7800
- **FastConnect 7800** — Qualcomm — Snapdragon 8 Gen 2/Gen 3 — Wi-Fi 7 (5.8Gbps), 2ms latency, premium Bluetooth audio, 14nm
- **FastConnect 6900** — Qualcomm — Samsung Galaxy S23/S23+ (some SKUs), Snapdragon 888-era — Wi-Fi 6E
- **FastConnect 6700** — Qualcomm — Snapdragon 7-series midrange — Wi-Fi 6

### Broadcom
- **Broadcom BCM4389** — Broadcom — Samsung Galaxy S21 Ultra (world's first Wi-Fi 6E phone) — Wi-Fi 6E + Bluetooth 5, 16nm, Tri-Band Simultaneous connectivity
- **Broadcom BCM4375** — Broadcom — pre-6E Samsung Galaxy flagships — Wi-Fi 6 (no 6GHz band), 28nm
- **Broadcom BCM4359** — Broadcom — older Samsung Galaxy S8/S9-era Wi-Fi/BT combo chip

### MediaTek connectivity
- **MediaTek MT6639 / MT6653 Wi-Fi 6E combo** — MediaTek — integrated connectivity for Dimensity flagship platforms
- **MediaTek MT6631 Wi-Fi/BT combo** — MediaTek — midrange Dimensity platform connectivity

### UWB (Ultra-Wideband)
- **NXP SR200 / SR150 UWB chip** — NXP Semiconductors — Samsung Galaxy Note20 Ultra, Galaxy S21+/Ultra, Galaxy S22/S23/S24 Ultra — UWB ranging for Galaxy AR/Nearby Share/SmartTag
- **Qorvo QM35 / DW3xxx (Decawave-derived) UWB SoC** — Qorvo — Google Pixel devices (Pixel 6 Pro onward) — UWB ranging chip
- **NXP PN80T/PN81 combined NFC+SE+UWB chipset** — NXP — integrated secure connectivity chipsets for premium Android devices

---

## 12. GPS / GNSS Chips

- **Broadcom BCM47765** — Broadcom — premium wearables and some Android flagships — 2nd-gen dual-frequency GNSS (L1/L5), BDS-3 B2a support
- **Broadcom BCM47755** — Broadcom — earlier dual-frequency GNSS SoC, predecessor to 47765
- **Qualcomm integrated GNSS (within Snapdragon SoC)** — Qualcomm — all modern Snapdragon SoCs integrate multi-constellation dual-frequency GNSS directly in the modem/RF front-end rather than a discrete chip
- **MediaTek integrated GNSS (within Dimensity SoC)** — MediaTek — Dimensity platforms integrate GPS/GLONASS/BeiDou/Galileo/QZSS support on-die
- **Samsung Exynos integrated GNSS** — Samsung — Exynos SoCs integrate GNSS baseband alongside the Exynos modem block

---

## 13. RF Front-End (Power Amplifiers, Filters, Antenna Switches, Antenna Modules)

Fills the `antenna` component-type bucket in `component_vocabulary.py` — the discrete RF chain between the modem/transceiver and the physical antenna.

- **Qualcomm QTM527 / QTM545 mmWave antenna module** — Qualcomm — Snapdragon 8-series mmWave-enabled flagships (US carrier SKUs of Galaxy S/Pixel/OnePlus) — integrated mmWave antenna array module
- **Qualcomm QFE (RF Front-End) module family** — Qualcomm — envelope tracking, low-noise amplifiers, and antenna tuners paired with Snapdragon modems across flagship/midrange tiers
- **Skyworks SkyOne Ultra / Sky5 front-end module** — Skyworks Solutions — integrated PA-duplexer-switch front-end modules used across various Android OEM RF chains
- **Skyworks PAMiD (Power Amplifier Module with integrated Duplexer)** — Skyworks Solutions — mid/high-band cellular PA modules in Android flagship RF front-ends
- **Qorvo RF Fusion integrated PAMiD** — Qorvo — combined PA, filter, and switch front-end module for flagship 5G Android phones
- **Qorvo antenna switch module (ASM)** — Qorvo — antenna-to-transceiver RF switching across Android flagship/midrange RF front-ends
- **Broadcom AFEM (Antenna Front-End Module)** — Broadcom — integrated PA/filter/switch modules for premium Android RF front-ends (notably Samsung Galaxy flagships)
- **Murata RF front-end modules (LNA/filter/switch)** — Murata Manufacturing — RF filter and front-end module supply across Android OEM mainboards
- **TDK/Qualcomm RF360 filter/duplexer modules** — TDK (via TDK-Qualcomm JV heritage) — SAW/BAW filters and duplexers for cellular front-ends
- **Avago/Broadcom FBAR filters** — Broadcom — bulk acoustic wave RF filters widely used in Android flagship cellular front-ends
- **Cellular antenna (laser-direct-structuring / LDS antenna)** — various antenna module vendors (e.g., Amphenol, Speed, Yuanchuang) — physical antenna elements molded onto Android phone frames/chassis
- **mmWave antenna array (5G US models)** — Qualcomm-designed modules integrated by OEMs — Galaxy S-series US variants, Pixel US variants — enables mmWave 5G bands in US carrier SKUs

---

## 14. Audio Codecs, DACs & Amplifiers

### Qualcomm Aqstic
- **Qualcomm Aqstic WCD9385** — Qualcomm — Snapdragon 8 Gen 2/3-era flagships — audio codec companion chip
- **Qualcomm Aqstic WCD9380** — Qualcomm — Snapdragon 888/8 Gen 1-era flagships — audio codec companion chip
- **Qualcomm Aqstic WSA8830 / WSA8835 smart speaker amplifier** — Qualcomm — integrated smart amp companion parts for Snapdragon flagship reference designs

### Cirrus Logic
- **Cirrus Logic CS35L41** — Cirrus Logic — flagship Android stereo-speaker devices — 11V boosted Class-D smart amp with DSP, speaker protection algorithms
- **Cirrus Logic CS35L45** — Cirrus Logic — newer-gen smart amplifier, enhanced low-power codec pairing
- **Cirrus Logic CS35L42** — Cirrus Logic — compact smart amp for slim flagship designs

### AKM (Asahi Kasei Microdevices)
- **AKM AK4377 / AK4376 headphone amp DAC** — AKM — audiophile-tier Android devices (LG V-series historically, some Sony Xperia) — Hi-Fi DAC/headphone amp chips
- **AKM AK4490 / AK4493 / AK4498 series DAC** — AKM — high-end portable/mobile audio DAC ICs referenced across audiophile smartphone audio chains

### Awinic
- **Awinic AW8896** — Awinic — Chinese OEM (Xiaomi/Oppo/Vivo-tier) smart audio amplifier IC, widely used repair-part-documented chip
- **Awinic AW88xxx smart K-amp series** — Awinic — mainstream Chinese Android smart amplifier lineup, boosted Class-D with speaker protection

### Others
- **Texas Instruments TAS2563 / TAS2781 smart amp** — Texas Instruments — Android smart speaker amplifier ICs used in various OEM designs
- **NXP TFA9894 / TFA9874 smart amplifier** — NXP Semiconductors — boosted speaker amp ICs used across Android OEM audio front-ends
- **MediaTek MT6660 smart amplifier** — MediaTek — companion smart amp for MediaTek-platform phones

---

## 15. Haptic Motors & Haptic Drivers

### Linear Resonant Actuators (LRA)
- **AAC Technologies X-axis LRA** — AAC Technologies — Redmi Note 11 series (first adopter), Redmi Note 12 Turbo (jointly engineered) — X-axis linear actuator, tuned with software haptic algorithms
- **AAC Technologies Z-axis LRA** — AAC Technologies — compact flagship devices where X-axis space is constrained
- **AAC RichTap Integrated Haptic Solution** — AAC Technologies — ASUS ROG Phone 7 series — gaming-tuned haptic system
- **Foxconn/Sharp LRA actuator** — Foxconn/Sharp — supplied to various Android OEM haptic modules (market alternative to AAC)
- **Vibrant Ltd. / Jinlong Machinery LRA** — Vibrant, Jinlong — budget/midrange Chinese Android haptic motor suppliers

### ERM (Eccentric Rotating Mass) motors
- **AAC ERM coin vibration motor** — AAC Technologies — budget-tier Android devices still using rotational (non-linear) vibration motors

### Haptic driver ICs
- **Cirrus Logic haptic driver (CS40Lxx series)** — Cirrus Logic — precision haptic waveform driver ICs paired with LRA actuators in flagship Android devices
- **Texas Instruments DRV2624 / DRV2605 haptic driver** — Texas Instruments — widely used haptic driver ICs across Android OEM designs
- **Awinic AW8624 / AW86xx haptic driver** — Awinic — Chinese OEM haptic driver ICs paired with AAC/Foxconn LRAs

---

## 16. USB-C Controllers & Connectors

- **Texas Instruments TPS65987D** — Texas Instruments — USB Type-C and PD controller with integrated source/sink, used in Android USB-C power path designs
- **Texas Instruments TPS65982** — Texas Instruments — USB-C/PD controller, power switch, and high-speed multiplexer
- **Texas Instruments TPS26750 / TPS25750** — Texas Instruments — USB-C PD controller with managed power paths and protection
- **Cypress (Infineon) CYPD series USB-C PD controller** — Cypress/Infineon (post-acquisition) — USB-C port controller ICs used across various Android OEM charging ports
- **Richtek RT1711H USB-C PD controller** — Richtek (MediaTek subsidiary) — budget/midrange Android USB-C PD negotiation chip
- **USB-C receptacle connector** — Foxconn, JAE (Japan Aviation Electronics), Amphenol, Hirose — physical USB-C port connector hardware supply across Android OEMs

### Board-to-board / internal connectors
- **Board-to-board (BTB) connectors** — Hirose Electric, JAE, Amphenol, I-PEX — connect daughterboards (sub-boards, camera FPCs) to mainboard across nearly all Android teardown boards
- **Battery FPC connector** — I-PEX, JST, Molex — battery-to-mainboard flexible connector
- **RF coaxial connectors (antenna to board)** — I-PEX MHF/U.FL series, Hirose — mmWave/sub-6 antenna module connections in 5G flagship phones

---

## 17. NFC Controllers & Secure Elements

- **NXP PN553 / PN80T** — NXP Semiconductors — Android NFC controller + embedded Secure Element combo, industry's first 40nm SE
- **NXP PN7160** — NXP Semiconductors — NFC plug-and-play controller with integrated firmware, NCI interface, widely used discrete NFC controller
- **NXP PN7220** — NXP Semiconductors — high-performance one-chip NFC controller for EMVCo 3.2 / NFC Forum operation
- **NXP SN100U** — NXP Semiconductors — single-die chipset combining embedded SE, NFC, and eSIM
- **Samsung S3FV9RR** — Samsung LSI — Samsung's own eSE/eSIM secure element chip, used in Galaxy flagship devices for tap-to-pay/eSIM
- **STMicroelectronics ST21NFC** series — STMicroelectronics — NFC controller IC used across various Android OEM NFC front-ends
- **Qualcomm QCA6595/integrated NFC (within FastConnect stack on some platforms)** — Qualcomm — reference-design NFC pairing in some Snapdragon platforms

---

## 18. Barometers (Pressure Sensors)

- **Bosch BMP585** — Bosch Sensortec — latest-gen high-accuracy barometric pressure sensor, flagship Android devices
- **Bosch BMP581 / BMP580** — Bosch Sensortec — next-gen barometer, 1.5cm (0.1Pa) low-altitude noise floor
- **Bosch BMP390** — Bosch Sensortec — 24-bit absolute pressure sensor, sub-10cm altitude resolution, widely deployed flagship/midrange Android barometer
- **Bosch BMP280 / BMP180** — Bosch Sensortec — legacy widely deployed barometer across 2015-2020 Android flagships
- **STMicroelectronics LPS22HB** — STMicroelectronics — MEMS pressure sensor, alternative barometer vendor for Android flagships
- **STMicroelectronics LPS25H** — STMicroelectronics — older-gen barometric pressure sensor

---

## 19. Proximity & Ambient Light Sensors (ALS)

- **ams OSRAM TCS3408** — ams OSRAM — high-sensitivity ALS + color + flicker-detection sensor, recent flagship Android devices — 5-channel (R/G/B/Clear/Wideband) light sensing
- **ams OSRAM TMD2725 / TMD3702** — ams OSRAM — combined proximity + ALS sensor modules, widely deployed across Android flagship notch/hole-punch designs
- **ams OSRAM AS7331 / color sensor family** — ams OSRAM — advanced color/spectral sensing modules in select flagship camera-adjacent sensor stacks
- **ROHM BH1745 color/ALS sensor** — ROHM Semiconductor — ambient light + color sensing IC used in various Android devices
- **ROHM BH1730 / BH1750 ALS** — ROHM Semiconductor — standalone ambient light sensor ICs
- **Sharp GP2AP proximity/ALS sensor** — Sharp — combined proximity+ALS modules used across Android OEM front sensor packages
- **Vishay VCNL36xx proximity sensor** — Vishay Intertechnology — proximity sensing modules for budget/midrange Android front camera arrays
- **Lite-On LTR-5xx ALS/proximity sensor** — Lite-On — budget-tier Android proximity+ALS combo modules
- **STMicroelectronics VL53L (ToF) proximity/depth sensor** — STMicroelectronics — Time-of-Flight proximity/depth sensing used in some flagship autofocus-assist and proximity applications

---

## 20. MEMS Microphones

- **Infineon IM69D130** — Infineon Technologies — digital XENSIV MEMS mic, 105dB dynamic range, 69dB(A) SNR, 130dBSPL linearity — supplies MEMS die to AAC/Goertek/BSE/Hosiden/Gettop packaging partners
- **Infineon IM69D128S** — Infineon Technologies — compact-package variant of the IM69D130 die
- **Knowles SPK/SPU series MEMS microphone** — Knowles — top-tier packaged MEMS mic supplier for flagship Android devices
- **Goertek MEMS microphone (Infineon-die-based)** — Goertek — packages Infineon dual-backplate MEMS die under own brand for Android OEM mic modules
- **AAC Technologies MEMS microphone** — AAC Technologies — top-3 global MEMS mic supplier, widely deployed across Android flagship/midrange mic arrays
- **CUI Devices / BSE / Hosiden MEMS microphone modules** — CUI Devices, BSE, Hosiden — additional MEMS die packaging vendors supplying budget/midrange Android mic arrays

---

## 21. Speakers

- **AAC Technologies SLS (Speaker Linear System) micro speaker** — AAC Technologies — Google Pixel (SLS tech provided 2017 onward) — premium micro speaker box design
- **AAC Technologies dynamic micro-speaker** — AAC Technologies — top-2 global micro-speaker supplier for Android flagship/midrange stereo speaker setups
- **Goertek dynamic micro-speaker** — Goertek — top-2 global micro-speaker supplier, dual sourced alongside AAC across many Android OEM lines
- **Receiver/earpiece speaker module** — AAC Technologies, Goertek — secondary top-firing/earpiece speaker in stereo speaker Android flagships

---

## 22. Passive Components (MLCC, Inductors, Discretes)

- **Murata GRM-series MLCC** — Murata Manufacturing — global MLCC market leader, automotive/industrial/ultra-miniature capacitors, widely used in flagship Android mainboards
- **Murata power inductors / RF filters / communication modules** — Murata — beyond MLCCs, supplies RF front-end filters and power inductors to Android OEMs
- **Samsung Electro-Mechanics (SEMCO) MLCC** — Samsung Electro-Mechanics — ranked #2 global MLCC supplier, heavily used in Samsung Galaxy mainboards
- **TDK MLCC (high-voltage/soft-termination)** — TDK Corporation — MLCC supply with strength in high-voltage and automotive-grade capacitors, also supplies Android mainboards
- **Taiyo Yuden MLCC** — Taiyo Yuden — mid-range MLCC capacity for Android OEM mainboards
- **Kyocera AVX MLCC** — Kyocera AVX — high-voltage/high-frequency/high-reliability MLCC segment supplier
- **Yageo MLCC / resistors** — Yageo Corporation — Taiwan-based passive component supplier for budget/midrange Android mainboards
- Note: a single high-end smartphone mainboard contains 1,000+ discrete passive components (MLCCs, inductors, resistors) sourced across these vendors

---

## 23. Chassis, Frame & Cover Materials

- **7000-series aluminum alloy frame** — used across most flagship/midrange Android mid-frames (Galaxy S-series, Pixel, OnePlus)
- **Titanium frame** — Samsung Galaxy S24 Ultra/S25 Ultra (Ultra tier), Xiaomi 14 Ultra (Titanium Special Edition) — premium flagship-only frame material
- **Stainless steel frame** — used in select ultra-premium tier devices for added rigidity/weight
- **Gorilla Glass Victus 2 / Victus 3** — Corning — front cover glass on 2023-2025 Android flagships
- **Gorilla Glass Victus (original) / Gorilla Glass 5/6** — Corning — 2019-2022 era Android flagship/midrange cover glass
- **Gorilla Glass 3 / Gorilla Glass 3+** — Corning — budget/midrange Android cover glass
- **Ceramic Shield-equivalent aluminosilicate glass** — various suppliers — used in some Google Pixel Pro models for scratch resistance
- **UTG (Ultra Thin Glass) foldable cover** — Samsung Display / Schott (glass source) — Galaxy Z Fold/Flip foldable display cover layer
- **Polycarbonate/plastic rear housing** — budget-tier Android devices (Redmi A-series, Galaxy A0x-series, Nokia budget line)
- **Vapor chamber cooling** — various thermal module suppliers (AVC, Auras, Cooler Master OEM) — flagship gaming-tier Android thermal management (ASUS ROG Phone, RedMagic, iQOO)
- **Graphite/graphene heat-spreader sheets** — Kaneka, Panasonic — thermal dissipation sheets under display/SoC in flagship Android thermal stacks

---

## 24. Camera Flash / Status LEDs

- **OSRAM Oslux LED (dual-chip flash)** — OSRAM Opto Semiconductors (now ams OSRAM) — dual color-temperature (6000K cold-white + 2250K warm-white) camera flash module widely used across Android flagships
- **ams OSRAM multi-chip flash module** — ams OSRAM — successor multi-chip camera flash LED packages
- **Everlight Flash LED** — Everlight Electronics — single/dual color-temperature, high-CRI flash LEDs for high/mid/low-end Android devices
- **Lite-On camera flash LED** — Lite-On Technology — budget/midrange Android camera flash LED supply
- **Genesis Photonics flash LED** — Genesis Photonics — Taiwan LED manufacturer supplying Android camera flash modules

---

## Sources

Research compiled via web search across the following categories of sites (September 2026):
- Vendor technical pages/datasheets: Qualcomm (qualcomm.com), MediaTek (mediatek.com), Samsung Semiconductor (semiconductor.samsung.com), Sony Semiconductor Solutions (sony-semicon.com), Bosch Sensortec (bosch-sensortec.com), STMicroelectronics (st.com), TDK InvenSense (via jlcpcb/jlcpcb datasheets), OmniVision (ovt.com), Goodix (goodix.com), Cirrus Logic (cirrus.com), AKM (akm.com), NXP (nxp.com), Qorvo (qorvo.com), ams OSRAM (ams-osram.com), Texas Instruments (ti.com), Broadcom (broadcom.com), AAC Technologies (aactechnologies.com)
- Enthusiast/news tech press: GSMArena (gsmarena.com), Android Authority, XDA Developers, AndroidCentral, PhoneArena, SamMobile, Gizmochina, TechAdvisor, 9to5Google, AndroidHeadlines, TechRadar
- Teardown/repair sources: iFixit device pages, TechInsights teardown blog, Vopmart teardown blog
- Component/spec aggregators: Kimovil, PhonesData, NanoReview, Smartprix, 91mobiles, Beebom, unite4buy.com, Wikipedia (List of MediaTek/Qualcomm SoCs)
- Industry/market analysis: OLED-Info (display supply chain), Yole Group (component teardown market reports), Passive-components.eu

Coverage spans Samsung Galaxy S/A/Z, Google Pixel, Xiaomi/Redmi/POCO, OnePlus, Motorola, Sony Xperia, Oppo, Vivo, Nothing, ASUS ROG Phone, Realme, Honor, and historical Huawei (pre-HarmonyOS Android era), across flagship, midrange, and budget price tiers, roughly 2018-2026.
