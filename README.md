# CipherSQL Studio 

CipherSQL Studio is an interactive, AI-powered SQL learning platform designed to help students master database queries through real-time practice. It features a dual-database architecture, intelligent AI hints, and a robust code execution sandbox.

![CipherSQL Studio Screenshot](https://via.placeholder.com/800x400?text=CipherSQL+Studio+Dashboard) 
*(Replace this link with a real screenshot after uploading)*

## Key Features
- **Real-time SQL Sandbox:** Execute queries safely against a live PostgreSQL database.
- **AI-Powered Hints:** Integrated with **Groq (Llama 3)** to provide context-aware logic and syntax help without revealing the answer.
- **Dual-Database System:** - **MongoDB:** Stores problem definitions, metadata, and test cases.
  - **PostgreSQL:** Acts as the runtime environment for user queries.
- **Responsive UI:** Fully responsive "Noctis-themed" interface with mobile-friendly coding tabs.
- **Security:** Read-only transaction blocks (`BEGIN`...`ROLLBACK`) prevent database alteration.

## Tech Stack
- **Frontend:** React.js (Vite), SCSS, Monaco Editor
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas), PostgreSQL
- **AI Engine:** Groq API (Llama-3.3-70b)

## Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (Installed locally or cloud URL)
- **MongoDB** (Local or Atlas URL)

1. **Clone the repository**
   ```bash
   git clone [https://github.com/toadsage01/cipherSQLStudio.git](https://github.com/YOUR_USERNAME/cipherSQLStudio.git)
   cd cipherSQLStudio