import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SavedReports from './pages/SavedReports';
import Templates from './pages/Templates';
import CreateReport from './pages/CreateReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/all-reports" element={<SavedReports />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/create-report" element={<CreateReport />} />
      </Routes>
    </Router>
  );
}

export default App;