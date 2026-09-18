# Phone Hardware Physics / EE Specification Database

## Purpose

This database defines physics-grounded electrical, electronic, mechanical, thermal, and failure-model parameters for phone hardware.

It is intended for a **phone-hardware diagnostic engine**, not for collecting marketing specifications.

The database should prioritize:

- Datasheet-level electrical ratings
- Physics and governing equations
- Component failure physics
- Real manufacturer part numbers
- Source citations
- Explicit uncertainty when data is unavailable

> **Hard rule:** Never invent a part number, numeric specification, or phone-specific parameter. If a value cannot be publicly verified, mark it as unknown/NDA or provide only a clearly labelled generic class-level model.

---

## Scope

### 35 component types

| Domain | Component types |
|---|---|
| Compute | `soc_processor`, `ram`, `flash_storage`, `gpu` |
| Power | `battery`, `charging_ic`, `voltage_regulator`, `usb_c_port` |
| Display/Input | `display_panel`, `touch_digitizer`, `fingerprint_sensor` |
| Camera | `image_sensor`, `lens_actuator`, `camera_flash_led` |
| Motion/Environment | `accelerometer`, `gyroscope`, `magnetometer`, `barometer`, `proximity_sensor`, `ambient_light_sensor` |
| Audio/Haptics | `microphone`, `speaker`, `haptic_motor` |
| Radios | `wifi_module`, `bluetooth_module`, `nfc_module`, `cellular_modem`, `gps_gnss_receiver`, `antenna` |
| Passive/Discrete | `pcb_passive`, `mosfet_transistor`, `status_led`, `pcb_connector` |
| Thermal | `thermal_sensor` |
| Chassis | `chassis_frame` |

---

## 24 Engineering Categories

1. SoCs / Chipsets
2. Camera Image Sensors
3. Camera Actuators / OIS / Lens
4. Display Panels
5. Display Driver ICs & Touch Controllers
6. IMU / Motion Sensors
7. Fingerprint Sensors
8. Battery Chemistry / Cells
9. Charging ICs / PMICs
10. Modems / Cellular Baseband
11. WiFi / Bluetooth / NFC / UWB Combo Chips
12. GPS / GNSS Chips
13. RF Front-End
14. Audio Codecs / DACs / Amplifiers
15. Haptic Motors & Drivers
16. USB-C Controllers & Connectors
17. NFC Controllers & Secure Elements
18. Barometers
19. Proximity & Ambient Light Sensors
20. MEMS Microphones
21. Speakers
22. Passive Components
23. Chassis / Frame / Cover Materials
24. Camera Flash / Status LEDs

---

# Data Model

Every component record should preferably contain:

```text
component_type
category
manufacturer
part_number
technology
physical_principle
supply_voltage
operating_voltage_range
current_rating
power_rating
resistance
capacitance
inductance
frequency_range
thermal_rating
noise
sensitivity
tolerance
mechanical_parameters
failure_modes
failure_physics
governing_equations
source
source_type
verification_status
notes
```

## Verification status

Use explicit provenance states:

| Status | Meaning |
|---|---|
| `datasheet_verified` | Numeric value directly verified from a manufacturer datasheet |
| `manufacturer_verified` | Manufacturer documentation/product page verifies the value |
| `teardown_verified` | Physical phone teardown identifies the component |
| `physics_derived` | Calculated from verified parameters/equations |
| `typical_class_value` | Generic value representative of the component class |
| `unknown` | No reliable public value found |
| `nda` | Likely available only through OEM/vendor documentation |

Never mix these categories silently.

---

# Physics Library

## Resistors

Ohm's law:

\[
V=IR
\]

Power:

\[
P=VI=I^2R=\frac{V^2}{R}
\]

Temperature coefficient:

\[
R(T)=R_0[1+\alpha(T-T_0)]
\]

Failure physics:

- Open circuit
- Resistance drift
- Cracking
- Thermal overstress
- Corrosion-driven resistance increase

---

## Capacitors

Charge:

\[
Q=CV
\]

Current:

\[
i=C\frac{dV}{dt}
\]

