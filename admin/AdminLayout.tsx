
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, 
  Download, Database, ArrowLeft, Menu, 
  TrendingUp, Truck, DollarSign, UserCheck, Wrench,
  MapPin, Settings, Printer, Info, Handshake, Mail, Heart, RefreshCw, Palette, RotateCcw,
  Monitor, ListChecks
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const menuItemsPool = [
    { icon: LayoutDashboard, label: 'Painel Geral', path: '/admin' },
    { icon: Monitor, label: 'PDV / Balcão', path: '/admin/pdv' },
    { icon: ListChecks, label: 'Catálogo Técnico', path: '/admin/catalogo-tecnico' },
    { icon: Palette, label: 'Design & Home', path: '/admin/design' },
    { icon: Printer, label: 'Serviços Digitais', path: '/admin/servicos-digitais' },
    { icon: Truck, label: 'Gestão Leva e Traz', path: '/admin/leva-e-traz' },
    { icon: RefreshCw, label: 'Gestão de Trocas', path: '/admin/trocas' },
    { icon: Heart, label: 'Projeto Social', path: '/admin/social' },
    { icon: Mail, label: 'Gestão de Contato', path: '/admin/contato' },
    { icon: Handshake, label: 'Clientes B2B', path: '/admin/clientes-empresas' },
    { icon: Info, label: 'Sobre Nós', path: '/admin/sobre' },
    { icon: Wrench, label: 'Ordens de Serviço', path: '/admin/os' },
    { icon: Download, label: 'Central Downloads', path: '/admin/downloads' },
    { icon: MapPin, label: 'Gestão de Bairros', path: '/admin/bairros' },
    { icon: UserCheck, label: 'CRM / Clientes', path: '/admin/crm' },
    { icon: Package, label: 'Estoque / Produtos', path: '/admin/produtos' },
    { icon: Truck, label: 'Fornecedores', path: '/admin/fornecedores' },
    { icon: RotateCcw, label: 'Recuperação & IA', path: '/admin/backup' },
  ];

  // Ordenação dinâmica baseada na configuração master
  const orderedMenu = config.adminMenuOrder 
    ? [...menuItemsPool].sort((a, b) => {
        const orderA = config.adminMenuOrder!.indexOf(a.label);
        const orderB = config.adminMenuOrder!.indexOf(b.label);
        if (orderA === -1) return 1;
        if (orderB === -1) return -1;
        return orderA - orderB;
      })
    : menuItemsPool;

  const adminPrimary = config.adminPrimaryColor || '#0EA5E9';
  const adminSecondary = config.adminSecondaryColor || '#FFFF00';

  return (
    <div className="flex h-screen bg-sky-50 overflow-hidden font-sans selection:bg-[#FFFF00] selection:text-[#0369A1]">
      <aside 
        className={`${collapsed ? 'w-24' : 'w-80'} transition-all duration-500 flex flex-col relative z-20 shadow-2xl`}
        style={{ backgroundColor: adminPrimary }}
      >
        <div className="p-8 flex items-center gap-5 border-b border-white/10 overflow-hidden">
          <div className="bg-white p-3 rounded-2xl shrink-0 shadow-xl ring-2" style={{ borderColor: adminSecondary }}>
             {/* Logo PRIORIZA adminLogo, senão usa a logo padrão */}
             <img src={config.adminLogo || config.logo} alt="CRINF Admin" className="h-8 w-8 object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-black text-2xl text-white leading-none italic uppercase truncate">{config.adminTitle || 'CRINF'}</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: adminSecondary }}>{config.adminSubtitle || 'Master Hub'}</span>
            </div>
          )}
        </div>

        <nav className="flex-grow py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {orderedMenu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-[1.5rem] transition-all group ${
                  active 
                  ? 'shadow-xl font-black' 
                  : 'text-white/60 hover:bg-white/10 hover:text-white font-bold'
                }`}
                style={active ? { backgroundColor: adminSecondary, color: '#0369A1' } : {}}
              >
                <item.icon size={22} className={active ? 'scale-110' : ''} />
                {!collapsed && <span className="text-[11px] uppercase tracking-widest whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={() => navigate('/')} className="flex items-center gap-4 px-4 py-4 w-full rounded-2xl text-white/40 hover:bg-white/10 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest">
            <ArrowLeft size={18} />
            {!collapsed && <span>Sair do Admin</span>}
          </button>
        </div>
      </aside>

      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white h-24 flex items-center justify-between px-12 border-b border-sky-100 shadow-sm">
          <div className="flex items-center gap-8">
             <button onClick={() => setCollapsed(!collapsed)} className="p-4 bg-sky-50 text-[#0EA5E9] hover:bg-sky-100 rounded-2xl transition-all">
               <Menu size={22} />
             </button>
             <h2 className="text-xl font-black text-[#0369A1] uppercase tracking-tighter italic">
               {orderedMenu.find(i => i.path === location.pathname)?.label || 'Gestão Master'}
             </h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest leading-none">Status Conectado</p>
                <p className="text-sm font-black text-[#0EA5E9] uppercase italic">Admin Sênior</p>
             </div>
             <div 
               className="w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-lg border-4 border-white italic text-xl"
               style={{ backgroundColor: adminPrimary, color: adminSecondary }}
             >
               CR
             </div>
          </div>
        </header>

        <section className="flex-grow p-12 overflow-y-auto bg-sky-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-10">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
