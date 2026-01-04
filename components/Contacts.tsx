
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, InventoryItem, Product, ChatMessage, UserRole, Customer, Order, SupplierPriceRequest, ProcurementRequest } from '../types';
import { mockService } from '../services/mockDataService';
import { triggerNativeSms, generateProductDeepLink } from '../services/smsService';
import { InviteBuyerModal } from './InviteBuyerModal';
import { 
  MessageCircle, Send, Plus, X, Search, Info, 
  ShoppingBag, CheckCircle, Clock,
  Store, MapPin, Phone, ShieldCheck, Tag, ChevronRight, Users, UserCheck,
  ArrowLeft, UserPlus, Smartphone, Contact, Loader2, Building, Mail, BookOpen,
  Package, DollarSign, Truck, Camera, Image as ImageIcon, ChevronDown, FolderOpen,
  Sprout, ShoppingCart, MessageSquare, Globe, ArrowUpRight, HelpCircle, Activity, Heart, TrendingUp,
  Calendar
} from 'lucide-react';
import { ChatDialog } from './ChatDialog';

interface ContactsProps {
  user: User;
}

const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'];

const SA_PRODUCE_MARKET_SUPPLIERS = [
    { name: 'Advent Produce', mobile: '0412 888 333', email: 'advent@saproducemarket.com.au', location: 'Store 31-33', specialty: 'GENERAL PRODUCE', type: 'WHOLESALER', imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=300' },
    { name: 'AMJ Produce', mobile: '0422 777 444', email: 'sales@amjproduce.com.au', location: 'Burma Drive, Pooraka', specialty: 'FRUIT & VEG', type: 'WAREHOUSE', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300' },
    { name: 'B&C Fresh', mobile: '0433 666 555', email: 'admin@bcfresh.com.au', location: 'Store 12-14', specialty: 'EXOTICS', type: 'WHOLESALER', imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f1?auto=format&fit=crop&q=80&w=300' },
    { name: 'Bache Bros', mobile: '0444 555 666', email: 'bachebros@internode.on.net', location: 'Store 60', specialty: 'POTATOES & ONIONS', type: 'WHOLESALER', imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=300' },
    { name: 'Ceravolo Orchards', mobile: '0455 444 777', email: 'info@ceravolo.com.au', location: 'Store 32', specialty: 'APPLES & PEARS', type: 'WHOLESALER', imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&q=80&w=300' },
    { name: 'Costa Group (SA)', mobile: '0466 333 888', email: 'sa.sales@costagroup.com.au', location: 'Store 101', specialty: 'GLOBAL PRODUCE', type: 'WAREHOUSE', imageUrl: 'https://images.unsplash.com/photo-1595231712325-9feda07b0632?auto=format&fit=crop&q=80&w=300' },
    { name: 'Favco SA', mobile: '0477 222 999', email: 'sales@favcosa.com.au', location: 'Store 41-43', specialty: 'PREMIUM STONEFRUIT', type: 'WHOLESALER', imageUrl: 'https://images.unsplash.com/photo-1543073289-53428df1972b?auto=format&fit=crop&q=80&w=300' },
    { name: 'GD Produce', mobile: '0488 111 000', email: 'sales@gdproduce.com.au', location: 'Store 12', specialty: 'LEAFY GREENS', type: 'WHOLESALER', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300' },
    { name: 'George\'s Fruit & Veg', mobile: '0499 000 111', email: 'george@georges.com.au', location: 'Store 22', specialty: 'ASIAN PRODUCE', type: 'WHOLESALER', imageUrl: 'https://images.unsplash.com/photo-1559181567-c3190cb9959b?auto=format&fit=crop&q=80&w=300' },
    { name: 'J.H. Fawcett', mobile: '0411 999 222', email: 'admin@jhfawcett.com.au', location: 'Store 18', specialty: 'ROOT VEGETABLES', type: 'WHOLESALER', imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=300' },
];

const SendProductOfferModal = ({ isOpen, onClose, targetPartner, products }: { 
    isOpen: boolean, 
    onClose: () => void, 
    targetPartner: any, 
    products: Product[]
}) => {
    const [offerData, setOfferData] = useState({
        productId: '',
        price: '',
        unit: 'KG',
        minOrder: '',
        logisticsPrice: '0',
    });
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    if (!isOpen) return null;

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setCustomImage(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mobile = targetPartner.mobile || targetPartner.phone;
        if (!mobile) { alert("No mobile number available."); return; }
        setSubmitting(true);
        const productName = products.find(p => p.id === offerData.productId)?.name || "Fresh Produce";
        const message = `PZ OFFER: ${productName}\nPrice: $${offerData.price}/${offerData.unit}\nMin Order: ${offerData.minOrder}${offerData.unit}\nView & Accept: ${generateProductDeepLink('quote', 'off-' + Date.now())}`;
        triggerNativeSms(mobile, message);
        setTimeout(() => { setSubmitting(false); alert("Offer sent via native SMS!"); onClose(); }, 800);
    };

    return (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div><h2 className="text-xl font-black text-black uppercase tracking-tight">Direct Photo Offer</h2><p className="text-[10px] text-black font-black uppercase tracking-widest mt-1">To: {targetPartner.name || targetPartner.businessName}</p></div>
                    <button onClick={onClose} className="text-black hover:text-gray-600 p-2"><X size={24}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div onClick={() => fileInputRef.current?.click()} className={`h-48 border-4 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-gray-50 shadow-inner-sm ${customImage ? 'border-emerald-500' : 'border-gray-200 hover:border-indigo-400'}`}>
                        {customImage ? <img src={customImage} className="w-full h-full object-cover" alt=""/> : <div className="text-center"><Camera size={32} className="text-gray-300 mx-auto mb-2"/><p className="text-[10px] font-black text-black uppercase tracking-widest">Select Product Photo</p></div>}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFile}/>
                    </div>
                    <div className="space-y-4">
                        <select required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-black text-sm text-black outline-none focus:ring-4 focus:ring-indigo-50/10" value={offerData.productId} onChange={e => setOfferData({...offerData, productId: e.target.value})}>
                            <option value="">Select Catalog Variety...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-3">
                            <input required type="number" step="0.01" placeholder="Price ($/kg)" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-sm text-black outline-none focus:ring-4 focus:ring-indigo-50/10" value={offerData.price} onChange={e => setOfferData({...offerData, price: e.target.value})}/>
                            <input required type="number" placeholder="Min Qty (kg)" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-black text-sm text-black outline-none focus:ring-4 focus:ring-indigo-50/10" value={offerData.minOrder} onChange={e => setOfferData({...offerData, minOrder: e.target.value})}/>
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmitting || !customImage || !offerData.productId} className="w-full py-5 bg-[#043003] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <><Send size={18}/> Dispatch to Buyer</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export const Contacts: React.FC<ContactsProps> = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'customers' | 'suppliers' | 'procurement'>('customers');
  const [selectedState, setSelectedState] = useState('SA');
  const [activeContact, setActiveContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sendProductTarget, setSendProductTarget] = useState<any>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [sentRequestsCount, setSentRequestsCount] = useState(0);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatTargetName, setChatTargetName] = useState('');
  
  const [suppliers, setSuppliers] = useState<User[]>([]);
  const [supplierInventory, setSupplierInventory] = useState<Record<string, InventoryItem[]>>({});
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [myCustomers, setMyCustomers] = useState<Customer[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = () => {
    setProducts(mockService.getAllProducts());
    setMyCustomers(mockService.getCustomers());
    setAllOrders(mockService.getOrders(user.id));
    
    const incomingRequests = mockService.getSupplierPriceRequests(user.id).filter(r => r.status === 'PENDING');
    setPendingRequestsCount(incomingRequests.length);

    const myProcurements = mockService.getProcurementRequests(user.id).filter(r => r.buyerId === user.id);
    setProcurementRequests(myProcurements);
    setSentRequestsCount(myProcurements.filter(r => r.status === 'PENDING').length);

    const allUsers = mockService.getAllUsers();
    const networkSuppliers = allUsers.filter(u => u.id !== user.id && (u.role === UserRole.WHOLESALER || u.role === UserRole.FARMER));
    setSuppliers(networkSuppliers);
  };

  const handleConnect = (name: string) => {
    setChatTargetName(name);
    setIsChatOpen(true);
  };

  const filteredCustomers = myCustomers.filter(c => 
    c.connectedSupplierId === user.id &&
    (c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
     c.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredMarketSuppliers = selectedState === 'SA' 
    ? SA_PRODUCE_MARKET_SUPPLIERS.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getStatusConfig = (status: string | undefined) => {
      switch(status) {
          case 'Active': return { color: 'text-emerald-700 bg-emerald-100 border-emerald-200', icon: UserCheck };
          case 'Pending Connection': return { color: 'text-orange-700 bg-orange-100 border-orange-200', icon: Clock };
          case 'Pricing Pending': return { color: 'text-blue-700 bg-blue-100 border-blue-200', icon: DollarSign };
          default: return { color: 'text-black bg-gray-100 border-gray-200', icon: HelpCircle };
      }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="px-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-[1.25rem] shadow-sm border border-gray-100 flex items-center justify-center text-[#043003]">
                {activeTab === 'customers' ? <Users size={36} /> : activeTab === 'suppliers' ? <Store size={36} /> : <ShoppingCart size={36}/>}
            </div>
            <div>
                <h1 className="text-4xl font-black text-black tracking-tight uppercase leading-none">
                    {activeTab === 'customers' ? 'Buyer Network' : activeTab === 'suppliers' ? 'Market Discovery' : 'Pending Sourcing'}
                </h1>
                <p className="text-black font-black text-xs uppercase tracking-widest mt-2">
                    {activeTab === 'customers' ? 'Connected accounts & manual lead management' : activeTab === 'suppliers' ? 'Explore regional markets and new wholesale buyers' : 'Track price requests you sent to suppliers'}
                </p>
            </div>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-black group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
                type="text" 
                placeholder={activeTab === 'customers' ? "Search connected buyers..." : "Search network..."} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-14 pr-8 py-5 bg-white border-2 border-gray-100 rounded-[1.5rem] text-sm font-black text-black outline-none focus:ring-4 focus:ring-indigo-50/5 transition-all shadow-sm"
            />
          </div>
      </div>

      <div className="bg-gray-100/50 p-1.5 rounded-[1.5rem] inline-flex border border-gray-200 shadow-sm mx-2 overflow-x-auto no-scrollbar max-w-full">
        <button onClick={() => setActiveTab('customers')} className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'customers' ? 'bg-white text-black shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-900'}`}>
            My Buyers
            {pendingRequestsCount > 0 && <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-black animate-pulse">{pendingRequestsCount}</span>}
        </button>
        <button onClick={() => setActiveTab('procurement')} className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'procurement' ? 'bg-white text-black shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-900'}`}>
            Pending Sourcing
            {sentRequestsCount > 0 && <span className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-black">{sentRequestsCount}</span>}
        </button>
        <button onClick={() => setActiveTab('suppliers')} className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 whitespace-nowrap ${activeTab === 'suppliers' ? 'bg-white text-black shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-900'}`}><ShoppingCart size={14}/> Market Directory</button>
      </div>
      
      {activeTab === 'customers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
              <div onClick={() => setIsInviteModalOpen(true)} className="border-4 border-dashed border-gray-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group hover:bg-emerald-50/30 hover:border-emerald-200 transition-all cursor-pointer min-h-[400px] shadow-inner-sm bg-white/50">
                  <div className="w-20 h-20 bg-white rounded-[1.5rem] shadow-xl flex items-center justify-center mb-8 border border-gray-50 transition-transform group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-emerald-100">
                    <UserPlus size={36} className="text-emerald-500"/>
                  </div>
                  <h3 className="text-2xl font-black text-gray-400 group-hover:text-black tracking-tight uppercase leading-none">Provision Buyer</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-4 max-w-[180px]">Generate a direct-connect onboarding portal link</p>
              </div>

              {filteredCustomers.map(contact => {
                  const statusCfg = getStatusConfig(contact.connectionStatus);
                  const StatusIcon = statusCfg.icon;
                  const customerGmv = allOrders.filter(o => o.buyerId === contact.id).reduce((sum, o) => sum + o.totalAmount, 0);

                  return (
                    <div key={contact.id} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between min-h-[400px] animate-in zoom-in-95 duration-300">
                        <div>
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-3xl shadow-inner-sm border border-indigo-100/50">{contact.businessName.charAt(0)}</div>
                                <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm ${statusCfg.color}`}>
                                    <StatusIcon size={16}/>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{contact.connectionStatus || 'Connected'}</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-black tracking-tighter group-hover:text-indigo-600 mb-1 uppercase leading-none transition-colors">{contact.businessName}</h3>
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6">{contact.category || 'MARKETPLACE BUYER'}</p>
                            
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 text-[8px] font-black text-gray-900 uppercase tracking-widest mb-1">
                                        <TrendingUp size={10} className="text-emerald-500"/> Volume
                                    </div>
                                    <p className="text-sm font-black text-black uppercase tracking-tight truncate">
                                        ${customerGmv.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-2 text-[8px] font-black text-gray-900 uppercase tracking-widest mb-1">
                                        <Clock size={10} className="text-indigo-400"/> Partnership
                                    </div>
                                    <p className="text-sm font-black text-black uppercase tracking-tight truncate">
                                        Active
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-4 text-xs text-black font-black uppercase tracking-wide truncate"><div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Mail size={16}/></div> {contact.email}</div>
                                <div className="flex items-center gap-4 text-xs text-black font-black uppercase tracking-wide"><div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Smartphone size={16}/></div> {contact.phone || '0400 123 456'}</div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-8">
                            <button onClick={() => setSendProductTarget(contact)} className="flex-1 py-4 bg-white border-2 border-indigo-100 text-indigo-600 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-indigo-600 hover:text-white shadow-sm active:scale-95"><Camera size={16}/> Offer</button>
                            <button onClick={() => navigate(`/contacts?id=${contact.id}`)} className="flex-[2] py-4 bg-[#043003] text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest transition-all hover:bg-black shadow-xl active:scale-95 flex items-center justify-center gap-2"><MessageSquare size={18}/> Manage</button>
                        </div>
                    </div>
                  );
              })}
          </div>
      )}

      {activeTab === 'suppliers' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 px-2">
            
            <div className="bg-white p-2 rounded-[2rem] border border-gray-200 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar mb-8 whitespace-nowrap">
                {AU_STATES.map(state => (
                    <button
                        key={state}
                        onClick={() => setSelectedState(state)}
                        className={`flex-1 min-w-[90px] py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${selectedState === state ? 'bg-[#043003] text-white shadow-lg' : 'text-black hover:bg-gray-50'}`}
                    >
                        {state}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-10 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center gap-8 shrink-0">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-md border border-gray-100 shrink-0">
                            <ShoppingCart size={28}/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-black uppercase tracking-tight leading-none">{selectedState} Market Directory</h2>
                            <p className="text-[10px] text-black font-black uppercase tracking-widest mt-2">Discover potential {selectedState} partners and wholesale buyers</p>
                        </div>
                    </div>
                    
                    <div className="bg-emerald-50 px-6 py-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                         <Globe size={16} className="text-emerald-600 animate-spin-slow"/>
                         <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Global Discovery</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredMarketSuppliers.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white border-b border-gray-100 text-[10px] font-black text-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-10 py-6">Company Name</th>
                                    <th className="px-10 py-6">Specialty</th>
                                    <th className="px-10 py-6">Market Location</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredMarketSuppliers.map((supplier, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-inner-sm shrink-0">
                                                    <img src={supplier.imageUrl} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-black tracking-tight text-base uppercase leading-none group-hover:text-indigo-600 transition-colors">{supplier.name}</div>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-[9px] text-black font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-xl border border-gray-200 shadow-sm">{supplier.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="bg-black text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-black shadow-sm">
                                                {supplier.specialty}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2 text-sm text-black font-black uppercase tracking-tight">
                                                <MapPin size={16} className="text-indigo-500"/> {supplier.location}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button 
                                                    onClick={() => triggerNativeSms(supplier.mobile, `Hi ${supplier.name}, contacting you via Platform Zero...`)}
                                                    className="px-8 py-3.5 bg-white border-2 border-black text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
                                                >
                                                    Connect
                                                </button>
                                                <button 
                                                    onClick={() => setSendProductTarget({ ...supplier, phone: supplier.mobile, businessName: supplier.name })}
                                                    className="p-3.5 bg-white border-2 border-gray-200 text-black hover:text-indigo-600 hover:border-indigo-200 rounded-2xl transition-all shadow-sm active:scale-90"
                                                >
                                                    <Camera size={20} strokeWidth={2.5}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-24 text-center">
                            <Globe size={48} className="mx-auto text-gray-200 mb-6"/>
                            <h3 className="text-xl font-black text-black uppercase tracking-tight">Accessing Node...</h3>
                        </div>
                    )}
                </div>
            </div>
          </div>
      )}
      {sendProductTarget && (
        <SendProductOfferModal 
          isOpen={!!sendProductTarget} 
          onClose={() => setSendProductTarget(null)} 
          targetPartner={sendProductTarget} 
          products={products}
        />
      )}
      <InviteBuyerModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} wholesaler={user} />

      <ChatDialog 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        orderId="NETWORK-INQUIRY" 
        issueType={`Procurement Inquiry: Market Discovery`} 
        repName={chatTargetName} 
      />
    </div>
  );
};
