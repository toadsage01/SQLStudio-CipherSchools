import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import '../styles/Workspace.scss';

const Workspace = () => {
  const { id } = useParams();
  const { theme, toggleTheme } = useTheme();
  
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [assignment, setAssignment] = useState(null);
  const [sqlCode, setSqlCode] = useState("-- Loading...");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hint, setHint] = useState(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  
  const [mobileTab, setMobileTab] = useState('description');

  useEffect(() => {
    // UPDATED URL
    axios.get(`${API_BASE}/api/assignments/${id}`)
      .then(res => {
        setAssignment(res.data);
        if(res.data.sampleTables?.[0]) {
             setSqlCode(`-- Solve: ${res.data.question}\nSELECT * FROM ${res.data.sampleTables[0].tableName} LIMIT 10;`);
        }
      })
      .catch(err => console.error(err));
  }, [id, API_BASE]);

  const handleRun = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    setIsCorrect(null);
    setMobileTab('editor');

    try {
      // UPDATED URL
      const res = await axios.post(`${API_BASE}/api/assignments/run`, {
        assignmentId: id,
        sql: sqlCode
      });

      if (res.data.success) {
        setResult(res.data.rows);
        setIsCorrect(res.data.isCorrect);
      } else {
        setError(res.data.error);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Connection Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetHint = async () => {
    setIsHintLoading(true);
    try {
      // UPDATED URL
      const res = await axios.post(`${API_BASE}/api/assignments/hint`, {
        assignmentId: id,
        sql: sqlCode,
        error: error,
        userResult: result
      });
      setHint(res.data.hint);
    } catch (err) {
      setHint("Could not connect to AI.");
    } finally {
      setIsHintLoading(false);
    }
  };

  if (!assignment) return <div className="loading-screen">Loading Studio...</div>;

  return (
    <div className="workspace">
      <header className="workspace__header">
        <div className="header-left">
           <Link to="/" className="logo-text">CipherSQL <span>Studio</span></Link>
        </div>
        <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>

      <div className="mobile-tab-bar">
        <button 
          className={mobileTab === 'description' ? 'active' : ''} 
          onClick={() => setMobileTab('description')}
        >
          Description
        </button>
        <button 
          className={mobileTab === 'editor' ? 'active' : ''} 
          onClick={() => setMobileTab('editor')}
        >
          Editor <span style={{color: 'var(--accent)', marginLeft: '4px'}}>&lt;/&gt;</span>
        </button>
      </div>

      <div className="workspace__main">
        <div className={`panel-left ${mobileTab === 'editor' ? 'hidden-mobile' : ''}`}>
          <div className="panel-content">
            <h3>{assignment.title}</h3>
            <div className="difficulty-tag">{assignment.description}</div>
            <p className="question-text">{assignment.question}</p>
            <div className="divider"></div>
            <h3>Schema</h3>
            {assignment.sampleTables.map((table, idx) => (
              <div key={idx} className="schema-box">
                <div className="table-name"> {table.tableName}</div>
                <div className="columns-list">
                  {table.columns.map((col, c) => (
                      <div key={c} className="col-item">
                        <span className="c-name">{col.columnName}</span>
                        <span className="c-type">{col.dataType}</span>
                      </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`panel-right ${mobileTab === 'description' ? 'hidden-mobile' : ''}`}>
          <div className="editor-wrapper">
            <Editor
              height="100%"
              defaultLanguage="sql"
              theme={theme === 'dark' ? "vs-dark" : "light"}
              value={sqlCode}
              onChange={setSqlCode}
              options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
            />
          </div>

          <div className="action-bar-strip">
              <div className="ab-left">
                 {isCorrect === true && <span className="status-badge success"> Accepted</span>}
                 {isCorrect === false && <span className="status-badge fail"> Wrong Answer</span>}
              </div>
              <div className="ab-right">
                  <button className="btn-hint" onClick={handleGetHint} disabled={isHintLoading}>
                     {isHintLoading ? '...' : '💡 Hint'}
                  </button>
                  <button className="btn-run" onClick={handleRun} disabled={isLoading}>
                     {isLoading ? '...' : '▶ Run'}
                  </button>
              </div>
          </div>

          <div className="output-wrapper">
              <div className="output-header">Execution Result</div>
              <div className="output-content">
                 {error && <div className="error-box"> {error}</div>}
                 {!result && !error && <div className="empty-state">Run code to see results.</div>}
                 {result && (
                   <div className="table-container">
                     <table className="data-table">
                       <thead>
                         <tr>{Object.keys(result[0] || {}).map(k => <th key={k}>{k}</th>)}</tr>
                       </thead>
                       <tbody>
                         {result.map((row, i) => (
                           <tr key={i}>{Object.values(row).map((v, j) => <td key={j}>{v}</td>)}</tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 )}
              </div>
          </div>
        </div>
      </div>

      {hint && (
        <div className="modal-overlay" onClick={() => setHint(null)}>
          <div className="modal-box">
              <h3>AI Assist</h3>
              <p>{hint}</p>
              <button onClick={() => setHint(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;