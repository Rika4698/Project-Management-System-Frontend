
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Sidebar from '@/components/Sidebar';



const AppLayout = () => {
    const { token } = useSelector((state: RootState) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
           <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
