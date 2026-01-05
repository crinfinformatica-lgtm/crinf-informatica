
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Edit3, Trash2, Save, Percent, X, 
  Briefcase, Upload, Image as ImageIcon,
  CheckCircle2, Info, Hash, Scissors,
  Palette, Type, Sliders, AlertCircle
} from 'lucide-react';
import { Service, ServiceCategory, TieredPrice } from '../types';
import ImageEditor from './ImageEditor';

const ServiceManager: React.FC = () => {
  const { services, addService, updateService, deleteService, config, updateConfig } = useApp();
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'design'>('catalog');
  const [imageToEdit, setImageToEdit] = useState<{ url: string; id?: string; type: 'service' | 'page' } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pageFileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdatePage = (updates: any) => {
    updateConfig({ servicesPage: { ...config.servicesPage, ...updates } });
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      const serviceToSave = editingService as Service;
      const exists = services.find(s => s.id === serviceToSave.id);
      exists ? updateService(serviceToSave) : addService(serviceToSave);
      setEditingService(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingService) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingService({ ...editingService, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePageHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleUpdatePage({ heroImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addTier = () => {
    const current = editingService?.tieredPrices || [];
    setEditingService({ 
      ...editingService, 
      tieredPrices: [...current, { minQty: 0, price: 0 }].sort((a,b) => a.minQty - b.minQty) 
    });
  };

  const updateTier = (idx: number, field: keyof TieredPrice, val: number) => {
    if (!editingService?.tieredPrices) return;
    const newTiers = [...editingService.tieredPrices];
    newTiers[idx] = { ...newTiers[idx], [field]: val };
    setEditingService({ ...editingService, tieredPrices: newTiers });
  };

  const removeTier = (idx: number) => {
    if (!editingService?.tieredPrices) return;
    setEditingService({ ...editingService, tieredPrices: editingService.tieredPrices.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      <input type="file" ref={pageFileInputRef} className="hidden" accept="image/*" onChange={handlePageHeroUpload} />

      {/* Header Administrativo */}
      <div className="bg-[#0369A1] p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-8 border-white">
        <Briefcase className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#FFFF00] text-[#0369A1] px-4 py-1 rounded-full border border-white/20">
                 <Hash size={14} className="font-black" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Serviços Digitais Master</span>
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Gestão de Catálogo & Layout</h2>
           </div>
           
           <div className="flex bg-white/10 p-2 rounded-[2rem] border border-white/10">
              <button onClick={() => setActiveTab('catalog')} className={`px-8 py-3 rounded-full font-black text-[10px] uppercase transition-all ${activeTab === 'catalog' ? 'bg-[#FFFF00] text-[#0369A1]' : 'text-white'}`}>Catálogo de Itens</button>
              <button onClick={() => setActiveTab('design')} className={`px-8 py-3 rounded-full font-black text-[10px] uppercase transition-all ${activeTab === 'design' ? 'bg-[#FFFF00] text-[#0369A1]' : 'text-white'}`}>Design da Página</button>
           </div>
        </div>
      </div>

      {activeTab === 'design' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4">
           <section className="lg:col-span-5 bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-10">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3"><Palette size={24}/> Visual da Página</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor de Fundo (Background)</label>
                    <input type="color" className="w-full h-16 rounded-2xl cursor-pointer" value={config.servicesPage.backgroundColor || '#FFFFFF'} onChange={e => handleUpdatePage({ backgroundColor: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Base de Textos</label>
                    <input type="color" className="w-full h-16 rounded-2xl cursor-pointer" value={config.servicesPage.textColor || '#0369A1'} onChange={e => handleUpdatePage({ textColor: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Banner de Destaque (Hero)</label>
                    <div className="relative group rounded-[2.5rem] overflow-hidden aspect-video border-4 border-dashed border-sky-100 shadow-inner bg-sky-50 flex items-center justify-center">
                       <img src={config.servicesPage.heroImage} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-4">
                          <button onClick={() => pageFileInputRef.current?.click()} className="bg-[#FFFF00] text-[#0369A1] px-6 py-2 rounded-xl font-black uppercase text-[9px]">Upload Novo</button>
                          <button onClick={() => setImageToEdit({ url: config.servicesPage.heroImage, type: 'page' })} className="bg-white/10 px-6 py-2 rounded-xl font-black uppercase text-[9px]">Studio IA</button>
                       </div>
                    </div>
                 </div>
              </div>
           </section>

           <section className="lg:col-span-7 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3"><Type size={24}/> Textos & Storytelling</h3>
              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título da Página (H1)</label>
                    <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-2xl text-[#0369A1] italic" value={config.servicesPage.title} onChange={e => handleUpdatePage({ title: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Subtítulo Informativo</label>
                    <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-lg text-sky-600" value={config.servicesPage.subtitle} onChange={e => handleUpdatePage({ subtitle: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Descrição Comercial Completa</label>
                    <textarea rows={5} className="w-full px-8 py-6 rounded-[2.5rem] bg-sky-50 border-none font-medium text-sky-700 leading-relaxed" value={config.servicesPage.description} onChange={e => handleUpdatePage({ description: e.target.value })} />
                 </div>
              </div>
           </section>
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter">Itens do Catálogo Digital</h3>
              <button 
                onClick={() => setEditingService({ id: `ds-${Date.now()}`, name: '', category: ServiceCategory.XEROX, basePrice: 0, description: '', tieredPrices: [], image: 'https://i.imgur.com/kS5sM6C.png' })}
                className="bg-[#FFFF00] text-[#0369A1] px-12 py-5 rounded-[2.2rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 border-4 border-white hover:scale-105 transition-all"
              >
                 <Plus size={24} /> Criar Novo Serviço
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map(service => (
                <div key={service.id} className="bg-white p-10 rounded-[4rem] border border-sky-50 shadow-2xl group flex flex-col hover:border-[#0EA5E9] transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div className="relative group/img w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl bg-sky-50">
                         <img src={service.image} className="w-full h-full object-cover" />
                         <button onClick={() => setEditingService(service)} className="absolute inset-0 bg-[#0369A1]/90 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white"><Edit3 size={18}/></button>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => setEditingService(service)} className="p-3 bg-sky-50 text-sky-400 rounded-xl hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-sm"><Edit3 size={16}/></button>
                         <button onClick={() => deleteService(service.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                      </div>
                   </div>
                   <div className="flex-grow space-y-3">
                      <span className="text-[9px] font-black bg-sky-50 text-[#0EA5E9] px-3 py-1 rounded-full uppercase tracking-widest border border-sky-100">{service.category}</span>
                      <h4 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-tight truncate">{service.name}</h4>
                      <p className="text-xs text-sky-400 font-medium italic line-clamp-2">{service.description}</p>
                   </div>
                   <div className="mt-8 pt-6 border-t border-sky-50 flex items-center justify-between">
                      <p className="text-[9px] font-black text-sky-300 uppercase tracking-widest">Preço Base: R$ {service.basePrice.toFixed(2)}</p>
                      <span className="text-[9px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase italic">{(service.tieredPrices || []).length} escalas</span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* MODAL EDITOR DE SERVIÇO */}
      {editingService && (
        <div className="fixed inset-0 z-[110] bg-[#0369A1]/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
           <div className="bg-white rounded-[4.5rem] w-full max-w-6xl shadow-2xl border-8 border-white animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-sky-50 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-[#FFFF00] text-[#0369A1] rounded-2xl shadow-xl rotate-3"><Briefcase size={32} /></div>
                    <div>
                       <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">Gestão de Serviço Individual</h3>
                       <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest mt-2">Configuração de Escala, Descrição e Imagem</p>
                    </div>
                 </div>
                 <button onClick={() => setEditingService(null)} className="p-4 bg-sky-50 rounded-full text-sky-300 hover:text-red-400 transition-all shadow-sm"><X size={36} /></button>
              </div>

              <form onSubmit={handleSaveService} className="p-10 lg:p-14 overflow-y-auto custom-scrollbar flex-grow space-y-12">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Imagem e Identidade */}
                    <div className="lg:col-span-4 space-y-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Capa Comercial do Serviço</label>
                          <div className="relative group aspect-square bg-sky-50 rounded-[4rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner ring-8 ring-sky-50/50">
                             {editingService.image ? <img src={editingService.image} className="w-full h-full object-cover" /> : <ImageIcon size={64} className="opacity-20 text-[#0EA5E9]" />}
                             <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#FFFF00] text-[#0369A1] px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2">
                                   <Upload size={18} /> Upload Imagem
                                </button>
                                <button type="button" onClick={() => setImageToEdit({ url: editingService.image!, id: editingService.id, type: 'service' })} className="bg-white/10 px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2">
                                   <Scissors size={18} /> Studio IA
                                </button>
                             </div>
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Breve Descrição Comercial</label>
                          <textarea rows={5} className="w-full px-6 py-4 rounded-3xl bg-sky-50 border-none font-medium text-sky-700 italic text-sm leading-relaxed" value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} placeholder="Ex: Impressões laser coloridas de alta definição em papel offset 90g..." />
                       </div>
                    </div>

                    {/* Dados e Escalas */}
                    <div className="lg:col-span-8 space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título do Serviço</label>
                             <input required className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic" value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Categoria</label>
                             <select className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1]" value={editingService.category} onChange={e => setEditingService({...editingService, category: e.target.value})}>
                                {Object.values(ServiceCategory).map(c => <option key={c} value={c}>{c}</option>)}
                             </select>
                          </div>
                       </div>

                       <div className="bg-[#0369A1] p-10 rounded-[3.5rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
                          <div className="flex justify-between items-center border-b border-white/20 pb-4">
                             <h4 className="text-xs font-black text-[#FFFF00] uppercase tracking-widest flex items-center gap-2"><Sliders size={18}/> Escalas de Preço Progressivo</h4>
                             <button type="button" onClick={addTier} className="p-3 bg-white/10 rounded-2xl hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all"><Plus size={20}/></button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-sky-200 px-1">Valor Unitário Base (R$)</label>
                                <input type="number" step="0.01" className="w-full px-6 py-4 rounded-2xl bg-white/10 border border-white/20 font-black text-xl text-[#FFFF00]" value={editingService.basePrice} onChange={e => setEditingService({...editingService, basePrice: Number(e.target.value)})} />
                             </div>
                             {(editingService.tieredPrices || []).map((tier, idx) => (
                               <div key={idx} className="bg-white/5 p-5 rounded-3xl border border-white/10 relative group/tier">
                                  <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase text-sky-300">A partir de (Qtd)</label>
                                        <input type="number" className="w-full bg-white/10 border-none rounded-xl px-4 py-2 font-bold text-white" value={tier.minQty} onChange={e => updateTier(idx, 'minQty', Number(e.target.value))} />
                                     </div>
                                     <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase text-sky-300">Novo Valor Unit.</label>
                                        <input type="number" step="0.01" className="w-full bg-white/10 border-none rounded-xl px-4 py-2 font-black text-[#FFFF00]" value={tier.price} onChange={e => updateTier(idx, 'price', Number(e.target.value))} />
                                     </div>
                                  </div>
                                  <button type="button" onClick={() => removeTier(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/tier:opacity-100 transition-all"><Trash2 size={12}/></button>
                               </div>
                             ))}
                          </div>
                          
                          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 flex items-start gap-4">
                             <AlertCircle size={20} className="text-[#FFFF00] shrink-0 mt-0.5" />
                             <p className="text-[10px] font-bold text-sky-100 uppercase leading-relaxed italic">
                               Dica técnica: Ao agendar o serviço, o sistema buscará a maior quantidade atingida para aplicar o menor preço correspondente automaticamente.
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-end gap-6 pt-12 border-t border-sky-50">
                    <button type="button" onClick={() => setEditingService(null)} className="px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-sky-300 hover:bg-sky-50 transition-all">Cancelar</button>
                    <button type="submit" className="px-20 py-6 rounded-[2.5rem] bg-[#0EA5E9] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-sky-300 flex items-center gap-4">
                       <CheckCircle2 size={24} /> Confirmar Cadastro
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Studio IA Integrado */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit.url}
          onSave={(edited) => { 
             if (imageToEdit.type === 'page') {
                handleUpdatePage({ heroImage: edited });
             } else if (imageToEdit.type === 'service' && editingService) {
                setEditingService({ ...editingService, image: edited });
             }
             setImageToEdit(null); 
          }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default ServiceManager;
