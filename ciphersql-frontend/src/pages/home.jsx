import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/Home.scss';

const Home = () => {
  const [assignments, setAssignments] = useState([]);
  const { theme, toggleTheme } = useTheme();

  // Use Environment Variable for URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API_BASE}/api/assignments`)
      .then(res => setAssignments(res.data))
      .catch(err => console.error(err));
  }, [API_BASE]);

  return (
    <div className="home">
      <header className="home__header">
        <div className="logo-main">CipherSQL <span>Studio</span></div>
        <div className="theme-toggle-wrapper">
            <button onClick={toggleTheme} className="theme-toggle" title="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
        </div>
      </header>
      
      <div className="home__grid">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="card">
            <div className={`card__badge card__badge--${assignment.description ? assignment.description.toLowerCase() : 'medium'}`}>
              {assignment.description || 'Medium'}
            </div>
            
            <h3 className="card__title">{assignment.title}</h3>
            <p className="card__question">{assignment.question}</p>
            
            <Link to={`/workspace/${assignment._id}`} className="card__btn">
              Attempt Challenge →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;