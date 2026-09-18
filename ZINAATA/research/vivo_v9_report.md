# Vivo V9 (2018) — Repair Diagnostic Baseline

## Research Scope

This profile is a first-pass public-record baseline for a phone-repair diagnostic project. It covers the standard **vivo V9 (2018)**, not V9 Youth or V9 Pro.

> **Baseline variant:** vivo V9, Snapdragon 626, 4 GB RAM, 64 GB storage.

No live scan data exists for the target unit yet. The findings below are therefore intended as a pre-scan reference profile.

---

## 1. Core Specifications

| Parameter | Specification |
|---|---|
| SoC | Qualcomm Snapdragon 626 |
| CPU | Octa-core, up to 2.2 GHz |
| GPU | Adreno 506 |
| RAM | 4 GB |
| Storage | 64 GB |
| microSD | Dedicated expandable storage |
| Display | 6.3-inch IPS LCD |
| Resolution | 2280 × 1080 |
| Aspect ratio | 19:9 |
| Protection | Corning Gorilla Glass 3 |
| Battery | 3,260 mAh |
| Charging | Micro-USB |
| Rear cameras | 16 MP f/2.0 + 5 MP f/2.0 |
| Front camera | 24 MP f/2.0 |
| Cellular | 4G LTE / VoLTE |
| Wi-Fi | 802.11 a/b/g/n/ac, dual-band |
| Bluetooth | 4.2 |
| Navigation | GPS + GLONASS |
| FM radio | Yes |
| OTG | Yes |
| NFC | No |
| Fingerprint | Physical rear-mounted sensor |
| Face unlock | Yes |
| Dimensions | ~154.8 × 75.0 × 7.9 mm |
| Weight | ~150 g |
| Construction | Plastic body |
| Launch OS | Android 8.1 Oreo + Funtouch OS 4.0 |
| India launch | March 2018 |
| Launch price | ₹22,990 |

---

## 2. Sensor Inventory

### Confirmed present

- Accelerometer
- Gyroscope
- Proximity sensor
- Ambient-light sensor
- E-compass / magnetometer
- Rear fingerprint sensor
- Front-camera-based Face Unlock

### Confirmed absent

- NFC

### Not documented in available specifications

- Barometer
- Dedicated temperature sensor
- Humidity sensor
- Heart-rate sensor

The last group should be treated as **not documented**, rather than definitive proof of physical absence.

---

## 3. Marketplace Evidence

### Flipkart

- Original configuration: 4 GB RAM / 64 GB storage
- Current indexed rating: approximately 4.5/5
- Approximately 86,000 ratings were visible on the retrieved listing
- Historical launch price: ₹22,990

The currently indexed Flipkart price should not be treated as reliable evidence of the original 2018 transaction price.

### Amazon

Historical price and detailed rating-distribution data were not sufficiently exposed in accessible results.

---

## 4. Review / Reliability Findings

Accessible marketplace pages did not expose enough individually verifiable Amazon/Flipkart reviews to safely construct the requested 15–20-review dataset.

Relevant complaints and observations from accessible reviews and user reports include:

- Software lag / occasional sluggishness
- Battery drain or abnormal battery behavior
- Problems reported after the battery reaches 0%
- Unexpected password prompt after battery exhaustion
- Emergency-calls-only state in reported incidents
- Factory-reset requirement in some reported incidents
- Potential data loss following reset
- Display reddish tint reported on one review unit
- Glossy plastic rear attracts fingerprints
- Micro-USB charging hardware
- Average speaker performance
- Older Snapdragon 626 performance
- Charging flex / charging-port assembly as a repair component
- Internal battery replacement
- Fingerprint sensor replacement
- Ringer/speaker assembly replacement

The battery-exhaustion/lockout reports are individual user reports and should **not** be interpreted as a measured failure rate.

---

## 5. Long-Term Reliability Signals

### Battery

The strongest aged-device signal found was related to battery exhaustion:

`battery reaches 0% → abnormal startup/lock state → possible factory reset → possible data loss`

This should be retained as a diagnostic investigation path, but not classified as a confirmed universal V9 failure.

### Software

