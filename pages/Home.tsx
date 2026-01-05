
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Truck, Printer, ArrowRight, Sparkles, Cpu, Smartphone, Copy, Settings, LayoutGrid, List, ShieldCheck, Heart, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { config = {} as any, products = [], addToCart } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-12 pb-12 overflow-hidden bg-white">
      {/* Hero Section Dinâmica */}
      <section className="relative min-h-[600px] lg:h-[85vh] flex items-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={config.bannerImage} 
            className="w-full h-full object-cover" 
            alt="Banner Principal"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-r" 
            style={{ backgroundImage: `linear-gradient(to right, ${config.primaryColor || '#0EA5E9'}F2, ${config.primaryColor || '#0EA5E9'}80, transparent)` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-5xl w-full text-center lg:text-left space-y-10 lg:pl-12">
          <div 
            style={{ backgroundColor: (config.secondaryColor || '#FFFF00') + '33', borderColor: (config.secondaryColor || '#FFFF00') + '4D' }}
            className="inline-flex items-center gap-2 border px-6 py-2.5 rounded-full backdrop-blur-md"
          >
            <Sparkles size={16} style={{ color: config.secondaryColor }} />
            <span className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Referência Técnica em Campo Largo / PR</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl italic uppercase">
            {config.heroText}
          </h1>
          
          <p className="text-lg md:text-2xl text-white font-medium max-w-2xl lg:mx-0 mx-auto leading-relaxed opacity-95 italic">
            {config.heroSubtext}
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-5 pt-6 justify-center lg:justify-start">
            <Link 
              to="/loja" 
              style={{ backgroundColor: config.secondaryColor, color: config.headerTextColor }}
              className="px-10 py-6 rounded-[2rem] font-black text-lg transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 border-4 border-white hover:scale-105"
            >
              Ver Loja <ShoppingBag size={24} />
            </Link>
            
            <Link 
              to="/leva-e-traz" 
              className="bg-[#0EA5E9] text-white px-10 py-6 rounded-[2rem] font-black text-lg transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 border-4 border-white/20 hover:bg-[#0369A1]"
            >
              Leva e Traz <Truck size={24} />
            </Link>

            <Link 
              to="/servicos" 
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/40 px-10 py-6 rounded-[2rem] font-bold text-lg backdrop-blur-md flex items-center justify-center transition-all gap-3 hover:border-white"
            >
              Serviços <Wrench size={24} />
            </Link>
          </div>
        </div>

        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 hidden xl:block opacity-10">
           <Cpu size={600} className="text-white rotate-12" />
        </div>
      </section>

      {/* Campanhas Fotográficas Configuráveis */}
      <section className="px-6 lg:max-w-7xl lg:mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {(config.homeCampaigns || []).map((camp, i) => (
             <Link key={i} to={camp.link} className="relative h-72 rounded-[3.5rem] overflow-hidden group shadow-2xl border-4 border-white">
                <img src={camp.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={camp.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-12">
                   <div>
                      <span style={{ backgroundColor: config.secondaryColor, color: config.headerTextColor }} className="px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block shadow-lg">Oferta Ativa</span>
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{camp.title}</h3>
                   </div>
                </div>
                <div className="absolute top-10 right-10 bg-white/20 backdrop-blur-md p-5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowRight size={28} className="text-white" />
                </div>
             </Link>
           ))}
        </div>
      </section>

      {/* Atalhos Rápidos */}
      <section className="px-6 lg:max-w-7xl lg:mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Cpu, title: config.shortcut1Title, path: '/loja', desc: config.shortcut1Desc },
            { icon: Copy, title: config.shortcut2Title, path: '/servicos', desc: config.shortcut2Desc },
            { icon: Truck, title: config.shortcut3Title, path: '/leva-e-traz', desc: config.shortcut3Desc },
            { icon: Heart, title: config.shortcut4Title, path: '/projeto-social', desc: config.shortcut4Desc }
          ].map((item, i) => (
            <Link key={i} to={item.path} className={`bg-white p-8 rounded-[3rem] shadow-xl border border-sky-50 flex flex-col items-center text-center hover:bg-sky-50 transition-all transform hover:-translate-y-2 group`}>
              <div style={{ color: config.primaryColor }} className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#FFFF00] group-hover:text-[#0369A1] transition-colors">
                <item.icon size={32} />
              </div>
              <h3 className="text-md font-black text-[#0369A1] leading-tight uppercase tracking-tight italic">{item.title}</h3>
              <p className="text-[10px] font-bold text-sky-300 uppercase mt-1 tracking-widest">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Loja Preview */}
      <section className="space-y-10 py-10">
        <div className="px-6 flex flex-col sm:flex-row justify-between items-center lg:max-w-7xl lg:mx-auto gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-4xl font-black text-[#0369A1] tracking-tighter uppercase italic">Novidades Tech</h2>
            <p className="text-sm text-sky-400 font-bold uppercase tracking-widest italic">Equipamentos selecionados por nossos técnicos</p>
          </div>
          <Link to="/loja" style={{ color: config.primaryColor }} className="bg-sky-50 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all">
            Explorar Catálogo Completo <ArrowRight size={16} />
          </Link>
        </div>

        <div className="px-6 lg:max-w-7xl lg:mx-auto">
           <div className="flex overflow-x-auto gap-8 no-scrollbar pb-10">
              {products.map(product => (
                <div key={product.id} className="min-w-[300px] bg-white rounded-[3.5rem] border border-sky-50 p-6 shadow-2xl shadow-sky-500/5 flex-shrink-0 group hover:border-[#0EA5E9]/30 transition-all">
                  <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-sky-50 mb-6 relative border border-sky-100 shadow-inner">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-5 left-5 flex flex-col gap-2">
                      <div 
                        style={{ backgroundColor: product.condition === 'Novo' ? config.secondaryColor : config.primaryColor }}
                        className={`text-[9px] font-black px-4 py-2 rounded-full uppercase border-2 border-white shadow-lg ${product.condition === 'Novo' ? 'text-[#0369A1]' : 'text-white'}`}
                      >
                        {product.condition}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 px-2">
                    {product.shortDescription && (
                      <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest leading-none">
                        {product.shortDescription}
                      </p>
                    )}
                    <h3 className="text-lg font-black text-[#0369A1] line-clamp-1 uppercase italic tracking-tighter">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <p style={{ color: config.primaryColor }} className="text-2xl font-black tracking-tighter italic">
                        R$ {(product.salePrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <button 
                        onClick={() => addToCart(product.id, 1)} 
                        style={{ backgroundColor: config.primaryColor }}
                        className="text-white p-4 rounded-2xl active:scale-90 transition-transform hover:brightness-110 shadow-lg"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
