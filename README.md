# AI Document Workflow System

AI-powered document workflow automation platform for **invoice processing**, **leave request handling**, and **complaint routing** with **FastAPI**, **React**, **PostgreSQL**, **Gemini OCR extraction**, and **n8n automation**.

This project helps organizations upload documents, extract important fields, route them to the correct department, manage approvals, and maintain a full audit trail from a single dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Main Features](#main-features)
- [Supported Modules](#supported-modules)
- [Screenshots](#screenshots)
- [How the System Works](#how-the-system-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Authentication and Roles](#authentication-and-roles)
- [Module Workflows](#module-workflows)
- [n8n Automation Workflows](#n8n-automation-workflows)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [How to Run](#how-to-run)
- [Demo Accounts](#demo-accounts)
- [Current Scope](#current-scope)
- [Future Improvements](#future-improvements)
- [Why This Project Matters](#why-this-project-matters)
- [License](#license)
- [Author](#author)

---

## Overview

The **AI Document Workflow System** is a full-stack document automation platform designed to reduce manual work in business document processing.

The system currently supports:

- **Invoices**
- **Leave Requests**
- **Complaints**

It also includes a **Universal Upload** entry point to accept mixed document uploads from one place.

After a document is uploaded, the system:

1. Extracts text from PDF or image files
2. Uses AI to identify structured fields
3. Stores extracted data in PostgreSQL
4. Routes the document to the correct department
5. Triggers n8n automation workflows
6. Supports approval, rejection, comments, and audit logs
7. Displays everything in a clean white dashboard UI

---

## Main Features

### Core Features

- Upload **PDF, JPG, JPEG, and PNG** documents
- OCR support for scanned documents and images
- AI field extraction using **Gemini**
- Structured data storage using **PostgreSQL**
- Module-based document management
- Universal upload flow
- Automatic department routing
- Manual reassignment support
- Approval and rejection workflow
- Comments and review notes
- Full audit log tracking
- JWT-based authentication
- Role-based access control
- Clean white dashboard interface
- Analytics dashboard for invoice processing

### Status Values

- `processed`
- `pending_review`
- `approved`
- `rejected`
- `needs_correction`
- `workflow_completed`

---

## Supported Modules

### 1. Universal Upload

A single upload entry point that accepts mixed document types and routes them to the correct processing flow.

### 2. Invoice Module

Extracts and manages invoice details such as:

- Vendor name
- Invoice number
- Invoice date
- Due date
- Total amount
- Currency
- Summary

**Main department:** Finance

### 3. Leave Request Module

Extracts and manages leave-related information such as:

- Employee name
- Leave type
- Start date
- End date
- Reason
- Department
- Summary

**Main department:** HR

### 4. Complaint Module

Extracts and manages complaint information such as:

- Customer name
- Complaint type
- Urgency
- Issue summary
- Assigned department
- Summary

**Main routing behavior:**

- Normal complaints → Customer Support
- High urgency complaints → Operations

---

## Screenshots

> Create a folder named `screenshots` in your repository root and place the image files there using the same filenames shown below.

### Login Page

<img src="screenshots/Screenshot_22-3-2026_20218_localhost.jpeg" alt="Login Page" width="100%" />

### Home Dashboard

<img src="screenshots/Screenshot_22-3-2026_195721_localhost.jpeg" alt="Home Dashboard" width="100%" />

### Invoice Analytics Dashboard

<img src="screenshots/Screenshot_22-3-2026_195858_localhost.jpeg" alt="Invoice Dashboard" width="100%" />

### Leave Requests List Page

<img src="screenshots/Screenshot_22-3-2026_195840_localhost.jpeg" alt="Leave Request List" width="100%" />

### Leave Request Detail Page

<img src="screenshots/Screenshot_22-3-2026_20026_localhost.jpeg" alt="Leave Request Detail" width="100%" />

### Complaint List Page

<img src="screenshots/Screenshot_22-3-2026_195849_localhost.jpeg" alt="Complaint List" width="100%" />

### Complaint Detail Page

<img src="screenshots/Screenshot_22-3-2026_2008_localhost.jpeg" alt="Complaint Detail" width="100%" />

### Invoice Detail Page

<img src="screenshots/Screenshot_22-3-2026_195825_localhost.jpeg" alt="Invoice Detail" width="100%" />

### Docker Desktop Running n8n

<img src="screenshots/docker%20ss.png" alt="Docker Desktop n8n Container" width="100%" />

### n8n Invoice Routing Workflow

<img src="screenshots/n8n%20work%201%20ss.png" alt="Invoice Routing Workflow" width="100%" />

### n8n Invoice Approval Workflow

<img src="screenshots/n8n%20work%202%20ss.png" alt="Invoice Approval Workflow" width="100%" />

### n8n Invoice Approval Workflow Execution View

<img src="screenshots/n8n%20work%203%20ss.png" alt="Invoice Approval Workflow Execution" width="100%" />

### n8n Approval Workflow View

<img src="screenshots/n8n%20work%204%20ss.png" alt="Approval Workflow View" width="100%" />

### n8n Leave Request Routing Workflow

<img src="screenshots/n8n%20work%205%20ss.png" alt="Leave Request Routing Workflow" width="100%" />

### n8n Leave Request Approval Workflow

<img src="screenshots/n8n%20work%206%20ss.png" alt="Leave Request Approval Workflow" width="100%" />

### n8n Complaint Routing Workflow

<img src="screenshots/n8n%20work%207%20ss.png" alt="Complaint Routing Workflow" width="100%" />

---

## How the System Works

### Step 1 — Upload

A user uploads a document through the frontend.

### Step 2 — Text Extraction

The backend reads the document and extracts text using:

- `pdfplumber` or `pypdf` for text-based PDFs
- `Tesseract OCR` for scanned PDFs and images

### Step 3 — AI Extraction

The extracted text is sent to **Gemini**, which returns structured fields depending on the document type.

### Step 4 — Save Data

The backend stores:

- File metadata
- Raw extracted text
- AI-extracted structured data
- Workflow status
- Assigned department
- Approval comments
- Audit logs

### Step 5 — Route Through n8n

FastAPI triggers n8n webhook flows for routing and approval tracking.

### Step 6 — Review and Approval

Approvers can:

- Mark pending review
- Approve
- Reject
- Add comments
- Reassign department manually

### Step 7 — Audit Logging

All important actions are tracked, including:

- Uploaded
- Processed
- Routed
- Manually assigned
- Approved
- Rejected
- Commented
- Workflow completed

---

## Architecture

```text
React + Vite + Tailwind
        |
        v
     FastAPI
        |
        +--> PostgreSQL
        |
        +--> PDF / OCR Extraction
        |
        +--> Gemini AI Extraction
        |
        +--> n8n Webhooks
                |
                +--> Routing Workflow
                |
                +--> Approval Workflow
```

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Recharts

### Backend

- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database

- PostgreSQL

### AI and OCR

- Gemini API
- pdfplumber
- pypdf
- pytesseract
- Tesseract OCR

### Automation

- n8n
- Docker Desktop

### Authentication

- JWT
- PyJWT
- Password hashing utilities

---

## Project Structure

```text
ai-document-workflow-system/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── deps.py
│   │   │   └── security.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── invoice.py
│   │   │   ├── leave_request.py
│   │   │   ├── complaint.py
│   │   │   └── workflow.py
│   │   ├── services/
│   │   │   ├── pdf_service.py
│   │   │   ├── gemini_service.py
│   │   │   ├── leave_request_gemini_service.py
│   │   │   ├── complaint_gemini_service.py
│   │   │   └── n8n_service.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   ├── uploads/
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authApi.js
│   │   │   ├── invoiceApi.js
│   │   │   ├── leaveRequestApi.js
│   │   │   └── complaintApi.js
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── n8n/
│   └── docker-compose.yml
│
├── screenshots/
│   ├── Screenshot_22-3-2026_20218_localhost.jpeg
│   ├── Screenshot_22-3-2026_195721_localhost.jpeg
│   ├── Screenshot_22-3-2026_195858_localhost.jpeg
│   ├── Screenshot_22-3-2026_195840_localhost.jpeg
│   ├── Screenshot_22-3-2026_20026_localhost.jpeg
│   ├── Screenshot_22-3-2026_195849_localhost.jpeg
│   ├── Screenshot_22-3-2026_2008_localhost.jpeg
│   ├── Screenshot_22-3-2026_195825_localhost.jpeg
│   ├── docker ss.png
│   ├── n8n work 1 ss.png
│   ├── n8n work 2 ss.png
│   ├── n8n work 3 ss.png
│   ├── n8n work 4 ss.png
│   ├── n8n work 5 ss.png
│   ├── n8n work 6 ss.png
│   └── n8n work 7 ss.png
│
└── README.md
```

---

## Authentication and Roles

The system uses **JWT-based authentication**.

### Admin

- Upload documents
- View all records
- Route documents
- Approve or reject
- Add comments
- Access dashboard analytics

### Staff

- Upload documents
- View submitted documents

### Approver

- View routed documents
- Approve or reject
- Add workflow comments
- Review history and logs

---

## Module Workflows

### Invoice Workflow

1. Upload invoice
2. Extract invoice text
3. Extract fields with Gemini
4. Save data in database
5. Trigger n8n routing
6. Route to Finance or high-value flow
7. Approval workflow begins
8. Approve, reject, or mark pending review
9. Store comments and audit logs

### Leave Request Workflow

1. Upload leave request
2. Extract text
3. Extract leave details with Gemini
4. Save data
5. Trigger n8n routing
6. Route to HR
7. Begin approval workflow
8. Approve, reject, or mark pending review
9. Store comments and logs

### Complaint Workflow

1. Upload complaint
2. Extract text
3. Extract complaint fields with Gemini
4. Save data
5. Trigger n8n routing
6. Route by urgency
7. Begin review flow
8. Approve, reject, or mark pending review
9. Maintain comments and audit logs

---

## n8n Automation Workflows

This project uses **webhook-based n8n workflows** to automate routing and approval updates.

### Invoice Routing Workflow

- Receives invoice payload from backend
- Checks invoice value or business rule
- Routes to correct finance path
- Sends routing result back to FastAPI

### Invoice Approval Workflow

- Receives approval action
- Checks whether status is:
  - approved
  - rejected
  - pending_review
- Sends appropriate workflow update back to backend
- Logs the approval stage in the system

### Leave Request Routing Workflow

- Receives leave request payload
- Routes directly to HR
- Returns workflow update to backend

### Leave Request Approval Workflow

- Receives approval decision
- Handles approved, rejected, and pending review cases
- Updates backend workflow records

### Complaint Routing Workflow

- Receives complaint payload
- Checks complaint urgency
- Routes high urgency complaints to Operations
- Routes normal complaints to Customer Support
- Sends routing result back to backend

### Docker Note

n8n runs inside Docker and communicates with the backend through HTTP requests.

When backend is running on the host machine, n8n can use:

```text
http://host.docker.internal:8000
```

for callback/update endpoints.

---

## API Overview

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Invoice

- `POST /api/invoices/upload`
- `GET /api/invoices`
- `GET /api/invoices/{invoice_id}`
- `PATCH /api/invoices/{invoice_id}/status`
- `POST /api/invoices/{invoice_id}/route/auto`
- `PATCH /api/invoices/{invoice_id}/route/manual`
- `POST /api/invoices/{invoice_id}/comments`
- `GET /api/invoices/{invoice_id}/comments`
- `GET /api/invoices/{invoice_id}/audit-logs`

### Leave Request

- `POST /api/leave-requests/upload`
- `GET /api/leave-requests`
- `GET /api/leave-requests/{leave_request_id}`
- `PATCH /api/leave-requests/{leave_request_id}/status`
- `POST /api/leave-requests/{leave_request_id}/route/auto`
- `PATCH /api/leave-requests/{leave_request_id}/route/manual`
- `POST /api/leave-requests/{leave_request_id}/comments`
- `GET /api/leave-requests/{leave_request_id}/comments`
- `GET /api/leave-requests/{leave_request_id}/audit-logs`

### Complaint

- `POST /api/complaints/upload`
- `GET /api/complaints`
- `GET /api/complaints/{complaint_id}`
- `PATCH /api/complaints/{complaint_id}/status`
- `POST /api/complaints/{complaint_id}/route/auto`
- `PATCH /api/complaints/{complaint_id}/route/manual`
- `POST /api/complaints/{complaint_id}/comments`
- `GET /api/complaints/{complaint_id}/comments`
- `GET /api/complaints/{complaint_id}/audit-logs`

---

## Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_document_workflow
FRONTEND_URL=http://localhost:5173

SECRET_KEY=change_this_to_a_long_random_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=120

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3-flash-preview

USE_FAKE_AI=false

N8N_WEBHOOK_BASE=http://127.0.0.1:5678/webhook
SERVICE_API_KEY=super_secret_service_key_123

TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-document-workflow-system.git
cd ai-document-workflow-system
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

### 4. Setup n8n with Docker

Create `n8n/docker-compose.yml`:

```yaml
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
    volumes:
      - ./n8n_data:/home/node/.n8n
```

Run:

```bash
cd ../n8n
docker compose up -d
```

---

## How to Run

### Start PostgreSQL

Make sure PostgreSQL is installed and the database exists.

### Start Backend

```bash
cd backend
venv\Scripts\activate
fastapi dev app/main.py --host 0.0.0.0 --port 8000
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### Start n8n

```bash
cd n8n
docker compose up -d
```

n8n URL:

```text
http://localhost:5678
```

---

## Demo Accounts

### Admin

- Username: `admin`
- Password: `admin123`

### Staff

- Username: `staff`
- Password: `staff123`

### Approver

- Username: `approver`
- Password: `approver123`

---

## Current Scope

This project currently includes:

- Universal Upload
- Invoice Processing
- Leave Request Processing
- Complaint Processing
- Routing Workflows with n8n
- Approval Tracking with n8n
- Comments and audit trail
- White dashboard UI
- Invoice analytics dashboard

This is the current MVP scope.

---

## Future Improvements

- Email notifications
- File preview and download
- Better document type auto-detection
- Unified analytics across all modules
- Role management UI
- Exportable reports
- Cloud deployment
- Multi-tenant support
- Smarter routing rules
- Better dashboard insights for leave requests and complaints

---

## Why This Project Matters

This project demonstrates strong practical skills in:

- Full-stack software development
- AI-assisted document understanding
- OCR integration for scanned files
- API development with FastAPI
- React dashboard design
- Database modeling with PostgreSQL
- Workflow automation using n8n
- Docker-based automation setup
- Approval pipelines and audit logging
- Real business process digitization

It is a strong portfolio project for:

- Software Engineering
- AI Workflow Automation
- Business Process Automation
- Full-Stack Development

---

## License

This project is for educational and portfolio purposes.

You can replace this with your preferred license later, such as:

- MIT License
- Apache 2.0
- Personal Project License

---

## Author

**Your Name**  
Software Engineer | Researcher | AI Workflow Builder

**GitHub:** `https://github.com/your-username`