Contemporary reviewers reported occasional sluggishness. On an aged unit, software performance should therefore be checked separately from hardware faults.

### Charging

The device uses Micro-USB. The charging port/flex assembly is a documented repair component and is a reasonable physical inspection point on an older unit.

### Physical hardware

Relevant serviceable areas include:

- Battery
- Charging flex / charging-port assembly
- Sub-board
- Fingerprint sensor
- Ringer / loudspeaker assembly
- Display assembly
- Mainboard

---

## 6. Fault Vocabulary

Deduplicated diagnostic vocabulary extracted from the research:

- battery degradation
- battery drain
- abnormal battery percentage
- battery reaches 0%
- lockout after battery exhaustion
- unexpected password prompt
- emergency-calls-only state
- factory-reset requirement
- data loss after reset
- software lag
- sluggishness
- reddish display tint
- fingerprint-prone rear
- charging-port wear
- charging-flex fault
- Micro-USB charging issue
- internal battery replacement
- fingerprint-sensor fault
- ringer fault
- speaker weakness
- outdated/limited performance
- missing NFC

---

## 7. Diagnostic Baseline

For a future live scan, the following areas should be compared against this public-record baseline:

```text
POWER
 ├─ Battery health / capacity
 ├─ Battery voltage behaviour
 ├─ Charging current
 ├─ Charge-port behaviour
 └─ 0%-shutdown behaviour

SENSORS
 ├─ Accelerometer
 ├─ Gyroscope
 ├─ Proximity
 ├─ Ambient light
 └─ Magnetometer / compass

BIOMETRICS
 ├─ Rear fingerprint sensor
 └─ Face unlock / front camera

PERFORMANCE
 ├─ CPU behaviour
 ├─ GPU behaviour
 ├─ RAM pressure
 ├─ Storage health
 └─ UI/software latency

DISPLAY
 ├─ Touch response
 ├─ Dead pixels
 ├─ Tint / colour abnormality
 └─ Display uniformity

CAMERAS
 ├─ Rear 16 MP
 ├─ Rear 5 MP
 └─ Front 24 MP

CONNECTIVITY
 ├─ 4G
 ├─ Wi-Fi
 ├─ Bluetooth
 ├─ GPS
 ├─ FM
 └─ USB/OTG
```

---

## 8. Research Limitations

- GSMArena was inaccessible during retrieval because of robots.txt restrictions.
- Specifications were cross-checked against Vivo's official specification material and contemporary reviews.
- Amazon historical pricing and complete review distributions were not accessible with sufficient reliability.
- Fewer than 15–20 individually verifiable Amazon/Flipkart reviews were available, so no synthetic review dataset was created.
- Reddit reports provide useful long-term cases but cannot establish failure prevalence.
- No authoritative V9 iFixit repairability score or complete service-manual part-number catalogue was found.
- Later systematic long-term reviews were sparse.

---

## 9. Variant Identification

This profile refers specifically to:

**vivo V9 (2018) — Snapdragon 626 / 4 GB RAM / 64 GB storage**

Do not merge this profile with:

- vivo V9 Youth
- vivo V9 Pro
- Other region-specific V9 derivatives

Those variants can have materially different SoCs, memory configurations, cameras, and other hardware.

---

## 10. Suggested Diagnostic Classification

For the repair-diagnostic database, the V9 can initially be represented with these fault domains:

```text
VIVO_V9_2018
├── POWER
│   ├── BATTERY_DEGRADATION
│   ├── BATTERY_DRAIN
│   ├── ZERO_PERCENT_BEHAVIOUR
│   └── CHARGING_PORT
├── SOFTWARE
│   ├── LAG
│   └── SLUGGISHNESS
├── DISPLAY
│   └── COLOUR_TINT
├── BIOMETRIC
│   └── FINGERPRINT_SENSOR
├── AUDIO
│   └── RINGER_SPEAKER
├── CONNECTIVITY
│   └── USB_MICRO_B
└── PHYSICAL
    └── REAR_FINISH_FINGERPRINTING
```

This taxonomy is a **research-derived baseline**, not a confirmed manufacturer failure classification.
