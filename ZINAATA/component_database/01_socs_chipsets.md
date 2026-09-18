# 01 — SoCs / Chipsets / GPUs / RAM / Flash Storage

Maps to `component_vocabulary.py` types: `soc_processor`, `gpu`, `ram`, `flash_storage`
(domains: electronics, thermal, timing, gpio). Source list: `real_world_phone_components.md` §1.

---

## Governing physics

**CMOS dynamic power dissipation** (the dominant term when a core is active):

```
P_dynamic = α · C_L · V_dd² · f
```
- α = activity factor (fraction of gates switching per clock, ~0.1–0.3 typical for mixed workloads)
- C_L = total switched load capacitance (device/interconnect, scales down with process node)
- V_dd = supply/core rail voltage
- f = clock frequency

This is why DVFS (dynamic voltage/frequency scaling) governors cut voltage *and* frequency together —
power drops with the **square** of voltage, so a modest V_dd cut is more valuable than an equivalent
frequency cut.

**Static/leakage power** (dominant at idle, grows every process shrink since ~28nm due to thinner gate
oxides and short-channel effects):
```
P_static = I_leak · V_dd        (subthreshold + gate + junction leakage summed)
```

**Total die power:**
```
P_total = P_dynamic + P_static + P_short_circuit
```

**Thermal path (Fourier's law / lumped thermal-resistance model)** — this is what actually limits
sustained clock speed on a phone (no fan, no heatsink, just a vapor chamber/graphite sheet and the
chassis as the final heat rejection surface):
```
T_junction = T_ambient + P_total · Rθ_ja
T_junction = T_case + P_total · Rθ_jc          (die-to-package-case)
```
Rθ_ja (junction-to-ambient) for a phone SoC package is not usually published by Qualcomm/MediaTek/
Samsung (OEM-NDA data — see HURDLES.md), but empirically a phone SoC throttles when die temperature
approaches ~95–110°C, well before silicon damage (~125–150°C abs max for typical bulk CMOS), because
sustained high T_j accelerates electromigration and increases leakage current further (a positive
feedback loop — this is why phones throttle *before* the theoretical damage threshold, not at it).

**Electromigration** (long-term interconnect failure mode, Black's equation):
```
MTTF = A · J^(-n) · exp(Ea / kT)
```
- J = current density in the interconnect
- Ea = activation energy (~0.6–0.9 eV for Al, ~0.7–1.0 eV for Cu dual-damascene)
- k = Boltzmann constant, T = absolute temperature
- Higher sustained current density and higher T both shorten MTTF — the physics reason chronic
  thermal throttling / repeated thermal cycling degrades a SoC's long-term reliability, not just
  instantaneous performance.

**Thermal cycling fatigue (solder/BGA joints under the SoC package)** — Coffin-Manson relation:
```
N_f = C · (ΔT)^(-q)
```
Repeated power-on/off and load-driven junction temperature swings (ΔT) fatigue the BGA solder balls
connecting the SoC package to the mainboard; this is a mechanical/thermal fault mode distinct from
the die itself and a real field failure mode ("chip came loose from board" reflow failures in
budget-phone repair shops trace to this).

---

## DRAM (LPDDR5 / LPDDR5X) — `ram` component type

JEDEC JESD209-5B (LPDDR5) / JESD209-5C (LPDDR5X) public standard voltage rails:

| Rail | Function | Typical range |
|---|---|---|
| VDD1 | Core logic supply | 1.70 – 1.95 V |
| VDD2H | Peripheral/bank high rail | 1.01 – 1.12 V |
| VDD2L | Peripheral/bank low rail | 0.87 – 0.97 V |
| VDDQ | I/O termination supply | 0.47 – 0.57 V (LPDDR5X voltage-scaling mode goes lower for power savings) |

Source: Micron/JEDEC public LPDDR5X datasheets (Mouser-hosted Micron MT62F/Y4x datasheets).

- Data rate: LPDDR5 up to 6400 Mbps/pin; LPDDR5X up to 8533–9600 Mbps/pin (device-dependent).
- Refresh physics: DRAM cells are capacitors (a few fF each) that leak charge; refresh interval
  (~32–64ms typical, tightened at high temperature) is a direct application of `Q = CV` and RC leakage
  discharge — the standard doubles refresh rate above 85°C because leakage current rises
  exponentially with temperature (thermionic/diffusion leakage, Arrhenius-type dependence).
- Failure mode: **row-hammer** style disturbance errors are an electrical coupling fault (capacitive/
  electrical crosstalk between adjacent wordlines), not a thermal one; separately, **soft errors**
  from cosmic-ray/alpha-particle induced bit flips are a known DRAM fault mode requiring ECC in
  server contexts (mobile LPDDR generally ships without on-die ECC below LPDDR5, which added
  optional on-die ECC).

## Flash storage (UFS) — `flash_storage` component type

JEDEC JESD220 (UFS) family public voltage rails:

| Rail | Function | Typical range |
|---|---|---|
| VCC | NAND core supply | 2.4 – 3.6 V (UFS 3.1/4.0 commonly spec'd 2.4–2.7V low-voltage NAND) |
| VCCQ | Controller/logic supply | 1.14 – 1.26 V |
| VCCQ2 | I/O / M-PHY supply | 1.7 – 1.95 V (optional — UFS 4.0 can omit dedicated VCCQ2 supply) |

Source: JEDEC UFS spec summaries (Kioxia/Synopsys public technical briefs).

- UFS 4.0 interface: MIPI M-PHY, up to 23.2 Gbps/lane (2-lane = 46.4 Gbps theoretical device peak).
- NAND flash physics: floating-gate (or charge-trap, 3D NAND) transistors store charge representing
  bit state; **program/erase (P/E) cycling wears the tunnel oxide**, raising threshold-voltage
  variance over life — this is the physical root of "flash storage wears out" and why write
  amplification and TBW (terabytes written) ratings exist. 3D NAND (used in essentially all modern
  UFS) rates are typically in the ~1,000–3,000 P/E cycle range for TLC, ~150–600 for QLC (vendor
  datasheet class figures, not phone-specific since OEMs don't publish per-device TBW).
- Failure mode: **read disturb** (repeated reads of neighboring cells slightly alter charge on a
  target cell — same charge-leakage/coupling physics as DRAM row-hammer but for NAND), and
  **retention loss** (trapped charge in the floating gate leaks over years, worse at high
  temperature and high P/E-cycle wear — an Arrhenius-type acceleration, the reason NAND datasheets
  specify retention time at a reference temperature, e.g., 1 year at 30°C for a worn TLC part).

## GPU (integrated in SoC) — `gpu` component type

Same CMOS power/thermal physics as the CPU cluster above (P=αCV²f, thermal-resistance junction
model) — GPUs typically run a higher activity factor α during sustained 3D rendering than CPU cores
do during typical UI/app workloads, which is why sustained gaming is the most common real-world
thermal-throttling trigger in phones (higher α × similar V,f → higher P_dynamic, sustained not
bursty like CPU).

- Real parts from `real_world_phone_components.md`: Adreno 750/830/890 (Qualcomm, paired with SD8
  Gen3/8 Elite/8 Elite Gen5), Adreno 740 (SD8 Gen2), Adreno 730 (SD8 Gen1), Mali-G720 Immortalis
  (Dimensity 9400), Mali-G715 Immortalis (Dimensity 9200), Xclipse 940/920 (Samsung/AMD RDNA3/RDNA2
  based, Exynos 2400/2200).
- Xclipse is notable: it's a derivative of AMD RDNA desktop/console GPU IP adapted to a mobile power
  envelope — same underlying compute-unit architecture, radically different V/f operating point
  (desktop RDNA runs ~1.0-2.9GHz at up to ~1.1-1.2V; Xclipse mobile implementation is tuned to a
  fraction of that clock and voltage to fit a ~5-8W GPU power budget vs. a discrete GPU's 150-300W).

## SoC process node → physics relevance

Process node (3nm/4nm/5nm/6nm TSMC or Samsung foundry) sets transistor gate capacitance and
threshold voltage, which directly sets both P_dynamic and P_static coefficients above. Smaller node
= lower C_L per transistor (good for P_dynamic) but generally *higher* leakage per transistor unless
offset by FinFET/gate-all-around structural improvements — this is why raw node number alone doesn't
predict efficiency; TSMC N3E (Snapdragon 8 Elite, Dimensity 9400) vs. Samsung 4nm (Exynos 2400,
Tensor G4) have historically shown measurably different power efficiency at the same "class" of node
due to differing leakage control, which is empirically visible in phone battery-life/thermal reviews
even though neither foundry publishes leakage-current specs for these products.

---

## Real parts referenced (from real_world_phone_components.md §1) — status

All part numbers, node processes, GPU pairings, and market-deployment mappings listed there
(Snapdragon 8-series through 4-series, Dimensity 9000–6000 series, Exynos 2400–850, Tensor G1–G5,
Unisoc T-series, legacy Kirin) are treated as accurate per public vendor press materials and
spec-aggregator sources (GSMArena, NanoReview, Wikipedia SoC list pages) — this is standard
"vendor-published, market-deployed" data per that file's own sourcing note. No additional part
numbers are added here since that file's SoC list is already comprehensive for the physics types in
`component_vocabulary.py` (soc_processor, gpu).

**What is genuinely NOT publicly available for any of these parts** (logged in HURDLES.md): exact
TDP in watts, junction temperature throttle/max ratings, exact core-rail voltage curves per
frequency bin (DVFS tables), and Rθ_ja/Rθ_jc package thermal resistance. These are OEM-NDA
engineering data Qualcomm/MediaTek/Samsung do not publish in open datasheets — third-party
measured/estimated TDP figures (e.g., "Snapdragon 8 Elite Gen 5 measured 20-24W under sustained
load") from tech press are cited above as measured-in-the-field approximations, not datasheet specs.

**Entry count this file: 1 physics/domain writeup covering 3 component-vocabulary types (soc_processor,
gpu partially) + 2 component types with real JEDEC-standard electrical specs (ram, flash_storage) +
all SoC/GPU real parts already catalogued in real_world_phone_components.md §1 (~90 SoC parts, ~20 GPU
parts) referenced by pointer rather than re-listed.**
