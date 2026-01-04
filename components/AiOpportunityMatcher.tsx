import React, { useState, useRef, useEffect } from 'react';
/* Added missing DollarSign import from lucide-react */
import { Camera, Upload, ScanLine, CheckCircle, Send, MessageSquare, AlertCircle, Loader2, Image as ImageIcon, FolderOpen, X, Store, MapPin, Share2, Heart, Edit2, ChevronDown, Package, Plus, Sparkles, DollarSign } from 'lucide-react';
import { mockService } from '../services/mockDataService';
import { identifyProductFromImage } from '../services/geminiService';
import { Customer, User, InventoryItem, Product } from '../types';
import { ChatDialog } from './ChatDialog';
import { ShareModal } from './SellerDashboardV1';

interface AiOpportunityMatcherProps {
  user?: User;
}

export const AiOpportunityMatcher: React.FC<AiOpportunityMatcherProps> = ({ user }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{name: string, quality: string} | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [matchedBuyers, setMatchedBuyers] = useState<Customer[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(100);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [isSending, setIsSending] = useState(false);
  const [isAddingInventory, setIsAddingInventory] = useState(false);
  const [offersSent, setOffersSent] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Share State
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Menu State for Photo Source
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  
  // Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [activeBuyerName, setActiveBuyerName] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProducts(mockService.getAllProducts());
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSourceMenu(false);
      }
    };
    if (showSourceMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSourceMenu]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        analyseImage(base64String.split(',')[1]); 
      };
      reader.readAsDataURL(file);
    }
    setShowSourceMenu(false);
  };

  const analyseImage = async (base64Data: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setMatchedBuyers([]);
    setOffersSent(false);
    setIsSaved(false);

    try {
        const result = await identifyProductFromImage(base64Data);
        updateResults(result.name, result.quality);
    } catch (error) {
        console.error("Analysis failed", error);
        alert("Could not analyse image. Please try again.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const updateResults = (name: string, quality: string) => {
    setAnalysisResult({ name, quality });
    const buyers = mockService.findBuyersForProduct(name);
    setMatchedBuyers(buyers);
    setIsEditingName(false);
  };

  const handleManualCorrect = (productName: string) => {
    if (analysisResult) {
        updateResults(productName, analysisResult.quality);
    }
  };

  const handleAddToInventory = async () => {
    if (!analysisResult) return;
    setIsAddingInventory(true);
    
    const product = products.find(p => p.name.toLowerCase().includes(analysisResult.name.toLowerCase())) || products[0];
    
    const newItem: InventoryItem = {
        id: `inv-ai-${Date.now()}`,
        lotNumber: mockService.generateLotId(),
        ownerId: user?.id || 'u2',
        productId: product.id,
        quantityKg: quantity,
        status: 'Available',
        harvestDate: new Date().toISOString(),
        harvestLocation: 'Direct via AI Scanner',
        uploadedAt: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        batchImageUrl: image || undefined,
        discountPricePerKg: price || undefined
    };

    await new Promise(r => setTimeout(r, 1000));
    mockService.addInventoryItem(newItem);
    if (price > 0) {
        mockService.updateProductPrice(product.id, price);
    }

    setIsAddingInventory(false);
    setIsSaved(true);
    alert(`${analysisResult.name} (${quantity}kg) successfully added to your inventory at $${price}/kg.`);
  };

  const handleSendOffers = () => {
    setIsSending(true);
    setTimeout(() => {
        setIsSending(false);
        setOffersSent(true);
        setTimeout(() => setOffersSent(false), 5000);
    }, 1500);
  };

  const openChat = (buyer: Customer) => {
      setActiveBuyerName(buyer.businessName);
      setChatOpen(true);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setImage(base64String);
          analyseImage(base64String.split(',')[1]);
        };
        reader.readAsDataURL(file);
    }
  };

  const syntheticItem: InventoryItem | null = analysisResult ? {
      id: `tmp-share-${Date.now()}`,
      lotNumber: 'TMP-LOT',
      ownerId: user?.id || 'u2',
      productId: products.find(p => p.name.toLowerCase().includes(analysisResult.name.toLowerCase()))?.id || 'p1',
      quantityKg: quantity,
      expiryDate: new Date().toISOString(),
      harvestDate: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
      status: 'Available'
  } : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <ScanLine className="text-indigo-600" size={32}/> AI Opportunity Matcher
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-sm md:text-base">Snap or upload produce to instantly notify active buyers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        <div className="space-y-6">
            <div 
                onDragOver={onDragOver}
                onDrop={onDrop}
                onClick={() => !image && setShowSourceMenu(true)}
                className={`border-2 border-dashed rounded-[2.5rem] h-64 md:h-96 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden bg-white shadow-inner-sm ${image ? 'border-indigo-100 shadow-none' : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50/50'}`}
            >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileChange} />
                
                {image ? (
                    <>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); setImage(null); setAnalysisResult(null); setMatchedBuyers([]); setIsSaved(false); }}
                            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg text-gray-500 hover:text-red-500 transition-all active:scale-90"
                        >
                            <X size={20}/>
                        </button>
                    </>
                ) : (
                    <div className="text-center p-8 animate-in fade-in zoom-in duration-300">
                        <div className="bg-indigo-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-sm">
                            <Camera size={40} strokeWidth={2.5}/>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Upload Photo</h3>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Identify & List Instant</p>
                    </div>
                )}
                
                {showSourceMenu && (
                    <div ref={dropdownRef} className="absolute z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 py-2 w-64 animate-in zoom-in-95 fade-in duration-200">
                        <button onClick={() => fileInputRef.current?.click()} className="w-full text-left px-5 py-3.5 hover:bg-gray-50 flex items-center gap-4 transition-colors">
                            <ImageIcon size={20} className="text-gray-600"/>
                            <span className="font-bold text-gray-800">Photo Library</span>
                        </button>
                        <button onClick={() => cameraInputRef.current?.click()} className="w-full text-left px-5 py-3.5 hover:bg-gray-50 flex items-center gap-4 transition-colors border-y border-gray-50">
                            <Camera size={20} className="text-gray-600"/>
                            <span className="font-bold text-gray-800">Take Photo</span>
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="w-full text-left px-5 py-3.5 hover:bg-gray-50 flex items-center gap-4 transition-colors">
                            <FolderOpen size={20} className="text-gray-600"/>
                            <span className="font-bold text-gray-800">Choose File</span>
                        </button>
                    </div>
                )}

                {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center flex-col z-10 animate-in fade-in duration-300">
                         <div className="relative">
                            <Loader2 size={64} className="text-indigo-600 animate-spin mb-4 opacity-20"/>
                            <ScanLine size={48} className="text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"/>
                         </div>
                         <p className="text-indigo-900 font-black uppercase tracking-widest text-xs mt-4">AI Scan in progress...</p>
                    </div>
                )}
            </div>

            {analysisResult && (
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-emerald-100 animate-in slide-in-from-left-4 duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 shadow-inner-sm">
                                <CheckCircle size={28} />
                            </div>
                            <div className="relative flex-1">
                                {isEditingName ? (
                                    <div className="space-y-2">
                                        <select 
                                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                                            value={analysisResult.name}
                                            onChange={(e) => handleManualCorrect(e.target.value)}
                                        >
                                            <option value={analysisResult.name}>{analysisResult.name} (Suggested)</option>
                                            {products.filter(p => p.name !== analysisResult.name).map(p => (
                                                <option key={p.id} value={p.name}>{p.name}</option>
                                            ))}
                                        </select>
                                        <button onClick={() => setIsEditingName(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-emerald-600">Cancel Edit</button>
                                    </div>
                                ) : (
                                    <div className="group cursor-pointer flex items-center gap-2" onClick={() => setIsEditingName(true)}>
                                        <h3 className="font-black text-gray-900 text-xl md:text-2xl tracking-tight leading-none uppercase">{analysisResult.name}</h3>
                                        <Edit2 size={16} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                )}
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1.5">Identified by Platform Zero AI</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button 
                                onClick={() => setIsShareOpen(true)}
                                className="p-3 bg-white border border-gray-200 text-gray-400 rounded-full hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95"
                             >
                                <Share2 size={24}/>
                             </button>
                        </div>
                    </div>
                    
                    <div className="bg-emerald-50/50 p-5 rounded-[1.5rem] border border-emerald-100/50 mb-8">
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Quality Assessment</span>
                        <p className="text-emerald-900 font-black text-base md:text-lg leading-tight uppercase">"{analysisResult.quality}"</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SET YOUR PRICE ($/KG)</label>
                            <div className="relative group">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-lg"/>
                                <input 
                                    type="number" 
                                    className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-black text-2xl text-gray-900 transition-all shadow-inner-sm"
                                    placeholder="0.00"
                                    value={price || ''}
                                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">TOTAL QUANTITY (KG)</label>
                            <div className="relative group">
                                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                <input 
                                    type="number" 
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-black text-2xl text-gray-900 transition-all shadow-inner-sm"
                                    placeholder="100"
                                    value={quantity || ''}
                                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleAddToInventory}
                        disabled={isAddingInventory || !quantity}
                        className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${isSaved ? 'bg-emerald-600 text-white' : 'bg-[#0F172A] text-white hover:bg-black'}`}
                    >
                        {isAddingInventory ? (
                            <><Loader2 size={18} className="animate-spin"/> Committing to Ledger...</>
                        ) : isSaved ? (
                            <><CheckCircle size={18}/> Added to Inventory</>
                        ) : (
                            <><Plus size={18}/> Add to My Market Inventory</>
                        )}
                    </button>
                </div>
            )}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col h-[500px] md:h-[700px] overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Buyer Opportunities</h2>
                    <p className="text-sm text-gray-500 font-medium">
                        {matchedBuyers.length > 0 
                            ? `${matchedBuyers.length} buyers matched for this product` 
                            : "Upload a photo to see matching demand"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {matchedBuyers.length > 0 && <div className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">{matchedBuyers.length}</div>}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {matchedBuyers.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8 opacity-40">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <ScanLine size={40}/>
                        </div>
                        <p className="font-black uppercase tracking-widest text-xs">No active matches found</p>
                    </div>
                ) : (
                    matchedBuyers.map(buyer => (
                        <div key={buyer.id} className="group border-2 border-gray-50 rounded-2xl p-5 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300 shadow-sm hover:shadow-md">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-black text-gray-900 text-lg tracking-tight group-hover:text-indigo-900 uppercase">{buyer.businessName}</h3>
                                {buyer.connectionStatus === 'Active' ? (
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest">Connected</span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-400 text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest">Lead</span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-gray-400 mb-5 font-black uppercase tracking-widest">
                                <span className="flex items-center gap-1"><Store size={14} className="text-gray-300"/> {buyer.category}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} className="text-gray-300"/> {buyer.location || 'Melbourne'}</span>
                            </div>
                            
                            <div className="flex gap-2">
                                {buyer.connectionStatus === 'Active' ? (
                                    <button 
                                        onClick={() => openChat(buyer)}
                                        className="flex-1 py-3 bg-white border-2 border-indigo-100 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <MessageSquare size={16}/> Chat & Propose
                                    </button>
                                ) : (
                                    <button className="flex-1 py-3 bg-gray-100 text-gray-400 font-black text-xs uppercase tracking-[0.2em] rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                                        <AlertCircle size={16}/> Intro Needed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {matchedBuyers.length > 0 && (
                <div className="p-8 border-t border-gray-10