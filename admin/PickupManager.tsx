
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, Save, Plus, Trash2, Edit3, Image as ImageIcon, 
  Scissors, CheckCircle2, X, ListPlus, Sliders, Palette, 
  Type, Info, Settings, Layout, MapPin, DollarSign, Search
} from 'lucide-react';
import ImageEditor from './ImageEditor';
import { FormField, NeighborhoodRate } from '../types';

const PickupManager: React.FC = () => {
  const { config, updateConfig, neighborhoods, updateNeighborhood, addNeighborhood, deleteNeighborhood } = useApp();
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'form' | 'prices'>('content');
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (updates: any) => {
    updateConfig({
      pickupPage: { ...config.pickupPage, ...updates }
    });
  };

  const addField = () => {
    const newFields = [
      ...(config.pickupPage.formFields || []),
      { id: `f-${Date.now()}`, label: 'Novo Campo', type: 'text', required: false, options: [] }
    ];
    handleUpdate({ formFields: newFields });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    handleUpdate({
      formFields: config.pickupPage.formFields.map(f => f.id === id ? { ...f, ...updates } : f)
    });
  };

  const removeField = (id: string) => {
    handleUpdate({ formFields: config.pickupPage.formFields.filter(f => f.id !== id) });
  };

  const filteredNeighborhoods = neighborhoods.filter(n => 
    n.name.toLowerCase().includes(neighborhoodSearch.toLowerCase())
  );

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleUpdate({ heroImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
      
      {/* Header Leva e Traz Reconstruído */}
      <div className="bg-white p-12 rounded-[4rem] border border-sky-100 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#FFFF00]/10 rounded-full opacity-50 blur-3xl" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="p-6 bg-[#0EA5E9] rounded-[2.5rem] text-[#FFFF00] shadow-2xl rotate-3">
            <Truck size={48} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">Gestão Leva e Traz</h2>
            <p className="text-[11px] text-sky-300 font-black uppercase tracking-[0.3em] mt-2">Configuração Logística, Agendamento e Preços</p>
          </div>
        </div>
        
        <div className="flex bg-sky-50 p-2 rounded-[2.5rem] border border-sky-100 relative z-10 overflow-x-auto no-scrollbar">
           <button 
             onClick={() => setActiveSubTab('content')}
             className={`px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'content' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}
           >
             <Layout size={18} /> Conteúdo & Imagens
           </button>
           <button 
             onClick={() => setActiveSubTab('form')}
             className={`px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'form' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}
           >
             <Settings size={18} /> Formulário
           </button>
           <button 
             onClick={() => setActiveSubTab('prices')}
             className={`px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeSubTab === 'prices' ? 'bg-white text-[#0EA5E9] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}
           >
             <MapPin size={18} /> Tabela de Preços
           </button>
        </div>
      </div>

      {/* ABA: CONTEÚDO */}
      {activeSubTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="lg:col-span-5 space-y-10">
              <section className="bg-white p-10 rounded-[3.5rem] border border-sky-100 shadow-xl space-y-8">
                 <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                    <ImageIcon className="text-[#0EA5E9]" /> Capa da Página
                 </h3>
                 <div className="relative group aspect-video bg-sky-50 rounded-[3rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner ring-8 ring-sky-50/50">
                    <img src={config.pickupPage.heroImage} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                       <button onClick={() => fileInputRef.current?.click()} className="bg-[#FFFF00] text-[#0369A1] px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2">Trocar Imagem</button>
                       <button onClick={() => setImageToEdit(config.pickupPage.heroImage)} className="bg-white/10 px-6 py-3 rounded-xl font-black uppercase text-[10px] flex items-center gap-2">Studio IA</button>
                    </div>
                 </div>
              </section>
              
              <div className="p-8 bg-sky-50 rounded-[3rem] border border-sky-100 flex items-start gap-6">
                 <Info className="text-[#0EA5E9] shrink-0 mt-1" size={24} />
                 <p className="text-[11px] font-bold text-sky-600 uppercase italic leading-relaxed">
                   Os textos e imagens editados aqui serão refletidos instantaneamente na página pública de agendamento de coleta.
                 </p>
              </div>
           </div>

           <div className="lg:col-span-7 bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-xl space-y-10">
              <h3 className="text-xl font-black text-[#0369A1] uppercase italic flex items-center gap-3 border-b border-sky-50 pb-4">
                 <Type className="text-[#0EA5E9]" /> Todos os Textos
              </h3>
              <div className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título Principal (H1)</label>
                    <input className="w-full px-8 py-6 rounded-[2rem] bg-sky-50 border-none font-black text-3xl text-[#0369A1] italic outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.pickupPage.title} onChange={e => handleUpdate({ title: e.target.value })} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Subtítulo</label>
                    <input className="w-full px-8 py-6 rounded-[2rem] bg-sky-50 border-none font-bold text-lg text-sky-600 outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.pickupPage.subtitle} onChange={e => handleUpdate({ subtitle: e.target.value })} />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Descrição Detalhada / Instruções</label>
                    <textarea rows={6} className="w-full px-8 py-8 rounded-[3rem] bg-sky-50 border-none font-medium text-lg text-sky-600 leading-relaxed outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={config.pickupPage.description} onChange={e => handleUpdate({ description: e.target.value })} />
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* ABA: ESTRUTURA DO FORMULÁRIO */}
      {activeSubTab === 'form' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter flex items-center gap-3"><ListPlus size={28} className="text-[#0EA5E9]" /> Campos do Formulário</h3>
              <button 
                onClick={addField}
                className="bg-[#0EA5E9] text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center gap-4 shadow-xl hover:scale-105 transition-all border-4 border-white"
              >
                 <Plus size={24} /> Adicionar Novo Campo
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {config.pickupPage.formFields.map((field, idx) => (
                <div key={field.id} className="bg-white p-8 rounded-[3rem] border border-sky-100 shadow-2xl space-y-6 group">
                   <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black bg-sky-50 text-sky-400 px-3 py-1 rounded-full uppercase tracking-widest">Campo #{idx + 1}</span>
                      <button onClick={() => removeField(field.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-sky-400 uppercase px-2">Rótulo / Pergunta</label>
                         <input className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0369A1]" value={field.label} onChange={e => updateField(field.id, { label: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-sky-400 uppercase px-2">Tipo de Entrada</label>
                            <select className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0369A1]" value={field.type} onChange={e => updateField(field.id, { type: e.target.value as any })}>
                               <option value="text">Texto</option>
                               <option value="number">Número</option>
                               <option value="select">Lista (Select)</option>
                               <option value="textarea">Área de Texto</option>
                               <option value="date">Data</option>
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-sky-400 uppercase px-2">Obrigatório?</label>
                            <div className="flex gap-2">
                               <button onClick={() => updateField(field.id, { required: true })} className={`flex-1 py-4 rounded-2xl font-black text-[10px] border-2 transition-all ${field.required ? 'bg-[#0369A1] text-white border-white shadow-md' : 'bg-sky-50 text-sky-300 border-sky-100'}`}>SIM</button>
                               <button onClick={() => updateField(field.id, { required: false })} className={`flex-1 py-4 rounded-2xl font-black text-[10px] border-2 transition-all ${!field.required ? 'bg-[#0369A1] text-white border-white shadow-md' : 'bg-sky-50 text-sky-300 border-sky-100'}`}>NÃO</button>
                            </div>
                         </div>
                      </div>
                      {field.type === 'select' && (
                        <div className="space-y-2 pt-2 animate-in slide-in-from-top-2">
                           <label className="text-[10px] font-black text-sky-400 uppercase px-2">Opções (separadas por vírgula)</label>
                           <input className="w-full px-6 py-4 rounded-2xl bg-[#FFFF00]/10 border-none font-bold text-xs text-[#0369A1]" value={field.options?.join(', ')} onChange={e => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })} />
                        </div>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* ABA: TABELA DE PREÇOS (BAIRROS) */}
      {activeSubTab === 'prices' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-200" size={20} />
                <input 
                  type="text" 
                  placeholder="Pesquisar Bairro..."
                  className="w-full pl-14 pr-6 py-4 rounded-[2rem] border-none bg-white shadow-xl shadow-sky-500/5 focus:ring-4 focus:ring-[#FFFF00]/40 outline-none text-[#0369A1] font-bold"
                  value={neighborhoodSearch}
                  onChange={(e) => setNeighborhoodSearch(e.target.value)}
                />
              </div>
              <button 
                onClick={() => addNeighborhood({ id: Date.now().toString(), name: 'Novo Bairro', rate: 0 })}
                className="bg-[#0369A1] text-white px-10 py-4 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-3"
              >
                <Plus size={20} /> Novo Bairro
              </button>
           </div>

           <div className="bg-white rounded-[3.5rem] shadow-2xl border border-sky-50 overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-sky-50/50">
                    <tr>
                       <th className="px-10 py-8 text-[10px] font-black text-sky-400 uppercase tracking-widest">Localidade / Bairro</th>
                       <th className="px-6 py-8 text-[10px] font-black text-sky-400 uppercase tracking-widest">Taxa de Logística (R$)</th>
                       <th className="px-6 py-8 text-[10px] font-black text-sky-400 uppercase tracking-widest">Simulação (2x Ida/Volta)</th>
                       <th className="px-10 py-8 text-[10px] font-black text-sky-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-sky-50">
                    {filteredNeighborhoods.map(n => (
                       <tr key={n.id} className="hover:bg-sky-50/30 transition-all group">
                          <td className="px-10 py-6">
                             <input 
                               className="bg-transparent border-none font-black text-[#0369A1] uppercase italic text-lg outline-none w-full focus:bg-white focus:ring-2 focus:ring-sky-100 rounded-lg px-2"
                               value={n.name}
                               onChange={(e) => updateNeighborhood({...n, name: e.target.value})}
                             />
                          </td>
                          <td className="px-6 py-6">
                             <div className="relative inline-block">
                                <input 
                                  type="number"
                                  step="0.01"
                                  className="pl-8 pr-4 py-2 bg-sky-50 rounded-xl border-none font-black text-[#0EA5E9] text-xl w-32 outline-none focus:ring-2 focus:ring-[#FFFF00]"
                                  value={n.rate}
                                  onChange={(e) => updateNeighborhood({...n, rate: Number(e.target.value)})}
                                />
                                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sky-200" size={16} />
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <span className="text-xl font-black text-[#0369A1] italic">R$ {(n.rate * 2).toFixed(2)}</span>
                             <p className="text-[9px] font-bold text-sky-400 uppercase">Valor final p/ cliente</p>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <button onClick={() => deleteNeighborhood(n.id)} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                <Trash2 size={18} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Editor de Imagem IA Integrado */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit}
          onSave={(editedUrl) => {
            handleUpdate({ heroImage: editedUrl });
            setImageToEdit(null);
          }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default PickupManager;
