
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { 
  AlertCircle, TrendingUp, Users, MapPin, RefreshCw, 
  ShoppingCart, PackageX, Trophy, AlertTriangle, UserMinus,
  Printer, Wrench, DollarSign, ArrowUpRight, Star, HardDrive
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    products = [], 
    sales = [], 
    neighborhoods = [], 
    clients = [], 
    exchanges = [], 
    transactions = [], 
    serviceOrders = [] 
  } = useApp();

  const outOfStock = useMemo(() => products.filter(p => p.stock === 0), [products]);
  const bestSellers = useMemo(() => [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 6), [products]);
  const qualityAlerts = useMemo(() => 
    [...products]
      .filter(p => (p.exchangesCount || 0) > 0)
      .sort((a, b) => (b.exchangesCount || 0) - (a.exchangesCount || 0))
      .slice(0, 6), 
  [products]);

  const topBuyers = useMemo(() => {
    return clients.map(client => {
      const totalSpent = (client.history || [])
        .filter(h => h.type === 'Purchase')
        .reduce((acc, curr) => acc + (curr.value || 0), 0);
      return { ...client, totalSpent };
    }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  }, [clients]);

  const highReturnClients = useMemo(() => {
    return clients.map(client => {
      const returnCount = (client.history || []).filter(h => h.type === 'Exchange').length;
      return { ...client, returnCount };
    }).sort((a, b) => b.returnCount - a.returnCount).slice(0, 5);
  }, [clients]);

  const neighborhoodReport = useMemo(() => {
    const counts: Record<string, number> = {};
    sales.forEach(sale => {
      if (sale.neighborhoodId) {
        counts[sale.neighborhoodId] = (counts[sale.neighborhoodId] || 0) + 1;
      }
    });
    return neighborhoods.map(n => ({
      name: n.name,
      value: counts[n.id] || 0
    })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [sales, neighborhoods]);

  const digitalServicesReport = useMemo(() => {
    const digitalTx = transactions.filter(t => t.category === 'DigitalService');
    const summary: Record<string, { count: number, revenue: number }> = {};
    
    digitalTx.forEach(t => {
      const desc = (t.description || '').replace('SERVIÇO DIGITAL: ', '');
      summary[desc] = {
        count: (summary[desc]?.count || 0) + 1,
        revenue: (summary[desc]?.revenue || 0) + (t.amount || 0)
      };
    });

    return Object.entries(summary)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [transactions]);

  const technicalServicesReport = useMemo(() => {
    const summary: Record<string, { count: number, revenue: number }> = {};
    
    serviceOrders.filter(os => os.status === 'Delivered' || os.isPaid).forEach(os => {
      (os.servicesPerformed || []).forEach(srv => {
        summary[srv.description] = {
          count: (summary[srv.description]?.count || 0) + 1,
          revenue: (summary[srv.description]?.revenue || 0) + (srv.price || 0)
        };
      });
    });

    return Object.entries(summary)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [serviceOrders]);

  const totalRevenue = useMemo(() => 
    transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + (curr.amount || 0), 0),
  [transactions]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Cards de indicadores principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0EA5E9] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
           <TrendingUp className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32" />
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Faturamento Global</p>
           <h4 className="text-4xl font-black tracking-tighter mt-1 italic">R$ {totalRevenue.toLocaleString('pt-BR')}</h4>
        </div>
        <div className="bg-[#FFFF00] p-8 rounded-[2.5rem] text-[#0369A1] shadow-xl relative overflow-hidden border border-white">
           <RefreshCw className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32" />
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total em Garantia</p>
           <h4 className="text-4xl font-black tracking-tighter mt-1 italic">{exchanges.length}</h4>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] text-[#0369A1] shadow-xl border border-sky-100">
           <PackageX className="absolute -right-4 -bottom-4 opacity-5 w-32 h-32 text-red-500" />
           <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">Ruptura (Sem Estoque)</p>
           <h4 className="text-4xl font-black tracking-tighter mt-1 text-red-500 italic">{outOfStock.length}</h4>
        </div>
        <div className="bg-sky-50 p-8 rounded-[2.5rem] text-[#0369A1] shadow-xl border border-sky-100">
           <Users className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32" />
           <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">Clientes na Base</p>
           <h4 className="text-4xl font-black tracking-tighter mt-1 italic">{clients.length}</h4>
        </div>
      </div>

      {/* Relatórios Visuais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-sky-500/5 border border-sky-50">
           <h3 className="text-xl font-black text-[#0369A1] uppercase tracking-tighter italic flex items-center gap-3 mb-10">
              <MapPin className="text-[#0EA5E9]" /> Bairros Recordistas (Vendas)
           </h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={neighborhoodReport}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F9FF" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#0369A1', fontSize: 10, fontWeight: 900}} />
                  <Tooltip cursor={{fill: '#F0F9FF'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                    {neighborhoodReport.map((_, index) => (
                      <Cell key={`cell-${index}`} fill="#0EA5E9" opacity={1 - (index * 0.15)} />
                    ))}
                  </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-[#0369A1] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-10"><DollarSign size={200}/></div>
           <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-3 mb-10 text-[#FFFF00]">
             <Trophy size={24} /> Melhores Clientes (LTV)
           </h3>
           <div className="space-y-4">
              {topBuyers.map((c, i) => (
                <div key={c.id} className="flex items-center justify-between bg-white/10 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                   <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-[#FFFF00]">{i+1}º</span>
                      <p className="font-bold uppercase text-sm truncate max-w-[150px]">{c.name}</p>
                   </div>
                   <p className="font-black text-[#FFFF00] italic">R$ {c.totalSpent.toLocaleString('pt-BR')}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-10 rounded-[4rem] shadow-2xl border border-sky-50">
            <h3 className="text-xl font-black text-[#0369A1] uppercase italic tracking-tighter flex items-center gap-3 mb-8">
               <Wrench size={24} className="text-[#0EA5E9]" /> Serviços Técnicos (Mão de Obra)
            </h3>
            <div className="space-y-6">
               {technicalServicesReport.map((s, i) => (
                 <div key={i} className="flex items-center gap-6 p-4 bg-sky-50/50 rounded-[2rem] border border-white group hover:border-[#0EA5E9] transition-all">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0EA5E9] shadow-md font-black italic">{i+1}º</div>
                    <div className="flex-grow min-w-0">
                       <p className="text-xs font-black text-[#0369A1] uppercase truncate">{s.name}</p>
                       <p className="text-[9px] font-bold text-sky-400 uppercase">{s.count} manutenções finalizadas</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-green-500 italic tracking-tighter">R$ {s.revenue.toLocaleString('pt-BR')}</p>
                    </div>
                 </div>
               ))}
               {technicalServicesReport.length === 0 && <p className="text-center text-xs opacity-40 py-20 italic uppercase font-black">Nenhum serviço técnico processado</p>}
            </div>
         </div>

         <div className="bg-white p-10 rounded-[4rem] shadow-2xl border border-sky-50">
            <h3 className="text-xl font-black text-[#0369A1] uppercase italic tracking-tighter flex items-center gap-3 mb-8">
               <Printer size={24} className="text-[#0EA5E9]" /> Serviços Digitais & Papelaria
            </h3>
            <div className="space-y-6">
               {digitalServicesReport.map((s, i) => (
                 <div key={i} className="flex items-center gap-6 p-4 bg-sky-50/50 rounded-[2rem] border border-white group hover:border-[#0EA5E9] transition-all">
                    <div className="w-12 h-12 bg-[#FFFF00] rounded-2xl flex items-center justify-center text-[#0369A1] shadow-md font-black italic">{i+1}º</div>
                    <div className="flex-grow min-w-0">
                       <p className="text-xs font-black text-[#0369A1] uppercase truncate">{s.name}</p>
                       <p className="text-[9px] font-bold text-sky-400 uppercase">Processado em {s.count} pedidos</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-[#0EA5E9] italic tracking-tighter">R$ {s.revenue.toLocaleString('pt-BR')}</p>
                    </div>
                 </div>
               ))}
               {digitalServicesReport.length === 0 && <p className="text-center text-xs opacity-40 py-20 italic uppercase font-black">Nenhum serviço digital registrado</p>}
            </div>
         </div>
      </div>

      <div className="bg-red-50 p-10 rounded-[4rem] border-4 border-red-100 shadow-xl overflow-hidden relative">
         <h3 className="text-xl font-black text-red-900 uppercase italic tracking-tighter flex items-center gap-3 mb-8">
            <AlertCircle size={24} /> Clientes com alto índice de trocas
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {highReturnClients.filter(c => c.returnCount > 0).map(c => (
               <div key={c.id} className="bg-white p-6 rounded-[2.5rem] shadow-lg text-center space-y-4 border-2 border-red-50">
                  <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto font-black italic">{c.returnCount}</div>
                  <p className="text-[10px] font-black text-red-900 uppercase truncate">{c.name}</p>
               </div>
            ))}
            {highReturnClients.filter(c => c.returnCount > 0).length === 0 && (
              <div className="col-span-full py-10 text-center text-red-300 font-bold uppercase text-[10px] tracking-widest italic">
                Nenhuma solicitação de troca pendente ou recorrente identificada.
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
