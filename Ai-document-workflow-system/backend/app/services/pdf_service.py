import os
from pathlib import Path

import pdfplumber
import pytesseract
from pypdf import PdfReader
from pdf2image import convert_from_path
from PIL import Image, ImageOps, ImageFilter


def configure_tesseract():
    tesseract_cmd = os.getenv("TESSERACT_CMD", "").strip()
    if tesseract_cmd:
        pytesseract.pytesseract.tesseract_cmd = tesseract_cmd


def get_poppler_path():
    poppler_path = os.getenv("POPPLER_PATH", "").strip()
    return poppler_path if poppler_path else None


def preprocess_image(image: Image.Image) -> Image.Image:
    gray = ImageOps.grayscale(image)
    gray = ImageOps.autocontrast(gray)
    gray = gray.filter(ImageFilter.SHARPEN)
    return gray


def ocr_image(image: Image.Image) -> str:
    configure_tesseract()
    processed = preprocess_image(image)
    language = os.getenv("OCR_LANGUAGE", "eng")
    text = pytesseract.image_to_string(
        processed,
        lang=language,
        config="--oem 3 --psm 6"
    )
    return text.strip()


def extract_text_with_pdfplumber(file_path: str) -> str:
    text_parts = []

    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            if page_text.strip():
                text_parts.append(page_text)

    return "\n".join(text_parts).strip()


def extract_text_with_pypdf(file_path: str) -> str:
    text_parts = []
    reader = PdfReader(file_path)

    for page in reader.pages:
        page_text = page.extract_text() or ""
        if page_text.strip():
            text_parts.append(page_text)

    return "\n".join(text_parts).strip()


def extract_text_from_image(file_path: str) -> str:
    image = Image.open(file_path)
    return ocr_image(image)


def extract_text_from_scanned_pdf(file_path: str) -> str:
    images = convert_from_path(
        file_path,
        dpi=300,
        poppler_path=get_poppler_path()
    )

    text_parts = []

    for image in images:
        page_text = ocr_image(image)
        if page_text.strip():
            text_parts.append(page_text)

    return "\n".join(text_parts).strip()


def extract_text(file_path: str) -> str:
    ext = Path(file_path).suffix.lower()

    if ext in [".png", ".jpg", ".jpeg"]:
        return extract_text_from_image(file_path)

    if ext == ".pdf":
        text = extract_text_with_pdfplumber(file_path)

        if len(text.strip()) < 20:
            text = extract_text_with_pypdf(file_path)

        if len(text.strip()) < 20:
            text = extract_text_from_scanned_pdf(file_path)

        return text.strip()

    raise ValueError("Unsupported file type. Please upload PDF, PNG, JPG, or JPEG.")