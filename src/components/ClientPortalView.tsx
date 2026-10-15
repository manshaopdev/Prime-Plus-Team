import React, { useState } from 'react';
import { ProjectItem, ProjectDeliverable, ClientInvoice, UserProfile } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  MessageSquare,
  Sparkles,
  Download,
  ThumbsUp,
  ExternalLink,
  Plus,
  Send,
} from 'lucide-react';

interface ClientPortalViewProps {
  currentUser: UserProfile;
  projects: ProjectItem[];
  invoices: ClientInvoice[];
  onOpenNewProjectModal: () => void;
  onUpdateDeliverableStatus: (
    projectId: string,
    deliverableId: string,
    status: 'approved' | 'revision_requested',
    feedback?: string
  ) => void;
  onSendMessageToLead: (text: string) => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  currentUser,
  projects,
  invoices,
  onOpenNewProjectModal,
  onUpdateDeliverableStatus,
  onSendMessageToLead,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(null);
  const [feedbackInputs, setFeedbackInputs] = useState<{ [id: string]: string }>({});
  const [clientMessage, setClientMessage] = useState('');
  const [messageSentToast, setMessageSentToast] = useState(false);

  // Client project (Apex Global Corp)
  const clientProject = projects.find((p) => p.id === 'proj_apex') || projects[0];
  const pendingDeliverables = clientProject?.deliverables.filter((d) => d.status === 'pending_review') || [];
  const approvedDeliverables = clientProject?.deliverables.filter((d) => d.status === 'approved') || [];

  const handleDeliverableResponse = (
    deliverableId: string,
    status: 'approved' | 'revision_requested'
  ) => {
    const feedback = feedbackInputs[deliverableId] || '';
    onUpdateDeliverableStatus(clientProject.id, deliverableId, status, feedback);
    setFeedbackInputs((prev) => ({ ...prev, [deliverableId]: '' }));
  };

  const handleSendClientMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientMessage.trim()) return;
    onSendMessageToLead(clientMessage);
    setClientMessage('');
    setMessageSentToast(true);
    setTimeout(() => setMessageSentToast(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Client Welcome Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <span>Client Executive Portal</span>
              <span aria-hidden="true">·</span>
              <span>Prime Plus VIP Services</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Direct overview of deliverables, milestone approvals, and invoices for {clientProject?.clientCompany || 'your account'}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewProjectModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Request New Service / Scope</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Executive Project Summary Cards */}
      {clientProject && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Overall Project Progress</span>
              <span className="text-emerald-400 font-semibold font-mono">ON SCHEDULE</span>
            </div>
            <p className="text-2xl font-bold text-white tabular-nums tracking-tight">
              {clientProject.progressPercent}%
            </p>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                style={{ width: `${clientProject.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Target Delivery Date</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-white tracking-tight">
              {clientProject.deadline}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Final user acceptance QA & live deployment
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Sign-Offs Requiring Attention</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-400 tabular-nums tracking-tight">
              {pendingDeliverables.length} Deliverable{pendingDeliverables.length === 1 ? '' : 's'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Ready for your executive review & sign-off
            </p>
          </div>
        </div>
      )}

      {/* 3. Deliverables Sign-Off Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Deliverables Ready for Review & Approval
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              One-click approvals or feedback notes sent directly to the Prime Plus team lead
            </p>
          </div>
        </div>

        {pendingDeliverables.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">All deliverables are approved!</p>
            <p className="text-xs text-slate-400 mt-1">
              Your team will be notified when the next sprint milestone is submitted.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingDeliverables.map((del) => (
              <div
                key={del.id}
                className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="capitalize">{del.serviceCategory.replace('_', ' ')}</span>
                    <span className="font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                      Awaiting Sign-Off
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white">
                    {del.title}
                  </h3>

                  {del.previewImage && (
                    <div className="mt-3 relative h-48 rounded-lg overflow-hidden border border-slate-800">
                      <img
                        src={del.previewImage}
                        alt={del.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 mt-2">
                    Submitted on {del.submittedDate} · Version {del.version}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <input
                    type="text"
                    placeholder="Optional feedback or change request note..."
                    value={feedbackInputs[del.id] || ''}
                    onChange={(e) =>
                      setFeedbackInputs({ ...feedbackInputs, [del.id]: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeliverableResponse(del.id, 'revision_requested')}
                      className="flex-1 py-2 text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/80 rounded-lg transition-colors cursor-pointer"
                    >
                      Request Revisions
                    </button>
                    <button
                      onClick={() => handleDeliverableResponse(del.id, 'approved')}
                      className="flex-1 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Approve & Sign Off</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Billing & Invoices Summary */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Invoices & Statement Summary
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Download receipts and view milestone payment schedules
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Invoice #</th>
                <th className="py-2.5 px-3">Milestone Scope</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-mono font-medium text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3">{inv.projectName}</td>
                  <td className="py-3 px-3 tabular-nums text-slate-400">{inv.dueDate}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white tabular-nums">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="text-amber-400 hover:text-amber-300 text-xs font-medium cursor-pointer inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Direct Message Line & WhatsApp Contact */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src="/images/avatar_mrhcr_1792085808587.jpg"
              alt="Mr.hcr"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80';
              }}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Mr.hcr (Owner & Lead Web Developer)
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                  Available on WhatsApp
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Urgent questions, new web development scope, or direct agency ownership support.
              </p>
            </div>
          </div>

          {/* WhatsApp Direct Action Button */}
          <a
            href="https://wa.me/923023608248?text=Hello%20Mr.hcr!%20I%20am%20contacting%20you%20from%20the%20Prime%20Plus%20Client%20Portal%20regarding%20my%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <span>💬 Chat on WhatsApp: 03023608248</span>
          </a>
        </div>

        <form onSubmit={handleSendClientMessage} className="flex gap-2">
          <input
            type="text"
            value={clientMessage}
            onChange={(e) => setClientMessage(e.target.value)}
            placeholder="Type your priority inquiry or request here..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Direct Message</span>
          </button>
        </form>

        {messageSentToast && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Message delivered to Mr.hcr (Owner). You will receive an update in the Team Live Hub.</span>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Invoice Statement</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedInvoice.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Issued To:</span>
                <span className="font-semibold text-white">Apex Global Corp (Sarah Jenkins)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Issued By:</span>
                <span className="font-semibold text-white">Prime Plus Team Digital Agency</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Due Date:</span>
                <span className="font-mono">{selectedInvoice.dueDate}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <p className="font-semibold text-white">Line Items:</p>
                {selectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-slate-300">
                    <span>{item.description}</span>
                    <span className="font-mono">${item.unitPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                <span>Total Amount:</span>
                <span className="text-amber-400 font-mono">${selectedInvoice.amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Receipt PDF downloaded successfully.');
                  setSelectedInvoice(null);
                }}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
