# 06 — IMU / Motion Sensors (Accelerometer / Gyroscope / Magnetometer)

Maps to `component_vocabulary.py` types: `accelerometer`, `gyroscope`, `magnetometer`
(domains: instrumentation, electronics, +magnetic for magnetometer). Source list:
`real_world_phone_components.md` §6.

---

## Governing physics

### Capacitive MEMS accelerometer (the dominant phone accelerometer architecture — Bosch BMI/BMA,
ST LSM6D/LIS, TDK InvenSense ICM/MPU families are all capacitive MEMS)

A proof mass suspended on MEMS springs displaces under acceleration; displacement is sensed as a
differential capacitance change between the moving mass and fixed sense electrodes.
```
F = m · a                      (Newton's second law — the physical input)
x = F / k = m·a / k            (spring displacement, k = MEMS spring constant)
C = ε₀ · εr · A / d            (parallel-plate capacitance, d = gap, modulated by x)
ΔC/C ≈ Δd/d  (differential sensing linearizes this around the null point)
```
The sense circuit converts ΔC to a voltage (typically via a switched-capacitor charge amplifier or
a sigma-delta capacitance-to-digital front end), then digitizes it — this is the "electronics" half
of the instrumentation+electronics domain pairing in component_vocabulary.py.

**Noise floor (fundamental)**: Brownian/thermomechanical noise of the proof mass sets a floor
independent of the electronics:
```
a_noise = sqrt(4 · kB · T · ω₀ / (m · Q))
```
kB = Boltzmann constant, T = absolute temp, ω₀ = resonant frequency, Q = mechanical quality factor —
this is why noise density (µg/√Hz) is a fixed datasheet spec per part rather than something firmware
can improve past a limit.

### MEMS gyroscope (vibratory Coriolis-effect gyros — the universal phone gyro architecture)

A MEMS proof mass is driven into resonant oscillation along a "drive" axis; when the sensor rotates
at angular rate Ω, the **Coriolis force** couples energy into an orthogonal "sense" axis:
```
F_coriolis = -2m · (Ω × v)
```
v = drive-axis velocity, Ω = input angular rate. The sense-axis displacement (again capacitively
read out, same C=ε₀εrA/d transduction as the accelerometer) is proportional to Ω for a given drive
velocity — this is why gyro scale-factor stability depends on tightly controlling drive-oscillator
amplitude (usually a PLL-locked closed-loop drive circuit on-chip).

### Magnetometer (Hall-effect, per AKM AK09918 — see below) — `magnetometer` type

