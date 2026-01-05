
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Save, MapPin, Phone, Mail, Globe, Instagram, Facebook, 
  MessageCircle, Clock, Trash2, Plus, Edit3, X, 
  CheckCircle2, Image as ImageIcon, Scissors, Info, Map,
  Palette, Type, Sliders, ExternalLink, Layout, SlidersHorizontal, Upload,
  Youtube, Twitter, Share2, MapPinned
} from 'lucide-react';
import ImageEditor from './ImageEditor';
import { UnitInfo } from '../types';

const ContactManager: React.FC = () => {
  const { config, updateConfig } = useApp();
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'units' | 'social' | 'design'>('units');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (updates: any) => {
    updateConfig({ contactPage: { ...config.contactPage, ...updates } });
  };

  const handleUnitUpdate = (index: number, updates: Partial<UnitInfo>) => {
    const newUnits = [...config.contactPage.units];
    newUnits[index] = { ...newUnits[index], ...updates };
    handleUpdate({ units: newUnits });
  };

  const addUnit = () => {
    const newUnit: UnitInfo = {
      tag: 'Nova Unidade',
      name: 'CRINF Unidade',
      address: '',
      location: 'Campo Largo - PR',
      hours: '09h às 18h',
      email: 'contato@crinf.com',
      mapEmbedUrl: '',
      isMain: false
    };
    handleUpdate({ units: [...config.contactPage.units, newUnit] });
  };

  const removeUnit = (index: number) => {
    const newUnits = config.contactPage.units.filter((_, i) => i !== index);
    handleUpdate({ units: newUnits });
  };

  const addSocial = () => {
    const newSocial = [...(config.socialLinks || []), { platform: 'Instagram', url: '' }];
    updateConfig({ socialLinks: newSocial });
  };

  const updateSocial = (index: number, updates: any) => {
    const newSocial = [...config.socialLinks];
    newSocial[index] = { ...newSocial[index], ...updates };
    updateConfig({ socialLinks: newSocial });
  };

  const removeSocial = (index: number) => {
    updateConfig({ socialLinks: config.socialLinks.filter((_, i) => i !== index) });
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleUpdate({ image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      
      {/* Header Administrativo */}
      <div className="bg-[#0369A1] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-8 border-white">
        <MessageCircle className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
           <div className="space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                 <CheckCircle2 size={14} className="text-[#FFFF00]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFF00]">Módulo de Contato e Sedes</span>
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Gestão de Contato</h2>
           </div>
           
           <div className="flex bg-white/10 p-2 rounded-[2.5rem] border border-white/10 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveSubTab('units')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'units' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-white hover:text-[#FFFF00]'}`}>
                <MapPin size={18} /> Sedes Físicas
              </button>
              <button onClick={() => setActiveSubTab('social')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'social' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-white hover:text-[#FFFF00]'}`}>
                <Share2 size={18} /> Redes Sociais
              </button>
              <button onClick={() => setActiveSubTab('design')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'design' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-white hover:text-[#FFFF00]'}`}>
                <Palette size={18} /> Design e Textos
              </button>
           </div>
        </div>
      </div>

      {/* ABA: SEDES FÍSICAS (UNIDADES) */}
      {activeSubTab === 'units' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-700">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter flex items-center gap-4">
                 <MapPinned size={32} className="text-[#0EA5E9]" /> Unidades de Atendimento
              </h3>
              <button onClick={addUnit} className="bg-[#FFFF00] text-[#0369A1] px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all border-4 border-white flex items-center gap-3">
                 <Plus size={20} /> Adicionar Unidade
              </button>
           </div>

           {config.contactPage.units.map((unit, idx) => (
             <div key={idx} className="bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 text-sky-50 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Map size={240}/></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
                   <div className="flex-grow space-y-10 w-full lg:w-1/2">
                      <div className="flex items-center gap-6 border-b border-sky-50 pb-6">
                         <div className="p-5 bg-sky-50 text-[#0EA5E9] rounded-3xl shadow-inner group-hover:bg-[#FFFF00] group-hover:text-[#0369A1] transition-all">
                            <MapPin size={32} />
                         </div>
                         <div className="flex-grow">
                            <input className="bg-transparent border-none font-black text-3xl text-[#0369A1] uppercase italic tracking-tighter outline-none w-full" value={unit.name} onChange={e => handleUnitUpdate(idx, { name: e.target.value })} placeholder="Nome da Unidade (Ex: CRINF Xerox)" />
                            <input className="bg-transparent border-none text-[10px] font-black text-sky-300 uppercase tracking-widest outline-none w-full" value={unit.tag} onChange={e => handleUnitUpdate(idx, { tag: e.target.value })} placeholder="Identificador (Ex: Unidade Gorski)" />
                         </div>
                         <button onClick={() => removeUnit(idx)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20}/></button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Endereço (Rua, Nº, Bairro)</label>
                            <input className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0369A1] text-sm" value={unit.address} onChange={e => handleUnitUpdate(idx, { address: e.target.value })} placeholder="Ex: Av Portugal n° 240, Bairro Francisco Gorski" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">CEP / Localização</label>
                            <input className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0369A1] text-sm" value={unit.location} onChange={e => handleUnitUpdate(idx, { location: e.target.value })} placeholder="Ex: CEP 83602-742 | Campo Largo - PR" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2 flex items-center gap-2"><Clock size={14}/> Horários de Atendimento</label>
                            <textarea rows={3} className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-black text-[#0369A1] text-xs leading-relaxed" value={unit.hours} onChange={e => handleUnitUpdate(idx, { hours: e.target.value })} placeholder="Ex: Segunda a Sexta: 13h às 19h" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2 flex items-center gap-2"><Mail size={14}/> E-mail da Unidade</label>
                            <input className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0EA5E9] text-xs" value={unit.email} onChange={e => handleUnitUpdate(idx, { email: e.target.value })} placeholder="crinf.xerox@gmail.com" />
                         </div>
                      </div>
                   </div>

                   <div className="w-full lg:w-[400px] space-y-6 shrink-0">
                      <div className="bg-sky-50 p-6 rounded-[3rem] border-4 border-white shadow-xl space-y-4">
                         <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black text-[#0369A1] uppercase tracking-widest flex items-center gap-2"><Globe size={14}/> Link do Iframe Google Maps</h4>
                            <a href="https://www.google.com/maps" target="_blank" className="text-[8px] font-black text-[#0EA5E9] underline flex items-center gap-1">Buscar no Maps <ExternalLink size={8}/></a>
                         </div>
                         <textarea 
                           rows={4}
                           className="w-full px-4 py-3 rounded-2xl bg-white border-none font-medium text-sky-400 text-[9px] outline-none shadow-inner"
                           value={unit.mapEmbedUrl}
                           onChange={e => handleUnitUpdate(idx, { mapEmbedUrl: e.target.value })}
                           placeholder="Cole aqui o link 'src' do iframe do Google Maps"
                         />
                         <div className="aspect-video bg-white rounded-2xl border-2 border-sky-100 overflow-hidden shadow-inner flex items-center justify-center relative group/map">
                            {unit.mapEmbedUrl ? (
                               <iframe src={unit.mapEmbedUrl} className="w-full h-full border-none opacity-50 group-hover/map:opacity-100 transition-opacity" />
                            ) : (
                               <div className="text-center space-y-2 opacity-20">
                                  <Map size={48} className="mx-auto" />
                                  <p className="text-[8px] font-black uppercase">Preview Indisponível</p>
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* ABA: REDES SOCIAIS */}
      {activeSubTab === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <section className="lg:col-span-4 space-y-10">
              <div className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-10">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <Phone className="text-[#0EA5E9]" /> Contatos Master
                 </h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">WhatsApp Principal</label>
                       <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.whatsapp} onChange={e => updateConfig({ whatsapp: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">E-mail Corporativo</label>
                       <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-sky-600 outline-none" value={config.email} onChange={e => updateConfig({ email: e.target.value })} />
                    </div>
                 </div>
              </div>
           </section>

           <section className="lg:col-span-8 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10">
              <div className="flex justify-between items-center border-b border-sky-50 pb-6">
                <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3">
                   <Share2 className="text-[#0EA5E9]" /> Links de Redes Sociais
                </h3>
                <button onClick={addSocial} className="p-3 bg-[#FFFF00] text-[#0369A1] rounded-2xl shadow-md hover:scale-110 transition-all"><Plus size={20}/></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.socialLinks.map((social, idx) => (
                  <div key={idx} className="bg-sky-50 p-6 rounded-[2.5rem] border border-sky-100 flex items-center gap-6 group">
                     <div className="flex-grow space-y-4">
                        <select className="w-full px-4 py-2 rounded-xl bg-white border-none font-black text-[#0369A1] uppercase text-[10px]" value={social.platform} onChange={e => updateSocial(idx, { platform: e.target.value })}>
                           <option value="Instagram">Instagram</option>
                           <option value="Facebook">Facebook</option>
                           <option value="YouTube">YouTube</option>
                           <option value="WhatsApp">WhatsApp</option>
                           <option value="Twitter">Twitter / X</option>
                           <option value="LinkedIn">LinkedIn</option>
                           <option value="TikTok">TikTok</option>
                        </select>
                        <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-bold text-sky-600 text-[10px]" value={social.url} onChange={e => updateSocial(idx, { url: e.target.value })} placeholder="Link completo do perfil" />
                     </div>
                     <button onClick={() => removeSocial(idx)} className="p-4 bg-red-50 text-red-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
           </section>
        </div>
      )}

      {/* ABA: DESIGN E TEXTOS DA PÁGINA */}
      {activeSubTab === 'design' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <section className="lg:col-span-5 space-y-10">
              <div className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-10">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <ImageIcon className="text-[#0EA5E9]" /> Imagem de Destaque (Hero)
                 </h3>
                 <div className="relative group aspect-video bg-sky-50 rounded-[3rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner">
                    <img src={config.contactPage.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                       <button onClick={triggerUpload} className="bg-[#FFFF00] text-[#0369A1] p-4 rounded-2xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
                          <Upload size={20} /> Upload Novo
                       </button>
                       <button onClick={() => setImageToEdit(config.contactPage.image)} className="bg-white/10 p-4 rounded-2xl flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all">
                          <Scissors size={20} /> Studio IA
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-8">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <Palette className="text-[#0EA5E9]" /> Identidade Cromática
                 </h3>
                 <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor do Cabeçalho (Hero)</label>
                       <input type="color" className="w-full h-14 rounded-2xl cursor-pointer bg-sky-50 border-none p-1" value={config.contactPage.primaryColor} onChange={e => handleUpdate({ primaryColor: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Fundo da Página (Background)</label>
                       <input type="color" className="w-full h-14 rounded-2xl cursor-pointer bg-sky-50 border-none p-1" value={config.contactPage.backgroundColor} onChange={e => handleUpdate({ backgroundColor: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Principal de Títulos</label>
                       <input type="color" className="w-full h-14 rounded-2xl cursor-pointer bg-sky-50 border-none p-1" value={config.contactPage.textColor} onChange={e => handleUpdate({ textColor: e.target.value })} />
                    </div>
                 </div>
              </div>
           </section>

           <section className="lg:col-span-7 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-12">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <Type className="text-[#0EA5E9]" /> Conteúdo Textual Master
              </h3>
              <div className="space-y-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título Principal da Página (H1)</label>
                    <input className="w-full px-8 py-6 rounded-[2rem] bg-sky-50 border-none font-black text-3xl text-[#0369A1] italic outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.contactPage.title} onChange={e => handleUpdate({ title: e.target.value })} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Slogan / Subtítulo</label>
                    <textarea rows={4} className="w-full px-8 py-8 rounded-[3rem] bg-sky-50 border-none font-medium text-lg text-sky-600 leading-relaxed outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.contactPage.subtitle} onChange={e => handleUpdate({ subtitle: e.target.value })} />
                 </div>
              </div>
              
              <div className="p-8 bg-sky-50 rounded-[3rem] border border-sky-100 flex items-start gap-6">
                 <Info className="text-[#0EA5E9] shrink-0 mt-1" size={24} />
                 <p className="text-[11px] font-bold text-sky-600 uppercase italic leading-relaxed">
                   Dica: Use títulos chamativos para passar autoridade. A página de contato é muitas vezes o primeiro ponto de confiança de um novo cliente corporativo.
                 </p>
              </div>
           </section>
        </div>
      )}

      {/* Editor de Imagem IA Integrado */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit}
          onSave={(editedUrl) => {
            handleUpdate({ image: editedUrl });
            setImageToEdit(null);
          }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default ContactManager;
