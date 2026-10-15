import React, { useState } from 'react';
import { ProjectItem, ProjectDeliverable, UserProfile, ServiceCategory } from '../types';
import {
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  ExternalLink,
  DollarSign,
  Calendar,
  Code2,
  Palette,
  Megaphone,
  Plus,
  ThumbsUp,
  MessageSquare,
} from 'lucide-react';

interface ProjectTrackerViewProps {
  projects: ProjectItem[];
  users: UserProfile[];
  currentUser: UserProfile;
  onUpdateProjectProgress: (projectId: string, newProgress: number) => void;
  onToggleMilestone: (projectId: string, milestoneId: string) => void;
  onUpdateDeliverableStatus: (
    projectId: string,
    deliverableId: string,
    status: 'approved' | 'revision_requested' | 'pending_review',
    feedback?: string
  ) => void;
  onOpenNewProjectModal: () => void;
}

export const ProjectTrackerView: React.FC<ProjectTrackerViewProps> = ({
  projects,
  users,
  currentUser,
  onUpdateProjectProgress,
  onToggleMilestone,
  onUpdateDeliverableStatus,
  onOpenNewProjectModal,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [feedbackInput, setFeedbackInput] = useState<{ [deliverableId: string]: string }>({});

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

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

  const handleDeliverableAction = (
    deliverableId: string,
    status: 'approved' | 'revision_requested'
  ) => {
    const feedback = feedbackInput[deliverableId] || '';
    onUpdateDeliverableStatus(activeProject.id, deliverableId, status, feedback);
    setFeedbackInput((prev) => ({ ...prev, [deliverableId]: '' }));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Project Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Project Roadmap & Tracking Tools
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor sprint milestones, deliverable approvals, and client sign-offs
          </p>
        </div>

        <button
          onClick={onOpenNewProjectModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Project Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {projects.map((proj) => {
          const isSelected = proj.id === activeProject.id;
          return (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="font-semibold">{proj.name}</span>
              <span className="text-[10px] tabular-nums text-slate-400">
                ({proj.progressPercent}%)
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Active Project Details & Health Stats */}
      {activeProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols: Roadmaps & Deliverables */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview Card */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">
                    Client: {activeProject.clientName} · {activeProject.clientCompany}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {activeProject.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Status: {activeProject.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {activeProject.summary}
              </p>

              {/* Progress Slider Controller */}
              <div className="mt-5 p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">Sprint Completion Velocity</span>
                  <span className="text-amber-400 font-bold tabular-nums">
                    {activeProject.progressPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeProject.progressPercent}
                  onChange={(e) => onUpdateProjectProgress(activeProject.id, Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>Discovery (0%)</span>
                  <span>Development (50%)</span>
                  <span>QA Review (80%)</span>
                  <span>Production Live (100%)</span>
                </div>
              </div>
            </div>

            {/* Milestones Roadmap */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">
                  Sprint Milestones & Gateways
                </h3>
                <span className="text-xs text-slate-400">
                  {activeProject.milestones.filter((m) => m.completed).length} of{' '}
                  {activeProject.milestones.length} Completed
                </span>
              </div>

              <div className="space-y-3">
                {activeProject.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => onToggleMilestone(activeProject.id, m.id)}
                    className={`flex items-start justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      m.completed
                        ? 'bg-emerald-950/20 border-emerald-900/50 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {m.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] font-mono text-slate-400">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className={`text-xs font-medium ${m.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                          {m.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Scheduled Target: {m.dueDate}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded text-slate-400 bg-slate-800">
                      {m.completed ? 'Done' : 'In Progress'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables Pipeline & Client Review Area */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Deliverable Approvals & Client Sign-Offs
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review live staging builds, graphic assets, and campaign deliverables
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {activeProject.deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getServiceIcon(del.serviceCategory)}
                        <h4 className="text-xs font-semibold text-white">
                          {del.title}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {del.version}
                        </span>
                      </div>

                      {/* Status indicator */}
                      <div>
                        {del.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Client Approved</span>
                          </span>
                        )}
                        {del.status === 'pending_review' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" />
                            <span>Awaiting Review</span>
                          </span>
                        )}
                        {del.status === 'revision_requested' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded">
                            <AlertCircle className="w-3 h-3" />
                            <span>Revisions Requested</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Preview Thumbnail */}
                    {del.previewImage && (
                      <div className="relative h-44 rounded-lg overflow-hidden border border-slate-800">
                        <img
                          src={del.previewImage}
                          alt={del.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                          <span className="text-[11px] text-slate-200">
                            Submitted on {del.submittedDate}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Feedback if any */}
                    {del.clientFeedback && (
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300">
                        <span className="font-semibold text-amber-300">Client Feedback: </span>
                        <span>"{del.clientFeedback}"</span>
                      </div>
                    )}

                    {/* Review Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-slate-800/80">
                      <input
                        type="text"
                        placeholder="Add feedback comment for team or client..."
                        value={feedbackInput[del.id] || ''}
                        onChange={(e) =>
                          setFeedbackInput({ ...feedbackInput, [del.id]: e.target.value })
                        }
                        className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleDeliverableAction(del.id, 'revision_requested')}
                          className="px-3 py-1 text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/80 rounded transition-colors cursor-pointer"
                        >
                          Request Revision
                        </button>
                        <button
                          onClick={() => handleDeliverableAction(del.id, 'approved')}
                          className="px-3 py-1 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Financials & Team Assigned */}
          <div className="space-y-6">
            {/* Financial Ledger */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold text-white mb-3">
                Financial Tracking & Budget
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Contract Value</span>
                  <span className="text-white font-mono font-semibold tabular-nums">
                    ${activeProject.budgetTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Budget Deployed</span>
                  <span className="text-amber-400 font-mono font-semibold tabular-nums">
                    ${activeProject.budgetSpent.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Remaining Balance</span>
                  <span className="text-emerald-400 font-mono font-semibold tabular-nums">
                    ${(activeProject.budgetTotal - activeProject.budgetSpent).toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mt-2">
                  <div
                    className="h-full bg-amber-400"
                    style={{
                      width: `${(activeProject.budgetSpent / activeProject.budgetTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Team Assigned */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-sm font-semibold text-white mb-3">
                Assigned Specialists
              </h3>

              <div className="space-y-3">
                {activeProject.teamMembers.map((userId) => {
                  const u = users.find((x) => x.id === userId);
                  if (!u) return null;
                  return (
                    <div key={u.id} className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          {u.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {u.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
