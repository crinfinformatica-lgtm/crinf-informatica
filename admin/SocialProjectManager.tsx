
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, Save, Plus, Trash2, Edit3, Image as ImageIcon, 
  QrCode, Palette, Type, Share2, Scissors, CheckCircle2, X,
  Upload, Wand2, Info, Layout, Sliders, MessageSquare, Quote, Zap, ShieldCheck
} from 'lucide-react';
import ImageEditor from './ImageEditor';
import { ProjectImage } from '../types';

const SocialProjectManager: React.FC = () => {
  const { config, updateConfig } = useApp();
  const [imageToEdit, setImageToEdit] = useState<{ url: string; target: string; index?: number } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'gallery' | 'donations'>('content');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ target: string; index?: number } | null>(null);

  const handleUpdate = (updates: any) => {
    updateConfig({
      socialProject: { ...config.socialProject, ...updates }
    });
  };

  const triggerUpload = (target: string, index?: number) => {
    setUploadTarget({ target, index });
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (uploadTarget.target === 'gallery' && uploadTarget.index === undefined) {
           // Nova imagem na galeria
           const current = config.socialProject.images || [];
           handleUpdate({ images: [...current, { url: result, caption: 'Nova foto da ação.' }] });
        } else {
           // Edição direta (logo, pix ou imagem existente)
           setImageToEdit({ url: result, target: uploadTarget.target, index: uploadTarget.index });
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const applyImage = (editedUrl: string) => {
    if (!imageToEdit) return;
    const { target, index } = imageToEdit;
    
    if (target === 'logo') handleUpdate({ logo: editedUrl });
    else if (target === 'pix') handleUpdate({ pixQrCode: editedUrl });
    else if (target === 'gallery' && index !== undefined) {
      const newImages = [...(config.socialProject.images || [])];
      newImages[index] = { ...newImages[index], url: editedUrl };
      handleUpdate({ images: newImages });
    }
    setImageToEdit(null);
  };

  const removeGalleryImage = (index: number) => {
    const newImages = config.socialProject.images.filter((_, i) => i !== index);
    handleUpdate({ images: newImages });
  };

  const updateCaption = (index: number, caption: string) => {
    const newImages = [...config.socialProject.images];
    newImages[index] = { ...newImages[index], caption };
    handleUpdate({ images: newImages });
  };

  const addSocial = () => {
    const newLinks = [...(config.socialProject.socialLinks || []), { platform: 'Instagram', url: '' }];
    handleUpdate({ socialLinks: newLinks });
  };

  const updateSocial = (index: number, updates: any) => {
    const newLinks = [...config.socialProject.socialLinks];
    newLinks[index] = { ...newLinks[index], ...updates };
    handleUpdate({ socialLinks: newLinks });
  };

  const removeSocial = (index: number) => {
    handleUpdate({ socialLinks: config.socialProject.socialLinks.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {/* Header Administrativo Reconstruído */}
      <div className="bg-white p-12 rounded-[4rem] border border-sky-100 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#FFFF00]/10 rounded-full opacity-50 blur-3xl" />
        <div className="flex items-center gap-8 relative z-10">
          <div style={{ backgroundColor: config.socialProject.primaryColor }} className="p-6 rounded-[2.5rem] text-white shadow-2xl rotate-3 ring-8 ring-white">
            <Heart size={48} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">Gestão Social CRINF</h2>
            <p className="text-[11px] text-sky-300 font-black uppercase tracking-[0.3em] mt-2">Causa Gotinhas de Amor • Hospital Infantil</p>
          </div>
        </div>
        
        <div className="flex bg-sky-50 p-2 rounded-[2.5rem] border border-sky-100 relative z-10 overflow-x-auto no-scrollbar">
           <button onClick={() => setActiveSubTab('content')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'content' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}>
             <Layout size={18} /> Identidade & Textos
           </button>
           <button onClick={() => setActiveSubTab('gallery')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'gallery' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}>
             <ImageIcon size={18} /> Galeria Storytelling
           </button>
           <button onClick={() => setActiveSubTab('donations')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'donations' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}>
             <QrCode size={18} /> Doações & PIX
           </button>
        </div>
      </div>

      {/* ABA: IDENTIDADE E TEXTOS */}
      {activeSubTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="lg:col-span-4 space-y-10">
              <section className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-8">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <ImageIcon className="text-[#0EA5E9]" /> Logotipo do Projeto
                 </h3>
                 <div className="relative group aspect-square bg-sky-50 rounded-[3rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner ring-8 ring-sky-50/50">
                    {config.socialProject.logo ? <img src={config.socialProject.logo} className="max-w-[70%] max-h-[70%] object-contain" /> : <div className="text-center opacity-20"><ImageIcon size={64} /></div>}
                    <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                       <button onClick={() => triggerUpload('logo')} className="bg-[#FFFF00] text-[#0369A1] px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2">Trocar Imagem</button>
                       <button onClick={() => setImageToEdit({ url: config.socialProject.logo, target: 'logo' })} className="bg-white/10 px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2">Studio IA</button>
                    </div>
                 </div>
              </section>

              <section className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-10">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <Palette className="text-[#0EA5E9]" /> Cores da Causa
                 </h3>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Principal da Página</label>
                    <input type="color" className="w-full h-16 rounded-2xl bg-sky-50 border-none p-1 cursor-pointer shadow-inner" value={config.socialProject.primaryColor} onChange={e => handleUpdate({ primaryColor: e.target.value })} />
                 </div>
              </section>
           </div>

           <div className="lg:col-span-8 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-12">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <Type className="text-[#0EA5E9]" /> Textos & Narrativa
              </h3>
              <div className="space-y-10">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Nome do Projeto (H1)</label>
                    <input className="w-full px-8 py-6 rounded-[2rem] bg-sky-50 border-none font-black text-3xl text-[#0369A1] italic outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.socialProject.name} onChange={e => handleUpdate({ name: e.target.value })} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">História e Storytelling Principal</label>
                    <textarea rows={8} className="w-full px-8 py-8 rounded-[3rem] bg-sky-50 border-none font-medium text-lg text-sky-600 leading-relaxed outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.socialProject.description} onChange={e => handleUpdate({ description: e.target.value })} placeholder="Conte a trajetória do projeto aqui..." />
                 </div>
              </div>

              <div className="pt-8 border-t border-sky-50 space-y-10">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3"><Share2 className="text-[#0EA5E9]" /> Redes Sociais do Projeto</h3>
                    <button onClick={addSocial} className="p-3 bg-[#FFFF00] text-[#0369A1] rounded-2xl shadow-md"><Plus size={20}/></button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.socialProject.socialLinks.map((link, idx) => (
                      <div key={idx} className="bg-sky-50 p-6 rounded-[2.5rem] border border-sky-100 flex items-center gap-6 group">
                         <div className="flex-grow space-y-4">
                            <select className="w-full px-4 py-2 rounded-xl bg-white border-none font-black text-[#0369A1] uppercase text-[10px]" value={link.platform} onChange={e => updateSocial(idx, { platform: e.target.value })}>
                               <option value="Instagram">Instagram</option>
                               <option value="Facebook">Facebook</option>
                               <option value="YouTube">YouTube</option>
                               <option value="WhatsApp">WhatsApp</option>
                            </select>
                            <input className="w-full px-4 py-2 rounded-xl bg-white border-none font-bold text-sky-600 text-[10px]" value={link.url} onChange={e => updateSocial(idx, { url: e.target.value })} placeholder="URL do Perfil" />
                         </div>
                         <button onClick={() => removeSocial(idx)} className="p-4 bg-red-50 text-red-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* ABA: GALERIA STORYTELLING */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter flex items-center gap-4">
                 <ImageIcon size={32} className="text-[#0EA5E9]" /> Mural de Impacto
              </h3>
              <button onClick={() => triggerUpload('gallery')} className="bg-[#0EA5E9] text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center gap-4 shadow-xl border-4 border-white">
                 <Plus size={24} /> Adicionar Foto à Galeria
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {(config.socialProject.images || []).map((img, idx) => (
                <div key={idx} className="bg-white rounded-[4rem] border border-sky-50 shadow-2xl overflow-hidden flex flex-col group p-6 hover:border-[#0EA5E9] transition-all">
                   <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-6 shadow-inner bg-sky-50">
                      <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-[#0369A1]/90 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                         <button onClick={() => setImageToEdit({ url: img.url, target: 'gallery', index: idx })} className="bg-[#FFFF00] text-[#0369A1] p-4 rounded-2xl shadow-xl rotate-3"><Scissors size={20} /></button>
                         <button onClick={() => removeGalleryImage(idx)} className="bg-red-500 text-white p-4 rounded-2xl shadow-xl -rotate-3"><Trash2 size={20} /></button>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2 flex items-center gap-2"><Quote size={12}/> Legenda Descritiva</label>
                      <textarea 
                        rows={3} 
                        className="w-full px-6 py-4 rounded-[2rem] bg-sky-50 border-none font-bold text-xs italic text-sky-700 leading-relaxed outline-none focus:ring-2 focus:ring-[#FFFF00]"
                        value={img.caption}
                        onChange={e => updateCaption(idx, e.target.value)}
                        placeholder="Descreva esta ação solidária..."
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* ABA: DOAÇÕES E PIX */}
      {activeSubTab === 'donations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="lg:col-span-5 space-y-10">
              <section className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-10">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <QrCode className="text-[#0EA5E9]" /> QR Code para PIX
                 </h3>
                 <div className="relative group aspect-square bg-sky-50 rounded-[4rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner ring-8 ring-sky-50/50">
                    {config.socialProject.pixQrCode ? <img src={config.socialProject.pixQrCode} className="max-w-[70%] max-h-[70%] object-contain" /> : <div className="text-center opacity-20"><QrCode size={100} /></div>}
                    <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                       <button onClick={() => triggerUpload('pix')} className="bg-[#FFFF00] text-[#0369A1] px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2">Trocar QR Code</button>
                    </div>
                 </div>
                 <div className="p-6 bg-yellow-50 rounded-[2rem] border border-yellow-100 flex items-start gap-4">
                    <Info className="text-yellow-600 shrink-0" size={20} />
                    <p className="text-[10px] font-bold text-yellow-800 uppercase leading-relaxed">Certifique-se de que o QR Code está configurado como "PIX Estático" ou para recebimento sem expiração.</p>
                 </div>
              </section>
           </div>

           <div className="lg:col-span-7 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <MessageSquare className="text-[#0EA5E9]" /> Canais de Recebimento
              </h3>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Chave PIX Oficial (E-mail, CPF ou Aleatória)</label>
                    <input 
                      className="w-full px-8 py-6 rounded-[2rem] bg-sky-50 border-none font-black text-2xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/40 outline-none"
                      value={config.socialProject.pixKey}
                      onChange={e => handleUpdate({ pixKey: e.target.value })}
                      placeholder="financeiro@projeto.com.br"
                    />
                 </div>
              </div>

              <div className="bg-[#0369A1] p-12 rounded-[4rem] text-white shadow-2xl space-y-6 relative overflow-hidden">
                 <Zap className="absolute -right-10 -bottom-10 opacity-10 w-48 h-48 rotate-12" />
                 <h4 className="text-xs font-black text-[#FFFF00] uppercase tracking-[0.3em]">Instruções de Segurança</h4>
                 <p className="text-sm font-medium leading-relaxed italic opacity-80">
                   As informações financeiras editadas aqui serão exibidas para todos os visitantes da página. Nunca insira senhas ou dados sensíveis que não sejam públicos para recebimento de transferências.
                 </p>
                 <div className="flex items-center gap-3 text-sky-200 font-black text-[9px] uppercase tracking-widest bg-white/10 px-6 py-2 rounded-full border border-white/10">
                    <ShieldCheck size={14} /> Dados Criptografados no Banco Local
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Editor de Imagem IA Integrado */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit.url}
          onSave={applyImage}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default SocialProjectManager;
