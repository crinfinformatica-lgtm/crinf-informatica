
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
// Add missing Link import
import { Link } from 'react-router-dom';
import { 
  Printer, ShoppingCart, Send, Plus, Minus, 
  MessageCircle, Info, CheckCircle2, Camera, 
  ChevronRight, Percent, Scissors, Package, 
  Briefcase, ArrowRight, Zap, Target, ListChecks,
  Monitor, Laptop, Smartphone, MonitorIcon
} from 'lucide-react';

const ServicesPage: React.FC = () => {
  const { services, technicalServices, config, addDigitalServiceSale } = useApp();
  const page = config.servicesPage;
  const [activeTab, setActiveTab] = useState<'digital' | 'technical'>('digital');
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  // Lógica de cálculo de preço por escala (Tiered Pricing)
  const calculateUnitPrice = (service: any, qty: number) => {
    if (!service.tieredPrices || service.tieredPrices.length === 0) return service.basePrice;
    
    // Ordena do maior para o menor minQty para pegar a faixa correta
    const applicableTiers = [...service.tieredPrices]
      .filter(tier => qty >= tier.minQty)
      .sort((a, b) => b.minQty - a.minQty);
    
    return applicableTiers.length > 0 ? applicableTiers[0].price : service.basePrice;
  };

  const handleQtyChange = (id: string, delta: number) => {
    setOrderQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const selectedItems = useMemo(() => {
    return services.filter(s => (orderQuantities[s.id] || 0) > 0).map(s => {
      const qty = orderQuantities[s.id];
      const unitPrice = calculateUnitPrice(s, qty);
      return { ...s, qty, unitPrice, total: unitPrice * qty };
    });
  }, [services, orderQuantities]);

  const grandTotal = selectedItems.reduce((acc, curr) => acc + curr.total, 0);

  const handleFinalize = () => {
    if (!customerName || !customerWhatsapp) {
      alert("Por favor, informe seu nome e WhatsApp para contato.");
      return;
    }

    const description = selectedItems.map(i => `${i.qty}x ${i.name}`).join(', ');
    addDigitalServiceSale(description, grandTotal, customerName, customerWhatsapp);

    // Formatar mensagem para WhatsApp
    const itemsText = selectedItems.map(i => 
      `✅ *${i.name}*\n   ↳ Quantidade: ${i.qty} un.\n   ↳ Valor Unit: R$ ${i.unitPrice.toFixed(2)}\n   ↳ Subtotal: R$ ${i.total.toFixed(2)}`
    ).join('\n\n');

    const message = `🚀 *NOVO PEDIDO DE SERVIÇO - CRINF CL*%0A` +
      `----------------------------------%0A` +
      `👤 *CLIENTE:* ${customerName.toUpperCase()}%0A` +
      `📱 *WHATSAPP:* ${customerWhatsapp}%0A` +
      `💰 *TOTAL ESTIMADO:* R$ ${grandTotal.toFixed(2)}%0A` +
      `----------------------------------%0A` +
      `🛒 *ITENS:*%0A%0A${encodeURIComponent(itemsText)}%0A%0A` +
      `----------------------------------%0A` +
      `_Aguardando envio dos arquivos para processamento._`;

    window.open(`https://wa.me/${config.whatsapp}?text=${message}`, '_blank');
    
    setOrderQuantities({});
    setCustomerName('');
    setCustomerWhatsapp('');
    setShowCheckout(false);
  };

  // Filtro de serviços técnicos visíveis
  const visibleTechnical = technicalServices.filter(s => s.isVisible);

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[#FFFF00] selection:text-[#0369A1] transition-colors duration-500"
      style={{ backgroundColor: page.backgroundColor || '#FFFFFF' }}
    >
      {/* Hero Section Master Dinâmico */}
      <section className="relative h-[55vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
           <img src={page.heroImage} className="w-full h-full object-cover" alt="Hero Services" />
           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-10 w-full relative z-10">
           <div className="space-y-8 animate-in slide-in-from-left duration-1000 max-w-4xl">
              <div className="inline-flex items-center gap-3 bg-[#FFFF00] text-[#0369A1] px-8 py-3 rounded-full shadow-2xl ring-8 ring-white/10">
                 <Zap size={20} fill="currentColor" />
                 <span className="text-[12px] font-black uppercase tracking-[0.3em]">Qualidade Técnica CRINF</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8] drop-shadow-2xl">
                 {page.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium italic leading-relaxed border-l-4 border-[#FFFF00] pl-8">
                {page.subtitle}
              </p>
           </div>
        </div>
      </section>

      {/* Tabs de Navegação de Serviços */}
      <div className="max-w-7xl mx-auto px-8 mt-16">
         <div className="flex bg-sky-50 p-3 rounded-[3.5rem] border border-sky-100 shadow-2xl max-w-2xl mx-auto">
            <button 
              onClick={() => setActiveTab('digital')}
              className={`flex-1 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-4 ${activeTab === 'digital' ? 'bg-[#0EA5E9] text-white shadow-xl scale-[1.05]' : 'text-sky-300 hover:text-[#0EA5E9]'}`}
            >
               <Printer size={20} /> Serviços Digitais
            </button>
            <button 
              onClick={() => setActiveTab('technical')}
              className={`flex-1 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-4 ${activeTab === 'technical' ? 'bg-[#0369A1] text-white shadow-xl scale-[1.05]' : 'text-sky-300 hover:text-[#0EA5E9]'}`}
            >
               <ListChecks size={20} /> Catálogo Técnico
            </button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        <div className="lg:col-span-8 space-y-16">
           {activeTab === 'digital' ? (
              /* ABA SERVIÇOS DIGITAIS */
              <div className="space-y-12 animate-in fade-in duration-700">
                 <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter" style={{ color: page.textColor || '#0369A1' }}>
                       Centro de <span className="text-[#0EA5E9]">Processamento</span>
                    </h2>
                    <p className="text-xl text-sky-600 font-medium italic leading-relaxed max-w-2xl">{page.description}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {services.map(service => {
                      const currentQty = orderQuantities[service.id] || 0;
                      const unitPrice = calculateUnitPrice(service, currentQty || 1);

                      return (
                        <div key={service.id} className={`bg-white rounded-[4rem] border-2 transition-all group overflow-hidden flex flex-col ${currentQty > 0 ? 'border-[#0EA5E9] shadow-2xl scale-[1.03]' : 'border-sky-50 shadow-xl shadow-sky-500/5 hover:border-sky-200'}`}>
                           <div className="h-56 relative overflow-hidden">
                              <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                              <div className="absolute top-6 right-6 bg-[#FFFF00]/95 backdrop-blur-md px-5 py-2 rounded-2xl text-[10px] font-black uppercase shadow-lg text-[#0369A1] border-2 border-white">
                                 {service.category}
                              </div>
                           </div>

                           <div className="p-10 space-y-8 flex-grow flex flex-col">
                              <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none group-hover:text-[#0EA5E9] transition-colors">{service.name}</h3>
                              
                              {service.tieredPrices && service.tieredPrices.length > 0 && (
                                <div className="bg-sky-50 rounded-[2.5rem] p-6 space-y-3 border border-sky-100">
                                   {service.tieredPrices.map((t, idx) => (
                                      <div key={idx} className={`flex justify-between text-[10px] font-black ${currentQty >= t.minQty ? 'text-[#0EA5E9]' : 'text-sky-300'}`}>
                                         <span>+ {t.minQty} un.</span>
                                         <span>R$ {t.price.toFixed(2)}</span>
                                      </div>
                                   ))}
                                </div>
                              )}

                              <div className="mt-auto pt-8 border-t border-sky-50 flex items-center justify-between">
                                 <span className="text-3xl font-black text-[#0369A1] italic tracking-tighter">R$ {unitPrice.toFixed(2)}</span>
                                 <div className="flex items-center bg-sky-100/50 rounded-3xl p-1 shadow-inner">
                                    <button onClick={() => handleQtyChange(service.id, -1)} className="p-4 text-sky-300 hover:text-red-400 transition-colors"><Minus size={18}/></button>
                                    <span className="w-10 text-center font-black text-[#0369A1]">{currentQty}</span>
                                    <button onClick={() => handleQtyChange(service.id, 1)} className="p-4 bg-white text-[#0EA5E9] rounded-2xl shadow-xl hover:scale-110 transition-all"><Plus size={18}/></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>
           ) : (
              /* ABA CATÁLOGO TÉCNICO */
              <div className="space-y-12 animate-in fade-in duration-700">
                 <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter" style={{ color: page.textColor || '#0369A1' }}>
                       Soluções <span className="text-[#0EA5E9]">Técnicas</span>
                    </h2>
                    <p className="text-xl text-sky-600 font-medium italic leading-relaxed max-w-2xl">Procedimentos padrão de assistência técnica com transparência e precisão CRINF.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {visibleTechnical.map(service => (
                       <div key={service.id} className="bg-white rounded-[4rem] border border-sky-50 shadow-2xl p-10 flex flex-col group hover:border-[#0EA5E9] transition-all overflow-hidden relative">
                          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:rotate-12 transition-transform">
                             {service.category === 'Notebook' ? <Laptop size={120}/> : service.category === 'Computador' ? <Monitor size={120}/> : <MonitorIcon size={120}/>}
                          </div>
                          
                          <div className="space-y-6 relative z-10">
                             <div className="inline-flex bg-sky-50 text-[#0EA5E9] px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-sky-100">
                                {service.category}
                             </div>
                             <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-[0.9]">{service.name}</h3>
                             <p className="text-sm text-sky-600 font-medium italic leading-relaxed">{service.description}</p>
                             
                             <div className="pt-8 border-t border-sky-50 flex items-center justify-between">
                                <div className="space-y-1">
                                   <p className="text-[10px] font-black text-sky-300 uppercase tracking-[0.2em]">Estimativa M.O.</p>
                                   <p className="text-4xl font-black text-[#0369A1] italic tracking-tighter">R$ {service.price.toFixed(2)}</p>
                                </div>
                                <Link to="/leva-e-traz" className="p-5 bg-sky-50 text-[#0EA5E9] rounded-3xl hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-sm">
                                   <ArrowRight size={24} />
                                </Link>
                             </div>
                          </div>
                       </div>
                    ))}
                    {visibleTechnical.length === 0 && (
                       <div className="col-span-full py-32 text-center opacity-30 italic font-black uppercase tracking-widest">Nenhum procedimento técnico listado para consulta.</div>
                    )}
                 </div>
              </div>
           )}
        </div>

        {/* Painel Lateral de Solicitação (Funciona apenas para Digitais) */}
        <div className="lg:col-span-4">
           <div className="sticky top-32 space-y-10">
              <div className="bg-[#0369A1] rounded-[4.5rem] p-12 text-white shadow-2xl relative overflow-hidden border-8 border-white">
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter border-b border-white/20 pb-6 mb-10">Carrinho Digital</h3>
                 
                 {selectedItems.length > 0 ? (
                    <div className="space-y-8 relative z-10">
                       <div className="space-y-5 max-h-[40vh] overflow-y-auto custom-scrollbar pr-4">
                          {selectedItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center gap-6 bg-white/10 p-5 rounded-[2rem] border border-white/10 backdrop-blur-md">
                               <div className="min-w-0">
                                  <p className="font-black uppercase italic text-xs truncate">{item.name}</p>
                                  <p className="text-[10px] font-bold text-[#FFFF00] uppercase tracking-widest">{item.qty}x R$ {item.unitPrice.toFixed(2)}</p>
                               </div>
                               <span className="font-black text-md italic shrink-0">R$ {item.total.toFixed(2)}</span>
                            </div>
                          ))}
                       </div>
                       
                       <div className="pt-10 border-t border-white/20 flex justify-between items-end">
                          <span className="text-xl font-black uppercase italic tracking-widest text-[#FFFF00]">Total</span>
                          <span className="text-6xl font-black italic tracking-tighter">R$ {grandTotal.toFixed(2)}</span>
                       </div>

                       <button 
                        onClick={() => setShowCheckout(true)}
                        className="w-full bg-[#FFFF00] text-[#0369A1] py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-white"
                       >
                         Enviar Pedido <Send size={24} />
                       </button>
                    </div>
                 ) : (
                    <div className="py-24 text-center space-y-6 opacity-40">
                       <div className="p-8 bg-white/10 rounded-full inline-block"><Package size={80} strokeWidth={1} /></div>
                       <p className="text-sm font-black uppercase tracking-widest italic max-w-[200px] mx-auto">Adicione itens digitais para solicitar processamento via WhatsApp.</p>
                    </div>
                 )}
              </div>

              <div className="bg-white p-12 rounded-[4rem] shadow-xl border border-sky-100 space-y-10">
                 <div className="space-y-2">
                    <h4 className="font-black text-[#0369A1] uppercase text-xs tracking-widest">Ajuda & Orçamentos</h4>
                    <div className="w-12 h-1.5 bg-[#FFFF00] rounded-full" />
                 </div>
                 <div className="space-y-8">
                    <div className="flex items-start gap-6">
                       <div className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl"><Info size={24} /></div>
                       <p className="text-[11px] font-bold text-sky-600 uppercase leading-relaxed italic">Serviços técnicos requerem laudo físico para orçamento final.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Modal de Checkout / WhatsApp */}
      {showCheckout && (
        <div className="fixed inset-0 z-[200] bg-[#0369A1]/95 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="bg-white rounded-[5rem] w-full max-w-2xl shadow-2xl border-8 border-white p-16 text-center space-y-12 animate-in zoom-in-95 duration-500">
              <div className="w-32 h-32 bg-[#FFFF00] text-[#0369A1] rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl ring-8 ring-sky-50">
                 <MessageCircle size={64} strokeWidth={3} />
              </div>
              <h3 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter">Dados do Pedido</h3>

              <div className="space-y-8 text-left">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Seu Nome</label>
                    <input required className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">WhatsApp</label>
                    <input required className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none" value={customerWhatsapp} onChange={e => setCustomerWhatsapp(e.target.value)} />
                 </div>
              </div>

              <div className="flex flex-col gap-6">
                 <button onClick={handleFinalize} className="w-full bg-[#0EA5E9] text-white py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-sky-400">
                    Confirmar & WhatsApp <Send size={24} />
                 </button>
                 <button onClick={() => setShowCheckout(false)} className="text-sky-300 font-black uppercase text-[10px] tracking-widest hover:text-red-400">Voltar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
