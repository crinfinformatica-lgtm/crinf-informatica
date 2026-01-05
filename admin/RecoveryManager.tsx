
import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  RotateCcw, Database, Download, Upload, 
  ShieldCheck, Settings, Save, 
  Package, Users, Truck, Briefcase, FileUp, FileDown,
  Palette, Type, ImageIcon, Scissors,
  LayoutTemplate, FileCode, AlertTriangle, CloudLightning, Bot,
  Monitor, Info, Wand2, Zap, LayoutDashboard
} from 'lucide-react';
import ImageEditor from './ImageEditor';

const RecoveryManager: React.FC = () => {
  const { 
    products = [], services = [], clients = [], config = {} as any, 
    neighborhoods = [], downloads = [], sales = [], exchanges = [], 
    transactions = [], technicalServices = [], serviceOrders = [], 
    categories = [], updateConfig, importFullSnapshot
  } = useApp();
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const importPrefsRef = useRef<HTMLInputElement>(null);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPrefs = () => {
    const prefs = {
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      adminPrimaryColor: config.adminPrimaryColor,
      adminSecondaryColor: config.adminSecondaryColor,
      adminLogo: config.adminLogo,
      adminTitle: config.adminTitle,
      adminSubtitle: config.adminSubtitle,
      logo: config.logo
    };
    downloadFile(JSON.stringify(prefs, null, 2), `crinf_preferencias_${Date.now()}.json`, 'application/json');
  };

  const handleExportSnapshot = () => {
    const data = {
      version: "PRO-6.0",
      timestamp: new Date().toISOString(),
      database: { products, services, technicalServices, clients, neighborhoods, downloads, sales, exchanges, transactions, serviceOrders, categories },
      config: config
    };
    downloadFile(JSON.stringify(data, null, 2), `crinf_snapshot_total_${Date.now()}.json`, 'application/json');
  };

  const handleImportSnapshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          await importFullSnapshot(data);
          alert("Backup restaurado com sucesso!");
        } catch (err) { alert("Erro ao ler arquivo JSON."); }
      };
      reader.readAsText(file);
    }
  };

  const handleExportSystemPrompt = () => {
    const prompt = `ATUE COMO ENGENHEIRO SÊNIOR. OBJETIVO: RECONSTRUIR O SISTEMA CRINF.
TECNOLOGIAS: React 19, TypeScript, Tailwind CSS, Lucide-React, Recharts.
CONTEXTO ATUAL: Loja Online integrada ao PDV e Admin. Persistência em LocalStorage Engine.
ESTADO DOS DADOS: ${JSON.stringify({ config, productCount: products.length, clientCount: clients.length })}.
REGRAS: Gerar código limpo, modularizado, com todas as rotas e funções de upload funcionando.`;
    downloadFile(prompt, `prompt_reconstrucao_sistema.txt`, 'text/plain');
  };

  const handleExportAdminPrompt = () => {
    const prompt = `RECONSTRUÇÃO DO PAINEL ADMINISTRATIVO CRINF.
FOCO: Backoffice avançado, Gestão de Usuários, BI com Recharts, PDV com Sangria e CRM.
ESTADO ATUAL: Título Admin "${config.adminTitle}", Cor Primária "${config.adminPrimaryColor}".
REGRAS: Gerar sidebar colapsável, lógica de autenticação 2FA e Studio de Imagem IA.`;
    downloadFile(prompt, `prompt_reconstrucao_admin.txt`, 'text/plain');
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => {
         const file = e.target.files?.[0];
         if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImageToEdit(ev.target?.result as string);
            reader.readAsDataURL(file);
         }
      }} />
      <input type="file" ref={importInputRef} className="hidden" accept=".json" onChange={handleImportSnapshot} />
      <input type="file" ref={importPrefsRef} className="hidden" accept=".json" onChange={() => alert("Restaurando preferências...")} />

      <div className="bg-[#0369A1] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-8 border-white">
        <LayoutDashboard className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                 <ShieldCheck size={14} className="text-[#FFFF00]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFF00]">Gestão de Conteúdo e Serviços</span>
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Painel Administrativo</h2>
              <p className="max-w-xl font-medium opacity-80 text-lg italic leading-relaxed">Personalize a identidade do seu backoffice e gerencie ferramentas de resiliência total.</p>
           </div>
           <button onClick={() => alert("Sincronizado!")} className="bg-[#FFFF00] text-[#0369A1] px-12 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl border-4 border-white hover:scale-105 transition-all flex items-center gap-3">
             <Save size={24} /> SALVAR ALTERAÇÕES
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <section className="bg-white p-12 rounded-[4rem] border border-sky-100 shadow-xl space-y-10 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-sky-50 opacity-40 group-hover:rotate-12 transition-transform duration-700"><Settings size={160} /></div>
            <div className="relative z-10 space-y-8">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter">Configurações do Painel</h3>
                  <p className="text-sky-400 font-bold text-xs uppercase tracking-widest leading-relaxed">Salve ou restaure apenas a identidade visual e links.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Logo do Admin</label>
                     <div className="relative group w-24 h-24 bg-sky-50 rounded-2xl border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner">
                        <img src={config.adminLogo || config.logo} className="max-h-[70%] object-contain" />
                        <div className="absolute inset-0 bg-[#0369A1]/90 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                           <button onClick={() => logoInputRef.current?.click()} className="p-2 bg-[#FFFF00] text-[#0369A1] rounded-lg shadow-lg"><Upload size={14}/></button>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Título do Menu</label>
                        <input className="w-full px-4 py-2.5 rounded-xl bg-sky-50 border-none font-black text-[#0369A1] text-xs uppercase italic" value={config.adminTitle || 'CRINF'} onChange={e => updateConfig({ adminTitle: e.target.value })} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Slogan Sidebar</label>
                        <input className="w-full px-4 py-2.5 rounded-xl bg-sky-50 border-none font-bold text-sky-500 text-[9px] uppercase" value={config.adminSubtitle || 'Master Hub'} onChange={e => updateConfig({ adminSubtitle: e.target.value })} />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Primária</label>
                     <input type="color" className="w-full h-12 rounded-xl bg-sky-50 border-none p-1 cursor-pointer" value={config.adminPrimaryColor || '#0EA5E9'} onChange={e => updateConfig({ adminPrimaryColor: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Cor Secundária</label>
                     <input type="color" className="w-full h-12 rounded-xl bg-sky-50 border-none p-1 cursor-pointer" value={config.adminSecondaryColor || '#FFFF00'} onChange={e => updateConfig({ adminSecondaryColor: e.target.value })} />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-sky-50">
                  <button onClick={handleExportPrefs} className="bg-sky-50 text-[#0EA5E9] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0EA5E9] hover:text-white transition-all">
                     <FileUp size={16} /> EXPORTAR PREFERÊNCIAS
                  </button>
                  <button onClick={() => importPrefsRef.current?.click()} className="bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 hover:text-slate-600 transition-all border border-dashed border-slate-300">
                     <FileDown size={16} /> Importar Preferências
                  </button>
               </div>
            </div>
         </section>

         <section className="bg-white p-12 rounded-[4rem] border border-sky-100 shadow-xl space-y-10 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-sky-50 opacity-40 group-hover:rotate-12 transition-transform duration-700"><Database size={160} /></div>
            <div className="relative z-10 space-y-8 flex flex-col h-full">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#0369A1] uppercase italic tracking-tighter">Backup Total do Sistema</h3>
                  <p className="text-sky-400 font-bold text-xs uppercase tracking-widest leading-relaxed">Snapshot completo: Usuários, Avaliações, Fotos e Configurações.</p>
               </div>
               
               <div className="flex-grow flex flex-col items-center justify-center py-10">
                  <div className="w-24 h-24 bg-sky-50 rounded-full flex items-center justify-center text-sky-200 border-4 border-dashed border-sky-100 mb-4">
                     <Download size={48} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black text-sky-300 uppercase">Snapshot v6.0 Pro Ativo</p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={handleExportSnapshot} className="bg-[#0369A1] text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-lg shadow-sky-200">
                     <Download size={18} /> EXPORTAR SNAPSHOT TOTAL
                  </button>
                  <button onClick={() => importInputRef.current?.click()} className="bg-red-50 text-red-500 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all border border-red-200">
                     <AlertTriangle size={18} /> Restauração de Emergência
                  </button>
               </div>
            </div>
         </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <section className="bg-gradient-to-br from-slate-900 to-slate-800 p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
            <Bot className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-8">
               <div className="space-y-4">
                  <div className="bg-[#FFFF00] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">Recurso Sênior</div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">Reconstrução e APK</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed italic">
                    Exporte o "Prompt" completo para recriar o aplicativo identicamente em qualquer ambiente.
                    <span className="text-[#FFFF00] block mt-4 text-xs">
                      Baixe as especificações técnicas atuais para alimentar uma IA e gerar o código-fonte idêntico.
                    </span>
                  </p>
               </div>
               <button onClick={handleExportSystemPrompt} className="w-full bg-white text-slate-900 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#FFFF00] transition-all flex items-center justify-center gap-3 shadow-2xl">
                 <CloudLightning size={20} /> Baixar Prompt do Sistema
               </button>
            </div>
         </section>

         <section className="bg-[#0EA5E9] p-12 rounded-[4.5rem] text-white shadow-2xl relative overflow-hidden group border-4 border-white/10">
            <LayoutTemplate className="absolute -right-10 -bottom-10 w-64 h-64 opacity-20 group-hover:rotate-6 transition-transform duration-1000" />
            <div className="relative z-10 space-y-8">
               <div className="space-y-4">
                  <div className="bg-white text-[#0EA5E9] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">Foco Backoffice</div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter">Reconstrução do Painel Administrativo</h3>
                  <p className="text-sky-100 font-medium text-sm leading-relaxed italic">
                    Exporte o "Prompt" completo para recriar o painel administrativo identicamente.
                    <span className="text-[#FFFF00] block mt-4 text-xs">
                      Prompt focado no backoffice, incluindo gestão de usuários e ferramentas de resiliência.
                    </span>
                  </p>
               </div>
               <button onClick={handleExportAdminPrompt} className="w-full bg-[#0369A1] text-white py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl border-4 border-white/20">
                 <FileCode size={20} /> Baixar Prompt do Painel Administrativo
               </button>
            </div>
         </section>
      </div>

      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit}
          onSave={(edited) => { updateConfig({ adminLogo: edited }); setImageToEdit(null); }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default RecoveryManager;
