import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import '../styles/Home.scss';

const Home = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // 1. New Loading State
  const { theme, toggleTheme } = useTheme();

  // Dynamic URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${API_BASE}/api/assignments`)
      .then(res => {
        setAssignments(res.data);
        setIsLoading(false); // 2. Stop loading when data arrives
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false); // Stop loading even if error
      });
  }, [API_BASE]);

  // 3. The "Warm Up" Screen Logic
  if (isLoading) {
    return (
      <div className="home">
        {/* Keep Header visible so it feels like a real app */}
        <header className="home__header">
          <div className="logo-main">CipherSQL <span>Studio</span></div>
          <div className="theme-toggle-wrapper">
             <button onClick={toggleTheme} className="theme-toggle">
               {theme === 'dark' ? '☀️' : '🌙'}
             </button>
          </div>
        </header>

        {/* The Loader Component */}
        <div className="warmup-container">
          <div className="loader-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <div className="warmup-text">Warming up the backend service...</div>
          <div className="sub-text">This may take up to 60 seconds on the first load ⏳</div>
        </div>
      </div>
    );
  }

  // 4. Normal UI Render
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