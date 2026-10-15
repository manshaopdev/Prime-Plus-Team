import React, { useState } from 'react';
import {
  UserProfile,
  ProjectItem,
  TaskItem,
  ChatMessage,
  ClientInvoice,
  ServiceCategory,
  TaskStatus,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_SERVICES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_INVOICES,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TaskBoardView } from './components/TaskBoardView';
import { ProjectTrackerView } from './components/ProjectTrackerView';
import { CollaborationHubView } from './components/CollaborationHubView';
import { ServicesShowcaseView } from './components/ServicesShowcaseView';
import { ClientPortalView } from './components/ClientPortalView';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { NewTaskModal } from './components/NewTaskModal';
import { NewProjectModal } from './components/NewProjectModal';
import { CursorAndTouchEngine } from './components/CursorAndTouchEngine';
import { WhatsAppQuickButton } from './components/WhatsAppQuickButton';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [services] = useState(INITIAL_SERVICES);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [invoices, setInvoices] = useState<ClientInvoice[]>(INITIAL_INVOICES);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'tasks' | 'projects' | 'collaboration' | 'services' | 'client_portal' | 'admin'
  >('dashboard');

  const [isClientView, setIsClientView] = useState<boolean>(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPasswordModalOpen, setIsAdminPasswordModalOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [initialProjectSpecs, setInitialProjectSpecs] = useState<{
    services: ServiceCategory[];
    estimatedBudget: number;
    timeline: string;
    details: string;
  } | null>(null);

  // Task Actions
  const handleCreateTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAdvanceTaskStatus = (taskId: string) => {
    const nextMap: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'review',
      review: 'completed',
      completed: 'completed',
    };
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextMap[t.status] } : t))
    );
  };

  const handleToggleChecklistItem = (taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedChecklist = t.checklist.map((c) =>
          c.id === checklistId ? { ...c, completed: !c.completed } : c
        );
        return { ...t, checklist: updatedChecklist };
      })
    );
  };

  // Project Actions
  const handleCreateProject = (projectData: Omit<ProjectItem, 'id'>) => {
    const newProject: ProjectItem = {
      ...projectData,
      id: `proj_${Date.now()}`,
    };
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleUpdateProjectProgress = (projectId: string, newProgress: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, progressPercent: newProgress } : p))
    );
  };

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const newPercent = Math.round((completedCount / updatedMilestones.length) * 100);
        return {
          ...p,
          milestones: updatedMilestones,
          progressPercent: newPercent,
        };
      })
    );
  };

  const handleUpdateDeliverableStatus = (
    projectId: string,
    deliverableId: string,
    status: 'approved' | 'revision_requested' | 'pending_review',
    feedback?: string
  ) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedDeliverables = p.deliverables.map((d) =>
          d.id === deliverableId
            ? {
                ...d,
                status,
                clientFeedback: feedback !== undefined ? feedback : d.clientFeedback,
              }
            : d
        );
        return { ...p, deliverables: updatedDeliverables };
      })
    );

    if (status === 'approved') {
      const systemMessage: ChatMessage = {
        id: `msg_sys_${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.role,
        text: `🎉 Milestone deliverable has been officially APPROVED by ${currentUser.name}! The team is cleared for the next deployment phase.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channelId: 'general',
        reactions: [{ emoji: '🎉', count: 4, users: ['user_lead', 'user_dev', 'user_design', 'user_marketing'] }],
      };
      setMessages((prev) => [...prev, systemMessage]);
    }
  };

  // Chat Actions
  const handleSendMessage = (text: string, channelId: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channelId,
      reactions: [],
    };
    setMessages((prev) => [...prev, newMsg]);

    if (currentUser.role === 'client') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `msg_lead_reply_${Date.now()}`,
          senderId: 'user_mrhcr',
          senderName: 'Mr.hcr (Owner)',
          senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
          senderRole: 'lead',
          text: `Acknowledged, ${currentUser.name}! Mr.hcr here. Our team has received your inquiry. Direct WhatsApp line: 03023608248.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channelId,
          reactions: [{ emoji: '👍', count: 1, users: ['user_mrhcr'] }],
        };
        setMessages((prev) => [...prev, reply]);
      }, 1400);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;
        const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
        if (existingReaction) {
          const userAlreadyReacted = existingReaction.users.includes(currentUser.id);
          const updated = msg.reactions.map((r) =>
            r.emoji === emoji
              ? {
                  ...r,
                  count: userAlreadyReacted ? Math.max(1, r.count - 1) : r.count + 1,
                  users: userAlreadyReacted
                    ? r.users.filter((u) => u !== currentUser.id)
                    : [...r.users, currentUser.id],
                }
              : r
          );
          return { ...msg, reactions: updated };
        } else {
          return {
            ...msg,
            reactions: [
              ...msg.reactions,
              { emoji, count: 1, users: [currentUser.id] },
            ],
          };
        }
      })
    );
  };

  // User and Admin Management Actions
  const handleBanUser = (userId: string, reason?: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: true, banReason: reason || 'Violation' } : u))
    );
  };

  const handleUnbanUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: false, banReason: undefined } : u))
    );
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleCreateUser = (newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSendAdminNotification = (userId: string, messageText: string) => {
    const targetUser = users.find((u) => u.id === userId);
    const notice: ChatMessage = {
      id: `msg_admin_${Date.now()}`,
      senderId: currentUser.id,
      senderName: `${currentUser.name} (Admin Notice)`,
      senderAvatar: currentUser.avatar,
      senderRole: 'lead',
      text: `📢 [Direct Admin Notice to ${targetUser?.name || 'User'}]: ${messageText}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channelId: 'general',
      reactions: [{ emoji: '🛡️', count: 1, users: [currentUser.id] }],
    };
    setMessages((prev) => [...prev, notice]);
  };

  // Auth Login & Register
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'client') {
      setIsClientView(true);
      setActiveTab('client_portal');
    } else {
      setIsClientView(false);
      setActiveTab('dashboard');
    }
  };

  const handleRegister = (newUser: UserProfile) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const handleOpenAdminPanel = () => {
    if (isAdminUnlocked || (currentUser.id === 'user_mrhcr' && currentUser.role === 'lead')) {
      setIsClientView(false);
      setActiveTab('admin');
    } else {
      setIsAdminPasswordModalOpen(true);
    }
  };

  const handleAdminPasswordSuccess = () => {
    setIsAdminUnlocked(true);
    const mrhcr = users.find((u) => u.id === 'user_mrhcr') || currentUser;
    setCurrentUser(mrhcr);
    setIsClientView(false);
    setActiveTab('admin');
  };

  const handleOpenBookingModalWithSpecs = (specs: {
    services: ServiceCategory[];
    estimatedBudget: number;
    timeline: string;
    details: string;
  }) => {
    setInitialProjectSpecs(specs);
    setIsNewProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      {/* 1. Custom Mouse and Finger Touch Animation Engine */}
      <CursorAndTouchEngine />

      {/* 2. Floating Direct WhatsApp Quick Button (Number: 03023608248) */}
      <WhatsAppQuickButton />

      {/* 3. Strict Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        users={users}
        onSwitchUser={setCurrentUser}
        isClientView={isClientView}
        setIsClientView={setIsClientView}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminPanel={handleOpenAdminPanel}
      />

      {/* 4. Main Dynamic Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'dashboard' && !isClientView && (
          <DashboardView
            projects={projects}
            tasks={tasks}
            users={users}
            currentUser={currentUser}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
            onOpenNewProjectModal={() => {
              setInitialProjectSpecs(null);
              setIsNewProjectModalOpen(true);
            }}
            onNavigateTab={setActiveTab}
            onAdvanceTaskStatus={handleAdvanceTaskStatus}
          />
        )}

        {activeTab === 'tasks' && !isClientView && (
          <TaskBoardView
            tasks={tasks}
            projects={projects}
            users={users}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onToggleChecklistItem={handleToggleChecklistItem}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectTrackerView
            projects={projects}
            users={users}
            currentUser={currentUser}
            onUpdateProjectProgress={handleUpdateProjectProgress}
            onToggleMilestone={handleToggleMilestone}
            onUpdateDeliverableStatus={handleUpdateDeliverableStatus}
            onOpenNewProjectModal={() => {
              setInitialProjectSpecs(null);
              setIsNewProjectModalOpen(true);
            }}
          />
        )}

        {activeTab === 'collaboration' && !isClientView && (
          <CollaborationHubView
            currentUser={currentUser}
            users={users}
            messages={messages}
            onSendMessage={handleSendMessage}
            onAddReaction={handleAddReaction}
          />
        )}

        {activeTab === 'services' && (
          <ServicesShowcaseView
            services={services}
            onOpenBookingModalWithSpecs={handleOpenBookingModalWithSpecs}
          />
        )}

        {activeTab === 'client_portal' && (
          <ClientPortalView
            currentUser={currentUser}
            projects={projects}
            invoices={invoices}
            onOpenNewProjectModal={() => {
              setInitialProjectSpecs(null);
              setIsNewProjectModalOpen(true);
            }}
            onUpdateDeliverableStatus={handleUpdateDeliverableStatus}
            onSendMessageToLead={(text) => handleSendMessage(text, 'client-apex')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            users={users}
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            onBanUser={handleBanUser}
            onUnbanUser={handleUnbanUser}
            onCreateUser={handleCreateUser}
            onDeleteUser={handleDeleteUser}
            onSendAdminNotification={handleSendAdminNotification}
          />
        )}
      </main>

      {/* 5. Quiet Editorial Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm bg-amber-400 rotate-45" />
            <span className="font-semibold text-slate-300">Prime Plus Team</span>
            <span>· Web Development · Graphic Designing · Digital Marketing</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://wa.me/923023608248?text=Hello%20Prime%20Plus%20Team!"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>WhatsApp: 03023608248</span>
            </a>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              User Login / Register
            </button>
            <span aria-hidden="true">·</span>
            <span>Internal SLA 99.9%</span>
          </div>
        </div>
      </footer>

      {/* 6. Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <AdminPasswordModal
        isOpen={isAdminPasswordModalOpen}
        onClose={() => setIsAdminPasswordModalOpen(false)}
        onSuccess={handleAdminPasswordSuccess}
      />

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        projects={projects}
        users={users}
        onCreateTask={handleCreateTask}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => {
          setIsNewProjectModalOpen(false);
          setInitialProjectSpecs(null);
        }}
        users={users}
        initialSpecs={initialProjectSpecs}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
