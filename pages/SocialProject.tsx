
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Heart, Instagram, Share2, MapPin, 
  HandHeart, ShieldCheck, Copy, CheckCircle2, 
  MessageCircle, ExternalLink, Info, Award,
  Quote, QrCode, Facebook, Youtube, Zap
} from 'lucide-react';

const SocialProjectPage: React.FC = () => {
  const { config } = useApp();
  const project = config.socialProject;
  const [copied, setCopied] = useState(false);

  const handleCopyPix = () => {
    if (!project.pixKey) return;
    navigator.clipboard.writeText(project.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={22} />;
      case 'facebook': return <Facebook size={22} />;
      case 'youtube': return <Youtube size={22} />;
      default: return <Share2 size={22} />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FFFF00] selection:text-[#0369A1]">
      {/* Hero Section Master */}
      <section className="relative py-32 px-6 overflow-hidden bg-gradient-to-b from-sky-50 to-white">
        <div 
          className="absolute top-0 right-0 w-1/3 h-full rounded-l-[10rem] -z-10 opacity-5" 
          style={{ backgroundColor: project.primaryColor }}
        />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FFFF00]/10 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10 animate-in fade-in zoom-in duration-1000">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFFF00] rounded-[3.5rem] blur-2xl opacity-20 animate-pulse" />
            <div className="w-56 h-56 bg-white p-6 rounded-[4rem] shadow-2xl ring-[1.5rem] ring-sky-50 relative z-10 flex items-center justify-center border-4 border-white/50">
              <img src={project.logo} alt={project.name} className="w-full h-full object-contain" />
            </div>
            <div 
              style={{ backgroundColor: project.primaryColor }}
              className="absolute -bottom-6 -right-6 text-white p-6 rounded-3xl shadow-2xl border-4 border-white animate-bounce-slow"
            >
              <Heart size={32} fill="currentColor" />
            </div>
          </div>

          <div className="space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-white px-8 py-3 rounded-full shadow-xl border border-sky-100">
               <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
               <span className="text-[11px] font-black text-[#0369A1] uppercase tracking-[0.4em]">Iniciativa Solidária CRINF Ativa</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-[#0369A1] tracking-tighter uppercase italic leading-[0.8] drop-shadow-sm">
              {project.name?.split(' ').map((w, i) => (
                <span key={i} style={i === 1 ? { color: project.primaryColor } : {}}>{w} </span>
              ))}
            </h1>
            <p className="text-2xl md:text-3xl text-sky-400 font-black tracking-widest uppercase italic mt-4">
              Capelania Hospitalar • Campo Largo/PR
            </p>
          </div>

          <div className="relative max-w-3xl">
             <Quote className="absolute -top-10 -left-10 text-sky-100 w-24 h-24 -z-10" />
             <p className="text-2xl text-slate-500 font-medium leading-relaxed italic">
               {project.description}
             </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-8">
             <a href="#doar" className="bg-[#FFFF00] text-[#0369A1] px-16 py-7 rounded-[3rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-white group">
               Quero Ajudar <Heart size={24} className="group-hover:fill-current transition-all" />
             </a>
             {(project.socialLinks || []).map((link, idx) => (
               <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-sky-100 text-[#0EA5E9] px-12 py-7 rounded-[3rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-sky-50 transition-all shadow-lg">
                 {getSocialIcon(link.platform)} 
                 Ver No {link.platform}
               </a>
             ))}
          </div>
        </div>
      </section>

      {/* Grid de Atuação e Impacto */}
      <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-3 gap-12">
         {[
           { icon: MapPin, title: "Onde Atuamos", text: "Presentes no Hospital Infantil de Campo Largo, levando esperança e apoio a pacientes e famílias." },
           { icon: HandHeart, title: "O que Fazemos", text: "Visitas de capelania humanizada, música, contação de histórias e suporte emocional especializado." },
           { icon: Award, title: "Transparência", text: "A CRINF garante que 100% dos recursos arrecadados via PIX Direto sejam destinados à manutenção das ações." }
         ].map((item, i) => (
           <div key={i} className="bg-white p-12 rounded-[4.5rem] border border-sky-50 shadow-2xl shadow-sky-500/5 space-y-8 group hover:border-[#0EA5E9] transition-all flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-sky-50 text-[#0EA5E9] rounded-3xl flex items-center justify-center group-hover:bg-[#FFFF00] group-hover:text-[#0369A1] transition-all shadow-inner rotate-3">
                 <item.icon size={48} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">{item.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed italic text-lg">{item.text}</p>
           </div>
         ))}
      </section>

      {/* Seção de Doação - O Coração da Página */}
      <section id="doar" className="max-w-7xl mx-auto px-6 py-20 mb-20">
        <div className="bg-[#0369A1] rounded-[6rem] p-12 md:p-24 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center gap-24 border-8 border-white">
          <div className="absolute -right-20 -bottom-20 w-[40rem] h-[40rem] bg-sky-400 rounded-full blur-[150px] opacity-30" />
          
          <div className="lg:w-1/2 space-y-12 relative z-10 text-center lg:text-left">
            <div className="space-y-6">
               <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8]">
                 Sua Gota <br/><span className="text-[#FFFF00]">Muda Tudo</span>
               </h2>
               <p className="text-2xl opacity-90 font-medium leading-relaxed italic max-w-xl mx-auto lg:mx-0">
                 Sua contribuição permite a compra de materiais pedagógicos, brinquedos e suporte emergencial para famílias atendidas no hospital.
               </p>
            </div>
            
            <div className="space-y-8">
               <div className="bg-white/10 p-10 rounded-[3.5rem] border border-white/20 backdrop-blur-xl space-y-6 shadow-2xl">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-[#FFFF00]">Chave PIX Oficial</span>
                    {copied && <span className="text-[10px] font-black bg-green-500 text-white px-4 py-1.5 rounded-full animate-in fade-in duration-500 shadow-lg">Copiado!</span>}
                  </div>
                  <div className="flex items-center justify-between gap-6">
                    <p className="text-xl md:text-3xl font-black italic tracking-tighter truncate text-white">{project.pixKey}</p>
                    <button 
                      onClick={handleCopyPix}
                      className="p-6 bg-[#FFFF00] text-[#0369A1] rounded-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all shrink-0 ring-8 ring-white/5"
                    >
                      <Copy size={32} strokeWidth={3} />
                    </button>
                  </div>
               </div>
               <div className="flex items-center justify-center lg:justify-start gap-4 px-6 text-sky-200">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Apoio Técnico Master: CRINF Informática</span>
               </div>
            </div>
          </div>

          <div className="lg:w-1/2 flex flex-col items-center gap-10 relative z-10">
            <div className="bg-white p-14 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col items-center gap-10 ring-[2rem] ring-white/10 rotate-2 hover:rotate-0 transition-all duration-1000 group">
              <div className="space-y-3 text-center">
                <p className="text-[#0369A1] text-xs font-black uppercase tracking-[0.4em]">Escaneie p/ Doar</p>
                <div className="w-16 h-1.5 bg-[#FFFF00] mx-auto rounded-full group-hover:w-24 transition-all duration-1000" />
              </div>
              <div className="bg-sky-50 p-6 rounded-[3rem] border border-sky-100 shadow-inner group-hover:scale-105 transition-transform duration-700">
                {project.pixQrCode ? (
                   <img src={project.pixQrCode} className="w-64 h-64 object-contain" alt="Pix QR" />
                ) : (
                   <div className="w-64 h-64 flex items-center justify-center opacity-10"><QrCode size={120} /></div>
                )}
              </div>
              <div className="flex items-center gap-3 text-[#0EA5E9] font-black text-xs uppercase tracking-widest bg-sky-50 px-8 py-3 rounded-full">
                <CheckCircle2 size={20} className="text-green-500" /> Doação 100% Segura
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria Storytelling Dinâmica */}
      <section className="max-w-7xl mx-auto px-6 py-32 space-y-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="space-y-4 max-w-2xl text-center md:text-left">
              <h3 className="text-5xl md:text-7xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">O Amor em <span className="text-[#0EA5E9]">Ação</span></h3>
              <p className="text-2xl text-sky-400 font-bold italic">Veja os sorrisos que sua doação ajuda a construir.</p>
           </div>
           <div className="flex items-center gap-6 bg-sky-50 p-6 rounded-[2.5rem] border border-sky-100">
              <div className="flex -space-x-4">
                 {[1,2,3].map(i => <div key={i} className="w-12 h-12 rounded-full bg-white border-4 border-sky-50 shadow-lg flex items-center justify-center text-[10px] font-black text-[#0369A1]">CR</div>)}
              </div>
              <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">+120 famílias <br/>apoiadas mensalmente</p>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
           {(project.images || []).map((img, i) => (
             <div key={i} className="space-y-10 group">
                <div className="relative aspect-[4/5] rounded-[4.5rem] overflow-hidden border-8 border-white shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(14,165,233,0.3)] transition-all hover:-translate-y-4 duration-700">
                  <img src={img.url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-[2000ms]" alt={img.caption} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0369A1]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-12">
                      <Heart size={48} className="text-[#FFFF00] mb-4 scale-0 group-hover:scale-100 transition-transform duration-1000 delay-300" fill="currentColor" />
                      <p className="text-white font-black uppercase text-[11px] tracking-[0.4em] italic">Gotinhas de Amor • CL</p>
                  </div>
                </div>
                <div className="px-10 text-center relative">
                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-sky-100 rounded-full" />
                   <p className="text-sky-700 font-bold text-lg italic leading-relaxed">"{img.caption}"</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Rodapé da Página Social */}
      <section className="bg-sky-50 py-24 px-6 mt-20">
         <div className="max-w-4xl mx-auto text-center space-y-10">
            <h4 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter">Seja um Voluntário</h4>
            <p className="text-xl text-sky-600 font-medium italic">Sua presença física também faz a diferença. Entre em contato conosco via WhatsApp para saber como participar das visitas hospitalares em Campo Largo.</p>
            <a 
              href={`https://wa.me/${config.whatsapp}?text=Olá! Gostaria de saber como ser um voluntário no projeto Gotinhas de Amor.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-[#0EA5E9] text-white px-12 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-[#0369A1] transition-all"
            >
               <MessageCircle size={22} /> Conversar com Equipe Gotinhas
            </a>
         </div>
      </section>
    </div>
  );
};

export default SocialProjectPage;
