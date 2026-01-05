
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Download, Edit3, Trash2, Link as LinkIcon, 
  Monitor, X, Save, Search, AlertCircle, FileText, CheckCircle2,
  Image as ImageIcon, Scissors, ExternalLink
} from 'lucide-react';
import { DownloadProgram } from '../types';
import ImageEditor from './ImageEditor';

const DownloadsManager: React.FC = () => {
  const { downloads, addDownload, updateDownload, deleteDownload } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Partial<DownloadProgram> | null>(null);
  const [imageToEdit, setImageToEdit] = useState<{ url: string; id: string } | null>(null);

  const filtered = downloads.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNew = () => {
    setEditingProgram({
      id: `dwn-${Date.now()}`,
      name: '',
      description: '',
      link: '',
      category: 'Utilidades',
      image: 'https://i.imgur.com/kS5sM6C.png',
      caption: ''
    });
    setShowModal(true);
  };

  const handleEdit = (p: DownloadProgram) => {
    setEditingProgram(p);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      const exists = downloads.find(d => d.id === editingProgram.id);
      if (exists) {
        updateDownload(editingProgram as DownloadProgram);
      } else {
        addDownload(editingProgram as DownloadProgram);
      }
      setShowModal(false);
      setEditingProgram(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24">
      {/* Banner de Gestão Master */}
      <div className="bg-[#FFFF00] p-12 rounded-[3.5rem] text-[#0369A1] shadow-2xl relative overflow-hidden border-8 border-white">
        <Download className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-4 text-center md:text-left">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Gestão de Central de Downloads</h2>
              <p className="font-bold opacity-70 uppercase tracking-widest text-xs max-w-lg">
                Gerencie softwares e utilitários técnicos recomendados pela CRINF. Estes arquivos ficam disponíveis publicamente para seus clientes.
              </p>
           </div>
           <button 
             onClick={handleNew}
             className="bg-[#0EA5E9] text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-[#0369A1] transition-all active:scale-95 flex items-center justify-center gap-3 border-4 border-white"
           >
             <Plus size={20} /> Adicionar Novo Software
           </button>
        </div>
      </div>

      {/* Ferramentas de Busca */}
      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-200" size={24} />
        <input 
          type="text" 
          placeholder="Buscar softwares ou categorias técnicas..."
          className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] border-none bg-white shadow-xl shadow-sky-500/5 focus:ring-4 focus:ring-[#FFFF00]/40 outline-none text-[#0369A1] font-bold"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid de Programas Cadastrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(program => (
          <div key={program.id} className="bg-white p-8 rounded-[3rem] border border-sky-50 shadow-2xl shadow-sky-500/5 group flex flex-col hover:border-[#0EA5E9]/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="relative group/img w-16 h-16">
                 <div className="w-16 h-16 bg-sky-50 text-[#0EA5E9] rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border-2 border-white">
                    <img src={program.image} className="max-h-[70%] object-contain" alt={program.name} />
                 </div>
                 <button onClick={() => setImageToEdit({url: program.image, id: program.id})} className="absolute inset-0 bg-[#0369A1]/90 opacity-0 group-hover/img:opacity-100 transition-all rounded-2xl flex items-center justify-center text-white"><Scissors size={14}/></button>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(program)} className="p-3 bg-sky-50 text-sky-300 hover:text-[#0EA5E9] rounded-xl transition-all shadow-sm"><Edit3 size={18} /></button>
                <button onClick={() => deleteDownload(program.id)} className="p-3 bg-red-50 text-red-200 hover:text-red-500 rounded-xl transition-all shadow-sm"><Trash2 size={18} /></button>
              </div>
            </div>

            <div className="flex-grow space-y-4">
               <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black bg-sky-50 text-[#0EA5E9] px-3 py-1.5 rounded-full uppercase tracking-widest">{program.category}</span>
               </div>
               <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-tight">{program.name}</h3>
               <p className="text-[11px] text-sky-400 font-medium leading-relaxed italic">{program.description}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-sky-50 flex items-center justify-between">
               <div className="flex items-center gap-2 text-[9px] font-black text-sky-200 uppercase tracking-widest">
                  <LinkIcon size={14} /> URL VÁLIDA
               </div>
               {/* Fixed: Use imported ExternalLink from lucide-react */}
               <a 
                 href={program.link} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-[#0EA5E9] font-black uppercase text-[10px] tracking-widest hover:underline flex items-center gap-2"
               >
                 Testar Download <ExternalLink size={14} />
               </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Editor de Programa */}
      {showModal && editingProgram && (
        <div className="fixed inset-0 z-[110] bg-[#0369A1]/80 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[4rem] w-full max-w-4xl shadow-2xl border-8 border-white relative animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
             <div className="p-10 border-b border-sky-50 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-[#FFFF00] text-[#0369A1] rounded-2xl shadow-xl rotate-3"><FileText size={32} /></div>
                   <div>
                      <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">Editar Ficha do Software</h3>
                      <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest mt-2">Repositório Técnico CRINF</p>
                   </div>
                </div>
                <button onClick={() => setShowModal(false)} className="bg-sky-50 hover:bg-red-50 text-sky-200 hover:text-red-400 p-4 rounded-full transition-all">
                  <X size={32} />
                </button>
             </div>

             <form onSubmit={handleSave} className="p-10 lg:p-14 space-y-12 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título Comercial do Software</label>
                        <input required className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/40" value={editingProgram.name} onChange={e => setEditingProgram({...editingProgram, name: e.target.value})} placeholder="Ex: Google Chrome Enterprise" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Categoria de Exibição</label>
                        <select className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1] appearance-none" value={editingProgram.category} onChange={e => setEditingProgram({...editingProgram, category: e.target.value})}>
                           <option value="Suporte Remoto">Suporte Remoto</option>
                           <option value="Navegadores">Navegadores Web</option>
                           <option value="Drivers">Drivers & Controladores</option>
                           <option value="Antivírus">Segurança / Antivírus</option>
                           <option value="Office">Pacote Office / PDF</option>
                           <option value="Utilidades">Utilidades Gerais</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Link Direto p/ Servidor (URL)</label>
                        <div className="relative">
                           <input required className="w-full px-12 py-5 rounded-[2rem] bg-sky-50 border-none font-medium text-[#0EA5E9]" value={editingProgram.link} onChange={e => setEditingProgram({...editingProgram, link: e.target.value})} placeholder="https://exemplo.com/download.exe" />
                           <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-200" size={16} />
                        </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Descrição Técnica (O que faz?)</label>
                        <textarea rows={3} required className="w-full px-8 py-5 rounded-[2.5rem] bg-sky-50 border-none font-medium text-[#0369A1]" value={editingProgram.description} onChange={e => setEditingProgram({...editingProgram, description: e.target.value})} placeholder="Descreva a finalidade do software para o cliente..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Dica / Legenda de Apoio (Instrução)</label>
                        <textarea rows={2} className="w-full px-8 py-5 rounded-[2rem] bg-[#FFFF00]/10 border-none font-bold text-xs text-[#0369A1] italic" value={editingProgram.caption} onChange={e => setEditingProgram({...editingProgram, caption: e.target.value})} placeholder="Ex: Após baixar, execute o arquivo como administrador..." />
                      </div>
                   </div>
                </div>

                <div className="flex justify-end gap-6 pt-10 border-t border-sky-50">
                   <button type="button" onClick={() => setShowModal(false)} className="px-12 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest text-sky-300 hover:bg-sky-50 transition-all">Descartar</button>
                   <button type="submit" className="px-20 py-6 rounded-[2.5rem] bg-[#FFFF00] text-[#0369A1] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-all flex items-center gap-3 border-4 border-white">
                      <CheckCircle2 size={24} /> Confirmar Cadastro Master
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Studio de Imagem p/ Ícones */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit.url}
          onSave={(edited) => {
            const prog = downloads.find(d => d.id === imageToEdit.id);
            if (prog) updateDownload({...prog, image: edited});
            setImageToEdit(null);
          }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default DownloadsManager;
