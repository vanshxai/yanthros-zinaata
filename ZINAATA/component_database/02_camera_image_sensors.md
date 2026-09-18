# 02 — Camera Image Sensors

Maps to `component_vocabulary.py` type: `image_sensor` (domains: instrumentation, electronics).
Source list: `real_world_phone_components.md` §2 (~65 named Sony/Samsung/OmniVision/GalaxyCore
sensors).

---

## Governing physics

**Photodiode responsivity** (converts incident optical power to photocurrent):
```
I_photo = R(λ) · P_optical
R(λ) = (q · η(λ)) / (h · ν)  = (η(λ) · λ) / 1.24   [A/W, λ in μm]
```
- η(λ) = quantum efficiency at wavelength λ (fraction of incident photons producing a collected
  electron; BSI (back-side illuminated) sensors, standard in essentially every phone sensor listed
  in §2 since ~2012, exist specifically to raise η by moving the wiring layer behind the photodiode
  so incoming light doesn't have to pass through metal interconnect first).
- q = electron charge, h = Planck's constant, ν = frequency.

**Full-well capacity & dynamic range** — each pixel is a capacitive charge well; SNR and dynamic
range are set by how many photoelectrons the well can hold before saturating vs. the noise floor:
```
Dynamic Range (dB) = 20 · log10(FWC / noise_floor_electrons)
```
Smaller pixels (0.56–0.8μm on 200MP/108MP sensors, e.g. ISOCELL HP2/HP3/HPX, IMX989 native mode)
have proportionally smaller full-well capacity than large pixels (1.4–2.4μm on 1-inch sensors) —
this is the direct physical reason ultra-high-megapixel small-pixel sensors always ship with
**pixel binning** (Tetra/Quad Bayer, Nonacell, "2×2" or "3×3" binning): summing charge from N
adjacent same-color-filter pixels electrically recreates a larger effective pixel and full well,
trading resolution for dynamic range/low-light SNR in software-selectable modes.

**Shot noise** (fundamental photon-arrival statistics limit, irreducible):
```
σ_shot = sqrt(N_electrons)          → SNR_shot-limited = N_electrons / sqrt(N_electrons) = sqrt(N_electrons)
```
This is why low-light performance scales with photon count collected (pixel area × exposure time ×
aperture), independent of megapixel count — the physics reason "bigger pixels/bigger sensor" beats
"more megapixels" for low-light SNR, holding lens speed constant.

**Dark current** (thermally-generated electrons that mimic signal, the dominant noise source in
long-exposure/night-mode shots):
```
I_dark(T) = I_dark(T₀) · 2^((T-T₀)/T_double)
```
Dark current roughly doubles every ~6-8°C (silicon thermal generation-recombination, Arrhenius-type
temperature dependence) — the physics reason phone night-mode/astrophotography algorithms perform
dark-frame subtraction and why a sensor that has been running hot (heavy video recording) produces
visibly noisier long-exposure stills afterward.

**Rolling shutter** — CMOS sensors (all sensors in §2) read out row-by-row rather than sampling the
whole array simultaneously (which is how CCD/global-shutter sensors work); each row is exposed at a
slightly later time than the one above it (row-to-row skew = 1/(row_rate)), producing the
characteristic "jello" skew artifact on fast-moving subjects or fast pans — a direct readout-
architecture consequence, not a lens or exposure-setting fault.

**Rolling shutter row time (approx):**
```
t_row = t_frame / N_rows
```

---

## Electrical rails (industry-standard 3-rail CMOS sensor power scheme; per OmniVision/Sony public
application-note convention — individual flagship sensor full datasheets are NDA'd to OEMs, see
HURDLES.md)

| Rail | Function | Typical value |
|---|---|---|
| AVDD (analog) | Photodiode bias, analog front-end | 2.5 – 3.0 V (commonly 2.8V) |
| DVDD (digital core) | Digital logic, ADC, timing generator | 1.05 – 1.2 V |
| DOVDD (digital I/O) | MIPI CSI-2 interface I/O | 1.8 V (or 1.2V for low-power MIPI D-PHY) |

