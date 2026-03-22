# 📄 AI Document Workflow System

An AI-powered full-stack workflow automation platform for **uploading business documents**, **extracting structured information**, **routing them to the correct department**, and **managing approvals** through a clean white dashboard.

Built with **FastAPI**, **React**, **PostgreSQL**, **Gemini**, **OCR**, **n8n**, and **Docker**.

---
## 📌 Overview

Business documents such as invoices, leave requests, and complaints are often processed manually. This process is usually slow, repetitive, and difficult to track.

The **AI Document Workflow System** was built to make document handling faster and smarter through:

- 📤 document upload
- 🔍 OCR and text extraction
- 🤖 AI field extraction
- 🧭 automatic routing
- ✅ approval workflows
- 📝 comments and audit log tracking
- 📊 dashboard-based review

The system currently supports:

- 🌐 **Universal Upload**
- 🧾 **Invoice Processing**
- 🏖️ **Leave Request Management**
- 📢 **Complaint Processing**

Instead of manually reading, classifying, routing, and updating each document, the platform automates the workflow from upload to final approval.

---

## 🚨 Problem Statement

In many organizations, document processing is still manual.

This often leads to:

- ⏳ slow processing time
- 📄 repeated manual reading of documents
- 🧭 incorrect department routing
- 📝 missing approval comments
- 🔍 poor tracking of workflow history
- 📂 scattered data across teams
- ❌ lack of a clear audit trail

This becomes even harder when handling different document types such as invoices, leave requests, and complaints in one system.

---

## 💡 Proposed Solution

This project introduces an AI-assisted workflow automation system that helps users upload and manage documents in one place.

The system:

- 📥 accepts uploaded PDF and image documents
- 🔎 extracts document text using OCR and PDF parsers
- 🤖 uses Gemini to extract structured fields
- 🗄️ stores records in PostgreSQL
- 🧭 routes documents to the proper department
- 🔁 triggers n8n workflows for routing and approvals
- ✅ allows approvers to approve, reject, or mark pending review
- 📝 stores comments and audit history
- 🖥️ shows everything in a clean white dashboard UI

The goal is to reduce manual document handling and improve routing, approval, and tracking accuracy.

---

## 🌟 Novelty

- 📄 supports multiple real business document types
- 🤖 uses AI to extract structured document fields
- 🔎 combines OCR, AI extraction, routing, and approval in one platform
- 📌 includes comments and audit logs for each record
- 🔁 integrates with n8n for workflow automation
- 🐳 runs n8n using Docker
- 🌐 includes a modern white dashboard UI
- 🧩 separates workflows by module while keeping a single system

---

## 🧩 Supported Modules

### 🌐 Universal Upload

A single upload entry point that accepts mixed document types and routes them to the correct processing flow.

### 🧾 Invoice Module

Extracted fields include:

- `vendor_name`
- `invoice_number`
- `invoice_date`
- `due_date`
- `total_amount`
- `currency`
- `summary`

**Main routing:**

- 💼 Finance
- 💰 Finance high-value path for selected cases

**Functions:**

- upload invoice
- extract text
- extract AI fields
- auto route
- approve or reject
- add comments
- track audit logs

---

### 🏖️ Leave Request Module

Extracted fields include:

- `employee_name`
- `leave_type`
- `start_date`
- `end_date`
- `reason`
- `department`
- `summary`

**Main routing:**

- 🏢 HR

**Functions:**

- upload leave request
- extract text
- extract AI fields
- auto route to HR
- approve or reject
- add comments
- track audit logs

---

### 📢 Complaint Module

Extracted fields include:

- `customer_name`
- `complaint_type`
- `urgency`
- `issue_summary`
- `department`
- `summary`

**Main routing:**

- 🎧 Customer Support for normal complaints
- 🚨 Operations for high urgency complaints

**Functions:**

- upload complaint
- extract text
- extract AI fields
- auto route by urgency
- approve or reject
- add comments
- track audit logs

---

## 🖼️ System Screenshots

> Create a folder named `screenshots` in your repository root and place all screenshot files there using the same file names below.

### 🔐 Login Page
![Login Page](screenshots/Screenshot_22-3-2026_20218_localhost.jpeg)

### 🏠 Home Dashboard
![Home Dashboard](screenshots/Screenshot_22-3-2026_195721_localhost.jpeg)

### 📊 Invoice Analytics Dashboard
![Invoice Dashboard](screenshots/Screenshot_22-3-2026_195858_localhost.jpeg)

### 📝 Leave Request List
![Leave Request List](screenshots/Screenshot_22-3-2026_195840_localhost.jpeg)

### 📄 Leave Request Detail
![Leave Request Detail](screenshots/Screenshot_22-3-2026_20026_localhost.jpeg)

### 📢 Complaint List
![Complaint List](screenshots/Screenshot_22-3-2026_195849_localhost.jpeg)

