import React, { useState } from 'react';
import { useGetProjectsQuery, useCreateProjectMutation } from '../store/projectSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import { Loader2, Plus, Layout, FolderKanban, Search, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const user = useSelector(selectCurrentUser);
    const [search, setSearch] = useState('');
    const { data: projects, isLoading } = useGetProjectsQuery(search);
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProject({ name: newProjectName, description: newProjectDesc }).unwrap();
            setIsModalOpen(false);
            setNewProjectName('');
            setNewProjectDesc('');
        } catch (err) {
            console.error('Failed to create project:', err);
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;

    const activeProjects = projects?.filter((p: any) => !p.isDeleted) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-2 lg:p-6 mt-10 lg:mt-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none w-64 transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center shadow-lg shadow-blue-500/30"
                    >
                        <Plus className="w-5 h-5 mr-1.5" /> New Project
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Projects</h3>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Layout className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{activeProjects.length}</p>
                    <p className="text-sm text-slate-400 mt-2 flex items-center">
                        <span className="text-green-600 font-medium mr-1">+12%</span> from last month
                    </p>
                </div>

                {/* Placeholder for other stats */}
                <div className="glass-panel p-6 border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/50">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Active Tasks</h3>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <FolderKanban className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">24</p>
                    <p className="text-sm text-slate-400 mt-2 flex items-center">
                        <span className="text-green-600 font-medium mr-1">+5%</span> efficiency
                    </p>
                </div>
            </div>

            {/* Projects Grid */}
            <div>
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                    Recent Projects <ChevronRight className="w-4 h-4 text-slate-400 ml-1" />
                </h2>

                {activeProjects.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FolderKanban className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No projects found</h3>
                        <p className="text-slate-500 mt-1 max-w-sm mx-auto">Get started by creating a new project to track your team's progress.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mt-6 text-blue-600 font-medium hover:text-blue-700 hover:underline"
                        >
                            Create your first project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeProjects.map((project: any) => (
                            <div key={project._id} className="glass-panel p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-12 -mt-12 opacity-50 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-blue-600 group-hover:border-blue-100 group-hover:bg-blue-50 transition-colors">
                                        <Layout className="w-6 h-6" />
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${project.status === 'ACTIVE'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2 h-10">{project.description}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold border-2 border-white">
                                            {project.createdBy?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium">{project.createdBy?.name || 'Unknown'}</span>
                                    </div>
                                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Project Modal - Glassmorphism */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-0 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-slate-900/5">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-900">Create New Project</h2>
                            <p className="text-sm text-slate-500 mt-1">Add a new workspace for your team.</p>
                        </div>

                        <form onSubmit={handleCreateProject} className="p-6 space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    placeholder="e.g. Website Redesign"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    rows={3}
                                    className="input-field resize-none"
                                    placeholder="Briefly describe the project goals..."
                                    value={newProjectDesc}
                                    onChange={(e) => setNewProjectDesc(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors border border-transparent hover:border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 btn-primary flex items-center justify-center"
                                >
                                    {isCreating ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
