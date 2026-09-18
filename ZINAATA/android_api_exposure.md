# Android SDK Exposure Audit — COMPONENT_TYPE_TO_DOMAINS

Ground truth for what a normal (non-rooted, standard-permissions) Android app can
read from the OS/SDK for each of the 35 component types in
`component_vocabulary.py`. Verified against developer.android.com reference
pages and training docs (fetched September 2026); not guessed from memory.

Legend for **Exposure level**:
- **Full** — the runtime API gives essentially everything the fault engine needs for this component as a live signal.
- **Partial** — some fields are readable live, others are structurally unavailable to a standard app.
- **OEM-varies** — the API exists and is callable, but real devices are inconsistent (common return: unsupported/0/NaN on many OEMs).
- **Not exposed** — no public SDK path at all on a standard, non-rooted device; must come from a static spec-sheet lookup instead of a runtime read.

Summary: 35 component types covered — 10 Full, 15 Partial, 3 OEM-varies, 7 Not exposed.

---

## 1. soc_processor

**API/class:** `android.os.Build` (`SOC_MANUFACTURER`, `SOC_MODEL` — API 31+; `HARDWARE`, `BOARD`, `SUPPORTED_ABIS`), `ActivityManager` (process-level CPU stats only), `PowerManager.getThermalHeadroom()` / thermal status (see `thermal_sensor` below).

**Permission:** None.

**What's exposed:** Static identity strings only — SoC manufacturer/model name (e.g. "Qualcomm" / "SM8350"), hardware codename, supported CPU ABIs (e.g. `arm64-v8a`). No permission gate; these are compile-time build props.

**What's NOT exposed:** Live per-core clock speed (MHz), per-core load %, per-core voltage, cache stats, instruction throughput. `/proc/stat`, `/proc/cpuinfo` frequency scaling files are blocked by SELinux on modern Android for third-party apps (not readable since roughly Android 7-8 hardening). Overall device-wide thermal *status* is available (see thermal_sensor) but not tied to the SoC specifically, and not per-core.

**Exposure level:** Partial.

**Fault-engine implication:** SoC identity (for spec-sheet lookup keying) is a usable live read; clock speed, load, and thermal-per-core must come from a static spec-sheet lookup instead of runtime reads. Overall device thermal status can serve as a coarse live proxy.

---

## 2. ram

**API/class:** `ActivityManager.getMemoryInfo()` → `ActivityManager.MemoryInfo`.

**Permission:** None.

**What's exposed:** `availMem` (bytes, currently free), `totalMem` (bytes, kernel-visible total), `threshold` (bytes, low-memory kill threshold), `lowMemory` (boolean). All from a public, permission-free API.

**What's NOT exposed:** `totalMem` is *not* reliable as true installed RAM capacity (differs from nameplate spec because of memory reserved for bootloader/modem/GPU/kernel). No RAM clock speed, timings, channel config, ECC status, or per-app/per-bank fault info. No direct `/proc/meminfo` access guaranteed across OEMs/API levels.

**Exposure level:** Partial.

**Fault-engine implication:** Available-memory pressure (`availMem`, `lowMemory`) is a usable live input for thermal/load correlation; nameplate RAM capacity and speed/timings should come from a static spec-sheet lookup, not `totalMem`.

---

## 3. flash_storage

**API/class:** `android.os.storage.StorageManager`, `android.os.StatFs` (or `File.getTotalSpace()/getFreeSpace()`).

**Permission:** None for the app's own accessible storage volumes (no storage permission needed just to query capacity).

**What's exposed:** Total space and free/available space in bytes for a given storage volume (internal or app-accessible external), and allocatable bytes via `StorageManager.getAllocatableBytes()`.

**What's NOT exposed:** Flash wear level, P/E cycle count, SMART-style health/bad-block data, write-amplification stats, controller telemetry. None of this is in the public API — deliberately withheld as a privileged/system-only diagnostic.

**Exposure level:** Partial.

