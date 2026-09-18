"""
Zinaata's component -> physics-domain table, the phone-hardware equivalent
of COMPONENT_TYPE_TO_DOMAINS in formula_selector.py (industrial project,
not copied into this folder -- see FRAMEWORK.md "What's deliberately NOT
copied"). Same mechanism: a component type name maps to a set of domains
that exist in formulas.py; the union of matched domains is what gets
pulled out of the 333-formula library for a given phone.

Every domain string below was checked against FORMULA_DOMAINS in
formulas.py before being used here -- nothing invented. Domains that
exist in the engine but don't belong on a phone (aerospace, hydraulics,
induction_motor, civil_structural, welding_joints, pressure_vessels,
hvac_refrigeration, transformer, synchronous_machine, renewable_energy,
chemistry) are intentionally never referenced.

Status: draft, not wired into brain.py or any Android code yet. This is
the scoping step FRAMEWORK.md asks for -- next steps (not done here):
confirm which of these signals the Android APIs actually expose per
component, then build the analogous build_subset()/domains_for_device()
functions once real device data is coming in.
"""

# Applies to every phone regardless of which components are reported.
#
# power: ESP32-style current/voltage/battery-life formulas
#   (supply_current, voltage_drop, power_consumption, battery_life) --
#   FRAMEWORK.md already flags these as present and directly reusable.
# universal: heat-transfer formulas (convection, conduction, radiation,
#   thermal resistance) are broadly applicable to any chip/battery
#   thermal question. The vibration/fatigue half of this domain
#   (natural_frequency, goodman_fatigue_criterion, rotating_unbalance_
#   response, etc.) assumes a rotating/loaded mechanical system -- mostly
#   not applicable to a phone, EXCEPT where a lens_actuator or
#   haptic_motor component is present (both are small rotating/vibrating
#   parts). Kept always-on anyway per the industrial convention: an
#   unused formula is harmless, a missing one breaks the chain.
# fault_pattern: severity_growth_asymptotic/linear are generic
#   degradation-over-time models (battery fade, thermal drift, sensor
#   drift all fit) -- not device-specific, always relevant.
#
# NOT carried over from the industrial ALWAYS_INCLUDE: "design" and
# "manufacturing" (rotor/casting/machining geometry -- makes a part, not
# diagnosing a working device) and "illumination" (checked: its 2
# formulas are room-lighting calcs -- lumen_method_illuminance,
# luminous_efficacy -- not LED driver electronics, so they don't apply
# to a camera flash or status LED the way they'd apply to a factory
# light fixture. A phone LED's fault-relevant physics is electronics
# domain (forward voltage/current, thermal derating), already covered.
ALWAYS_INCLUDE = {"power", "universal", "fault_pattern"}

COMPONENT_TYPE_TO_DOMAINS = {
    # --- Compute ---
    "soc_processor":     {"electronics", "thermal", "timing", "gpio"},
    "ram":                {"electronics", "thermal"},
    "flash_storage":      {"electronics", "thermal"},
    "gpu":                {"electronics", "thermal"},

    # --- Power ---
    "battery":            {"battery_chemistry", "electrical", "thermal"},
    "charging_ic":        {"electronics", "thermal"},
    "voltage_regulator":  {"electronics", "electrical", "thermal"},  # PMIC
    "usb_c_port":         {"electronics", "electrical"},

    # --- Display / input ---
    "display_panel":      {"electronics", "thermal"},
    "touch_digitizer":    {"instrumentation", "electronics"},
    "fingerprint_sensor": {"instrumentation", "electronics"},

    # --- Camera ---
    "image_sensor":       {"instrumentation", "electronics"},
    "lens_actuator":      {"magnetic", "mechanical", "electronics"},  # AF/OIS voice-coil motor
    "camera_flash_led":   {"electronics", "thermal"},

    # --- Motion / environmental sensors ---
    "accelerometer":      {"instrumentation", "electronics"},
    "gyroscope":          {"instrumentation", "electronics"},
    "magnetometer":       {"instrumentation", "magnetic", "electronics"},
    "barometer":          {"instrumentation", "electronics"},
    "proximity_sensor":   {"instrumentation", "electronics"},
    "ambient_light_sensor": {"instrumentation", "electronics"},

    # --- Audio / haptics ---
    "microphone":         {"electronics", "instrumentation"},
    "speaker":            {"electronics", "magnetic"},
    "haptic_motor":       {"magnetic", "mechanical", "electronics"},  # LRA/ERM

    # --- Radios ---
    "wifi_module":        {"rf", "electronics"},
    "bluetooth_module":   {"rf", "electronics"},
    "nfc_module":         {"rf", "electronics", "magnetic"},  # inductive coupling
    "cellular_modem":     {"rf", "electronics", "thermal"},
    "gps_gnss_receiver":  {"rf", "electronics"},
    "antenna":            {"rf"},

    # --- Passive / discrete board components ---
    "pcb_passive":        {"electronics"},  # SMD resistor/cap/inductor
    "mosfet_transistor":  {"electronics", "thermal"},
    "status_led":         {"electronics", "thermal"},
    "pcb_connector":      {"electronics", "materials"},

    # --- Thermal ---
    "thermal_sensor":     {"instrumentation", "thermal"},

    # --- Chassis (mentioned in FRAMEWORK.md's materials note) ---
    "chassis_frame":      {"materials", "mechanical"},
}