Source: OmniVision OV3640 public datasheet (representative smartphone-class CMOS sensor 3-rail
scheme); flagship sensor exact rail specs (IMX989, ISOCELL HP2, etc.) are not publicly posted by
Sony/Samsung LSI (module-integrator NDA data).

- Interface: MIPI CSI-2, D-PHY or C-PHY, typically 4-lane on flagship main sensors, up to
  ~2.5-4.5 Gbps/lane on recent (2023-2026) high-megapixel sensors.
- Readout/frame rate: 8K/30fps or 4K/120fps class on flagship 50-200MP sensors (Sony IMX989 supports
  4K/120fps per vendor press material).

## Real parts (pointer to real_world_phone_components.md §2)

The ~65 sensors listed there (Sony IMX/LYT series, Samsung ISOCELL GN/HP/JN/GW series, OmniVision
OV series, GalaxyCore GC series) are the authoritative real-part list; this file adds the physics
layer. Notable physically-grounded facts about specific named parts, confirmed via public sources:

- **Sony IMX989** — 1" (15.9mm diagonal) sensor, 50.3MP native, 1.6μm pixel pitch after 2×2 binning
  (0.8μm native), 4K/120fps capable. (Source: Sony press material, Ubergizmo/Sammyfans technical
  coverage — full datasheet with FWC/SNR curves not publicly posted; logged as hurdle.)
- **Samsung ISOCELL HP2** — 200MP, 0.6μm native pixel, uses Samsung's "ChameleonCell" adaptive
  pixel-binning (can reconfigure between 0.6μm/1.2μm/2.4μm effective pixel via 1/4/16-pixel binning)
  — a direct hardware implementation of the full-well/binning tradeoff above.
  (Source: Samsung Semiconductor press material.)
- **Sony IMX586 / ISOCELL HMX-era "Quad Bayer" sensors** — first mainstream 48-108MP sensors
  (2019-2020); Quad Bayer color filter array groups 2×2 same-color photosites under one microlens
  region logically, enabling both binned (12-27MP, higher SNR) and full-resolution demosaic modes
  from the same silicon.

## Failure modes (physics-tied, diagnostic-relevant)

- **Hot pixels / stuck pixels** — localized crystal lattice defects (dislocations from stress,
  ESD-induced damage, or radiation-induced) create a permanently elevated dark-current site or a
  photodiode that no longer responds to light; hot pixel count/density increases with sensor age
  and thermal cycling stress (consistent with defect migration from repeated thermal expansion/
  contraction at solder and micro-bump interconnects on the sensor package).
- **Sensor drop/shock cracking** — the sensor die and its microlens/color-filter stack are bonded to
  a ceramic/laminate package; mechanical shock (phone drop) can crack the cover glass over the
  sensor or delaminate the microlens array, producing a partially or fully dead sensor with a
  physically-visible fracture in teardown photos — a mechanical fault manifesting as an electronics/
  optical failure.
- **Ribbon/FPC connector fatigue** — the sensor's flex-PCB connection to the mainboard is a repeated-
  flex point (camera module articulation in folding/sliding phones, or simply repeated thermal
  expansion of the module vs. mainboard); intermittent image-sensor dropout or "camera failed to
  connect" errors frequently trace to FPC connector fatigue rather than sensor die failure —
  important for the fault-diagnosis engine to distinguish (electrical intermittency vs. permanent
  sensor damage) since the repair path differs completely (reseat/replace connector vs. replace
  camera module).
- **Moisture/corrosion ingress** — water damage corrodes the sensor's wire-bond pads or the FPC
  traces (galvanic corrosion, accelerated by any DC bias present — see the general corrosion
  physics note in the passives file, 22_passive_components.md) producing rows/columns of dead
  pixels following the specific bond-wire or column-driver trace that corroded, i.e. the pattern of
  visible artifact is diagnostic of which specific electrical path failed.

**Entry count this file: 1 physics writeup + 3 individually-detailed real parts (IMX989, ISOCELL HP2,
Quad-Bayer generation) + pointer to ~65 real_world_phone_components.md §2 parts + 4 failure modes.**
