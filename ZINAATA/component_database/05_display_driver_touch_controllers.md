# 05 — Display Driver ICs (DDIC) & Touch Controllers

Maps to `component_vocabulary.py` types: `display_panel` (DDIC is part of the display electronics
path) and `touch_digitizer` (domains: instrumentation, electronics). Source list:
`real_world_phone_components.md` §5.

---

## Governing physics

### DDIC (Display Driver IC) — Samsung S6E3HA/FC, Novatek NT36672A/NT36523, Himax HX83xx, Synaptics
R63350/R69

The DDIC converts the MIPI DSI (Display Serial Interface) digital pixel stream into the analog gate/
source-line drive waveforms the panel backplane needs. Key electrical functions with direct physics:
- **Gamma correction DACs** generate the discrete analog voltage levels applied to each data line;
  for an OLED panel these voltages ultimately set V_gs on each pixel's driving TFT (see 
  `I_OLED = K·(V_gs - V_th)²` in 04_display_panels.md) — DDIC output voltage accuracy directly sets
  color/luminance accuracy.
- **Source-line driving** must charge each data line's parasitic capacitance within one line time;
  this is an RC-charging problem (`t = RC·ln(...)` settling), which is why higher-resolution,
  higher-refresh-rate panels require DDICs with higher output-driver current capability — a real
  bandwidth/current tradeoff, not just a digital logic speed issue.
- **TDDI (Touch and Display Driver Integration)** — Himax HX852x combines both DDIC and touch-sensing
  front end on one die, sharing the panel's own electrode stack for touch sensing (common in budget
  LCD TDDI designs to save one chip and one FPC in the BOM).

### Touch controller (capacitive sensing) — FocalTech FT8xxx, Goodix GT9xx, Synaptics
ClearPad/TouchPoint

**Mutual capacitance sensing** (the standard architecture for phone touchscreens): a grid of drive
and sense electrodes forms an intentional capacitance at each row/column intersection (node):
```
C_mutual = ε₀ · εr · A_overlap / d
```
A finger (a grounded/high-permittivity conductive object) approaching an intersection **diverts**
some of the electric field lines between drive and sense electrodes to itself, *reducing* the
measured mutual capacitance at that node:
```
ΔC = C_mutual(no touch) − C_mutual(touch present)
```
The controller scans drive lines sequentially, measures the induced charge on each sense line via a
charge amplifier, and thresholds ΔC per node to detect touch — this scanning architecture is what
natively supports **multi-touch** (every node is independently addressable), unlike older
self-capacitance-only single-touch designs.

**Self-capacitance** (used for adjunct features like glove-mode/hover sensing on some controllers):
measures each electrode's capacitance to ground directly (`C = ε₀εrA/d` to the finger/ground rather
than to a paired electrode) — more sensitive at long range (through-glove, hover) but cannot
natively resolve multi-touch ("ghost touch" ambiguity between simultaneous touches) without the
mutual-capacitance grid.

**Sampling/report rate**: touch controllers scan the full electrode grid at a fixed report rate
(commonly 120-240Hz on gaming-tier phones, 60-120Hz mainstream) — each full-grid scan is a discrete
sampled-data system, and touch latency is fundamentally bounded by scan time (`N_nodes / scan_rate`)
plus debounce/filtering delay in firmware.

---

## Failure modes (physics-tied)

- **"Ghost touch" / phantom touch events** — most commonly a **moisture film** on the cover glass or
  ingress into the touch FPC connector: a thin conductive water film locally changes the effective
  εr/coupling at affected nodes, producing spurious ΔC crossing the touch threshold — a direct
  electrical consequence of water's high relative permittivity (εr≈80 vs. ~1 for air) sitting in the
  sensing field. This is diagnostically distinguishable from a firmware/digitizer-die fault by its
  correlation with humidity/liquid exposure events and typically transient/intermittent nature.
- **Cracked cover glass / digitizer layer separation** — a physical break in the glass or ITO
  (indium tin oxide) sensing-electrode layer creates open or shorted electrode traces at the crack
  line, producing a dead-zone strip that follows the crack geometry (mechanical fault, electrically
  diagnosable by its precise geometric correlation with visible glass damage).
- **DDIC output-driver degradation / electromigration** — same electromigration physics as SoC
  interconnects (Black's equation, see 01_socs_chipsets.md) applies to the DDIC's own output driver
  transistors, which see repeated high-current pixel-charging cycles over the phone's life; gradual
  column/row line dimming or color-shift localized to specific pixel columns is consistent with this
  wear mechanism.
- **FPC/bonding (COF - Chip-on-Film) fatigue** — the DDIC is typically bonded to a flexible COF strip
  that folds behind the panel; repeated flex (folding phones) or a single sharp bend stress (drop,
  disassembly during repair) can crack COF traces, producing partial or total display/touch failure
  that is mechanically, not electrically, rooted.
- **ESD (electrostatic discharge) damage** — touch digitizers, by design, present a large capacitive
  sensing surface at the phone's outer glass — a common ESD ingress path; controller ICs include ESD
  protection diodes/TVS structures at each sensing pin, but repeated or extreme ESD events can
  degrade protection-diode leakage characteristics over time, gradually raising noise floor on
  affected channels before an eventual hard failure.

## Real parts (pointer to real_world_phone_components.md §5)

Samsung S6E3HA/FC DDIC, Novatek NT36672A/NT36672C/NT36523, Himax HX83xx, Synaptics R63350/R69,
FocalTech FT8xxx, Goodix GT9xx, Synaptics ClearPad/TouchPoint, Himax HX852x TDDI — all listed there.
No vendor publishes a public consumer-facing datasheet with electrical specs for these display-
integrator-only parts (NDA'd to panel/OEM integrators exclusively, unlike e.g. a general-purpose MCU
or sensor IC sold on Digikey/Mouser) — logged as a hurdle.

**Entry count this file: 2 governing-physics derivations (DDIC gamma/RC-charging, mutual/self
capacitance touch sensing) + 5 failure modes + pointer to ~8 real parts in source file.**
