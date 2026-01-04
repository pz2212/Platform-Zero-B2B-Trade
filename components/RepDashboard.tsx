
import React, { useState, useEffect, useMemo } from 'react';
import { User, Order, Lead, LeadStatus } from '../types';
import { mockService } from '../services/mockDataService';
import { 
  TrendingUp, DollarSign, Clock, Users, Star, 
  LayoutGrid, Gavel, Wallet, MapPin, ArrowRight, Plus, 
  Smartphone, CheckCircle, ChevronRight, ArrowUpRight
} from 'lucide-react';

const STAGES: { id: LeadStatus, label: string, color: string }[] = [
  { id: 'DISCOVERY', label: 'Discovery', color: 'bg-blue-500' },
  { id: 'ENGAGEMENT', label: 'Engagement', color: 'bg-indigo-500' },
  { id: 'PROPOSAL', label: 'Proposal', color: 'bg-purple-500' },
  { id: 'CLOSING', label: 'Closing', color: 'bg-orange-500' },
  { id: 'ONBOARDED', label: 'Onboarded', color: 'bg-emerald-500' }
];

export const RepDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PIPELINE' | 'NETWORK' | 'LEDGER'>('OVERVIEW');
  const [data, setData] = useState({ leads: [] as Lead[], stats: { commissionMade: 0, commissionComing: 0, customerCount: 0, orders: [] as Order[] } });

  useEffect(() => {
    const load = () => setData({ 
      leads: mockService.getLeads(user.id), 
      stats: mockService.getRepStats(user.id) 
    });
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handleMove = (id: string, status: LeadStatus) => {
    const next = STAGES[STAGES.findIndex(s => s.id === status) + 1]?.id;
    if (next) { 
        mockService.updateLeadStatus(id, next); 
        setData(prev => ({ ...prev, leads: mockService.getLeads(user.id) })); 
    } else {
        alert("Lead has reached the final stage!");
    }
  };

  const handleAddLead = () => {
      const name = prompt("Enter Business Name:");
      if (!name) return;
      const val = prompt("Enter Estimated Monthly Value ($):", "5000");
      
      const newLead: Lead = {
          id: `l-${Date.now()}`,
          businessName: name,
          contactName: "New Contact",
          location: "Regional, AU",
          source: 'MANUAL',
          status: 'DISCOVERY',
          estimatedMonthlyValue: parseInt(val || "0"),
          lastActivityDate: new Date().toISOString(),
          assignedRepId: user.id
      };
      mockService.addLead(newLead);
      setData(prev => ({ ...prev, leads: mockService.getLeads(user.id) }));
  };

  const KpiCard = ({ label, value, sub, icon: Icon, color }: any) => (
    <div className="bg-[#131926] p-6 rounded-[1.5rem] border border-white/5 flex flex-col justify-between h-32 transition-transform hover:scale-[1.02]">
      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]" style={{ color }}>
        <Icon size={12} /> {label}
      </div>
      <div>
        <h3 className="text-2xl font-black text-white tracking-tighter mb-0.5">{value}</h3>
        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Compact Header */}
      <div className="bg-[#0B1221] text-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 border border-emerald-500/20">
                <Star size={10} className="fill-current" /> TOP PERFORMING CONSULTANT
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none mb-1">HELLO, {user.name.split(' ')[0]}</h1>
                <p className="text-slate-400 font-medium text-sm">Sales Representative <span className="text-emerald-400 font-black ml-2 uppercase">ID: PZ-CON-{user.id.split('-').pop()}</span></p>
            </div>
            <div className="flex gap-2">
                <button onClick={handleAddLead} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2">
                    <Plus size={14}/> Add New Lead
                </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard icon={CheckCircle} color="#34D399" label="Money Made" value={`$${data.stats.commissionMade.toFixed(2)}`} sub="Realized Commissions (YTD)" />
            <KpiCard icon={Clock} color="#FB923C" label="Money Coming" value={`$${data.stats.commissionComing.toFixed(2)}`} sub="Pending Settlement" />
            <KpiCard icon={Users} color="#60A5FA" label="Lead Pipeline" value={data.leads.length + data.stats.customerCount} sub="Opportunities Managed" />
          </div>
        </div>
      </div>

      <div className="bg-gray-100/50 p-1.5 rounded-3xl inline-flex border border-gray-200 shadow-inner-sm overflow-x-auto no-scrollbar max-w-full">
        {['OVERVIEW', 'PIPELINE', 'NETWORK', 'LEDGER'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)} 
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'PIPELINE' && (
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex gap-6 min-w-[1200px]">
            {STAGES.map(stage => (
              <div key={stage.id} className="flex-1 space-y-4">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-5 ${stage.color} rounded-full`} />
                    <h4 className="font-black text-gray-900 uppercase text-[10px] tracking-widest">{stage.label}</h4>
                  </div>
                  <span className="text-[10px] font-black text-gray-400">{data.leads.filter(l => l.status === stage.id).length}</span>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-[2rem] border border-gray-100/50 min-h-[500px] space-y-3">
                  {data.leads.filter(l => l.status === stage.id).map(lead => (
                    <div key={lead.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
                      <h5 className="font-black text-gray-900 uppercase text-xs truncate mb-4">{lead.businessName}</h5>
                      <div className="space-y-1.5 mb-6">
                        <p className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-2"><MapPin size={10}/> {lead.location}</p>
                        <p className="text-[10px] font-black text-indigo-600">${lead.estimatedMonthlyValue?.toLocaleString()} / mo</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleMove(lead.id, lead.status)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1">Advance <ArrowRight size={10}/></button>
                        <button onClick={() => alert(`Dialing ${lead.businessName}...`)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-indigo-600 transition-colors"><Smartphone size={14}/></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={handleAddLead} className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-300 rounded-3xl hover:border-indigo-300 hover:text-indigo-600 hover:bg-white transition-all"><Plus size={20} className="mx-auto"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2 animate-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center justify-between">
                <div className="flex items-center gap-3"><LayoutGrid size={20} className="text-indigo-600"/> High Value Targets</div>
                <button onClick={() => setActiveTab('PIPELINE')} className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">View Pipeline</button>
            </h3>
            <div className="space-y-4">
                {data.leads.sort((a,b) => (b.estimatedMonthlyValue || 0) - (a.estimatedMonthlyValue || 0)).slice(0, 3).map(l => (
                <div 
                    key={l.id} 
                    onClick={() => setActiveTab('PIPELINE')}
                    className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:border-indigo-100 transition-all cursor-pointer group"
                >
                    <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-700">{l.businessName.charAt(0)}</div>
                    <div><p className="font-black text-gray-900 uppercase text-sm">{l.businessName}</p><p className="text-[10px] text-gray-400 font-bold uppercase">{l.location}</p></div>
                    </div>
                    <div className="flex items-center gap-6">
                    <div className="text-right"><p className="text-[10px] font-black text-gray-300 uppercase">Pot. Revenue</p><p className="font-black text-emerald-600 text-lg">${l.estimatedMonthlyValue?.toLocaleString()}</p></div>
                    <ChevronRight size={20} className="text-gray-200 group-hover:text-indigo-600 translate-x-0 group-hover:translate-x-1 transition-all"/>
                    </div>
                </div>
                ))}
            </div>
          </div>
          
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-between min-h-[400px]">
            <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200">Active Commissions</h4>
                <div className="space-y-6">
                {data.stats.orders.length === 0 ? (
                    <p className="text-sm text-indigo-300 italic">No recent commissions logged.</p>
                ) : data.stats.orders.slice(0, 4).map(o => (
                    <div key={o.id} className="flex justify-between items-center border-b border-white/10 pb-4">
                    <div><p className="font-black uppercase text-xs truncate max-w-[120px]">REF: {o.id.split('-').pop()}</p><p className="text-[10px] text-indigo-300 font-medium">Order Settled</p></div>
                    <p className="font-black text-emerald-400 text-sm">+${(o.totalAmount * (user.commissionRate || 5) / 100).toFixed(2)}</p>
                    </div>
                ))}
                </div>
            </div>
            <button 
                onClick={() => setActiveTab('LEDGER')}
                className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 group"
            >
                Detailed Ledger <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'NETWORK' && (
          <div className="p-10 text-center bg-white rounded-[2.5rem] border border-gray-100">
              <Users size={48} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tight">Partner Network</h3>
              <p className="text-gray-400 text-sm mt-2">Manage your connected buyers and suppliers.</p>
              <button onClick={() => alert("Directory coming soon!")} className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Open Directory</button>
          </div>
      )}

      {activeTab === 'LEDGER' && (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                      <Wallet size={20} className="text-emerald-600"/> My Earnings Ledger
                  </h3>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-white text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                          <tr>
                              <th className="px-8 py-5">Date</th>
                              <th className="px-8 py-5">Order ID</th>
                              <th className="px-8 py-5 text-right">Commission</th>
                              <th className="px-8 py-5 text-right">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {data.stats.orders.map(o => (
                              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-8 py-5 text-xs font-bold text-gray-500">{new Date(o.date).toLocaleDateString()}</td>
                                  <td className="px-8 py-5 font-mono font-black text-[10px] text-indigo-600">#{o.id.split('-').pop()}</td>
                                  <td className="px-8 py-5 text-right font-black text-emerald-600 text-sm">+${(o.totalAmount * (user.commissionRate || 5) / 100).toFixed(2)}</td>
                                  <td className="px-8 py-5 text-right">
                                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${o.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                          {o.paymentStatus === 'Paid' ? 'Settled' : 'Pending'}
                                      </span>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  {data.stats.orders.length === 0 && (
                      <div className="py-20 text-center text-gray-300 uppercase font-black text-[10px] tracking-widest">No entries found</div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};
