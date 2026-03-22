import os
import re
import json
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError
from google import genai

load_dotenv()


class ComplaintExtraction(BaseModel):
    document_type: str = "complaint"
    customer_name: str = ""
    complaint_type: str = ""
    issue_summary: str = ""
    urgency: str = ""
    department: str = ""
    summary: str = ""


def clean_text(value: Optional[str]) -> str:
    if not value:
        return ""
    return str(value).strip()


def regex_complaint_parser(text: str) -> dict:
    customer_name = ""
    complaint_type = ""
    issue_summary = ""
    urgency = ""
    department = ""

    lines = [line.strip() for line in text.splitlines() if line.strip()]

    patterns = [
        (r"(?:Customer\s*Name|Name)\s*[:\-]?\s*([A-Za-z .]+)", "customer_name"),
        (r"(?:Complaint\s*Type|Issue\s*Type|Type)\s*[:\-]?\s*([A-Za-z &]+)", "complaint_type"),
        (r"(?:Urgency|Priority)\s*[:\-]?\s*([A-Za-z]+)", "urgency"),
        (r"(?:Department)\s*[:\-]?\s*([A-Za-z &]+)", "department"),
        (r"(?:Issue|Complaint|Description|Problem)\s*[:\-]?\s*(.+)", "issue_summary"),
    ]

    for pattern, field in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            value = match.group(1).strip()
            if field == "customer_name":
                customer_name = value
            elif field == "complaint_type":
                complaint_type = value
            elif field == "urgency":
                urgency = value
            elif field == "department":
                department = value
            elif field == "issue_summary":
                issue_summary = value

    if not customer_name and lines:
        customer_name = lines[0][:255]

    if not urgency:
        urgency = "normal"

    summary = (
        f"Complaint from {customer_name}."
        if customer_name
        else "Complaint processed."
    )

    return {
        "document_type": "complaint",
        "customer_name": customer_name,
        "complaint_type": complaint_type,
        "issue_summary": issue_summary,
        "urgency": urgency,
        "department": department,
        "summary": summary,
    }


def merge_with_fallback(primary: dict, fallback: dict) -> dict:
    merged = {}

    for key in [
        "document_type",
        "customer_name",
        "complaint_type",
        "issue_summary",
        "urgency",
        "department",
        "summary",
    ]:
        primary_value = clean_text(primary.get(key, ""))
        fallback_value = clean_text(fallback.get(key, ""))
        merged[key] = primary_value if primary_value else fallback_value

    if not merged.get("document_type"):
        merged["document_type"] = "complaint"

    if not merged.get("summary"):
        customer = merged.get("customer_name", "")
        merged["summary"] = (
            f"Complaint from {customer}."
            if customer
            else "Complaint processed."
        )

    return merged


def analyze_complaint_text(text: str) -> dict:
    use_fake_ai = os.getenv("USE_FAKE_AI", "false").lower() == "true"
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    model_name = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

    fallback_result = regex_complaint_parser(text)

    if use_fake_ai or not api_key:
        return fallback_result

    prompt = f"""
You are a complaint extraction assistant.

Read the complaint text and extract the fields exactly.

Rules:
- Return only complaint information.
- document_type must be "complaint".
- If a field is missing, return an empty string.
- summary must be one short sentence.

Complaint text:
{text[:15000]}
"""

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": ComplaintExtraction,
            },
        )

        if response.parsed:
            parsed = response.parsed
            if isinstance(parsed, ComplaintExtraction):
                gemini_result = parsed.model_dump()
            else:
                gemini_result = dict(parsed)
        else:
            gemini_result = json.loads(response.text)

        validated = ComplaintExtraction(**gemini_result).model_dump()
        return merge_with_fallback(validated, fallback_result)

    except (ValidationError, json.JSONDecodeError, TypeError, ValueError):
        return fallback_result
    except Exception:
        return fallback_result