Hall-effect sensing: a current-carrying element in a magnetic field develops a transverse (Hall)
voltage:
```
V_H = (I · B) / (n · q · t)
```
I = bias current, B = magnetic flux density (the measured quantity — Earth's field, ~25-65 µT, plus
local ferrous/magnetic interference from the phone's own speaker/haptic/camera-VCM magnets), n = 
charge carrier density, q = electron charge, t = Hall element thickness. This is the physics behind
`magnetic` being an explicit extra domain for magnetometer in component_vocabulary.py (electrical
sensing of a genuinely magnetic, not just electronic, phenomenon).

---

## Real parts with confirmed public datasheet specs

### Bosch BMI270 (6-axis accel+gyro, "widely deployed flagship/midrange IMU" per source file)
- Current consumption: **685 µA typical** in full-ODR aliasing-free operation; accelerometer-only
  low-power mode as low as **10 µA**; suspend mode ~3-5.5 µA depending on feature set.
- Accelerometer noise density: **160 µg/√Hz**.
- Gyroscope noise density: **0.008 dps/√Hz** (performance mode, <7 mdps/√Hz).
- Source: Bosch Sensortec public datasheet (bst-bmi270-ds000.pdf, rev 1.6).

### STMicroelectronics LSM6DSO (6-axis, "flagship-tier IMU, OIS/EIS auxiliary SPI support")
- Supply current: **0.55 mA** in combo (accel+gyro) high-performance mode.
- Configurable operating modes: power-down, ultra-low-power, low-power, normal, high-performance —
  a direct current/noise tradeoff (per the thermomechanical noise equation above: higher Q/bandwidth
  operation costs more current).
- Source: ST public datasheet (st.com/resource/en/datasheet/lsm6dso.pdf).

### TDK InvenSense ICM-42688-P ("flagship-tier high-precision IMU," ICM-4x6xx family member)
- Gyroscope noise density: **2.8 mdps/√Hz**.
- Accelerometer noise density: **65-70 µg/√Hz** (axis-dependent).
- 6-axis low-noise mode current consumption: **0.88 mA**.
- Package: 2.5 × 3 × 0.91 mm, 14-pin LGA.
- Source: TDK public datasheet (ds-000347-icm-42688-p, rev 1.6-1.9).

### AKM AK09918 (3-axis magnetometer, "widely deployed compass sensor across Android flagships")
- Current consumption: **1.1 mA**.
- 16-bit output resolution per axis.
- Package: 0.76 × 0.76 × 0.5 mm (Hall-sensor + ASIC die-level package, one of the smallest
  components in the entire phone BOM).
- Source: AKM public datasheet (akm.com ak09918c-en-datasheet.pdf).

### Legacy note — InvenSense MPU-6500/MPU-6050
"Extremely widely deployed 2013-2018 era 6-axis IMU across nearly all Android OEMs" per source
file — same capacitive-MEMS + Coriolis-gyro physics as above; pre-dates the ultra-low-power
duty-cycled architectures of BMI270-class parts, which is the physical/architectural reason
2013-2018-era phones showed measurably worse always-on step-counting battery drain than post-2020
phones using BMI270/ICM-42688-class always-on low-power modes.

---

## Failure modes (physics-tied)

- **Stiction** — MEMS proof-mass springs can permanently stick to the substrate (van der Waals/
  capillary adhesion) after mechanical shock (drop) or humidity ingress, producing a stuck/flatlined
  axis reading — an unrecoverable mechanical MEMS failure distinct from an electrical fault, and a
  drop-correlated failure the diagnosis engine can flag from event history.
- **Offset/bias drift with temperature** — MEMS spring constant k and damping both have temperature
  coefficients; accelerometer zero-g offset and gyro zero-rate offset both drift with die
  temperature (why datasheets specify a temperature-coefficient-of-offset spec and why runtime
  gyro/accel calibration routines exist in Android sensor HALs).
  the bias
- **Resonant-frequency shift from particulate contamination** — a particle lodged in the MEMS
  cavity changes effective proof mass, shifting ω₀ and therefore both noise floor (per the
  thermomechanical noise equation) and, for the gyro, drive-loop lock behavior — manifests as
  degraded noise performance or intermittent gyro dropout rather than a hard failure.
- **Magnetic interference (magnetometer-specific)** — proximity to the phone's own speaker magnet,
  haptic LRA magnet, or camera VCM magnet (all present in the same phone, all generating local B
  fields far exceeding Earth's ~50µT field at close range) causes compass heading error; this is a
  systemic placement/interference issue rather than a component failure, but is diagnostically
  relevant (a compass fault that correlates with speaker/haptic activation timing points to magnetic
  interference, not sensor damage).
- **Solder-joint fatigue** — same BGA/LGA thermal-cycling fatigue mechanism as other small ICs (see
  01_socs_chipsets.md Coffin-Manson note); intermittent IMU dropout that correlates with thermal
  cycling (not sustained heat) is consistent with a cracked solder joint rather than die damage.

**Entry count this file: 2 governing-physics derivations (capacitive accel, Coriolis gyro) + 1 Hall-
effect magnetometer physics + 4 real parts with confirmed datasheet specs (BMI270, LSM6DSO,
ICM-42688-P, AK09918) + 1 legacy-part physics note (MPU-6500/6050) + 5 failure modes.**
