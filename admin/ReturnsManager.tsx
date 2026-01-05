import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  RefreshCw, Plus, Trash2, ListPlus, Palette, 
  X, Save, Info, CheckCircle2, XCircle, 
  Eye, Calendar, User, Package, AlertTriangle, 
  ImageIcon, Type, Layout, Scissors, DollarSign, Search,
  // Added missing ShieldCheck import
  ShieldCheck
} from 'lucide-react';
import { FormField, ExchangeRequest } from '../types';
import ImageEditor from './ImageEditor';

const ReturnsManager: React.FC = () => {
  const { config, updateConfig, exchanges, products } = useApp();
  const [activeTab, setActiveTab] = useState<'tickets' | 'design'>('tickets');
  const [statusFilter, setStatusFilter] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [selectedTicket, setSelectedTicket] = useState<ExchangeRequest | null>(null);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const handleUpdate = (updates: any) => {
    updateConfig({
      returnsPage: { ...config.returnsPage, ...updates }
    });
  };

  // Simulação de alteração de status (no ambiente real atualizaria o banco)
  const handleStatusChange = (ticketId: string, newStatus: 'Approved' | 'Rejected') => {
    const ticket = exchanges.find(e => e.id === ticketId);
    if (ticket) {
      // Aqui o context faria o updateDoc no Firebase/LocalStorage
      alert(`O Ticket #${ticketId} foi movido para o status: ${newStatus === 'Approved' ? 'APROVADA' : 'CANCELADA'}`);
      setSelectedTicket(null);
    }
  };

  const filteredExchanges = exchanges.filter(e => e.status === statusFilter);

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Gestão de Trocas */}
      <div className="bg-[#0369A1] p-12 rounded-[4rem] border-8 border-white shadow-2xl relative overflow-hidden text-white">
        <RefreshCw className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
           <div className="space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                 {/* Fixed missing ShieldCheck component reference */}
                 <ShieldCheck size={14} className="text-[#FFFF00]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFF00]">Módulo de RMA & Garantia</span>
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Controle de Trocas</h2>
           </div>
           
           <div className="flex bg-white/10 p-2 rounded-[2.5rem] border border-white/10">
              <button 
                onClick={() => setActiveTab('tickets')} 
                className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'tickets' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-white hover:text-[#FFFF00]'}`}
              >
                <Layout size={18} /> Ver Tickets
              </button>
              <button 
                onClick={() => setActiveTab('design')} 
                className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'design' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-white hover:text-[#FFFF00]'}`}
              >
                <Palette size={18} /> Customizar Página
              </button>
           </div>
        </div>
      </div>

      {/* DASHBOARD DE TICKETS */}
      {activeTab === 'tickets' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="flex flex-wrap justify-center gap-4">
              {[
                { id: 'Pending', label: 'Em Análise', icon: AlertTriangle, color: 'text-yellow-500' },
                { id: 'Approved', label: 'Aprovadas', icon: CheckCircle2, color: 'text-green-500' },
                { id: 'Rejected', label: 'Canceladas', icon: XCircle, color: 'text-red-500' }
              ].map(status => (
                <button 
                  key={status.id}
                  onClick={() => setStatusFilter(status.id as any)}
                  className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] border-2 transition-all font-black uppercase text-[10px] tracking-widest ${statusFilter === status.id ? `bg-white ${status.color} border-current shadow-xl scale-105` : 'bg-sky-50 text-sky-300 border-sky-100 hover:bg-white'}`}
                >
                  <status.icon size={18} /> {status.label} 
                  <span className="ml-2 bg-sky-100 px-2 py-0.5 rounded-lg">{exchanges.filter(e => e.status === status.id).length}</span>
                </button>
              ))}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExchanges.map(ticket => (
                <div key={ticket.id} className="bg-white rounded-[4rem] border border-sky-50 shadow-2xl p-8 flex flex-col group hover:border-[#0EA5E9] transition-all relative">
                   <div className="space-y-6 flex-grow">
                      <div className="flex justify-between items-start">
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-sky-300 uppercase">Ticket #{ticket.id}</span>
                            <h3 className="text-xl font-black text-[#0369A1] uppercase italic truncate">{ticket.clientName}</h3>
                         </div>
                         <button onClick={() => setSelectedTicket(ticket)} className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl hover:bg-[#FFFF00] transition-colors shadow-sm">
                            <Eye size={18} />
                         </button>
                      </div>

                      <div className="aspect-video bg-sky-50 rounded-[2.5rem] overflow-hidden border-2 border-white shadow-inner relative">
                         {ticket.photo ? <img src={ticket.photo} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-sky-200"><ImageIcon size={40}/></div>}
                         <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-[#0369A1] uppercase">Evidência</div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-start gap-4 p-4 bg-sky-50/50 rounded-2xl border border-sky-50">
                            <Package size={20} className="text-[#0EA5E9] shrink-0" />
                            <div className="min-w-0">
                               <p className="text-[10px] font-black text-sky-400 uppercase leading-none">Produto / Referência</p>
                               <p className="font-bold text-[#0369A1] text-xs mt-1 truncate">{ticket.productId}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4 p-4 bg-red-50/30 rounded-2xl border border-red-50">
                            <AlertTriangle size={20} className="text-red-400 shrink-0" />
                            <div className="min-w-0">
                               <p className="text-[10px] font-black text-red-300 uppercase leading-none">Defeito</p>
                               <p className="text-[11px] font-medium text-sky-700 italic mt-1 line-clamp-2 leading-relaxed">"{ticket.reason}"</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-sky-50 flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-sky-300 uppercase">Aberto em</span>
                         <span className="text-xs font-black text-[#0369A1]">{new Date(ticket.date).toLocaleDateString()}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ticket.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                         {ticket.status === 'Pending' ? 'Análise' : ticket.status === 'Approved' ? 'Aprovada' : 'Cancelada'}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* PAINEL DE DESIGN DA PÁGINA PÚBLICA */}
      {activeTab === 'design' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <section className="lg:col-span-5 space-y-10">
              <div className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-10">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <Palette className="text-[#0EA5E9]" /> Visual & Cores
                 </h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Principal (Hero)</label>
                       <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer" value={config.returnsPage.primaryColor} onChange={e => handleUpdate({ primaryColor: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Fundo da Página</label>
                       <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer" value={config.returnsPage.backgroundColor || '#FFFFFF'} onChange={e => handleUpdate({ backgroundColor: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor dos Textos</label>
                       <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer" value={config.returnsPage.textColor || '#0369A1'} onChange={e => handleUpdate({ textColor: e.target.value })} />
                    </div>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-8">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <ImageIcon className="text-[#0EA5E9]" /> Imagem de Destaque
                 </h3>
                 <div className="relative group aspect-video bg-sky-50 rounded-[2.5rem] overflow-hidden border-4 border-dashed border-sky-100 flex items-center justify-center shadow-inner">
                    <img src={config.returnsPage.heroImage} className="w-full h-full object-cover" />
                    <button onClick={() => setImageToEdit(config.returnsPage.heroImage)} className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                       <Scissors size={24} /> <span className="text-[10px] font-black uppercase mt-2">Editar IA</span>
                    </button>
                 </div>
              </div>
           </section>

           <section className="lg:col-span-7 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-12">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <Type className="text-[#0EA5E9]" /> Conteúdo Textual
              </h3>
              <div className="space-y-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título (H1)</label>
                    <input className="w-full px-8 py-6 rounded-[2rem] bg-sky-50 border-none font-black text-3xl text-[#0369A1] italic outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.returnsPage.title} onChange={e => handleUpdate({ title: e.target.value })} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Subtítulo</label>
                    <input className="w-full px-8 py-6 rounded-[2rem] bg-sky-50 border-none font-bold text-lg text-sky-600 outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.returnsPage.subtitle} onChange={e => handleUpdate({ subtitle: e.target.value })} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Descrição / Política Detalhada</label>
                    <textarea rows={8} className="w-full px-8 py-8 rounded-[3rem] bg-sky-50 border-none font-medium text-lg text-sky-600 leading-relaxed outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.returnsPage.description || ''} onChange={e => handleUpdate({ description: e.target.value })} placeholder="Explique as regras de garantia aqui..." />
                 </div>
              </div>
           </section>
        </div>
      )}

      {/* MODAL DE DETALHES COMPLETOS DO TICKET */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[200] bg-[#0369A1]/95 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="bg-white rounded-[5rem] w-full max-w-5xl shadow-2xl border-8 border-white overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-sky-50 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-[#FFFF00] text-[#0369A1] rounded-3xl shadow-xl rotate-3"><AlertTriangle size={32} /></div>
                    <div>
                       <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">Inspeção Técnica</h3>
                       <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest mt-1">Status: {selectedTicket.status}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTicket(null)} className="p-4 bg-sky-50 rounded-full text-sky-200 hover:text-red-400 transition-all shadow-sm"><X size={32} /></button>
              </div>

              <div className="p-12 overflow-y-auto custom-scrollbar flex-grow space-y-12">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-10">
                       <section className="space-y-4">
                          <h4 className="text-xs font-black text-[#0EA5E9] uppercase tracking-widest border-b border-sky-50 pb-2">Dados do Solicitante</h4>
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0EA5E9] font-black italic shadow-inner">PF</div>
                             <div>
                                <p className="font-black text-[#0369A1] uppercase italic text-xl">{selectedTicket.clientName}</p>
                                <p className="text-sm font-bold text-sky-300">{selectedTicket.clientEmail}</p>
                             </div>
                          </div>
                       </section>

                       <section className="space-y-4">
                          <h4 className="text-xs font-black text-[#0EA5E9] uppercase tracking-widest border-b border-sky-50 pb-2">Informações da Compra</h4>
                          <div className="grid grid-cols-2 gap-6">
                             <div className="bg-sky-50 p-6 rounded-[2rem] border border-sky-100">
                                <p className="text-[9px] font-black text-sky-300 uppercase mb-1">ID da Venda / NF</p>
                                <p className="font-black text-[#0369A1] italic">#{selectedTicket.saleId}</p>
                             </div>
                             <div className="bg-sky-50 p-6 rounded-[2rem] border border-sky-100">
                                <p className="text-[9px] font-black text-sky-300 uppercase mb-1">Data da Compra</p>
                                <p className="font-black text-[#0369A1] italic">{selectedTicket.purchaseDate || '---'}</p>
                             </div>
                             <div className="bg-[#FFFF00]/10 p-6 rounded-[2rem] border border-[#FFFF00]/20 col-span-2">
                                <p className="text-[9px] font-black text-[#0369A1] uppercase mb-1">Tempo de Garantia Restante</p>
                                <p className="font-black text-[#0EA5E9] italic uppercase">{selectedTicket.warrantyPeriod || 'VERIFICAR TABELA'}</p>
                             </div>
                          </div>
                       </section>

                       <section className="space-y-4">
                          <h4 className="text-xs font-black text-red-400 uppercase tracking-widest border-b border-red-50 pb-2">Defeito Reclamado</h4>
                          <p className="text-lg font-medium text-sky-700 italic leading-relaxed bg-red-50/20 p-8 rounded-[3rem] border-2 border-dashed border-red-100">
                            "{selectedTicket.reason}"
                          </p>
                       </section>
                    </div>

                    <div className="space-y-8">
                       <section className="space-y-4">
                          <h4 className="text-xs font-black text-[#0EA5E9] uppercase tracking-widest border-b border-sky-50 pb-2">Evidência Fotográfica do Produto</h4>
                          <div className="aspect-square bg-sky-50 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative group">
                             {selectedTicket.photo ? (
                               <img src={selectedTicket.photo} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-[2000ms]" />
                             ) : (
                               <div className="h-full flex items-center justify-center opacity-20 text-[#0369A1]"><ImageIcon size={80}/></div>
                             )}
                          </div>
                       </section>
                    </div>
                 </div>
              </div>

              <div className="p-10 bg-sky-50/50 border-t border-sky-100 flex flex-col md:flex-row gap-6 shrink-0">
                 {selectedTicket.status === 'Pending' ? (
                    <>
                       <button onClick={() => handleStatusChange(selectedTicket.id, 'Approved')} className="flex-1 bg-green-500 text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                          <CheckCircle2 size={24} /> Aprovar Troca
                       </button>
                       <button onClick={() => handleStatusChange(selectedTicket.id, 'Rejected')} className="flex-1 bg-red-500 text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3">
                          <XCircle size={24} /> Cancelar Ticket
                       </button>
                    </>
                 ) : (
                    <div className="w-full text-center py-6 bg-white rounded-[2rem] border-2 border-sky-100">
                       <p className="text-xs font-black text-sky-300 uppercase tracking-[0.4em]">Este chamado já foi processado.</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* INTEGRAÇÃO STUDIO IA */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit}
          onSave={(edited) => { handleUpdate({ heroImage: edited }); setImageToEdit(null); }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default ReturnsManager;