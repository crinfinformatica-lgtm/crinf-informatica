
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, Plus, Search, CheckCircle2, 
  Clock, X, Monitor,
  Package, DollarSign, Edit2, Zap, Save, Trash2, 
  Play, ChevronRight, History, MoreHorizontal,
  Briefcase, List as ListIcon, ShieldCheck, ClipboardList,
  ArrowRight, CheckSquare, User, AlertCircle, Smartphone,
  Laptop, Cpu, Settings, MessageSquare, Calendar, ShieldAlert,
  Eye, AlertTriangle, Info, Printer, Layers, PlusCircle,
  UserCheck, Box, Terminal
} from 'lucide-react';
import { ServiceOrder, OSStatus, PerformedService, EquipmentChecklist, Client } from '../types';

const OSManager: React.FC = () => {
  const { 
    serviceOrders = [], addServiceOrder, updateServiceOrder, 
    technicalServices = [], clients = [] 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState<'ATIVAS' | 'CONCLUÍDAS' | 'CANCELADAS'>('ATIVAS');
  const [showModal, setShowModal] = useState(false);
  const [editingOS, setEditingOS] = useState<Partial<ServiceOrder> | null>(null);
  const [modalTab, setModalTab] = useState<'DADOS' | 'CHECKLIST' | 'SERVICOS' | 'ACOMPANHAMENTO'>('DADOS');
  
  // Categorias Dinâmicas do Usuário
  const [eqCategories, setEqCategories] = useState<string[]>(["Computador", "Notebook", "Monitor", "Placa Mãe", "Placa Notebook", "Smartphone", "Impressora"]);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const filtered = useMemo(() => {
    return serviceOrders.filter(os => {
      const matchSearch = (os.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (os.id || '').includes(searchTerm) || 
                          (os.equipment || '').toLowerCase().includes(searchTerm.toLowerCase());
      let matchStatus = false;
      if (activeTabFilter === 'ATIVAS') matchStatus = ['Budget', 'Waiting_Parts', 'In_Progress'].includes(os.status);
      else if (activeTabFilter === 'CONCLUÍDAS') matchStatus = ['Ready', 'Delivered'].includes(os.status);
      else if (activeTabFilter === 'CANCELADAS') matchStatus = os.status === 'Cancelled';
      return matchSearch && matchStatus;
    });
  }, [serviceOrders, searchTerm, activeTabFilter]);

  const handleOpenNewOS = () => {
    setEditingOS({
      id: `${Math.floor(10000 + Math.random() * 90000)}`,
      clientId: '',
      clientName: '',
      clientPhone: '',
      equipment: '',
      serialNumber: '',
      accessories: '',
      problemDescription: '',
      status: 'Budget',
      isPaid: false,
      priority: 'Medium',
      laborValue: 0,
      partsValue: 0,
      totalValue: 0,
      partsUsed: [],
      servicesPerformed: [],
      entryDate: new Date().toISOString(),
      technicianName: 'CRISTIANO',
      checklist: { type: 'Other', customFields: [{ label: 'Integridade Física', value: 'Ok' }, { label: 'Selos de Garantia', value: 'Ok' }] }
    });
    setModalTab('DADOS');
    setShowModal(true);
  };

  const handleSelectClient = (client: Client) => {
    if (!editingOS) return;
    setEditingOS({
      ...editingOS,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone
    });
  };

  const handleAddNewCategory = () => {
    if (newCatName && !eqCategories.includes(newCatName)) {
      const updated = [...eqCategories, newCatName].sort();
      setEqCategories(updated);
      if (editingOS) setEditingOS({ ...editingOS, equipment: newCatName });
      setNewCatName('');
      setShowNewCatInput(false);
    }
  };

  const handleAddCheckItem = () => {
    if (newChecklistItem && editingOS?.checklist) {
      const current = editingOS.checklist.customFields || [];
      setEditingOS({
        ...editingOS,
        checklist: { ...editingOS.checklist, customFields: [...current, { label: newChecklistItem, value: 'Ok' }] }
      });
      setNewChecklistItem('');
    }
  };

  const handleSaveOS = () => {
    if (editingOS && editingOS.clientName && editingOS.equipment) {
      const osToSave = {
        ...editingOS,
        totalValue: (editingOS.laborValue || 0) + (editingOS.partsValue || 0)
      } as ServiceOrder;
      
      const exists = serviceOrders.find(o => o.id === osToSave.id);
      exists ? updateServiceOrder(osToSave) : addServiceOrder(osToSave);
      setShowModal(false);
      setEditingOS(null);
    } else {
      alert("Selecione um Cliente e o Tipo de Equipamento.");
    }
  };

  const statusMap: Record<OSStatus, { label: string, color: string, icon: any }> = {
    Budget: { label: 'Orçamento', color: 'bg-sky-50 text-sky-500', icon: ClipboardList },
    Waiting_Parts: { label: 'Aguard. Peças', color: 'bg-amber-50 text-amber-600', icon: Package },
    In_Progress: { label: 'Em Manutenção', color: 'bg-indigo-50 text-indigo-600', icon: Play },
    Ready: { label: 'Pronta', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
    Delivered: { label: 'Entregue', color: 'bg-slate-50 text-slate-400', icon: Save },
    Cancelled: { label: 'Cancelada', color: 'bg-red-50 text-red-600', icon: X }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header OS */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-10 rounded-[3.5rem] shadow-xl border border-sky-100 gap-8">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-[#0EA5E9] text-white rounded-3xl shadow-xl rotate-3">
             <Wrench size={40} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">Ordem de Serviço</h2>
            <p className="text-[10px] font-black text-sky-300 uppercase tracking-[0.4em] mt-2 italic">Rastreabilidade & Checklist Master</p>
          </div>
        </div>
        <button onClick={handleOpenNewOS} className="bg-[#FFFF00] text-[#0369A1] px-12 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-4 border-white">
           <Plus size={24} /> ABRIR NOVA O.S.
        </button>
      </div>

      {/* Tabs de Filtro */}
      <div className="flex bg-white/50 p-2 rounded-[2.5rem] border border-sky-100 w-fit shadow-sm">
        {['ATIVAS', 'CONCLUÍDAS', 'CANCELADAS'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTabFilter(tab as any)}
            className={`px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest transition-all ${activeTabFilter === tab ? 'bg-[#0369A1] text-white shadow-xl scale-105' : 'text-sky-300 hover:text-[#0369A1]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid de O.S. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(os => {
          const StatusIcon = statusMap[os.status].icon;
          return (
            <div key={os.id} className="bg-white rounded-[4rem] border border-sky-50 shadow-2xl overflow-hidden group hover:border-[#0EA5E9] transition-all flex flex-col">
               <div className={`p-10 ${statusMap[os.status].color} flex justify-between items-start transition-colors`}>
                  <div className="space-y-1">
                     <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Ticket #{os.id}</span>
                     <h3 className="text-2xl font-black uppercase italic leading-none">{os.clientName}</h3>
                  </div>
                  <div className="p-4 bg-white/50 rounded-2xl shadow-sm"><StatusIcon size={28}/></div>
               </div>

               <div className="p-10 space-y-8 flex-grow">
                  <div className="flex items-center gap-6">
                     <div className="p-4 bg-sky-50 text-[#0EA5E9] rounded-2xl shadow-inner"><Box size={24}/></div>
                     <div>
                        <p className="text-[10px] font-black text-sky-300 uppercase leading-none">Equipamento</p>
                        <p className="font-black text-base uppercase italic text-[#0369A1] mt-1">{os.equipment}</p>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 italic text-sm text-sky-600 line-clamp-2 leading-relaxed shadow-inner">
                    "{os.problemDescription}"
                  </div>
                  <div className="flex justify-between items-end">
                     <div className="space-y-1">
                        <p className="text-[9px] font-black text-sky-300 uppercase tracking-widest">Previsão</p>
                        <span className="text-sky-500 font-black text-xs uppercase">{os.predictedDate ? new Date(os.predictedDate).toLocaleDateString() : 'N/A'}</span>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-sky-300 uppercase tracking-widest">Total O.S.</p>
                        <p className="text-3xl font-black text-[#0EA5E9] italic tracking-tighter">R$ {os.totalValue.toFixed(2)}</p>
                     </div>
                  </div>
               </div>

               <button 
                 onClick={() => { setEditingOS(os); setShowModal(true); }}
                 className="w-full py-6 bg-sky-50 text-[#0369A1] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-[#FFFF00] transition-all border-t border-sky-100 flex items-center justify-center gap-4"
               >
                 <Eye size={20}/> Gerenciar Técnico
               </button>
            </div>
          );
        })}
      </div>

      {/* MODAL MESTRE O.S. */}
      {showModal && editingOS && (
        <div className="fixed inset-0 z-[150] bg-[#0369A1]/95 backdrop-blur-3xl flex items-center justify-center p-4 lg:p-12 overflow-y-auto">
           <div className="bg-white rounded-[5rem] w-full max-w-6xl shadow-2xl border-8 border-white animate-in zoom-in-95 duration-500 flex flex-col max-h-[95vh]">
              
              <div className="p-12 bg-slate-50 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 shrink-0">
                 <div className="flex items-center gap-8">
                    {/* // Fixed: Added missing Terminal import from lucide-react above and using it here */}
                    <div className="p-5 bg-[#FFFF00] text-[#0369A1] rounded-3xl shadow-xl rotate-3"><Terminal size={36} /></div>
                    <div>
                       <h3 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">Gestão de Atendimento #{editingOS.id}</h3>
                       <p className="text-[11px] font-black text-sky-300 uppercase tracking-widest mt-2 italic">Responsável: {editingOS.technicianName}</p>
                    </div>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-5 bg-white rounded-full text-sky-200 hover:text-red-400 transition-all shadow-sm border border-sky-100"><X size={36}/></button>
              </div>

              <div className="px-12 py-6 bg-white border-b border-sky-50 flex gap-6 overflow-x-auto no-scrollbar shrink-0">
                 {[
                   { id: 'DADOS', label: '1. Identificação', icon: UserCheck },
                   { id: 'CHECKLIST', label: '2. Checklist IA', icon: ClipboardList },
                   { id: 'SERVICOS', label: '3. Financeiro', icon: ListIcon },
                   { id: 'ACOMPANHAMENTO', label: '4. Evolução', icon: History }
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setModalTab(tab.id as any)}
                     className={`px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-4 whitespace-nowrap ${modalTab === tab.id ? 'bg-sky-100 text-[#0EA5E9] shadow-inner' : 'text-slate-300 hover:text-sky-300'}`}
                   >
                     <tab.icon size={20}/> {tab.label}
                   </button>
                 ))}
              </div>

              <div className="flex-grow overflow-y-auto p-12 space-y-12 custom-scrollbar">
                 
                 {/* ABA 1: CLIENTE E EQUIPAMENTO */}
                 {modalTab === 'DADOS' && (
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-in slide-in-from-bottom-4">
                      <div className="space-y-10">
                         <div className="flex items-center gap-4 border-b border-sky-100 pb-4">
                            <UserCheck size={28} className="text-[#0EA5E9]"/>
                            <h4 className="text-2xl font-black text-[#0369A1] uppercase italic">Vínculo de Cliente</h4>
                         </div>
                         <div className="space-y-8">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Localizar no CRM</label>
                               <select 
                                 className="w-full px-8 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic shadow-inner outline-none focus:ring-4 focus:ring-[#FFFF00]/40"
                                 value={editingOS.clientId}
                                 onChange={e => {
                                    const c = clients.find(cl => cl.id === e.target.value);
                                    if(c) handleSelectClient(c);
                                 }}
                               >
                                  <option value="">-- Selecione o Cliente --</option>
                                  {clients.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()} ({c.phone})</option>)}
                               </select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-sky-300 uppercase px-2">Telefone</label>
                                  <input readOnly className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-sky-500 opacity-60" value={editingOS.clientPhone} />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-sky-300 uppercase px-2">Data Entrada</label>
                                  <input readOnly className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-sky-500 opacity-60" value={new Date(editingOS.entryDate!).toLocaleDateString()} />
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-10">
                         <div className="flex items-center gap-4 border-b border-sky-100 pb-4">
                            <Monitor size={28} className="text-[#0EA5E9]"/>
                            <h4 className="text-2xl font-black text-[#0369A1] uppercase italic">Dados do Equipamento</h4>
                         </div>
                         <div className="space-y-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Tipo / Categoria Técnica</label>
                               <div className="flex gap-4">
                                  {showNewCatInput ? (
                                    <div className="flex-grow flex gap-3">
                                       <input 
                                         className="flex-grow px-8 py-5 rounded-[2.5rem] bg-white border-4 border-[#FFFF00] font-black text-[#0369A1] italic" 
                                         placeholder="Nova Categoria..."
                                         value={newCatName}
                                         onChange={e => setNewCatName(e.target.value)}
                                         autoFocus
                                       />
                                       <button type="button" onClick={handleAddNewCategory} className="p-5 bg-[#0EA5E9] text-white rounded-3xl shadow-xl"><CheckCircle2 size={32}/></button>
                                       <button type="button" onClick={() => setShowNewCatInput(false)} className="p-5 bg-red-50 text-red-500 rounded-3xl"><X size={32}/></button>
                                    </div>
                                  ) : (
                                    <>
                                       <select 
                                         required 
                                         className="flex-grow px-8 py-5 rounded-[2.5rem] bg-sky-50 border-none font-black text-2xl text-[#0369A1] italic appearance-none cursor-pointer outline-none focus:ring-4 focus:ring-[#FFFF00]/40 shadow-inner" 
                                         value={editingOS.equipment} 
                                         onChange={e => setEditingOS({...editingOS, equipment: e.target.value})}
                                       >
                                          <option value="">-- Selecione o Hardware --</option>
                                          {eqCategories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
                                       </select>
                                       <button 
                                         type="button" 
                                         onClick={() => setShowNewCatInput(true)}
                                         className="p-6 bg-sky-100 text-[#0EA5E9] rounded-3xl hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-xl"
                                       >
                                          <PlusCircle size={32}/>
                                       </button>
                                    </>
                                  )}
                               </div>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Nº Série / Modelo Específico</label>
                               <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-sky-600 outline-none" value={editingOS.serialNumber} onChange={e => setEditingOS({...editingOS, serialNumber: e.target.value})} placeholder="Ex: SN-882299 / Dell G15" />
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-2 bg-sky-50 p-12 rounded-[4rem] border-2 border-dashed border-sky-200 space-y-6">
                         <div className="flex items-center gap-4">
                            <AlertTriangle size={28} className="text-orange-500" />
                            <h4 className="text-xl font-black text-[#0369A1] uppercase italic">Defeito Relatado</h4>
                         </div>
                         <textarea 
                           rows={3}
                           className="w-full px-10 py-8 rounded-[3.5rem] bg-white border-none font-medium text-lg text-sky-700 italic leading-relaxed outline-none shadow-xl focus:ring-4 focus:ring-[#FFFF00]/40"
                           value={editingOS.problemDescription}
                           onChange={e => setEditingOS({...editingOS, problemDescription: e.target.value})}
                           placeholder="Descreva detalhadamente o sintoma apresentado..."
                         />
                      </div>
                   </div>
                 )}

                 {/* ABA 2: CHECKLIST PERSONALIZÁVEL */}
                 {modalTab === 'CHECKLIST' && (
                   <div className="space-y-12 animate-in slide-in-from-bottom-4">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
                         <h4 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">Itens de Inspeção</h4>
                         <div className="flex gap-4 w-full md:w-auto">
                            <input 
                              className="flex-grow md:w-80 bg-sky-50 border-none rounded-[1.5rem] px-8 py-4 font-bold text-[#0EA5E9] outline-none shadow-inner"
                              placeholder="Novo item de conferência..."
                              value={newChecklistItem}
                              onChange={e => setNewChecklistItem(e.target.value)}
                            />
                            <button 
                              type="button" 
                              onClick={handleAddCheckItem}
                              className="bg-[#0EA5E9] text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] shadow-xl hover:bg-black transition-all flex items-center gap-3"
                            >
                               <Plus size={20}/> ADICIONAR
                            </button>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {(editingOS.checklist?.customFields || []).map((item, idx) => (
                           <div key={idx} className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-sky-50 space-y-8 flex flex-col items-center text-center group hover:border-[#0EA5E9] transition-all">
                              <div className="p-6 bg-sky-50 text-[#0EA5E9] rounded-[2rem] group-hover:bg-[#FFFF00] group-hover:text-[#0369A1] transition-all shadow-inner"><Monitor size={40}/></div>
                              <h5 className="font-black text-[#0369A1] uppercase text-xs tracking-widest truncate w-full">{item.label}</h5>
                              <div className="flex gap-2 w-full">
                                 {['Ok', 'Defeito', 'Avaria', 'N/A'].map(state => (
                                   <button 
                                     key={state}
                                     type="button"
                                     onClick={() => {
                                        const current = editingOS.checklist!.customFields!;
                                        const newList = current.map(f => f.label === item.label ? { ...f, value: state } : f);
                                        setEditingOS({ ...editingOS, checklist: { ...editingOS.checklist!, customFields: newList } });
                                     }}
                                     className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all border-2 ${item.value === state ? 'bg-[#0369A1] text-white border-white shadow-lg' : 'bg-slate-50 text-slate-300 border-transparent hover:bg-sky-50'}`}
                                   >
                                     {state}
                                   </button>
                                 ))}
                              </div>
                              <button 
                                type="button" 
                                onClick={() => {
                                  const newList = editingOS.checklist!.customFields!.filter((_, i) => i !== idx);
                                  setEditingOS({ ...editingOS, checklist: { ...editingOS.checklist!, customFields: newList } });
                                }}
                                className="text-red-300 hover:text-red-500 text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-all"
                              >
                                Excluir do Checklist
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {/* ABA 3: FINANCEIRO DA OS */}
                 {modalTab === 'SERVICOS' && (
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in slide-in-from-bottom-4">
                      <div className="lg:col-span-8 space-y-8">
                         <div className="flex justify-between items-center px-4">
                            <h4 className="text-2xl font-black text-[#0369A1] uppercase italic">Detalhamento Financeiro</h4>
                         </div>
                         <div className="bg-white p-12 rounded-[4rem] border-4 border-dashed border-sky-100 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="p-8 bg-sky-50 rounded-full"><DollarSign size={64} className="text-sky-200" /></div>
                            <p className="text-sky-400 font-bold uppercase text-[11px] tracking-[0.3em]">Módulo de Lançamento de Itens e Mão de Obra</p>
                            <div className="grid grid-cols-2 gap-8 w-full max-w-xl">
                               <div className="space-y-2 text-left">
                                  <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Total Mão de Obra (R$)</label>
                                  <input type="number" step="0.01" className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-2xl text-[#0EA5E9] italic shadow-inner" value={editingOS.laborValue || ''} onChange={e => setEditingOS({...editingOS, laborValue: Number(e.target.value)})} placeholder="0,00" />
                               </div>
                               <div className="space-y-2 text-left">
                                  <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Total Peças (R$)</label>
                                  <input type="number" step="0.01" className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-2xl text-[#0EA5E9] italic shadow-inner" value={editingOS.partsValue || ''} onChange={e => setEditingOS({...editingOS, partsValue: Number(e.target.value)})} placeholder="0,00" />
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="lg:col-span-4 bg-[#0369A1] p-12 rounded-[4.5rem] text-white shadow-2xl space-y-12 relative overflow-hidden flex flex-col justify-center">
                         <div className="absolute -right-10 -bottom-10 opacity-10"><Zap size={240}/></div>
                         <div className="space-y-4 relative z-10 text-center">
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#FFFF00]">Total Estimado O.S.</span>
                            <h2 className="text-7xl font-black italic tracking-tighter">R$ {((editingOS.laborValue || 0) + (editingOS.partsValue || 0)).toFixed(2)}</h2>
                         </div>
                         <div className="p-8 bg-white/10 rounded-[3rem] border border-white/10 relative z-10 flex items-center gap-6">
                            <Info size={32} className="text-[#FFFF00] shrink-0" />
                            <p className="text-[10px] font-bold uppercase leading-relaxed italic opacity-80">Valores baseados em pré-orçamento. Mudanças requerem aprovação do cliente.</p>
                         </div>
                      </div>
                   </div>
                 )}

                 {/* ABA 4: ACOMPANHAMENTO TÉCNICO */}
                 {modalTab === 'ACOMPANHAMENTO' && (
                   <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in slide-in-from-bottom-4">
                      <div className="lg:col-span-5 space-y-8">
                         <h4 className="text-xl font-black text-[#0369A1] uppercase italic border-b border-sky-50 pb-4">Status da Manutenção</h4>
                         <div className="grid grid-cols-1 gap-4">
                            {Object.entries(statusMap).map(([key, val]) => (
                               <button 
                                 key={key} 
                                 onClick={() => setEditingOS({...editingOS, status: key as OSStatus})}
                                 className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all font-black text-xs uppercase tracking-widest ${editingOS.status === key ? 'bg-[#0369A1] border-[#FFFF00] text-white shadow-xl scale-[1.03]' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-sky-50'}`}
                               >
                                  <div className="flex items-center gap-5">
                                     <val.icon size={24}/>
                                     <span>{val.label}</span>
                                  </div>
                                  {editingOS.status === key && <CheckCircle2 size={24}/>}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div className="lg:col-span-7 bg-white p-12 rounded-[4rem] border-2 border-sky-50 shadow-2xl flex flex-col h-[500px]">
                         <div className="flex justify-between items-center mb-10 border-b border-sky-50 pb-6">
                            <h4 className="text-2xl font-black text-[#0369A1] uppercase italic flex items-center gap-4"><MessageSquare size={32} className="text-[#0EA5E9]"/> Histórico Interno</h4>
                         </div>
                         <div className="flex-grow overflow-y-auto custom-scrollbar pr-4 space-y-6 opacity-40 flex flex-col items-center justify-center italic font-black uppercase text-[10px] tracking-widest">
                            Linha do tempo técnica em construção...
                         </div>
                         <div className="pt-10 border-t border-sky-50 flex gap-6">
                            <input className="flex-grow bg-sky-50 border-none rounded-[1.5rem] px-8 py-5 font-bold text-sky-600 outline-none" placeholder="Registrar novo avanço técnico..." />
                            <button className="bg-[#0EA5E9] text-white p-5 rounded-3xl shadow-xl hover:scale-110 transition-all"><Save size={28}/></button>
                         </div>
                      </div>
                   </div>
                 )}

              </div>

              {/* Footer Modal OS */}
              <div className="p-12 bg-white border-t border-sky-50 flex justify-between items-center shrink-0">
                 <div className="flex gap-4">
                    <button type="button" onClick={() => window.print()} className="p-6 bg-sky-50 text-sky-400 rounded-[2rem] hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-sm"><Printer size={28}/></button>
                 </div>
                 <div className="flex gap-8">
                    <button type="button" onClick={() => setShowModal(false)} className="px-12 py-6 rounded-[2rem] font-black uppercase text-xs text-sky-300 hover:bg-sky-50 transition-all">Descartar</button>
                    <button 
                      type="button" 
                      onClick={handleSaveOS}
                      className="bg-[#0369A1] text-white px-24 py-7 rounded-[3rem] font-black uppercase text-sm tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-white/20 flex items-center gap-6"
                    >
                       <Save size={32}/> SALVAR ATENDIMENTO
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default OSManager;
