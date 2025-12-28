# System Architecture

## 1. Data Flow Diagram (DFD)
This diagram illustrates how data flows from the user, through the API, to the databases and the AI engine.

```mermaid
graph TD
    User[Student] -->|Writes SQL| UI[Frontend Interface]
    UI -->|POST /run| API[Backend API]
    
    subgraph "Backend Processing"
        API -->|Fetch Question| MongoDB[(MongoDB Metadata)]
        API -->|Execute Query| PG[(PostgreSQL Sandbox)]
        PG -->|Return Rows| API
    end
    
    subgraph "AI Assistant"
        User -->|Request Hint| UI
        UI -->|POST /hint| API
        API -->|Analyze Context| AI[Groq LLM Engine]
        AI -->|Generate Hint| API
    end
    
    API -->|JSON Result| UI
    UI -->|Display Table/Hint| User
```

## 2. Entity Relationship Diagram (ERD)
The schema design for storing coding challenges in MongoDB

```mermaid
erDiagram
    ASSIGNMENT {
        string _id PK
        string title
        string question
        string difficulty
        json expectedOutput
    }
    SAMPLE_TABLE {
        string tableName
        json columns
    }
    ASSIGNMENT ||--|{ SAMPLE_TABLE : contains
```