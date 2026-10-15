import React from 'react';
import { ProjectItem, TaskItem, UserProfile, ServiceCategory } from '../types';
import {
  Layers,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  Radio,
  FileCheck2,
  Users,
  Code2,
  Palette,
  Megaphone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  projects: ProjectItem[];
  tasks: TaskItem[];
  users: UserProfile[];
  currentUser: UserProfile;
  onOpenNewTaskModal: () => void;
  onOpenNewProjectModal: () => void;
  onNavigateTab: (tab: 'dashboard' | 'tasks' | 'projects' | 'collaboration' | 'services' | 'client_portal') => void;
  onAdvanceTaskStatus: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  tasks,
  users,
  currentUser,
  onOpenNewTaskModal,
  onOpenNewProjectModal,
  onNavigateTab,
  onAdvanceTaskStatus,
}) => {
  const activeProjectsCount = projects.filter((p) => p.status !== 'Completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const urgentTasks = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'completed');

  const allDeliverables = projects.flatMap((p) => p.deliverables);
  const pendingDeliverables = allDeliverables.filter((d) => d.status === 'pending_review');

  const getServiceIcon = (category: ServiceCategory) => {
    switch (category) {
      case 'web_dev':
        return <Code2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'graphic_design':
        return <Palette className="w-3.5 h-3.5 text-rose-400" />;
      case 'digital_marketing':
        return <Megaphone className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getServiceName = (category: ServiceCategory) => {
    switch (category) {
      case 'web_dev':
        return 'Web Dev';
      case 'graphic_design':
        return 'Design';
      case 'digital_marketing':
        return 'Marketing';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Agency Workspace Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="relative h-64 sm:h-72 w-full overflow-hidden">
          <img
            src="/src/assets/images/primeplus_hero_workspace_1791899694493.jpg"
            alt="Prime Plus Team Workspace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
          {/* Measured contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
                <span>Prime Plus Team Headquarters</span>
                <span aria-hidden="true">·</span>
                <span>Active Sprint 2026.4</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white text-balance">
                Digital Agency Operations & Client Suite
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                Unified workspace managing full-stack web development, brand graphic design, and digital marketing performance campaigns.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onOpenNewTaskModal}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Task</span>
              </button>
              <button
                onClick={onOpenNewProjectModal}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Project Brief</span>
              </button>
              <button
                onClick={() => onNavigateTab('collaboration')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Team Room</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Projects</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {activeProjectsCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Across Web Dev, Design & Marketing
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Tasks In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {inProgressTasks.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {urgentTasks.length} marked urgent priority
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Client Approvals</span>
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {pendingDeliverables.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Awaiting client sign-off
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Delivery Velocity</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
            96.4%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            On-time sprint completion rate
          </p>
        </div>
      </div>

      {/* 3. Main Grid: Active Projects & Urgent Sprint Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Projects Overview (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                Active Client Projects
              </h2>
              <p className="text-xs text-slate-400">
                Milestone tracking and deliverables pipeline
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View All Roadmaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span>{project.clientCompany}</span>
                      <span aria-hidden="true">·</span>
                      <span>Client: {project.clientName}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white">
                      {project.name}
                    </h3>
                  </div>

                  {/* Service tags */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.serviceCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {getServiceIcon(cat)}
                        <span>{getServiceName(cat)}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                  {project.summary}
                </p>

                {/* Progress bar */}
                <div className="mt-4 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Sprint Progress</span>
                    <span className="text-white font-medium tabular-nums">
                      {project.progressPercent}% Completed
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Footer details */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>Deadline: {project.deadline}</span>
                    <span aria-hidden="true">·</span>
                    <span>Budget: ${project.budgetSpent.toLocaleString()} / ${project.budgetTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {project.teamMembers.map((userId) => {
                      const u = users.find((x) => x.id === userId);
                      if (!u) return null;
                      return (
                        <img
                          key={u.id}
                          src={u.avatar}
                          alt={u.name}
                          title={u.name}
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full ring-1 ring-slate-900 object-cover"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Urgent Action Items & Team Workload */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white tracking-tight">
              Sprint Priority Queue
            </h2>
            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
            >
              Task Board
            </button>
          </div>

          <div className="space-y-3">
            {urgentTasks.slice(0, 4).map((task) => {
              const assignee = users.find((u) => u.id === task.assignedTo);
              return (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-100 leading-snug">
                      {task.title}
                    </h4>
                    <span className="shrink-0 text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 border border-rose-800/80 px-1.5 py-0.5 rounded">
                      Urgent
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      {assignee && (
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      )}
                      <span>{assignee?.name}</span>
                    </div>

                    <button
                      onClick={() => onAdvanceTaskStatus(task.id)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Advance</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Team Presence Box */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Prime Plus Team Roster
              </h3>
              <span className="text-[11px] text-emerald-400 font-mono">
                {users.filter((u) => u.isOnline).length} Active Online
              </span>
            </div>

            <div className="space-y-2.5">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      {u.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">
                        {u.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {u.role === 'client' ? 'Client' : u.title}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {u.role === 'lead' ? 'Lead' : u.department?.split(' ')[0] || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
