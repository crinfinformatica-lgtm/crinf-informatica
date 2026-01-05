
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, Send, FileText, Info, RefreshCw, 
  ArrowLeft, CheckCircle2, Camera, HelpCircle, Package, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExchangeRequest } from '../types';

const ReturnsPage: React.FC = () => {
  const { config, addExchange, products } = useApp();
  const page = config.returnsPage;
  
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Busca o produto pelo ID ou nome parcial no catálogo da loja
  const identifiedProduct = products.find(p => p.id === formValues['productId'] || p.name.toLowerCase().includes((formValues['productId'] || '').toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      alert("A evidência fotográfica é essencial para análise técnica.");
      return;
    }
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const request: ExchangeRequest = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      saleId: formValues['saleId'] || 'BALCAO-CL',
      productId: formValues['productId'] || 'N/A',
      clientName: clientName,
      clientEmail: clientEmail,
      purchaseDate: formValues['purchaseDate'] || new Date().toISOString().split('T')[0],
      warrantyPeriod: identifiedProduct?.warranty || 'Consultar Vendedor',
      reason: formValues['reason'] || 'Problema não descrito',
      photo: photo || '',
      ticketInfo: 'Solicitação via Portal do Cliente',
      status: 'Pending' as const,
      date: new Date().toISOString()
    };
    
    addExchange(request);
    setSent(true);
    setLoading(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (sent) {
    return (
      <div className="max-w-4xl mx-auto py-32 px-8 text-center animate-in zoom-in-95 duration-500">
        <div className="w-32 h-32 bg-[#FFFF00] text-[#0369A1] rounded-[3.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl ring-8 ring-sky-50">
          <CheckCircle2 size={64} strokeWidth={2.5} />
        </div>
        <h2 className="text-5xl font-black text-[#0369A1] tracking-tighter uppercase italic mb-6">Chamado Aberto!</h2>
        <div className="bg-white p-12 rounded-[4.5rem] border-4 border-sky-50 shadow-2xl mb-12 max-w-2xl mx-auto space-y-6">
          <p className="text-sky-700 font-black text-2xl leading-relaxed italic">
            Ticket ID: <span className="text-[#0EA5E9]">#{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
          </p>
          <div className="w-16 h-1.5 bg-[#FFFF00] mx-auto rounded-full" />
          <p className="text-sky-600 text-sm font-bold uppercase tracking-widest leading-relaxed">
            Recebemos suas evidências. Nossa equipe técnica entrará em contato em até 48h úteis via e-mail ou WhatsApp.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/" className="bg-[#0369A1] text-white px-16 py-7 rounded-[3rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-[#0EA5E9] transition-all flex items-center justify-center gap-4 border-4 border-white/10">
            <ArrowLeft size={18} /> Voltar ao Início
          </Link>
          <button onClick={() => setSent(false)} className="bg-white border-2 border-sky-100 text-[#0369A1] px-12 py-7 rounded-[3rem] font-black uppercase text-xs tracking-[0.2em] hover:bg-sky-50 transition-all shadow-lg">Novo Ticket</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[#FFFF00] selection:text-[#0369A1] transition-colors duration-500"
      style={{ backgroundColor: page.backgroundColor || '#FFFFFF' }}
    >
      <section 
        className="py-32 px-6 text-center relative overflow-hidden"
        style={{ backgroundColor: page.primaryColor }}
      >
        <div className="absolute inset-0">
          <img src={page.heroImage} className="w-full h-full object-cover opacity-20" alt="Garantia" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="max-w-5xl mx-auto space-y-10 relative z-10 text-white">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-3 rounded-full border border-white/20 shadow-2xl">
            <RefreshCw size={20} className="text-[#FFFF00] animate-spin-slow" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Plataforma de RMA Campo Largo</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">
            {page.title}
          </h1>
          <p className="text-2xl md:text-3xl text-white font-medium opacity-95 italic max-w-3xl mx-auto leading-relaxed border-l-4 border-[#FFFF00] pl-8">
            {page.subtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-24 px-8 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Painel Informativo Lateral */}
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-2xl space-y-12 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 text-sky-50 opacity-10 group-hover:text-[#FFFF00]/10 transition-colors"><FileText size={280} /></div>
            <h2 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter flex items-center gap-4 relative z-10">
               Política de <span className="text-[#0EA5E9]">Garantia</span>
            </h2>
            <div className="space-y-10 relative z-10 prose prose-sky">
               <p className="text-sky-600 font-medium leading-relaxed italic text-lg">{page.description}</p>
               <div className="space-y-8">
                  {[
                    { icon: ShieldCheck, title: "Lacre de Segurança", desc: "A integridade do selo CRINF é obrigatória para processamento da garantia." },
                    { icon: Package, title: "Acessórios", desc: "Traga cabos, fontes e manuais originais para agilizar a troca definitiva." },
                    { icon: Info, title: "Prazo de Triagem", desc: "A avaliação técnica das fotos enviadas ocorre em até 48 horas úteis." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 items-start group/rule">
                       <div className="p-3 bg-sky-50 text-[#0EA5E9] rounded-2xl group-hover/rule:bg-[#FFFF00] group-hover/rule:text-[#0369A1] transition-all shadow-inner"><item.icon size={28} /></div>
                       <div className="space-y-1">
                          <h4 className="font-black text-[#0369A1] uppercase text-xs tracking-widest">{item.title}</h4>
                          <p className="text-sky-400 text-xs font-bold leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="bg-[#FFFF00] p-12 rounded-[4rem] shadow-2xl border-4 border-white flex flex-col items-center text-center gap-8">
             <div className="w-20 h-20 bg-[#0369A1] text-white rounded-[2rem] flex items-center justify-center shadow-xl"><HelpCircle size={40}/></div>
             <h4 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-tight">Suporte Direto via Chat</h4>
             <a href={`https://wa.me/${config.whatsapp}`} target="_blank" className="bg-[#0369A1] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all">Abrir WhatsApp</a>
          </div>
        </div>

        {/* Formulário Mestre de Tickets */}
        <div className="lg:col-span-8">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-12 md:p-20 rounded-[5.5rem] border border-sky-50 shadow-[0_50px_100px_-20px_rgba(14,165,233,0.2)] space-y-16"
          >
            <div className="space-y-4">
               <h3 className="text-5xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none" style={{ color: page.textColor }}>Abertura de Ticket</h3>
               <p className="text-sky-400 font-bold uppercase text-[11px] tracking-[0.4em]">Informe os detalhes do ocorrido</p>
            </div>

            <div className="space-y-12">
               <section className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-sky-50 pb-4">
                     <h3 className="text-xl font-black text-[#0369A1] uppercase italic">1. Identificação do Cliente</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Nome Completo</label>
                       <input required className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ex: Maria Oliveira" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">E-mail p/ Contato</label>
                       <input required type="email" className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="seu@email.com" />
                     </div>
                  </div>
               </section>

               <section className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-sky-50 pb-4">
                     <h3 className="text-xl font-black text-[#0369A1] uppercase italic">2. Dados do Equipamento</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Produto ou Marca/Modelo</label>
                        <div className="relative">
                           <input required className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none" value={formValues['productId'] || ''} onChange={e => setFormValues({...formValues, productId: e.target.value})} placeholder="Ex: Teclado Mecânico RGB" />
                           <Search className="absolute right-8 top-1/2 -translate-y-1/2 text-sky-200" size={24} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Data da Compra</label>
                        <input type="date" required className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none" value={formValues['purchaseDate'] || ''} onChange={e => setFormValues({...formValues, purchaseDate: e.target.value})} />
                     </div>
                  </div>

                  {identifiedProduct && (
                    <div className="bg-sky-50 p-8 rounded-[3rem] border-2 border-[#FFFF00] animate-in slide-in-from-top-4 flex items-center gap-8">
                       <img src={identifiedProduct.image} className="w-20 h-20 rounded-2xl object-cover shadow-xl border-4 border-white" />
                       <div>
                          <p className="text-[10px] font-black text-sky-300 uppercase">Produto Identificado</p>
                          <h4 className="text-xl font-black text-[#0369A1] italic">{identifiedProduct.name}</h4>
                          <p className="text-[10px] font-black text-[#0EA5E9] uppercase">Garantia Ativa: {identifiedProduct.warranty}</p>
                       </div>
                    </div>
                  )}

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Descreva o Defeito Apresentado</label>
                     <textarea required rows={4} className="w-full px-10 py-8 rounded-[3.5rem] bg-sky-50 border-none font-medium text-lg text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none" value={formValues['reason'] || ''} onChange={e => setFormValues({...formValues, reason: e.target.value})} placeholder="Ex: O teclado parou de reconhecer a tecla 'Shift'..." />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-6">3. Evidência Visual (Foto do Produto)</label>
                     <label className="flex flex-col items-center justify-center h-80 bg-sky-50 border-4 border-dashed border-sky-100 rounded-[4rem] cursor-pointer relative overflow-hidden group shadow-inner transition-all hover:bg-white hover:border-[#FFFF00]">
                        {photo ? (
                          <img src={photo} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="text-center space-y-6 opacity-30 text-[#0EA5E9]">
                             <Camera size={80} className="mx-auto" />
                             <p className="text-xs font-black uppercase tracking-[0.3em]">Clique p/ Anexar Foto</p>
                          </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
                     </label>
                  </div>
               </section>
            </div>

            <section className="bg-[#0369A1] p-12 md:p-16 rounded-[4.5rem] text-white shadow-2xl space-y-10 relative overflow-hidden">
               <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-400 rounded-full blur-[120px] opacity-20" />
               <div className="space-y-6 relative z-10 text-center">
                  <h4 className="text-4xl font-black uppercase italic tracking-tighter">Enviar para <span className="text-[#FFFF00]">Análise</span>?</h4>
                  <p className="text-lg opacity-80 font-medium italic max-w-xl mx-auto">Confirmando, nossos técnicos serão notificados em Campo Largo para avaliar o seu ticket imediatamente.</p>
               </div>
               
               <button 
                 type="submit" 
                 disabled={loading || !photo}
                 className="w-full bg-[#FFFF00] text-[#0369A1] py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:grayscale relative z-10"
               >
                 {loading ? 'Processando Chamado...' : 'Confirmar & Abrir RMA'} <Send size={24} />
               </button>
            </section>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
