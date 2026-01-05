
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, Target, Eye, ShieldCheck, Quote, 
  Award, Zap, Users, Star, ArrowRight, Heart 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const { config } = useApp();
  const content = config.aboutContent;

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[#FFFF00] selection:text-[#0369A1] overflow-hidden"
      style={{ backgroundColor: content.backgroundColor || '#FFFFFF' }}
    >
      {/* Hero Section - Impacto Visual */}
      <section 
        className="relative py-40 px-6 flex items-center justify-center text-white overflow-hidden"
        style={{ backgroundColor: content.primaryColor || config.primaryColor }}
      >
        <div className="absolute inset-0 opacity-10">
          <History className="absolute -top-20 -left-20 w-96 h-96 rotate-12" />
          <Zap className="absolute -bottom-20 -right-20 w-96 h-96 -rotate-12" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10 animate-in fade-in zoom-in duration-1000">
          <div 
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full shadow-2xl ring-8 ring-white/10"
            style={{ backgroundColor: content.secondaryColor || '#FFFF00', color: content.primaryColor || '#0369A1' }}
          >
            <Award size={20} className="animate-pulse" />
            <span className="text-[12px] font-black uppercase tracking-[0.4em]">Trajetória de Excelência Tecnológica</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter leading-none drop-shadow-2xl">
            {content.heroTitle}
          </h1>
          <p className="text-2xl md:text-3xl font-medium opacity-95 max-w-3xl mx-auto leading-relaxed border-l-4 border-[#FFFF00] pl-8 italic">
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      {/* História & Imagem Institucional */}
      <section className="max-w-7xl mx-auto px-8 py-32 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="relative group">
          <div 
            className="absolute -inset-6 rounded-[5rem] rotate-3 group-hover:rotate-1 transition-transform duration-1000 shadow-2xl"
            style={{ backgroundColor: content.secondaryColor || config.secondaryColor }}
          />
          <div className="relative rounded-[4.5rem] overflow-hidden border-8 border-white shadow-2xl h-[650px] bg-sky-50">
            <img 
              src={content.image} 
              alt="CRINF História" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          {content.logo && (
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-white p-6 rounded-[3rem] shadow-2xl border-4 border-sky-50 flex items-center justify-center animate-bounce-slow">
                <img src={content.logo} className="w-full h-full object-contain" alt="Logo Sobre" />
             </div>
          )}
        </div>

        <div className="space-y-12 animate-in slide-in-from-right duration-1000">
          <div className="space-y-6">
            <h2 
              className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none"
              style={{ color: content.primaryColor || config.primaryColor }}
            >
              {content.historyTitle}
            </h2>
            <div className="w-32 h-2.5 bg-[#FFFF00] rounded-full" />
          </div>
          
          <div className="space-y-8">
            <p className="text-2xl font-black leading-relaxed italic border-l-8 border-sky-100 pl-8" style={{ color: content.textColor || '#0EA5E9' }}>
              {content.text}
            </p>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              {content.secondaryText}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-sky-50">
             <div className="space-y-2">
                <span className="text-5xl font-black tracking-tighter italic" style={{ color: content.primaryColor || config.primaryColor }}>15+</span>
                <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Anos de Inovação</p>
             </div>
             <div className="space-y-2">
                <span className="text-5xl font-black tracking-tighter italic" style={{ color: content.primaryColor || config.primaryColor }}>10k</span>
                <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Equipamentos Recuperados</p>
             </div>
          </div>
        </div>
      </section>

      {/* Tríade de Poder: Missão, Visão e Valores */}
      <section className="bg-sky-50 py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Target,
              title: "Nossa Missão",
              color: content.primaryColor || config.primaryColor,
              text: content.mission,
              sub: "Propósito Técnico"
            },
            {
              icon: Eye,
              title: "Nossa Visão",
              color: "#0369A1",
              text: content.vision,
              sub: "Futuro Digital"
            },
            {
              icon: ShieldCheck,
              title: "Nossos Valores",
              color: content.secondaryColor || config.secondaryColor,
              iconColor: "text-[#0369A1]",
              text: content.values,
              sub: "Ética e Precisão"
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-14 rounded-[5rem] shadow-2xl border border-sky-100 flex flex-col items-center text-center space-y-8 group hover:-translate-y-4 transition-all duration-700">
              <div 
                className={`${item.iconColor || 'text-white'} p-8 rounded-[2.5rem] shadow-2xl group-hover:rotate-12 transition-transform duration-500`}
                style={{ backgroundColor: item.color }}
              >
                <item.icon size={48} strokeWidth={2.5} />
              </div>
              <div className="space-y-3">
                 <span className="text-[10px] font-black text-sky-300 uppercase tracking-widest">{item.sub}</span>
                 <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter">{item.title}</h3>
              </div>
              <p className="text-lg text-slate-500 font-medium leading-relaxed italic">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mural de Depoimentos Premium */}
      <section className="py-32 px-6 max-w-7xl mx-auto space-y-24">
        <div className="text-center space-y-6">
          <h2 className="text-5xl md:text-7xl font-black text-[#0369A1] uppercase italic tracking-tighter">O que <span className="text-[#0EA5E9]">Dizem</span> sobre Nós</h2>
          <div className="flex justify-center gap-1.5" style={{ color: content.secondaryColor || '#FFFF00' }}>
            <Star size={28} fill="currentColor" /><Star size={28} fill="currentColor" /><Star size={28} fill="currentColor" /><Star size={28} fill="currentColor" /><Star size={28} fill="currentColor" />
          </div>
          <p className="text-xl text-sky-400 font-bold uppercase tracking-widest italic">Relatos Reais de Nossos Clientes em Campo Largo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {(content.testimonials || []).map((test, idx) => (
            <div 
              key={test.id} 
              className={`p-16 rounded-[5.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-2 relative overflow-hidden group transition-all hover:scale-[1.02] ${idx % 2 === 0 ? 'bg-white border-sky-50' : 'text-white border-transparent'}`}
              style={idx % 2 !== 0 ? { backgroundColor: content.primaryColor || config.primaryColor } : {}}
            >
              <Quote className={`absolute -top-10 -left-10 w-48 h-48 -rotate-12 transition-opacity ${idx % 2 === 0 ? 'text-sky-50 opacity-50' : 'text-white/10'}`} />
              <div className="relative z-10 space-y-10">
                <p className={`text-3xl font-black italic leading-tight ${idx % 2 === 0 ? 'text-[#0369A1]' : 'text-white'}`}>
                  "{test.comment}"
                </p>
                <div className="flex items-center gap-6 pt-10 border-t border-current/10">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-black overflow-hidden border-4 border-white shadow-xl ${idx % 2 === 0 ? 'bg-sky-100 text-[#0EA5E9]' : 'bg-white/20 text-white'}`}>
                    {test.avatar && test.avatar.length > 10 ? <img src={test.avatar} className="w-full h-full object-cover" /> : <Users className="opacity-40" size={32} />}
                  </div>
                  <div>
                    <p className={`font-black uppercase text-sm tracking-widest ${idx % 2 === 0 ? 'text-[#0369A1]' : '#FFFF00'}`} style={idx % 2 !== 0 ? { color: content.secondaryColor || '#FFFF00' } : {}}>{test.name}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${idx % 2 === 0 ? 'text-sky-300' : 'opacity-60'}`}>{test.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 pb-40">
        <div 
          className="max-w-7xl mx-auto rounded-[6rem] p-20 md:p-32 text-[#0369A1] text-center space-y-12 relative overflow-hidden shadow-2xl border-8 border-white"
          style={{ backgroundColor: content.secondaryColor || config.secondaryColor }}
        >
           <div className="absolute top-0 left-0 w-full h-full bg-white/10 pointer-events-none" />
           <div className="space-y-4 relative z-10">
              <h2 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">
                Faça Parte da <br/><span className="text-[#0EA5E9]">Nossa História</span>
              </h2>
           </div>
           <p className="text-2xl md:text-3xl font-black uppercase tracking-widest opacity-80 relative z-10 italic">
             Estamos prontos para o seu próximo desafio tecnológico.
           </p>
           <div className="flex flex-col sm:flex-row gap-8 justify-center relative z-10 pt-6">
              <Link 
                to="/leva-e-traz" 
                className="text-white px-16 py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-white/20"
                style={{ backgroundColor: content.primaryColor || config.primaryColor }}
              >
                Agendar Coleta <Truck size={24} />
              </Link>
              <Link to="/loja" className="bg-white text-[#0369A1] px-16 py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                Ver Loja Online <ArrowRight size={24}/>
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
};

const Truck = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

export default About;
