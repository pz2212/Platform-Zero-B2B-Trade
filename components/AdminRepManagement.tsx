
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockService } from '../services/mockDataService';
/* Added missing import for triggerNativeSms */
import { triggerNativeSms } from '../services/smsService';
import { 
  Users, TrendingUp, DollarSign, Award, ArrowRight, 
  BarChart, PieChart, Activity, UserPlus, ChevronDown,
  ShieldCheck, Briefcase, Mail, Smartphone, Search,
  CheckCircle2, Loader2, X, Plus, Sparkles, Percent
} from 'lucide-react';

export const AdminRepManagement: React.FC = () => {
  const [reps, setReps] = useState<User[]>([]);
  const [repStats, setRepStats] = useState<Record<string, any>>({});
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  const [formData, setFormData] = useState({
    businessName: 'Platform Zero Rep',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    role: UserRole.PZ_REP,
    commission: '5'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allReps = mockService.getPzRepresentatives();
    setReps(allReps);
    const stats: Record<string, any> = {};
    allReps.forEach(rep => {
        stats[rep.id] = mockService.getRepStats(rep.id);
    });
    setRepStats(stats);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const invite = mockService.createManualPortalInvite({
        ...formData,
        commissionRate: parseFloat(formData.commission)
    });
    setGeneratedCode(invite.code);
    setIsSubmitting(false);
    loadData();
  };

  const totalCommissions = Object.values(repStats).reduce((sum, s: any) => sum + s.commissionMade, 0);
  const totalSales = Object.values(repStats).reduce((sum, s: any) => sum + s.totalSales, 0);
  const activeLeads = Object.values(repStats).reduce((sum, s: any) => sum + s.customerCount, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase leading-none">Team & Performance</h1>
          <p className="text-gray-500 font-bold mt-2 uppercase text-[10px] tracking-widest">Overseeing Sales Consultants & Network Growth</p>
        </div>
        <button 
            onClick={() => { setGeneratedCode(''); setIsInviteModalOpen(true); }}
            className="px-8 py-4 bg-[#043003] text-white rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"
        >
            <UserPlus size={20}/> Provision New Rep
        </button>
      </div>

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2">
        {[
            { label: 'Team Sales', value: `$${totalSales.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Commissions Paid', value: `$${totalCommissions.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Active Reps', value: reps.length, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Market Leads', value: activeLeads, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' }
        ].map((kpi, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between h-44 group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                    <div className={`p-3 ${kpi.bg} ${kpi.color} rounded-2xl group-hover:scale-110 transition-transform shadow-inner-sm`}><kpi.icon size={22} /></div>
                </div>
                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{kpi.value}</h3>
            </div>
        ))}
      </div>

      {/* Rep Leaderboard Table */}
      <div className="bg-white rounded-[3rem] border border-gray-200 shadow-sm overflow-hidden mx-2">
          <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-yellow-500 shadow-sm border border-gray-100">
                    <Award size={24}/>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Performance Leaderboard</h2>
              </div>
              <div className="flex gap-3">
                  <div className="relative group hidden lg:block">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                      <input placeholder="Filter team..." className="pl-11 pr-6 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50/10 transition-all"/>
                  </div>
              </div>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead className="bg-white border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                      <tr>
                          <th className="px-10 py-8">Consultant Identity</th>
                          <th className="px-10 py-8 text-center">Lead Pipeline</th>
                          <th className="px-10 py-8 text-right">Aggregate Sales</th>
                          <th className="px-10 py-8 text-right">Commission Rate</th>
                          <th className="px-10 py-8 text-right text-emerald-600">Earned (YTD)</th>
                          <th className="px-10 py-8 text-center">Account Health</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {reps.map(rep => {
                          const stats = repStats[rep.id] || { customerCount: 0, totalSales: 0, commissionMade: 0 };
                          return (
                              <tr key={rep.id} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                                  <td className="px-10 py-8">
                                      <div className="flex items-center gap-5">
                                          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-700 font-black text-xl shadow-inner-sm border border-indigo-100/50 group-hover:scale-105 transition-transform">
                                              {rep.name.charAt(0)}
                                          </div>
                                          <div>
                                              <div className="font-black text-gray-900 text-base uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{rep.name}</div>
                                              <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{rep.email}</div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-10 py-8 text-center">
                                      <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 border border-gray-200">
                                          {stats.customerCount} Active Clients
                                      </span>
                                  </td>
                                  <td className="px-10 py-8 text-right font-black text-gray-900 text-lg tracking-tighter">
                                      ${stats.totalSales.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                  </td>
                                  <td className="px-10 py-8 text-right">
                                      <button className="font-black text-indigo-600 text-sm hover:underline decoration-2 underline-offset-4">
                                          {rep.commissionRate || 5}%
                                      </button>
                                  </td>
                                  <td className="px-10 py-8 text-right font-black text-emerald-600 text-xl tracking-tighter">
                                      ${stats.commissionMade.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                  </td>
                                  <td className="px-10 py-8">
                                      <div className="flex items-center justify-center gap-3">
                                          <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden shadow-inner-sm">
                                              <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{width: '85%'}}></div>
                                          </div>
                                          <span className="text-[10px] font-black text-emerald-600 uppercase">A+</span>
                                      </div>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
          </div>
      </div>

      {/* PROVISIONING MODAL */}
      {isInviteModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#0F172A]/80 backdrop-blur-md p-4">
              <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 flex flex-col max-h-[95vh]">
                  <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#043003] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">P</div>
                          <div>
                            <h2 className="text-2xl font-black text-[#0F172A] tracking-tighter leading-none uppercase">Provision Account</h2>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] mt-1.5">Consultant Onboarding Hub</p>
                          </div>
                      </div>
                      <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-300 hover:text-gray-900 transition-colors p-2 bg-white rounded-full shadow-sm"><X size={24} /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                      {!generatedCode ? (
                        <form onSubmit={handleInvite} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Assign Commission Rate (%)</label>
                                    <div className="relative group">
                                        <Percent size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors"/>
                                        <input 
                                            required 
                                            type="number" 
                                            step="0.1"
                                            className="w-full pl-14 pr-6 py-6 bg-gray-50 border-2 border-transparent rounded-[1.75rem] font-black text-4xl text-gray-900 outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-inner-sm"
                                            value={formData.commission}
                                            onChange={e => setFormData({...formData, commission: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 outline-none focus:bg-white" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 outline-none focus:bg-white" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Consultant Mobile (SMS Provisioning)</label>
                                    <input required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 outline-none focus:bg-white" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Corporate Email</label>
                                    <input required type="email" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-900 outline-none focus:bg-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                                </div>
                            </div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-6 bg-[#043003] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={24}/> : <><Sparkles size={22}/> Generate Rep Portal Access</>}
                            </button>
                        </form>
                      ) : (
                          <div className="text-center space-y-10 py-10 animate-in zoom-in-95">
                              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner-sm">
                                  <ShieldCheck size={48} />
                              </div>
                              <div>
                                  <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">Rep Ready</h3>
                                  <p className="text-gray-500 font-medium">Access code generated for <span className="font-black text-gray-900">{formData.firstName}</span>. Send via secure SMS below.</p>
                              </div>
                              <div className="bg-gray-50 border-4 border-dashed border-gray-200 p-10 rounded-[3rem] shadow-inner-sm">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Secure Invite Code</p>
                                  <p className="text-6xl font-black text-indigo-600 font-mono tracking-tighter">{generatedCode}</p>
                              </div>
                              <div className="flex flex-col gap-4">
                                  <button onClick={() => triggerNativeSms(formData.mobile, `Hi ${formData.firstName}! You've been provisioned as a PZ Sales Rep. Use code ${generatedCode} at https://portal.platformzero.io to unlock your dashboard.`)} className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95">
                                      <Smartphone size={20}/> Dispatch Invite via SMS
                                  </button>
                                  <button onClick={() => setIsInviteModalOpen(false)} className="w-full py-4 bg-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all">Close Workspace</button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
