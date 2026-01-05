
import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, Search, TrendingUp, RefreshCw, Star, 
  Eye, Plus, Trash2, Mail, Calendar, 
  DollarSign, AlertTriangle, CheckCircle2, X,
  User, Camera, Scissors, ChevronRight, ShoppingBag, Upload
} from 'lucide-react';
import { Client } from '../types';
import ImageEditor from './ImageEditor';

const CommonClientsManager: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<'spent' | 'exchanges' | 'name'>('spent');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtro de Clientes Comuns (Pessoa Física)
  const individualClients = useMemo(() => {
    return clients.filter(c => c.type === 'Individual');
  }, [clients]);

  // Cálculos de BI por Cliente
  const clientsWithStats = useMemo(() => {
    return individualClients.map(client => {
      const totalSpent = client.history
        .filter(h => h.type === 'Purchase')
        .reduce((acc, curr) => acc + curr.value, 0);
      
      const totalExchanges = client.history
        .filter(h => h.type === 'Exchange').length;

      const avgRating = client.reviews && client.reviews.length > 0
        ? client.reviews.reduce((acc, curr) => acc + curr.rating, 0) / client.reviews.length
        : 0;

      return { ...client, totalSpent, totalExchanges, avgRating };
    });
  }, [individualClients]);

  // Ordenação e Busca
  const filteredClients = useMemo(() => {
    let result = clientsWithStats.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig === 'spent') result.sort((a, b) => b.totalSpent - a.totalSpent);
    if (sortConfig === 'exchanges') result.sort((a, b) => b.totalExchanges - a.totalExchanges);
    if (sortConfig === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [clientsWithStats, searchTerm, sortConfig]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingClient) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setEditingClient({ ...editingClient, logo: result });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Top Stats para o Header
  const topSpender = [...clientsWithStats].sort((a, b) => b.totalSpent - a.totalSpent)[0];
  const criticalReturns = [...clientsWithStats].sort((a, b) => b.totalExchanges - a.totalExchanges)[0];

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      const exists = clients.find(c => c.id === editingClient.id);
      if (exists) {
        updateClient(editingClient as Client);
      } else {
        addClient({ 
          ...editingClient, 
          type: 'Individual', 
          history: [], 
          reviews: [] 
        } as Client);
      }
      setEditingClient(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24 max-w-7xl mx-auto">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {/* Mini Dashboard de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0EA5E9] p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
           <TrendingUp className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32" />
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cliente Ouro (Gasto Total)</p>
           <h4 className="text-2xl font-black mt-1 italic truncate">{topSpender?.name || '---'}</h4>
           <p className="text-[#FFFF00] font-black text-xl mt-2">R$ {topSpender?.totalSpent.toFixed(2) || '0,00'}</p>
        </div>
        <div className="bg-red-500 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
           <RefreshCw className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32" />
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Alerta de Trocas</p>
           <h4 className="text-2xl font-black mt-1 italic truncate">{criticalReturns?.name || '---'}</h4>
           <p className="text-white font-black text-xl mt-2">{criticalReturns?.totalExchanges || 0} solicitações</p>
        </div>
        <div className="bg-white p-8 rounded-[3rem] border-4 border-[#FFFF00] shadow-xl flex flex-col justify-center items-center text-center">
           <p className="text-[10px] font-black text-[#0369A1] uppercase tracking-widest mb-4">Novo Cliente Físico</p>
           <button 
             onClick={() => setEditingClient({ id: Math.random().toString(36).substr(2, 9), name: '', email: '', logo: '' })}
             className="bg-[#0369A1] text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
           >
             <Plus size={16} /> Adicionar Manualmente
           </button>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-sky-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-200 group-focus-within:text-[#0EA5E9]" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0369A1] focus:ring-4 focus:ring-[#FFFF00]/40 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 bg-sky-50 p-1.5 rounded-2xl border border-sky-100 w-full md:w-auto">
           {[
             { id: 'spent', label: 'Mais Compras', icon: DollarSign },
             { id: 'exchanges', label: 'Mais Trocas', icon: RefreshCw },
             { id: 'name', label: 'Alfabética', icon: User },
           ].map(sort => (
             <button
               key={sort.id}
               onClick={() => setSortConfig(sort.id as any)}
               className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${sortConfig === sort.id ? 'bg-white text-[#0EA5E9] shadow-md' : 'text-sky-300'}`}
             >
               <sort.icon size={14} /> {sort.label}
             </button>
           ))}
        </div>
      </div>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white rounded-[3.5rem] p-8 border border-sky-50 shadow-2xl shadow-sky-500/5 group hover:border-[#0EA5E9]/30 transition-all flex flex-col">
            <div className="flex justify-between items-start mb-6">
               <div className="relative">
                  <div className="w-20 h-20 bg-sky-50 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl">
                    {client.logo ? (
                      <img src={client.logo} className="w-full h-full object-cover" alt={client.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sky-200"><User size={32} /></div>
                    )}
                  </div>
                  {client.totalSpent > 1000 && (
                    <div className="absolute -top-2 -right-2 bg-[#FFFF00] text-[#0369A1] p-1.5 rounded-full shadow-lg border-2 border-white">
                      <Star size={12} fill="currentColor" />
                    </div>
                  )}
               </div>
               <div className="flex gap-2">
                 <button onClick={() => setEditingClient(client)} className="p-3 bg-sky-50 text-sky-300 hover:text-[#0EA5E9] rounded-xl transition-all"><Scissors size={16} /></button>
                 <button onClick={() => deleteClient(client.id)} className="p-3 bg-red-50 text-red-200 hover:text-red-500 rounded-xl transition-all"><Trash2 size={16} /></button>
               </div>
            </div>

            <div className="space-y-4 flex-grow">
               <div>
                  <h4 className="text-xl font-black text-[#0369A1] uppercase italic leading-none truncate">{client.name}</h4>
                  <p className="text-[10px] text-sky-300 font-bold uppercase mt-1 truncate">{client.email}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-50">
                     <p className="text-[8px] font-black text-sky-300 uppercase tracking-widest">Total Compras</p>
                     <p className="text-lg font-black text-[#0EA5E9] italic">R$ {client.totalSpent.toFixed(2)}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${client.totalExchanges > 2 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                     <p className={`text-[8px] font-black uppercase tracking-widest ${client.totalExchanges > 2 ? 'text-red-400' : 'text-green-400'}`}>Trocas</p>
                     <p className={`text-lg font-black italic ${client.totalExchanges > 2 ? 'text-red-500' : 'text-green-500'}`}>{client.totalExchanges}</p>
                  </div>
               </div>

               {client.avgRating > 0 && (
                 <div className="flex items-center gap-1.5 px-2">
                    <Star size={14} className="text-[#FFFF00]" fill="currentColor" />
                    <span className="text-xs font-black text-[#0369A1]">{client.avgRating.toFixed(1)}</span>
                    <span className="text-[9px] font-bold text-sky-300 uppercase ml-2">Avaliação Média</span>
                 </div>
               )}
            </div>

            <button 
              onClick={() => setSelectedClient(client)}
              className="mt-8 w-full bg-sky-50 text-[#0369A1] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#0EA5E9] hover:text-white transition-all group/btn"
            >
              Consultar Histórico <Eye size={16} className="group-hover/btn:scale-110" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Detalhes do Cliente */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-[#0369A1]/80 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
           <div className="bg-white rounded-[4rem] w-full max-w-4xl shadow-2xl border-8 border-white relative animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-sky-50 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#FFFF00] rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                       {selectedClient.logo ? <img src={selectedClient.logo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#0369A1]"><User size={24} /></div>}
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">{selectedClient.name}</h3>
                       <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest mt-1">Cliente Pessoa Física</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedClient(null)} className="p-4 bg-sky-50 rounded-full text-sky-200 hover:text-red-400 transition-all"><X size={32} /></button>
              </div>

              <div className="p-10 lg:p-14 overflow-y-auto custom-scrollbar space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Timeline de Histórico */}
                    <div className="space-y-8">
                       <h4 className="text-sm font-black text-[#0369A1] uppercase tracking-widest flex items-center gap-3">
                          <ShoppingBag size={18} className="text-[#0EA5E9]" /> Timeline de Atividades
                       </h4>
                       <div className="space-y-4">
                          {selectedClient.history.length > 0 ? selectedClient.history.map((h, i) => (
                            <div key={i} className={`p-5 rounded-[2rem] border flex items-center justify-between ${h.type === 'Purchase' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                               <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-xl ${h.type === 'Purchase' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                     {h.type === 'Purchase' ? <CheckCircle2 size={16} /> : <RefreshCw size={16} />}
                                  </div>
                                  <div>
                                     <p className="text-[11px] font-black text-[#0369A1] uppercase">{h.type === 'Purchase' ? 'Compra Realizada' : 'Troca Solicitada'}</p>
                                     <p className="text-[9px] font-bold text-sky-400">{h.date}</p>
                                  </div>
                               </div>
                               <span className={`text-sm font-black italic ${h.type === 'Purchase' ? 'text-green-600' : 'text-red-500'}`}>R$ {h.value.toFixed(2)}</span>
                            </div>
                          )) : (
                            <div className="text-center py-10 bg-sky-50 rounded-3xl opacity-50">
                               <p className="text-xs font-black text-sky-400 uppercase">Nenhum histórico disponível</p>
                            </div>
                          )}
                       </div>
                    </div>

                    {/* Avaliações e Feedback */}
                    <div className="space-y-8">
                       <h4 className="text-sm font-black text-[#0369A1] uppercase tracking-widest flex items-center gap-3">
                          <Star size={18} className="text-[#FFFF00]" /> Comentários & Notas
                       </h4>
                       <div className="space-y-4">
                          {selectedClient.reviews && selectedClient.reviews.length > 0 ? selectedClient.reviews.map((r, i) => (
                            <div key={i} className="bg-sky-50/50 p-6 rounded-[2.5rem] border border-sky-100 relative group">
                               <div className="flex gap-1 text-[#FFFF00] mb-3">
                                  {[...Array(r.rating)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
                               </div>
                               <p className="text-xs font-bold text-[#0EA5E9] leading-relaxed italic">"{r.comment}"</p>
                               <div className="absolute top-6 right-6">
                                  <CheckCircle2 size={14} className="text-green-500" />
                               </div>
                            </div>
                          )) : (
                            <div className="text-center py-10 bg-sky-50 rounded-3xl opacity-50">
                               <p className="text-xs font-black text-sky-400 uppercase">Ainda não avaliou a loja</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Modal de Cadastro/Edição de Cliente */}
      {editingClient && (
        <div className="fixed inset-0 z-50 bg-[#0369A1]/80 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl border-8 border-white relative animate-in zoom-in-95 duration-500">
             <div className="p-10 border-b border-sky-50 flex justify-between items-center">
                <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">
                   {clients.find(c => c.id === editingClient.id) ? 'Editar Cliente' : 'Novo Cliente Individual'}
                </h3>
                <button onClick={() => setEditingClient(null)} className="p-4 bg-sky-50 rounded-full text-sky-200 hover:text-red-400 transition-all"><X size={32} /></button>
             </div>

             <form onSubmit={handleSaveClient} className="p-10 lg:p-14 space-y-10">
                <div className="flex flex-col items-center gap-6">
                   <div className="relative group">
                      <div className="w-32 h-32 bg-sky-50 rounded-[3rem] overflow-hidden border-4 border-dashed border-sky-100 flex items-center justify-center shadow-inner">
                         {editingClient.logo ? <img src={editingClient.logo} className="w-full h-full object-cover" /> : <User size={48} className="text-sky-200" />}
                         <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md rounded-[3rem] gap-2">
                            <button 
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-[#FFFF00] text-[#0369A1] p-3 rounded-xl flex items-center gap-2 font-black uppercase text-[8px] tracking-widest hover:scale-105 transition-all"
                            >
                              <Upload size={14} /> Upload
                            </button>
                            <button 
                              type="button"
                              onClick={() => setImageToEdit(editingClient.logo || 'https://i.imgur.com/kS5sM6C.png')}
                              className="bg-white/10 p-3 rounded-xl flex items-center gap-2 font-black uppercase text-[8px] tracking-widest hover:bg-white/20 transition-all"
                            >
                              <Scissors size={14} /> IA Studio
                            </button>
                         </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-[#FFFF00] p-3 rounded-2xl shadow-lg border-2 border-white text-[#0369A1]">
                        <Camera size={18} />
                      </div>
                   </div>
                   <p className="text-[9px] text-sky-300 font-bold uppercase tracking-widest">Foto de Perfil do Cliente</p>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Nome Completo</label>
                      <input required className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/40" value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} placeholder="Ex: João da Silva" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">E-mail de Contato</label>
                      <div className="relative">
                        <input required type="email" className="w-full px-14 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1] focus:ring-4 focus:ring-[#FFFF00]/40" value={editingClient.email} onChange={e => setEditingClient({...editingClient, email: e.target.value})} placeholder="joao@email.com" />
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-200" size={20} />
                      </div>
                   </div>
                </div>

                <div className="flex justify-end gap-6 pt-10 border-t border-sky-50">
                   <button type="button" onClick={() => setEditingClient(null)} className="px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-sky-300 hover:bg-sky-50 transition-all">Cancelar</button>
                   <button type="submit" className="px-16 py-6 rounded-[2.5rem] bg-[#0EA5E9] text-white font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-sky-50">
                      Confirmar Cadastro
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Editor de Imagem IA Integrado */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit}
          onSave={(editedUrl) => {
            if (editingClient) {
              setEditingClient({ ...editingClient, logo: editedUrl });
            }
            setImageToEdit(null);
          }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default CommonClientsManager;
