
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';



function App() {
    return (
       <Routes>
            <Route path="/login" element={<LoginPage />} />

               {/* Protected Routes */}
            <Route >
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Dashboard/>} />
                    {/* <Route path="/projects" element={<ProjectManagement />} /> */}

                 
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
