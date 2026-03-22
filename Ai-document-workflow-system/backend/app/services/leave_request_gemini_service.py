import os
import re
import json
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError
from google import genai

load_dotenv()


class LeaveRequestExtraction(BaseModel):
    document_type: str = "leave_request"
    employee_name: str = ""
    leave_type: str = ""
    start_date: str = ""
    end_date: str = ""
    reason: str = ""
    department: str = ""
    summary: str = ""


def clean_text(value: Optional[str]) -> str:
    if not value:
        return ""
    return str(value).strip()


def regex_leave_request_parser(text: str) -> dict:
    employee_name = ""
    leave_type = ""
    start_date = ""
    end_date = ""
    reason = ""
    department = ""

    lines = [line.strip() for line in text.splitlines() if line.strip()]

    employee_patterns = [
        r"(?:Employee\s*Name|Name)\s*[:\-]?\s*([A-Za-z .]+)",
    ]
    for pattern in employee_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            employee_name = match.group(1).strip()
            break

    leave_type_patterns = [
        r"(?:Leave\s*Type|Type\s*of\s*Leave)\s*[:\-]?\s*([A-Za-z ]+)",
    ]
    for pattern in leave_type_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            leave_type = match.group(1).strip()
            break

    start_patterns = [
        r"(?:Start\s*Date|From)\s*[:\-]?\s*([A-Za-z0-9,\/\-\s]+)",
    ]
    for pattern in start_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            start_date = match.group(1).strip()
            break

    end_patterns = [
        r"(?:End\s*Date|To)\s*[:\-]?\s*([A-Za-z0-9,\/\-\s]+)",
    ]
    for pattern in end_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            end_date = match.group(1).strip()
            break

    department_patterns = [
        r"(?:Department)\s*[:\-]?\s*([A-Za-z &]+)",
    ]
    for pattern in department_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            department = match.group(1).strip()
            break

    reason_patterns = [
        r"(?:Reason|Purpose)\s*[:\-]?\s*(.+)",
    ]
    for pattern in reason_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            reason = match.group(1).strip()
            break

    if not employee_name and lines:
        employee_name = lines[0][:255]

    summary = (
        f"Leave request for {employee_name}."
        if employee_name
        else "Leave request processed."
    )

    return {
        "document_type": "leave_request",
        "employee_name": employee_name,
        "leave_type": leave_type,
        "start_date": start_date,
        "end_date": end_date,
        "reason": reason,
        "department": department,
        "summary": summary,
    }


def merge_with_fallback(primary: dict, fallback: dict) -> dict:
    merged = {}

    for key in [
        "document_type",
        "employee_name",
        "leave_type",
        "start_date",
        "end_date",
        "reason",
        "department",
        "summary",
    ]:
        primary_value = clean_text(primary.get(key, ""))
        fallback_value = clean_text(fallback.get(key, ""))
        merged[key] = primary_value if primary_value else fallback_value

    if not merged.get("document_type"):
        merged["document_type"] = "leave_request"

    if not merged.get("summary"):
        employee = merged.get("employee_name", "")
        merged["summary"] = (
            f"Leave request for {employee}."
            if employee
            else "Leave request processed."
        )

    return merged


def analyze_leave_request_text(text: str) -> dict:
    use_fake_ai = os.getenv("USE_FAKE_AI", "false").lower() == "true"
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    model_name = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

    fallback_result = regex_leave_request_parser(text)

    if use_fake_ai or not api_key:
        return fallback_result

    prompt = f"""
You are a leave request extraction assistant.

Read the leave request text and extract the fields exactly.

Rules:
- Return only leave request information.
- document_type must be "leave_request".
- If a field is missing, return an empty string.
- summary must be one short sentence.

Leave request text:
{text[:15000]}
"""

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": LeaveRequestExtraction,
            },
        )

        if response.parsed:
            parsed = response.parsed
            if isinstance(parsed, LeaveRequestExtraction):
                gemini_result = parsed.model_dump()
            else:
                gemini_result = dict(parsed)
        else:
            gemini_result = json.loads(response.text)

        validated = LeaveRequestExtraction(**gemini_result).model_dump()
        return merge_with_fallback(validated, fallback_result)

    except (ValidationError, json.JSONDecodeError, TypeError, ValueError):
        return fallback_result
    except Exception:
        return fallback_result