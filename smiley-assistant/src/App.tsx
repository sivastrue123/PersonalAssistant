import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AuthPage from './pages/Auth';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Notes from './pages/Notes';
import Dates from './pages/Dates';
import { Loader2 } from 'lucide-react';

function App() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-pastel-pink/10">
        <Loader2 className="w-8 h-8 animate-spin text-pastel-pink" />
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/dates" element={<Dates />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
