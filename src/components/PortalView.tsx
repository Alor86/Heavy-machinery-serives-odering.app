import React, { useState, useEffect } from 'react';
import {
  Tractor,
  AlertTriangle,
  Clock,
  CheckCircle,
  Plus,
  Compass,
  TrendingUp,
  MapPin,
  Flame,
  Wrench,
  ChevronRight,
  Sparkles,
  User,
  Activity
} from 'lucide-react';
import { EquipmentItem, ServiceRequest, Role } from '../types';
import { INITIAL_EQUIPMENT, INITIAL_REQUESTS } from '../mockData';
import CustomerBookView from './CustomerBookView';

interface PortalViewProps {
  id?: string;
  userEmail: string;
  userRole: Role;
  onLogout?: () => void;
  isFullWebView?: boolean;
}

export default function PortalView({
  id = 'portal-view-container',
  userEmail,
  userRole,
  onLogout = () => {},
  isFullWebView = false,
}: PortalViewProps) {
  if (userRole === 'customer') {
    return <CustomerBookView userEmail={userEmail} onLogout={onLogout} isFullWebView={isFullWebView} />;
  }
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(() => {
    const saved = localStorage.getItem('hg_equipment');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [requestList, setRequestList] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('hg_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // Save states
  useEffect(() => {
    localStorage.setItem('hg_equipment', JSON.stringify(equipmentList));
  }, [equipmentList]);

  useEffect(() => {
    localStorage.setItem('hg_requests', JSON.stringify(requestList));
  }, [requestList]);

  // Fields for Logging a Service Alert
  const [showLogAlertForm, setShowLogAlertForm] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(equipmentList[0]?.name || 'Volvo EC380E');
  const [issueDesc, setIssueDesc] = useState('');
  const [locInput, setLocInput] = useState('');
  const [priorityInput, setPriorityInput] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM'>('HIGH');
  const [formError, setFormError] = useState('');

  // Submit field alert
  const handleLogAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!issueDesc.trim() || !locInput.trim()) {
      setFormError('Please fill out the issue description and location grid coordinate.');
      return;
    }

    const newRequest: ServiceRequest = {
      id: `SR-${Math.floor(100 + Math.random() * 900)}`,
      equipment: selectedMachine,
      issue: issueDesc.trim(),
      location: locInput.trim(),
      priority: priorityInput,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
    };

    setRequestList([newRequest, ...requestList]);
    setIssueDesc('');
    setLocInput('');
    setShowLogAlertForm(false);
  };

  // Helper colors
  const getPriorityBadge = (p: 'CRITICAL' | 'HIGH' | 'MEDIUM') => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'MEDIUM':
        return 'bg-sky-50 text-sky-700 border-sky-100';
    }
  };

  const getStatusBadge = (s: 'PENDING' | 'DISPATCHED' | 'COMPLETED') => {
    switch (s) {
      case 'PENDING':
        return 'bg-[#4f46e5]/5 text-indigo-600 border-[#4f46e5]/10 animate-pulse';
      case 'DISPATCHED':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    }
  };

  const handleToggleAssetStatus = (assetId: string) => {
    setEquipmentList(prev =>
      prev.map(item => {
        if (item.id === assetId) {
          const nextStatusMap: { [key: string]: 'ACTIVE' | 'MAINTENANCE' | 'IDLE' } = {
            'ACTIVE': 'IDLE',
            'IDLE': 'MAINTENANCE',
            'MAINTENANCE': 'ACTIVE'
          };
          return {
            ...item,
            status: nextStatusMap[item.status]
          };
        }
        return item;
      })
    );
  };

  return (
    <div id={id} className={`w-full ${isFullWebView ? 'max-w-6xl px-4 sm:px-6 lg:px-8 py-6' : 'max-w-[440px]'} mx-auto flex flex-col gap-5 pb-8 font-sans`}>
      {/* Portal Header Greeting (Indigo Glow Panel) */}
      <div id="portal-user-welcome" className="bg-indigo-600 p-4 rounded-3xl flex items-center justify-between text-white shadow-xl shadow-indigo-100 sticky top-0 z-10">
        <div className="space-y-0.5">
          <p className="text-[8px] uppercase font-bold tracking-widest text-indigo-200">
            Authenticated Console
          </p>
          <p className="text-sm font-extrabold truncate max-w-[170px] tracking-tight">
            {userEmail.split('@')[0]}
          </p>
          <div className="flex items-center gap-1 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-indigo-100 uppercase tracking-widest">
              {userRole}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black text-white tracking-tight leading-none">
            93.4%
          </p>
          <p className="text-[8px] uppercase font-extrabold text-indigo-200 tracking-wider pt-0.5">
            Fleet Efficiency
          </p>
        </div>
      </div>

      {/* Grid Stats Row (Polished Slates) */}
      <div id="stats-dashboard-grid" className="grid grid-cols-3 gap-2">
        <div className="bg-slate-50 border border-slate-100 p-3 text-center rounded-2xl shadow-sm">
          <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">ACTIVE</p>
          <p className="text-lg font-black text-slate-800 mt-0.5">
            {equipmentList.filter(e => e.status === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-3 text-center rounded-2xl shadow-sm">
          <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">REP ALERT</p>
          <p className="text-lg font-black text-rose-500 mt-0.5">
            {requestList.filter(r => r.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-3 text-center rounded-2xl shadow-sm">
          <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">MAINT</p>
          <p className="text-lg font-black text-amber-500 mt-0.5">
            {equipmentList.filter(e => e.status === 'MAINTENANCE').length}
          </p>
        </div>
      </div>

      {/* Logging Service Emergency Toggle Trigger */}
      <div id="toggle-alert-button-container">
        {!showLogAlertForm ? (
          <button
            type="button"
            id="btn-trigger-service-form"
            onClick={() => setShowLogAlertForm(true)}
            className="w-full h-11 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-rose-100 active:scale-98 transition-all cursor-pointer outline-none select-none border-none"
          >
            <AlertTriangle className="w-4 h-4 text-white" />
            <span>DISPATCH EMERGENCY ALERT</span>
            <Plus className="w-4 h-4 ml-auto" />
          </button>
        ) : (
          <form
            onSubmit={handleLogAlert}
            id="alert-logging-form"
            className="bg-white border border-rose-200 p-4 space-y-3.5 rounded-2xl relative shadow-xl shadow-rose-50 animate-fade-in"
          >
            <div className="flex justify-between items-center border-b border-rose-100 pb-2">
              <span className="text-[10px] font-black uppercase text-rose-700 tracking-wide flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                Breakdown Dispatch Report
              </span>
              <button
                type="button"
                id="btn-close-service-form"
                onClick={() => setShowLogAlertForm(false)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {/* Select Machinery */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-[9px] font-bold uppercase text-slate-450 tracking-wider">Select Machinery</label>
              <select
                id="select-alert-machinery"
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500"
              >
                {equipmentList.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Location Spot Grid */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-[9px] font-bold uppercase text-slate-450 tracking-wider">Location Coordinate</label>
              <input
                type="text"
                id="input-alert-location"
                value={locInput}
                onChange={(e) => setLocInput(e.target.value)}
                placeholder="e.g. Sector 8 Quarry or Grid-4B"
                className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium placeholder:text-slate-300 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Severity Trigger Priority */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-[9px] font-bold uppercase text-slate-450 tracking-wider">Severity Level</label>
              <div className="grid grid-cols-3 gap-2">
                {(['CRITICAL', 'HIGH', 'MEDIUM'] as const).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    id={`btn-alert-priority-${lvl.toLowerCase()}`}
                    onClick={() => setPriorityInput(lvl)}
                    className={`h-8 rounded-xl border text-[9px] font-bold tracking-wider uppercase flex items-center justify-center cursor-pointer transition-all ${
                      priorityInput === lvl
                        ? 'bg-rose-500 text-white border-rose-600 font-extrabold shadow-sm'
                        : 'bg-slate-50 text-slate-450 hover:bg-slate-100 border-slate-200/60'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Failure Mode Description */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="text-[9px] font-bold uppercase text-slate-450 tracking-wider">Failure Mode / Issue</label>
              <textarea
                id="textarea-alert-desc"
                rows={2}
                value={issueDesc}
                onChange={(e) => setIssueDesc(e.target.value)}
                placeholder="Breakdown telemetry issues, hydraulic leaks..."
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium placeholder:text-slate-300 text-slate-800 text-xs resize-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-700 text-[10.5px] font-bold rounded-xl flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 select-none animate-bounce" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              id="btn-alert-submit"
              className="w-full h-10 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-xl border-none shadow-md shadow-rose-100 transition-colors"
            >
              <Flame className="w-4 h-4" />
              <span>Broadcast Field Alert</span>
            </button>
          </form>
        )}
      </div>

      {/* Fleet Live Tracking section */}
      <div id="portal-fleet-assets" className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
            <Tractor className="w-4.5 h-4.5 text-indigo-600" />
            Your Fleet Machinery
          </h2>
          <span className="text-[9px] font-sans font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5">
            {equipmentList.length} UNITS LOGGED
          </span>
        </div>

        <div className={`grid ${isFullWebView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-3`}>
          {equipmentList.map((asset) => (
            <div
              key={asset.id}
              id={`asset-${asset.id}`}
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden flex flex-col p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-3">
                <div className="w-14 h-14 shrink-0 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200/50">
                  <img
                    referrerPolicy="no-referrer"
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute bottom-0 right-0 left-0 bg-slate-900/80 text-[7px] text-white p-0.5 text-center font-mono">
                    {asset.id}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-extrabold truncate text-slate-800">
                      {asset.name}
                    </h3>
                    <button
                      title="Click to cycle status"
                      id={`btn-cycle-status-${asset.id}`}
                      onClick={() => handleToggleAssetStatus(asset.id)}
                      className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border cursor-pointer outline-none transition-colors ${
                        asset.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-150'
                          : asset.status === 'MAINTENANCE'
                          ? 'bg-amber-50 text-amber-600 border-amber-150'
                          : 'bg-slate-50 text-slate-500 border-slate-150'
                      }`}
                    >
                      {asset.status}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {asset.type}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      {asset.lastChecked}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      Eff: {asset.efficiency}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Field Dispatches */}
      <div id="portal-dispatches" className="space-y-3">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h2 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Live Service Dispatches
          </h2>
          <span className="text-[8px] font-sans font-extrabold px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-600 uppercase tracking-widest rounded-full">
            Live Monitor
          </span>
        </div>

        <div className={`grid ${isFullWebView ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-3`}>
          {requestList.map((req) => (
            <div
              key={req.id}
              id={`request-${req.id}`}
              className="bg-white border border-slate-200/60 border-l-4 border-l-indigo-600 rounded-r-2xl rounded-l p-3.5 space-y-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wider block">
                    {req.id} • {req.date}
                  </span>
                  <span className="text-xs font-bold text-slate-800 tracking-tight block">
                    {req.equipment}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${getPriorityBadge(req.priority)}`}>
                    {req.priority}
                  </span>
                  <span className={`text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${getStatusBadge(req.status)}`}>
                    {req.status}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-600 leading-relaxed select-text italic">
                "{req.issue}"
              </div>

              <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span className="tracking-tight uppercase">LOCATION: {req.location}</span>
                {userRole === 'provider' && req.status === 'PENDING' && (
                  <button
                    type="button"
                    id={`btn-claim-dispatch-${req.id}`}
                    onClick={() => {
                      setRequestList(prev =>
                        prev.map(r => r.id === req.id ? { ...r, status: 'DISPATCHED' } : r)
                      );
                    }}
                    className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg text-[9px] select-none shadow-sm transition-colors border-none cursor-pointer"
                  >
                    Claim Job
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
