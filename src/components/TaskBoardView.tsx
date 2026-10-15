import React, { useState } from 'react';
import { TaskItem, TaskStatus, TaskPriority, ServiceCategory, UserProfile, ProjectItem } from '../types';
import {
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Code2,
  Palette,
  Megaphone,
  CheckSquare,
  Square,
  ArrowUpDown,
} from 'lucide-react';

interface TaskBoardViewProps {
  tasks: TaskItem[];
  projects: ProjectItem[];
  users: UserProfile[];
  onOpenNewTaskModal: () => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onToggleChecklistItem: (taskId: string, checklistId: string) => void;
}

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  tasks,
  projects,
  users,
  onOpenNewTaskModal,
  onUpdateTaskStatus,
  onToggleChecklistItem,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<'all' | ServiceCategory>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesService = serviceFilter === 'all' || t.serviceCategory === serviceFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || t.assignedTo === assigneeFilter;

    return matchesSearch && matchesService && matchesPriority && matchesAssignee;
  });

  const columns: { id: TaskStatus; title: string; count: number; borderClass: string }[] = [
    {
      id: 'todo',
      title: 'To Do',
      count: filteredTasks.filter((t) => t.status === 'todo').length,
      borderClass: 'border-slate-700',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      count: filteredTasks.filter((t) => t.status === 'in_progress').length,
      borderClass: 'border-amber-500/50',
    },
    {
      id: 'review',
      title: 'In Review',
      count: filteredTasks.filter((t) => t.status === 'review').length,
      borderClass: 'border-cyan-500/50',
    },
    {
      id: 'completed',
      title: 'Completed',
      count: filteredTasks.filter((t) => t.status === 'completed').length,
      borderClass: 'border-emerald-500/50',
    },
  ];

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

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-1.5 py-0.5 rounded">Urgent</span>;
      case 'high':
        return <span className="text-[10px] uppercase font-semibold text-amber-400 bg-amber-950/60 border border-amber-800 px-1.5 py-0.5 rounded">High</span>;
      case 'medium':
        return <span className="text-[10px] font-medium text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">Medium</span>;
      case 'low':
        return <span className="text-[10px] font-medium text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">Low</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Toolbar & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Task Management & Sprint Board
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize agency development, visual assets, and marketing deliverables
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          {/* New Task CTA */}
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, tags, keywords..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors"
          />
        </div>

        {/* Service Category Filter */}
        <div>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/80 transition-colors cursor-pointer"
          >
            <option value="all">All Services (Web, Design, Marketing)</option>
            <option value="web_dev">Web Development</option>
            <option value="graphic_design">Graphic Designing</option>
            <option value="digital_marketing">Digital Marketing</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/80 transition-colors cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400/80 transition-colors cursor-pointer"
          >
            <option value="all">All Team Assignees</option>
            {users
              .filter((u) => u.role !== 'client')
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.title})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* 3. Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 min-h-[500px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-200">
                      {col.title}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 tabular-nums">
                      {col.count}
                    </span>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3 flex-1">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-slate-500 text-xs border border-dashed border-slate-800/80 rounded-lg p-4 text-center">
                      <span>No tasks in {col.title}</span>
                      <button
                        onClick={onOpenNewTaskModal}
                        className="mt-2 text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                      >
                        + Add task here
                      </button>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const assignee = users.find((u) => u.id === task.assignedTo);
                      const project = projects.find((p) => p.id === task.projectId);
                      const completedChecklist = task.checklist.filter((c) => c.completed).length;

                      return (
                        <div
                          key={task.id}
                          className="p-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              {getServiceIcon(task.serviceCategory)}
                              <span className="truncate max-w-[120px]">
                                {project?.name || 'Prime Task'}
                              </span>
                            </div>
                            {getPriorityBadge(task.priority)}
                          </div>

                          <h4 className="text-xs font-semibold text-slate-100 leading-snug mb-1.5">
                            {task.title}
                          </h4>

                          <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                            {task.description}
                          </p>

                          {/* Checklists Preview */}
                          {task.checklist.length > 0 && (
                            <div className="space-y-1 mb-3 pt-2 border-t border-slate-800/60">
                              {task.checklist.map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => onToggleChecklistItem(task.id, c.id)}
                                  className="w-full flex items-center gap-2 text-[11px] text-left text-slate-300 hover:text-white transition-colors cursor-pointer"
                                >
                                  {c.completed ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  )}
                                  <span className={`truncate ${c.completed ? 'line-through text-slate-500' : ''}`}>
                                    {c.text}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Status Mover Quick Buttons */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/60 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              {assignee && (
                                <img
                                  src={assignee.avatar}
                                  alt={assignee.name}
                                  title={`Assigned to ${assignee.name}`}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name)}&background=f59e0b&color=090d16&bold=true`;
                                  }}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              )}
                              <span className="text-[10px] text-slate-400">
                                {task.dueDate}
                              </span>
                            </div>

                            {/* Status changer select */}
                            <select
                              value={task.status}
                              onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                              className="bg-slate-800 text-[10px] text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                            >
                              <option value="todo">To Do</option>
                              <option value="in_progress">In Progress</option>
                              <option value="review">In Review</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 4. List / Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-medium">
                  <th className="py-3 px-4">Task Name</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No matching tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const assignee = users.find((u) => u.id === task.assignedTo);
                    return (
                      <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-200">
                          <div>
                            <span>{task.title}</span>
                            <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                              {task.description}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 capitalize text-slate-300">
                            {getServiceIcon(task.serviceCategory)}
                            <span>{task.serviceCategory.replace('_', ' ')}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">{getPriorityBadge(task.priority)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            {assignee && (
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name)}&background=f59e0b&color=090d16&bold=true`;
                                }}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            )}
                            <span>{assignee?.name || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={task.status}
                            onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none cursor-pointer"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">In Review</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 tabular-nums text-slate-400">
                          {task.dueDate}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              const nextStatusMap: Record<TaskStatus, TaskStatus> = {
                                todo: 'in_progress',
                                in_progress: 'review',
                                review: 'completed',
                                completed: 'completed',
                              };
                              onUpdateTaskStatus(task.id, nextStatusMap[task.status]);
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 rounded cursor-pointer transition-colors"
                          >
                            Next Stage
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