RC time constant:

\[
\tau=RC
\]

Energy:

\[
E=\frac{1}{2}CV^2
\]

Failure physics:

- Capacitance loss
- ESR increase
- MLCC cracking
- Short circuit
- Leakage-current increase

---

## Inductors

Voltage:

\[
V=L\frac{di}{dt}
\]

Stored energy:

\[
E=\frac{1}{2}LI^2
\]

Failure physics:

- Core saturation
- Winding open
- Winding short
- DCR increase
- Thermal damage

---

## MOSFETs

Important parameters:

- \(V_{GS}\)
- \(V_{DS}\)
- \(I_D\)
- \(R_{DS(on)}\)
- Gate charge
- Switching time

Conduction loss:

\[
P_{cond}=I_{RMS}^2R_{DS(on)}
\]

Approximate switching loss:

\[
P_{sw}\approx\frac{1}{2}V_{DS}I_D(t_r+t_f)f_s
\]

Junction temperature:

\[
T_J=T_A+P_{loss}R_{\theta JA}
\]

Failure physics:

- Drain-source short
- Gate oxide damage
- Thermal runaway
- Avalanche damage
- Increased \(R_{DS(on)}\)

---

## Diodes / LEDs

Shockley equation:

\[
I=I_S\left(e^{qV/(nkT)}-1\right)
\]

Electrical power:

\[
P=VI
\]

LED junction temperature:

\[
T_J=T_A+P_DR_{\theta JA}
\]

Failure physics:

- Open junction
- Short circuit
- Thermal degradation
- Reduced optical output
- Bond-wire failure

---

## Battery

Terminal-voltage approximation:

\[
V_{terminal}=V_{OCV}(SOC)-IR_{int}
\]

Power:

\[
P=VI
\]

Joule heating:

\[
P_{heat}=I^2R_{int}
\]

Energy:

\[
E=\int V(t)I(t)\,dt
\]

Failure physics:

- Internal resistance increase
- Capacity fade
- SEI growth
- Lithium plating
- Gas generation / swelling
- Internal short
- Thermal runaway

---

## Buck / Switching Regulators

Ideal buck relationship:

\[
V_{out}\approx DV_{in}
\]

Inductor equation:

\[
V_L=L\frac{di}{dt}
\]

Conduction loss:

\[
P_{cond}=I_{RMS}^2R_{DS(on)}
\]

Switching loss:

\[
P_{sw}\approx\frac{1}{2}V_{DS}I_D(t_r+t_f)f_s
\]

Failure physics:

- MOSFET short
- Inductor saturation
- Capacitor ESR increase
- Feedback failure
- Thermal shutdown
- Output over/undervoltage

---

## MEMS Accelerometer

Mass-spring-damper model:

\[
m\ddot{x}+c\dot{x}+kx=ma
\]

Capacitive sensing:

\[
C=\frac{\epsilon A}{d}
\]

Failure physics:

- MEMS stiction
- Mechanical shock
- Offset drift
- PCB strain
- Moisture contamination
- Temperature drift

---

## MEMS Gyroscope

Coriolis force:

\[
F_C=2m(\vec{\Omega}\times\vec{v})
\]

Failure physics:

- Mechanical shock
- Bias drift
- Resonance changes
- MEMS damage
- Temperature-dependent offset

---

## Photodiode / Optical Sensors

Photocurrent:

\[
I_{ph}=R_\lambda P_{opt}
\]

Shot noise:

\[
i_n=\sqrt{2qI\Delta f}
\]

Time-of-flight:

\[
d=\frac{ct}{2}
\]

Failure physics:

- Optical contamination
- Emitter degradation
- Photodiode damage
- Optical misalignment
- Ambient-light saturation

---

## Voice-Coil Actuators

Electromagnetic force:

\[
F=BLI
\]

Back EMF:

\[
V_{bemf}=K_e\omega
\]

Electrical model:

\[
V=Ri+L\frac{di}{dt}+K_e\omega
\]

Mechanical model:

\[
m\ddot{x}+c\dot{x}+kx=F
\]

