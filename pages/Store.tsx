
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, ShoppingCart, LayoutGrid, List, PackageOpen, 
  X, Trash2, MapPin, Send, CreditCard, ShoppingBag, 
  ArrowRight, ChevronRight, Info, Plus, Minus, CheckCircle2, Star
} from 'lucide-react';
import OrderReceipt from '../components/OrderReceipt';
import { Sale } from '../types';

const Store: React.FC = () => {
  const { 
    products = [], 
    cart = [], 
    addToCart, 
    removeFromCart, 
    neighborhoods = [], 
    config = {} as any, 
    addSale, 
    sales = [], 
    cancelSale 
  } = useApp();
  
  const [category, setCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Estados do Checkout
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [deliveryType, setDeliveryType] = useState<'Residence' | 'Counter'>('Residence');
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);

  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category)))];

  // Regra de Negócio: Mostrar apenas se isOnline for true (Integração Omnichannel)
  const filtered = products.filter(p => 
    p.isOnline !== false &&
    (category === 'Todas' || p.category === category) &&
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartItems = (cart || []).map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.product!.salePrice * curr.quantity), 0);
  const selectedNeighborhood = neighborhoods.find(n => n.id === neighborhoodId);
  const shippingCost = deliveryType === 'Residence' ? (selectedNeighborhood?.rate || 0) : 0;
  const total = subtotal + shippingCost;

  const handleCheckoutWhatsApp = () => {
    if (!customerName || (deliveryType === 'Residence' && (!address || !neighborhoodId))) {
      alert("Por favor, preencha seus dados para entrega ou selecione Retirada no Balcão.");
      return;
    }

    const orderId = Math.random().toString(36).substring(7).toUpperCase();
    
    const newSale: Sale = {
      id: orderId,
      clientId: 'guest',
      clientName: customerName,
      items: cartItems.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.product!.salePrice })),
      total: total,
      date: new Date().toISOString(),
      deliveryType: deliveryType,
      status: 'Paid',
      neighborhoodId: neighborhoodId
    };
    
    addSale(newSale);
    setLastSaleId(orderId);

    const itemsList = cartItems.map(item => 
      `• ${item.quantity}x ${item.product?.name} (R$ ${item.product?.salePrice.toFixed(2)})`
    ).join('%0A');

    const message = `📦 *NOVO PEDIDO - CRINF INFORMÁTICA*%0A` +
      `----------------------------------%0A` +
      `🆔 *TICKET:* #${orderId}%0A` +
      `👤 *Cliente:* ${customerName}%0A` +
      `🚚 *Logística:* ${deliveryType === 'Residence' ? 'Entrega Residencial' : 'Retirada Balcão'}%0A` +
      (deliveryType === 'Residence' ? `🏠 *Endereço:* ${address}%0A📍 *Bairro:* ${selectedNeighborhood?.name}%0A` : '') +
      `----------------------------------%0A` +
      `🛒 *PRODUTOS:*%0A${itemsList}%0A` +
      `----------------------------------%0A` +
      `💰 *RESUMO:*%0A` +
      `Subtotal: R$ ${subtotal.toFixed(2)}%0A` +
      `Frete: R$ ${shippingCost.toFixed(2)}%0A` +
      `*TOTAL: R$ ${total.toFixed(2)}*%0A` +
      `----------------------------------%0A` +
      `_Pedido processado pelo Sistema CRINF_`;

    window.open(`https://wa.me/${config.whatsapp}?text=${message}`, '_blank');
    setIsCartOpen(false);
  };

  const activeSale = sales.find(s => s.id === lastSaleId);

  return (
    <div className="max-w-7xl mx-auto px-8 py-20 bg-white relative">
      {/* Botão Flutuante do Carrinho */}
      <button 
        onClick={() => setIsCartOpen(true)}
        style={{ backgroundColor: config.secondaryColor }}
        className="fixed bottom-10 right-10 z-[60] p-6 rounded-[2.5rem] shadow-2xl border-4 border-white group hover:scale-110 active:scale-95 transition-all lg:hidden"
      >
        <ShoppingCart size={32} className="text-[#0369A1]" />
        {(cart || []).length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
            {(cart || []).reduce((acc, curr) => acc + curr.quantity, 0)}
          </span>
        )}
      </button>

      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12">
        <div className="space-y-4">
          <span className="text-[#0EA5E9] font-black uppercase text-[10px] tracking-[0.3em]">Catálogo Online CRINF</span>
          <div className="flex items-center gap-6">
            <h1 className="text-5xl lg:text-7xl font-black text-[#0369A1] tracking-tight italic uppercase">Equipamentos</h1>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hidden lg:flex items-center gap-3 bg-sky-50 text-[#0EA5E9] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all"
            >
              <ShoppingCart size={18} /> Carrinho ({(cart || []).length})
            </button>
          </div>
          <p className="text-[#0EA5E9] font-medium max-w-md italic">Performance e confiabilidade selecionadas pelos nossos especialistas técnicos em Campo Largo.</p>
        </div>
        
        <div className="w-full lg:auto flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative group flex-grow lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-200 group-focus-within:text-[#0EA5E9] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="O que você procura hoje?" 
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-sky-50 border-none focus:ring-4 focus:ring-[#0EA5E9]/10 outline-none font-bold transition-all text-[#0369A1] placeholder:text-sky-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categorias Filtro */}
      <div className="flex gap-4 mb-16 overflow-x-auto pb-4 no-scrollbar">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
              category === c 
              ? 'bg-[#FFFF00] text-[#0369A1] border-white shadow-2xl scale-105' 
              : 'bg-white text-sky-300 hover:bg-sky-50 border-sky-100'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Exibição de Produtos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 animate-in fade-in duration-500">
          {filtered.map(product => (
            <div key={product.id} className="group flex flex-col h-full">
              <div className="aspect-square overflow-hidden rounded-[3.5rem] bg-sky-50 relative mb-8 border border-sky-100 shadow-xl transition-all duration-500">
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <div className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-black text-[#0369A1] uppercase shadow-lg border border-sky-50">
                      {product.condition}
                   </div>
                   {product.stock <= (product.minStock || 2) && (
                     <div className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg animate-pulse">
                        Últimas Peças
                     </div>
                   )}
                </div>
                <button 
                  onClick={() => { addToCart(product.id, 1); setIsCartOpen(true); }}
                  disabled={product.stock <= 0}
                  className="absolute inset-x-8 bottom-8 bg-[#FFFF00] text-[#0369A1] py-5 rounded-[1.5rem] font-black uppercase text-[11px] shadow-2xl translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 border-4 border-white"
                >
                  <ShoppingCart size={18} /> {product.stock <= 0 ? 'Sem Estoque' : 'Comprar Agora'}
                </button>
              </div>
              <div className="px-4 space-y-2">
                {product.shortDescription && (
                  <p className="text-[10px] font-black text-[#0EA5E9] bg-sky-50 px-4 py-1.5 rounded-full uppercase tracking-widest leading-none mb-3 inline-block border border-sky-100 italic">
                    {product.shortDescription}
                  </p>
                )}
                <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter line-clamp-2 leading-tight">{product.name}</h3>
                <div className="flex items-center gap-6">
                   <p className="text-3xl font-black text-[#0EA5E9] italic">R$ {product.salePrice.toFixed(2)}</p>
                   <div className="flex items-center gap-1 text-[#FFFF00]">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[10px] font-black text-sky-300 uppercase">Novo</span>
                   </div>
                </div>
                <p className="text-[9px] font-bold text-sky-300 uppercase tracking-widest">Estoque: {product.stock} {product.measureUnit}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-8">
          <div className="w-32 h-32 bg-sky-50 rounded-[3rem] flex items-center justify-center mx-auto text-sky-200 border-4 border-dashed border-sky-100">
            <PackageOpen size={64} />
          </div>
          <h3 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter">Nada por aqui...</h3>
        </div>
      )}

      {/* DRAWER DO CARRINHO (CHECKOUT) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-[#0369A1]/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
             <div className="p-10 border-b border-sky-50 flex justify-between items-center bg-sky-50/50">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-[#FFFF00] text-[#0369A1] rounded-2xl shadow-xl rotate-3"><ShoppingBag size={32} /></div>
                   <div>
                      <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">Seu Carrinho</h3>
                      <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest mt-1">Checkout CRINF Campo Largo</p>
                   </div>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-5 bg-white rounded-full text-sky-200 hover:text-red-400 transition-all shadow-sm border border-sky-100"><X size={32} /></button>
             </div>

             <div className="flex-grow overflow-y-auto custom-scrollbar p-10 space-y-12">
                {cartItems.length > 0 ? (
                  <>
                    <div className="space-y-6">
                       {cartItems.map((item, i) => (
                         <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-sky-50 shadow-lg flex items-center gap-6 relative group overflow-hidden">
                            <img src={item.product?.image} className="w-24 h-24 rounded-2xl object-cover border-4 border-sky-50" />
                            <div className="flex-grow min-w-0">
                               <h4 className="text-lg font-black text-[#0369A1] uppercase italic truncate leading-tight">{item.product?.name}</h4>
                               <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center bg-sky-50 rounded-xl px-4 py-2 gap-4">
                                     <button onClick={() => addToCart(item.productId, -1)} className="text-[#0EA5E9]"><Minus size={14} /></button>
                                     <span className="text-xs font-black text-[#0369A1]">{item.quantity}</span>
                                     <button onClick={() => addToCart(item.productId, 1)} className="text-[#0EA5E9]"><Plus size={14} /></button>
                                  </div>
                                  <span className="text-xl font-black text-[#0EA5E9] italic">R$ {(item.product!.salePrice * item.quantity).toFixed(2)}</span>
                               </div>
                            </div>
                            <button onClick={() => removeFromCart(item.productId)} className="absolute -right-12 group-hover:right-4 top-1/2 -translate-y-1/2 p-3 bg-red-50 text-red-400 rounded-xl transition-all"><Trash2 size={18} /></button>
                         </div>
                       ))}
                    </div>

                    <section className="bg-sky-50/50 p-10 rounded-[3.5rem] border border-sky-100 space-y-8">
                       <h4 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3"><MapPin size={24} /> Logística</h4>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => setDeliveryType('Residence')} className={`py-4 rounded-2xl font-black uppercase text-[10px] border-2 transition-all ${deliveryType === 'Residence' ? 'bg-[#0EA5E9] text-white border-white' : 'bg-white text-sky-300 border-sky-100'}`}>Entrega</button>
                          <button onClick={() => setDeliveryType('Counter')} className={`py-4 rounded-2xl font-black uppercase text-[10px] border-2 transition-all ${deliveryType === 'Counter' ? 'bg-[#0369A1] text-white border-white' : 'bg-white text-sky-300 border-sky-100'}`}>Retirada</button>
                       </div>

                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Seu Nome</label>
                             <input className="w-full px-8 py-5 rounded-[2rem] bg-white border-none font-bold text-[#0369A1] focus:ring-4 focus:ring-[#FFFF00]/40 outline-none" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Como te chamamos?" />
                          </div>
                          {deliveryType === 'Residence' && (
                            <>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Endereço de Entrega</label>
                                 <input className="w-full px-8 py-5 rounded-[2rem] bg-white border-none font-bold text-[#0369A1] focus:ring-4 focus:ring-[#FFFF00]/40 outline-none" value={address} onChange={e => setAddress(e.target.value)} placeholder="Rua, Número, Apto..." />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Selecione o Bairro (CL)</label>
                                 <select className="w-full px-8 py-5 rounded-[2rem] bg-white border-none font-bold text-[#0369A1] appearance-none cursor-pointer focus:ring-4 focus:ring-[#0EA5E9]/20 outline-none" value={neighborhoodId} onChange={e => setNeighborhoodId(e.target.value)}>
                                    <option value="">Selecione...</option>
                                    {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                                 </select>
                              </div>
                            </>
                          )}
                       </div>
                    </section>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                     <ShoppingCart size={80} strokeWidth={1} />
                     <p className="text-xl font-black uppercase italic tracking-tighter">Carrinho Vazio</p>
                  </div>
                )}
             </div>

             {cartItems.length > 0 && (
               <div className="p-10 bg-white border-t border-sky-100 space-y-6">
                  <div className="space-y-3 px-2">
                     <div className="flex justify-between text-sm font-bold text-sky-400 uppercase"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                     <div className="flex justify-between text-sm font-bold text-sky-400 uppercase"><span>Frete</span><span>R$ {shippingCost.toFixed(2)}</span></div>
                     <div className="flex justify-between items-end pt-4 border-t border-sky-50">
                        <span className="text-xl font-black uppercase italic text-[#0369A1]">Total</span>
                        <span className="text-4xl font-black italic text-[#0369A1]">R$ {total.toFixed(2)}</span>
                     </div>
                  </div>
                  <button onClick={handleCheckoutWhatsApp} className="w-full bg-[#FFFF00] text-[#0369A1] py-7 rounded-[3rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 border-4 border-white hover:scale-105 transition-all">
                    <Send size={24} /> Finalizar via WhatsApp
                  </button>
               </div>
             )}
          </div>
        </div>
      )}

      {/* RECIBO APÓS COMPRA */}
      {activeSale && (
        <OrderReceipt 
          sale={activeSale} 
          products={products} 
          onCancel={(id) => { cancelSale(id); setLastSaleId(null); }}
          onClose={() => setLastSaleId(null)}
        />
      )}
    </div>
  );
};

export default Store;
