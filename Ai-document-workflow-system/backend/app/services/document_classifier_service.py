import os
import json
from typing import Literal

from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError
from google import genai

load_dotenv()


class DocumentTypeDetection(BaseModel):
    document_type: Literal["invoice", "leave_request", "complaint", "unknown"] = "unknown"


def keyword_detect_document_type(text: str, filename: str = "") -> str:
    combined = f"{filename}\n{text}".lower()

    invoice_keywords = [
        "invoice",
        "vendor",
        "bill to",
        "due date",
        "invoice number",
        "total amount",
        "subtotal",
        "currency",
        "payment reference",
    ]

    leave_keywords = [
        "leave request",
        "leave type",
        "employee name",
        "vacation",
        "annual leave",
        "sick leave",
        "start date",
        "end date",
        "reason for leave",
        "department",
    ]

    complaint_keywords = [
        "complaint",
        "issue",
        "problem",
        "bad service",
        "customer name",
        "urgency",
        "priority",
        "overcharging",
        "service complaint",
    ]

    scores = {
        "invoice": sum(1 for keyword in invoice_keywords if keyword in combined),
        "leave_request": sum(1 for keyword in leave_keywords if keyword in combined),
        "complaint": sum(1 for keyword in complaint_keywords if keyword in combined),
    }

    best_type = max(scores, key=scores.get)
    best_score = scores[best_type]

    if best_score == 0:
        return "unknown"

    return best_type


def detect_document_type(text: str, filename: str = "") -> str:
    use_fake_ai = os.getenv("USE_FAKE_AI", "false").lower() == "true"
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    model_name = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

    fallback_type = keyword_detect_document_type(text, filename)

    if use_fake_ai or not api_key:
        return fallback_type

    prompt = f"""
You are a document classification assistant.

Your task is to classify the uploaded document into exactly one of these categories:
- invoice
- leave_request
- complaint
- unknown

Rules:
- Return only one document type.
- If unsure, return "unknown".
- Do not extract fields here.
- Only classify the document.

Filename:
{filename}

Document text:
{text[:12000]}
"""

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": DocumentTypeDetection,
            },
        )

        if response.parsed:
            parsed = response.parsed
            if isinstance(parsed, DocumentTypeDetection):
                result = parsed.model_dump()
            else:
                result = dict(parsed)
        else:
            result = json.loads(response.text)

        validated = DocumentTypeDetection(**result)
        detected_type = validated.document_type

        if detected_type == "unknown":
            return fallback_type

        return detected_type

    except (ValidationError, json.JSONDecodeError, TypeError, ValueError):
        return fallback_type
    except Exception:
        return fallback_type