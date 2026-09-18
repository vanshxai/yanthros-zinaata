"""
Zinaata backend API -- receives scan payloads from the Android app and
relays them to Supabase; also serves stored scans back out so the local
brain.py diagnostic engine can pull them down. Deployed on Railway.

Needs two environment variables at runtime: SUPABASE_URL and
SUPABASE_SERVICE_KEY (the service_role key, not the anon key -- this
server is the only thing writing to the scans table, so it needs the
elevated key; never ship the service key inside the Android app itself,
the app only ever talks to this server, never to Supabase directly).
"""
import os
from datetime import datetime, timezone

import requests
from flask import Flask, jsonify, request

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

app = Flask(__name__)

REQUIRED_FIELDS = {"device_model", "fields"}


def _configured():
    return bool(SUPABASE_URL and SUPABASE_SERVICE_KEY)


def _supabase_headers():
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


@app.route("/healthz")
def healthz():
    return jsonify({"ok": True, "supabase_configured": _configured()})


@app.route("/api/scan", methods=["POST"])
def receive_scan():
    if not _configured():
        return jsonify({"error": "backend not configured -- SUPABASE_URL/SUPABASE_SERVICE_KEY missing"}), 503

    payload = request.get_json(silent=True) or {}
    missing = REQUIRED_FIELDS - payload.keys()
    if missing:
        return jsonify({"error": f"missing required fields: {sorted(missing)}"}), 400

    row = {
        "platform": payload.get("platform", "android"),
        "device_model": payload["device_model"],
        "device_id": payload.get("device_id"),
        "scanned_at": payload.get("scanned_at", datetime.now(timezone.utc).isoformat()),
        "fields": payload["fields"],
    }

    # Skip the write if this device's most recent stored scan has the exact
    # same fields -- a duplicate/retried submission, not a new reading. If
    # this check itself fails, fall through and store anyway: never let a
    # dedupe hiccup cost a real scan.
    device_id = row["device_id"]
    if device_id:
        try:
            dup_resp = requests.get(
                f"{SUPABASE_URL}/rest/v1/scans",
                headers=_supabase_headers(),
                params={
                    "select": "id,fields,scanned_at",
                    "device_id": f"eq.{device_id}",
                    "order": "scanned_at.desc",
                    "limit": "1",
                },
                timeout=10,
            )
            if dup_resp.status_code < 300:
                existing = dup_resp.json()
                if existing and existing[0].get("fields") == row["fields"]:
                    return jsonify({"ok": True, "duplicate": True, "stored": existing[0]}), 200
        except requests.exceptions.RequestException:
            pass

    try:
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/scans",
            headers=_supabase_headers(),
            json=row,
            timeout=10,
        )
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "could not reach supabase", "detail": str(e)}), 502

    if resp.status_code >= 300:
        return jsonify({"error": "supabase write failed", "detail": resp.text}), 502

    return jsonify({"ok": True, "stored": resp.json()}), 201


def _supabase_get(table: str, order_col: str, device_id_param: str = "device_id"):
    if not _configured():
        return jsonify({"error": "backend not configured"}), 503

    params = {
        "select": "*",
        "order": f"{order_col}.desc",
        "limit": request.args.get("limit", "50"),
    }
    device_id = request.args.get("device_id")
    if device_id:
        params[device_id_param] = f"eq.{device_id}"
    platform = request.args.get("platform")
    if platform:
        params["platform"] = f"eq.{platform}"

    try:
        resp = requests.get(
            f"{SUPABASE_URL}/rest/v1/{table}",
            headers=_supabase_headers(),
            params=params,
            timeout=10,
        )
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "could not reach supabase", "detail": str(e)}), 502

    if resp.status_code >= 300:
        return jsonify({"error": "supabase read failed", "detail": resp.text}), 502

    return jsonify(resp.json())


STORAGE_BUCKET = "repair-feedback"


def _upload_to_storage(path: str, file_storage) -> str | None:
    """Uploads one file to Supabase Storage, returns its storage path or None on failure."""
    try:
        resp = requests.post(
            f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}/{path}",
            headers={
                "apikey": SUPABASE_SERVICE_KEY,
                "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                "Content-Type": file_storage.mimetype or "application/octet-stream",
            },
            data=file_storage.read(),
            timeout=30,
        )
        if resp.status_code < 300:
            return path
        print(f"[storage upload failed] {path}: {resp.status_code} {resp.text}")
        return None
    except requests.exceptions.RequestException as e:
        print(f"[storage upload error] {path}: {e}")
        return None


@app.route("/api/repair-feedback", methods=["POST"])
def repair_feedback():
    """
    Stores repair-feedback notes in Postgres, uploads attachments/audio/video
    to Supabase Storage (bucket must already exist -- see supabase_schema.sql).
    A file that fails to upload is just skipped rather than failing the
    whole submission -- the notes and whatever did upload still get saved.
    """
    if not _configured():
        return jsonify({"error": "backend not configured -- SUPABASE_URL/SUPABASE_SERVICE_KEY missing"}), 503

    notes = request.form.get("notes", "")
    files = request.files.getlist("files")
    audio = request.files.get("audio")
    video = request.files.get("video")

    if not notes.strip() and not files and not audio and not video:
        return jsonify({"error": "nothing submitted"}), 400

    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    file_paths = []
    for i, f in enumerate(files):
        if not f.filename:
            continue
        path = f"{stamp}/{i}_{f.filename}"
        if _upload_to_storage(path, f):
            file_paths.append(path)

    audio_path = None
    if audio and audio.filename:
        path = f"{stamp}/audio_{audio.filename}"
        audio_path = _upload_to_storage(path, audio)

    video_path = None
    if video and video.filename:
        path = f"{stamp}/video_{video.filename}"
        video_path = _upload_to_storage(path, video)

    row = {
        "platform": request.form.get("platform", "android"),
        "notes": notes,
        "owner_name": request.form.get("owner_name", ""),
        "owner_phone": request.form.get("owner_phone", ""),
        "owner_location": request.form.get("owner_location", ""),
        "engineer_name": request.form.get("engineer_name", ""),
        "file_paths": file_paths,
        "audio_path": audio_path,
        "video_path": video_path,
    }

    try:
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/repair_feedback",
            headers=_supabase_headers(),
            json=row,
            timeout=10,
        )
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "could not reach supabase", "detail": str(e)}), 502

    if resp.status_code >= 300:
        return jsonify({"error": "supabase write failed", "detail": resp.text}), 502

    summary_parts = []
    if notes.strip():
        summary_parts.append("notes")
    if file_paths:
        summary_parts.append(f"{len(file_paths)} file(s)")
    if audio_path:
        summary_parts.append("audio")
    if video_path:
        summary_parts.append("video")

    return jsonify({"ok": True, "summary": ", ".join(summary_parts)}), 201


@app.route("/api/scans", methods=["GET"])
def list_scans():
    return _supabase_get("scans", "scanned_at")


@app.route("/api/results", methods=["GET"])
def list_results():
    """
    Processed diagnostic output -- written by whatever runs brain.py against
    the scans in Supabase (not this server; that processing happens outside
    the app entirely). This endpoint only serves what's already there so the
    Admin panel's "Download Dataset" button has something to pull down.
    """
    return _supabase_get("results", "computed_at")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