### 📄 Complaint Detail
![Complaint Detail](screenshots/Screenshot_22-3-2026_2008_localhost.jpeg)

### 🧾 Invoice Detail
![Invoice Detail](screenshots/Screenshot_22-3-2026_195825_localhost.jpeg)

### 🐳 Docker Desktop Running n8n
![Docker Desktop](screenshots/docker%20ss.png)

### 🔄 n8n Invoice Routing Workflow
![n8n Invoice Routing Workflow](screenshots/n8n%20work%201%20ss.png)

### ✅ n8n Invoice Approval Workflow
![n8n Invoice Approval Workflow](screenshots/n8n%20work%202%20ss.png)

### 🔍 n8n Invoice Approval Execution
![n8n Invoice Approval Execution](screenshots/n8n%20work%203%20ss.png)

### 🔁 n8n Approval Flow View
![n8n Approval Flow View](screenshots/n8n%20work%204%20ss.png)

### 🏢 n8n Leave Request Routing Workflow
![n8n Leave Routing Workflow](screenshots/n8n%20work%205%20ss.png)

### ✅ n8n Leave Request Approval Workflow
![n8n Leave Approval Workflow](screenshots/n8n%20work%206%20ss.png)

### 🚨 n8n Complaint Routing Workflow
![n8n Complaint Routing Workflow](screenshots/n8n%20work%207%20ss.png)

---

## ⚙️ Core Features

### 📤 Document Upload
- Upload PDF, JPG, JPEG, and PNG files
- Support mixed document intake from one platform

### 🔎 OCR and Text Extraction
- Extract text from:
  - text-based PDFs
  - scanned PDFs
  - JPG / JPEG / PNG images

### 🤖 AI Field Extraction
- Extract structured data using Gemini
- Return relevant fields depending on document type

### 🧭 Department Routing
- Automatically assign departments using workflow logic
- Allow manual reassignment when needed

### ✅ Approval Workflow
- Approve, reject, or mark documents as pending review
- Add comments during review
- Maintain approval trail for each record

### 📝 Comments and Audit Logs
- Add workflow comments
- Store approval history
- Track routing and status changes

### 📊 Dashboard and Analytics
- View module records
- Open document detail pages
- Review extracted content
- Monitor invoice analytics dashboard

---

## 🧠 Use Cases

This system can be useful for:

- 🏢 internal business workflow automation
- 🧾 invoice routing and approval
- 🏖️ employee leave request handling
- 📢 complaint intake and assignment
- 📋 approval process tracking
- 🔍 review of extracted document content
- 📝 audit-friendly record keeping
- 🤖 AI-powered document processing

---

## 🔄 System Workflow

1. 📤 User uploads a document from the frontend
2. 📦 Backend stores the uploaded file
3. 🔎 Text is extracted from the file
4. 🤖 Gemini extracts structured fields
5. 🗄️ Data is stored in PostgreSQL
6. 🔁 FastAPI triggers n8n workflow webhooks
7. 🧭 n8n decides routing or approval update
8. 📝 Backend updates status, comments, and audit history
9. 🖥️ Users review the record in the dashboard

---

## 🏗️ System Architecture

