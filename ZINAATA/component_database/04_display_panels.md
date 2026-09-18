# 04 — Display Panels (OLED/AMOLED/LCD)

Maps to `component_vocabulary.py` type: `display_panel` (domains: electronics, thermal).
Source list: `real_world_phone_components.md` §4.

---

## Governing physics

### OLED / AMOLED electroluminescence (Samsung Display, BOE, Visionox, Tianma, CSOT panels)

An OLED pixel is fundamentally a **current-driven diode-like device**: organic emissive layers emit
photons when electron-hole pairs recombine, with luminance proportional to current density through
the stack, not voltage (a critical distinction from LCD, which is voltage-driven):
```
L (luminance) ∝ J (current density through the OLED stack)
```
Each subpixel's drive current comes from a TFT in a 2T1C (2-transistor-1-capacitor, or more complex
compensated variants) pixel circuit operating in saturation:
```
I_OLED = K · (V_gs - V_th)²
```
K = process/geometry-dependent TFT current-gain factor, V_gs = driving TFT gate-source voltage
(set by the stored pixel data voltage on the storage capacitor), V_th = TFT threshold voltage.
Because V_th varies pixel-to-pixel (process variation) and drifts with the TFT's own aging, modern
AMOLED pixel circuits use internal or external V_th-compensation schemes — this is a direct physical
cause of **OLED burn-in/differential aging**: pixels that have historically driven higher average
current (status bar icons, nav bar) age their emissive material and/or shift driving-TFT V_th faster
than lower-duty-cycle pixels, producing a persistent luminance/color offset ("burn-in ghost image")
that is a genuine physical degradation, not a software artifact.

### Backplane technology — direct physics of the "LTPO/LTPS/a-Si TFT" distinction in the source file

- **a-Si (amorphous silicon) TFT** — lowest carrier mobility (~0.5-1 cm²/V·s), used only in budget
  LCD backplanes; cannot support variable refresh efficiently because a-Si TFTs leak charge off the
  storage capacitor relatively fast, forcing frequent refresh.
- **LTPS (Low-Temperature Polysilicon) TFT** — carrier mobility ~50-100 cm²/V·s (100x higher than
  a-Si), enables smaller/faster driving TFTs and the higher pixel density and stepped refresh rates
  used in midrange AMOLED panels.
- **LTPO (Low-Temperature Polycrystalline Oxide)** — hybrid backplane combining LTPS driving TFTs
  with an IGZO (indium-gallium-zinc-oxide) switching TFT in each pixel. IGZO's very low off-state
  leakage current lets the storage capacitor hold its charge far longer, so the panel can drop
  refresh rate to 1Hz for static content (extending storage-cap hold time, directly a leakage-current/
  RC-decay physics benefit) while still hitting 120Hz for motion — this is the actual physical
  mechanism behind LTPO's power savings, not just "software refresh rate switching."

### LCD (non-emissive panels — BOE/Tianma/CSOT/Innolux/AUO LCD lines in the budget tier)

Twisted-nematic or IPS liquid crystal physics: an applied electric field reorients the liquid
crystal molecules' optical axis, modulating polarized backlight transmission through a
polarizer/LC-cell/polarizer stack (field-induced birefringence, not emission) — LCD panels require a
separate backlight (LED array + light guide), which is why LCD phones have a distinct thermal/power
profile (backlight power roughly constant regardless of displayed content) vs. OLED (power scales
with average pixel luminance/content, near-zero for true black).

---

## Thermal relevance (why `thermal` is a listed domain for display_panel)

Both the OLED driving TFT stage and the panel's local DDIC produce resistive (I²R) and switching
losses; sustained high-brightness operation (outdoor use, video recording with screen on) is a real,
measurable heat source contributing to overall phone thermal load, additive to the SoC's own heat —
relevant because a phone showing thermal throttling correlated with screen-on high-brightness use
(not just CPU/GPU load) implicates the display driving path, not the SoC, as at least a contributing
heat source.

---

## Failure modes (physics-tied)

- **Burn-in / differential OLED aging** — see electroluminescence section above; a direct
  consequence of the OLED material's luminance-vs-cumulative-current relationship, cannot be
  "fixed" by recalibration alone since it's physical organic-material degradation (reduced emissive
  efficiency at the pixel level), only compensated for.
- **Green/pink tint / dead pixel row-column patterns** — degradation or open-circuit failure of a
  specific gate line or data line in the TFT backplane manifests as a linear (row or column) visual
  defect, directly diagnostic of *which* backplane trace failed vs. a randomly distributed dead-
  pixel pattern (which instead implicates individual pixel-circuit/emissive-layer defects).
- **Display flex cable (FPC) fatigue / disconnection** — same repeated-flex fatigue mode as camera
  FPCs (see 02_camera_image_sensors.md); in foldable phones the display's own flexible substrate
  undergoes continuous bending-fatigue stress at the fold crease, a mechanical fatigue mode unique
  to foldable AMOLED (UTG-covered) panels not present in rigid-panel phones.
- **LCD backlight LED failure / non-uniform backlight aging** — LED backlight strings age
  (luminous-flux decay, same LED physics as 24_camera_flash_status_leds.md) unevenly if any LEDs in
  the string run at different forward current due to manufacturing tolerance, producing visible
  backlight uniformity/color-temperature drift over the panel's life — an LCD-specific failure mode
  that has no OLED equivalent (OLED has no separate backlight to degrade).
- **Moisture ingress / TFT corrosion** — water/electrolyte ingress corrodes the TFT backplane's
  metal traces (same electrochemical corrosion physics noted throughout this database), producing
  localized dead zones or a spreading dark/discolored patch that grows over time as corrosion
  continues — a diagnostically distinct pattern (grows over days/weeks) from an instantaneous
  mechanical-impact crack.

## Real parts (pointer to real_world_phone_components.md §4)

Samsung Display M11-M13 (Dynamic AMOLED 2X, LTPO), BOE Q9/B16 (flexible LTPO/AMOLED), Visionox,
Tianma LTPS, CSOT flexible AMOLED, legacy LG Display P-OLED/JDI/Sharp IGZO/Innolux/AUO LCD lines —
all listed there are panel-integrator-level parts; individual subpixel electrical specs (exact
driving voltage, exact TFT V_th) are not publicly published per named panel (fab-process trade
secret, OEM-NDA calibration data) — logged as a hurdle.

**Entry count this file: 3 governing-physics derivations (OLED electroluminescence + TFT drive
equation, backplane mobility/leakage comparison, LCD birefringence) + 5 failure modes + pointer to
~20 real panel/backplane entries in source file.**
