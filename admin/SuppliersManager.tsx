
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, Plus, Edit3, Trash2, Mail, Phone, 
  Search, ShieldCheck, X, CheckCircle2,
  Package, ExternalLink, Star, 
  MapPin, DollarSign, Zap, AlertTriangle, ChevronDown,
  Navigation, UserCheck, Barcode, TrendingUp, Clock, RefreshCw,
  BarChart2, Save
} from 'lucide-react';
import { Supplier } from '../types';

const SuppliersManager: React.FC = () => {
  const { suppliers = [], addSupplier, updateSupplier, deleteSupplier } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Partial<Supplier> | null>(null);
  
  const [supplierCategories, setSupplierCategories] = useState(['HARDWARE', 'PERIFÉRICOS', 'IMPRESSÃO', 'REDES', 'SUPRIMENTOS']);
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const filtered = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (s.doc || '').includes(searchTerm)
    );
  }, [suppliers, searchTerm]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier && editingSupplier.name) {
      const reliability = ((editingSupplier.priceScore || 3) + (editingSupplier.deliverySpeed || 3) + (editingSupplier.exchangeQuality || 3)) / 3;
      
      const supplierToSave = { 
        ...editingSupplier, 
        id: editingSupplier.id || `sup-${Date.now()}`,
        reliability: Number(reliability.toFixed(1))
      } as Supplier;

      const exists = suppliers.find(s => s.id === supplierToSave.id);
      exists ? updateSupplier(supplierToSave) : addSupplier(supplierToSave);
      setShowModal(false);
      setEditingSupplier(null);
    }
  };

  const handleAddNewCategory = () => {
    if (newCatName && !supplierCategories.includes(newCatName.toUpperCase())) {
      setSupplierCategories([...supplierCategories, newCatName.toUpperCase()]);
      if (editingSupplier) setEditingSupplier({ ...editingSupplier, category: newCatName.toUpperCase() });
      setNewCatName('');
      setShowNewCatInput(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 font-sans">
      
      {/* Header Visual BI */}
      <div className="bg-[#0369A1] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-8 border-white">
        <Truck className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                 <ShieldCheck size={14} className="text-[#FFFF00]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFF00]">Monitoramento de Suprimentos</span>
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Gestão de Fornecedores</h2>
              <p className="max-w-xl font-medium opacity-80 text-lg italic leading-relaxed">
                Compare performance, monitore trocas (RMA) e identifique as melhores condições de compra.
              </p>
           </div>
           <button onClick={() => { setEditingSupplier({ name: '', priceScore: 3, deliverySpeed: 3, exchangeQuality: 3, category: 'HARDWARE' }); setShowModal(true); }} className="bg-[#FFFF00] text-[#0369A1] px-12 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl border-4 border-white hover:scale-105 transition-all">
             <Plus size={24} /> ADICIONAR FORNECEDOR
           </button>
        </div>
      </div>

      {/* Comparativo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[3rem] border border-sky-100 shadow-xl flex items-center gap-6 group hover:border-emerald-400 transition-all">
            <div className="p-5 bg-emerald-50 text-emerald-500 rounded-3xl shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all"><DollarSign size={32}/></div>
            <div>
               <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Melhor Preço (Ranking)</p>
               <h4 className="text-xl font-black text-[#0369A1] uppercase italic truncate">
                  {suppliers.sort((a,b) => (b.priceScore || 0) - (a.priceScore || 0))[0]?.name || 'Analisando...'}
               </h4>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[3rem] border border-sky-100 shadow-xl flex items-center gap-6 group hover:border-sky-400 transition-all">
            <div className="p-5 bg-sky-50 text-[#0EA5E9] rounded-3xl shadow-inner group-hover:bg-[#0EA5E9] group-hover:text-white transition-all"><Clock size={32}/></div>
            <div>
               <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Entrega Mais Rápida</p>
               <h4 className="text-xl font-black text-[#0369A1] uppercase italic truncate">
                  {suppliers.sort((a,b) => (b.deliverySpeed || 0) - (a.deliverySpeed || 0))[0]?.name || 'Analisando...'}
               </h4>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[3rem] border border-sky-100 shadow-xl flex items-center gap-6 group hover:border-orange-400 transition-all">
            <div className="p-5 bg-orange-50 text-orange-500 rounded-3xl shadow-inner group-hover:bg-orange-500 group-hover:text-white transition-all"><RefreshCw size={32}/></div>
            <div>
               <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Melhor RMA (Trocas)</p>
               <h4 className="text-xl font-black text-[#0369A1] uppercase italic truncate">
                  {suppliers.sort((a,b) => (b.exchangeQuality || 0) - (a.exchangeQuality || 0))[0]?.name || 'Analisando...'}
               </h4>
            </div>
         </div>
      </div>

      {/* Busca e Filtro */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-sky-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-200 group-focus-within:text-[#0EA5E9]" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou CNPJ..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0369A1] focus:ring-4 focus:ring-[#FFFF00]/40 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <div className="text-center px-6 border-r border-sky-50">
              <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Total Parceiros</p>
              <p className="text-2xl font-black text-[#0369A1] italic">{suppliers.length}</p>
           </div>
        </div>
      </div>

      {/* Grid de Fornecedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(sup => (
          <div key={sup.id} className="bg-white p-10 rounded-[4rem] border border-sky-50 shadow-2xl group hover:border-[#0EA5E9] transition-all flex flex-col relative overflow-hidden">
            <div className="absolute -right-10 -top-10 text-sky-50 opacity-20 group-hover:rotate-12 transition-transform duration-1000"><Truck size={200}/></div>
            
            <div className="relative z-10 flex justify-between items-start mb-8">
               <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-[#0EA5E9] shadow-inner border-2 border-white">
                  <UserCheck size={32} />
               </div>
               <div className="flex items-center gap-1 text-[#FFFF00]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < (sup.reliability || 3) ? 'currentColor' : 'none'} className={i < (sup.reliability || 3) ? 'text-[#FFFF00]' : 'text-slate-200'} />)}
               </div>
            </div>

            <div className="relative z-10 space-y-2 mb-8">
               <span className="text-[9px] font-black text-sky-300 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-100">{sup.category}</span>
               <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter truncate pr-4">{sup.name}</h3>
               <p className="text-[10px] font-bold text-sky-400 italic">CPF/CNPJ: {sup.doc || 'N/A'}</p>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-3 mb-8">
               <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100 shadow-inner group-hover:bg-emerald-50 transition-colors">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1 group-hover:text-emerald-400">Preço</p>
                  <span className="text-sm font-black text-slate-700 italic group-hover:text-emerald-600">{sup.priceScore}/5</span>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100 shadow-inner group-hover:bg-sky-50 transition-colors">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1 group-hover:text-sky-400">Entrega</p>
                  <span className="text-sm font-black text-slate-700 italic group-hover:text-sky-600">{sup.deliverySpeed}/5</span>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100 shadow-inner group-hover:bg-orange-50 transition-colors">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1 group-hover:text-orange-400">Troca</p>
                  <span className="text-sm font-black text-slate-700 italic group-hover:text-orange-600">{sup.exchangeQuality}/5</span>
               </div>
            </div>

            <div className="relative z-10 mt-auto flex justify-between items-center pt-6 border-t border-sky-50">
               <div className="flex gap-4">
                  <button onClick={() => setEditingSupplier(sup)} className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl hover:bg-[#FFFF00] transition-all"><Edit3 size={18}/></button>
                  <button onClick={() => deleteSupplier(sup.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18}/></button>
               </div>
               <span className="text-[10px] font-black text-sky-200 uppercase tracking-widest">ID: {sup.id.split('-')[1] || '001'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDITAR FORNECEDOR (FIEL À IMAGEM) */}
      {showModal && editingSupplier && (
        <div className="fixed inset-0 z-[150] bg-[#0369A1]/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
           <div className="bg-white rounded-[2.5rem] w-full max-w-6xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              
              {/* Header Modal (Estilo Screenshot) */}
              <div className="bg-[#0D9488] p-5 flex justify-between items-center px-10">
                 <h3 className="text-white font-bold uppercase text-sm tracking-widest">EDITAR FORNECEDOR</h3>
                 <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white hover:rotate-90 transition-all"><X size={28}/></button>
              </div>

              <form onSubmit={handleSave} className="p-10 lg:p-14 bg-white">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Campos de Cadastro (Organização Grid Screenshot) */}
                    <div className="lg:col-span-8 grid grid-cols-3 gap-6">
                       <div className="space-y-1">
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="CÓDIGO (OPCIONAL)" value={editingSupplier.code} onChange={e => setEditingSupplier({...editingSupplier, code: e.target.value})} />
                       </div>
                       <div className="relative">
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="CEP" value={editingSupplier.cep} onChange={e => setEditingSupplier({...editingSupplier, cep: e.target.value})} />
                          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded shadow-sm"><Navigation size={14} className="text-slate-400" /></button>
                       </div>
                       <div>
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="NÚMERO" value={editingSupplier.number} onChange={e => setEditingSupplier({...editingSupplier, number: e.target.value})} />
                       </div>

                       <div className="col-span-1">
                          <input required className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-black text-orange-600 uppercase placeholder:text-orange-300 focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="NOME *" value={editingSupplier.name} onChange={e => setEditingSupplier({...editingSupplier, name: e.target.value})} />
                       </div>
                       <div className="col-span-2">
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="LOGRADOURO" value={editingSupplier.street} onChange={e => setEditingSupplier({...editingSupplier, street: e.target.value})} />
                       </div>

                       <div>
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="EMAIL" value={editingSupplier.email} onChange={e => setEditingSupplier({...editingSupplier, email: e.target.value})} />
                       </div>
                       <div className="col-span-2">
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="COMPLEMENTO" value={editingSupplier.complement} onChange={e => setEditingSupplier({...editingSupplier, complement: e.target.value})} />
                       </div>

                       <div>
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="TELEFONE" value={editingSupplier.phone} onChange={e => setEditingSupplier({...editingSupplier, phone: e.target.value})} />
                       </div>
                       <div className="col-span-2">
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="BAIRRO" value={editingSupplier.neighborhood} onChange={e => setEditingSupplier({...editingSupplier, neighborhood: e.target.value})} />
                       </div>

                       <div>
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="CPF / CNPJ" value={editingSupplier.doc} onChange={e => setEditingSupplier({...editingSupplier, doc: e.target.value})} />
                       </div>
                       <div className="col-span-2">
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="CIDADE" value={editingSupplier.city} onChange={e => setEditingSupplier({...editingSupplier, city: e.target.value})} />
                       </div>

                       <div>
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="REPRESENTANTE" value={editingSupplier.representative} onChange={e => setEditingSupplier({...editingSupplier, representative: e.target.value})} />
                       </div>
                       <div className="col-span-2">
                          <input className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-bold text-slate-500 uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-[#0D9488]/20 outline-none" placeholder="ESTADO" value={editingSupplier.state} onChange={e => setEditingSupplier({...editingSupplier, state: e.target.value})} />
                       </div>
                    </div>

                    {/* Barra Lateral: Categorias e BI (Lado Direito Screenshot) */}
                    <div className="lg:col-span-4 space-y-10">
                       <div className="flex gap-2">
                          <div className="flex-grow relative">
                             <select className="w-full bg-slate-100 border-none rounded-lg p-5 text-xs font-black text-slate-500 uppercase appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-[#0D9488]/20" value={editingSupplier.category} onChange={e => setEditingSupplier({...editingSupplier, category: e.target.value})}>
                                {supplierCategories.map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                             <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                          </div>
                          <button type="button" onClick={() => setShowNewCatInput(!showNewCatInput)} className="bg-sky-100 text-[#0EA5E9] p-5 rounded-lg hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-sm"><Plus size={20}/></button>
                       </div>

                       {showNewCatInput && (
                         <div className="flex gap-2 animate-in slide-in-from-top-2">
                            <input className="flex-grow bg-white border-2 border-sky-100 p-4 rounded-xl text-xs font-bold uppercase" placeholder="Nova Categoria" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                            <button type="button" onClick={handleAddNewCategory} className="bg-[#0D9488] text-white px-5 rounded-xl shadow-lg hover:scale-105 transition-all"><Check size={20}/></button>
                         </div>
                       )}

                       <div className="bg-slate-50 rounded-3xl p-8 border-2 border-slate-100 space-y-8">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-3">
                             <BarChart2 size={16} className="text-[#0EA5E9]"/> Monitoramento de Performance (1-5)
                          </h4>
                          {[
                            { label: 'Competitividade Preço', field: 'priceScore', icon: DollarSign, color: 'accent-emerald-500' },
                            { label: 'Velocidade de Entrega', field: 'deliverySpeed', icon: Clock, color: 'accent-sky-500' },
                            { label: 'Eficiência RMA (Troca)', field: 'exchangeQuality', icon: RefreshCw, color: 'accent-orange-500' }
                          ].map(metric => (
                            <div key={metric.field} className="space-y-3">
                               <div className="flex justify-between text-[9px] font-black uppercase text-slate-500 px-1">
                                  <span className="flex items-center gap-2"><metric.icon size={12}/> {metric.label}</span>
                                  <span className="text-[#0EA5E9] text-sm">{(editingSupplier as any)[metric.field] || 3}</span>
                               </div>
                               <input type="range" min="1" max="5" step="1" className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${metric.color}`} value={(editingSupplier as any)[metric.field] || 3} onChange={e => setEditingSupplier({...editingSupplier, [metric.field]: Number(e.target.value)})} />
                            </div>
                          ))}
                       </div>

                       <div className="p-8 bg-[#0369A1]/5 rounded-[2.5rem] border-2 border-dashed border-[#0369A1]/20 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="p-4 bg-white rounded-2xl shadow-xl text-[#0EA5E9]"><Zap size={24}/></div>
                          <p className="text-[10px] font-bold text-[#0369A1] uppercase italic leading-relaxed">
                            O ranking global é atualizado com base nestas métricas para otimizar suas compras.
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* Footer Botões (Fiel à foto) */}
                 <div className="mt-14 flex justify-between items-center border-t border-slate-100 pt-10 px-4">
                    <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 font-black uppercase text-xs tracking-[0.2em] hover:text-red-400 transition-colors">CANCELAR</button>
                    <button type="submit" className="text-[#0EA5E9] font-black uppercase text-xs tracking-[0.3em] hover:underline hover:scale-105 transition-all">SALVAR ALTERAÇÕES</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const Check = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default SuppliersManager;
