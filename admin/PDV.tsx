
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Plus, Minus, X, Check, Printer, 
  Trash2, ShoppingCart, User, DollarSign, 
  FileText, ArrowLeft, ArrowRight, Save, 
  Download, QrCode, CreditCard, Banknote,
  LayoutGrid, Info, Zap, AlertCircle, AlertTriangle, Calendar,
  Package, Hash, ShieldCheck, ChevronRight, List,
  Monitor, FileDown, Edit3, XCircle, History,
  Clock, CheckCircle2, ChevronDown, Store, BookOpen,
  Eye, RefreshCw, MoreVertical, Terminal, Wrench,
  Users, Building2, Wallet, FileCheck, Landmark,
  ArrowUpCircle, ArrowDownCircle, Percent
} from 'lucide-react';
import { Product, Sale, CashSession, Service, ServiceOrder } from '../types';

type PDVStep = 'Selection' | 'Payment' | 'Receipt';
type PDVView = 'Checkout' | 'History' | 'CashBook' | 'Financeiro';
type CatalogType = 'Products' | 'DigitalServices' | 'TechnicalOS';
type FinancialStatus = 'TODAS' | 'ABERTAS' | 'VENCIDAS' | 'FAVORITAS' | 'ARQUIVADAS';

const PDV: React.FC = () => {
  const { 
    products, services, serviceOrders, addSale, config, sales, cancelSale, 
    transactions, addTransaction, cashSessions, 
    openCashSession, closeCashSession, cancelCashSession,
    finalizeServiceOrder
  } = useApp();
  
  const [activeView, setActiveView] = useState<PDVView>('Checkout');
  const [step, setStep] = useState<PDVStep>('Selection');
  const [activeCatalog, setActiveCatalog] = useState<CatalogType>('Products');
  const [cart, setCart] = useState<{ id: string, name: string, price: number, quantity: number, type: 'Product' | 'Service' | 'OS' }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filtros para Histórico, Livro Caixa e Financeiro
  const [historySearch, setHistorySearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('- MÊS -');
  const [selectedYear, setSelectedYear] = useState('- ANO -');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'RECENTES' | 'CANCELADAS'>('RECENTES');
  const [finStatus, setFinStatus] = useState<FinancialStatus>('TODAS');
  const [finType, setFinType] = useState<'RECEBER' | 'PAGAR'>('RECEBER');

  // Modais de Movimentação de Caixa
  const [showMoveModal, setShowMoveModal] = useState<{ type: 'REFORÇO' | 'SANGRIA' | 'ABERTURA' } | null>(null);
  const [moveAmount, setMoveAmount] = useState<number>(0);
  const [moveDesc, setMoveDesc] = useState('');

  const [paymentData, setPaymentData] = useState({
    seller: 'CRISTIANO',
    client: 'CONSUMIDOR FINAL',
    address: '',
    observations: '',
    discount: 0,
    surcharge: 0,
    paymentMethod: 'DINHEIRO',
    receivedAmount: 0
  });

  const [finishedSaleId, setFinishedSaleId] = useState<string | null>(null);

  const activeSession = useMemo(() => cashSessions.find(s => s.status === 'Open'), [cashSessions]);

  // Teclas de Atalho Sênior
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (activeView !== 'Checkout') return;
      if (e.key === 'F4') { e.preventDefault(); document.getElementById('pdv-search')?.focus(); }
      if (e.key === 'F8') { e.preventDefault(); if(confirm("Limpar carrinho?")) setCart([]); }
      if (e.key === 'F9' && cart.length > 0) { e.preventDefault(); setStep('Payment'); }
      if (e.key === 'Escape') { e.preventDefault(); setStep('Selection'); }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [cart.length, activeView]);

  const filteredItems = useMemo(() => {
    if (activeCatalog === 'Products') {
      return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm))
        .map(p => ({ id: p.id, name: p.name, price: p.salePrice, type: 'Product' as const, image: p.image, barcode: p.barcode }));
    } else if (activeCatalog === 'DigitalServices') {
      return services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(s => ({ id: s.id, name: s.name, price: s.basePrice, type: 'Service' as const, image: s.image, barcode: 'SERV' }));
    } else {
      return serviceOrders.filter(o => o.status === 'Ready' && !o.isPaid && (o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm)))
        .map(o => ({ id: o.id, name: `OS: ${o.id} - ${o.equipment}`, price: o.totalValue, type: 'OS' as const, image: '', barcode: 'OS' }));
    }
  }, [products, services, serviceOrders, searchTerm, activeCatalog]);

  const sortedSales = useMemo(() => {
    return [...sales]
      .filter(s => {
        const matchSearch = s.clientName.toLowerCase().includes(historySearch.toLowerCase()) || s.id.includes(historySearch);
        const matchStatus = activeHistoryTab === 'RECENTES' ? s.status !== 'Cancelled' : s.status === 'Cancelled';
        return matchSearch && matchStatus;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, historySearch, activeHistoryTab]);

  const sessionsToDisplay = useMemo(() => {
    return cashSessions.filter(s => {
      const matchTab = activeHistoryTab === 'RECENTES' ? s.status !== 'Cancelled' : s.status === 'Cancelled';
      const matchSearch = s.operatorName.toLowerCase().includes(historySearch.toLowerCase()) || s.id.includes(historySearch);
      return matchTab && matchSearch;
    }).sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
  }, [cashSessions, activeHistoryTab, historySearch]);

  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const total = subtotal - paymentData.discount + paymentData.surcharge;
  const change = Math.max(0, paymentData.receivedAmount - total);
  const remaining = Math.max(0, total - paymentData.receivedAmount);

  const addToCart = (item: any) => {
    const existingIndex = cart.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += selectedQty;
      setCart(newCart);
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, quantity: selectedQty, type: item.type }]);
    }
    setSearchTerm('');
    setSelectedQty(1);
    document.getElementById('pdv-search')?.focus();
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const handleFinish = () => {
    if (cart.length === 0) return;
    const saleId = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Processar itens
    const productItems = cart.filter(i => i.type === 'Product');
    const osItems = cart.filter(i => i.type === 'OS');

    if (productItems.length > 0 || cart.filter(i => i.type === 'Service').length > 0) {
      const newSale: Sale = {
        id: saleId,
        clientId: 'guest',
        clientName: paymentData.client,
        items: cart.filter(i => i.type !== 'OS').map(i => ({ productId: i.id, quantity: i.quantity, price: i.price })),
        total: total - osItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0),
        date: new Date().toISOString(),
        deliveryType: 'Counter',
        status: 'Paid'
      };
      // @ts-ignore
      newSale.paymentMethod = paymentData.paymentMethod;
      // @ts-ignore
      newSale.sellerName = paymentData.seller;
      addSale(newSale);
    }

    // Finalizar OSs do carrinho
    osItems.forEach(osItem => {
       finalizeServiceOrder(osItem.id, paymentData.paymentMethod);
    });
    
    setFinishedSaleId(saleId);
    setStep('Receipt');
  };

  const handleCashMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession && showMoveModal?.type !== 'ABERTURA') {
      alert("É necessário abrir um caixa primeiro!");
      return;
    }

    if (showMoveModal?.type === 'ABERTURA') {
      openCashSession(moveAmount, 'CRISTIANO');
    } else {
      addTransaction({
        id: `move-${Date.now()}`,
        type: showMoveModal?.type === 'REFORÇO' ? 'Income' : 'Expense',
        category: showMoveModal?.type === 'REFORÇO' ? 'Reinforcement' : 'Bleeding',
        description: moveDesc || showMoveModal?.type || '',
        amount: moveAmount,
        date: new Date().toISOString(),
        sessionId: activeSession?.id
      });
    }
    setShowMoveModal(null);
    setMoveAmount(0);
    setMoveDesc('');
  };

  const getSessionStats = (sessionId: string) => {
    const sessionTx = transactions.filter(t => t.sessionId === sessionId);
    const salesTotal = sessionTx.filter(t => ['Sale', 'Service', 'DigitalService'].includes(t.category)).reduce((a, b) => a + b.amount, 0);
    const salesCount = sessionTx.filter(t => ['Sale', 'Service', 'DigitalService'].includes(t.category)).length;
    const reinforcements = sessionTx.filter(t => t.category === 'Reinforcement').reduce((a, b) => a + b.amount, 0);
    const bleedings = sessionTx.filter(t => t.category === 'Bleeding').reduce((a, b) => a + b.amount, 0);
    return { salesTotal, salesCount, reinforcements, bleedings };
  };

  const resetPDV = () => {
    setCart([]);
    setStep('Selection');
    setSearchTerm('');
    setPaymentData({ seller: 'CRISTIANO', client: 'CONSUMIDOR FINAL', address: '', observations: '', discount: 0, surcharge: 0, paymentMethod: 'DINHEIRO', receivedAmount: 0 });
    setFinishedSaleId(null);
  };

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col gap-5 font-sans animate-in fade-in duration-500 overflow-hidden pr-2">
      
      {/* NAVEGAÇÃO SUPERIOR POR ABAS */}
      <div className="flex justify-between items-center bg-white p-2 rounded-3xl shadow-sm border border-slate-200 shrink-0">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveView('Checkout')}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeView === 'Checkout' ? 'bg-[#0EA5E9] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <Monitor size={18} /> Frente de Caixa
          </button>
          <button 
            onClick={() => setActiveView('History')}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeView === 'History' ? 'bg-[#0EA5E9] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <History size={18} /> Vendas Realizadas
          </button>
          <button 
            onClick={() => setActiveView('CashBook')}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeView === 'CashBook' ? 'bg-[#0EA5E9] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <BookOpen size={18} /> Livro Caixa
          </button>
          <button 
            onClick={() => setActiveView('Financeiro')}
            className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeView === 'Financeiro' ? 'bg-[#0EA5E9] text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          >
            <Wallet size={18} /> Financeiro
          </button>
        </div>
        
        {activeView !== 'Checkout' && activeView !== 'Financeiro' && (
          <div className="flex items-center gap-4 pr-2">
             <div className="relative group">
                <input 
                  className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-10 text-xs font-bold uppercase placeholder:text-slate-400 focus:ring-4 focus:ring-sky-500/10 w-64 outline-none transition-all"
                  placeholder="Pesquisar..."
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             </div>
             <button className="bg-green-50 text-green-600 border border-green-100 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-green-100 transition-all">
                <FileDown size={14}/> Exportar
             </button>
          </div>
        )}
      </div>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 min-h-0 overflow-hidden">
        
        {activeView === 'Checkout' ? (
          <div 
            ref={containerRef}
            className="h-full flex gap-6 bg-slate-100/50 overflow-hidden rounded-[2.5rem] border border-slate-200 p-6 shadow-inner"
          >
            {/* PAINEL ESQUERDO: CARRINHO */}
            <div className="w-[450px] flex flex-col gap-5 shrink-0">
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 flex flex-col flex-1 overflow-hidden">
                <div className="p-7 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div style={{ backgroundColor: config.primaryColor }} className="p-3 rounded-2xl text-white shadow-lg shadow-sky-200 scale-110">
                      <ShoppingCart size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm italic">Resumo da Venda</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Terminal de Saída</p>
                    </div>
                  </div>
                  <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-lg text-xs font-black border border-sky-100">
                    #{finishedSaleId || 'PENDENTE'}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-7 space-y-5 custom-scrollbar">
                  {cart.length > 0 ? (
                    cart.map((item, i) => (
                      <div key={i} className="flex items-center justify-between group animate-in slide-in-from-left duration-300 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:bg-white hover:border-sky-200 transition-all">
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-sm font-black text-slate-700 truncate uppercase leading-tight mb-1 italic">{item.name}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.quantity} un. x R$ {item.price.toFixed(2)}</p>
                          {item.type === 'OS' && <span className="bg-orange-50 text-orange-600 text-[8px] font-black uppercase px-2 rounded">Serviço Técnico</span>}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-base font-black text-slate-800 italic">R$ {(item.price * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(item.id)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                            <X size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-6 opacity-40">
                      <div className="p-8 bg-slate-50 rounded-full border-4 border-dashed border-slate-200">
                        <Package size={64} strokeWidth={1} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.3em]">Aguardando Itens</p>
                    </div>
                  )}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-200 space-y-4">
                  <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                    <span>Subtotal de Itens</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {paymentData.discount > 0 && (
                    <div className="flex justify-between text-xs font-black text-red-500 uppercase tracking-widest">
                      <span>Descontos Aplicados</span>
                      <span>- R$ {paymentData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-5 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-base font-black text-slate-800 uppercase italic tracking-wider">Total Geral</span>
                    <span className="text-4xl font-black italic" style={{ color: config.primaryColor }}>
                      R$ {total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={resetPDV}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all group shadow-sm active:scale-95"
                >
                  <Trash2 size={22} className="mb-2" />
                  <span className="text-xs font-black uppercase tracking-widest">Limpar (F8)</span>
                </button>
                <button 
                  onClick={() => setStep('Payment')}
                  disabled={cart.length === 0}
                  className="flex flex-col items-center justify-center p-6 rounded-3xl text-white shadow-xl hover:brightness-110 transition-all disabled:opacity-50 active:scale-95"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <DollarSign size={22} className="mb-2" />
                  <span className="text-xs font-black uppercase tracking-widest">Receber (F9)</span>
                </button>
              </div>
            </div>

            {/* PAINEL DIREITO: CATALOGO */}
            <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative">
              {step === 'Selection' && (
                <div className="flex flex-col h-full animate-in fade-in duration-500">
                  <div className="p-8 space-y-6 bg-slate-50/30 border-b border-slate-100">
                    <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200 w-fit">
                       <button onClick={() => setActiveCatalog('Products')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeCatalog === 'Products' ? 'bg-white text-[#0EA5E9] shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>Produtos</button>
                       <button onClick={() => setActiveCatalog('DigitalServices')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeCatalog === 'DigitalServices' ? 'bg-white text-[#0EA5E9] shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>Digitais</button>
                       <button onClick={() => setActiveCatalog('TechnicalOS')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeCatalog === 'TechnicalOS' ? 'bg-white text-orange-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>Técnico (OS)</button>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-5 items-center">
                      <div className="col-span-8 relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-400 group-focus-within:text-sky-600 transition-colors" size={24} />
                        <input 
                          id="pdv-search"
                          autoFocus
                          className="w-full bg-white border border-slate-200 rounded-2xl py-6 px-16 font-bold text-xl text-slate-700 uppercase placeholder:text-slate-300 focus:ring-8 focus:ring-sky-500/10 focus:border-sky-400 outline-none transition-all shadow-sm"
                          placeholder={`BUSCAR EM ${activeCatalog === 'Products' ? 'ESTOQUE' : activeCatalog === 'DigitalServices' ? 'SERVIÇOS' : 'ORDENS DE SERVIÇO'}...`}
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">F4 BUSCA</div>
                      </div>
                      <div className="col-span-4 flex gap-3">
                        {[1, 2, 3, 5].map(q => (
                          <button 
                            key={q} 
                            onClick={() => setSelectedQty(q)} 
                            className={`flex-1 py-5 rounded-2xl font-black text-2xl border-2 transition-all active:scale-90 ${selectedQty === q ? 'bg-[#FFFF00] border-yellow-400 text-[#0369A1] shadow-lg scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 shadow-sm'}`}
                          >
                            {q}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar mt-6">
                    {searchTerm.length > 0 || activeCatalog === 'TechnicalOS' ? (
                      <div className="grid grid-cols-1 gap-5">
                        {filteredItems.map(item => (
                          <div key={item.id} onClick={() => addToCart(item)} className="flex items-center justify-between p-6 bg-white rounded-[2rem] border-2 border-slate-100 hover:border-sky-500 hover:bg-sky-50/50 transition-all cursor-pointer group shadow-sm active:scale-[0.99]">
                            <div className="flex items-center gap-8">
                              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner border border-slate-100 group-hover:border-sky-200 group-hover:bg-white transition-all overflow-hidden">
                                {item.image ? <img src={item.image} className="w-full h-full object-cover rounded-2xl" /> : (item.type === 'OS' ? <Wrench size={32}/> : <Package size={32} />)}
                              </div>
                              <div>
                                <h4 className="text-lg font-black text-slate-800 uppercase italic leading-none mb-2">{item.name}</h4>
                                <div className="flex items-center gap-4">
                                  <span className="text-[10px] font-black text-sky-500 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100 uppercase tracking-widest">{item.barcode}</span>
                                  {item.type === 'OS' && <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-3 py-1 rounded-lg border border-orange-100 uppercase tracking-widest">PRONTO P/ ENTREGA</span>}
                                </div>
                              </div>
                            </div>
                            <div className="text-right pr-4">
                              <p className="text-3xl font-black italic tracking-tight" style={{ color: config.primaryColor }}>R$ {item.price.toFixed(2)}</p>
                              <span className="text-[9px] font-black text-sky-300 uppercase tracking-[0.3em]">Clique p/ Inserir</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-6">
                        <div className="p-10 bg-slate-50 rounded-full border-4 border-dashed border-slate-200">
                          <Zap size={80} className="text-slate-300" />
                        </div>
                        <div className="text-center space-y-2">
                           <h4 className="text-2xl font-black text-slate-800 uppercase italic tracking-widest">Caixa Master CRINF</h4>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em]">Produtos, Digitais e Assistência em uma única cesta</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 'Payment' && (
                <div className="h-full flex flex-col p-12 gap-10 animate-in zoom-in-95 duration-500 overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-8">
                    <div>
                      <h3 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Processamento</h3>
                      <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mt-2">Escolha a forma de pagamento do cliente</p>
                    </div>
                    <button onClick={() => setStep('Selection')} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm active:scale-95"><X size={28}/></button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-grow items-start">
                    <div className="space-y-10">
                       <div className="grid grid-cols-2 gap-5">
                          <button onClick={() => setPaymentData({...paymentData, paymentMethod: 'DINHEIRO'})} className={`p-10 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-5 shadow-sm active:scale-[0.98] ${paymentData.paymentMethod === 'DINHEIRO' ? 'bg-sky-50 border-sky-500 shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-sky-200'}`}>
                            <Banknote size={40} style={{ color: paymentData.paymentMethod === 'DINHEIRO' ? config.primaryColor : 'inherit' }} />
                            <span className="text-xs font-black uppercase tracking-widest leading-none">Dinheiro</span>
                          </button>
                          <button onClick={() => setPaymentData({...paymentData, paymentMethod: 'PIX'})} className={`p-10 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-5 shadow-sm active:scale-[0.98] ${paymentData.paymentMethod === 'PIX' ? 'bg-sky-50 border-sky-500 shadow-xl scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-sky-200'}`}>
                            <Zap size={40} style={{ color: paymentData.paymentMethod === 'PIX' ? config.primaryColor : 'inherit' }} />
                            <span className="text-xs font-black uppercase tracking-widest leading-none">PIX Direto</span>
                          </button>
                       </div>
                       
                       <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-200 shadow-inner space-y-8">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center italic">Ajustes Financeiros Manuais</p>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-red-400 uppercase tracking-widest px-2">Desconto (R$)</label>
                               <input type="number" step="0.01" className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-black text-slate-700 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-400 transition-all shadow-sm" value={paymentData.discount || ''} onChange={e => setPaymentData({...paymentData, discount: Number(e.target.value)})} placeholder="0,00" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-green-500 uppercase tracking-widest px-2">Acréscimo (R$)</label>
                               <input type="number" step="0.01" className="w-full bg-white border border-slate-200 rounded-2xl py-4 px-6 font-black text-slate-700 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-400 transition-all shadow-sm" value={paymentData.surcharge || ''} onChange={e => setPaymentData({...paymentData, surcharge: Number(e.target.value)})} placeholder="0,00" />
                            </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-[3.5rem] p-10 flex flex-col items-center justify-center space-y-10 shadow-inner border border-slate-200">
                       <div className="text-center space-y-2">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] italic">Total à Receber</p>
                          <p className="text-7xl font-black italic tracking-tighter" style={{ color: config.primaryColor }}>R$ {total.toFixed(2)}</p>
                       </div>
                       
                       <div className="w-full space-y-6">
                          <div className="relative group">
                            <input 
                              type="number" step="0.01" autoFocus
                              className="w-full bg-white py-10 px-10 rounded-[2.5rem] border-4 border-slate-100 font-black text-5xl text-slate-800 outline-none focus:ring-[15px] focus:ring-sky-500/5 focus:border-sky-500 transition-all shadow-2xl text-center"
                              value={paymentData.receivedAmount || ''}
                              onChange={e => setPaymentData({...paymentData, receivedAmount: Number(e.target.value)})}
                              placeholder="0,00"
                            />
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0EA5E9] text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Valor Recebido do Cliente</div>
                          </div>

                          <div className="grid grid-cols-2 gap-8 px-4 pt-4 border-t border-slate-200">
                             <div className="text-center space-y-1">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Troco do Cliente</p>
                               <p className="text-2xl font-black text-green-500 italic">R$ {change.toFixed(2)}</p>
                             </div>
                             <div className="text-center space-y-1 border-l border-slate-200">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saldo Faltante</p>
                               <p className={`text-2xl font-black italic ${remaining > 0 ? 'text-red-500' : 'text-slate-200'}`}>R$ {remaining.toFixed(2)}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleFinish}
                    disabled={remaining > 0 && paymentData.paymentMethod !== 'PIX'}
                    className="w-full py-8 rounded-[2.5rem] text-white font-black text-3xl uppercase italic tracking-tighter shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale border-b-8 border-sky-800 shrink-0"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Confirmar Recebimento e Imprimir (F9)
                  </button>
                </div>
              )}

              {step === 'Receipt' && (
                <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-12 animate-in fade-in duration-700">
                   <div className="w-40 h-40 rounded-[3rem] bg-green-50 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-8 ring-green-50">
                      <CheckCircle2 size={100} strokeWidth={2.5} />
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-6xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Venda <span style={{ color: config.primaryColor }}>Finalizada!</span></h3>
                      <div className="inline-flex items-center gap-3 bg-slate-100 px-8 py-3 rounded-full text-slate-500 font-black text-sm uppercase tracking-[0.5em]">
                        <Hash size={18}/> Protocolo #{finishedSaleId}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl pt-10">
                      <button onClick={() => window.print()} className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-slate-200 flex flex-col items-center gap-5 hover:bg-white hover:border-sky-500 hover:text-sky-500 transition-all group shadow-sm active:scale-95">
                         <Printer size={48} strokeWidth={2.5} />
                         <span className="text-xs font-black uppercase tracking-[0.2em]">Imprimir Recibo</span>
                      </button>
                      <button onClick={resetPDV} className="bg-slate-900 text-white p-10 rounded-[2.5rem] flex flex-col items-center gap-5 hover:bg-black transition-all shadow-2xl active:scale-95">
                         <ArrowLeft size={48} strokeWidth={2.5} />
                         <span className="text-xs font-black uppercase tracking-[0.2em]">Novo Atendimento</span>
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        ) : activeView === 'History' ? (
          /* VENDAS REALIZADAS */
          <div className="h-full flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-right duration-500">
            <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6 shrink-0">
              <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                 <button onClick={() => setActiveHistoryTab('RECENTES')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeHistoryTab === 'RECENTES' ? 'bg-white text-[#0EA5E9] shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>Recentes</button>
                 <button onClick={() => setActiveHistoryTab('CANCELADAS')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeHistoryTab === 'CANCELADAS' ? 'bg-white text-red-500 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>Canceladas</button>
              </div>
              <div className="flex items-center gap-4">
                 <div className="relative">
                   <select className="bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 py-3.5 pl-6 pr-12 outline-none focus:ring-4 focus:ring-sky-500/10 appearance-none shadow-sm cursor-pointer" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                      <option>- ANO -</option>
                      <option>2026</option>
                      <option>2025</option>
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                 </div>
                 <div className="relative">
                   <select className="bg-white border border-slate-200 rounded-xl text-xs font-black uppercase text-slate-600 py-3.5 pl-6 pr-12 outline-none focus:ring-4 focus:ring-sky-500/10 appearance-none shadow-sm cursor-pointer" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                      <option>- MÊS -</option>
                      {['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'].map(m => <option key={m}>{m}</option>)}
                   </select>
                   <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={16} />
                 </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10 border-b border-slate-200">
                  <tr className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-10 py-7">Data / Horário</th>
                    <th className="px-8 py-7">Ticket / Protocolo</th>
                    <th className="px-8 py-7">Ficha Cliente <br/><span className="text-[10px] font-bold opacity-60 normal-case tracking-normal">Operador Responsável</span></th>
                    <th className="px-8 py-7">Recebimento</th>
                    <th className="px-8 py-7">Financeiro <br/><span className="text-[10px] font-bold opacity-60 normal-case tracking-normal">Lucro Líquido Estimado</span></th>
                    <th className="px-10 py-7 text-right">Controles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedSales.map((sale) => {
                    const d = new Date(sale.date);
                    const months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
                    return (
                      <tr key={sale.id} className="hover:bg-slate-50/80 transition-all group">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-2 font-black text-sm text-[#0369A1]">
                              <span className="bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-sm">{d.getDate()}</span>
                              <span className="bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-sm uppercase">{months[d.getMonth()]}</span>
                              <span className="bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 shadow-sm">{d.getFullYear()}</span>
                              <span className="bg-sky-50 text-[#0EA5E9] px-3 py-1 rounded-xl border border-sky-100 shadow-sm ml-2">
                                <Clock size={12} className="inline mr-1.5" />
                                {d.getHours().toString().padStart(2,'0')}:{d.getMinutes().toString().padStart(2,'0')}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex flex-col gap-2">
                              <span className="font-black text-slate-800 text-lg italic tracking-tight">#{sale.id}</span>
                              <span className="bg-sky-50 text-[#0EA5E9] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit border border-sky-100 italic shadow-sm">PDV BALCÃO</span>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex flex-col">
                              <span className="font-black text-slate-700 text-sm uppercase italic mb-1">{sale.clientName}</span>
                              {/* @ts-ignore */}
                              <span className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em] flex items-center gap-1.5"><User size={12} strokeWidth={3}/> {sale.sellerName || 'CRISTIANO'}</span>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex items-center gap-4">
                              {/* @ts-ignore */}
                              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase shadow-sm ${sale.paymentMethod === 'PIX' ? 'bg-sky-50 text-sky-600 border-sky-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                                {sale.paymentMethod === 'PIX' ? <Zap size={10} className="inline mr-1.5" /> : <DollarSign size={10} className="inline mr-1.5" />}
                                {sale.paymentMethod || 'DINHEIRO'}
                              </span>
                              <span className="font-black text-slate-700 text-base italic">R$ {sale.total.toFixed(2).replace('.', ',')}</span>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex flex-col text-right pr-8">
                              <span className="text-slate-400 font-bold text-sm tracking-tight mb-1">R$ {sale.total.toFixed(2).replace('.', ',')}</span>
                              <span className="text-[#059669] font-black text-base italic">R$ {sale.total.toFixed(2).replace('.', ',')}</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <button onClick={() => window.print()} className="p-3 bg-[#FFFF00] text-[#0369A1] rounded-xl hover:brightness-105 transition-all shadow-md active:scale-95"><Printer size={20} /></button>
                              <button className="p-3 bg-sky-50 text-[#0EA5E9] border border-sky-100 rounded-xl hover:bg-sky-500 hover:text-white transition-all shadow-md active:scale-95"><Edit3 size={20} /></button>
                              <button onClick={() => { if(confirm("Deseja realmente cancelar esta venda?")) cancelSale(sale.id); }} className="p-3 bg-red-50 text-red-500 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-95"><Trash2 size={20} /></button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-10 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-12">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Faturamento Consolidado</p>
                     <p className="text-3xl font-black text-slate-800 italic">R$ {sales.reduce((acc, curr) => acc + curr.total, 0).toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="w-px h-12 bg-slate-300 shadow-inner" />
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultado Líquido (BI)</p>
                     <p className="text-3xl font-black text-[#059669] italic">R$ {sales.reduce((acc, curr) => acc + curr.total, 0).toFixed(2).replace('.', ',')}</p>
                  </div>
               </div>
            </div>
          </div>
        ) : activeView === 'CashBook' ? (
          /* LIVRO CAIXA ESPELHADO */
          <div className="h-full flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-right duration-500">
            <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6 shrink-0">
              <div className="flex bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                 <button onClick={() => setActiveHistoryTab('RECENTES')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeHistoryTab === 'RECENTES' ? 'bg-white text-[#0EA5E9] shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>Recentes</button>
                 <button onClick={() => setActiveHistoryTab('CANCELADAS')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeHistoryTab === 'CANCELADAS' ? 'bg-white text-red-500 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>Canceladas</button>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={() => setShowMoveModal({type: 'REFORÇO'})} className="bg-slate-100 text-teal-600 px-4 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-teal-50 transition-all border border-slate-200">
                    <Plus size={14}/> REFORÇO
                 </button>
                 <button onClick={() => setShowMoveModal({type: 'SANGRIA'})} className="bg-slate-100 text-red-600 px-4 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-50 transition-all border border-slate-200">
                    <Minus size={14}/> SANGRIA
                 </button>
                 {activeSession ? (
                   <button onClick={() => closeCashSession(activeSession.id)} className="bg-orange-50 text-orange-600 border border-orange-100 px-4 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-orange-100 transition-all">
                      <Store size={14}/> FECHAR CAIXA
                   </button>
                 ) : (
                   <button onClick={() => setShowMoveModal({type: 'ABERTURA'})} className="bg-green-50 text-green-600 border border-green-100 px-4 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-green-100 transition-all">
                      <Plus size={14}/> ABRIR CAIXA
                   </button>
                 )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-white z-10 border-b border-slate-200">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-7 text-center">Abertura / <br/><span className="text-[8px] opacity-60">Fechamento</span></th>
                    <th className="px-6 py-7 text-center">Valor Inicial</th>
                    <th className="px-6 py-7 text-center">Venda(s) / <br/><span className="text-[8px] opacity-60">Reforço(s)</span></th>
                    <th className="px-6 py-7 text-center">Estorno(s) / <br/><span className="text-[8px] opacity-60">Sangria(s)</span></th>
                    <th className="px-6 py-7 text-center">Em Caixa / <br/><span className="text-[8px] opacity-60">Resultado</span></th>
                    <th className="px-8 py-7 text-right">Detalhes / <br/><span className="text-[8px] opacity-60">Editar</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold text-sky-500 text-xs">
                  {sessionsToDisplay.map(session => {
                    const stats = getSessionStats(session.id);
                    const result = session.initialValue + stats.salesTotal + stats.reinforcements - stats.bleedings;
                    const d = new Date(session.openedAt);
                    const months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
                    return (
                      <tr key={session.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6">
                           <div className="flex flex-col items-center gap-2">
                              <div className="flex items-center gap-1 font-black text-[11px] text-[#0369A1]">
                                 <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{d.getDate()}</span>
                                 <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase">{months[d.getMonth()]}</span>
                                 <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{d.getFullYear()}</span>
                                 <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{d.getHours().toString().padStart(2,'0')}:{d.getMinutes().toString().padStart(2,'0')}</span>
                              </div>
                              <span className="text-[10px] font-black text-sky-600 uppercase italic tracking-widest">{session.operatorName}</span>
                              {session.status === 'Open' ? <span className="bg-sky-50 text-sky-500 px-3 py-0.5 rounded-full text-[8px] font-black border border-sky-100 animate-pulse">CAIXA ABERTO</span> : <span className="text-slate-400 text-[8px] font-black uppercase">FECHADO ÀS {session.closedAt ? new Date(session.closedAt).toLocaleTimeString() : '--:--'}</span>}
                           </div>
                        </td>
                        <td className="px-6 py-6 text-center text-sky-600 font-black text-sm">{session.initialValue > 0 ? session.initialValue.toFixed(2).replace('.', ',') : '.'}</td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col items-center gap-1.5">
                              <div className="flex items-center gap-2">
                                 <span className="bg-sky-50 text-sky-400 px-2 py-0.5 rounded text-[10px]">{stats.salesCount || '.'}</span>
                                 <span className="text-sky-600">{stats.salesTotal > 0 ? stats.salesTotal.toFixed(2).replace('.', ',') : '.'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <span className="bg-sky-50 text-sky-200 px-2 py-0.5 rounded text-[10px]">.</span>
                                 <span className="text-sky-300">{stats.reinforcements > 0 ? stats.reinforcements.toFixed(2).replace('.', ',') : '.'}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6 opacity-60">
                           <div className="flex flex-col items-center gap-1.5">
                              <div className="flex items-center gap-2"><span className="bg-sky-50 text-sky-200 px-2 py-0.5 rounded text-[10px]">.</span><span className="text-sky-300">.</span></div>
                              <div className="flex items-center gap-2"><span className="bg-sky-50 text-sky-200 px-2 py-0.5 rounded text-[10px]">.</span><span className="text-sky-300">{stats.bleedings > 0 ? stats.bleedings.toFixed(2).replace('.', ',') : '.'}</span></div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col items-center gap-1.5">
                              <p className="text-sky-600 font-black italic text-sm">{result.toFixed(2).replace('.', ',')}</p>
                              <p className="text-sky-600/40 font-black italic text-xs">{result.toFixed(2).replace('.', ',')}</p>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button className="p-2 bg-green-50 text-green-500 rounded-lg hover:bg-green-100 transition-all shadow-sm"><Terminal size={18} /></button>
                              <button onClick={() => cancelCashSession(session.id)} className="p-2 bg-sky-50 text-sky-500 rounded-lg hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-sm"><Edit3 size={18} /></button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-12">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saldo Acumulado (Período)</p>
                     <p className="text-2xl font-black text-slate-700 italic">R$ {cashSessions.reduce((a, b) => a + b.finalBalance, 0).toFixed(2).replace('.', ',')}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-200" />
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] italic">Livro Caixa Consolidado CRINF</p>
               </div>
            </div>
          </div>
        ) : (
          /* FINANCEIRO (NOVA ABA INTEGRADA) */
          <div className="h-full flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-right duration-500">
             
             {/* BARRA DE AÇÕES FINANCEIRAS (ESPELHADA DA IMAGEM) */}
             <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                   <div className="relative group">
                      <input 
                        className="bg-white border border-slate-200 rounded-xl py-2.5 px-10 text-xs font-bold uppercase placeholder:text-slate-400 focus:ring-4 focus:ring-sky-500/10 w-64 outline-none transition-all"
                        placeholder="BUSCA"
                        value={historySearch}
                        onChange={e => setHistorySearch(e.target.value)}
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   </div>
                   <button className="bg-white text-[#0EA5E9] border border-slate-200 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-sky-50 transition-all shadow-sm">
                      <Plus size={14} className="text-green-500" /> A RECEBER
                   </button>
                   <button className="bg-white text-red-500 border border-slate-200 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-50 transition-all shadow-sm">
                      <Users size={14} className="text-red-400" /> DÍVIDAS
                   </button>
                   <button className="bg-white text-[#0EA5E9] border border-slate-200 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-sky-50 transition-all shadow-sm">
                      <DollarSign size={14} className="text-sky-400" /> RECEBIDOS
                   </button>
                   <button className="bg-white text-slate-500 border border-slate-200 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                      <Building2 size={14} className="text-slate-400" /> BANCOS
                   </button>
                </div>

                <div className="flex items-center gap-3">
                   <button className="bg-green-50 text-green-600 border border-green-100 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-green-100 transition-all shadow-sm">
                      <FileDown size={14}/> EXPORTAR
                   </button>
                   <div className="flex bg-[#0EA5E9] p-1 rounded-xl shadow-lg border-2 border-white">
                      <button onClick={() => setFinType('RECEBER')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${finType === 'RECEBER' ? 'bg-white text-[#0EA5E9]' : 'text-white'}`}>A RECEBER</button>
                      <button onClick={() => setFinType('PAGAR')} className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${finType === 'PAGAR' ? 'bg-white text-[#0EA5E9]' : 'text-white'}`}>A PAGAR</button>
                   </div>
                </div>
             </div>

             {/* FILTROS DE STATUS E DATA (ESTILO IMAGEM) */}
             <div className="px-8 py-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                   {['TODAS', 'ABERTAS', 'VENCIDAS', 'FAVORITAS', 'ARQUIVADAS'].map(st => (
                     <button 
                       key={st} 
                       onClick={() => setFinStatus(st as FinancialStatus)}
                       className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${finStatus === st ? 'bg-sky-50 text-[#0EA5E9] shadow-sm ring-1 ring-sky-200' : 'text-slate-400 hover:text-slate-600'}`}
                     >
                       {st}
                     </button>
                   ))}
                </div>
                
                <div className="flex items-center gap-2">
                   <div className="relative">
                      <select className="bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 py-2.5 pl-6 pr-10 outline-none focus:ring-4 focus:ring-sky-500/10 appearance-none shadow-sm cursor-pointer" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                         <option>- ANO -</option>
                         <option>2026</option>
                         <option>2025</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                   </div>
                   <div className="relative">
                      <select className="bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 py-2.5 pl-6 pr-10 outline-none focus:ring-4 focus:ring-sky-500/10 appearance-none shadow-sm cursor-pointer" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
                         <option>- MÊS -</option>
                         {['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'].map(m => <option key={m}>{m}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={14} />
                   </div>
                </div>
             </div>

             {/* TABELA FINANCEIRO (ESPELHADA DA IMAGEM) */}
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                   <thead className="sticky top-0 bg-white z-10 border-b border-slate-200 shadow-sm">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         <th className="px-8 py-5 text-center">PRÓXIMO <br/><span className="text-[8px] opacity-60">VENCIMENTO</span></th>
                         <th className="px-6 py-5">STATUS</th>
                         <th className="px-6 py-5 text-center">PARCELAS <br/><span className="text-[8px] opacity-60">QUITADAS</span></th>
                         <th className="px-6 py-5">CLIENTE</th>
                         <th className="px-6 py-5">DESCRIÇÃO</th>
                         <th className="px-6 py-5 text-right">TOTAL</th>
                         <th className="px-6 py-5 text-right">QUITADO</th>
                         <th className="px-6 py-5 text-right">FALTAM</th>
                         <th className="px-6 py-5 text-center">CARNÊ</th>
                         <th className="px-8 py-5 text-center">DAR <br/><span className="text-[8px] opacity-60">BAIXA</span></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {/* EXEMPLOS ESTÁTICOS BASEADOS NA IMAGEM */}
                      <tr className="hover:bg-slate-50/50 transition-all group font-bold text-sky-600 text-xs">
                         <td className="px-8 py-6 text-center">
                            <div className="flex flex-col items-center">
                               <span className="bg-sky-50 text-[#0369A1] px-2 py-0.5 rounded border border-sky-100 font-black">20 JAN 2026</span>
                               <span className="text-[9px] font-black text-slate-400 mt-1 uppercase italic tracking-tighter">Terça-feira</span>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <span className="bg-green-50 text-green-500 border border-green-100 px-3 py-1 rounded-full text-[9px] font-black uppercase italic shadow-sm flex items-center w-fit gap-2">
                               <CheckCircle2 size={10} /> EM DIA
                            </span>
                         </td>
                         <td className="px-6 py-6 text-center">
                            <div className="flex flex-col items-center gap-1">
                               <span className="text-[#0EA5E9] font-black">01 / 01</span>
                               <div className="w-12 h-1.5 bg-sky-100 rounded-full overflow-hidden shadow-inner">
                                  <div className="h-full bg-green-500 w-full" />
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <div className="flex flex-col">
                               <span className="font-black text-slate-700 uppercase italic">MARIA OLIVEIRA</span>
                               <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest">Pessoa Física</span>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <span className="text-slate-400 text-[10px] font-medium uppercase italic leading-tight">Manutenção Notebook Dell + Bateria Original</span>
                         </td>
                         <td className="px-6 py-6 text-right font-black text-slate-700">R$ 450,00</td>
                         <td className="px-6 py-6 text-right font-black text-green-500">R$ 450,00</td>
                         <td className="px-6 py-6 text-right font-black text-slate-300">.</td>
                         <td className="px-6 py-6 text-center">
                            <button className="p-2.5 bg-sky-50 text-[#0EA5E9] border border-sky-100 rounded-xl hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-sm">
                               <FileCheck size={18} />
                            </button>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <button className="p-2.5 bg-green-50 text-green-500 border border-green-100 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                               <ArrowDownCircle size={18} />
                            </button>
                         </td>
                      </tr>

                      <tr className="hover:bg-slate-50/50 transition-all group font-bold text-sky-600 text-xs">
                         <td className="px-8 py-6 text-center">
                            <div className="flex flex-col items-center">
                               <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded border border-red-100 font-black">15 DEZ 2025</span>
                               <span className="text-[9px] font-black text-red-300 mt-1 uppercase italic tracking-tighter">VENCIDA HÁ 35 DIAS</span>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <span className="bg-red-50 text-red-500 border border-red-100 px-3 py-1 rounded-full text-[9px] font-black uppercase italic shadow-sm flex items-center w-fit gap-2">
                               <AlertTriangle size={10} /> ATRASADO
                            </span>
                         </td>
                         <td className="px-6 py-6 text-center">
                            <div className="flex flex-col items-center gap-1">
                               <span className="text-red-500 font-black">02 / 05</span>
                               <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                  <div className="h-full bg-red-400 w-[40%]" />
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <div className="flex flex-col">
                               <span className="font-black text-slate-700 uppercase italic">CRINF - EMPRESA XYZ</span>
                               <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-1"><Landmark size={8}/> CORPORATIVO B2B</span>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <span className="text-slate-400 text-[10px] font-medium uppercase italic leading-tight">Serviços Mensais de Impressão e Backup Nuvem</span>
                         </td>
                         <td className="px-6 py-6 text-right font-black text-slate-700">R$ 1.200,00</td>
                         <td className="px-6 py-6 text-right font-black text-green-500">R$ 480,00</td>
                         <td className="px-6 py-6 text-right font-black text-red-500">R$ 720,00</td>
                         <td className="px-6 py-6 text-center">
                            <button className="p-2.5 bg-sky-50 text-[#0EA5E9] border border-sky-100 rounded-xl hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-sm">
                               <FileText size={18} />
                            </button>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <button className="p-2.5 bg-white text-sky-400 border border-slate-200 rounded-xl hover:border-sky-500 hover:text-sky-500 transition-all shadow-sm">
                               <ArrowDownCircle size={18} />
                            </button>
                         </td>
                      </tr>
                   </tbody>
                </table>
             </div>

             {/* RODAPÉ FINANCEIRO (BI) */}
             <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-wrap justify-between items-center gap-8 shrink-0">
                <div className="flex items-center gap-12">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">PREVISÃO RECEBÍVEL</p>
                      <p className="text-3xl font-black text-slate-700 italic">R$ 4.250,00</p>
                   </div>
                   <div className="w-px h-12 bg-slate-200 shadow-inner" />
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">INADIMPLÊNCIA (PERÍODO)</p>
                      <p className="text-3xl font-black text-red-500 italic">R$ 720,00</p>
                   </div>
                   <div className="w-px h-12 bg-slate-200 shadow-inner" />
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TAXA DE RECUPERAÇÃO</p>
                      <div className="flex items-center gap-3">
                         <p className="text-3xl font-black text-green-500 italic">83%</p>
                         <Percent size={20} className="text-green-500" />
                      </div>
                   </div>
                </div>
                
                <div className="text-right">
                   <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.4em] italic mb-1">Módulo Financeiro Master</p>
                   <p className="text-sm font-black text-slate-300 uppercase tracking-widest">Controle de Fluxo CRINF v3.0</p>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* MODAL PARA LANÇAMENTOS DE CAIXA */}
      {showMoveModal && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border-8 border-white">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl shadow-xl rotate-3 ${showMoveModal.type === 'SANGRIA' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                       <DollarSign size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">{showMoveModal.type}</h3>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operação de Caixa</p>
                    </div>
                 </div>
                 <button onClick={() => setShowMoveModal(null)} className="p-3 bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
              </div>
              <form onSubmit={handleCashMovement} className="p-10 space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor do Lançamento (R$)</label>
                    <input type="number" step="0.01" required autoFocus className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] font-black text-4xl text-sky-500 outline-none focus:ring-8 focus:ring-sky-500/5 transition-all text-center" value={moveAmount || ''} onChange={e => setMoveAmount(Number(e.target.value))} placeholder="0,00" />
                 </div>
                 {showMoveModal.type !== 'ABERTURA' && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Motivo / Descrição</label>
                       <input className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-600 outline-none focus:ring-4 focus:ring-sky-500/5 transition-all" value={moveDesc} onChange={e => setMoveDesc(e.target.value)} placeholder="Ex: Retirada p/ Fornecedor" />
                    </div>
                 )}
                 <button type="submit" className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${showMoveModal.type === 'SANGRIA' ? 'bg-red-500 text-white' : 'bg-sky-500 text-white'}`}>
                    {showMoveModal.type === 'ABERTURA' ? 'CONFIRMAR ABERTURA' : `CONCLUIR ${showMoveModal.type}`}
                    <ArrowRight size={20}/>
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default PDV;
