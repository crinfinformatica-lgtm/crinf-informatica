
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Edit3, Trash2, Save, X, 
  Monitor, Smartphone, Laptop, Printer as PrinterIcon,
  Search, Eye, EyeOff, Scissors, Upload, Wand2,
  CheckCircle2, Info, DollarSign, ListChecks,
  // Add missing Image import aliased as ImageIcon
  Image as ImageIcon
} from 'lucide-react';
import { TechnicalService } from '../types';
import ImageEditor from './ImageEditor';

const TechnicalServiceCatalog: React.FC = () => {
  const { technicalServices, addTechnicalService, updateTechnicalService, deleteTechnicalService } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingService, setEditingService] = useState<Partial<TechnicalService> | null>(null);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Computador', 'Notebook', 'Impressora', 'Monitor', 'Celular', 'Outros'];

  const filtered = technicalServices.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      const exists = technicalServices.find(s => s.id === editingService.id);
      exists 
        ? updateTechnicalService(editingService as TechnicalService)
        : addTechnicalService({ ...editingService, id: `ts-${Date.now()}` } as TechnicalService);
      setEditingService(null);
    }
  };

  const toggleVisibility = (service: TechnicalService) => {
    updateTechnicalService({ ...service, isVisible: !service.isVisible });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Computador': return <Monitor size={24} />;
      case 'Notebook': return <Laptop size={24} />;
      case 'Impressora': return <PrinterIcon size={24} />;
      case 'Celular': return <Smartphone size={24} />;
      default: return <ListChecks size={24} />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => setEditingService(prev => prev ? {...prev, image: ev.target?.result as string} : prev);
          reader.readAsDataURL(file);
        }
      }} />

      <div className="bg-[#0369A1] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-8 border-white">
        <ListChecks className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-4 text-center md:text-left">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Catálogo Técnico</h2>
              <p className="font-bold opacity-70 uppercase tracking-widest text-xs max-w-lg">
                Cadastre procedimentos padrão de assistência. Estes itens alimentam a O.S., o Leva e Traz e a vitrine de serviços para o cliente.
              </p>
           </div>
           <button 
             onClick={() => setEditingService({ name: '', price: 0, category: 'Computador', description: '', isVisible: true, image: 'https://i.imgur.com/kS5sM6C.png' })}
             className="bg-[#FFFF00] text-[#0369A1] px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-4 border-4 border-white"
           >
             <Plus size={24} /> Novo Procedimento
           </button>
        </div>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-200" size={24} />
        <input 
          type="text" 
          placeholder="Pesquisar procedimentos..."
          className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] border-none bg-white shadow-xl focus:ring-4 focus:ring-[#FFFF00]/40 outline-none text-[#0369A1] font-bold"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(service => (
          <div key={service.id} className="bg-white rounded-[4rem] border border-sky-50 shadow-2xl p-10 flex flex-col group hover:border-[#0EA5E9] transition-all">
             <div className="flex justify-between items-start mb-8">
                <div className={`p-5 rounded-3xl shadow-inner ${service.isVisible ? 'bg-sky-50 text-[#0EA5E9]' : 'bg-slate-100 text-slate-300'}`}>
                   {getCategoryIcon(service.category)}
                </div>
                <div className="flex gap-2">
                   <button onClick={() => toggleVisibility(service)} className={`p-3 rounded-xl shadow-sm transition-all ${service.isVisible ? 'bg-green-50 text-green-500 hover:bg-green-100' : 'bg-red-50 text-red-400 hover:bg-red-100'}`}>
                      {service.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                   </button>
                   <button onClick={() => setEditingService(service)} className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-sm"><Edit3 size={18} /></button>
                   <button onClick={() => deleteTechnicalService(service.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={18} /></button>
                </div>
             </div>

             <div className="flex-grow space-y-4">
                <span className="text-[10px] font-black bg-sky-50 text-[#0EA5E9] px-4 py-1.5 rounded-full uppercase tracking-widest">{service.category}</span>
                <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-tight line-clamp-2">{service.name}</h3>
                <p className="text-sm text-sky-400 font-medium italic leading-relaxed line-clamp-3">{service.description}</p>
             </div>

             <div className="mt-10 pt-8 border-t border-sky-50 flex items-center justify-between">
                <div>
                   <p className="text-[9px] font-black text-sky-300 uppercase tracking-widest mb-1">Mão de Obra Sugerida</p>
                   <p className="text-3xl font-black text-[#0EA5E9] italic tracking-tighter">R$ {service.price.toFixed(2)}</p>
                </div>
                {!service.isVisible && <span className="bg-red-50 text-red-400 px-3 py-1 rounded-lg text-[8px] font-black uppercase italic">Privado (Admin)</span>}
             </div>
          </div>
        ))}
      </div>

      {editingService && (
        <div className="fixed inset-0 z-[110] bg-[#0369A1]/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
           <div className="bg-white rounded-[5rem] w-full max-w-5xl shadow-2xl border-8 border-white animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-sky-50 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-[#FFFF00] text-[#0369A1] rounded-2xl shadow-xl rotate-3"><ListChecks size={32} /></div>
                    <div>
                       <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">Cadastro de Procedimento</h3>
                       <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest mt-2">Defina Padrões para O.S. e Loja</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingService(null)} className="p-4 bg-sky-50 rounded-full text-sky-200 hover:text-red-400 transition-all shadow-sm"><X size={36} /></button>
              </div>

              <form onSubmit={handleSave} className="p-12 lg:p-16 overflow-y-auto custom-scrollbar flex-grow space-y-12">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-5 space-y-10">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Capa Comercial (Página Serviços)</label>
                          <div className="relative group aspect-square bg-sky-50 rounded-[4.5rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner ring-8 ring-sky-50/50">
                             {editingService.image ? <img src={editingService.image} className="w-full h-full object-cover" /> : <ImageIcon size={80} className="opacity-20" />}
                             <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#FFFF00] text-[#0369A1] px-8 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-3 shadow-xl"><Upload size={18} /> Upload</button>
                                <button type="button" onClick={() => setImageToEdit(editingService.image || '')} className="bg-white/10 px-8 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-3 border border-white/20"><Scissors size={18} /> Studio IA</button>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="lg:col-span-7 space-y-12">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Nome do Serviço</label>
                            <input required className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/40 outline-none" value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} placeholder="Ex: Formatação Master" />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Categoria Técnica</label>
                            <select className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1] appearance-none" value={editingService.category} onChange={e => setEditingService({...editingService, category: e.target.value as any})}>
                               {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Valor da Mão de Obra (R$)</label>
                          <div className="relative">
                             <input type="number" step="0.01" required className="w-full px-16 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-4xl text-[#0EA5E9] italic focus:ring-4 focus:ring-[#FFFF00]/40 outline-none" value={editingService.price || ''} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} placeholder="0,00" />
                             <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-200" size={32} />
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Descrição / Instruções Técnicas</label>
                          <textarea rows={6} required className="w-full px-10 py-8 rounded-[3.5rem] bg-sky-50 border-none font-medium text-lg text-sky-600 leading-relaxed outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} placeholder="O que está incluso neste procedimento?" />
                       </div>
                       
                       <div className="flex items-center gap-6 p-8 bg-sky-50 rounded-[3rem] border border-sky-100">
                          <div className="flex-grow">
                             <h4 className="font-black text-[#0369A1] uppercase italic tracking-tighter">Exibir na Página de Serviços?</h4>
                             <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Torne este item público para consulta do cliente</p>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setEditingService({...editingService, isVisible: !editingService.isVisible})}
                            className={`w-24 h-12 rounded-full relative transition-all duration-500 border-2 ${editingService.isVisible ? 'bg-[#0EA5E9] border-sky-300' : 'bg-slate-200 border-slate-300'}`}
                          >
                             <div className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-xl transition-all duration-500 ${editingService.isVisible ? 'left-14' : 'left-1'}`} />
                          </button>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-end gap-6 pt-12 border-t border-sky-50">
                    <button type="submit" className="px-20 py-7 rounded-[3rem] bg-[#0EA5E9] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-sky-300 flex items-center gap-4">
                       <CheckCircle2 size={28} /> Salvar Procedimento
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit}
          onSave={(edited) => {
            setEditingService(prev => prev ? {...prev, image: edited} : prev);
            setImageToEdit(null);
          }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default TechnicalServiceCatalog;
