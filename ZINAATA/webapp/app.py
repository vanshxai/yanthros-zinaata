"""
Zinaata browser prototype -- localhost preview of the eventual Android app's
scan screen. Serves the component catalog (from component_vocabulary.py +
the Android API exposure audit) as JSON; the page itself reads whatever a
desktop browser tab can actually read live (CPU cores, GPU string, storage
quota, screen, touch points, motion events, battery where supported) and
labels everything else "Android-only" or "spec-sheet only" per the audit,
rather than faking values a browser tab cannot produce.
"""
import os
from datetime import datetime, timezone

from flask import Flask, jsonify, render_template, request
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

app = Flask(__name__)

# status: "live_candidate" (browser_key set, page will try to read it),
# "android_only" (real signal exists per the audit, but only on Android),
# "spec_only" (audit found zero runtime API anywhere -- device-model lookup only)
CATALOG = [
    {
        "category": "Compute",
        "items": [
            {"id": "soc_processor", "label": "SoC / Processor", "status": "live_candidate", "browser_key": "cpu"},
            {"id": "ram", "label": "RAM", "status": "live_candidate", "browser_key": "ram"},
            {"id": "flash_storage", "label": "Flash Storage", "status": "live_candidate", "browser_key": "storage"},
            {"id": "gpu", "label": "GPU", "status": "live_candidate", "browser_key": "gpu"},
        ],
    },
    {
        "category": "Power",
        "items": [
            {"id": "battery", "label": "Battery", "status": "live_candidate", "browser_key": "battery"},
            {"id": "charging_ic", "label": "Charging IC", "status": "android_only", "browser_key": None},
            {"id": "voltage_regulator", "label": "Voltage Regulator (PMIC)", "status": "spec_only", "browser_key": None},
            {"id": "usb_c_port", "label": "USB-C Port", "status": "android_only", "browser_key": None},
        ],
    },
    {
        "category": "Display & Input",
        "items": [
            {"id": "display_panel", "label": "Display Panel", "status": "live_candidate", "browser_key": "display"},
            {"id": "touch_digitizer", "label": "Touch Digitizer", "status": "live_candidate", "browser_key": "touch"},
            {"id": "fingerprint_sensor", "label": "Fingerprint Sensor", "status": "spec_only", "browser_key": None},
        ],
    },
    {
        "category": "Camera",
        "items": [
            {"id": "image_sensor", "label": "Image Sensor", "status": "android_only", "browser_key": None},
            {"id": "lens_actuator", "label": "Lens Actuator (AF/OIS)", "status": "android_only", "browser_key": None},
            {"id": "camera_flash_led", "label": "Camera Flash LED", "status": "android_only", "browser_key": None},
        ],
    },
    {
        "category": "Motion & Env Sensors",
        "items": [
            {"id": "accelerometer", "label": "Accelerometer", "status": "live_candidate", "browser_key": "accel"},
            {"id": "gyroscope", "label": "Gyroscope", "status": "live_candidate", "browser_key": "gyro"},
            {"id": "magnetometer", "label": "Magnetometer", "status": "android_only", "browser_key": None},
            {"id": "barometer", "label": "Barometer", "status": "android_only", "browser_key": None},
            {"id": "proximity_sensor", "label": "Proximity Sensor", "status": "android_only", "browser_key": None},
            {"id": "ambient_light_sensor", "label": "Ambient Light Sensor", "status": "android_only", "browser_key": None},
        ],
    },
    {
        "category": "Audio & Haptics",
        "items": [
            {"id": "microphone", "label": "Microphone", "status": "live_candidate", "browser_key": "mic_count"},
            {"id": "speaker", "label": "Speaker", "status": "live_candidate", "browser_key": "speaker_count"},
            {"id": "haptic_motor", "label": "Haptic Motor (LRA/ERM)", "status": "android_only", "browser_key": None},
        ],
    },
    {
        "category": "Radios",
        "items": [
            {"id": "wifi_module", "label": "Wi-Fi", "status": "live_candidate", "browser_key": "network"},
            {"id": "bluetooth_module", "label": "Bluetooth", "status": "android_only", "browser_key": None},
            {"id": "nfc_module", "label": "NFC", "status": "android_only", "browser_key": None},
            {"id": "cellular_modem", "label": "Cellular Modem", "status": "android_only", "browser_key": None},
            {"id": "gps_gnss_receiver", "label": "GPS / GNSS", "status": "android_only", "browser_key": None},
            {"id": "antenna", "label": "Antenna", "status": "spec_only", "browser_key": None},
        ],
    },
    {
        "category": "Thermal",
        "items": [
            {"id": "thermal_sensor", "label": "Thermal Sensor", "status": "android_only", "browser_key": None},
        ],
    },
    {
        "category": "Chassis",
        "items": [
            {"id": "chassis_frame", "label": "Chassis / Frame", "status": "spec_only", "browser_key": None},
        ],
    },
    {
        "category": "Passive & Discrete",
        "items": [
            {"id": "pcb_passive", "label": "PCB Passives (R/C/L)", "status": "spec_only", "browser_key": None},
            {"id": "mosfet_transistor", "label": "MOSFET / Transistor", "status": "spec_only", "browser_key": None},
            {"id": "status_led", "label": "Status LED", "status": "spec_only", "browser_key": None},
            {"id": "pcb_connector", "label": "PCB Connector", "status": "android_only", "browser_key": None},
        ],
    },
]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/components")
def api_components():
    return jsonify(CATALOG)


