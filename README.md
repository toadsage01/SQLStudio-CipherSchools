# CipherSQL Studio 

[Visit the live demo →](https://sql-studio-cipher-schools.vercel.app/)


![CipherSQL Studio Screenshot](/img0.png) 
![CipherSQL Studio Screenshot](/img1.png) 

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
   git clone [https://github.com/toadsage01/SQLStudio-CipherSchools.git](https://github.com/YOURUSERNAME/SQLStudio-CipherSchools.git)
   cd CipherSQLStudio