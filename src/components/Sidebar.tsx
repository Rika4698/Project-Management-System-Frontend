import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, logout } from '../store/authSlice';
import { Layout, Users, FolderKanban, LogOut, Menu, X, Settings, Bell } from 'lucide-react';

const Sidebar = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isAdmin = user?.role === 'ADMIN';

    const menuItems = [
        { path: '/', label: 'Overview', icon: Layout },
        { path: '/projects', label: 'Projects', icon: FolderKanban },
        ...(isAdmin ? [{ path: '/users', label: 'User Management', icon: Users }] : []),
    ];

    const isActive = (path: string) => location.pathname === path;
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden  fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg shadow-slate-200/50 text-slate-600 hover:text-blue-600 transition-colors border border-slate-100"
                aria-label="Toggle Menu"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 z-40 h-full overflow-y-auto w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200/60 transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl lg:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full px-6 py-6 flex flex-col ">
                    {/* Logo/Header */}
                    <div className="flex items-center gap-3 mb-12 pl-2 pt-2 ml-10 lg:ml-0">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 ">
                            AS
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Admin System</h1>
                            <p className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md inline-block font-semibold uppercase tracking-wider">Workspace</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 pl-4">Main Menu</h3>
                            <nav className="space-y-1">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${active
                                                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></div>}
                                            <Icon className={`w-5 h-5 transition-colors ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                      
                    </div>

                    {/* User Profile & Logout */}
                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer mb-2 border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-600 font-bold border border-slate-200 shadow-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden flex-1">
                                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => dispatch(logout())}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all border border-transparent hover:border-red-100"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
