
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Save, History, Target, Eye, ShieldCheck, 
  Quote, Plus, Trash2, Edit3, X, CheckCircle2, 
  Scissors, Image as ImageIcon, Type, Layout,
  Sliders, Wand2, Info, Upload, Star, Users, Palette
} from 'lucide-react';
import ImageEditor from './ImageEditor';
import { Testimonial } from '../types';

const AboutManager: React.FC = () => {
  const { config, updateConfig } = useApp();
  const [imageToEdit, setImageToEdit] = useState<{ url: string; target: string } | null>(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'mission' | 'testimonials' | 'design'>('content');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const handleUpdate = (updates: any) => {
    updateConfig({
      aboutContent: { ...config.aboutContent, ...updates }
    });
  };

  const triggerUpload = (target: string) => {
    setUploadTarget(target);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageToEdit({ url: result, target: uploadTarget || '' });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const applyEditedImage = (editedUrl: string) => {
    if (imageToEdit?.target === 'main') handleUpdate({ image: editedUrl });
    if (imageToEdit?.target === 'logo') handleUpdate({ logo: editedUrl });
    if (imageToEdit?.target === 'avatar' && editingTestimonial) {
       setEditingTestimonial({ ...editingTestimonial, avatar: editedUrl });
    }
    setImageToEdit(null);
  };

  const handleSaveTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonial) {
      const current = config.aboutContent.testimonials || [];
      const exists = current.find(t => t.id === editingTestimonial.id);
      let newList;
      if (exists) {
        newList = current.map(t => t.id === editingTestimonial.id ? editingTestimonial as Testimonial : t);
      } else {
        newList = [...current, { ...editingTestimonial, id: `test-${Date.now()}` } as Testimonial];
      }
      handleUpdate({ testimonials: newList });
      setShowTestimonialModal(false);
      setEditingTestimonial(null);
    }
  };

  const deleteTestimonial = (id: string) => {
    const current = config.aboutContent.testimonials || [];
    handleUpdate({ testimonials: current.filter(t => t.id !== id) });
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {/* Header Administrativo Reconstruído */}
      <div className="bg-[#0369A1] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-8 border-white">
        <History className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
           <div className="space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                 <CheckCircle2 size={14} className="text-[#FFFF00]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFF00]">Módulo Sobre Nós Ativo</span>
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Gestão Institucional</h2>
           </div>
           
           <div className="flex bg-white/10 p-2 rounded-[2.5rem] border border-white/10 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveSubTab('content')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'content' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-white hover:text-[#FFFF00]'}`}>
                <Layout size={18} /> História & Identidade
              </button>
              <button onClick={() => setActiveSubTab('mission')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'mission' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-white hover:text-[#FFFF00]'}`}>
                <Target size={18} /> Tríade Estratégica
              </button>
              <button onClick={() => setActiveSubTab('testimonials')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'testimonials' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-white hover:text-[#FFFF00]'}`}>
                <Quote size={18} /> Mural de Depoimentos
              </button>
              <button onClick={() => setActiveSubTab('design')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'design' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-white hover:text-[#FFFF00]'}`}>
                <Palette size={18} /> Design & Cores
              </button>
           </div>
        </div>
      </div>

      {/* ABA: HISTÓRIA & IDENTIDADE */}
      {activeSubTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="lg:col-span-5 space-y-10">
              <section className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-8">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <ImageIcon className="text-[#0EA5E9]" /> Imagem de Destaque
                 </h3>
                 <div className="relative group aspect-[4/5] bg-sky-50 rounded-[3.5rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner ring-8 ring-sky-50/50">
                    <img src={config.aboutContent.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                       <button onClick={() => triggerUpload('main')} className="bg-[#FFFF00] text-[#0369A1] px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2 shadow-xl"><Upload size={18} /> Novo Upload</button>
                       <button onClick={() => setImageToEdit({ url: config.aboutContent.image, target: 'main' })} className="bg-white/10 px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2"><Scissors size={18} /> Studio IA</button>
                    </div>
                 </div>
              </section>

              <section className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-8">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <History className="text-[#0EA5E9]" /> Logo Secundário
                 </h3>
                 <div className="flex items-center gap-8 bg-sky-50 p-6 rounded-[2.5rem] border border-sky-100">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-md p-4">
                       {config.aboutContent.logo ? <img src={config.aboutContent.logo} className="max-h-full object-contain" /> : <ImageIcon className="opacity-20"/>}
                    </div>
                    <button onClick={() => triggerUpload('logo')} className="flex-grow bg-[#0369A1] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#0EA5E9] transition-all">Alterar Logo</button>
                 </div>
              </section>
           </div>

           <div className="lg:col-span-7 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-12">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <Type className="text-[#0EA5E9]" /> Conteúdo Narrativo
              </h3>
              <div className="space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título do Hero (H1)</label>
                       <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-2xl text-[#0369A1] italic" value={config.aboutContent.heroTitle} onChange={e => handleUpdate({ heroTitle: e.target.value })} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Subtítulo do Hero</label>
                       <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-sky-600" value={config.aboutContent.heroSubtitle} onChange={e => handleUpdate({ heroSubtitle: e.target.value })} />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título da História</label>
                    <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-3xl text-[#0369A1] uppercase italic tracking-tighter" value={config.aboutContent.historyTitle} onChange={e => handleUpdate({ historyTitle: e.target.value })} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Texto Principal (Destaque)</label>
                    <textarea rows={4} className="w-full px-8 py-8 rounded-[3rem] bg-sky-50 border-none font-black text-xl text-sky-700 italic leading-relaxed" value={config.aboutContent.text} onChange={e => handleUpdate({ text: e.target.value })} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Texto Secundário (Corpo da História)</label>
                    <textarea rows={6} className="w-full px-8 py-8 rounded-[3rem] bg-sky-50 border-none font-medium text-lg text-slate-500 leading-relaxed" value={config.aboutContent.secondaryText} onChange={e => handleUpdate({ secondaryText: e.target.value })} />
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* ABA: MISSÃO, VISÃO E VALORES */}
      {activeSubTab === 'mission' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           {[
             { field: 'mission', label: 'Nossa Missão', icon: Target, color: 'text-red-500' },
             { field: 'vision', label: 'Nossa Visão', icon: Eye, color: 'text-blue-500' },
             { field: 'values', label: 'Nossos Valores', icon: ShieldCheck, color: 'text-green-500' }
           ].map((item) => (
             <section key={item.field} className="bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-8 flex flex-col items-center">
                <div className={`p-8 rounded-[2.5rem] bg-sky-50 ${item.color} shadow-inner`}>
                   <item.icon size={48} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter">{item.label}</h3>
                <textarea 
                  rows={8} 
                  className="w-full px-8 py-8 rounded-[3rem] bg-sky-50 border-none font-medium text-sky-600 text-center italic leading-relaxed focus:ring-4 focus:ring-[#FFFF00]/40"
                  value={(config.aboutContent as any)[item.field]}
                  onChange={e => handleUpdate({ [item.field]: e.target.value })}
                  placeholder={`Descreva aqui a ${item.label.toLowerCase()} da CRINF...`}
                />
             </section>
           ))}
        </div>
      )}

      {/* ABA: MURAL DE DEPOIMENTOS */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter flex items-center gap-4">
                 <Quote size={32} className="text-[#0EA5E9]" /> Mural da Comunidade
              </h3>
              <button 
                onClick={() => { setEditingTestimonial({ name: '', role: '', comment: '', rating: 5, avatar: '' }); setShowTestimonialModal(true); }}
                className="bg-[#FFFF00] text-[#0369A1] px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all border-4 border-white"
              >
                 <Plus size={24} /> Adicionar Depoimento
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(config.aboutContent.testimonials || []).map(test => (
                <div key={test.id} className="bg-white p-10 rounded-[4rem] border border-sky-50 shadow-2xl flex flex-col group relative hover:border-[#0EA5E9] transition-all">
                   <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => { setEditingTestimonial(test); setShowTestimonialModal(true); }} className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl hover:bg-[#FFFF00] shadow-sm"><Edit3 size={16}/></button>
                      <button onClick={() => deleteTestimonial(test.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white shadow-sm"><Trash2 size={16}/></button>
                   </div>

                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-sky-50 rounded-2xl overflow-hidden border-2 border-white shadow-md flex items-center justify-center">
                         {test.avatar ? <img src={test.avatar} className="w-full h-full object-cover" /> : <Users className="text-sky-200" size={24}/>}
                      </div>
                      <div>
                         <h4 className="font-black text-[#0369A1] uppercase italic text-sm truncate w-40">{test.name}</h4>
                         <p className="text-[9px] font-bold text-sky-300 uppercase tracking-widest">{test.role}</p>
                      </div>
                   </div>

                   <div className="flex-grow">
                      <div className="flex gap-1 text-[#FFFF00] mb-4">
                         {[...Array(test.rating)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
                      </div>
                      <p className="text-sm font-bold text-[#0EA5E9] italic leading-relaxed line-clamp-4">"{test.comment}"</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* ABA: DESIGN & CORES */}
      {activeSubTab === 'design' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <section className="bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <Palette className="text-[#0EA5E9]" /> Paleta de Cores Local
              </h3>
              <div className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Fundo do Hero</label>
                    <input type="color" className="w-full h-16 rounded-2xl cursor-pointer bg-sky-50 p-2 shadow-inner" value={config.aboutContent.primaryColor || config.primaryColor} onChange={e => handleUpdate({ primaryColor: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Secundária (Destaques)</label>
                    <input type="color" className="w-full h-16 rounded-2xl cursor-pointer bg-sky-50 p-2 shadow-inner" value={config.aboutContent.secondaryColor || config.secondaryColor} onChange={e => handleUpdate({ secondaryColor: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor de Fundo da Página</label>
                    <input type="color" className="w-full h-16 rounded-2xl cursor-pointer bg-sky-50 p-2 shadow-inner" value={config.aboutContent.backgroundColor || '#FFFFFF'} onChange={e => handleUpdate({ backgroundColor: e.target.value })} />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor do Texto Principal</label>
                    <input type="color" className="w-full h-16 rounded-2xl cursor-pointer bg-sky-50 p-2 shadow-inner" value={config.aboutContent.textColor || '#0EA5E9'} onChange={e => handleUpdate({ textColor: e.target.value })} />
                 </div>
              </div>
           </section>
           
           <div className="p-12 bg-sky-50 rounded-[4.5rem] flex flex-col items-center justify-center text-center space-y-6">
              <div className="p-8 bg-white rounded-full shadow-2xl"><Wand2 size={64} className="text-[#0EA5E9]" /></div>
              <h4 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter">Customização Total</h4>
              <p className="text-sky-600 font-medium leading-relaxed italic max-w-sm">
                A página Sobre Nós pode ter uma identidade visual independente do resto do sistema para destacar a marca CRINF.
              </p>
           </div>
        </div>
      )}

      {/* MODAL DEPOIMENTO */}
      {showTestimonialModal && editingTestimonial && (
        <div className="fixed inset-0 z-[120] bg-[#0369A1]/80 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
           <div className="bg-white rounded-[4.5rem] w-full max-w-2xl shadow-2xl border-8 border-white animate-in zoom-in-95 duration-500 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-10 border-b border-sky-50 flex justify-between items-center">
                 <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">Editar Depoimento</h3>
                 <button onClick={() => setShowTestimonialModal(false)} className="p-4 bg-sky-50 rounded-full text-sky-200 hover:text-red-400 transition-all"><X size={32}/></button>
              </div>

              <form onSubmit={handleSaveTestimonial} className="p-10 lg:p-14 overflow-y-auto custom-scrollbar space-y-10">
                 <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                       <div className="w-32 h-32 bg-sky-50 rounded-[2.5rem] overflow-hidden border-4 border-dashed border-sky-100 flex items-center justify-center shadow-inner">
                          {editingTestimonial.avatar ? <img src={editingTestimonial.avatar} className="w-full h-full object-cover" /> : <Users size={48} className="text-sky-200" />}
                          <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md rounded-[2.5rem] gap-2">
                             <button type="button" onClick={() => triggerUpload('avatar')} className="p-3 bg-[#FFFF00] text-[#0369A1] rounded-xl"><Upload size={18}/></button>
                             <button type="button" onClick={() => setImageToEdit({ url: editingTestimonial.avatar || 'https://i.imgur.com/kS5sM6C.png', target: 'avatar' })} className="p-3 bg-white/20 rounded-xl"><Scissors size={18}/></button>
                          </div>
                       </div>
                    </div>
                    <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Avatar do Cliente</p>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Nome Completo</label>
                       <input required className="w-full px-8 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0369A1]" value={editingTestimonial.name} onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cargo / Descrição</label>
                       <input className="w-full px-8 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0369A1]" value={editingTestimonial.role} onChange={e => setEditingTestimonial({...editingTestimonial, role: e.target.value})} placeholder="Ex: Gamer / Empresário" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Depoimento</label>
                    <textarea rows={4} required className="w-full px-8 py-6 rounded-[2.5rem] bg-sky-50 border-none font-medium italic text-[#0EA5E9]" value={editingTestimonial.comment} onChange={e => setEditingTestimonial({...editingTestimonial, comment: e.target.value})} />
                 </div>

                 <div className="pt-6 border-t border-sky-50 flex justify-end gap-4">
                    <button type="button" onClick={() => setShowTestimonialModal(false)} className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] text-sky-300">Cancelar</button>
                    <button type="submit" className="bg-[#0EA5E9] text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl">Salvar Depoimento</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Editor de Imagem IA Integrado */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit.url}
          onSave={applyEditedImage}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default AboutManager;
