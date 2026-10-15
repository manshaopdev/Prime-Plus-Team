import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  ShieldAlert,
  UserCheck,
  UserX,
  Search,
  Plus,
  MessageCircle,
  Mail,
  Phone,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  Building,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface AdminPanelProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onBanUser: (userId: string, reason?: string) => void;
  onUnbanUser: (userId: string) => void;
  onCreateUser: (newUser: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
  onSendAdminNotification: (userId: string, message: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  currentUser,
  onUpdateUser,
  onBanUser,
  onUnbanUser,
  onCreateUser,
  onDeleteUser,
  onSendAdminNotification,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');

  // Contact modal state
  const [contactUser, setContactUser] = useState<UserProfile | null>(null);
  const [customContactMessage, setCustomContactMessage] = useState('');

  // Create/Edit user modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('03023608248');
  const [formRole, setFormRole] = useState<UserRole>('client');
  const [formCompany, setFormCompany] = useState('');
  const [formTitle, setFormTitle] = useState('');

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery)) ||
      (u.company && u.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !u.isBanned) ||
      (statusFilter === 'banned' && u.isBanned);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const teamMembersCount = users.filter((u) => u.role !== 'client').length;
  const clientUsersCount = users.filter((u) => u.role === 'client').length;
  const bannedCount = users.filter((u) => u.isBanned).length;

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('03023608248');
    setFormRole('client');
    setFormCompany('');
    setFormTitle('Client Partner');
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone || '03023608248');
    setFormRole(user.role);
    setFormCompany(user.company || '');
    setFormTitle(user.title);
    setIsCreateModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        role: formRole,
        company: formCompany.trim() || undefined,
        title: formTitle.trim() || `${formRole.toUpperCase()} Member`,
      });
    } else {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        role: formRole,
        title: formTitle.trim() || (formRole === 'client' ? 'Client Representative' : `${formRole.toUpperCase()} Specialist`),
        company: formCompany.trim() || (formRole === 'client' ? 'Client Org' : undefined),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
        isOnline: true,
        activeStatusText: 'Active on Prime Plus Portal',
        isBanned: false,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onCreateUser(newUser);
    }

    setIsCreateModalOpen(false);
  };

  const handleBanToggle = (user: UserProfile) => {
    if (user.id === currentUser.id) {
      alert("Admin can't ban their own ID.");
      return;
    }

    if (user.isBanned) {
      onUnbanUser(user.id);
    } else {
      const reason = prompt(
        `Specify reason to ban user ID "${user.name}" (${user.id}):`,
        'Terms violation or contract non-compliance'
      );
      if (reason !== null) {
        onBanUser(user.id, reason);
      }
    }
  };

  const formatPhoneForWhatsApp = (phoneStr?: string) => {
    if (!phoneStr) return '923023608248';
    let cleaned = phoneStr.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '92' + cleaned.substring(1);
    }
    return cleaned;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Admin Console & User ID Management
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Admin Access: {currentUser.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ban/unban user IDs, update roles, or contact clients & team members via WhatsApp and Email
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New User ID</span>
        </button>
      </div>

      {/* 2. Admin KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Total Registered IDs</span>
          <p className="text-2xl font-bold text-white tabular-nums mt-1">{totalUsers}</p>
          <p className="text-[11px] text-slate-500 mt-1">Platform user identities</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Team Specialists</span>
          <p className="text-2xl font-bold text-cyan-400 tabular-nums mt-1">{teamMembersCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Engineering, Design & Marketing</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Client Accounts</span>
          <p className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">{clientUsersCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Verified enterprise clients</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Suspended / Banned IDs</span>
          <p className="text-2xl font-bold text-rose-400 tabular-nums mt-1">{bannedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Access revoked by Admin</p>
        </div>
      </div>

      {/* 3. Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name, email, phone, company..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="lead">Lead / Admin</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="marketer">Marketer</option>
            <option value="client">Client</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="banned">Banned / Suspended Only</option>
          </select>
        </div>
      </div>

      {/* 4. User ID Management Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-medium">
                <th className="py-3 px-4">User ID & Profile</th>
                <th className="py-3 px-4">Role / Department</th>
                <th className="py-3 px-4">Contact Phone / WhatsApp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Contact User</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching user IDs found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      user.isBanned ? 'bg-rose-950/20' : ''
                    }`}
                  >
                    {/* User profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-800"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{user.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono truncate">
                            ID: {user.id} · {user.email}
                          </p>
                          {user.company && (
                            <p className="text-[10px] text-amber-400 truncate">
                              🏢 {user.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role dropdown for immediate switching */}
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          onUpdateUser({
                            ...user,
                            role: e.target.value as UserRole,
                          })
                        }
                        className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded px-2 py-1 focus:outline-none cursor-pointer"
                      >
                        <option value="lead">Lead / Admin</option>
                        <option value="developer">Developer</option>
                        <option value="designer">Designer</option>
                        <option value="marketer">Marketer</option>
                        <option value="client">Client</option>
                      </select>
                    </td>

                    {/* Phone & WhatsApp */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {user.phone || '03023608248'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {user.isBanned ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-950/80 text-rose-400 border border-rose-800">
                            <UserX className="w-3 h-3" />
                            <span>Banned</span>
                          </span>
                          {user.banReason && (
                            <p className="text-[9px] text-rose-400 line-clamp-1">
                              {user.banReason}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                          <UserCheck className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      )}
                    </td>

                    {/* Contact Actions ("apny hisab sa contect bhi kar saky") */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {/* 1-click WhatsApp */}
                        <a
                          href={`https://wa.me/${formatPhoneForWhatsApp(
                            user.phone
                          )}?text=${encodeURIComponent(
                            `Hello ${user.name}! This is Mr.hcr (Owner & Lead Web Developer, Prime Plus Team). I am contacting you regarding your user account.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 transition-colors cursor-pointer"
                          title={`Chat with ${user.name} on WhatsApp`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>

                        {/* 1-click Email */}
                        <a
                          href={`mailto:${user.email}?subject=Prime%20Plus%20Team%20Administrative%20Notice`}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title={`Email ${user.email}`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>

                        {/* Custom In-App Message */}
                        <button
                          onClick={() => {
                            setContactUser(user);
                            setCustomContactMessage('');
                          }}
                          className="px-2 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-medium transition-colors cursor-pointer"
                        >
                          Custom Notice
                        </button>
                      </div>
                    </td>

                    {/* Admin Actions (Ban / Edit / Delete) */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Ban / Unban Toggle */}
                        <button
                          onClick={() => handleBanToggle(user)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                            user.isBanned
                              ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                              : 'bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800/80'
                          }`}
                        >
                          {user.isBanned ? 'Unban ID' : 'Ban User ID'}
                        </button>

                        {/* Edit details */}
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit User Info"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete User */}
                        {user.id !== currentUser.id && (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Custom Contact Notice Modal */}
      {contactUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Contact {contactUser.name}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Phone: {contactUser.phone || '03023608248'} · {contactUser.email}
                </p>
              </div>
              <button
                onClick={() => setContactUser(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Custom Notice / Message
                </label>
                <textarea
                  rows={3}
                  value={customContactMessage}
                  onChange={(e) => setCustomContactMessage(e.target.value)}
                  placeholder="Enter message for client/team member..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <a
                  href={`https://wa.me/${formatPhoneForWhatsApp(
                    contactUser.phone
                  )}?text=${encodeURIComponent(
                    customContactMessage ||
                      `Hello ${contactUser.name}! This is Mr.hcr from Prime Plus Team.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    if (customContactMessage.trim()) {
                      onSendAdminNotification(contactUser.id, customContactMessage.trim());
                      alert(`Administrative in-app alert sent to ${contactUser.name}!`);
                      setContactUser(null);
                    }
                  }}
                  className="py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Send In-App Alert</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Create / Edit User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingUser ? 'Edit User ID Details' : 'Provision New User ID'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">User Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="tariq@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="client">Client</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="marketer">Marketer</option>
                    <option value="lead">Lead / Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">WhatsApp / Phone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="03023608248"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  placeholder="e.g. Apex Global Corp"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Professional Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Chief Marketing Officer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
                >
                  {editingUser ? 'Save Changes' : 'Provision ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