Failure physics:

- Coil open/short
- Mechanical friction
- Magnet displacement
- Suspension damage
- Driver failure

---

## Haptic LRA / ERM

Mechanical resonance:

\[
f_0=\frac{1}{2\pi}\sqrt{\frac{k}{m}}
\]

The diagnostic model should track:

- Drive voltage
- Drive current
- Coil resistance
- Resonant frequency
- Amplitude
- Temperature

Failure physics:

- Coil open/short
- Resonance shift
- Mechanical friction
- Magnet damage
- Driver overheating

---

## Speaker

Electromagnetic force:

\[
F=BLI
\]

Electrical load:

\[
P=\frac{V_{RMS}^2}{R}
\]

Approximate mechanical resonance:

\[
f_0\approx\frac{1}{2\pi}\sqrt{\frac{k}{m}}
\]

Failure physics:

- Voice-coil open/short
- Coil rubbing
- Membrane damage
- Magnet displacement
- Water damage
- Connector corrosion

---

## Antenna / RF

Wavelength:

\[
\lambda=\frac{c}{f}
\]

Antenna impedance:

\[
Z_A=R+jX
\]

Reflection coefficient:

\[
\Gamma=\frac{Z_L-Z_0}{Z_L+Z_0}
\]

VSWR:

\[
VSWR=\frac{1+|\Gamma|}{1-|\Gamma|}
\]

Return loss:

\[
RL=-20\log_{10}|\Gamma|
\]

Free-space path loss:

\[
FSPL_{dB}=20\log_{10}\left(\frac{4\pi d}{\lambda}\right)
\]

Failure physics:

- Antenna fracture
- Corroded contact
- Matching-network damage
- RF switch failure
- PA overheating
- Grounding/shielding defects

---

## Thermal

Fourier's law:

\[
Q=-kA\frac{dT}{dx}
\]

Thermal resistance:

\[
R_\theta=\frac{\Delta T}{P}
\]

Junction temperature:

\[
T_J=T_A+PR_\theta
\]

Failure physics:

- Thermal runaway
- Solder fatigue
- Component derating
- Battery degradation
- Semiconductor leakage increase

---

# Verified Example Parts

## Bosch BMI270 — IMU

Public manufacturer data includes:

- VDD: 1.7–3.6 V
- VDDIO: 1.2–3.6 V
- Accelerometer noise density: 160 µg/√Hz
- Gyroscope noise density: 0.007 dps/√Hz
- Temperature range: −40 to +85 °C
- Accelerometer ODR up to 1.6 kHz
- Gyroscope ODR up to 6.4 kHz

Source: Bosch Sensortec BMI270 documentation.

---

## TI BQ25895 — Charger IC

Public manufacturer data includes:

- Input voltage: 3.9–14 V
- Charge current: up to 5 A
- Battery regulation: 3.84–4.6 V
- Switching frequency: 1.5 MHz
- Charge-voltage regulation: ±0.5%
- Charge-current regulation: ±5%
- Battery discharge MOSFET: 11 mΩ

Source: Texas Instruments BQ25895 datasheet/product documentation.

---

## TI DRV8601 — Haptic Driver

Public manufacturer data includes:

- Supply: 2.5–5.5 V
- Output current: 400 mA
- Typical quiescent current: 1.7 mA
- Shutdown current: 10 nA
- ERM/LRA support
- Thermal and short-circuit protection

Source: Texas Instruments DRV8601 documentation.

---

## TI TAS2560 — Audio Amplifier

Public manufacturer data includes:

- Class-D mono smart amplifier
- Output power: 5.6 W
- Power stage: 2.7–8.5 V
- Minimum load: 4 Ω
- THD+N at 1 kHz: 0.004%
- Analog supply: 2.9–5.5 V
- Operating temperature: −40 to +85 °C

Source: Texas Instruments TAS2560 documentation.

---

## NXP PN7160 — NFC Controller

Public manufacturer data includes:

