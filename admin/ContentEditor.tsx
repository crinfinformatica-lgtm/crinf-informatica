
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Palette, Monitor, Globe, Save, Camera, Scissors, Zap, Plus, Trash2, 
  BookOpen, Heart, Download, Users2, Link as LinkIcon, X, Edit3, 
  MapPin, MessageCircle, Mail, QrCode, Clock, Image as ImageIcon, 
  CheckCircle2, Sliders, Type, Info, ExternalLink, Layout, Sparkles, 
  Settings, Home, Wand2, Truck, ListPlus, Star, Quote, Facebook, Instagram, Briefcase, Upload
} from 'lucide-react';
import ImageEditor from './ImageEditor';
import { FormField, ProjectImage, UnitInfo, DownloadProgram, Testimonial } from '../types';

type ContentTab = 'global' | 'home' | 'about' | 'pickup' | 'contact' | 'clients' | 'social' | 'downloads' | 'services';

const ContentEditor: React.FC = () => {
  const { 
    config = {} as any, updateConfig, 
    downloads = [], addDownload, updateDownload, deleteDownload, 
    clients = [], addClient, updateClient, deleteClient 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<ContentTab>('global');
  const [editingImage, setEditingImage] = useState<{ url: string; target: string; index?: number; subTarget?: string } | null>(null);
  const [showImageStudio, setShowImageStudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ target: string; id?: string; index?: number; subTarget?: string } | null>(null);

  const triggerUpload = (target: string, id?: string, index?: number, subTarget?: string) => {
    setUploadTarget({ target, id, index, subTarget });
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditingImage({ 
          url: result, 
          target: uploadTarget.target, 
          index: uploadTarget.index, 
          subTarget: uploadTarget.subTarget 
        });
        setShowImageStudio(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyImageData = (data: string, target: string, index?: number, subTarget?: string) => {
    if (target === 'logo') updateConfig({ logo: data });
    else if (target === 'banner') updateConfig({ bannerImage: data });
    else if (target === 'aboutImage') updateConfig({ aboutContent: { ...config.aboutContent, image: data } });
    else if (target === 'pickupHero') updateConfig({ pickupPage: { ...config.pickupPage, heroImage: data } });
    else if (target === 'servicesHero') updateConfig({ servicesPage: { ...config.servicesPage, heroImage: data } });
    else if (target === 'socialLogo') updateConfig({ socialProject: { ...config.socialProject, logo: data } });
    else if (target === 'socialPix') updateConfig({ socialProject: { ...config.socialProject, pixQrCode: data } });
    else if (target === 'downloadIcon' && uploadTarget?.id) {
       const prog = downloads.find(d => d.id === uploadTarget.id);
       if (prog) updateDownload({ ...prog, image: data });
    }
    else if (target === 'clientLogo' && uploadTarget?.id) {
       const client = clients.find(c => c.id === uploadTarget.id);
       if (client) updateClient({ ...client, logo: data });
    }
    else if (target === 'campaign' && index !== undefined) {
      const newCamps = [...(config.homeCampaigns || [])];
      newCamps[index] = { ...newCamps[index], image: data };
      updateConfig({ homeCampaigns: newCamps });
    }
    setUploadTarget(null);
  };

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
      
      <div className="bg-[#0369A1] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border-8 border-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#FFFF00] rounded-2xl text-[#0369A1] shadow-xl rotate-3"><Settings size={32} /></div>
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Gestão de Conteúdo Master</h2>
              <p className="text-[10px] text-[#FFFF00] font-black uppercase tracking-widest mt-1">Editor Completo de Design, Imagens e Textos</p>
            </div>
          </div>
          <button onClick={() => alert("Todas as alterações foram salvas no sistema!")} className="bg-[#FFFF00] text-[#0369A1] px-10 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3 border-4 border-white hover:scale-105 transition-all">
            <Save size={20} /> Salvar Alterações
          </button>
        </div>
      </div>

      <div className="flex bg-white p-2 rounded-[2.5rem] border border-sky-100 shadow-xl overflow-x-auto no-scrollbar gap-2">
        {[
          { id: 'global', label: 'Design Global', icon: Palette },
          { id: 'home', label: 'Início', icon: Home },
          { id: 'services', label: 'Prestação Serviço', icon: Briefcase },
          { id: 'pickup', label: 'Leva e Traz', icon: Truck },
          { id: 'about', label: 'Sobre Nós', icon: BookOpen },
          { id: 'contact', label: 'Contato', icon: MapPin },
          { id: 'clients', label: 'Clientes B2B', icon: Users2 },
          { id: 'social', label: 'Projeto Social', icon: Heart },
          { id: 'downloads', label: 'Downloads', icon: Download },
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 px-6 py-4 rounded-[1.5rem] transition-all font-black uppercase text-[9px] tracking-widest ${activeTab === tab.id ? 'bg-[#0EA5E9] text-white shadow-lg' : 'text-sky-300 hover:bg-sky-50'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-sky-50/50 min-h-[60vh] rounded-[4rem] p-4 md:p-8">
        {activeTab === 'global' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <section className="bg-white p-10 rounded-[3rem] border border-sky-100 shadow-xl space-y-10">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3"><Palette size={24}/> Cores do Sistema</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-sky-400 uppercase">Cor Primária (Botões/Ícones)</label>
                  <input type="color" className="w-full h-16 rounded-2xl cursor-pointer" value={config.primaryColor} onChange={e => updateConfig({ primaryColor: e.target.value })} />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-sky-400 uppercase">Cor Secundária (Destaques)</label>
                  <input type="color" className="w-full h-16 rounded-2xl cursor-pointer" value={config.secondaryColor} onChange={e => updateConfig({ secondaryColor: e.target.value })} />
                </div>
              </div>
            </section>
            
            <section className="bg-[#0369A1] p-10 rounded-[3rem] text-white shadow-xl space-y-10 border-8 border-white/5">
              <h3 className="text-xl font-black uppercase italic flex items-center gap-3 text-[#FFFF00]"><Layout size={24}/> Textos de Navegação Global</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase px-2 opacity-60">Título Superior (Header)</label>
                  <input className="w-full px-6 py-4 rounded-xl bg-white/10 border-none text-white font-bold" value={config.headerText} onChange={e => updateConfig({ headerText: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase px-2 opacity-60">WhatsApp Principal</label>
                  <input className="w-full px-6 py-4 rounded-xl bg-white/10 border-none text-white font-bold" value={config.whatsapp} onChange={e => updateConfig({ whatsapp: e.target.value })} />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'downloads' && (
          <section className="bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-12">
            <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter flex items-center gap-3"><Download size={32}/> Textos da Página de Downloads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título H1</label>
                    <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-2xl text-[#0369A1] italic" value={config.downloadsPage?.title || ''} onChange={e => updateConfig({ downloadsPage: { ...(config.downloadsPage || {}), title: e.target.value } })} />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Texto de Descrição Principal</label>
                  <textarea rows={6} className="w-full px-8 py-8 rounded-[3rem] bg-sky-50 border-none font-medium text-sky-700 leading-relaxed" value={config.downloadsPage?.description || ''} onChange={e => updateConfig({ downloadsPage: { ...(config.downloadsPage || {}), description: e.target.value } })} />
               </div>
            </div>
          </section>
        )}
      </div>

      {showImageStudio && editingImage && (
        <ImageEditor 
          initialImage={editingImage.url} 
          onSave={(newUrl) => {
            applyImageData(newUrl, editingImage.target, editingImage.index, editingImage.subTarget);
            setShowImageStudio(false);
            setEditingImage(null);
          }} 
          onCancel={() => { setShowImageStudio(false); setEditingImage(null); }} 
        />
      )}
    </div>
  );
};

export default ContentEditor;
