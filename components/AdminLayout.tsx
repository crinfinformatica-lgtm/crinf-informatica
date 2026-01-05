
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Briefcase, Users, 
  Download, Image as ImageIcon, Settings, Database, 
  ArrowLeft, ShoppingBag, Heart, Bell, Menu, Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { config } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Resumo', path: '/admin' },
    { icon: Package, label: 'Estoque', path: '/admin/produtos' },
    { icon: Briefcase, label: 'Serviços', path: '/admin/servicos' },
    { icon: ShoppingBag, label: 'Vendas', path: '/admin/vendas' },
    { icon: Users, label: 'Clientes', path: '/admin/clientes' },
    { icon: Download, label: 'Downloads', path: '/admin/downloads' },
    { icon: Heart, label: 'Social', path: '/admin/social' },
    { icon: ImageIcon, label: 'Conteúdo', path: '/admin/conteudo' },
    { icon: Database, label: 'Backup', path: '/admin/backup' },
    { icon: Settings, label: 'Configurações', path: '/admin/config' },
  ];

  return (
    <div className="flex h-screen bg-sky-50 overflow-hidden font-sans selection:bg-[#FFFF00] selection:text-[#0369A1]">
      {/* Sidebar - Azul Celeste */}
      <aside className={`${collapsed ? 'w-24' : 'w-80'} transition-all duration-500 bg-[#0EA5E9] flex flex-col relative z-20 shadow-2xl shadow-sky-500/20`}>
        <div className="p-8 flex items-center gap-5 overflow-hidden border-b border-white/10">
          <div className="bg-white p-2.5 rounded-2xl shrink-0 shadow-lg ring-2 ring-[#FFFF00]">
             <img src={config.logo} alt="CRINF" className="h-8 w-8 object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-black text-2xl text-white leading-none tracking-tighter uppercase italic">CRINF</span>
              <span className="text-[10px] font-black text-[#FFFF00] uppercase tracking-[0.2em]">ADMIN</span>
            </div>
          )}
        </div>

        <nav className="flex-grow py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-4 rounded-[1.25rem] transition-all group ${
                  active 
                  ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl shadow-black/5 font-black' 
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={22} strokeWidth={active ? 3 : 2} />
                {!collapsed && <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-4 px-4 py-4 w-full rounded-[1.25rem] text-white/40 hover:bg-white/10 hover:text-white transition-all font-bold"
          >
            <ArrowLeft size={20} />
            {!collapsed && <span className="text-sm uppercase tracking-widest">Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white h-20 flex items-center justify-between px-10 border-b border-sky-100 shadow-sm">
          <div className="flex items-center gap-6">
             <button onClick={() => setCollapsed(!collapsed)} className="p-3 bg-sky-50 text-[#0EA5E9] rounded-2xl hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all">
               <Menu size={22} />
             </button>
             <h2 className="text-xl font-black text-[#0369A1] uppercase tracking-tighter">
               {menuItems.find(i => i.path === location.pathname)?.label || 'Painel'}
             </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-3 text-sky-200 hover:text-[#0EA5E9] transition-all">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#FFFF00] rounded-full border-2 border-white" />
            </button>
            <div className="w-12 h-12 bg-[#0EA5E9] rounded-[1.25rem] flex items-center justify-center text-[#FFFF00] font-black shadow-lg border-2 border-white italic">
                CR
            </div>
          </div>
        </header>

        <section className="flex-grow p-10 overflow-y-auto bg-sky-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
