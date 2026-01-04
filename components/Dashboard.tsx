
import React, { useState, useEffect, useRef } from 'react';
import { User, Order, Product, Customer, InventoryItem, Packer } from '../types';
import { mockService } from '../services/mockDataService';
import { AiOpportunityMatcher } from './AiOpportunityMatcher';
import { 
  Package, Truck, MapPin, LayoutDashboard, 
  Users, Clock, CheckCircle, X, 
  Settings, LayoutGrid, Search, Bell, History, 
  AlertTriangle, TrendingUp, Globe, Plus, 
  Store, Camera, Loader2, DollarSign, Activity,
  ChevronRight, ArrowLeft, ChevronDown, UserCheck,
  Send, Calendar, Timer, Printer, Info, Check, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

const SourcingModalV4 = ({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: any }) => {
    const [vol, setVol] = useState('0');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isSending, setIsSending] = useState(false);

    if (!isOpen || !product) return null;

    const handleSend = async () => {
        setIsSending(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsSending(false);
        alert("Sourcing Request Sent! The supplier will respond with a quote shortly.");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 md:p-10 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#5c56d6] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <Zap size={28} fill="currentColor" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight leading-none">SOURCING: {product.name}</h2>
                            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-2">DIRECT NETWORK SOURCING PROTOCOL</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-900 transition-colors p-1">
                        <X size={32} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="p-8 md:p-10 space-y-10 bg-white overflow-y-auto max-h-[60vh] md:max-h-[70vh] custom-scrollbar">
                    <div className="space-y-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Store size={16}/> 1. SELECT LIVE SUPPLY SOURCE
                        </h3>
                        <div className="p-6 bg-white border-2 border-indigo-500 rounded-[2rem] flex items-center justify-between shadow-xl shadow-indigo-50">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">G</div>
                                <div>
                                    <h4 className="font-black text-gray-900 text-lg uppercase tracking-tight leading-none">GREEN VALLEY FARMS</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">500KG AVAILABLE IN MARKET</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center border-2 border-indigo-200">
                                <Check size={18} strokeWidth={4}/>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                           <Plus size={16}/> 2. REQUEST DETAILS
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">VOLUME NEEDED (KG)</label>
                                <input 
                                    type="number" 
                                    className="w-full p-5 bg-gray-50 border-2 border-gray-50 rounded-3xl font-black text-3xl text-gray-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner-sm"
                                    value={vol}
                                    onChange={(e) => setVol(e.target.value)}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">REQUIRED DATE</label>
                                <div className="relative group">
                                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-200 group-focus-within:text-indigo-600 transition-colors" size={24}/>
                                    <input 
                                        type="date"
                                        className="w-full pl-16 pr-6 py-6 bg-gray-50 border-2 border-gray-50 rounded-3xl font-black text-xl text-gray-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner-sm"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">PREFERRED TIME WINDOW</label>
                            <input 
                                placeholder="e.g. 8:00 AM - 10:00 AM"
                                className="w-full p-5 bg-gray-50 border-2 border-gray-50 rounded-3xl font-bold text-lg text-gray-900 outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-inner-sm"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem] flex items-start gap-4">
                        <Info size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-indigo-800 font-bold leading-relaxed">
                            Sending this request will notify the supplier immediately. They will respond with a quote for your review.
                        </p>
                    </div>
                </div>

                <div className="p-8 md:p-10 border-t border-gray-100 bg-gray-50/50 flex gap-4 shrink-0">
                    <button onClick={onClose} className="flex-1 py-5 bg-white border-2 border-gray-100 text-gray-400 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:border-gray-200 transition-all">CANCEL</button>
                    <button 
                        onClick={handleSend}
                        disabled={isSending}
                        className="flex-[2] py-5 bg-[#8FA18F] hover:bg-[#043003] text-white rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 transition-all disabled:opacity-50"
                    >
                        {isSending ? <Loader2 className="animate-spin" size={20}/> : <><Send size={20}/> SEND SOURCING REQUEST</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'SCANNER'>('DASHBOARD');
  const [activeViewMode, setActiveViewMode] = useState<'OPS' | 'PROCUREMENT'>('OPS');
  const [orderSubTab, setOrderSubTab] = useState<'INCOMING' | 'PROCESSING' | 'ACTIVE' | 'HISTORY'>('INCOMING');
  
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [sourcingProduct, setSourcingProduct] = useState<any | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packers, setPackers] = useState<Packer[]>([]);
  const [marketStats, setMarketStats] = useState<any>({});

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const loadData = () => {
    const allSellingOrders = mockService.getOrders(user.id).filter(o => o.sellerId === user.id);
    const myInventory = mockService.getInventory(user.id);
    setOrders(allSellingOrders);
    setInventory(myInventory);
    setCustomers(mockService.getCustomers());
    setPackers(mockService.getPackers(user.id));
    
    const myTodaysOrders = allSellingOrders.filter(o => new Date(o.date).toDateString() === new Date().toDateString());
    const myRevenueToday = myTodaysOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    setMarketStats({
        ordersToday: myTodaysOrders.length,
        myRevenueToday,
        deliveriesOnRoad: allSellingOrders.filter(o => o.status === 'Shipped').length,
        todaysOrders: myTodaysOrders
    });
  };

  const handleAcceptOrder = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    mockService.acceptOrderV2(orderId);
    loadData();
    alert("Order Accepted! Added to processing queue.");
  };

  const handleAssignPacker = (orderId: string, packerName: string) => {
    mockService.packOrder(orderId, packerName);
    loadData();
    alert(`Order assigned to ${packerName} for priority packing.`);
  };

  const incomingQueue = orders.filter(o => o.status === 'Pending');
  const processingQueue = orders.filter(o => ['Confirmed', 'Ready for Delivery'].includes(o.status));
  const activeFulfillment = orders.filter(o => o.status === 'Shipped');
  const pastOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));
  const currentSellingList = orderSubTab === 'INCOMING' ? incomingQueue : orderSubTab === 'PROCESSING' ? processingQueue : orderSubTab === 'ACTIVE' ? activeFulfillment : pastOrders;

  const demandMatrix = [
      { id: 'dm1', name: 'ROMA TOMATOES', variety: 'TRUSS', onHand: 30, demand: 50, color: 'bg-orange-500', icon: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=100' },
      { id: 'dm2', name: 'ICEBERG LETTUCE', variety: 'CRISP', onHand: 80, demand: 50, color: 'bg-emerald-500', icon: 'https://images.unsplash.com/photo-1622206141855-8979313f8981?auto=format&fit=crop&q=80&w=100' },
      { id: 'dm3', name: 'BLACK EGGPLANT', variety: 'STANDARD', onHand: 0, demand: 10, color: 'bg-orange-500', icon: 'https://images.unsplash.com/photo-1528137858141-866416f91f75?auto=format&fit=crop&q=80&w=100' }
  ];

  return (
    <div className="animate-in fade-in duration-500 min-h-screen pb-20 bg-[#F8FAFC]">
      {/* HEADER SECTION */}
      <div className="mb-10 px-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
            <h1 className="text-[32px] md:text-[42px] font-black text-black tracking-tighter uppercase leading-none">Partner Operations</h1>
            <div className="flex items-center gap-4 mt-2">
                <p className="text-black font-black text-[10px] tracking-widest uppercase opacity-40">Management Console</p>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <p className="text-black font-black text-[10px] tracking-widest uppercase opacity-40">{user.businessName}</p>
                <div className="ml-4 bg-gray-100 p-1 rounded-lg flex border border-gray-200">
                    <button onClick={() => setActiveViewMode('OPS')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${activeViewMode === 'OPS' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Ops View</button>
                    <button onClick={() => setActiveViewMode('PROCUREMENT')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${activeViewMode === 'PROCUREMENT' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Procurement Hub</button>
                </div>
            </div>
        </div>
        
        <button 
            onClick={() => setCurrentView(currentView === 'DASHBOARD' ? 'SCANNER' : 'DASHBOARD')}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
            {currentView === 'SCANNER' ? <ArrowLeft size={18}/> : <Camera size={18}/>}
            {currentView === 'SCANNER' ? 'Return to Dashboard' : 'Visual Scanner'}
        </button>
      </div>

      {currentView === 'DASHBOARD' ? (
        <div className="space-y-10">
            {/* KPI METRICS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-2">
                {[
                    { label: 'Orders Today', value: marketStats.ordersToday || 0, icon: Activity, bg: 'bg-blue-50', color: 'text-blue-500' },
                    { label: 'Wholesalers', value: 2, icon: Globe, bg: 'bg-indigo-50', color: 'text-indigo-500' },
                    { label: 'On The Road', value: marketStats.deliveriesOnRoad || 0, icon: Truck, bg: 'bg-emerald-50', color: 'text-emerald-500' },
                    { label: 'Revenue', value: `$${marketStats.myRevenueToday || 0}`, icon: DollarSign, bg: 'bg-emerald-50', color: 'text-emerald-500' }
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between h-36 md:h-40">
                        <p className="text-[10px] font-black text-black opacity-40 uppercase tracking-widest">{kpi.label}</p>
                        <div className="flex justify-between items-end">
                            <h3 className="text-2xl md:text-4xl font-black text-black tracking-tighter leading-none">{kpi.value}</h3>
                            <div className={`p-2 md:p-3 ${kpi.bg} ${kpi.color} rounded-xl md:rounded-2xl`}><kpi.icon size={20} /></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* TWO COLUMN CONTENT AREA */}
            <div className="flex flex-col lg:flex-row gap-8 px-2">
                
                {/* SIDEBAR: DEMAND MATRIX */}
                <div className="w-full lg:w-[380px] bg-white rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 shadow-sm p-8 md:p-10 flex flex-col gap-10 h-fit">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><LayoutGrid size={24}/></div>
                        <div>
                            <h2 className="text-xl font-black text-black uppercase tracking-tight leading-none">Demand Matrix</h2>
                            <p className="text-[9px] text-black font-black opacity-40 uppercase tracking-widest mt-1.5">Inventory vs. Today's Fulfillment</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        {demandMatrix.map((item, idx) => (
                            <div key={idx} className="space-y-4 group">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                                            <img src={item.icon} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-black uppercase leading-none mb-1">{item.name}</h4>
                                            <p className="text-[9px] text-black font-black opacity-40 uppercase tracking-widest">{item.variety}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSourcingProduct(item)}
                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
                                    >
                                        <Plus size={16}/>
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-[8px] font-black text-black opacity-40 uppercase tracking-widest mb-1">On Hand</p>
                                        <p className="text-sm font-black text-black">{item.onHand}kg</p>
                                    </div>
                                    <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-50">
                                        <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Demand</p>
                                        <p className="text-sm font-black text-blue-600">{item.demand}kg</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                                            style={{ width: `${Math.min(100, (item.onHand / item.demand) * 100)}%` }}
                                        />
                                    </div>
                                    {item.onHand < item.demand && (
                                        <button 
                                            onClick={() => setSourcingProduct(item)}
                                            className="flex items-center gap-1.5 text-orange-600 hover:opacity-80 transition-colors animate-pulse w-full text-left font-black uppercase text-[9px] tracking-widest"
                                        >
                                            <AlertTriangle size={12} strokeWidth={3}/>
                                            STOCK DEFICIT IDENTIFIED • CLICK TO SOURCE
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MAIN: FULFILLMENT PIPELINE */}
                <div className="flex-1 bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                    <div className="p-6 md:p-10 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-8 bg-gray-50/30 shrink-0">
                        <div className="flex items-center gap-5">
                            <div className="w-12 md:w-14 h-12 md:h-14 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-black shadow-md"><History size={28}/></div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight leading-none">Fulfillment Pipeline</h2>
                                <p className="text-[10px] text-black font-black opacity-40 uppercase tracking-widest mt-2">Managing your direct sales trade flow</p>
                            </div>
                        </div>

                        <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1 border border-gray-200 shadow-inner-sm overflow-x-auto no-scrollbar w-full md:w-auto">
                            {[
                                { id: 'INCOMING', label: 'Incoming', count: incomingQueue.length, icon: Bell },
                                { id: 'PROCESSING', label: 'Processing', count: processingQueue.length, icon: Package },
                                { id: 'ACTIVE', label: 'Active Runs', count: activeFulfillment.length, icon: Truck },
                                { id: 'HISTORY', label: 'History', count: 0, icon: History }
                            ].map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setOrderSubTab(tab.id as any)}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${orderSubTab === tab.id ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <tab.icon size={16}/> {tab.label}
                                    {tab.count > 0 && <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">{tab.count}</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-6">
                        {currentSellingList.length === 0 ? (
                            <div className="py-20 md:py-40 text-center opacity-30 grayscale">
                                <CheckCircle size={80} className="mx-auto text-gray-300 mb-6" />
                                <p className="text-lg font-black uppercase tracking-[0.2em] text-gray-400">Queue Clear</p>
                            </div>
                        ) : currentSellingList.map(order => {
                            const buyer = customers.find(c => c.id === order.buyerId);
                            const isExpanded = expandedOrderId === order.id;
                            
                            return (
                                <div key={order.id} className={`bg-white rounded-[2.5rem] md:rounded-[3rem] border transition-all overflow-hidden ${isExpanded ? 'border-indigo-400 shadow-2xl' : 'border-gray-100 hover:border-blue-200 shadow-sm'}`}>
                                    {/* HEADER ROW */}
                                    <div 
                                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                        className="p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-8 cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-6 md:gap-8 flex-1 w-full">
                                            <div className="w-14 md:w-16 h-14 md:h-16 rounded-[1.5rem] md:rounded-[1.75rem] bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-black text-2xl shadow-inner-sm uppercase shrink-0">
                                                {buyer?.businessName.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight leading-none mb-3 truncate group-hover:text-indigo-600 transition-colors">{buyer?.businessName}</h4>
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{order.status}</span>
                                                    <span className="text-[9px] text-black font-black opacity-40 uppercase tracking-widest flex items-center gap-2">
                                                        <Clock size={14}/> LOGGED: {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 md:gap-10 w-full lg:w-auto justify-between lg:justify-end">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-black opacity-40 uppercase tracking-widest mb-1.5">TRADE TOTAL</p>
                                                <p className="text-3xl md:text-4xl font-black text-black tracking-tighter leading-none">${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            
                                            {order.status === 'Pending' ? (
                                                <button 
                                                    onClick={(e) => handleAcceptOrder(e, order.id)}
                                                    className="px-10 py-4 md:px-14 md:py-6 bg-[#043003] text-white rounded-[1.25rem] md:rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-[0.98]"
                                                >
                                                    ACCEPT ORDER
                                                </button>
                                            ) : (
                                                <div className={`p-4 rounded-2xl bg-gray-50 text-gray-300 transition-all ${isExpanded ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'group-hover:bg-indigo-50 group-hover:text-indigo-400'}`}>
                                                    <ChevronDown size={24} strokeWidth={3}/>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* DROPDOWN DETAIL VIEW */}
                                    {isExpanded && (
                                        <div className="p-6 md:p-10 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                {/* Left: Order Content */}
                                                <div className="space-y-6">
                                                    <h5 className="text-xs font-black text-black uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                                        <Package size={16} className="text-indigo-500"/> Order Manifest
                                                    </h5>
                                                    <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm">
                                                        <table className="w-full text-left">
                                                            <thead className="bg-gray-50 text-[10px] font-black text-black uppercase tracking-widest border-b border-gray-100">
                                                                <tr>
                                                                    <th className="px-6 py-4">Item</th>
                                                                    <th className="px-6 py-4 text-center">Qty</th>
                                                                    <th className="px-6 py-4 text-right">Price</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-50">
                                                                {order.items.map((item, idx) => {
                                                                    const p = mockService.getProduct(item.productId);
                                                                    return (
                                                                        <tr key={idx}>
                                                                            <td className="px-6 py-4 font-black text-black uppercase text-xs truncate max-w-[140px]">{p?.name || 'Produce Item'}</td>
                                                                            <td className="px-6 py-4 text-center font-black text-black text-xs">{item.quantityKg}kg</td>
                                                                            <td className="px-6 py-4 text-right font-black text-black text-xs">${(item.quantityKg * item.pricePerKg).toFixed(2)}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>

                                                {/* Right: Allocation Workflow */}
                                                <div className="space-y-8">
                                                    {/* PACKING ASSIGNMENT */}
                                                    <div className="space-y-3">
                                                        <label className="block text-[11px] font-black text-black uppercase tracking-[0.2em] ml-1">ASSIGN PACKING</label>
                                                        <div className="relative group">
                                                            <select 
                                                                className="relative w-full p-5 bg-white border-4 border-[#87CEFA] rounded-[1.25rem] font-black text-black uppercase text-xs outline-none shadow-xl transition-all focus:ring-4 focus:ring-blue-100/50 appearance-none"
                                                                onChange={(e) => handleAssignPacker(order.id, e.target.value)}
                                                                value={order.status === 'Ready for Delivery' ? order.logistics?.instructions?.replace('Packed by ', '') : ''}
                                                            >
                                                                <option value="" className="font-bold text-gray-400">Select Team Member...</option>
                                                                {packers.map(p => <option key={p.id} value={p.name} className="font-black text-black uppercase">{p.name}</option>)}
                                                            </select>
                                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#87CEFA] pointer-events-none" size={24} strokeWidth={4}/>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <button 
                                                            className="flex-1 py-5 bg-white border-2 border-gray-200 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Printer size={16}/> Print Slip
                                                        </button>
                                                        <button 
                                                            className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Truck size={16}/> Finalize
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
            <AiOpportunityMatcher user={user} />
        </div>
      )}

      {/* MODALS */}
      <SourcingModalV4 
        isOpen={!!sourcingProduct} 
        onClose={() => setSourcingProduct(null)} 
        product={sourcingProduct}
      />
    </div>
  );
};
