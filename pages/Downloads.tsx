
import React from 'react';
import { useApp } from '../context/AppContext';
import { Download, Monitor, ShieldCheck, ChevronRight, FileCode, Zap, Info, ExternalLink } from 'lucide-react';

const DownloadsPage: React.FC = () => {
  const { downloads, config } = useApp();
  const page = config.downloadsPage;

  return (
    <div className="min-h-screen bg-white font-sans py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Header Profissional de Downloads */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex p-5 bg-[#FFFF00] text-[#0369A1] rounded-[2.5rem] shadow-2xl ring-8 ring-sky-50 rotate-3">
            <Download size={48} strokeWidth={2.5} />
          </div>
          <div className="space-y-4">
             <h1 className="text-6xl md:text-7xl font-black text-[#0369A1] tracking-tighter uppercase italic leading-none">Repositório de <span className="text-[#0EA5E9]">Softwares</span></h1>
             <p className="text-2xl text-[#0EA5E9] font-black uppercase tracking-widest">Apoio Técnico & Suporte</p>
          </div>
          <p className="text-xl text-sky-400 font-medium leading-relaxed italic max-w-3xl mx-auto">
            {page.description || "Baixe as ferramentas necessárias para o suporte remoto ou utilitários verificados para o seu computador."}
          </p>
        </div>

        {/* Grid de Softwares Gerenciados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {downloads.map(program => (
            <div key={program.id} className="bg-white border border-sky-100 rounded-[4rem] p-10 shadow-2xl shadow-sky-500/5 flex flex-col hover:border-[#0EA5E9] transition-all group relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-sky-50 opacity-10 group-hover:rotate-12 transition-transform duration-700"><Monitor size={160}/></div>
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                 <div className="w-24 h-24 bg-white p-5 rounded-[2rem] shadow-xl border-2 border-sky-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <img src={program.image} alt={program.name} className="max-h-full max-w-full object-contain" />
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-black bg-sky-50 text-sky-400 px-4 py-1.5 rounded-full uppercase tracking-widest border border-sky-100">{program.category}</span>
                    <div className="flex items-center gap-1 text-green-500 font-black text-[9px] uppercase tracking-tighter"><ShieldCheck size={14} /> Verificado</div>
                 </div>
              </div>

              <div className="flex-grow space-y-6 relative z-10">
                <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">{program.name}</h3>
                <p className="text-md text-sky-600 font-medium leading-relaxed italic">{program.description}</p>
                
                {program.caption && (
                  <div className="bg-sky-50/50 p-6 rounded-[2rem] border border-sky-100">
                     <p className="text-[11px] font-bold text-sky-400 uppercase leading-relaxed flex items-start gap-3">
                       <Info size={16} className="text-[#0EA5E9] shrink-0 mt-0.5" />
                       {program.caption}
                     </p>
                  </div>
                )}
              </div>

              <a 
                href={program.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-10 bg-[#0EA5E9] text-white py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 hover:bg-[#0369A1] transition-all shadow-xl group/btn border-4 border-white/10"
              >
                Baixar Programa <ExternalLink size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}

          {/* Card de Suporte Remoto Estático */}
          <div className="bg-[#FFFF00] border-8 border-white rounded-[4rem] p-12 shadow-2xl flex flex-col justify-between text-[#0369A1] relative overflow-hidden group">
             <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 transition-transform duration-1000 group-hover:scale-125"><Zap size={240}/></div>
             <div className="space-y-8 relative z-10">
                <div className="w-20 h-20 bg-[#0369A1] text-[#FFFF00] rounded-3xl flex items-center justify-center shadow-xl animate-pulse"><Zap size={40} fill="currentColor" /></div>
                <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-[0.9]">Assistência <br/>Remota</h3>
                <p className="text-sm font-bold leading-relaxed opacity-80 uppercase tracking-widest italic">Acesse o chat para autorizar o suporte técnico imediato via AnyDesk.</p>
             </div>
             <a href={`https://wa.me/${config.whatsapp}?text=Preciso de suporte remoto para meu computador`} target="_blank" className="mt-12 bg-[#0369A1] text-white py-6 rounded-[2.2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl text-center relative z-10 hover:scale-105 transition-all">Solicitar Acesso</a>
          </div>
        </div>

        {/* Banner de Segurança */}
        <div className="bg-[#0369A1] p-12 md:p-16 rounded-[5rem] text-white shadow-2xl relative overflow-hidden border-8 border-white flex flex-col md:flex-row items-center gap-12">
           <div className="shrink-0 p-10 bg-white/10 rounded-[3.5rem] shadow-2xl backdrop-blur-md border border-white/20"><FileCode size={80} className="text-[#FFFF00]" /></div>
           <div className="space-y-6 relative z-10">
              <h4 className="text-4xl font-black uppercase italic tracking-tighter">Segurança Garantida</h4>
              <p className="text-xl opacity-80 font-medium italic leading-relaxed max-w-2xl">
                Todos os arquivos listados são verificados contra vírus e malwares. Caso necessite de um driver específico para sua impressora ou periférico, entre em contato com nosso balcão técnico.
              </p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/20">
                    <ShieldCheck size={16} className="text-green-400" /> SSL Protegido
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/20">
                    <Monitor size={16} className="text-[#FFFF00]" /> Windows & Mac
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;
