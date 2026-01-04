
import React, { useState, useEffect, useMemo } from 'react';
import { User, Customer, Order, OrderIssue, UserRole } from '../types';
import { mockService } from '../services/mockDataService';
import { 
  Users, AlertCircle, CheckCircle, MessageSquare, TrendingUp, 
  DollarSign, Clock, Calendar, ChevronRight, Filter, Search,
  Briefcase, ArrowUpRight, ShieldCheck, Wallet, Activity,
  Target, BarChart3, Star, Info, MessageCircle, X, Check,
  Loader2, Gavel, LayoutGrid, FileWarning, Package, Store, MapPin, Image as ImageIcon, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RepDashboardProps {
  user: User;
}

export const RepDashboard: React.FC<RepDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'NETWORK' | 'COMMISSIONS' | 'DISPUTES'>('OVERVIEW');
  const [assignedCustomers, setAssignedCustomers] = useState<Customer[]>([]);
  const [activeIssues, setActiveIssues] = useState<Order[]>([]);
  /* Added missing state for active contact management */
  const [activeContact, setActiveContact] = useState<Customer | null>(null);
  const [stats, setStats] = useState<any>({
      totalSales: 0,
      commissionMade: 0,
      commissionComing: 0,
      customerCount: 0,
      orders: []
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const loadData = () => {
    const customers = mockService.getRepCustomers(user.id);
    setAssignedCustomers(customers);
    setActiveIssues(mockService.getRepIssues(user.id));
    setStats(mockService.getRepStats(user.id));
  };

  const commissionLog = useMemo(() => {
    if (!stats.orders) return [];
    return stats.orders.map((o: Order) => ({
      id: o.id,
      date: o.date,
      customerName: assignedCustomers.find(c => c.id === o.buyerId)?.businessName || 'Wholesale Client',
      amount: o.totalAmount,
      commission: o.totalAmount * ((user.commissionRate || 5) / 100),
      status: o.paymentStatus || 'Unpaid'
    })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [stats.orders, assignedCustomers, user.commissionRate]);

  const filteredNetwork = assignedCustomers.filter(c => 
    c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      
      {/* HEADER HERO */}
      <div className="bg-[#0B1221] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 transform rotate-12 scale-150 group-hover:scale-[1.8] transition-transform duration-700 pointer-events-none">
              <Briefcase size={200} className="text-emerald-400"/>
          </div>
          <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                  <div>
                      <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-500/30">
                          <Star size={14}/> Top Performing Consultant
                      </div>
                      <h1 className="text-5xl font-black tracking-tighter uppercase leading-none mb-2">Hello, {user.name.split(' ')[0]}</h1>
                      <p className="text-slate-400 font-medium text-lg">Sales Representative <span className="text-emerald-400 font-black ml-2">ID: PZ-CON-{user.id.split('-').pop()}</span></p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-white/10 flex flex-col items-end">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Contracted Commission</p>
                      <h4 className="text-4xl font-black text-emerald-400 tracking-tighter">{user.commissionRate || 5}%</h4>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/5 p-8 rounded-[2rem] backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all group/card">
                      <div className="flex items-center gap-3 text-emerald-300 mb-6 font-black text-[10px] uppercase tracking-[0.2em]">
                          <CheckCircle size={18}/> Money Made
                      </div>
                      <div className="text-5xl font-black tracking-tighter mb-2 group-hover/card:scale-105 transition-transform origin-left">
                          ${stats.commissionMade.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Realized Commissions (YTD)</div>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[2rem] backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all group/card">
                      <div className="flex items-center gap-3 text-orange-300 mb-6 font-black text-[10px] uppercase tracking-[0.2em]">
                          <Clock size={18}/> Money Coming
                      </div>
                      <div className="text-5xl font-black tracking-tighter mb-2 group-hover/card:scale-105 transition-transform origin-left">
                          ${stats.commissionComing.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pending Settlement</div>
                  </div>

                  <div className="bg-white/5 p-8 rounded-[2rem] backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all group/card">
                      <div className="flex items-center gap-3 text-blue-300 mb-6 font-black text-[10px] uppercase tracking-[0.2em]">
                          <Users size={18}/> Lead Pipeline
                      </div>
                      <div className="text-5xl font-black tracking-tighter mb-2 group-hover/card:scale-105 transition-transform origin-left">
                          {stats.customerCount}
                      </div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Marketplace Buyers Managed</div>
                  </div>
              </div>
          </div>
      </div>

      {/* WORKSPACE TABS */}
      <div className="bg-gray-100/50 p-2 rounded-[2.25rem] inline-flex border border-gray-200 shadow-inner-sm mx-2 overflow-x-auto no-scrollbar max-w-full">
          {[
              { id: 'OVERVIEW', label: 'Consultant Workspace', icon: LayoutGrid },
              { id: 'NETWORK', label: 'My Client Network', icon: Users },
              { id: 'COMMISSIONS', label: 'Commission Ledger', icon: Wallet },
              { id: 'DISPUTES', label: 'Client Disputes', icon: Gavel, badge: activeIssues.length }
          ].map(tab => (
              <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-12 py-5 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-[#043003] shadow-xl ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-700'}`}
              >
                  <tab.icon size={18}/> {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && <span className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">{tab.badge}</span>}
              </button>
          ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 px-2">
              {/* Critical Disputes Panel */}
              <div className="lg:col-span-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                        <AlertCircle className="text-orange-500" size={28}/> Critical Resolution Deck
                    </h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeIssues.length} ACTIVE DISPUTES</span>
                  </div>
                  
                  {activeIssues.length === 0 ? (
                      <div className="bg-white p-20 rounded-[3rem] shadow-sm border-2 border-dashed border-gray-100 text-center flex flex-col items-center">
                          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-inner-sm">
                            <CheckCircle size={40} strokeWidth={2.5}/>
                          </div>
                          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">System Settlement: Clear</h3>
                          <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto mt-2">All client deliveries for this period have been verified without variance reports.</p>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {activeIssues.map(order => {
                            const customer = assignedCustomers.find(c => c.id === order.buyerId);
                            return (
                                <div key={order.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-red-100 hover:shadow-2xl transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 transform rotate-12 group-hover:scale-110 transition-transform"><FileWarning size={120} className="text-red-500"/></div>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner-sm border border-red-100">
                                                {customer?.businessName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-900 text-2xl uppercase tracking-tighter group-hover:text-red-600 transition-colors">{customer?.businessName}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase">{order.issue?.type}</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">INV-REF: {order.id.split('-').pop()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Reported</p>
                                            <div className="flex items-center gap-2 font-black text-xl text-gray-900 tracking-tighter">
                                                <Clock size={16} className="text-orange-500"/>
                                                {new Date(order.issue?.reportedAt!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 bg-gray-50/80 p-6 rounded-[2rem] border border-gray-100 relative group-hover:bg-white group-hover:border-red-50 transition-all">
                                        <p className="text-gray-700 font-bold text-lg leading-relaxed">
                                            "{order.issue?.description}"
                                        </p>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-gray-100 flex gap-3">
                                        <button className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                                            <MessageCircle size={18}/> Chat Supplier
                                        </button>
                                        <button className="flex-[2] py-4 bg-[#0F172A] hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95">
                                            Mediate Dispute <ChevronRight size={18} strokeWidth={3}/>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                      </div>
                  )}
              </div>

              {/* Sidebar Actions */}
              <div className="lg:col-span-4 space-y-8">
                  <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-10 opacity-10 transform rotate-12 scale-150 group-hover:rotate-0 transition-transform duration-700 pointer-events-none"><Target size={120}/></div>
                      <div className="relative z-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-8">Consultant Performance</h4>
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="font-black uppercase tracking-widest text-indigo-100 text-[10px]">Monthly Sales Goal</span>
                                    <span className="font-black text-xl tracking-tighter">$42k / $50k</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden shadow-inner-sm">
                                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{width: '84%'}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-3">
                                    <span className="font-black uppercase tracking-widest text-indigo-100 text-[10px]">New Account Activation</span>
                                    <span className="font-black text-xl tracking-tighter">8 / 10</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden shadow-inner-sm">
                                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{width: '80%'}}></div>
                                </div>
                            </div>
                        </div>
                        <button className="mt-12 w-full py-4 bg-white text-indigo-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-50 transition-all active:scale-95">Analyze Trends <ArrowUpRight size={16} className="inline ml-2"/></button>
                      </div>
                  </div>

                  <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                      <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Client Activity</h4>
                      <div className="space-y-6">
                        {commissionLog.slice(0, 4).map((log: any) => (
                            <div key={log.id} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all border border-gray-100">
                                        <Package size={18}/>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-900 uppercase truncate max-w-[120px]">{log.customerName}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Processed</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-emerald-600">+${log.commission.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                      </div>
                      <button onClick={() => setActiveTab('COMMISSIONS')} className="mt-10 w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">View All Entries</button>
                  </div>
              </div>
          </div>
      )}

      {/* TAB CONTENT: NETWORK */}
      {activeTab === 'NETWORK' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 px-2">
              <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-600 transition-colors" size={24}/>
                    <input 
                        placeholder="Search your client network..." 
                        className="w-full pl-16 pr-8 py-6 bg-white border-2 border-gray-100 rounded-[2.5rem] font-bold text-lg outline-none focus:border-indigo-500 shadow-sm transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="px-12 py-6 bg-white border-2 border-gray-100 rounded-[2.5rem] text-gray-400 font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 hover:border-gray-200 transition-all">
                    <Filter size={20}/> Advanced Matrix
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredNetwork.map(customer => (
                      <div key={customer.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between h-[420px] animate-in zoom-in-95 duration-300">
                          <div>
                            <div className="flex justify-between items-start mb-8">
                                <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-3xl shadow-inner-sm border border-indigo-100/50 group-hover:scale-105 transition-transform">{customer.businessName.charAt(0)}</div>
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${customer.connectionStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                                    {customer.connectionStatus}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter group-hover:text-indigo-600 mb-1 uppercase leading-none transition-colors">{customer.businessName}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">{customer.category}</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50/80 rounded-[1.5rem] border border-gray-100 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                                    <Store size={20} className="text-indigo-400 shrink-0"/>
                                    <p className="text-xs font-black text-gray-900 uppercase truncate">Anchor: {customer.connectedSupplierName}</p>
                                </div>
                                <div className="flex items-center gap-4 px-4 text-xs text-gray-500 font-bold uppercase tracking-tight">
                                    <MapPin size={16} className="text-gray-300"/>
                                    <span className="truncate">{customer.location}</span>
                                </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-8">
                              <button className="flex-1 py-4 bg-white border-2 border-indigo-100 text-indigo-600 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-indigo-600 hover:text-white shadow-sm active:scale-95">Portfolio</button>
                              <button onClick={() => { setActiveContact(customer as any); setActiveTab('OVERVIEW'); }} className="flex-[2] py-4 bg-[#0F172A] text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-black shadow-xl active:scale-95 flex items-center justify-center gap-2">Manage Trade</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* TAB CONTENT: COMMISSIONS */}
      {activeTab === 'COMMISSIONS' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-2">
              <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[600px]">
                <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-gray-100">
                            <Wallet size={24}/>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Commission Activity Log</h2>
                    </div>
                    <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm"><Download size={16}/> Export Statement</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-10 py-8">Trade Date</th>
                                <th className="px-10 py-8">Order ID</th>
                                <th className="px-10 py-8">Client Entity</th>
                                <th className="px-10 py-8 text-right">Order Value</th>
                                <th className="px-10 py-8 text-right text-emerald-600">My Share ({user.commissionRate}%)</th>
                                <th className="px-10 py-8 text-right">Settlement Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {commissionLog.map((log: any) => (
                                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-7 text-sm font-bold text-gray-400">{new Date(log.date).toLocaleDateString()}</td>
                                    <td className="px-10 py-7 font-mono font-black text-xs text-indigo-600 uppercase tracking-tighter">INV-{log.id.split('-').pop()}</td>
                                    <td className="px-10 py-7 font-black text-gray-900 text-sm uppercase tracking-tight">{log.customerName}</td>
                                    <td className="px-10 py-7 text-right font-black text-gray-400 text-base">${log.amount.toFixed(2)}</td>
                                    <td className="px-10 py-7 text-right font-black text-emerald-600 text-lg tracking-tighter">+${log.commission.toFixed(2)}</td>
                                    <td className="px-10 py-7 text-right">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                            log.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>
                                            {log.status === 'Paid' ? 'SETTLED' : 'PENDING'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>
          </div>
      )}

      {/* TAB CONTENT: DISPUTES */}
      {activeTab === 'DISPUTES' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-2">
              <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-10 flex items-start gap-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 transform rotate-12 scale-150"><Gavel size={200} className="text-red-900"/></div>
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-red-600 shadow-xl border border-red-50 shrink-0 relative z-10"><Gavel size={32} strokeWidth={2.5}/></div>
                  <div className="relative z-10">
                      <h3 className="text-2xl font-black text-red-900 uppercase tracking-tight mb-2">Network Dispute Mediation</h3>
                      <p className="text-red-700 text-lg font-medium leading-relaxed max-w-3xl">As a PZ Representative, your role is to verify the legitimacy of produce quality reports. Review the evidence provided by your buyers and coordinate with wholesalers for immediate remediation or credit issuance.</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {activeIssues.map(issue => (
                      <div key={issue.id} className="bg-white border-2 border-red-50 rounded-[3rem] p-8 hover:border-red-200 hover:shadow-2xl transition-all duration-500 group animate-in zoom-in-95">
                          <div className="flex justify-between items-start mb-10">
                              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 font-black text-xl shadow-inner-sm group-hover:scale-105 transition-transform">
                                  {assignedCustomers.find(c => c.id === issue.buyerId)?.businessName.charAt(0)}
                              </div>
                              <span className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm animate-pulse">ACTION REQUIRED</span>
                          </div>
                          <h3 className="font-black text-gray-900 text-2xl uppercase tracking-tighter leading-none mb-2">{assignedCustomers.find(c => c.id === issue.buyerId)?.businessName}</h3>
                          <div className="flex items-center gap-4 mb-10">
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> Reported {new Date(issue.issue?.reportedAt!).toLocaleTimeString()}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Wholesaler: {mockService.getAllUsers().find(u => u.id === issue.sellerId)?.businessName}</span>
                          </div>
                          <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 mb-10 min-h-[120px] flex flex-col justify-center italic">
                              <p className="text-gray-600 font-bold">"{issue.issue?.description}"</p>
                          </div>
                          <div className="flex gap-3">
                              <button className="flex-1 py-4 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"><ImageIcon size={18}/> View Evidence</button>
                              <button className="flex-[2] py-4 bg-[#0F172A] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 active:scale-95">Resolve Case</button>
                          </div>
                      </div>
                  ))}
                  {activeIssues.length === 0 && (
                      <div className="col-span-full py-40 text-center opacity-30 grayscale">
                          <CheckCircle size={80} className="mx-auto mb-6 text-gray-300"/>
                          <p className="text-lg font-black uppercase tracking-[0.2em] text-gray-400">No active network disputes</p>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

const Download = ({ size = 24, ...props }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
