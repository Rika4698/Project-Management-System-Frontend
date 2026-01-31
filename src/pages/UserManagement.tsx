import React, { useState } from 'react';
import { useGetUsersQuery, useUpdateUserRoleMutation, useUpdateUserStatusMutation, useInviteUserMutation } from '../store/userSlice';
import { Loader2, Search, UserPlus, Shield, X, Copy, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

const UserManagement = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data, isLoading } = useGetUsersQuery({ page, limit: 10, search });

    console.log(data,"kk");

    // Mutations
    const [updateRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
    const [inviteUser, { isLoading: isInviting }] = useInviteUserMutation();

    // Invite Modal State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('STAFF');
    const [inviteLink, setInviteLink] = useState('');

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await inviteUser({ email: inviteEmail, role: inviteRole }).unwrap();
            setInviteLink(res.data.inviteLink);
        } catch (err) {
            console.error('Invite failed', err);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        alert('Copied to clipboard!');
    };

    const closeInviteModal = () => {
        setIsInviteModalOpen(false);
        setInviteLink('');
        setInviteEmail('');
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;

    const totalPages = data?.meta?.totalPages || 1;

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 p-3 sm:p-4 lg:p-6 mt-12 lg:mt-0">
            {/* Header Section */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">User Management</h1>
                    <p className="text-sm sm:text-base text-slate-500">Manage team access and permissions.</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="btn-primary flex items-center justify-center shadow-lg shadow-blue-500/30 w-full sm:w-auto sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base whitespace-nowrap"
                >
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Invite User
                </button>
            </div>

            {/* Search Filter */}
            <div className="glass-panel p-2 flex items-center gap-2 w-full sm:max-w-md bg-white">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 ml-2 flex-shrink-0" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full text-sm sm:text-base text-slate-700 bg-transparent border-none focus:ring-0 outline-none h-9 sm:h-10 placeholder:text-slate-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Users Data Display */}
            <div className="glass-panel overflow-hidden bg-white">
                {/* Desktop & Tablet Table  */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left min-w-[640px]">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-3 lg:p-5 pl-4 lg:pl-8">User</th>
                                <th className="p-3 lg:p-5">Role</th>
                                <th className="p-3 lg:p-5">Status</th>
                                <th className="p-3 lg:p-5">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data?.users?.map((user: any) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-3 lg:p-5 pl-4 lg:pl-8">
                                        <div className="flex items-center gap-2 lg:gap-3">
                                            <div className="w-8 h-8 lg:w-10 lg:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-xs lg:text-sm">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-semibold text-slate-900 text-sm lg:text-base truncate">{user.name}</p>
                                                <p className="text-xs lg:text-sm text-slate-500 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 lg:p-5">
                                        <div className="relative inline-block">
                                            <select
                                                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-1.5 pr-7 lg:pr-8 outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-medium text-slate-700 hover:bg-white transition-all"
                                                value={user.role}
                                                disabled={isUpdatingRole}
                                                onChange={(e) => updateRole({ id: user._id, role: e.target.value })}
                                            >
                                                <option value="ADMIN">Admin</option>
                                                <option value="MANAGER">Manager</option>
                                                <option value="STAFF">Staff</option>
                                            </select>
                                            <Shield className="w-3 h-3 text-slate-400 absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td className="p-3 lg:p-5">
                                        <button
                                            onClick={() => updateStatus({ id: user._id, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                                            disabled={isUpdatingStatus}
                                            className={`px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold tracking-wide uppercase shadow-sm transition-all active:scale-95 ${user.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                                }`}
                                        >
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="p-3 lg:p-5 text-slate-500 text-xs lg:text-sm font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View*/}
                <div className="md:hidden divide-y divide-slate-100">
                    {data?.users?.map((user: any) => (
                        <div key={user._id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                            {/* User Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-base">
                                    {user.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 truncate text-base">{user.name}</p>
                                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                </div>
                            </div>

                            {/* Role & Status Controls */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</label>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2.5 pr-8 outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-medium text-slate-700"
                                            value={user.role}
                                            disabled={isUpdatingRole}
                                            onChange={(e) => updateRole({ id: user._id, role: e.target.value })}
                                        >
                                            <option value="ADMIN">Admin</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="STAFF">Staff</option>
                                        </select>
                                        <Shield className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
                                    <button
                                        onClick={() => updateStatus({ id: user._id, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                                        disabled={isUpdatingStatus}
                                        className={`w-full px-3 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase shadow-sm transition-all active:scale-95 ${user.status === 'ACTIVE'
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}
                                    >
                                        {user.status}
                                    </button>
                                </div>
                            </div>

                            {/* Joined Date */}
                            <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                                <span className="font-medium text-slate-500">Joined</span>
                                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination  */}
                <div className="p-3 sm:p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <span className="text-xs sm:text-sm text-slate-500">
                        <span className="hidden sm:inline">Page </span>
                        <span className="font-medium text-slate-900">{page}</span>
                        <span className="hidden sm:inline"> of {totalPages}</span>
                        <span className="sm:hidden">/{totalPages}</span>
                    </span>
                    <div className="flex gap-1.5 sm:gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-1.5 sm:p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1.5 sm:p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Invite Modal - Fully Responsive */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-md sm:max-w-lg p-0 shadow-2xl relative animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5 max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900">
                                {inviteLink ? 'Invite Generated' : 'Invite New Member'}
                            </h2>
                            <button 
                                onClick={closeInviteModal} 
                                className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-1.5 sm:p-1 rounded-full shadow-sm border border-slate-100"
                            >
                                <X className="w-4 h-4 sm:w-4 sm:h-4" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4 sm:p-6">
                            {!inviteLink ? (
                                <form onSubmit={handleInvite} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="input-field w-full text-sm sm:text-base"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="colleague@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-slate-700">Role</label>
                                        <select
                                            className="input-field w-full text-sm sm:text-base"
                                            value={inviteRole}
                                            onChange={(e) => setInviteRole(e.target.value)}
                                        >
                                            <option value="STAFF">Staff</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="ADMIN">Admin</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isInviting}
                                        className="btn-primary w-full flex items-center justify-center mt-4 py-2.5 sm:py-3 text-sm sm:text-base"
                                    >
                                        {isInviting ? <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" /> : 'Generate Invite Link'}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    {/* Success Message */}
                                    <div className="p-3 sm:p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-2 sm:gap-3">
                                        <div className="p-1.5 bg-green-100 rounded-full text-green-600 mt-0.5 flex-shrink-0">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-green-900">Success!</p>
                                            <p className="text-xs text-green-700 mt-1">Share this link securely.</p>
                                        </div>
                                    </div>
                                    
                                    {/* Invite Link */}
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 sm:py-2 text-xs text-slate-600 font-mono overflow-hidden flex items-center select-all break-all">
                                            {inviteLink}
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2.5 sm:p-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-lg transition-colors shadow-sm flex items-center justify-center sm:block"
                                        >
                                            <Copy className="w-4 h-4" />
                                            <span className="ml-2 sm:hidden text-sm">Copy Link</span>
                                        </button>
                                    </div>
                                    
                                    <button
                                        onClick={closeInviteModal}
                                        className="w-full py-2.5 text-sm sm:text-base text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors border border-transparent hover:border-slate-200"
                                    >
                                        Done
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;