import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import Workspace from './pages/Workspace.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Lobby */}
        <Route path="/" element={<Home />} />
        
        {/* Studio page; :id is the assignment id */}
        <Route path="/workspace/:id" element={<Workspace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;