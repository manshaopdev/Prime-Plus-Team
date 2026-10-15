import React, { useState } from 'react';
import { Shield, Lock, X, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ADMIN_MASTER_PASSWORD = 'Qwsa1122';

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.trim() === ADMIN_MASTER_PASSWORD) {
      onSuccess();
      onClose();
      setPassword('');
      setError('');
    } else {
      setError('Ghalat password! Admin Panel sirf sahi password (Qwsa1122) lagane par hi open hoga.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-white">
            <div className="p-2 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/40">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Admin Panel Security Lock</h3>
              <p className="text-[11px] text-amber-400/90 font-medium">Bina password lagaye open nahi ho sakta</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Admin Panel tak rasai ke liye password enter karein. Bina password ke Admin access block hai:
          </p>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Admin Password Darj Karein:
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter admin password..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-9 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Admin Password: <span className="font-mono text-amber-400 font-bold">Qwsa1122</span>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
            >
              Unlock Admin Panel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
