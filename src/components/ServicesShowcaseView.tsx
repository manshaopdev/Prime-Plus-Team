import React, { useState } from 'react';
import { ServiceDetail, ServiceCategory } from '../types';
import {
  Code2,
  Palette,
  Megaphone,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  Layers,
} from 'lucide-react';

interface ServicesShowcaseViewProps {
  services: ServiceDetail[];
  onOpenBookingModalWithSpecs: (specs: {
    services: ServiceCategory[];
    estimatedBudget: number;
    timeline: string;
    details: string;
  }) => void;
}

export const ServicesShowcaseView: React.FC<ServicesShowcaseViewProps> = ({
  services,
  onOpenBookingModalWithSpecs,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('web_dev');

  // Interactive Quote Calculator State
  const [calcWebDev, setCalcWebDev] = useState(true);
  const [calcGraphicDesign, setCalcGraphicDesign] = useState(false);
  const [calcDigitalMarketing, setCalcDigitalMarketing] = useState(false);
  const [urgency, setUrgency] = useState<'standard' | 'express'>('standard');
  const [includeAddons, setIncludeAddons] = useState<{
    databaseAuth: boolean;
    seoAuditing: boolean;
    brandGuidelines: boolean;
  }>({
    databaseAuth: true,
    seoAuditing: false,
    brandGuidelines: false,
  });

  const activeService = services.find((s) => s.id === activeCategory) || services[0];

  // Calculate live estimate
  const calculateTotal = () => {
    let total = 0;
    if (calcWebDev) total += 3800;
    if (calcGraphicDesign) total += 2400;
    if (calcDigitalMarketing) total += 2200;

    if (includeAddons.databaseAuth) total += 800;
    if (includeAddons.seoAuditing) total += 600;
    if (includeAddons.brandGuidelines) total += 900;

    if (urgency === 'express') total = Math.round(total * 1.3);

    return total;
  };

  const getEstimatedTimeline = () => {
    let count = (calcWebDev ? 1 : 0) + (calcGraphicDesign ? 1 : 0) + (calcDigitalMarketing ? 1 : 0);
    if (count === 0) return 'Select a service';
    if (urgency === 'express') return '2 - 3 Weeks (Sprint Priority)';
    if (count === 1) return '3 - 4 Weeks';
    return '4 - 6 Weeks';
  };

  const handleBookEstimate = () => {
    const selectedCats: ServiceCategory[] = [];
    if (calcWebDev) selectedCats.push('web_dev');
    if (calcGraphicDesign) selectedCats.push('graphic_design');
    if (calcDigitalMarketing) selectedCats.push('digital_marketing');

    const total = calculateTotal();
    const timeline = getEstimatedTimeline();

    onOpenBookingModalWithSpecs({
      services: selectedCats.length > 0 ? selectedCats : ['web_dev'],
      estimatedBudget: total,
      timeline,
      details: `Configured via interactive estimator: Urgency: ${urgency}, Addons: ${Object.entries(
        includeAddons
      )
        .filter(([_, v]) => v)
        .map(([k]) => k)
        .join(', ')}`,
    });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full">
          <span>Prime Plus Team Integrated Services</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
          Web Engineering, Graphic Design & Digital Growth
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          We combine cutting-edge software engineering with high-end visual aesthetics and data-backed performance marketing to scale ambitious brands.
        </p>
      </div>

      {/* 2. Service Navigation Tabs */}
      <div className="flex justify-center">
        <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1">
          <button
            onClick={() => setActiveCategory('web_dev')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'web_dev'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Web Development</span>
          </button>
          <button
            onClick={() => setActiveCategory('graphic_design')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'graphic_design'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Graphic Designing</span>
          </button>
          <button
            onClick={() => setActiveCategory('digital_marketing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === 'digital_marketing'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Digital Marketing</span>
          </button>
        </div>
      </div>

      {/* 3. Detailed Service Showcase */}
      {activeService && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
            {/* Visual showcase with actual generated high-res image */}
            <div className="relative min-h-[360px] lg:h-full bg-slate-950 overflow-hidden">
              <img
                src={activeService.image}
                alt={activeService.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                    Prime Plus Specialized Division
                  </span>
                  <h3 className="text-xl font-bold">{activeService.name}</h3>
                </div>
              </div>
            </div>

            {/* Service Capabilities & Narrative */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="text-xs font-semibold text-amber-400">
                  {activeService.tagline}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  {activeService.description}
                </p>

                {/* Capabilities list */}
                <div className="mt-6 space-y-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Core Technical & Creative Capabilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {activeService.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Packages Preview */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeService.packages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      pkg.isPopular
                        ? 'bg-slate-950/90 border-amber-500/50'
                        : 'bg-slate-950/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{pkg.tier}</span>
                      {pkg.isPopular && (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 border border-amber-800 px-1.5 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-lg font-bold text-amber-400 font-mono">{pkg.price}</p>
                    <p className="text-[10px] text-slate-400 mb-2">Turnaround: {pkg.turnaround}</p>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {pkg.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-amber-400 font-bold">·</span>
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Interactive Project Cost & Package Estimator */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Scope & Budget Estimator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Build Your Custom Agency Project Package
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select desired deliverables to instantly calculate project timeline and investment
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Estimated Investment</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
              ${calculateTotal().toLocaleString()}
            </span>
          </div>
        </div>

        {/* Estimator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Services selector */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              1. Choose Core Services
            </h3>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={calcWebDev}
                  onChange={(e) => setCalcWebDev(e.target.checked)}
                  className="rounded accent-amber-400"
                />
                <div>
                  <p className="text-xs font-semibold text-white">Web Development</p>
                  <p className="text-[10px] text-slate-400">Next.js, React, APIs & Cloud DB</p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400">+$3,800</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={calcGraphicDesign}
                  onChange={(e) => setCalcGraphicDesign(e.target.checked)}
                  className="rounded accent-amber-400"
                />
                <div>
                  <p className="text-xs font-semibold text-white">Graphic Designing</p>
                  <p className="text-[10px] text-slate-400">Brand identity, Figma UI/UX system</p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400">+$2,400</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={calcDigitalMarketing}
                  onChange={(e) => setCalcDigitalMarketing(e.target.checked)}
                  className="rounded accent-amber-400"
                />
                <div>
                  <p className="text-xs font-semibold text-white">Digital Marketing</p>
                  <p className="text-[10px] text-slate-400">Google PPC, SEO & Meta funnels</p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400">+$2,200</span>
            </label>
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              2. Add-On Capabilities
            </h3>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={includeAddons.databaseAuth}
                  onChange={(e) =>
                    setIncludeAddons({ ...includeAddons, databaseAuth: e.target.checked })
                  }
                  className="rounded accent-amber-400"
                />
                <div>
                  <p className="text-xs font-semibold text-white">Multi-Role Auth & Cloud DB</p>
                  <p className="text-[10px] text-slate-400">Client portal & admin dashboard</p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400">+$800</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={includeAddons.seoAuditing}
                  onChange={(e) =>
                    setIncludeAddons({ ...includeAddons, seoAuditing: e.target.checked })
                  }
                  className="rounded accent-amber-400"
                />
                <div>
                  <p className="text-xs font-semibold text-white">Technical SEO & Schema</p>
                  <p className="text-[10px] text-slate-400">Full crawl audit & keyword map</p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400">+$600</span>
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={includeAddons.brandGuidelines}
                  onChange={(e) =>
                    setIncludeAddons({ ...includeAddons, brandGuidelines: e.target.checked })
                  }
                  className="rounded accent-amber-400"
                />
                <div>
                  <p className="text-xs font-semibold text-white">Comprehensive Brand Book</p>
                  <p className="text-[10px] text-slate-400">Vector logos, typography & color rules</p>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400">+$900</span>
            </label>
          </div>

          {/* Turnaround & Action */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                3. Speed & Priority
              </h3>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="urgency"
                      checked={urgency === 'standard'}
                      onChange={() => setUrgency('standard')}
                      className="accent-amber-400"
                    />
                    <span className="text-xs font-medium text-white">Standard Agency Cadence</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Regular</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="urgency"
                      checked={urgency === 'express'}
                      onChange={() => setUrgency('express')}
                      className="accent-amber-400"
                    />
                    <span className="text-xs font-medium text-amber-300">Express Sprint Priority</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono">+30%</span>
                </label>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block">Estimated Turnaround:</span>
                <span className="text-white font-semibold">{getEstimatedTimeline()}</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <button
                onClick={handleBookEstimate}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <span>Book Project with These Specs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://wa.me/923023608248?text=${encodeURIComponent(
                  `Hello Prime Plus Team! I calculated an estimate of $${calculateTotal().toLocaleString()} (${getEstimatedTimeline()}) for services on your portal. Let's discuss details.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>💬 Discuss on WhatsApp (03023608248)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