- Host supply: 1.8 or 3.3 V
- RF driver supply: 2.7–5.25 V
- RF-driver current: 250 mA maximum
- Receiver sensitivity: 20 mVpp
- I²C up to 3.4 Mb/s
- SPI up to 7 Mb/s

Source: NXP PN7160 documentation.

---

## Bosch BMP390 — Barometer

Public manufacturer data includes:

- RMS pressure noise down to 0.02 Pa
- Maximum sampling rate: 200 Hz
- Temperature coefficient of offset: ±0.6 Pa/K
- Long-term stability: ±0.16 hPa / 12 months
- Package: 2 × 2 × 0.75 mm

Source: Bosch Sensortec BMP390 documentation.

---

## ST VL53L1X — Time-of-Flight Sensor

Public manufacturer data includes:

- 940-nm infrared emitter
- SPAD receiver
- Integrated optics
- Ranging up to approximately 4 m
- Ranging frequency up to 50 Hz

Source: STMicroelectronics VL53L1X documentation.

---

# Diagnostic Failure-Physics Layer

The database should not merely store:

```text
component -> specification
```

It should ultimately support:

```text
component
    ↓
physical parameters
    ↓
governing equations
    ↓
expected electrical/physical signature
    ↓
measured signature
    ↓
deviation
    ↓
candidate failure mechanisms
```

Example:

```text
USB-C connector
    ↓
contact resistance Rc
    ↓
Vdrop = I × Rc
    ↓
Pcontact = I² × Rc
    ↓
corrosion / wear
    ↓
Rc increases
    ↓
larger voltage drop + heating
    ↓
candidate connector degradation
```

Another example:

```text
Battery
    ↓
internal resistance Rint
    ↓
Vterminal = VOCV - I×Rint
    ↓
Rint increases with aging
    ↓
larger voltage sag under load
    ↓
higher I²R heating
    ↓
candidate battery degradation
```

---

# Source Hierarchy

Use sources in approximately this order:

1. Manufacturer datasheet
2. Manufacturer reference/design documentation
3. Manufacturer product page
4. DigiKey / Mouser / LCSC with manufacturer-linked specifications
5. iFixit or high-quality teardown identifying the actual IC
6. Regulatory filings / FCC documentation where appropriate
7. Engineering literature
8. General technical references

Avoid using:

- Marketing-only specifications as electrical ratings
- Unsourced repair blogs for numeric specifications
- Random component databases without provenance
- AI-generated values
- Guessed part numbers
- Values copied from a visually similar component

---

# Important Database Rule

A **typical component value is not equivalent to a phone-specific value**.

For example:

```text
"Smartphone speaker = 4 Ω"
```

must not be stored as a verified phone-component fact unless the actual module is identified.

Instead:

```text
parameter: nominal_impedance
value: 4 Ω
verification_status: typical_class_value
source: [source]
```

Similarly:

```text
parameter: battery_internal_resistance
value: unknown
verification_status: unknown
```

is preferable to inserting an estimated number.

---

# Recommended Record Structure

```yaml
component_type: battery
category: battery_chemistry_cells

identity:
  manufacturer: unknown
  part_number: unknown
  phone_model: unknown

electrical:
  nominal_voltage: unknown
  charge_voltage: unknown
  discharge_current: unknown
  internal_resistance: unknown

thermal:
  operating_temperature: unknown
  thermal_resistance: unknown

physics:
  equations:
    - "Vterminal = VOCV(SOC) - I*Rint"
    - "Pheat = I²*Rint"

failure_physics:
  - mechanism: internal_resistance_increase
    effect: increased_voltage_sag
  - mechanism: capacity_fade
    effect: reduced_runtime
  - mechanism: internal_short
    effect: abnormal_current_and_heating

provenance:
  verification_status: unknown
  source: unknown
```

---

# Database Philosophy

The objective is not to fill every field.

The objective is to make every populated field **physically meaningful and traceable**.

The diagnostic engine should therefore distinguish:

```text
KNOWN
DERIVED
TYPICAL
UNKNOWN
NDA
```

This prevents false precision and allows the database to become progressively more accurate as real phone teardowns, measurements, and manufacturer datasheets are added.
