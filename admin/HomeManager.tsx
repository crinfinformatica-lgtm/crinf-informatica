
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Palette, Monitor, Layout, Save, Scissors, Plus, Trash2, 
  Image as ImageIcon, Edit3, Type, Info, CheckCircle2, 
  Sliders, Wand2, Home, ListPlus, ArrowRight, MousePointer2,
  Cpu, Copy, Truck, Heart, Instagram, Facebook, Link as LinkIcon, Upload
} from 'lucide-react';
import ImageEditor from './ImageEditor';
import { FooterLink } from '../types';

const HomeManager: React.FC = () => {
  const { config, updateConfig } = useApp();
  const [imageToEdit, setImageToEdit] = useState<{ url: string; target: string; index?: number } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'design' | 'home' | 'footer'>('design');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ target: string; index?: number } | null>(null);

  const handleUpdate = (updates: any) => {
    updateConfig(updates);
  };

  const triggerNewUpload = (target: string, index?: number) => {
    setUploadTarget({ target, index });
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageToEdit({ url: result, target: uploadTarget.target, index: uploadTarget.index });
      };
      reader.readAsDataURL(file);
    }
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    e.target.value = '';
  };

  const addCampaign = () => {
    const newCamps = [
      ...config.homeCampaigns,
      { title: 'Nova Campanha', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200', link: '/loja' }
    ];
    handleUpdate({ homeCampaigns: newCamps });
  };

  const updateCampaign = (index: number, updates: any) => {
    const newCamps = [...config.homeCampaigns];
    newCamps[index] = { ...newCamps[index], ...updates };
    handleUpdate({ homeCampaigns: newCamps });
  };

  const removeCampaign = (index: number) => {
    handleUpdate({ homeCampaigns: config.homeCampaigns.filter((_, i) => i !== index) });
  };

  const addFooterLink = () => {
    const newLinks = [
      ...config.footerLinks,
      { id: `fl-${Date.now()}`, label: 'Novo Link', url: '/', category: 'Institucional' as const }
    ];
    handleUpdate({ footerLinks: newLinks });
  };

  const updateFooterLink = (id: string, updates: Partial<FooterLink>) => {
    const newLinks = config.footerLinks.map(l => l.id === id ? { ...l, ...updates } : l);
    handleUpdate({ footerLinks: newLinks });
  };

  const removeFooterLink = (id: string) => {
    handleUpdate({ footerLinks: config.footerLinks.filter(l => l.id !== id) });
  };

  const addSocialLink = () => {
    const newSocial = [
      ...config.socialLinks,
      { platform: 'Instagram', url: '' }
    ];
    handleUpdate({ socialLinks: newSocial });
  };

  const updateSocialLink = (index: number, updates: any) => {
    const newSocial = [...config.socialLinks];
    newSocial[index] = { ...newSocial[index], ...updates };
    handleUpdate({ socialLinks: newSocial });
  };

  const removeSocialLink = (index: number) => {
    handleUpdate({ socialLinks: config.socialLinks.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {/* Header Administrativo Design */}
      <div className="bg-white p-12 rounded-[4rem] border border-sky-100 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#FFFF00]/10 rounded-full opacity-50 blur-3xl" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-6 bg-[#0EA5E9] rounded-[2.5rem] text-[#FFFF00] shadow-2xl rotate-3">
            <Palette size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">Design & Interface</h2>
            <p className="text-[11px] text-sky-300 font-black uppercase tracking-[0.3em] mt-2">Personalização Global do Aplicativo</p>
          </div>
        </div>
        
        <div className="flex bg-sky-50 p-2 rounded-[2.5rem] border border-sky-100 relative z-10">
           <button 
             onClick={() => setActiveSubTab('design')}
             className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeSubTab === 'design' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}
           >
             <Sliders size={18} /> Cores & Logo
           </button>
           <button 
             onClick={() => setActiveSubTab('home')}
             className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeSubTab === 'home' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}
           >
             <Home size={18} /> Início & Banners
           </button>
           <button 
             onClick={() => setActiveSubTab('footer')}
             className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeSubTab === 'footer' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}
           >
             <Layout size={18} /> Rodapé & Links
           </button>
        </div>
      </div>

      {/* ABA: DESIGN GLOBAL (CORES E LOGO) */}
      {activeSubTab === 'design' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           {/* Logo Editor IA */}
           <section className="lg:col-span-5 bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-8">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <ImageIcon className="text-[#0EA5E9]" /> Logotipo Principal
              </h3>
              <div className="relative group aspect-square bg-sky-50 rounded-[3rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner ring-8 ring-sky-50/50">
                 <img src={config.logo} className="max-w-[70%] max-h-[70%] object-contain" />
                 <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                    <button 
                      onClick={() => triggerNewUpload('logo')}
                      className="bg-[#FFFF00] text-[#0369A1] p-4 rounded-2xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
                    >
                      <Upload size={20} /> Upload Logo
                    </button>
                    <button 
                      onClick={() => setImageToEdit({ url: config.logo, target: 'logo' })}
                      className="bg-white/10 p-4 rounded-2xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all"
                    >
                      <Scissors size={20} /> Studio IA
                    </button>
                 </div>
              </div>
              <p className="text-[10px] font-bold text-sky-400 uppercase text-center">Formato recomendado: PNG Transparente</p>
           </section>

           {/* Cores Globais */}
           <section className="lg:col-span-7 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <Palette className="text-[#0EA5E9]" /> Identidade Visual do App
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Primária (Global)</label>
                       <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer" value={config.primaryColor} onChange={e => handleUpdate({ primaryColor: e.target.value })} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Secundária (Ação)</label>
                       <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer" value={config.secondaryColor} onChange={e => handleUpdate({ secondaryColor: e.target.value })} />
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Fundo do Cabeçalho</label>
                       <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer" value={config.headerBgColor} onChange={e => handleUpdate({ headerBgColor: e.target.value })} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Texto do Cabeçalho</label>
                       <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer" value={config.headerTextColor} onChange={e => handleUpdate({ headerTextColor: e.target.value })} />
                    </div>
                 </div>
              </div>
           </section>
        </div>
      )}

      {/* ABA: CONTEÚDO DA HOME (BANNER E CAMPANHAS) */}
      {activeSubTab === 'home' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
           {/* Editor de Banner Hero */}
           <section className="bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <Monitor className="text-[#0EA5E9]" /> Destaque Principal (Banner Hero)
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="relative group aspect-video bg-sky-50 rounded-[3rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner">
                    <img src={config.bannerImage} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                       <button 
                        onClick={() => triggerNewUpload('banner')}
                        className="bg-[#FFFF00] text-[#0369A1] px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
                       >
                         <Upload size={18} /> Novo Upload
                       </button>
                       <button 
                        onClick={() => setImageToEdit({ url: config.bannerImage, target: 'banner' })}
                        className="bg-white/10 px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all"
                       >
                         <Scissors size={18} /> Ajustar Banner
                       </button>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">H1: Título Principal</label>
                       <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-2xl text-[#0369A1] italic" value={config.heroText} onChange={e => handleUpdate({ heroText: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Subtítulo Motivacional</label>
                       <textarea rows={3} className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-medium text-lg text-sky-600" value={config.heroSubtext} onChange={e => handleUpdate({ heroSubtext: e.target.value })} />
                    </div>
                 </div>
              </div>
           </section>

           {/* Editor de Atalhos Rápidos */}
           <section className="bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <MousePointer2 className="text-[#0EA5E9]" /> Botões de Atalhos Rápidos (Home)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {/* Atalho 1 */}
                 <div className="bg-sky-50 p-6 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-white text-[#0EA5E9] rounded-xl"><Cpu size={20}/></div>
                       <span className="text-[9px] font-black uppercase text-sky-300">Botão 1</span>
                    </div>
                    <div className="space-y-2">
                       <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-black text-[#0369A1] uppercase text-[10px]" value={config.shortcut1Title} onChange={e => handleUpdate({ shortcut1Title: e.target.value })} placeholder="Título" />
                       <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-bold text-sky-600 text-[10px]" value={config.shortcut1Desc} onChange={e => handleUpdate({ shortcut1Desc: e.target.value })} placeholder="Descrição" />
                    </div>
                 </div>
                 {/* Atalho 2 */}
                 <div className="bg-sky-50 p-6 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-white text-[#0EA5E9] rounded-xl"><Copy size={20}/></div>
                       <span className="text-[9px] font-black uppercase text-sky-300">Botão 2</span>
                    </div>
                    <div className="space-y-2">
                       <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-black text-[#0369A1] uppercase text-[10px]" value={config.shortcut2Title} onChange={e => handleUpdate({ shortcut2Title: e.target.value })} placeholder="Título" />
                       <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-bold text-sky-600 text-[10px]" value={config.shortcut2Desc} onChange={e => handleUpdate({ shortcut2Desc: e.target.value })} placeholder="Descrição" />
                    </div>
                 </div>
                 {/* Atalho 3 */}
                 <div className="bg-sky-50 p-6 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-white text-[#0EA5E9] rounded-xl"><Truck size={20}/></div>
                       <span className="text-[9px] font-black uppercase text-sky-300">Botão 3</span>
                    </div>
                    <div className="space-y-2">
                       <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-black text-[#0369A1] uppercase text-[10px]" value={config.shortcut3Title} onChange={e => handleUpdate({ shortcut3Title: e.target.value })} placeholder="Título" />
                       <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-bold text-sky-600 text-[10px]" value={config.shortcut3Desc} onChange={e => handleUpdate({ shortcut3Desc: e.target.value })} placeholder="Descrição" />
                    </div>
                 </div>
                 {/* Atalho 4 */}
                 <div className="bg-sky-50 p-6 rounded-[2.5rem] space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-white text-[#0EA5E9] rounded-xl"><Heart size={20}/></div>
                       <span className="text-[9px] font-black uppercase text-sky-300">Botão 4</span>
                    </div>
                    <div className="space-y-2">
                       <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-black text-[#0369A1] uppercase text-[10px]" value={config.shortcut4Title} onChange={e => handleUpdate({ shortcut4Title: e.target.value })} placeholder="Título" />
                       <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-bold text-sky-600 text-[10px]" value={config.shortcut4Desc} onChange={e => handleUpdate({ shortcut4Desc: e.target.value })} placeholder="Descrição" />
                    </div>
                 </div>
              </div>
           </section>

           {/* Campanhas Promocionais */}
           <div className="space-y-8">
              <div className="flex justify-between items-center px-4">
                 <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter">Banners de Campanha</h3>
                 <button onClick={addCampaign} className="bg-[#0EA5E9] text-white px-10 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
                    <Plus size={24} /> Criar Campanha
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {config.homeCampaigns.map((camp, idx) => (
                   <div key={idx} className="bg-white p-8 rounded-[4rem] border border-sky-100 shadow-2xl flex flex-col gap-6 group hover:border-[#0EA5E9] transition-all">
                      <div className="relative group/camp aspect-video bg-sky-50 rounded-[3rem] overflow-hidden border-2 border-sky-100">
                         <img src={camp.image} className="w-full h-full object-cover transition-transform group-hover/camp:scale-110" />
                         <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover/camp:opacity-100 transition-all backdrop-blur-sm gap-3">
                            <button onClick={() => triggerNewUpload('campaign', idx)} className="bg-[#FFFF00] text-[#0369A1] p-3 rounded-xl hover:scale-110 transition-all font-black uppercase text-[9px] flex items-center gap-2">
                               <Upload size={14}/> Upload
                            </button>
                            <button onClick={() => setImageToEdit({ url: camp.image, target: 'campaign', index: idx })} className="bg-white/10 p-3 rounded-xl hover:bg-white/20 transition-all font-black uppercase text-[9px] flex items-center gap-2">
                               <Wand2 size={14} /> Ajustar IA
                            </button>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <input className="w-full px-6 py-3 rounded-2xl bg-sky-50 border-none font-black text-lg text-[#0369A1] uppercase italic" value={camp.title} onChange={e => updateCampaign(idx, { title: e.target.value })} />
                         <div className="flex gap-4 items-center">
                            <input className="flex-grow px-6 py-3 rounded-2xl bg-sky-50 border-none font-bold text-xs text-sky-400" value={camp.link} onChange={e => updateCampaign(idx, { link: e.target.value })} placeholder="Link da Campanha (URL)" />
                            <button onClick={() => removeCampaign(idx)} className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={20}/></button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* ABA: RODAPÉ E LINKS DINÂMICOS */}
      {activeSubTab === 'footer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <section className="lg:col-span-4 bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-8">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <Palette className="text-[#0EA5E9]" /> Cores do Rodapé
              </h3>
              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Fundo do Rodapé</label>
                    <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer" value={config.footerBgColor} onChange={e => handleUpdate({ footerBgColor: e.target.value })} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Texto do Rodapé</label>
                    <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer" value={config.footerTextColor} onChange={e => handleUpdate({ footerTextColor: e.target.value })} />
                 </div>
              </div>
              <div className="pt-8 border-t border-sky-50">
                 <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Frase de Copyright / Final</label>
                 <textarea rows={4} className="w-full mt-4 px-6 py-4 rounded-2xl bg-sky-50 border-none font-medium text-[#0369A1] text-xs" value={config.footerText} onChange={e => handleUpdate({ footerText: e.target.value })} />
              </div>
           </section>

           <section className="lg:col-span-8 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10">
              <div className="flex justify-between items-center border-b border-sky-50 pb-6">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3">
                    <ListPlus className="text-[#0EA5E9]" /> Menu de Links do Rodapé
                 </h3>
                 <button onClick={addFooterLink} className="p-3 bg-[#FFFF00] text-[#0369A1] rounded-2xl shadow-md hover:scale-110 transition-all"><Plus size={24}/></button>
              </div>

              <div className="space-y-4">
                 {config.footerLinks.map((link) => (
                   <div key={link.id} className="bg-sky-50/50 p-6 rounded-[2.5rem] border border-sky-100 flex flex-col md:flex-row items-center gap-6 group">
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                         <div className="space-y-1">
                            <label className="text-[8px] font-black text-sky-300 uppercase">Rótulo do Link</label>
                            <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-black text-[#0369A1] uppercase text-xs" value={link.label} onChange={e => updateFooterLink(link.id, { label: e.target.value })} />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[8px] font-black text-sky-300 uppercase">URL / Rota</label>
                            <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-bold text-sky-600 text-[10px]" value={link.url} onChange={e => updateFooterLink(link.id, { url: e.target.value })} />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[8px] font-black text-sky-300 uppercase">Categoria</label>
                            <select className="w-full px-4 py-2 rounded-xl bg-white border-none font-bold text-[#0369A1] text-[10px] uppercase" value={link.category} onChange={e => updateFooterLink(link.id, { category: e.target.value as any })}>
                               <option value="Navegação">Navegação</option>
                               <option value="Institucional">Institucional</option>
                            </select>
                         </div>
                      </div>
                      <button onClick={() => removeFooterLink(link.id)} className="p-4 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><Trash2 size={18}/></button>
                   </div>
                 ))}
              </div>

              <div className="pt-12 border-t border-sky-50 space-y-10">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3">
                       <Instagram className="text-[#0EA5E9]" /> Redes Sociais do Rodapé
                    </h3>
                    <button onClick={addSocialLink} className="p-3 bg-[#FFFF00] text-[#0369A1] rounded-2xl shadow-md hover:scale-110 transition-all"><Plus size={24}/></button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.socialLinks.map((social, idx) => (
                       <div key={idx} className="bg-sky-50/50 p-6 rounded-[2rem] border border-sky-100 flex items-center gap-4 group">
                          <div className="flex-grow space-y-4">
                             <div className="space-y-1">
                                <label className="text-[8px] font-black text-sky-300 uppercase">Plataforma</label>
                                <select className="w-full px-4 py-2 rounded-xl bg-white border-none font-bold text-[#0369A1] text-[10px] uppercase" value={social.platform} onChange={e => updateSocialLink(idx, { platform: e.target.value })}>
                                   <option value="Instagram">Instagram</option>
                                   <option value="Facebook">Facebook</option>
                                   <option value="Twitter">Twitter / X</option>
                                   <option value="LinkedIn">LinkedIn</option>
                                   <option value="YouTube">YouTube</option>
                                   <option value="TikTok">TikTok</option>
                                </select>
                             </div>
                             <div className="space-y-1">
                                <label className="text-[8px] font-black text-sky-300 uppercase">URL do Perfil</label>
                                <div className="relative">
                                   <input className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border-none font-bold text-sky-600 text-[10px]" value={social.url} onChange={e => updateSocialLink(idx, { url: e.target.value })} placeholder="https://..." />
                                   <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-200" size={12} />
                                </div>
                             </div>
                          </div>
                          <button onClick={() => removeSocialLink(idx)} className="p-4 bg-red-50 text-red-300 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><Trash2 size={18}/></button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 bg-sky-50 rounded-[3rem] border border-sky-100 flex items-start gap-5">
                 <Info size={24} className="text-[#0EA5E9] shrink-0 mt-1" />
                 <p className="text-[11px] font-bold text-sky-600 uppercase italic leading-relaxed">
                   Os links do rodapé ajudam no SEO e facilitam o acesso a áreas menos visitadas. Mantenha os links atualizados para evitar páginas não encontradas.
                 </p>
              </div>
           </section>
        </div>
      )}

      {/* STUDIO IA INTEGRADO */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit.url}
          onSave={(editedUrl) => {
            if (imageToEdit.target === 'logo') handleUpdate({ logo: editedUrl });
            else if (imageToEdit.target === 'banner') handleUpdate({ bannerImage: editedUrl });
            else if (imageToEdit.target === 'campaign' && imageToEdit.index !== undefined) {
               updateCampaign(imageToEdit.index, { image: editedUrl });
            }
            setImageToEdit(null);
          }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default HomeManager;
