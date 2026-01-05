
import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Handshake, Star, Quote, Building2, 
  ShieldCheck, ArrowUpRight, Zap, Briefcase, 
  CheckCircle2, Globe, Heart, Instagram, Link as LinkIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientsPage: React.FC = () => {
  const { clients, config } = useApp();
  const pageConfig = config.clientsPage;
  const businessClients = clients.filter(c => c.type === 'Business');

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[#FFFF00] selection:text-[#0369A1]"
      style={{ backgroundColor: pageConfig.backgroundColor || '#FFFFFF' }}
    >
      {/* Hero Corporativo Master */}
      <section 
        className="relative py-40 px-6 overflow-hidden text-white"
        style={{ backgroundColor: pageConfig.primaryColor }}
      >
        <div className="absolute inset-0">
           <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-white/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-black/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10 animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex p-8 bg-white/10 backdrop-blur-xl rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] ring-4 ring-white/20 border border-white/20">
            <Handshake size={64} style={{ color: pageConfig.secondaryColor }} />
          </div>
          <div className="space-y-6">
            <span style={{ color: pageConfig.secondaryColor }} className="font-black uppercase text-sm tracking-[0.6em]">Alianças de Alta Performance B2B</span>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">
              {pageConfig.title}
            </h1>
          </div>
          <p className="text-2xl md:text-3xl font-medium max-w-4xl mx-auto opacity-90 leading-relaxed italic border-l-4 border-white/30 pl-8">
            {pageConfig.subtitle}
          </p>
          <div className="flex gap-8 pt-6">
             <Link 
               to="/contato" 
               className="px-16 py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-white/20"
               style={{ backgroundColor: pageConfig.secondaryColor, color: pageConfig.primaryColor }}
             >
               Seja um Parceiro
             </Link>
          </div>
        </div>
      </section>

      {/* Grid de Logos - Vitrine de Autoridade */}
      <section className="max-w-7xl mx-auto px-8 py-40">
        <div className="text-center mb-24 space-y-6">
           <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter" style={{ color: pageConfig.primaryColor }}>Quem <span style={{ color: '#0EA5E9' }}>Confia</span> na CRINF</h2>
           <p className="text-sky-400 font-bold uppercase text-xs tracking-[0.4em]">Empresas que impulsionam o progresso em Campo Largo</p>
           <div className="w-24 h-2 bg-[#FFFF00] mx-auto rounded-full mt-8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14">
          {businessClients.map(client => (
            <div key={client.id} className="group relative bg-white border border-sky-50 p-14 rounded-[4.5rem] shadow-2xl hover:shadow-[0_40px_80px_-20px_rgba(14,165,233,0.2)] hover:border-[#0EA5E9] transition-all flex flex-col items-center justify-center text-center gap-10 h-[450px] overflow-hidden">
               <div className="absolute inset-0 bg-sky-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="h-32 w-full flex items-center justify-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 transform group-hover:scale-110 relative z-10">
                  <img src={client.logo} alt={client.name} className="max-h-full max-w-full object-contain drop-shadow-xl" />
               </div>

               <div className="space-y-4 relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0">
                 <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter" style={{ color: pageConfig.textColor || pageConfig.primaryColor }}>{client.name}</h3>
                    <div className="flex items-center justify-center gap-1.5" style={{ color: pageConfig.secondaryColor }}>
                       <Star size={14} fill="currentColor" />
                       <Star size={14} fill="currentColor" />
                       <Star size={14} fill="currentColor" />
                       <Star size={14} fill="currentColor" />
                       <Star size={14} fill="currentColor" />
                    </div>
                 </div>
                 <p className="text-xs font-bold text-sky-400 uppercase tracking-widest">{client.description}</p>
                 <div className="flex gap-4 pt-4 justify-center">
                    {client.socialLinks?.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-sky-50 rounded-xl text-[#0EA5E9] hover:bg-[#FFFF00] transition-colors">
                        {link.platform === 'Instagram' ? <Instagram size={18} /> : <Globe size={18} />}
                      </a>
                    ))}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seção B2B CTA */}
      <section className="px-8 pb-40">
         <div 
           className="max-w-7xl mx-auto rounded-[5rem] p-20 md:p-32 text-center space-y-12 relative overflow-hidden shadow-2xl border-8 border-white"
           style={{ backgroundColor: pageConfig.secondaryColor || '#FFFF00' }}
         >
            <div className="absolute inset-0 bg-white/10 pointer-events-none" />
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-tight" style={{ color: pageConfig.primaryColor }}>
               Escalabilidade <br/><span className="text-white">Corporativa</span>
            </h2>
            <p className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] opacity-80" style={{ color: pageConfig.primaryColor }}>
               Oferecemos contratos de manutenção preventiva e suporte prioritário para sua empresa em Campo Largo.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 relative z-10">
               <Link to="/contato" className="bg-[#0369A1] text-white px-16 py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.3em] shadow-xl hover:scale-105 transition-all border-4 border-white/10">
                  Solicitar Orçamento B2B
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default ClientsPage;
