# macOS hardware exposure — the laptop side of the bridge

Same idea as `android_api_exposure.md`, but for this MacBook instead of a
phone. Verified empirically on this machine (2018 Intel MacBook Pro,
macOS 15.7.7) by actually running the commands, not guessed.

The two bridges, connected:
- **Bridge A**: the component catalog (`component_vocabulary.py`'s
  category list — Compute, Power, Display, Radios, Ports, etc.)
- **Bridge B**: what a standard user-level process can actually read on
  this platform, no root/sudo, no kernel extension.

Where they connect is what `MacHardwareService.swift` (in the Zinaata app)
actually reads and displays. No fault modeling, no severity sweeps, no
formula stacking — that framework is explicitly not used here (see
`FRAMEWORK.md`'s industrial method vs. this project's decision to skip
it). This is a pure read-and-display mapping.

## Exposure by category

| Category | Source | Exposure |
|---|---|---|
| Compute (CPU model, core count, cache, RAM) | `system_profiler SPHardwareDataType`, `sysctl machdep.cpu.*` | **Full** — static identity + core/thread counts. Live per-core clock/load is not exposed without sudo/`powermetrics`. |
| Storage | `diskutil list` | **Full** — volumes, sizes, container structure. No SMART/wear-level data (same gap as Android's flash_storage). |
| Display & GPU | `system_profiler SPDisplaysDataType` | **Full** — GPU model, VRAM, resolution, refresh info. No live GPU temp/utilization (same gap as Android). |
| Camera | `system_profiler SPCameraDataType` | **Full** identity (model/unique ID). No live frame access without an active capture session + permission. |
| Audio | `system_profiler SPAudioDataType` | **Full** — every input/output device, sample rates, transport (built-in vs Bluetooth). No driver-level health telemetry. |
| Battery & power | `system_profiler SPPowerDataType` | **Full** — this is the richest category found: cycle count, health condition ("Service Recommended" showed up live on this machine), charge %, full-charge capacity in mAh, connected charger wattage. Far more than Android exposes for battery (Android has no public cycle-count API at all). |
| Wi-Fi | `system_profiler SPAirPortDataType` | **Full** — firmware version, MAC, supported channels/PHY modes, connection status. |
| Bluetooth | `system_profiler SPBluetoothDataType` | **Full** — controller chipset, firmware, connected/paired device list. |
| Network ports (Ethernet/Thunderbolt bridges) | `networksetup -listallhardwareports` | **Full** — every network-capable hardware port and its MAC address. |
| USB ports | `system_profiler SPUSBDataType` | **Full** for what's plugged in (bus speed, vendor/product ID, power draw). Empty ports aren't individually enumerated — you see devices, not vacant slots. |
| Thunderbolt/USB4 ports | `system_profiler SPThunderboltDataType` | **Full** — every physical Thunderbolt port, connected or not, with link speed and receptacle number. This is better than USB: idle ports ARE listed. |
| Thermal | No public per-component temperature API | **Not exposed** without sudo. `pmset -g therm` gives a coarse `CPU_Speed_Limit` (throttling proxy, 100 = no throttling) — same shape of limitation as Android's device-wide `thermal_headroom`, not per-component. |
| Fan speed / SMC sensors | None without sudo or a kernel-level helper (e.g. `istats`, `smckit`) | **Not exposed** to a standard process. Mirrors Android's `HardwarePropertiesManager` being system-only. |

## What this confirms about the bridge method

The Mac side is actually **more open** than Android's for most categories
(no permission prompts, no OS-level sandboxing blocking `system_profiler`
output) — the exceptions are the same two gaps both platforms share:
per-component thermal telemetry and low-level component health (wear,
drift, fault registers), both of which require privileged/root access on
either platform and are out of scope for a standard app.

## Status

Implemented as of 2026-09-18 in the Zinaata Mac app (`MacHardwareService.swift`
+ `MacSpecsView.swift`, "This Mac" button in the chat sidebar) — read-only
display, no fault detection yet. Same live-data foundation could feed a
fault-detection layer later; that layer's design is intentionally
undecided for now (explicitly not the industrial formula-stacking method).
