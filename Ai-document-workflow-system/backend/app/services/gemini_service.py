import os
import re
import json
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError
from google import genai

load_dotenv()


class InvoiceExtraction(BaseModel):
    document_type: str = "invoice"
    vendor_name: str = ""
    invoice_number: str = ""
    invoice_date: str = ""
    due_date: str = ""
    total_amount: str = ""
    currency: str = ""
    summary: str = ""


def clean_text(value: Optional[str]) -> str:
    if not value:
        return ""
    return str(value).strip()


def normalize_currency_from_amount(total_amount: str) -> str:
    if not total_amount:
        return ""

    text = total_amount.strip()

    if text.upper().startswith("LKR"):
        return "LKR"
    if text.upper().startswith("USD"):
        return "USD"
    if text.upper().startswith("EUR"):
        return "EUR"
    if text.upper().startswith("GBP"):
        return "GBP"
    if text.startswith("Rs") or text.startswith("RS") or "LKR" in text.upper():
        return "LKR"
    if text.startswith("$"):
        return "USD"

    return ""


def regex_invoice_parser(text: str) -> dict:
    vendor_name = ""
    invoice_number = ""
    invoice_date = ""
    due_date = ""
    total_amount = ""
    currency = ""

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    if lines:
        vendor_name = lines[0][:255]

    invoice_patterns = [
        r"(?:Invoice\s*(?:No|#|Number)?)\s*[:\-]?\s*([A-Za-z0-9\-\/]+)",
        r"(?:Bill\s*(?:No|#|Number)?)\s*[:\-]?\s*([A-Za-z0-9\-\/]+)",
    ]

    for pattern in invoice_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            invoice_number = match.group(1).strip()
            break

    date_patterns = [
        r"(?:Invoice\s*Date)\s*[:\-]?\s*([A-Za-z0-9,\/\-\s]+)",
        r"(?:Date)\s*[:\-]?\s*([A-Za-z0-9,\/\-\s]+)",
    ]

    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            invoice_date = match.group(1).strip()
            break

    due_patterns = [
        r"(?:Due\s*Date)\s*[:\-]?\s*([A-Za-z0-9,\/\-\s]+)",
        r"(?:Payment\s*Due)\s*[:\-]?\s*([A-Za-z0-9,\/\-\s]+)",
    ]

    for pattern in due_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            due_date = match.group(1).strip()
            break

    total_patterns = [
        r"(?:Grand\s*Total)\s*[:\-]?\s*([A-Z]{0,3}\s?[\d,]+(?:\.\d{2})?)",
        r"(?:Amount\s*Due)\s*[:\-]?\s*([A-Z]{0,3}\s?[\d,]+(?:\.\d{2})?)",
        r"(?:Total)\s*[:\-]?\s*([A-Z]{0,3}\s?[\d,]+(?:\.\d{2})?)",
        r"(?:Grand\s*Total)\s*[:\-]?\s*(Rs\.?\s?[\d,]+(?:\.\d{2})?)",
        r"(?:Amount\s*Due)\s*[:\-]?\s*(Rs\.?\s?[\d,]+(?:\.\d{2})?)",
        r"(?:Total)\s*[:\-]?\s*(Rs\.?\s?[\d,]+(?:\.\d{2})?)",
        r"(?:Grand\s*Total)\s*[:\-]?\s*(\$[\d,]+(?:\.\d{2})?)",
        r"(?:Amount\s*Due)\s*[:\-]?\s*(\$[\d,]+(?:\.\d{2})?)",
        r"(?:Total)\s*[:\-]?\s*(\$[\d,]+(?:\.\d{2})?)",
    ]

    for pattern in total_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            total_amount = match.group(1).strip()
            break

    currency = normalize_currency_from_amount(total_amount)

    return {
        "document_type": "invoice",
        "vendor_name": vendor_name,
        "invoice_number": invoice_number,
        "invoice_date": invoice_date,
        "due_date": due_date,
        "total_amount": total_amount,
        "currency": currency,
        "summary": f"Invoice processed for vendor '{vendor_name}'." if vendor_name else "Invoice processed.",
    }


def merge_with_fallback(primary: dict, fallback: dict) -> dict:
    merged = {}

    for key in [
        "document_type",
        "vendor_name",
        "invoice_number",
        "invoice_date",
        "due_date",
        "total_amount",
        "currency",
        "summary",
    ]:
        primary_value = clean_text(primary.get(key, ""))
        fallback_value = clean_text(fallback.get(key, ""))

        merged[key] = primary_value if primary_value else fallback_value

    if not merged.get("document_type"):
        merged["document_type"] = "invoice"

    if not merged.get("currency"):
        merged["currency"] = normalize_currency_from_amount(merged.get("total_amount", ""))

    if not merged.get("summary"):
        vendor = merged.get("vendor_name", "")
        merged["summary"] = f"Invoice processed for vendor '{vendor}'." if vendor else "Invoice processed."

    return merged


def analyze_invoice_text(text: str) -> dict:
    use_fake_ai = os.getenv("USE_FAKE_AI", "false").lower() == "true"
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    model_name = os.getenv("GEMINI_MODEL", "gemini-3-flash-preview")

    fallback_result = regex_invoice_parser(text)

    if use_fake_ai or not api_key:
        return fallback_result

    prompt = f"""
You are an invoice extraction assistant.

Read the invoice text and extract the fields exactly.

Rules:
- Return only invoice information.
- document_type must be "invoice".
- If a field is missing, return an empty string.
- Keep dates exactly as found in the document.
- Keep amounts exactly as found in the document.
- summary must be one short sentence.

Invoice text:
{text[:15000]}
"""

    try:
        client = genai.Client(api_key=api_key)

        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": InvoiceExtraction,
            },
        )

        if response.parsed:
            parsed = response.parsed
            if isinstance(parsed, InvoiceExtraction):
                gemini_result = parsed.model_dump()
            else:
                gemini_result = dict(parsed)
        else:
            gemini_result = json.loads(response.text)

        validated = InvoiceExtraction(**gemini_result).model_dump()

        return merge_with_fallback(validated, fallback_result)

    except (ValidationError, json.JSONDecodeError, TypeError, ValueError):
        return fallback_result
    except Exception:
        return fallback_result