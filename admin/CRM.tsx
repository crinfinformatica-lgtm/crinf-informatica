
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, Search, Star, Award, TrendingUp, 
  Calendar, ShoppingBag, Mail, Phone,
  ChevronRight, Filter, Download, Zap, Heart,
  Plus, MapPin, CheckCircle2, X, MessageCircle,
  FileDown, FileUp, Clipboard, Eye, Edit3, Trash2
} from 'lucide-react';
import { Client, Sale } from '../types';

const CRM: React.FC = () => {
  const { clients, sales, addClient, updateClient, deleteClient, serviceOrders, config } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  
  // Novos estados de filtro
  const [activeTabFilter, setActiveTabFilter] = useState<'TODOS' | 'NAO_COMPRARAM' | 'DIVIDAS' | 'ANIVERSARIANTES'>('TODOS');
  const [alphabetFilter, setAlphabetFilter] = useState<string | null>(null);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const stats = useMemo(() => {
    return clients.map(client => {
      const clientSales = sales.filter(s => s.clientId === client.id || s.clientName === client.name);
      const clientOS = serviceOrders.filter(o => o.clientId === client.id || o.clientName === client.name);
      
      const totalSpent = clientSales.reduce((acc, curr) => acc + curr.total, 0);
      const purchaseCount = clientSales.length;
      
      // Lógica de Dívida: Tem venda ou OS não paga?
      const hasDebt = clientOS.some(o => !o.isPaid && o.status === 'Ready') || 
                      clientSales.some(s => s.status === 'Processing'); // Simulação de status pendente

      return { ...client, totalSpent, purchaseCount, hasDebt };
    });
  }, [clients, sales, serviceOrders]);

  const filtered = useMemo(() => {
    return stats.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.phone || '').includes(searchTerm);
      
      const matchAlphabet = alphabetFilter ? c.name.toUpperCase().startsWith(alphabetFilter) : true;
      
      let matchTab = true;
      if (activeTabFilter === 'NAO_COMPRARAM') matchTab = c.purchaseCount === 0;
      if (activeTabFilter === 'DIVIDAS') matchTab = c.hasDebt;
      // Aniversariantes: Simulação (ajustar se houver campo birthDate no futuro)
      if (activeTabFilter === 'ANIVERSARIANTES') matchTab = false; 

      return matchSearch && matchAlphabet && matchTab;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [stats, searchTerm, alphabetFilter, activeTabFilter]);

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      const exists = clients.find(c => c.id === editingClient.id);
      if (exists) {
        updateClient(editingClient as Client);
      } else {
        addClient({
          ...editingClient,
          id: `cli-${Date.now()}`,
          type: 'Individual',
          history: [],
          reviews: []
        } as Client);
      }
      setShowModal(false);
      setEditingClient(null);
    }
  };

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 font-sans">
      
      {/* BARRA DE AÇÕES SUPERIOR (ESTILO IMAGEM) */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-sky-100 flex flex-wrap gap-4 items-center">
        <div className="relative group flex-grow md:max-w-xs">
          <input 
            type="text" 
            placeholder="BUSCA" 
            className="w-full pl-5 pr-12 py-3 bg-slate-100 border-none rounded-2xl text-xs font-black text-[#0369A1] outline-none shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-300" size={18} />
        </div>

        <button onClick={() => { setEditingClient({ name: '', email: '', phone: '' }); setShowModal(true); }} className="bg-teal-50 text-teal-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-teal-100 transition-all shadow-sm">
          <Plus size={16} /> CLIENTE
        </button>
        <button onClick={() => setActiveTabFilter('NAO_COMPRARAM')} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTabFilter === 'NAO_COMPRARAM' ? 'bg-[#0369A1] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
          NÃO COMPRARAM
        </button>
        <button onClick={() => setActiveTabFilter('DIVIDAS')} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTabFilter === 'DIVIDAS' ? 'bg-[#0369A1] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
          DÍVIDAS ABERTAS
        </button>
        <button onClick={() => setActiveTabFilter('ANIVERSARIANTES')} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTabFilter === 'ANIVERSARIANTES' ? 'bg-[#0369A1] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
          ANIVERSARIANTES
        </button>

        <div className="flex gap-2 ml-auto">
          <button className="bg-sky-50 text-sky-600 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-sky-100 transition-all border border-sky-100"><FileUp size={16}/> IMPORTAR</button>
          <button className="bg-green-50 text-green-600 px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-green-100 transition-all border border-green-100"><FileDown size={16}/> EXPORTAR</button>
        </div>
      </div>

      {/* FILTRO ALFABÉTICO (ESTILO IMAGEM) */}
      <div className="flex flex-wrap gap-2 justify-center bg-white p-3 rounded-3xl border border-sky-50 shadow-sm overflow-x-auto no-scrollbar">
        <button 
          onClick={() => { setAlphabetFilter(null); setActiveTabFilter('TODOS'); }}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${!alphabetFilter && activeTabFilter === 'TODOS' ? 'bg-sky-100 text-[#0EA5E9]' : 'text-slate-400 hover:bg-sky-50'}`}
        >
          TODOS
        </button>
        <button className="px-3 py-1.5 text-[#FFFF00] hover:scale-110 transition-transform"><Star size={14} fill="currentColor" /></button>
        {alphabet.map(letra => (
          <button 
            key={letra}
            onClick={() => setAlphabetFilter(letra)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${alphabetFilter === letra ? 'bg-[#0EA5E9] text-white shadow-lg scale-110' : 'text-slate-400 hover:bg-sky-50'}`}
          >
            {letra}
          </button>
        ))}
      </div>

      {/* TABELA DE CLIENTES (ESTILO IMAGEM) */}
      <div className="bg-white rounded-[3rem] shadow-xl border border-sky-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-sky-50/30 border-b border-sky-100">
              <tr className="text-[10px] font-black text-sky-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-6">CLIENTE</th>
                <th className="px-6 py-6 text-center">CPF / CNPJ</th>
                <th className="px-6 py-6">EMAIL</th>
                <th className="px-6 py-6">FONE</th>
                <th className="px-6 py-6">OBSERVAÇÕES</th>
                <th className="px-6 py-6">ENDEREÇO</th>
                <th className="px-8 py-6 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-xs">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-sky-50/30 transition-all group">
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-3">
                        <button className={`${client.totalSpent > 1000 ? 'text-[#FFFF00]' : 'text-slate-200'} hover:text-[#FFFF00] transition-colors`}>
                           <Star size={16} fill={client.totalSpent > 1000 ? "currentColor" : "none"} />
                        </button>
                        <span className="text-[#0369A1] uppercase italic tracking-tighter text-sm">{client.name}</span>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-center text-slate-400 font-medium tracking-widest">
                     {client.address?.includes('-') ? client.address.split('-')[0] : '---'}
                  </td>
                  <td className="px-6 py-5 text-slate-400 font-medium">
                     {client.email || '.'}
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-3">
                        <span className="text-[#0EA5E9] font-black">{client.phone}</span>
                        <button 
                          onClick={() => openWhatsApp(client.phone)}
                          className="p-1.5 bg-teal-50 text-teal-500 rounded-lg hover:bg-teal-500 hover:text-white transition-all shadow-sm"
                        >
                          <MessageCircle size={14} fill="currentColor" className="text-current" />
                        </button>
                     </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="text-slate-300 text-[10px] uppercase font-bold italic line-clamp-1">{client.description || '.'}</span>
                  </td>
                  <td className="px-6 py-5">
                     <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-[10px] text-slate-500 uppercase italic font-medium max-w-[200px] truncate">
                        - {client.address || 'Não informado'}
                     </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                     <div className="flex justify-end gap-2">
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-200 transition-all shadow-sm" title="Duplicar">
                           <Clipboard size={16} />
                        </button>
                        <button className="p-2.5 bg-slate-50 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm" title="Ficha Técnica">
                           <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => { setEditingClient(client); setShowModal(true); }}
                          className="p-2.5 bg-sky-50 text-sky-500 rounded-xl hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                        >
                           <Edit3 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                   <td colSpan={7} className="py-20 text-center opacity-20 italic flex flex-col items-center gap-4">
                      <Users size={64} strokeWidth={1}/>
                      <p className="font-black uppercase text-xs tracking-widest">Nenhum cliente nesta listagem</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADICIONAR / EDITAR CLIENTE */}
      {showModal && editingClient && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl border-8 border-white animate-in zoom-in-95">
              <div className="p-10 border-b border-sky-50 flex justify-between items-center bg-teal-600 text-white rounded-t-[3rem]">
                 <div className="flex items-center gap-4">
                    <Users size={28} />
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Ficha Cadastral CRM</h3>
                 </div>
                 <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform"><X size={32}/></button>
              </div>
              <form onSubmit={handleSaveClient} className="p-10 space-y-6 bg-slate-50 rounded-b-[4rem]">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest px-2">Nome Completo *</label>
                    <input required className="w-full px-8 py-5 rounded-[2rem] bg-white border-none font-black text-[#0369A1] shadow-sm italic text-xl" value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">WhatsApp</label>
                       <input required className="w-full px-8 py-4 rounded-2xl bg-white border-none font-bold text-[#0369A1] shadow-sm" placeholder="(41) 9..." value={editingClient.phone} onChange={e => setEditingClient({...editingClient, phone: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">E-mail</label>
                       <input type="email" className="w-full px-8 py-4 rounded-2xl bg-white border-none font-bold text-[#0369A1] shadow-sm" value={editingClient.email} onChange={e => setEditingClient({...editingClient, email: e.target.value})} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Endereço Completo</label>
                    <input className="w-full px-8 py-4 rounded-2xl bg-white border-none font-bold text-[#0369A1] shadow-sm" value={editingClient.address} onChange={e => setEditingClient({...editingClient, address: e.target.value})} placeholder="Rua, Número, Bairro..." />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Observações / Meta-dados</label>
                    <textarea rows={3} className="w-full px-8 py-4 rounded-[2rem] bg-white border-none font-medium text-sky-600 shadow-sm italic" value={editingClient.description} onChange={e => setEditingClient({...editingClient, description: e.target.value})} placeholder="Perfil do cliente..." />
                 </div>
                 <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 rounded-[2rem] font-black uppercase text-xs text-slate-400 hover:bg-slate-200 transition-all">Cancelar</button>
                    <button type="submit" className="bg-[#0EA5E9] text-white px-16 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:scale-105 transition-all border-b-4 border-sky-800">
                       SALVAR CLIENTE
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CRM;
