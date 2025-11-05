import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/components/auth/Login';
import Dashboard from './components/Dashboard';
// import ProfilePage from './pages/ProfilePage'; // Import ProfilePage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> New route */}
      </Routes>
    </Router>
  );
}

export default App;
