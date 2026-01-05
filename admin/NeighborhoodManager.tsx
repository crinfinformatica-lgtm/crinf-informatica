
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, Plus, Search, Edit3, Trash2, 
  DollarSign, Truck, Save, X, CheckCircle2,
  AlertCircle, ChevronRight, LayoutGrid, List
} from 'lucide-react';
import { NeighborhoodRate } from '../types';

const NeighborhoodManager: React.FC = () => {
  const { neighborhoods, addNeighborhood, updateNeighborhood, deleteNeighborhood } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingNeighborhood, setEditingNeighborhood] = useState<Partial<NeighborhoodRate> | null>(null);

  const filtered = useMemo(() => {
    return neighborhoods.filter(n => n.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [neighborhoods, searchTerm]);

  const handleNew = () => {
    setEditingNeighborhood({ id: Date.now().toString(), name: '', rate: 0 });
    setShowModal(true);
  };

  const handleEdit = (n: NeighborhoodRate) => {
    setEditingNeighborhood(n);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNeighborhood) {
      const exists = neighborhoods.find(n => n.id === editingNeighborhood.id);
      exists 
        ? updateNeighborhood(editingNeighborhood as NeighborhoodRate) 
        : addNeighborhood(editingNeighborhood as NeighborhoodRate);
      setShowModal(false);
      setEditingNeighborhood(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-24">
      {/* Hero da Logística */}
      <div className="bg-[#0369A1] p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-8 border-white">
        <MapPin className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                 <Truck size={14} className="text-[#FFFF00]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFF00]">Cálculo Dinâmico Ativo</span>
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Gestão de Bairros</h2>
              <p className="max-w-xl font-medium opacity-80 text-lg italic leading-relaxed">
                Configure os bairros atendidos e suas respectivas taxas de entrega. Estes valores alimentam automaticamente o checkout da loja e o serviço Leva e Traz.
              </p>
           </div>
           <button 
             onClick={handleNew}
             className="bg-[#FFFF00] text-[#0369A1] px-12 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 border-4 border-white hover:scale-105 transition-all active:scale-95"
           >
             <Plus size={24} /> Novo Bairro
           </button>
        </div>
      </div>

      {/* Busca e Resumo */}
      <div className="bg-white p-8 rounded-[3rem] border border-sky-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="relative w-full md:w-[500px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-200 group-focus-within:text-[#0EA5E9]" size={24} />
          <input 
            type="text" 
            placeholder="Localizar bairro ou localidade..."
            className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1] focus:ring-4 focus:ring-[#FFFF00]/50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-8 px-4">
           <div className="text-center">
              <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Atendidos</p>
              <h4 className="text-3xl font-black text-[#0369A1] italic">{neighborhoods.length}</h4>
           </div>
           <div className="w-px h-10 bg-sky-100" />
           <div className="text-center">
              <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Taxa Média</p>
              <h4 className="text-3xl font-black text-[#0EA5E9] italic">
                R$ {(neighborhoods.reduce((acc, curr) => acc + curr.rate, 0) / (neighborhoods.length || 1)).toFixed(2)}
              </h4>
           </div>
        </div>
      </div>

      {/* Grid de Bairros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(n => (
          <div key={n.id} className="bg-white p-8 rounded-[3.5rem] border border-sky-50 shadow-xl group hover:border-[#0EA5E9] transition-all relative overflow-hidden flex flex-col">
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(n)} className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl hover:bg-[#FFFF00] hover:text-[#0369A1] shadow-sm"><Edit3 size={16} /></button>
                <button onClick={() => deleteNeighborhood(n.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white shadow-sm"><Trash2 size={16} /></button>
             </div>

             <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-sky-50 text-[#0EA5E9] rounded-2xl group-hover:bg-[#FFFF00] group-hover:text-[#0369A1] transition-colors"><MapPin size={24}/></div>
                <h4 className="text-lg font-black text-[#0369A1] uppercase italic leading-none truncate pr-12">{n.name}</h4>
             </div>

             <div className="mt-auto pt-6 border-t border-sky-50 flex items-center justify-between">
                <span className="text-[9px] font-black text-sky-300 uppercase tracking-widest">Referência Frete</span>
                <span className="text-2xl font-black text-[#0EA5E9] italic tracking-tighter">R$ {n.rate.toFixed(2)}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Modal CRUD */}
      {showModal && editingNeighborhood && (
        <div className="fixed inset-0 z-50 bg-[#0369A1]/95 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="bg-white rounded-[4rem] w-full max-w-xl shadow-2xl border-8 border-white p-12 text-center space-y-10 animate-in zoom-in-95">
              <div className="w-24 h-24 bg-[#FFFF00] text-[#0369A1] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl ring-8 ring-sky-50">
                 <MapPin size={48} strokeWidth={3} />
              </div>
              
              <div>
                 <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">Configuração de Localidade</h3>
                 <p className="text-sky-400 font-bold uppercase text-[10px] tracking-widest mt-2">Defina o nome e o custo logístico</p>
              </div>

              <form onSubmit={handleSave} className="space-y-6 text-left">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-300 uppercase tracking-widest px-2">Nome do Bairro / Localidade</label>
                    <input 
                      required 
                      className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none"
                      value={editingNeighborhood.name}
                      onChange={e => setEditingNeighborhood({...editingNeighborhood, name: e.target.value})}
                      placeholder="Ex: Águas Claras"
                    />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-300 uppercase tracking-widest px-2">Taxa de Frete (R$)</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         step="0.01" 
                         required 
                         className="w-full px-14 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-3xl text-[#0EA5E9] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none"
                         value={editingNeighborhood.rate || ''}
                         onChange={e => setEditingNeighborhood({...editingNeighborhood, rate: Number(e.target.value)})}
                         placeholder="0,00"
                       />
                       <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-200" size={24} />
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button type="submit" className="flex-grow bg-[#0EA5E9] text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4">
                       <Save size={20} /> Salvar Bairro
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="p-6 bg-sky-50 text-sky-300 rounded-[2.5rem] hover:text-red-400 transition-colors">
                       <X size={24} />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default NeighborhoodManager;
