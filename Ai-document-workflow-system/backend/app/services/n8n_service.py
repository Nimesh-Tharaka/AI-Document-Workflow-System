import os
import httpx
from dotenv import load_dotenv

load_dotenv()

N8N_WEBHOOK_BASE = os.getenv("N8N_WEBHOOK_BASE", "").rstrip("/")


def send_n8n_event(path: str, payload: dict):
    if not N8N_WEBHOOK_BASE:
        return

    url = f"{N8N_WEBHOOK_BASE}/{path.lstrip('/')}"

    try:
        with httpx.Client(timeout=3.0) as client:
            client.post(url, json=payload)
    except Exception:
        # Do not break the main app if n8n is unavailable
        pass