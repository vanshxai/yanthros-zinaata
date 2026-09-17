# Zinata — Yanthros Core, applied to consumer electronics

## What this folder is

A new expansion context for the Yanthros Core engine (the formula/physics
graph in `brain.py` + `formulas.py`, one level up in `YANTHROS CORE/`).
Same core engine, same diagnostic method — a different target.

`faulter/` (the industrial project this engine was built for) takes an
industrial machine's ratings and component list, stacks the relevant
formulas from the core engine, and produces a fault-detection profile for
that machine.

Zinata is that same method, retargeted: instead of an industrial machine,
the target is a smartphone. Instead of receiving component data from an
uploaded CAD/assembly file, the data comes from an Android app reading
the phone's own hardware directly, from inside the phone.

## The concept

An Android app that, once installed, gets access to every hardware
component and sensor the OS will expose to an app: battery capacity and
health, processor specs, RAM, individual sensor readings (accelerometer,
gyroscope, temperature, proximity, etc.), radios (WiFi/BLE/cellular), and
whatever else is readable at the OS/API level.

That data feeds the same core engine the same way a machine's component
list does now: match components/specs to relevant formula domains, stack
the applicable formulas, and use them to characterize normal vs.
faulting behavior for that specific phone.

## What's different from the industrial case

- **No 3D digital twin.** A phone isn't a physical assembly being
  visualized — there's nothing to render a wireframe of. The engine's
  fault-diagnosis method is being reused; the twin/visualization layer
  is not.
- **Data source is internal, not an uploaded file.** The app sits inside
  the device and reads live hardware state directly, rather than parsing
  an external geometry/BOM file.
- **Everything else about the method carries over**: rating-based
  component identification, formula stacking from the same core engine,
  and fault characterization from combinations of known specs — the
  same reasoning already proven on industrial machines in `faulter/`.

## Status

Context only, captured as of 2026-09-17. Not yet designed or built —
this file exists to record the direction before any implementation
work starts.
