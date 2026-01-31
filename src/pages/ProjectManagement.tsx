import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    useGetProjectsQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation
} from '../store/projectSlice';
import { selectCurrentUser } from '../store/authSlice';
import { Loader2, Trash2, Edit2, Shield, X, RefreshCw } from 'lucide-react';
import Alert from '../components/Alert';

const ProjectManagement = () => {
    const user = useSelector(selectCurrentUser);
    const { data: projects, isLoading } = useGetProjectsQuery('');
    const [updateProject] = useUpdateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();

    // ✅ All hooks at top-level
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const isAdmin = user?.role === 'ADMIN';

    const handleEditClick = (project: any) => {
        setEditingProject(project);
        setEditName(project.name);
        setEditDesc(project.description);
        setEditStatus(project.status);
        setIsEditModalOpen(true);
        setAlert(null);
    };

    const handleUpdateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProject({
                id: editingProject._id,
                name: editName,
                description: editDesc,
                status: editStatus
            }).unwrap();
            setIsEditModalOpen(false);
            setEditingProject(null);
            setAlert({ message: 'Project updated successfully!', type: 'success' });
            setTimeout(() => setAlert(null), 3000);
        } catch (err: any) {
            console.error('Failed to update project', err);
            setAlert({ message: 'Failed to update project. Please try again.', type: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to soft delete this project?')) {
            try {
                await deleteProject(id).unwrap();
                setAlert({ message: 'Project deleted successfully!', type: 'success' });
                setTimeout(() => setAlert(null), 3000);
            } catch (err) {
                setAlert({ message: 'Failed to delete project.', type: 'error' });
            }
        }
    };

    const handleRestore = async (id: string) => {
        try {
            await updateProject({ id, isDeleted: false, status: 'ACTIVE' }).unwrap();
            setAlert({ message: 'Project restored successfully!', type: 'success' });
            setTimeout(() => setAlert(null), 3000);
        } catch (err) {
            setAlert({ message: 'Failed to restore project.', type: 'error' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-10">
                <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-2 lg:p-6 mt-10 lg:mt-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Project Management</h1>
                    <p className="text-slate-500">Admin view of all system projects.</p>
                </div>
                {!isAdmin && (
                    <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium border border-amber-100 flex items-center w-full md:w-auto justify-center md:justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Read Only Access
                    </div>
                )}
            </div>

            {/* Global Alert */}
            {alert && !isEditModalOpen && (
                <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
            )}

            {/* Table / Card View */}
            <div className="glass-panel overflow-hidden bg-white">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="p-5 pl-8">Project Details</th>
                                <th className="p-5">Owner</th>
                                <th className="p-5">Status</th>
                                {isAdmin && <th className="p-5 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {projects?.map((project: any) => (
                                <tr key={project._id} className={`hover:bg-slate-50/50 transition-colors group ${project.isDeleted ? 'bg-slate-50/30' : ''}`}>
                                    <td className="p-5 pl-8">
                                        <div>
                                            <p className={`font-semibold text-slate-900 ${project.isDeleted ? 'text-slate-500 line-through' : ''}`}>
                                                {project.name}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">{project.description}</p>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {project.createdBy?.name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">{project.createdBy?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${
                                            project.isDeleted
                                                ? 'bg-red-50 text-red-600 border-red-100'
                                                : project.status === 'ACTIVE'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                            {project.isDeleted ? 'DELETED' : project.status}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {!project.isDeleted ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(project)}
                                                            title="Edit"
                                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(project._id)}
                                                            title="Delete"
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRestore(project._id)}
                                                        className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 hover:text-slate-800 px-3 py-1.5 rounded-lg font-bold text-slate-500 transition-all border border-slate-200"
                                                    >
                                                        <RefreshCw className="w-3 h-3" /> Restore
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card */}
                <div className="md:hidden divide-y divide-slate-50">
                    {projects?.map((project: any) => (
                        <div key={project._id} className={`p-5 space-y-3 ${project.isDeleted ? 'bg-slate-50/30' : ''}`}>
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className={`font-semibold text-slate-900 break-words ${project.isDeleted ? 'text-slate-500 line-through' : ''}`}>
                                        {project.name}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{project.description}</p>
                                </div>
                                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
                                    project.isDeleted
                                        ? 'bg-red-50 text-red-600 border-red-100'
                                        : project.status === 'ACTIVE'
                                        ? 'bg-green-50 text-green-700 border-green-100'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                    {project.isDeleted ? 'DEL' : project.status}
                                </span>
                            </div>

                            {isAdmin && (
                                <div className="flex items-center gap-1 pt-2">
                                    {!project.isDeleted ? (
                                        <>
                                            <button
                                                onClick={() => handleEditClick(project)}
                                                className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleRestore(project._id)}
                                            className="flex items-center gap-1 text-xs bg-slate-100 px-3 py-2 rounded-lg font-bold text-slate-500 border border-slate-200 hover:bg-slate-200 transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3" /> Restore
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5 flex flex-col">
                        <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-slate-900">Edit Project</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-1.5 rounded-full shadow-sm border border-slate-100 hover:bg-slate-50"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Alert */}
                        {alert && isEditModalOpen && (
                            <div className="px-4 md:px-6 pt-4">
                                <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
                            </div>
                        )}

                        <form onSubmit={handleUpdateProject} className="p-4 md:p-6 space-y-4 md:space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    rows={3}
                                    className="input-field resize-none min-h-[80px]"
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Status</label>
                                <select
                                    className="input-field"
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                >
                                    <option value="ACTIVE">Active</option>
                                    <option value="ARCHIVED">Archived</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors border border-transparent hover:border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectManagement;
