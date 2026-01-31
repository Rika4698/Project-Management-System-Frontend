import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProjectManagement from './pages/ProjectManagement';
import UserManagement from './pages/UserManagement';



function App() {
    return (
       <Routes>
            <Route path="/login" element={<LoginPage />} />

               {/* Protected Routes */}
            <Route  element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/projects" element={<ProjectManagement />} />
                    

                    
                    {/* Admin Only Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                        <Route path="/users" element={<UserManagement />} />
                    </Route>
                 
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
