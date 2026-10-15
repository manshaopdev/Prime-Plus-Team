import React, { useState, useEffect } from 'react';
import { ServiceCategory, ProjectItem, UserProfile } from '../types';
import { X, Check } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  initialSpecs?: {
    services: ServiceCategory[];
    estimatedBudget: number;
    timeline: string;
    details: string;
  } | null;
  onCreateProject: (project: Omit<ProjectItem, 'id'>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  users,
  initialSpecs,
  onCreateProject,
}) => {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('Sarah Jenkins');
  const [clientCompany, setClientCompany] = useState('Apex Global Corp');
  const [services, setServices] = useState<ServiceCategory[]>(['web_dev']);
  const [budgetTotal, setBudgetTotal] = useState(12500);
  const [deadline, setDeadline] = useState('2026-11-30');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (initialSpecs) {
      setServices(initialSpecs.services);
      setBudgetTotal(initialSpecs.estimatedBudget);
      setSummary(initialSpecs.details);
      if (!projectName) {
        setProjectName('Custom Multi-Disciplinary Digital Solution');
      }
    }
  }, [initialSpecs]);

  if (!isOpen) return null;

  const toggleService = (cat: ServiceCategory) => {
    if (services.includes(cat)) {
      if (services.length > 1) {
        setServices(services.filter((s) => s !== cat));
      }
    } else {
      setServices([...services, cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    onCreateProject({
      name: projectName,
      clientName,
      clientCompany,
      serviceCategories: services,
      progressPercent: 5,
      status: 'Discovery',
      startDate: new Date().toISOString().split('T')[0],
      deadline,
      budgetTotal,
      budgetSpent: 0,
      teamMembers: users.filter((u) => u.role !== 'client').map((u) => u.id),
      summary: summary || 'Comprehensive cross-functional engagement led by Prime Plus Team specialists.',
      milestones: [
        { id: `m_${Date.now()}_1`, title: 'Kickoff & Strategy Approval', dueDate: '2026-10-25', completed: false },
        { id: `m_${Date.now()}_2`, title: 'Core Deliverables Prototype & Staging', dueDate: '2026-11-15', completed: false },
        { id: `m_${Date.now()}_3`, title: 'Client Sign-Off & Live Launch', dueDate: deadline, completed: false },
      ],
      deliverables: [
        {
          id: `del_${Date.now()}_init`,
          title: `${projectName} - Initial Architecture & Creative Brief`,
          serviceCategory: services[0],
          status: 'pending_review',
          submittedDate: new Date().toISOString().split('T')[0],
          version: 'v1.0-draft',
        },
      ],
    });

    onClose();
    setProjectName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Create / Book New Project Brief</h3>
            <p className="text-xs text-slate-400">Configure client scope, milestones, and budget</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. FinTech Mobile Dashboard & Rebrand"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Client Contact Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Lead"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Client Company / Brand</label>
              <input
                type="text"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="Company Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Integrated Services Checkboxes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Integrated Services Included
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'web_dev', label: 'Web Dev' },
                { id: 'graphic_design', label: 'Graphic Design' },
                { id: 'digital_marketing', label: 'Marketing' },
              ].map((s) => {
                const isSelected = services.includes(s.id as ServiceCategory);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id as ServiceCategory)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/60'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Contract Budget ($ USD)</label>
              <input
                type="number"
                value={budgetTotal}
                onChange={(e) => setBudgetTotal(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Launch Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Project Summary & Objectives</label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Outline high-level deliverable requirements and strategic goals..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors"
            >
              Launch Project Brief
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
