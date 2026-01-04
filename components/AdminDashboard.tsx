
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { InventoryItem, User, UserRole, Order, Customer, Product } from '../types';
import { mockService } from '../services/mockDataService';
import { 
  LayoutDashboard, ShoppingCart, DollarSign, Box, Users, 
  ArrowRight, Store, Search, MoreVertical, CheckCircle, TrendingUp,
  Leaf, Activity, Globe, Zap, Clock, Package, ChevronRight, X,
  Eye, Pencil, Percent, Settings, UserPlus, FileText, ChevronDown,
  UserCheck, AlertTriangle, Wallet, BarChart3, TrendingDown, Info, Loader2,
  Filter, ArrowLeft, Receipt, ChevronUp, History, ClipboardList, Truck,
  MapPin, Calendar, CheckCircle2, Timer, Briefcase, UserCog,
  Sprout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type DrillDownType = 'ORDERS' | 'WHOLESALERS' | 'REVENUE' | 'LEDGER' | null;
type RoleFilterType = 'ALL' | 'BUYER' | 'SUPPLIER' | 'STAFF';

const CustomerOpsModal = ({ isOpen, onClose, customer, allOrders, products, allUsers }: { 
    isOpen: boolean, 
    onClose: () => void, 
    customer: Customer | null, 
    allOrders: Order[], 
    products: Product[],
    allUsers: User[]
}) => {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

    if (!isOpen || !customer) return null;

    const customerOrders = allOrders.filter(o => o.buyerId === customer.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const supplier = allUsers.find(u => u.id === customer.connectedSupplierId);

    const getStatusSteps = (order: Order) => {
        return [
            { label: 'Logged', time: order.date, icon: ClipboardList, color: 'text-indigo-500' },
            { label: 'Accepted', time: order.confirmedAt, icon: UserCheck, color: 'text-blue-500' },
            { label: 'Packed', time: order.packedAt, icon: Package, color: 'text-purple-500' },
            { label: 'Shipped', time: order.shippedAt, icon: Truck, color: 'text-sky-500' },
            { label: 'Delivered', time: order.deliveredAt, icon: CheckCircle2, color: 'text-emerald-500' }
        ];
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 border-4 border-white/20">
                <div className="p-8 md:p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-600 rounded-[1.75rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-100">
                            {customer.businessName.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-black uppercase tracking-tighter leading-none">{customer.businessName}</h2>
                            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                                <MapPin size={12}/> {customer.location || 'Market Location'} • <Store size={12}/> Supplier: {supplier?.businessName || 'Platform Zero Network'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white hover:bg-gray-100 rounded-full border border-gray-100 shadow-sm transition-all text-black">
                        <X size={28} strokeWidth={2.5}/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar space-y-10 bg-white">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200">
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-1">Lifetime Trade</p>
                            <p className="text-xl font-black text-black tracking-tighter">${customerOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200">
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-1">Active Run(s)</p>
                            <p className="text-xl font-black text-indigo-700 tracking-tighter">{customerOrders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length}</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200">
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-1">Profit</p>
                            <p className="text-xl font-black text-emerald-700 tracking-tighter">${(customerOrders.reduce((sum, o) => sum + o.totalAmount, 0) * ((customer.pzMarkup || 15)/100)).toFixed(0)}</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-3xl border border-gray-200">
                            <p className="text-[9px] font-black text-black uppercase tracking-widest mb-1">Margin Tier</p>
                            <p className="text-xl font-black text-black tracking-tighter">{customer.pzMarkup || 15}%</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-black uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                            <History size={18} className="text-indigo-500"/> Order Fulfillment Timeline
                        </h3>

                        {customerOrders.length === 0 ? (
                            <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                                <Package size={48} className="mx-auto text-gray-200 mb-4"/>
                                <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No orders found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {customerOrders.map(order => {
                                    const isExpanded = expandedOrderId === order.id;
                                    const steps = getStatusSteps(order);
                                    const currentSupplier = allUsers.find(u => u.id === order.sellerId);

                                    return (
                                        <div key={order.id} className={`bg-white rounded-[2rem] border transition-all overflow-hidden ${isExpanded ? 'border-gray-900 shadow-xl' : 'border-gray-100 hover:border-indigo-200 shadow-sm'}`}>
                                            <div 
                                                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                                className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer"
                                            >
                                                <div className="flex items-center gap-6 flex-1">
                                                    <div className={`p-4 rounded-2xl shadow-inner-sm border ${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                                        <ShoppingCart size={24}/>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-black text-lg tracking-tight uppercase leading-none mb-1.5">INV-{order.id.split('-').pop()}</h4>
                                                        <p className="text-[10px] text-black font-black uppercase tracking-widest">Logged: {new Date(order.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-10">
                                                    <div className="text-right">
                                                        <p className="text-[8px] font-black text-black uppercase tracking-widest mb-1">Status</p>
                                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border tracking-widest shadow-sm ${
                                                            order.status === 'Delivered' ? 'bg-emerald-600 text-white border-emerald-600' :
                                                            order.status === 'Confirmed' ? 'bg-blue-600 text-white border-blue-600' :
                                                            'bg-orange-600 text-white border-orange-600'
                                                        }`}>{order.status}</span>
                                                    </div>
                                                    <div className="text-right w-24">
                                                        <p className="text-[8px] font-black text-black uppercase tracking-widest mb-1">Amount</p>
                                                        <p className="text-xl font-black text-black tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                                                    </div>
                                                    <div className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
                                                        <ChevronDown size={20}/>
                                                    </div>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="bg-gray-50/50 border-t border-gray-100 p-8 space-y-10 animate-in slide-in-from-top-4 duration-300">
                                                    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-inner-sm">
                                                        <table className="w-full text-left">
                                                            <thead className="bg-gray-50 text-[9px] font-black text-black uppercase tracking-widest border-b border-gray-100">
                                                                <tr>
                                                                    <th className="px-6 py-4">Market Variety</th>
                                                                    <th className="px-6 py-4 text-center">Volume</th>
                                                                    <th className="px-6 py-4 text-right">Wholesale Rate</th>
                                                                    <th className="px-6 py-4 text-right">Subtotal</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-50">
                                                                {order.items.map((item, iIdx) => {
                                                                    const p = products.find(prod => prod.id === item.productId);
                                                                    return (
                                                                        <tr key={iIdx}>
                                                                            <td className="px-6 py-4">
                                                                                <div className="flex items-center gap-3">
                                                                                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                                                        <img src={p?.imageUrl} className="w-full h-full object-cover" />
                                                                                    </div>
                                                                                    <span className="font-black text-black text-xs uppercase tracking-tight">{p?.name || 'Unknown'}</span>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-6 py-4 text-center font-black text-black text-xs">{item.quantityKg}{p?.unit || 'kg'}</td>
                                                                            <td className="px-6 py-4 text-right font-black text-indigo-700 text-xs">${item.pricePerKg.toFixed(2)}</td>
                                                                            <td className="px-6 py-4 text-right font-black text-black text-sm">${(item.quantityKg * item.pricePerKg).toFixed(2)}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                            <tfoot className="bg-gray-900 font-black text-xs uppercase tracking-widest text-white">
                                                                <tr>
                                                                    <td colSpan={3} className="px-6 py-4 text-right">Invoice Total</td>
                                                                    <td className="px-6 py-4 text-right text-base tracking-tighter">${order.totalAmount.toFixed(2)}</td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                    <p className="text-[9px] font-black text-black uppercase tracking-[0.3em]">Protocol v3.2 High Visibility</p>
                    <button onClick={onClose} className="px-12 py-3.5 bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all">Close</button>
                </div>
            </div>
        </div>
    );
};

const RepAssignmentModal = ({ isOpen, onClose, customer, reps, onUpdate }: { isOpen: boolean, onClose: () => void, customer: Customer | null, reps: User[], onUpdate: () => void }) => {
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || !customer) return null;

    const handleAssign = async (repId: string) => {
        setIsSaving(true);
        mockService.updateCustomerRep(customer.id, repId);
        await new Promise(r => setTimeout(r, 600));
        setIsSaving(false);
        onUpdate();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-black uppercase tracking-tight">Assign Sales Rep</h2>
                        <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{customer.businessName}</p>
                    </div>
                    <button onClick={onClose} className="text-black hover:text-gray-600 p-2"><X size={24}/></button>
                </div>
                
                <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {reps.map(rep => (
                        <button 
                            key={rep.id}
                            onClick={() => handleAssign(rep.id)}
                            disabled={isSaving}
                            className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${customer.assignedPzRepId === rep.id ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-100 hover:border-indigo-100 bg-white'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${customer.assignedPzRepId === rep.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-black'}`}>
                                    {rep.name.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-black uppercase text-xs">{rep.name}</p>
                                    <p className="text-[10px] text-black font-black uppercase tracking-widest">Platform Rep</p>
                                </div>
                            </div>
                            {customer.assignedPzRepId === rep.id && <CheckCircle size={20} className="text-indigo-600"/>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MarkupEditorModal = ({ isOpen, onClose, customer, onUpdate }: { isOpen: boolean, onClose: () => void, customer: Customer | null, onUpdate: () => void }) => {
    const [markup, setMarkup] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (customer) setMarkup((customer.pzMarkup || 15).toString());
    }, [customer]);

    if (!isOpen || !customer) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        mockService.updateCustomerMarkup(customer.id, parseFloat(markup));
        await new Promise(r => setTimeout(r, 600));
        setIsSaving(false);
        onUpdate();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-black uppercase tracking-tight">Configure PZ Markup</h2>
                        <p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">{customer.businessName}</p>
                    </div>
                    <button onClick={onClose} className="text-black hover:text-gray-600 p-2"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleSave} className="p-10 space-y-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-black uppercase tracking-widest mb-3 ml-1">Platform Sales Margin (%)</label>
                            <div className="relative group">
                                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-black group-focus-within:text-emerald-500 transition-colors" size={24}/>
                                <input 
                                    required 
                                    type="number" 
                                    step="0.1"
                                    className="w-full pl-14 pr-6 py-6 bg-gray-50 border-2 border-gray-200 rounded-[1.75rem] font-black text-4xl text-black outline-none focus:bg-white focus:border-emerald-500 transition-all shadow-inner-sm" 
                                    value={markup} 
                                    onChange={e => setMarkup(e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-5 bg-[#043003] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={20}/> : <><CheckCircle size={20}/> Update Logic</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    gmv: 0,
    ordersToday: 0,
    wholesalers: 0,
    wasteDiverted: 0,
    co2Saved: 0
  });
  const [activeDrillDown, setActiveDrillDown] = useState<DrillDownType>(null);
  const [drillDownCustomerId, setDrillDownCustomerId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [pzReps, setPzReps] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>('ALL');

  // Modal States
  const [editingMarkupCustomer, setEditingMarkupCustomer] = useState<Customer | null>(null);
  const [editingRepCustomer, setEditingRepCustomer] = useState<Customer | null>(null);
  const [viewingOpsCustomer, setViewingOpsCustomer] = useState<Customer | null>(null);

  const loadStats = () => {
      const orders = mockService.getOrders('u1');
      const users = mockService.getAllUsers();
      const products = mockService.getAllProducts();
      const customersList = mockService.getCustomers();
      const reps = mockService.getPzRepresentatives();
      
      setAllOrders(orders);
      setAllProducts(products);
      setPzReps(reps);
      setAllUsers(users);
      
      const today = new Date().toDateString();
      const todaysOrders = orders.filter(o => new Date(o.date).toDateString() === today);
      const totalGmv = orders.reduce((sum, o) => sum + o.totalAmount, 0);
      const wholesalers = users.filter(u => u.role === UserRole.WHOLESALER);

      let totalWaste = 0;
      let totalCo2 = 0;
      orders.forEach(order => {
          order.items.forEach(item => {
              const p = products.find(prod => prod.id === item.productId);
              totalWaste += item.quantityKg;
              totalCo2 += item.quantityKg * (p?.co2SavingsPerKg || 0.8);
          });
      });
      
      setStats({
        gmv: totalGmv,
        ordersToday: todaysOrders.length,
        wholesalers: wholesalers.length,
        wasteDiverted: totalWaste,
        co2Saved: totalCo2
      });
      setCustomers(customersList);
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const financials = useMemo(() => {
    const map: Record<string, { orders: number, outstanding: number, ltv: number, profit: number }> = {};
    allOrders.forEach(o => {
        if (!map[o.buyerId]) map[o.buyerId] = { orders: 0, outstanding: 0, ltv: 0, profit: 0 };
        const m = map[o.buyerId];
        m.orders += 1;
        m.ltv += o.totalAmount;
        if (o.paymentStatus !== 'Paid') m.outstanding += o.totalAmount;
        const customer = customers.find(c => c.id === o.buyerId);
        m.profit += o.totalAmount * ((customer?.pzMarkup || 15) / 100);
    });
    return map;
  }, [allOrders, customers]);

  const unifiedDirectory = useMemo(() => {
    return allUsers.map(u => {
        const custData = customers.find(c => c.id === u.id);
        const financialData = financials[u.id] || { orders: 0, outstanding: 0, ltv: 0, profit: 0 };
        return { ...u, ...custData, ...financialData, businessName: u.businessName || u.name };
    }).filter(e => {
        const matchesSearch = e.businessName.toLowerCase().includes(searchTerm.toLowerCase());
        if (roleFilter === 'BUYER') return matchesSearch && (e.role === UserRole.CONSUMER || e.role === UserRole.GROCERY);
        if (roleFilter === 'SUPPLIER') return matchesSearch && (e.role === UserRole.WHOLESALER || e.role === UserRole.FARMER);
        if (roleFilter === 'STAFF') return matchesSearch && (e.role === UserRole.ADMIN || e.role === UserRole.PZ_REP);
        return matchesSearch;
    });
  }, [allUsers, customers, financials, searchTerm, roleFilter]);

  const handleKpiClick = (id: string) => {
    if (id === 'IMPACT') navigate('/impact');
    else setActiveDrillDown(id as DrillDownType);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tight uppercase leading-none">HQ Control Center</h1>
          <p className="text-black font-black text-xs mt-2 uppercase tracking-widest">Marketplace Oversight Protocol</p>
        </div>
      </div>

      {/* KPI METRICS - FORCED BLACK TEXT */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[
            { id: 'ORDERS', label: 'Orders Today', value: stats.ordersToday, icon: Activity, color: 'text-black', bg: 'bg-blue-100', desc: 'LIVE VOLUME' },
            { id: 'WHOLESALERS', label: 'Network Nodes', value: stats.wholesalers, icon: Globe, color: 'text-black', bg: 'bg-indigo-100', desc: 'ACTIVE PARTNERS' },
            { id: 'REVENUE', label: 'Market GMV', value: `$${stats.gmv.toLocaleString()}`, icon: DollarSign, color: 'text-black', bg: 'bg-emerald-100', desc: 'PLATFORM REVENUE' },
            { id: 'IMPACT', label: 'Eco Recovery', value: `${stats.wasteDiverted}kg`, icon: Leaf, color: 'text-black', bg: 'bg-emerald-100', desc: 'LANDFILL BYPASS' }
        ].map((kpi, idx) => (
            <button 
              key={idx} 
              onClick={() => handleKpiClick(kpi.id)}
              className="text-left bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all relative overflow-hidden active:scale-[0.98]"
            >
                <div>
                    <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
                    <p className="text-[8px] md:text-[9px] font-black text-black opacity-40 uppercase tracking-widest mb-4">{kpi.desc}</p>
                </div>
                <div className="flex justify-between items-end">
                    <h3 className="text-2xl md:text-4xl font-black text-black tracking-tighter">{kpi.value}</h3>
                    <div className={`p-2.5 ${kpi.bg} ${kpi.color} rounded-2xl group-hover:scale-110 transition-transform shadow-inner-sm border border-white/50`}><kpi.icon size={22} strokeWidth={3} /></div>
                </div>
            </button>
        ))}
      </div>

      {/* DIRECTORY - FORCED BLACK TEXT */}
      <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-8 border-b-2 border-gray-100 bg-gray-50 flex flex-col xl:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-black shadow-md border border-gray-200 shrink-0">
                    <Store size={32} strokeWidth={3}/>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-black tracking-tight uppercase leading-none">Global Registry</h2>
                    <p className="text-[10px] text-black font-black uppercase tracking-widest mt-2">Managing {allUsers.length} platform nodes</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black group-focus-within:text-indigo-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search registry..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border-2 border-gray-200 rounded-[1.25rem] text-sm font-black text-black focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm" 
                    />
                </div>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white border-b-2 border-gray-100 text-[10px] font-black text-black uppercase tracking-[0.25em]">
                    <tr>
                        <th className="px-8 py-8 min-w-[220px]">Market Entity</th>
                        <th className="px-8 py-8">Role</th>
                        <th className="px-8 py-8">Connected Partner</th>
                        <th className="px-8 py-8 text-right">PZ Margin</th>
                        <th className="px-8 py-8 text-right">LTV</th>
                        <th className="px-8 py-8 text-right text-emerald-700">Profit</th>
                        <th className="px-8 py-8 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-50">
                    {unifiedDirectory.map(entity => (
                        <tr key={entity.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setViewingOpsCustomer(entity as any)}>
                            <td className="px-8 py-7">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-gray-100 text-black border-2 border-gray-200">
                                        {entity.businessName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-black text-black text-base uppercase tracking-tight leading-none group-hover:text-indigo-700 transition-colors">{entity.businessName}</div>
                                        <div className="text-[9px] text-black font-black uppercase tracking-widest mt-1.5 opacity-50">{entity.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-7">
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-black text-white border border-black">{entity.role}</span>
                            </td>
                            <td className="px-8 py-7">
                                <div className="font-black text-black text-sm uppercase tracking-tight truncate max-w-[140px]">{entity.connectedSupplierName || 'NETWORK SOURCE'}</div>
                            </td>
                            <td className="px-8 py-7 text-right">
                                <button className="font-black text-black text-base px-3 py-1.5 rounded-xl border-2 border-gray-200 hover:border-black transition-all">
                                    {entity.pzMarkup || 15}%
                                </button>
                            </td>
                            <td className="px-8 py-7 text-right">
                                <div className="font-black text-black text-base tracking-tighter">${entity.ltv.toLocaleString()}</div>
                            </td>
                            <td className="px-8 py-7 text-right">
                                <div className="font-black text-emerald-700 text-base tracking-tighter">${entity.profit.toFixed(0)}</div>
                            </td>
                            <td className="px-8 py-7 text-right">
                                <button className="p-3 bg-white border-2 border-gray-200 text-black hover:border-black rounded-xl transition-all"><ChevronRight size={18}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <MarkupEditorModal isOpen={!!editingMarkupCustomer} onClose={() => setEditingMarkupCustomer(null)} customer={editingMarkupCustomer} onUpdate={loadStats} />
      <RepAssignmentModal isOpen={!!editingRepCustomer} onClose={() => setEditingRepCustomer(null)} customer={editingRepCustomer} reps={pzReps} onUpdate={loadStats} />
      <CustomerOpsModal isOpen={!!viewingOpsCustomer} onClose={() => setViewingOpsCustomer(null)} customer={viewingOpsCustomer} allOrders={allOrders} products={allProducts} allUsers={allUsers} />
    </div>
  );
};
