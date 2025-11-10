import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import Employees from './components/Employees';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import Team from './pages/Team'
import AddTeam from './pages/AddTeam';
import EditTeam from './pages/EditTeam';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
        <Route path="/team" element={<Team />}/>
        <Route path="/add-team" element={<AddTeam />}/>
        <Route path="/edit-team/:id" element={<EditTeam />}/>

      </Routes>
    </Router>
  );
}

export default App;
