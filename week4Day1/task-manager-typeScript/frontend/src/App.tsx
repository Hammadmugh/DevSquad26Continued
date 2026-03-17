import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Main route - show dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;