@app.route("/api/results")
def api_results():
    """
    Local stand-in for the real backend's GET /api/results (see
    ZINAATA/backend/server.py). Always empty here -- there's no real
    processing pipeline behind this preview server -- but it lets the
    Admin panel's "Download Dataset" button be tested end to end (point
    its backend URL at http://localhost:5091 to see the honest
    "no results available yet" path round-trip for real).
    """
    return jsonify([])


@app.route("/api/repair-feedback", methods=["POST"])
def repair_feedback():
    """
    Local-only preview of the real submission pipeline (this'll be a
    Railway endpoint once the native app sends it there for real). Saves
    to disk purely so the round-trip -- notes, files, audio, video -- can
    actually be verified working end to end, not just the UI in isolation.
    """
    notes = request.form.get("notes", "")
    files = request.files.getlist("files")
    audio = request.files.get("audio")
    video = request.files.get("video")
    owner_name = request.form.get("owner_name", "")
    owner_phone = request.form.get("owner_phone", "")
    owner_location = request.form.get("owner_location", "")
    engineer_name = request.form.get("engineer_name", "")

    if not notes.strip() and not files and not audio and not video:
        return jsonify({"error": "nothing submitted"}), 400

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    submission_dir = os.path.join(UPLOADS_DIR, stamp)
    os.makedirs(submission_dir, exist_ok=True)

    with open(os.path.join(submission_dir, "label.txt"), "w") as f:
        f.write(
            f"owner_name: {owner_name}\nowner_phone: {owner_phone}\n"
            f"owner_location: {owner_location}\nengineer_name: {engineer_name}\n"
        )

    if notes.strip():
        with open(os.path.join(submission_dir, "notes.txt"), "w") as f:
            f.write(notes)

    saved_files = []
    for f in files:
        if not f.filename:
            continue
        name = secure_filename(f.filename)
        f.save(os.path.join(submission_dir, name))
        saved_files.append(name)

    if audio and audio.filename:
        audio.save(os.path.join(submission_dir, "voice-note.webm"))
    if video and video.filename:
        video.save(os.path.join(submission_dir, "video.webm"))

    summary_parts = []
    if notes.strip():
        summary_parts.append("notes")
    if saved_files:
        summary_parts.append(f"{len(saved_files)} file(s)")
    if audio and audio.filename:
        summary_parts.append("audio")
    if video and video.filename:
        summary_parts.append("video")

    return jsonify({"ok": True, "saved_to": submission_dir, "summary": ", ".join(summary_parts)}), 201


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5091, debug=True)
