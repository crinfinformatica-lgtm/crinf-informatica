
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Edit3, Trash2, Globe, Save, Monitor, 
  Palette, Type, Image as ImageIcon, Scissors, 
  Settings, CheckCircle2, X, Star, Layout,
  ArrowRight, Info, Sliders, MessageSquare, Quote, Upload, Wand2,
  Instagram, Link as LinkIcon, Share2
} from 'lucide-react';
import { Client } from '../types';
import ImageEditor from './ImageEditor';

const BusinessClientsManager: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient, config, updateConfig } = useApp();
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [imageToEdit, setImageToEdit] = useState<{ url: string; target: 'config' | 'client' } | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'partners' | 'design'>('partners');
  const [showReviewModal, setShowReviewModal] = useState<{ clientId: string } | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const businessClients = clients.filter(c => c.type === 'Business');

  const handleUpdatePageConfig = (updates: any) => {
    updateConfig({ clientsPage: { ...config.clientsPage, ...updates } });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingClient) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageToEdit({ url: result, target: 'client' });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      const exists = clients.find(c => c.id === editingClient.id);
      if (exists) {
        updateClient(editingClient as Client);
      } else {
        addClient({ 
          ...editingClient, 
          type: 'Business', 
          history: [],
          description: editingClient.description || 'Parceiro corporativo CRINF Informática.',
          reviews: [],
          socialLinks: editingClient.socialLinks || []
        } as Client);
      }
      setEditingClient(null);
    }
  };

  const updateSocialLink = (platform: 'Instagram' | 'Website', url: string) => {
    if (!editingClient) return;
    const currentLinks = editingClient.socialLinks || [];
    const otherLinks = currentLinks.filter(l => l.platform !== platform);
    setEditingClient({
      ...editingClient,
      socialLinks: [...otherLinks, { platform, url }]
    });
  };

  const handleAddReview = () => {
    if (!showReviewModal) return;
    const client = clients.find(c => c.id === showReviewModal.clientId);
    if (client) {
      const reviews = [...(client.reviews || []), { ...newReview }];
      updateClient({ ...client, reviews });
      setNewReview({ rating: 5, comment: '' });
      setShowReviewModal(null);
    }
  };

  const removeReview = (clientId: string, index: number) => {
    const client = clients.find(c => c.id === clientId);
    if (client && client.reviews) {
      const reviews = client.reviews.filter((_, i) => i !== index);
      updateClient({ ...client, reviews });
    }
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {/* Header Corporativo B2B */}
      <div className="bg-white p-12 rounded-[4rem] border border-sky-100 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-sky-50 rounded-full opacity-50 blur-3xl" />
        <div className="flex items-center gap-8 relative z-10">
          <div style={{ backgroundColor: config.clientsPage.primaryColor }} className="p-6 rounded-[2.5rem] text-white shadow-2xl rotate-3 ring-8 ring-white">
            <Globe size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">Gestão de Clientes B2B</h2>
            <p className="text-[11px] text-sky-300 font-black uppercase tracking-[0.3em] mt-2">Autoridade Corporativa & Vitrine Logomarcas</p>
          </div>
        </div>
        
        <div className="flex bg-sky-50 p-2 rounded-[2.5rem] border border-sky-100 relative z-10 overflow-x-auto no-scrollbar">
           <button onClick={() => setActiveSubTab('partners')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'partners' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}>
             <Layout size={18} /> Lista de Parceiros
           </button>
           <button onClick={() => setActiveSubTab('content')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'content' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}>
             <Type size={18} /> Conteúdo Textual
           </button>
           <button onClick={() => setActiveSubTab('design')} className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'design' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}>
             <Palette size={18} /> Design & Cores
           </button>
        </div>
      </div>

      {/* ABA: DESIGN E CORES */}
      {activeSubTab === 'design' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <section className="lg:col-span-5 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-12">
              <div className="flex items-center gap-4 border-b border-sky-50 pb-6">
                <div className="p-3 bg-sky-50 text-[#0EA5E9] rounded-2xl"><Sliders size={24} /></div>
                <h3 className="text-xl font-black text-[#0369A1] uppercase italic tracking-tighter">Identidade Cromática</h3>
              </div>
              
              <div className="space-y-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Principal (Hero Section)</label>
                    <input type="color" className="w-full h-20 rounded-3xl bg-sky-50 border-none p-2 cursor-pointer shadow-inner" value={config.clientsPage.primaryColor} onChange={e => handleUpdatePageConfig({ primaryColor: e.target.value })} />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Secundária (Destaques)</label>
                    <input type="color" className="w-full h-20 rounded-3xl bg-sky-50 border-none p-2 cursor-pointer shadow-inner" value={config.clientsPage.secondaryColor} onChange={e => handleUpdatePageConfig({ secondaryColor: e.target.value })} />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Fundo da Página</label>
                    <input type="color" className="w-full h-20 rounded-3xl bg-sky-50 border-none p-2 cursor-pointer shadow-inner" value={config.clientsPage.backgroundColor || '#FFFFFF'} onChange={e => handleUpdatePageConfig({ backgroundColor: e.target.value })} />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor de Títulos</label>
                    <input type="color" className="w-full h-20 rounded-3xl bg-sky-50 border-none p-2 cursor-pointer shadow-inner" value={config.clientsPage.textColor || '#0369A1'} onChange={e => handleUpdatePageConfig({ textColor: e.target.value })} />
                 </div>
              </div>
           </section>

           <div className="lg:col-span-7 flex flex-col items-center justify-center p-20 bg-sky-50 rounded-[5rem] text-center space-y-8">
              <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center text-[#0EA5E9]"><Monitor size={64}/></div>
              <h4 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">Preview B2B</h4>
              <p className="text-sky-600 font-medium italic text-lg leading-relaxed max-w-sm">
                Ajuste as cores para que combinem com o público corporativo da CRINF. Tons de azul e amarelo cítrico são os pilares da marca.
              </p>
           </div>
        </div>
      )}

      {/* ABA: CONTEÚDO TEXTUAL */}
      {activeSubTab === 'content' && (
        <section className="bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="flex items-center gap-4 border-b border-sky-50 pb-6">
             <div className="p-3 bg-sky-50 text-[#0EA5E9] rounded-2xl"><Type size={24} /></div>
             <h3 className="text-xl font-black text-[#0369A1] uppercase italic tracking-tighter">Textos Estratégicos</h3>
           </div>

           <div className="space-y-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título Principal (H1)</label>
                 <input className="w-full px-8 py-6 rounded-[2rem] bg-sky-50 border-none font-black text-3xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/40 outline-none" value={config.clientsPage.title} onChange={e => handleUpdatePageConfig({ title: e.target.value })} />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Subtítulo Informativo</label>
                 <textarea rows={6} className="w-full px-8 py-8 rounded-[3rem] bg-sky-50 border-none font-medium text-lg text-sky-600 leading-relaxed outline-none" value={config.clientsPage.subtitle} onChange={e => handleUpdatePageConfig({ subtitle: e.target.value })} />
              </div>
           </div>
        </section>
      )}

      {/* ABA: LISTA DE PARCEIROS */}
      {activeSubTab === 'partners' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="flex justify-between items-center gap-6 px-4">
              <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter">Catálogo de Logomarcas</h3>
              <button 
                onClick={() => setEditingClient({ id: `b2b-${Date.now()}`, name: '', logo: '', description: '', reviews: [], socialLinks: [] })}
                className="bg-[#FFFF00] text-[#0369A1] px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 shadow-2xl hover:scale-105 transition-all border-4 border-white"
              >
                <Plus size={24} /> Adicionar Empresa
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businessClients.map(client => (
                <div key={client.id} className="bg-white p-12 rounded-[4.5rem] border border-sky-50 shadow-xl group hover:border-[#0EA5E9] transition-all flex flex-col items-center">
                   <div className="flex justify-end w-full gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => setShowReviewModal({ clientId: client.id })} className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl hover:bg-[#FFFF00] shadow-sm"><MessageSquare size={16}/></button>
                      <button onClick={() => setEditingClient(client)} className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl hover:bg-[#FFFF00] shadow-sm"><Edit3 size={16}/></button>
                      <button onClick={() => deleteClient(client.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white shadow-sm"><Trash2 size={16}/></button>
                   </div>
                   
                   <div className="w-40 h-40 bg-sky-50 rounded-[3rem] p-8 flex items-center justify-center border-4 border-white shadow-inner mb-8 ring-8 ring-sky-50/30 overflow-hidden">
                      <img src={client.logo} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-1000" alt={client.name} />
                   </div>
                   
                   <h4 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter mb-4">{client.name}</h4>
                   <p className="text-xs text-sky-400 font-bold uppercase tracking-widest">{(client.reviews?.length || 0)} Avaliações técnicas</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* MODAL EDITAR CLIENTE */}
      {editingClient && (
        <div className="fixed inset-0 z-[120] bg-[#0369A1]/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[5rem] w-full max-w-5xl shadow-2xl border-8 border-white animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
             <div className="p-12 border-b border-sky-50 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-[#FFFF00] text-[#0369A1] rounded-3xl shadow-xl rotate-3"><Monitor size={32} /></div>
                   <div>
                      <h3 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter">Perfil Corporativo B2B</h3>
                      <p className="text-[11px] font-black text-sky-300 uppercase tracking-widest mt-2">Personalização Completa de Logomarca, Dados & Social</p>
                   </div>
                </div>
                <button onClick={() => setEditingClient(null)} className="p-5 bg-sky-50 rounded-full text-sky-200 hover:text-red-400 transition-all shadow-sm"><X size={36} /></button>
             </div>

             <form onSubmit={handleSaveClient} className="p-12 lg:p-16 overflow-y-auto custom-scrollbar flex-grow space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                   <div className="lg:col-span-5 space-y-10">
                      <div className="space-y-4">
                         <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Logomarca (Alta Definição)</label>
                         <div className="relative group aspect-square bg-sky-50 rounded-[4.5rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner ring-8 ring-sky-50/50">
                            {editingClient.logo ? <img src={editingClient.logo} className="max-w-[70%] max-h-[70%] object-contain" /> : <ImageIcon size={80} className="opacity-20 text-[#0EA5E9]" />}
                            <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                               <button type="button" onClick={triggerFileUpload} className="bg-[#FFFF00] text-[#0369A1] px-8 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-3 shadow-xl hover:scale-105 transition-all"><Upload size={18} /> Upload Logo</button>
                               <button type="button" onClick={() => setImageToEdit({ url: editingClient.logo || '', target: 'client' })} className="bg-white/10 px-8 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-3 border border-white/20 transition-all"><Scissors size={18} /> Studio IA</button>
                            </div>
                         </div>
                      </div>

                      {/* REDES SOCIAIS DA EMPRESA */}
                      <div className="bg-sky-50 p-8 rounded-[3rem] space-y-6">
                         <h4 className="text-[11px] font-black text-[#0EA5E9] uppercase tracking-widest flex items-center gap-2 border-b border-sky-100 pb-4">
                            <Share2 size={16} /> Canais Digitais
                         </h4>
                         <div className="space-y-4">
                            <div className="relative">
                               <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0EA5E9]" size={20} />
                               <input 
                                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none font-bold text-[#0369A1] text-xs" 
                                 placeholder="URL Instagram"
                                 value={editingClient.socialLinks?.find(l => l.platform === 'Instagram')?.url || ''}
                                 onChange={e => updateSocialLink('Instagram', e.target.value)}
                               />
                            </div>
                            <div className="relative">
                               <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0EA5E9]" size={20} />
                               <input 
                                 className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none font-bold text-[#0369A1] text-xs" 
                                 placeholder="Website / Portfólio"
                                 value={editingClient.socialLinks?.find(l => l.platform === 'Website')?.url || ''}
                                 onChange={e => updateSocialLink('Website', e.target.value)}
                               />
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="lg:col-span-7 space-y-12">
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Razão Social / Nome de Exibição</label>
                        <input required className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-3xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/40 outline-none" value={editingClient.name} onChange={e => setEditingClient({...editingClient, name: e.target.value})} placeholder="Nome da Empresa Parceira" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Descrição Curta (Segmento)</label>
                        <textarea rows={6} required className="w-full px-10 py-8 rounded-[3.5rem] bg-sky-50 border-none font-medium text-lg text-sky-600 leading-relaxed outline-none" value={editingClient.description} onChange={e => setEditingClient({...editingClient, description: e.target.value})} placeholder="Ex: Indústria de Plásticos / Setor Educacional..." />
                      </div>
                   </div>
                </div>
                
                <div className="flex justify-end gap-6 pt-12 border-t border-sky-50">
                   <button type="submit" className="px-20 py-7 rounded-[3rem] bg-[#0369A1] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-sky-300 flex items-center gap-4">
                      <CheckCircle2 size={28} /> Salvar Ficha B2B
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* MODAL DE AVALIAÇÃO */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[130] bg-[#0369A1]/95 backdrop-blur-3xl flex items-center justify-center p-6">
           <div className="bg-white rounded-[5rem] w-full max-w-2xl shadow-2xl border-8 border-white p-16 text-center space-y-12 animate-in zoom-in-95 duration-500">
              <div className="w-28 h-28 bg-[#FFFF00] text-[#0369A1] rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl ring-8 ring-sky-50 rotate-3">
                 <Quote size={56} strokeWidth={3} />
              </div>
              <h3 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">Registrar Depoimento B2B</h3>
              
              <div className="space-y-10 text-left">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Pontuação de Satisfação (1 a 5 Estrelas)</label>
                    <div className="flex justify-center gap-6">
                       {[1, 2, 3, 4, 5].map(star => (
                         <button key={star} onClick={() => setNewReview({...newReview, rating: star})} className={`p-5 rounded-3xl transition-all hover:scale-110 ${newReview.rating >= star ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'bg-sky-50 text-sky-200'}`}>
                           <Star size={32} fill={newReview.rating >= star ? 'currentColor' : 'none'} strokeWidth={3} />
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Relato do Gestor / Empresa</label>
                    <textarea rows={4} className="w-full px-8 py-6 rounded-[2.5rem] bg-sky-50 border-none font-bold text-[#0369A1] italic outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} placeholder="Escreva o feedback comercial aqui..." />
                 </div>
              </div>

              <div className="flex flex-col gap-6">
                 <button onClick={handleAddReview} className="w-full bg-[#0EA5E9] text-white py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-sky-300">Publicar Avaliação</button>
                 <button onClick={() => setShowReviewModal(null)} className="text-sky-300 font-black uppercase text-[11px] tracking-widest hover:text-red-400 transition-colors">Descartar</button>
              </div>
           </div>
        </div>
      )}

      {/* Editor de Imagem IA */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit.url}
          onSave={(editedUrl) => {
            if (imageToEdit.target === 'client' && editingClient) {
              setEditingClient({ ...editingClient, logo: editedUrl });
            }
            setImageToEdit(null);
          }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default BusinessClientsManager;
