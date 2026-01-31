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

    const totalPages = data?.data?.meta?.totalPages || 1;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-2 lg:p-6 mt-10 lg:mt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500">Manage team access and permissions.</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="btn-primary flex items-center justify-center shadow-lg shadow-blue-500/30 w-full md:w-auto"
                >
                    <UserPlus className="w-5 h-5 mr-2" /> Invite User
                </button>
            </div>

            {/* Filters */}
            <div className="glass-panel p-2 flex items-center gap-2 max-w-md bg-white">
                <Search className="w-5 h-5 text-slate-400 ml-2" />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full text-slate-700 bg-transparent border-none focus:ring-0 outline-none h-10 placeholder:text-slate-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Users Data Display */}
            <div className="glass-panel overflow-hidden bg-white">
                {/* Desktop Table */}
                <div className=" overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-5 pl-8">User</th>
                                <th className="p-5">Role</th>
                                <th className="p-5">Status</th>
                                <th className="p-5">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data?.map((user: any) => (
                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-5 pl-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{user.name}</p>
                                                <p className="text-sm text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="relative inline-block">
                                            <select
                                                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1.5 pr-8 outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-medium text-slate-700 hover:bg-white transition-all"
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
                                    </td>
                                    <td className="p-5">
                                        <button
                                            onClick={() => updateStatus({ id: user._id, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                                            disabled={isUpdatingStatus}
                                            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm transition-all active:scale-95 ${user.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                                }`}
                                        >
                                            {user.status}
                                        </button>
                                    </td>
                                    <td className="p-5 text-slate-500 text-sm font-medium">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-50">
                    {data?.data?.users?.map((user: any) => (
                        <div key={user._id} className="p-5 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                    {user.name?.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="relative inline-block flex-1">
                                    <select
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 pr-8 outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 focus:border-blue-400 font-medium text-slate-700"
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

                                <button
                                    onClick={() => updateStatus({ id: user._id, status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
                                    disabled={isUpdatingStatus}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold tracking-wide uppercase shadow-sm transition-all active:scale-95 flex-1 text-center ${user.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}
                                >
                                    {user.status}
                                </button>
                            </div>

                            <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-50">
                                Joined on {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30 ">
                    <span className="text-sm text-slate-500 pl-2">Page <span className="font-medium text-slate-900">{page}</span> of {totalPages}</span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-0 shadow-2xl relative animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900">{inviteLink ? 'Invite Generated' : 'Invite New Member'}</h2>
                            <button onClick={closeInviteModal} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-1 rounded-full shadow-sm border border-slate-100"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="p-6">
                            {!inviteLink ? (
                                <form onSubmit={handleInvite} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="input-field"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="colleague@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-slate-700">Role</label>
                                        <select
                                            className="input-field"
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
                                        className="btn-primary w-full flex items-center justify-center mt-4"
                                    >
                                        {isInviting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Generate Invite Link'}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                                        <div className="p-1.5 bg-green-100 rounded-full text-green-600 mt-0.5">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-900 font-semibold">Success!</p>
                                            <p className="text-xs text-green-700 mt-1">Share this link securely.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono overflow-hidden flex items-center select-all">
                                            {inviteLink}
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-lg transition-colors shadow-sm"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={closeInviteModal}
                                        className="w-full py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors border border-transparent hover:border-slate-200"
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
