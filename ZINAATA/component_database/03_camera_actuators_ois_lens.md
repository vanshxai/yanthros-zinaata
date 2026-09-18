# 03 — Camera Actuators, OIS & Lens Modules

Maps to `component_vocabulary.py` type: `lens_actuator` (domains: magnetic, mechanical,
electronics — AF/OIS voice-coil motor). Source list: `real_world_phone_components.md` §3.

---

## Governing physics

### Voice Coil Motor (VCM) — autofocus, the dominant AF actuator technology (Alps Alpine, Mitsumi,
TDK, LG Innotek, SEMCO, Jahwa — 60%+ combined market share per source file)

VCM autofocus is a direct application of the **Lorentz force law**: a coil carrying current in a
permanent-magnet field experiences a force proportional to current.
```
F = N · B · I · L
```
- N = number of coil turns, B = magnetic flux density from the permanent magnet (typically NdFeB in
  phone VCMs), I = drive current, L = effective conductor length in the field.
- The lens barrel is suspended on springs (leaf springs or a ball-guide rail); at equilibrium the
  Lorentz force balances the spring restoring force `F_spring = k·x`, so **position is set by
  current, not voltage** — VCM driver ICs are current-mode (closed-loop current regulation) for
  this reason, and a VCM's positional repeatability depends on both magnetic linearity and spring
  hysteresis.
- Typical drive current for a phone AF VCM: on the order of 50–120mA at ~2.8–3.0V supply
  (class-level figures; individual vendor VCM datasheets are OEM-module-level, not published — see
  HURDLES.md). Closed-loop VCMs add a Hall-effect position sensor for feedback (open-loop VCMs rely
  purely on the spring/current relationship and drift more with temperature since spring constant k
  and magnet B both have small temperature coefficients).
- Resonant/settling behavior: the coil-magnet-spring system is a damped 2nd-order mechanical
  oscillator; autofocus "hunting" (visible focus oscillation before settling) is this system's
  step response with under-damped ringing — a mechanical/control-loop fault when excessive
  (worn damping, debris in the guide rail) rather than a pure electronics fault.

### OIS (Optical Image Stabilization) — same VCM/Lorentz-force actuator technology, driven in a
closed feedback loop against a gyroscope reference

- OIS uses a 2-axis (pitch/yaw, sometimes with a 3rd roll axis on flagships) VCM or piezo stage to
  shift the lens or sensor to counteract hand-shake angular velocity measured by a dedicated
  high-bandwidth gyroscope (often a separate OIS-grade gyro distinct from the phone's main IMU, or
  the main IMU's auxiliary SPI output — see `06_imu_motion_sensors.md`).
- Control loop: gyro angular rate → integrated to angle error → PID/lead-lag compensator → VCM
  current command → Lorentz force → lens displacement, closed around a Hall-effect position sensor.
  Bandwidth is typically tens of Hz (enough to counteract ~1-10Hz hand tremor) — a classic
  mechatronic feedback control system, not a pure sensor or pure actuator problem, which is why
  OIS faults can originate in the gyro, the Hall sensor, the driver IC, or the mechanical suspension
  independently.

### SMA (Shape Memory Alloy) actuators — Alps Alpine (mass production since 2023), IP licensed from
Cambridge Mechatronics — used in slim flagship camera modules for compact OIS/AF

- Physics: a NiTi (Nitinol) wire actuator contracts when resistively heated above its
  austenite transformation temperature (typically ~70-90°C for camera-actuator-grade alloys) and
  returns to its longer martensite-phase length on cooling — actuation is via **Joule heating**
  (`P = I²R`) driving a solid-state phase transformation, not a magnetic field.
- Advantages over VCM: no permanent magnet (smaller module thickness, good for slim phones), higher
  force density; disadvantage: thermal actuation is inherently slower to settle and more
  temperature-cross-sensitive than a Lorentz-force VCM (ambient temperature affects the wire's
  resting resistance and the required current to reach transformation temperature) — a real,
  physics-grounded fault-diagnosis distinguishing point (an SMA-actuated OIS module misbehaving
  specifically in cold conditions is consistent with SMA's known thermal-actuation sensitivity).

### Piezoelectric actuators — Alps Alpine, used in periscope/continuous-zoom modules

- Physics: converse piezoelectric effect — an applied voltage across a piezoceramic (typically PZT)
  element produces mechanical strain:
  ```
  x = d33 · V     (simplified single-axis case; d33 = piezoelectric charge/strain constant)
  ```
- Piezo actuators offer very fast response and fine positional resolution (good for continuous
  optical zoom's need for precise, repeatable lens-group spacing) but require higher drive voltages
  (often tens of volts, stepped up from the phone's low-voltage rails by a dedicated piezo driver
  IC) than VCM's few-hundred-mA/low-voltage drive.

### Lens elements (Largan Precision, Sunny Optical, GSEO, Kantatsu)

- Not an electrical component — governing physics is geometric/wave optics (Snell's law refraction
  at each element surface, chromatic aberration from wavelength-dependent refractive index,
  diffraction-limited resolution at small apertures). Included here for completeness per the source
  catalog; no electrical fault-diagnosis relevance beyond mechanical/optical defects (scratches,
  delamination of anti-reflective coatings, moisture haze between elements).

---

## Failure modes

- **VCM spring fatigue / mechanical wear** — repeated focus-stroke cycling fatigues the suspension
  springs (classic metal fatigue, S-N curve behavior); symptom is AF hunting, slow settling, or a
  lens that sags/tilts under gravity when powered off (loss of spring centering force).
- **Debris/dust ingress in the guide rail** — increases friction (mechanical, not electrical), the
  VCM current-to-position relationship becomes nonlinear/sticky ("stiction"), producing jerky
  autofocus steps.
- **Hall sensor drift or failure (closed-loop VCMs)** — position feedback error causes persistent
  focus offset or complete AF failure with the coil itself electrically healthy — a good example of
  why the fault-diagnosis engine should distinguish "actuator" vs. "position sensor" failure modes
  within a single lens_actuator component.
- **SMA wire fatigue/fracture** — repeated phase-transformation cycling of the NiTi wire under load
  can eventually fatigue-crack the wire (a known Nitinol actuator wear-out mechanism in the broader
  SMA-actuator literature), producing a hard actuator failure (complete loss of AF/OIS on that axis)
  rather than gradual drift.
- **Magnet demagnetization** — VCM permanent magnets can lose field strength under sustained high
  temperature (phone thermal events, e.g., SoC throttling heat soak) approaching the magnet's Curie-
  adjacent thermal limits for consumer NdFeB grades (typically rated to ~80-150°C depending on
  grade) — reduces Lorentz force for a given current, shifting the current-to-position calibration
  and degrading AF range/speed without a hard failure.

## Hurdle note

No vendor (Alps Alpine, Mitsumi, TDK, LG Innotek, SEMCO, Jahwa) publishes public component-level
datasheets for phone camera VCM/SMA/piezo actuators — these are module-level parts sold directly
into OEM camera-module BOMs under NDA, unlike a general-purpose IC. All electrical figures above
(drive current, voltage) are class-level/typical figures drawn from the general VCM actuator
literature, not a specific named part's datasheet. Logged in HURDLES.md.

**Entry count this file: 4 physics-grounded actuator technologies (VCM, OIS control loop, SMA,
piezo) + lens optics note + 4 failure modes, covering the lens_actuator component type comprehensively.**
