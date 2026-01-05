
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Send, Phone, Mail, MapPin, Clock, 
  Instagram, Facebook, MessageCircle, 
  ExternalLink, HelpCircle, XCircle, CheckCircle2,
  Globe, Youtube, Twitter, Share2
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const { config } = useApp();
  const page = config.contactPage;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Simulação de envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={24} />;
      case 'facebook': return <Facebook size={24} />;
      case 'youtube': return <Youtube size={24} />;
      case 'twitter': return <Twitter size={24} />;
      case 'linkedin': return <Twitter size={24} />;
      case 'tiktok': return <Globe size={24} />;
      default: return <Share2 size={24} />;
    }
  };

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[#FFFF00] selection:text-[#0369A1] transition-colors duration-500"
      style={{ backgroundColor: page.backgroundColor || '#F0F9FF' }}
    >
      {/* Hero Section Master */}
      <section 
        className="py-32 px-6 text-center relative overflow-hidden"
        style={{ backgroundColor: page.primaryColor || '#0369A1' }}
      >
        <div className="absolute inset-0">
          <img src={page.image} className="w-full h-full object-cover opacity-20" alt="Contato Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="max-w-5xl mx-auto space-y-10 relative z-10 text-white animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-3 rounded-full border border-white/20 shadow-2xl">
            <MessageCircle size={20} className="text-[#FFFF00]" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Central de Atendimento Campo Largo</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">
            {page.title}
          </h1>
          <p className="text-2xl md:text-3xl text-white font-medium opacity-95 italic max-w-3xl mx-auto leading-relaxed border-l-4 border-[#FFFF00] pl-8">
            {page.subtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-24 px-8 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Lado Esquerdo: Unidades Físicas (Dinâmicas) */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
             <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter" style={{ color: page.textColor || '#0369A1' }}>
                Nossas <span className="text-[#0EA5E9]">Unidades</span>
             </h2>
             <p className="text-sky-400 font-bold uppercase text-[11px] tracking-[0.4em]">Visite-nos para suporte técnico ou impressões</p>
          </div>

          <div className="space-y-10">
             {page.units.map((unit, idx) => (
               <div key={idx} className="bg-white rounded-[4rem] border border-sky-100 shadow-2xl overflow-hidden group hover:border-[#0EA5E9] transition-all">
                  <div className="h-64 relative overflow-hidden">
                     {unit.mapEmbedUrl ? (
                        <iframe 
                           src={unit.mapEmbedUrl} 
                           className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-1000"
                           style={{ border: 0 }} 
                           allowFullScreen 
                           loading="lazy" 
                        />
                     ) : (
                        <div className="w-full h-full bg-sky-50 flex items-center justify-center opacity-20">
                           <MapPin size={80} />
                        </div>
                     )}
                     <div className="absolute top-6 left-6 bg-white px-5 py-2 rounded-2xl shadow-xl flex items-center gap-3">
                        <MapPin size={18} className="text-[#0EA5E9]" />
                        <span className="text-[10px] font-black uppercase text-[#0369A1]">{unit.tag}</span>
                     </div>
                  </div>
                  <div className="p-10 space-y-8">
                     <div className="space-y-3">
                        <h3 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">{unit.name}</h3>
                        <p className="text-sky-600 font-bold text-sm leading-relaxed">{unit.address}</p>
                        <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">{unit.location}</p>
                     </div>
                     <div className="grid grid-cols-1 gap-6 pt-6 border-t border-sky-50">
                        <div className="flex items-start gap-4">
                           <div className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl"><Clock size={20} /></div>
                           <div>
                              <p className="text-[9px] font-black text-sky-300 uppercase leading-none mb-1">Horário de Funcionamento</p>
                              <p className="text-xs font-bold text-sky-600 whitespace-pre-line leading-relaxed">{unit.hours}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-sky-50 text-[#0EA5E9] rounded-xl"><Mail size={20} /></div>
                           <div>
                              <p className="text-[9px] font-black text-sky-300 uppercase leading-none mb-1">E-mail de Contato</p>
                              <p className="text-xs font-bold text-sky-600">{unit.email}</p>
                           </div>
                        </div>
                     </div>
                     <a 
                       href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unit.address + ' ' + unit.location)}`}
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="w-full bg-[#0369A1] text-white py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#0EA5E9] transition-all flex items-center justify-center gap-3 border-4 border-white/10"
                     >
                        Ver Localização no Maps <ExternalLink size={14} />
                     </a>
                  </div>
               </div>
             ))}
          </div>

          {/* Card Principal WhatsApp */}
          <div className="bg-[#FFFF00] p-12 rounded-[4rem] shadow-2xl border-4 border-white flex flex-col items-center text-center gap-8 group">
             <div className="w-24 h-24 bg-[#0369A1] text-[#FFFF00] rounded-[2.5rem] flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
                <Phone size={48} strokeWidth={2.5} />
             </div>
             <div className="space-y-4">
                <h4 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none">Canal WhatsApp</h4>
                <p className="text-xl font-black text-sky-800 italic">{config.whatsapp}</p>
             </div>
             <a 
              href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}`} 
              target="_blank" 
              className="bg-[#0369A1] text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-3 border-4 border-white/20"
             >
                Abrir Chat Agora <MessageCircle size={18} />
             </a>
          </div>
        </div>

        {/* Lado Direito: Formulário e Redes Sociais */}
        <div className="lg:col-span-7">
          <form 
            onSubmit={handleSubmit} 
            className="bg-white p-12 md:p-20 rounded-[5.5rem] border border-sky-50 shadow-[0_50px_100px_-20px_rgba(14,165,233,0.2)] space-y-16"
          >
            <div className="space-y-4">
               <h3 className="text-5xl font-black text-[#0369A1] uppercase italic tracking-tighter leading-none" style={{ color: page.textColor || '#0369A1' }}>Mande um <span className="text-[#0EA5E9]">E-mail</span></h3>
               <p className="text-sky-400 font-bold uppercase text-[11px] tracking-[0.4em]">Preencha os campos abaixo</p>
            </div>

            {status === 'success' ? (
              <div className="text-center py-10 space-y-8 animate-in zoom-in-95 duration-500">
                 <div className="w-32 h-32 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={80} />
                 </div>
                 <h3 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter">Mensagem Enviada!</h3>
                 <p className="text-xl text-sky-600 font-medium italic">Retornaremos o mais breve possível no seu e-mail.</p>
                 <button onClick={() => setStatus('idle')} className="text-[#0EA5E9] font-black uppercase text-xs tracking-widest border-b-2 border-[#0EA5E9] pb-1">Enviar outra mensagem</button>
              </div>
            ) : (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Seu Nome Completo</label>
                       <input required placeholder="João da Silva" className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none transition-all shadow-inner" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">E-mail p/ Retorno</label>
                       <input required type="email" placeholder="seu@email.com" className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none transition-all shadow-inner" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Assunto do Contato</label>
                    <input required className="w-full px-10 py-6 rounded-[2.5rem] bg-sky-50 border-none font-black text-xl text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none shadow-inner" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Ex: Orçamento de Manutenção" />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-4">Mensagem Detalhada</label>
                    <textarea required rows={6} placeholder="Conte-nos o que você precisa..." className="w-full px-10 py-8 rounded-[3.5rem] bg-sky-50 border-none font-medium text-lg text-[#0369A1] italic focus:ring-4 focus:ring-[#FFFF00]/50 outline-none transition-all shadow-inner" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
                 </div>

                 {status === 'error' && (
                    <div className="p-6 bg-red-50 text-red-500 rounded-3xl border border-red-100 font-bold text-xs uppercase flex items-center gap-4 animate-bounce">
                       <XCircle size={24} /> Ocorreu um erro ao enviar. Tente o WhatsApp acima.
                    </div>
                 )}

                 <button 
                  disabled={status === 'sending'}
                  className="w-full bg-[#0369A1] text-white py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 border-4 border-white/20"
                 >
                    {status === 'sending' ? 'Processando Envio...' : 'Enviar Mensagem'} <Send size={24} />
                 </button>
              </div>
            )}
          </form>

          {/* Links de Rede Social Dinâmicos */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
             {config.socialLinks.map((social, i) => (
               <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-[3rem] border border-sky-100 shadow-xl flex flex-col items-center gap-4 hover:bg-sky-50 transition-all group">
                  <div className="p-4 bg-sky-50 text-[#0EA5E9] rounded-2xl group-hover:bg-[#FFFF00] group-hover:text-[#0369A1] transition-all shadow-inner">
                     {getSocialIcon(social.platform)}
                  </div>
                  <span className="text-[9px] font-black uppercase text-[#0369A1] tracking-widest">{social.platform}</span>
               </a>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