```text
React + Vite + Tailwind
        |
        v
     FastAPI
        |
        +--> PostgreSQL
        |
        +--> OCR / PDF Extraction
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

## 🛠️ Tech Stack

### 🎨 Frontend
- React
- Vite
- Tailwind CSS
- Axios
- Recharts

### ⚙️ Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### 🗄️ Database
- PostgreSQL

### 🤖 AI / OCR
- Gemini API
- pdfplumber
- pypdf
- pytesseract
- Tesseract OCR

### 🔁 Automation
- n8n
- Docker Desktop

### 🔐 Authentication / Security
- JWT
- PyJWT
- password hashing utilities

---

## 🖥️ System Interface

### Available UI Features

- 🔐 Login page with demo accounts
- 🏠 Home dashboard
- 🌐 Universal upload
- 🧾 Invoice list and invoice detail page
- 🏖️ Leave request list and detail page
- 📢 Complaint list and detail page
- 🧭 Routing and department assignment controls
- ✅ Approval comment panel
- 📝 Audit log panel
- 📊 Invoice analytics dashboard

---

## 🔁 n8n Workflows

This project includes separate n8n workflows for routing and approvals.

### 🧾 Invoice Routing Workflow
- receives invoice data
- checks route condition
- routes standard or high-value invoice
- sends response back to backend

### ✅ Invoice Approval Workflow
- receives approval actions
- checks whether status is approved, rejected, or pending review
- updates workflow state in backend

### 🏢 Leave Request Routing Workflow
- receives leave request data
- routes directly to HR
- sends workflow result back to backend

### ✅ Leave Request Approval Workflow
- receives approval decision
- updates backend for approved, rejected, or pending review states

### 🚨 Complaint Routing Workflow
- receives complaint data
- checks urgency
- routes to Customer Support or Operations
- sends workflow result back to backend

### 🐳 Docker Note

n8n runs inside Docker and communicates with the backend through HTTP requests.

When backend is running on the host machine, n8n can use:

```text
http://host.docker.internal:8000
```

for callback and update endpoints.

---

## 🔐 Authentication and Roles

The system uses **JWT-based authentication**.

### 👑 Admin
- Upload documents
- View all records
- Route documents
- Approve or reject
- Add comments
- Access dashboard analytics

### 👨‍💼 Staff
- Upload documents
- View submitted documents

### ✅ Approver
- View routed documents
- Approve or reject
- Add workflow comments
- Review history and logs

---

## 🧪 Status Values

The system uses the following workflow states:

- `processed`
- `pending_review`
- `approved`
- `rejected`
- `needs_correction`
- `workflow_completed`

---

## 📡 API Overview

### 🔐 Auth
- `POST /api/auth/login`
- `GET /api/auth/me`

### 🧾 Invoice
- `POST /api/invoices/upload`
- `GET /api/invoices`
- `GET /api/invoices/{invoice_id}`
- `PATCH /api/invoices/{invoice_id}/status`
- `POST /api/invoices/{invoice_id}/route/auto`
- `PATCH /api/invoices/{invoice_id}/route/manual`
- `POST /api/invoices/{invoice_id}/comments`
- `GET /api/invoices/{invoice_id}/comments`
- `GET /api/invoices/{invoice_id}/audit-logs`

### 🏖️ Leave Request
- `POST /api/leave-requests/upload`
- `GET /api/leave-requests`
- `GET /api/leave-requests/{leave_request_id}`
- `PATCH /api/leave-requests/{leave_request_id}/status`
- `POST /api/leave-requests/{leave_request_id}/route/auto`
- `PATCH /api/leave-requests/{leave_request_id}/route/manual`
- `POST /api/leave-requests/{leave_request_id}/comments`
- `GET /api/leave-requests/{leave_request_id}/comments`
- `GET /api/leave-requests/{leave_request_id}/audit-logs`

### 📢 Complaint
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

## 📂 Project Structure

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

## 🔑 Environment Variables

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

## ⚡ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/ai-document-workflow-system.git
cd ai-document-workflow-system
```

### 2️⃣ Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
```

### 4️⃣ Setup n8n with Docker

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

## ▶️ How to Run

### 🗄️ Start PostgreSQL

Make sure PostgreSQL is installed and the database exists.

### ⚙️ Start Backend

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

### 🎨 Start Frontend

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### 🔁 Start n8n

```bash
cd n8n
docker compose up -d
```

n8n URL:

```text
http://localhost:5678
```

---

## 👤 Demo Accounts

### 👑 Admin
- Username: `admin`
- Password: `admin123`

### 👨‍💼 Staff
- Username: `staff`
- Password: `staff123`

### ✅ Approver
- Username: `approver`
- Password: `approver123`

---

## 📍 Current Scope

This project currently includes:

- 🌐 Universal Upload
- 🧾 Invoice Processing
- 🏖️ Leave Request Processing
- 📢 Complaint Processing
- 🔁 Routing Workflows with n8n
- ✅ Approval Tracking with n8n
- 📝 Comments and audit trail
- 🖥️ White dashboard UI
- 📊 Invoice analytics dashboard

This is the current MVP scope.

---

## 🚀 Future Improvements

- 📧 Email notifications
- 👁️ File preview and download
- 🧠 Better document type auto-detection
- 📊 Unified analytics across all modules
- 👥 Role management UI
- 📤 Exportable reports
- ☁️ Cloud deployment
- 🏢 Multi-tenant support
- 🧭 Smarter routing rules
- 📈 Better dashboard insights for leave requests and complaints

---

## 🎯 Why This Project Matters

This project demonstrates strong practical skills in:

- 💻 Full-stack software development
- 🤖 AI-assisted document understanding
- 🔎 OCR integration for scanned files
- ⚙️ API development with FastAPI
- 🎨 React dashboard design
- 🗄️ Database modeling with PostgreSQL
- 🔁 Workflow automation using n8n
- 🐳 Docker-based automation setup
- ✅ Approval pipelines and audit logging
- 🏢 Real business process digitization

It is a strong portfolio project for:

- Software Engineering
- AI Workflow Automation
- Business Process Automation
- Full-Stack Development

---

## 📜 License

This project is for educational and portfolio purposes.

You can replace this with your preferred license later, such as:

- MIT License
- Apache 2.0
- Personal Project License

---

## 👨‍💻 Author

**Your Name**  
Software Engineer | Researcher | AI Workflow Builder

**GitHub:** `https://github.com/your-username`