**Fault-engine implication:** Capacity/free-space usable as live input for a fill-rate or free-space-trend signal; wear/health metrics must come from a static spec-sheet lookup (device's rated TBW/cycle spec), never a runtime read.

---

## 4. gpu

**API/class:** No dedicated Android GPU-info API. Indirect only: `GLES20.glGetString(GLES20.GL_VENDOR)` / `glGetString(GLES20.GL_RENDERER)` from within an active OpenGL ES context (e.g. a `GLSurfaceView`).

**Permission:** None (but requires standing up a GL rendering context to query, which is an unusual thing for a background diagnostic app to do).

**What's exposed:** Vendor string and renderer string (e.g. "Qualcomm" / "Adreno (TM) 730") — static identity text, not live data.

**What's NOT exposed:** GPU clock speed, utilization %, per-shader-core load, VRAM/shared-memory bandwidth, GPU temperature. None of this is reachable without root/vendor APIs (some GPU vendors expose profiling via GPU-specific tools like Snapdragon Profiler, not the public SDK).

**Exposure level:** Partial.

**Fault-engine implication:** GPU model string usable only to key a static spec-sheet lookup; all live thermal/clock/load figures must come from that spec sheet or from the shared device-wide thermal status, not a direct GPU read.

---

## 5. battery

**API/class:** `Intent.ACTION_BATTERY_CHANGED` broadcast extras (via `BatteryManager.EXTRA_*`), plus `BatteryManager.getIntProperty()/getLongProperty()` with `BATTERY_PROPERTY_*` constants.

**Permission:** None for any of this (common misconception: `BATTERY_STATS` is only needed to read *other apps'* historical battery-use stats via `BatteryStatsManager`, not for the device's own live battery properties).

**What's exposed:**
- From the broadcast: `EXTRA_LEVEL`/`EXTRA_SCALE` (level %, computed as level/scale), `EXTRA_VOLTAGE` (mV), `EXTRA_TEMPERATURE` (tenths of a °C, e.g. 223 = 22.3°C), `EXTRA_STATUS` (charging/discharging/full/not-charging enum), `EXTRA_HEALTH` (good/overheat/dead/over-voltage/cold enum), `EXTRA_PLUGGED` (AC/USB/wireless/none), `EXTRA_TECHNOLOGY` (string, e.g. "Li-ion"), `EXTRA_PRESENT` (boolean).
- From `getIntProperty`/`getLongProperty`: `BATTERY_PROPERTY_CURRENT_NOW` (µA, instantaneous, signed — positive = charging in), `BATTERY_PROPERTY_CURRENT_AVERAGE` (µA), `BATTERY_PROPERTY_CHARGE_COUNTER` (µAh remaining), `BATTERY_PROPERTY_CAPACITY` (integer % — same as level), `BATTERY_PROPERTY_ENERGY_COUNTER` (nWh, API 21+), `BATTERY_PROPERTY_STATUS`.

**What's NOT exposed / OEM-inconsistent:** `CURRENT_NOW`, `CHARGE_COUNTER`, and `ENERGY_COUNTER` are well known to return `Integer.MIN_VALUE`/unsupported on a meaningful fraction of OEM devices whose kernel power-supply driver doesn't populate them. No true design/rated capacity in mAh anywhere in the public API. No charge-cycle count anywhere in the public API (some OEM-specific system apps show it, but it's not SDK-accessible to a normal app).

**Exposure level:** OEM-varies.

**Fault-engine implication:** Level, voltage, temperature, status, health, and plugged-state are reliable live inputs across virtually all devices; current_now/charge_counter/energy_counter should be treated as best-effort live inputs with a null/unsupported fallback; rated capacity (mAh) and cycle count must come from a static spec-sheet lookup, never a runtime read.

---

## 6. charging_ic

**API/class:** No dedicated charging-IC API. Inferred entirely from `BatteryManager` (`EXTRA_PLUGGED` for source type: USB/AC/wireless; `BATTERY_PROPERTY_CURRENT_NOW` for charge current; `EXTRA_STATUS` for charging state).

**Permission:** None.

**What's exposed:** Which power source is connected, whether the battery is actively charging, and (OEM-varies) instantaneous charge current — but this is *battery-side* telemetry, not IC-side. No charging-IC register state, negotiated charge voltage/current limit, thermal-foldback state, or fault flags (e.g. IC-reported over-temp cutoff) — Android doesn't expose the charge-management IC as a distinct addressable entity at all.

**Exposure level:** Partial.

**Fault-engine implication:** Usable as a coarse live proxy (plugged/charging state + current draw where supported); true charging-IC-level diagnostics (negotiated voltage/current, fault register) are not queryable — treat as inferred from battery-side signals only, not a direct component read.

---

## 7. voltage_regulator (PMIC)

**API/class:** None. No public Android API addresses the power-management IC or individual voltage rails.

**Permission:** N/A.

**What's exposed:** Nothing directly. The only indirect proxy is the overall battery voltage (`EXTRA_VOLTAGE`) and system-wide thermal status, neither of which reflects individual rail health, ripple, or regulator efficiency.

**Exposure level:** Not exposed.

**Fault-engine implication:** Must come from a static spec-sheet lookup (rated rail voltages/currents) rather than any runtime read; the fault engine cannot get live PMIC telemetry from a standard app on stock Android.

---

## 8. usb_c_port

**API/class:** `android.hardware.usb.UsbManager` (`getDeviceList()`, `UsbDevice`, `UsbAccessory`); connection/charging state cross-referenced from `BatteryManager.EXTRA_PLUGGED`.

**Permission:** No manifest permission is needed just to enumerate `getDeviceList()`. Accessing/communicating with a specific attached USB device requires a **runtime, per-device user consent dialog** via `UsbManager.requestPermission(device, PendingIntent)` (or an auto-granted intent-filter match) — this is a USB-specific consent flow, not a `<uses-permission>` in the traditional sense.

**What's exposed:** Vendor ID, product ID, device class/subclass/protocol, and interface descriptors of anything enumerable over the port (peripherals, not the port itself). Charging/plugged state comes from `BatteryManager`, not `UsbManager`.

**What's NOT exposed:** USB Power Delivery negotiated voltage/current, cable/connector orientation (CC1/CC2), USB speed negotiated (2.0 vs 3.x), port thermal/contact-resistance state. None of this PD/physical-layer detail is in the public SDK.

**Exposure level:** Partial.

**Fault-engine implication:** Peripheral enumeration and basic plugged/charging state are usable live inputs; PD negotiation and physical port health must come from a static spec-sheet lookup, not a runtime read.

---

## 9. display_panel

**API/class:** `android.hardware.display.DisplayManager`, `android.view.Display` (`getRefreshRate()`, `getMode()`/`getSupportedModes()`, `getHdrCapabilities()`, `getState()`), `Settings.System.SCREEN_BRIGHTNESS`.

**Permission:** None to read refresh rate, resolution, supported modes, HDR capability, display power state (on/off/doze), or current brightness setting (`Settings.System.SCREEN_BRIGHTNESS` is readable by any app). Only *writing* brightness requires `WRITE_SETTINGS`.

**What's exposed:** Native resolution, current/supported refresh rates (Hz), HDR type support, display on/off/doze state, current screen brightness value (0–255 scale, or normalized on newer APIs).

**What's NOT exposed:** Panel health (dead/stuck pixels, burn-in estimate), backlight driver current, panel temperature specifically (only device-wide thermal status), actual luminance in nits (brightness setting is a driver-scale int, not calibrated nits).

**Exposure level:** Full (for the specs the fault engine would use as live input — refresh rate, resolution, state, brightness setting).

**Fault-engine implication:** Usable as live input for refresh-rate/brightness/on-off-state signals; panel-level defect/health and true nit luminance are not queryable and would need spec-sheet constants instead.

---

## 10. touch_digitizer

**API/class:** `android.view.MotionEvent` delivered to an app's own touch listeners (`onTouchEvent`); `android.view.InputDevice` (`getMotionRanges()`) for capability description.

**Permission:** None.

**What's exposed:** Touch coordinates, pressure (`getPressure()`, normalized 0–1, calibration varies by OEM), touch size/major-minor axis, event timing — but only for touches delivered to the app's own UI while in the foreground. `InputDevice` exposes static capability ranges (min/max X/Y/pressure).

**What's NOT exposed:** System-wide/background touch monitoring (an app cannot snoop on touches outside its own views without Accessibility Service privileges, which are a special user-granted category, not a standard permission), raw digitizer self-diagnostics, ghost-touch/dead-zone detection, digitizer driver health/error counters.

**Exposure level:** Partial.

**Fault-engine implication:** Usable only as an in-app interaction signal (e.g. responsiveness/latency while the diagnostic app itself is being touched) — not a background live health read of the digitizer; systemic fault indicators (dead zones, drift) are not queryable and would need a guided in-app self-test rather than passive monitoring.

---

## 11. fingerprint_sensor

**API/class:** `android.hardware.biometrics.BiometricManager` (+ `BiometricPrompt` for the auth UI). Legacy `android.hardware.fingerprint.FingerprintManager` is deprecated in favor of BiometricManager.

**Permission:** `USE_BIOMETRIC` (the older `USE_FINGERPRINT` is deprecated/superseded).

**What's exposed:** `canAuthenticate(int authenticators)` → capability/enrollment status codes only (`BIOMETRIC_SUCCESS`, `BIOMETRIC_ERROR_HW_UNAVAILABLE`, `BIOMETRIC_ERROR_NONE_ENROLLED`, `BIOMETRIC_ERROR_NO_HARDWARE`, etc.), and `BiometricPrompt` returns a boolean authentication success/failure plus generic error codes.

**What's NOT exposed:** Any raw sensor data — no fingerprint image, minutiae template, capacitive readout, sensor self-test/quality score, or touch-count/wear telemetry. This is a hard security boundary in Android by design (fingerprint data never leaves the Trusted Execution Environment).

**Exposure level:** Not exposed (beyond a coarse present/enrolled/working boolean).

**Fault-engine implication:** Only a binary "hardware present and functional enough to authenticate" signal is available; any deeper fault diagnosis for this component must come from a static spec-sheet lookup plus the app's own controlled auth-attempt success-rate logging, not a raw sensor read.

---

## 12. image_sensor

**API/class:** `android.hardware.camera2.CameraManager` + `CameraCharacteristics` (static specs); live frames via `CameraCaptureSession`/`ImageReader`.

**Permission:** Reading static `CameraCharacteristics` via `CameraManager.getCameraCharacteristics(id)` requires **no** permission. `CAMERA` permission is required only to actually **open** the camera (`openCamera()`) and stream frames.

**What's exposed (static, no permission):** `SENSOR_INFO_PIXEL_ARRAY_SIZE` (px), `SENSOR_INFO_PHYSICAL_SIZE` (mm), `SENSOR_INFO_SENSITIVITY_RANGE` (ISO min/max), `LENS_FACING`, `FLASH_INFO_AVAILABLE`, and many more static capability keys.
**What's exposed (live, with CAMERA permission):** Actual captured frame data, per-frame `CaptureResult` metadata (exposure time, sensitivity used, timestamp, lens state), via an active capture session.

**What's NOT exposed:** Sensor die temperature, pixel-defect maps, dark-current/noise-floor self-test, hot-pixel count — no sensor health telemetry beyond what can be inferred by the app analyzing its own captured frames.

**Exposure level:** Full (for specs + live frame capture, which is what the fault engine would realistically use).

**Fault-engine implication:** Static specs are a free live-queryable lookup key; actual frame data is a genuine live input (with user-visible CAMERA permission cost); sensor-die-level health diagnostics are not queryable and would need spec-sheet constants or frame-based heuristics instead.

---

## 13. lens_actuator (AF/OIS voice-coil)

**API/class:** `CameraCharacteristics` (`LENS_INFO_AVAILABLE_FOCAL_LENGTHS`, `LENS_INFO_MINIMUM_FOCUS_DISTANCE`, `LENS_INFO_HYPERFOCAL_DISTANCE`, `LENS_INFO_AVAILABLE_OPTICAL_STABILIZATION`) for static specs; `CaptureResult` (`LENS_FOCUS_DISTANCE`, `LENS_STATE`, `LENS_OPTICAL_STABILIZATION_MODE`) for live state during an active capture session.

**Permission:** Static characteristics: none. Live `CaptureResult` fields: `CAMERA` (camera must be open/streaming).

**What's exposed:** Static: focal length(s), min focus distance, hyperfocal distance, whether OIS is available. Live (while capturing): current focus distance, lens moving/stationary state, whether OIS is currently engaged.

**What's NOT exposed:** Actuator drive current, coil resistance/health, actual OIS displacement/correction magnitude, actuator wear or stiction diagnostics.

**Exposure level:** Partial.

**Fault-engine implication:** Focus-distance/lens-state usable as a live signal only while the camera is actively open (not a background read); actuator electrical/mechanical health must come from a static spec-sheet lookup.

---

## 14. camera_flash_led

**API/class:** `CameraManager.setTorchMode()`, `CameraCharacteristics.FLASH_INFO_AVAILABLE`, `CameraCharacteristics.FLASH_INFO_STRENGTH_MAXIMUM_LEVEL` / `FLASH_INFO_STRENGTH_DEFAULT_LEVEL` (API 33+, torch-strength control via `turnOnTorchWithStrengthLevel()`).

**Permission:** `CAMERA` is required to actually drive the torch/flash (torch control goes through `CameraManager`, which needs the camera to be available, though `setTorchMode` itself doesn't require an open capture session on most devices — still gated by the `CAMERA` permission in practice on many OEM implementations).

**What's exposed:** Whether flash hardware is present, max/default torch strength level (API 33+ devices only), on/off/strength control.

**What's NOT exposed:** LED forward current, junction temperature, thermal-derating/foldback state, drive-current fault flags.

**Exposure level:** Partial.

**Fault-engine implication:** Presence + controllable strength level is a usable live input on API 33+ devices; electrical/thermal LED health must come from a static spec-sheet lookup, and pre-API-33 devices only give a boolean on/off, no strength telemetry at all.

---

## 15–20. Motion & environmental sensors (SensorManager group)

**API/class:** `android.hardware.SensorManager` + `Sensor.TYPE_*` constants, values delivered via `SensorEventListener.onSensorChanged()`.

**Permission:** None for any of these six sensor types (unlike step counter/detector, which need `ACTIVITY_RECOGNITION` on API 29+, and heart-rate-class sensors, which need `BODY_SENSORS` — neither applies here). Note: if an app targets API 31+, continuous accelerometer/gyroscope sampling is rate-limited (capped sampling rate) unless the app holds `HIGH_SAMPLING_RATE_SENSORS`.

| Component | Sensor type | Units | Typical range |
|---|---|---|---|
| accelerometer | `TYPE_ACCELEROMETER` | m/s² | ±2g to ±16g depending on device (includes gravity) |
| gyroscope | `TYPE_GYROSCOPE` | rad/s | typically ±devices ~±2000°/s equivalent |
| magnetometer | `TYPE_MAGNETIC_FIELD` | µT (microtesla) | Earth field ~25–65 µT ambient |
| barometer | `TYPE_PRESSURE` | hPa | ~300–1100 hPa |
| proximity_sensor | `TYPE_PROXIMITY` | cm | binary near/far on many devices (0 = near, max = far) |
| ambient_light_sensor | `TYPE_LIGHT` | lux | 0 to tens of thousands lux |

**What's NOT exposed for any of these:** Sensor die temperature, internal self-test/health register, calibration-offset drift diagnostics, MEMS mechanical-wear indicators — the API gives you the processed physical reading only, not sensor-internal telemetry.

**Exposure level:** Full (as live physical-quantity inputs — this is exactly what SensorManager is for).

**Fault-engine implication:** All six are directly usable as live inputs for the instrumentation/magnetic domains; any sensor-internal electronic-health diagnosis (vs. the physical quantity it measures) is not queryable and would need spec-sheet constants (rated accuracy/noise-floor) as a baseline to compare live readings against.

---

## 21. microphone

**API/class:** `android.media.AudioRecord` / `MediaRecorder` (`getMaxAmplitude()` for RMS-ish amplitude).

**Permission:** `RECORD_AUDIO`.

**What's exposed:** Raw PCM audio waveform data, and `MediaRecorder.getMaxAmplitude()` (unitless amplitude since last call, 0–32767 range for 16-bit PCM). Also `AudioManager` reports whether a mic is available/muted at the system level.

**What's NOT exposed:** Microphone self-test, frequency-response curve, sensitivity in dB SPL/V, diaphragm health, or per-mic (in multi-mic arrays) individual diagnostics beyond what the app derives itself from the captured signal.

**Exposure level:** Partial.

**Fault-engine implication:** Usable as a live input only via an active, user-consented recording session (amplitude/signal-level signal); true electro-acoustic health parameters must come from a static spec-sheet lookup or an in-app calibrated self-test tone, not a passive background read.

---

## 22. speaker

**API/class:** `android.media.AudioManager` (volume/routing state, `getDevices()` for `AudioDeviceInfo`), `android.media.AudioTrack` for playback control.

**Permission:** None for volume/routing state queries.

**What's exposed:** Current volume level/stream type, whether speakerphone is on, which audio output device is active (`AudioDeviceInfo` type — built-in speaker/earpiece/wired/BT), and full control over playback content.

**What's NOT exposed:** Speaker driver current, cone excursion/health, thermal state, distortion/output-level verification — Android has no acoustic-output self-test or telemetry API; verifying speaker health would require the app to play a test tone and analyze it via the microphone (a build-your-own-diagnostic approach, not an SDK read).

**Exposure level:** Partial.

**Fault-engine implication:** Routing/volume state is a usable live input; actual acoustic/electrical health is not queryable and would need either spec-sheet constants or an app-built play-and-listen self-test, not a direct sensor read.

---

## 23. haptic_motor (LRA/ERM)

**API/class:** `android.os.Vibrator` (or `VibratorManager` on API 31+), `VibrationEffect`.

**Permission:** `VIBRATE`.

**What's exposed:** `hasVibrator()` (boolean presence), `hasAmplitudeControl()` (boolean), `areAllPrimitivesSupported()` (haptic primitive support), and — where supported — `getResonantFrequency()` (Hz) and `getQFactor()` (unitless) for LRA characterization.

**What's NOT exposed / OEM-varies:** `getResonantFrequency()`/`getQFactor()` return `NaN` on a large share of devices — these are recent, narrowly-supported APIs (mainly flagship devices with LRA + closed-loop haptic drivers). No drive current, coil temperature, or mechanical-wear telemetry on any device.

**Exposure level:** OEM-varies.

**Fault-engine implication:** Presence/capability flags are reliable live inputs everywhere; resonant frequency/Q factor are usable live inputs only on the subset of devices that support them (must null-check/fallback to spec-sheet constants elsewhere); electrical/mechanical wear is never queryable at runtime.

---

## 24. wifi_module

**API/class:** `android.net.wifi.WifiManager` → `WifiInfo`.

**Permission:** `ACCESS_WIFI_STATE` for the basic connection info object. Retrieving the actual **SSID/BSSID** values (not obfuscated) additionally requires location permission (`ACCESS_FINE_LOCATION`, and the device's location setting enabled) since Android 8.1 — a privacy-motivated restriction, since Wi-Fi info can reveal physical location.

**What's exposed:** `getRssi()` (dBm), `getLinkSpeed()` (Mbps), `getFrequency()` (MHz), `getNetworkId()`, `getIpAddress()`, and (with location permission) SSID/BSSID.

**What's NOT exposed:** Radio chip temperature, TX power actually used, antenna-specific diagnostics, packet-error-rate/retry counters at the driver level (some limited stats are available through less-standard paths but not as a stable public API).

**Exposure level:** Full (for the signal-quality fields relevant to a fault engine).

**Fault-engine implication:** RSSI/link speed/frequency are directly usable live inputs for the RF domain; radio-chip-level electronic health is not queryable and would need spec-sheet constants.

---

## 25. bluetooth_module

**API/class:** `android.bluetooth.BluetoothAdapter`, `BluetoothManager`, `BluetoothDevice`.

**Permission:** On API 31+ (Android 12+): `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`, `BLUETOOTH_ADVERTISE` (runtime-granted). On API 30 and below: `BLUETOOTH`, `BLUETOOTH_ADMIN`, plus `ACCESS_FINE_LOCATION` for scanning (BT scans could reveal location). `neverForLocation` flag can be declared on `BLUETOOTH_SCAN` if the app doesn't derive location from scan results, avoiding the location-permission coupling on API 31+.

**What's exposed:** Adapter enabled/disabled state, bonded (paired) device list, per-device connection state, RSSI during active BLE scans (`ScanResult.getRssi()`), device name/address.

**What's NOT exposed:** Chip temperature, TX power actually used, link-quality/error-rate counters beyond RSSI, antenna diagnostics.

**Exposure level:** Partial.

**Fault-engine implication:** Adapter state + bonded-device RSSI (when scanning) are usable live inputs; deeper radio-electronic health is not queryable and would need spec-sheet constants.

---

## 26. nfc_module

**API/class:** `android.nfc.NfcAdapter`, `Tag` (+ `NfcA`/`NfcB`/`NfcF`/`NfcV` tech classes).

**Permission:** `NFC`.

**What's exposed:** `isEnabled()`, `isSecureNfcEnabled()`, and — only when a tag is physically in range — tag UID, technology list, and tag payload data.

**What's NOT exposed:** Field strength, antenna coupling quality, chip self-test/health, any telemetry when no tag is present. NFC is fundamentally an event-driven presence API, not a continuously-queryable sensor.

**Exposure level:** Partial.

**Fault-engine implication:** Only an enabled/disabled boolean is available as a continuous live input; any deeper diagnosis requires an active tag-read event (not passive monitoring) and true chip-health telemetry is not queryable at all — treat as spec-sheet-backed with enabled-state as the only live signal.

---

## 27. cellular_modem

**API/class:** `android.telephony.TelephonyManager` (`getSignalStrength()` → `SignalStrength`, `getAllCellInfo()` → `CellInfo` list, network type methods).

**Permission:** `READ_PHONE_STATE` for basic signal strength; `ACCESS_FINE_LOCATION` is additionally required for `getAllCellInfo()`/`getCellLocation()` since Android 10, because cell info can reveal location. Hardware identifiers (IMEI/MEID etc.) are further restricted — `READ_PHONE_STATE` alone no longer suffices for those on modern Android; they require carrier-privilege or system-level access and are effectively unavailable to a normal third-party app.

**What's exposed:** Signal strength (dBm, ASU, and a coarse 0–4 "level" bucket) per active radio, cell info (type: LTE/NR/GSM/etc., with dBm), current network type (e.g. LTE/5G NR), SIM state.

**What's NOT exposed:** Modem chip temperature, TX power, baseband firmware fault registers, IMEI/hardware serial (blocked on modern Android for third-party apps).

**Exposure level:** OEM-varies (API surface is consistent, but the permission gate and available detail have shifted significantly release-over-release, and some OEMs/carriers restrict `getAllCellInfo()` results further).

**Fault-engine implication:** Signal strength/level is a usable live input for the RF domain, gated behind two runtime permissions; modem-electronics-level health and hardware identifiers are not queryable and must come from a static spec-sheet lookup.

---

## 28. gps_gnss_receiver

**API/class:** `android.location.LocationManager` + `GnssStatus` (per-satellite, API 24+) via `registerGnssStatusCallback()`; `GnssMeasurement` (API 26+) for raw pseudorange/carrier-phase data.

**Permission:** `ACCESS_FINE_LOCATION` (a dangerous/runtime permission).

**What's exposed:** Per-satellite: `getCn0DbHz()` (carrier-to-noise density, dB-Hz — the closest thing to a GNSS "signal strength"), `getAzimuthDegrees()`, `getElevationDegrees()`, `getConstellationType()` (GPS/GLONASS/Galileo/BeiDou/QZSS), `getSvid()`, `usedInFix()` (boolean). `GnssMeasurement` adds raw pseudorange, Doppler shift, and carrier-phase data on devices that support it.

**What's NOT exposed / OEM-varies:** `GnssMeasurement` (raw measurements) availability and completeness varies significantly by device/chipset — not all devices provide full raw measurements even though the API exists. No GNSS chip temperature or internal fault register.

**Exposure level:** Full (for `GnssStatus`, which is broadly available across devices with GPS); `GnssMeasurement` specifically is better described as OEM-varies.

**Fault-engine implication:** Per-satellite C/N0 and fix-usage are strong, broadly-available live inputs for the RF domain; raw measurement-level data is a bonus signal only on supporting devices and should degrade gracefully.

---

## 29. antenna

**API/class:** None directly. Only inferable indirectly through the RF signal-quality readings of the radios it serves: `WifiInfo.getRssi()`, Bluetooth `ScanResult.getRssi()`, `SignalStrength` (cellular), `GnssStatus.getCn0DbHz()` (GNSS).

**Permission:** N/A (inherits whichever radio's permission is used for the proxy read).

**What's exposed:** Nothing antenna-specific — no impedance, VSWR, matching-network health, or antenna-switch diagnostics.

**Exposure level:** Not exposed.

**Fault-engine implication:** Must come from a static spec-sheet lookup; at best, a persistently poor RSSI/C-N0 across every radio sharing an antenna path could be used as a weak, indirect fault signal, but this is inference, not a direct read.

---

## 30. pcb_passive (SMD resistor/cap/inductor)

**API/class:** None.

**Permission:** N/A.

**What's exposed:** Nothing. Individual passive components are never individually addressable in any Android API.

**Exposure level:** Not exposed.

**Fault-engine implication:** Must come from a static spec-sheet lookup entirely; there is no runtime path to this component type at all, direct or indirect.

---

## 31. mosfet_transistor

**API/class:** None.

**Permission:** N/A.

**What's exposed:** Nothing directly addressable.

**Exposure level:** Not exposed.

**Fault-engine implication:** Must come from a static spec-sheet lookup; same as pcb_passive — no runtime path exists.

---

## 32. status_led

**API/class:** No public, standardized API. Legacy `Notification.Builder.setLights()` existed pre-Android-8 for notification LED color/pattern, but since Android 8 (Oreo) LED behavior must be declared per-`NotificationChannel` at channel-creation time, is not queryable back, and many modern devices (including most Samsung flagships) have removed the notification-LED hardware entirely.

**Permission:** N/A (no read path exists regardless).

**What's exposed:** Nothing readable — even the write-side control that exists is indirect (channel config, not direct GPIO/LED control) and hardware presence itself is inconsistent across OEMs.

**Exposure level:** Not exposed.

**Fault-engine implication:** Must come from a static spec-sheet lookup (including whether the device even has this hardware at all); no live read or even reliable live control exists on stock Android.

---

## 33. pcb_connector

**API/class:** No generic "PCB connector" API. Two specific connectors have partial coverage: USB-C via `UsbManager` (see usb_c_port above), and the SIM tray via `TelephonyManager.getSimState()`.

**Permission:** `READ_PHONE_STATE` is not required for basic `getSimState()` (it's a lighter-weight call than signal/identity reads), though this has varied slightly across API levels — treat as effectively permission-light.

**What's exposed:** SIM tray occupied/absent/locked state (`SIM_STATE_ABSENT`, `SIM_STATE_READY`, etc.); USB-C device enumeration when something is attached (see #8).

**What's NOT exposed:** Any other physical board connector (board-to-board, FPC, battery connector) — no API surface at all; no contact-resistance/insertion-cycle/corrosion diagnostics for any connector type.

**Exposure level:** Partial.

**Fault-engine implication:** SIM-tray state and USB-C attach state are usable live inputs for their specific connectors; all other connectors and any connector-level electrical/mechanical health must come from a static spec-sheet lookup.

---

## 34. thermal_sensor

**API/class:** `android.os.PowerManager` — `getThermalHeadroom(int forecastSeconds)` (API 30+) and `getCurrentThermalStatus()` / `addThermalStatusListener()` (API 29+). Individual named component temperatures exist in `android.os.HardwarePropertiesManager` but that class is gated to system/privileged apps.

**Permission:** None for `PowerManager` thermal APIs. `HardwarePropertiesManager.getDeviceTemperatures()`/`getCpuUsages()` require system-level privilege (effectively `DEVICE_POWER`-class access) — **not available to a normal third-party app on a non-rooted device**; calls will fail/return empty for a standard app.

**What's exposed:** `getThermalHeadroom()` returns a float (0.0–1.0-ish headroom score, forecastable up to a window) indicating how close the device is to thermal throttling. `getCurrentThermalStatus()` returns one of `THERMAL_STATUS_NONE/LIGHT/MODERATE/SEVERE/CRITICAL/EMERGENCY/SHUTDOWN`. Both are device-wide, not per-component.

**What's NOT exposed:** Named individual sensor temperatures (battery/skin/CPU/GPU as distinct readings) — that's exactly what `HardwarePropertiesManager` would give, but it's system-only.

**Exposure level:** Partial.

**Fault-engine implication:** Device-wide thermal headroom/status is a genuinely useful live input for the universal thermal domain, but it cannot be attributed to a specific component (SoC vs. battery vs. charging IC); per-component thermal figures must come from a static spec-sheet lookup or be inferred (e.g. correlate battery EXTRA_TEMPERATURE, which IS component-specific and permission-free, as a proxy for battery-area thermal).

---

## 35. chassis_frame

**API/class:** None.

**Permission:** N/A.

**What's exposed:** Nothing. No structural/mechanical sensing of the frame exists in the Android SDK (no strain gauge, no flex sensor).

**Exposure level:** Not exposed.

**Fault-engine implication:** Must come from a static spec-sheet lookup (materials domain); this is the one component type where even an indirect proxy signal doesn't exist — accelerometer data could theoretically detect gross physical shock events, but that's a different measurement (shock/drop detection), not frame structural health.

---

## Cross-cutting notes for the Android app build-out

1. **Permission-free sensors are the cheapest live inputs**: accelerometer, gyroscope, magnetometer, barometer, proximity, ambient light, battery broadcast extras, thermal status/headroom, `ActivityManager.MemoryInfo`, `StatFs` storage, and `Build`/`CameraCharacteristics` static fields all require zero runtime permission prompts. These should be the first tier implemented.
2. **Location permission is a hidden dependency** for more than just GPS: Wi-Fi SSID/BSSID (API 27+), Bluetooth scanning (pre-31), and cellular `getAllCellInfo()` (API 29+) all gate behind `ACCESS_FINE_LOCATION` even though they aren't "location" features from the user's point of view — worth flagging in the app's permission-rationale UI.
3. **OEM fragmentation is concentrated in a few high-value fields**: battery `current_now`/`charge_counter`/`energy_counter`, haptic resonant frequency/Q factor, and GNSS raw measurements are the three areas where the API exists uniformly but real-device support does not — the app should null-check/fallback for all of these rather than assume presence.
4. **Nothing below the component-as-a-whole level is ever exposed**: no individual passive, no PMIC register, no MOSFET, no per-core SoC state, no chassis structural data, no true battery capacity/cycle count. All of these are permanently spec-sheet-only inputs for the fault engine, not a matter of future API additions closing the gap (they're deliberately withheld for security/privacy/abstraction reasons, not just unimplemented).
