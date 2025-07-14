import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateProfile from './pages/createUser.jsx';
import LoginPage from './components/login.jsx';
import RequireAuth from './components/requireAuth.jsx';
import { AuthProvider } from './components/authcontext.jsx'; // <-- Import context
import 'react-toastify/dist/ReactToastify.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected routes group */}
          <Route
            path="/*"
            element={
              <AuthProvider>
              <RequireAuth>
                <Routes >
                  <Route path="App" element={<App />} />
                  <Route path="CreateProfile" element={<CreateProfile />} />
                  <Route path="*" element={
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh'}}>
                      <img src={process.env.PUBLIC_URL + '/404error.svg'} alt="404 Not Found" style={{maxWidth: 400, width: '100%'}} />
                      <h2>Page Not Found</h2>
                    </div>
                  } />
                </Routes>
              </RequireAuth>
          </AuthProvider>
            }
          />
        </Routes>
      </Router>
  </React.StrictMode>
);

reportWebVitals();
