# Zinata — Framework brief (for whoever/whatever picks this up next)

If you are a future Claude session reading this cold: your job is to take
the diagnostic method proven in the industrial `faulter` project (one
level up in `YANTHROS CORE/`, engine in `brain.py` + `formulas.py`) and
re-target it at Android phone hardware instead of industrial machines.
This file explains the method itself, in enough detail to actually do
that without re-deriving it from scratch.

## The method, in general (not industrial-specific)

The core engine (`brain.py`) is a formula graph: every variable symbol
across ~333 formulas is a node, every formula is an edge from its input
variables to its output variable. Given some known values, it
forward-chains through whatever formulas become solvable — this is
domain-agnostic. It doesn't know or care whether the numbers came from a
bottling machine or a phone.

The proven pipeline, industrial version:

1. **Identify components** — either from a real assembly file (STEP
   geometry, parsed for named parts) or from a short Q&A when no file
   exists (~10 questions, answerable by a non-expert, covering: what it
   does, how many powered/electrical points, AC/DC, process step count,
   fluid/heat/chemical presence, throughput, structural join type,
   sensors, drivetrain type, control complexity).
2. **Classify each component into a type** from a small controlled
   vocabulary (motor, bearing, belt, sensor, driver, etc. — see
   `formula_selector.py`'s `COMPONENT_TYPE_TO_DOMAINS` in the `faulter`
   project, not copied into this folder on purpose — see below).
3. **Map component type → physics domain(s)** the core engine already
   has formulas for (dc_motor_industrial, thermal, electronics,
   materials, etc.) — deliberately generous/over-inclusive: an unused
   extra formula is harmless, a missing one breaks the chain.
4. **Stack the matching formulas** out of the shared 333-formula library
   — this produces a machine-specific (or in Zinata's case,
   device-specific) formula subset.
5. **Fault modeling**: take the fault-relevant formulas already in the
   library (`resistance_temperature`, `severity_growth_asymptotic`,
   `severity_growth_linear`, `torque_ripple`, `flux_thermal_derating`,
   `thermal_rise_rc`) and sweep their source variable (severity,
   temperature, drift) across a realistic range, recording the resulting
   signature at whatever sink variable is reachable (current, torque,
   temperature). Not yet built even on the industrial side as of this
   writing — the plan is the same either way.

None of this five-step method is industrial-specific. Step 1's *data
source* changes for Zinata (an Android app reading live hardware instead
of a parsed file or a phone call), but steps 2-5 are the same mechanism
against the same engine.

## Why this isn't starting from zero

The core engine already carries a set of ESP32/embedded-electronics
symbols from earlier work, confirmed present in `formulas.py`: `I_total,
I_cpu, I_wifi, I_gpio, I_peripherals` (current draw per subsystem),
`T_chip, R_th, dT_dt, Cp` (chip thermal behavior), `T_clk, f_crystal,
f_cpu, cycles, cycles_per_inst, t_inst` (clock/timing), `V_out, V_in,
R_regulator, C_battery, t_batt` (power/battery), `c_light, f_rf, L_ant,
dist_rf, PL, G_tx, G_rx, P_tx, P_rx` (RF/antenna). There's a working
formula like `supply_current: I_total = I_cpu + I_wifi + I_gpio +
I_peripherals` already in the graph. `esp32_specs.json` (copied into
this folder) has real confirmed/estimated chip electrical data already
tagged with the same confidence convention (`confirmed`/`estimated`)
used everywhere else in this project.

A phone's SoC, radios, and battery are the same category of thing a
microcontroller is, just bigger and more of them — this is a genuine
head start, not a green-field problem.

## Electronics component vocabulary Zinata will need

Mirroring `COMPONENT_TYPE_TO_DOMAINS`'s role for industrial machines,
whatever picks this up needs an equivalent type→domain table for phone
hardware. Rough component list a real Android phone exposes (build the
vocabulary from this, don't treat it as final):

- **Compute**: SoC/processor, RAM, flash storage, GPU
- **Power**: battery (Li-ion/Li-Po), charging IC, voltage
  regulators/PMIC, USB-C port
- **Display/input**: display panel, touch digitizer, fingerprint sensor
- **Camera**: image sensor(s), lens actuator (autofocus/OIS motor),
  flash LED
- **Motion/environmental sensors**: accelerometer, gyroscope,
  magnetometer, barometer, proximity sensor, ambient light sensor
- **Audio/haptics**: microphone(s), speaker(s), haptic motor
- **Radios**: WiFi, Bluetooth, NFC, cellular modem, GPS/GNSS receiver,
  antenna assemblies
- **Passive/discrete components on the board**: SMD resistors,
  capacitors, inductors, MOSFETs/transistors, status/flash LEDs, PCB
  traces and connectors
- **Thermal**: thermal sensors/thermistors near the SoC and battery

Existing core-engine domains that already map cleanly onto this list:
`electronics` (op-amp, BJT, MOSFET, RC filters, buck/boost converters,
digital logic, noise margins — directly applicable to phone board-level
components), `battery_chemistry`, `thermal`, `rf`, `instrumentation`,
`gpio`, `timing`, `magnetic` (antennas, haptic motor, camera actuator),
`materials` (mechanical stress on the board/chassis, if ever relevant).

## What's deliberately NOT copied into this folder

Only the core engine (`brain.py`, `formulas.py`, `brain_graph.json`,
`esp32_specs.json`, `requirements.txt`) was copied here, on explicit
instruction. The industrial framework around it — `formula_selector.py`,
`step_parser.py`, `packet_builder_app.py`, the licensing/encryption
layer, the Twin Viewer app — was NOT copied. That framework is
industrial-specific plumbing (STEP file parsing, a 3D wireframe, a
software-packet licensing model for external customers). Zinata doesn't
need a 3D twin (a phone isn't a physical assembly to visualize) and its
data source is a live Android app, not an uploaded assembly file — so
that framework should be rebuilt for this use case, not reused as-is.
What DOES carry over is the *method* described above, not that code.

## Status

Context and methodology only, captured 2026-09-18. No Android app, no
component vocabulary table, no fault-sweep implementation exists yet for
this direction. This file plus `README.md` in this same folder are the
full brief — start here.
