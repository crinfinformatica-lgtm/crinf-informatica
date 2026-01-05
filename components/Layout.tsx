
import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingCart, Menu, Phone, Home, Briefcase, Truck, 
  Settings, User, Heart, Download, HelpCircle, MapPin, 
  MessageCircle, Instagram, Facebook, Twitter, Youtube, Linkedin, Share2
} from 'lucide-react';

const Layout: React.FC = () => {
  const { config = {} as any, cart = [] } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Loja', path: '/loja' },
    { name: 'Serviços Digitais', path: '/servicos' },
    { name: 'Leva e Traz', path: '/leva-e-traz' },
    { name: 'Clientes', path: '/clientes' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'Social', path: '/projeto-social' },
    { name: 'Contato', path: '/contato' },
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram size={20} />;
      case 'facebook': return <Facebook size={20} />;
      case 'twitter': return <Twitter size={20} />;
      case 'youtube': return <Youtube size={20} />;
      case 'linkedin': return <Linkedin size={20} />;
      default: return <Share2 size={20} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white pb-20 lg:pb-0 font-sans selection:bg-[#FFFF00] selection:text-[#0369A1]">
      {/* Botão Flutuante WhatsApp Global com Texto */}
      <a 
        href={`https://wa.me/${config.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-28 left-6 lg:bottom-10 lg:left-10 z-[70] bg-[#25D366] text-white px-6 py-4 rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 border-4 border-white group animate-bounce"
        style={{ animationDuration: '5s' }}
        aria-label="Contato WhatsApp"
      >
        <div className="relative">
          <MessageCircle size={28} fill="currentColor" className="text-white" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#25D366] border-2 border-white"></span>
          </span>
        </div>
        <div className="flex flex-col items-start leading-none pr-2">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Dúvidas?</span>
          <span className="text-sm font-black uppercase italic tracking-tighter whitespace-nowrap">Fale Conosco</span>
        </div>
      </a>

      {/* Top Bar dinâmico */}
      <div 
        style={{ backgroundColor: config.primaryColor }}
        className="hidden lg:flex text-white text-[11px] font-bold py-2.5 px-8 justify-between items-center tracking-widest border-b border-white/10"
      >
        <div className="flex gap-8">
          <span className="flex items-center gap-2 hover:text-[#FFFF00] transition-colors"><Phone size={12} className="text-[#FFFF00]" /> {config.whatsapp}</span>
          <span className="opacity-90 uppercase flex items-center gap-2"><MapPin size={12} className="text-[#FFFF00]" /> {config.address}</span>
        </div>
        <div className="flex gap-6 items-center">
          {user?.isAdmin && (
            <Link to="/admin" className="text-[#FFFF00] hover:scale-105 transition-all flex items-center gap-2 font-black">
              <Settings size={12} /> ACESSO ADMINISTRATIVO
            </Link>
          )}
          {isAuthenticated ? (
            <button onClick={logout} className="text-white/80 hover:text-white transition-colors uppercase text-[10px]">Sair</button>
          ) : (
            <Link to="/login" className="text-white hover:text-[#FFFF00] transition-colors uppercase text-[10px]">Área do Cliente</Link>
          )}
        </div>
      </div>

      {/* Main Header Dinâmico */}
      <header 
        style={{ backgroundColor: config.headerBgColor }}
        className="sticky top-0 z-50 backdrop-blur-md border-b border-sky-100 px-6 py-4 shadow-sm"
      >
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div 
              style={{ backgroundColor: config.primaryColor }}
              className="p-2.5 rounded-2xl shadow-xl shadow-sky-500/10 group-hover:scale-105 transition-all ring-4 ring-[#FFFF00]"
            >
              <img src={config.logo} alt="CRINF" className="h-9 w-9 object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span style={{ color: config.headerTextColor }} className="font-black text-2xl leading-none tracking-tighter uppercase italic">CRINF</span>
              <span style={{ color: config.primaryColor }} className="text-[9px] font-black tracking-[0.4em] uppercase -mt-0.5">INFORMÁTICA</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8 font-black text-[10px] uppercase tracking-[0.2em]">
            {navLinks.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                style={{ color: isActive(link.path) ? config.primaryColor : config.headerTextColor + '80' }}
                className={`hover:opacity-100 transition-opacity`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/loja')} className="hidden md:flex p-3 text-sky-400 hover:bg-sky-50 rounded-xl transition-all"><HelpCircle size={22} /></button>
            <button 
              onClick={() => navigate('/loja')} 
              style={{ backgroundColor: config.secondaryColor, color: config.headerTextColor }}
              className="p-4 rounded-2xl relative transition-all active:scale-90 shadow-xl border border-sky-100"
            >
              <ShoppingCart size={22} strokeWidth={2.5} />
              {(cart || []).length > 0 && <span style={{ backgroundColor: config.primaryColor }} className="absolute -top-2 -right-2 text-white text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg animate-in zoom-in-0">{(cart || []).reduce((acc, curr) => acc + curr.quantity, 0)}</span>}
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-grow"><Outlet /></main>

      {/* Footer Profissional Dinâmico */}
      <footer 
        style={{ backgroundColor: config.footerBgColor, color: config.footerTextColor }}
        className="py-20 px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-8">
             <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2.5 rounded-2xl"><img src={config.logo} className="h-10 w-10 brightness-0 invert" alt="CRINF" /></div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter">CRINF CL</h3>
             </div>
             <p className="text-sm opacity-70 font-medium max-w-sm leading-relaxed">{config.footerText}</p>
             
             {/* Redes Sociais do Rodapé */}
             <div className="flex flex-wrap gap-4 pt-4">
                {(config.socialLinks || []).map((social, i) => (
                  <a 
                    key={i} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ backgroundColor: config.secondaryColor }}
                    className="p-3 rounded-xl text-[#0369A1] hover:scale-110 transition-transform shadow-lg"
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
                <Link to="/projeto-social" style={{ backgroundColor: config.secondaryColor }} className="text-[#0369A1] px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2"><Heart size={14} /> Projeto Gotinhas</Link>
             </div>
          </div>
          
          <div className="space-y-6">
             <h4 style={{ color: config.secondaryColor }} className="font-black uppercase tracking-widest text-xs">Navegação</h4>
             <ul className="space-y-4 text-xs font-bold opacity-60 uppercase tracking-widest">
                {(config.footerLinks || []).filter(l => l.category === 'Navegação').map(link => (
                  <li key={link.id}><Link to={link.url} className="hover:opacity-100 transition-opacity">{link.label}</Link></li>
                ))}
             </ul>
          </div>

          <div className="space-y-6">
             <h4 style={{ color: config.secondaryColor }} className="font-black uppercase tracking-widest text-xs">Institucional</h4>
             <ul className="space-y-4 text-xs font-bold opacity-60 uppercase tracking-widest">
                {(config.footerLinks || []).filter(l => l.category === 'Institucional').map(link => (
                  <li key={link.id}><Link to={link.url} className="hover:opacity-100 transition-opacity">{link.label}</Link></li>
                ))}
             </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">{config.address}</span>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">© {new Date().getFullYear()} CRINF INFORMÁTICA - Campo Largo / PR</span>
        </div>
      </footer>

      {/* Mobile Bar Dinâmica */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-sky-50 px-6 py-4 flex justify-between items-center z-[60] shadow-2xl rounded-t-[2.5rem]">
        <Link to="/" style={{ color: isActive('/') ? config.primaryColor : '#CBD5E1' }} className={`flex flex-col items-center gap-1`}><Home size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Início</span></Link>
        <Link to="/loja" style={{ color: isActive('/loja') ? config.primaryColor : '#CBD5E1' }} className={`flex flex-col items-center gap-1`}><Briefcase size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Loja</span></Link>
        <Link to="/leva-e-traz" className="flex flex-col items-center group -mt-12"><div style={{ backgroundColor: config.secondaryColor }} className="text-[#0369A1] p-4 rounded-2xl shadow-xl border-4 border-white"><Truck size={24} strokeWidth={2.5} /></div><span className="text-[8px] font-black uppercase tracking-widest mt-2 text-[#0369A1]">Coleta</span></Link>
        <Link to="/downloads" style={{ color: isActive('/downloads') ? config.primaryColor : '#CBD5E1' }} className={`flex flex-col items-center gap-1`}><Download size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Apoio</span></Link>
        <Link to="/login" style={{ color: isActive('/login') ? config.primaryColor : '#CBD5E1' }} className={`flex flex-col items-center gap-1`}><User size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Entrar</span></Link>
      </nav>
    </div>
  );
};

export default Layout;
