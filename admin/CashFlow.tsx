
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, Plus, Minus, CreditCard, DollarSign, 
  X, Save, Download, Calendar, ArrowRight,
  TrendingUp, TrendingDown, Wallet, Store,
  FileText, History, Trash2, Printer, Edit2,
  MoreVertical, CheckCircle2, AlertTriangle, Filter
} from 'lucide-react';
import { Transaction, CashSession } from '../types';

const CashFlow: React.FC = () => {
  const { transactions, addTransaction, cashSessions, openCashSession, closeCashSession, cancelCashSession } = useApp();
  
  const [activeTab, setActiveTab] = useState<'RECENTES' | 'CANCELADAS'>('RECENTES');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('- MÊS -');
  const [selectedYear, setSelectedYear] = useState<string>('- ANO -');
  
  const [showMoveModal, setShowMoveModal] = useState<{ type: 'REFORÇO' | 'SANGRIA' | 'ABERTURA' } | null>(null);
  const [moveAmount, setMoveAmount] = useState<number>(0);
  const [moveDesc, setMoveDesc] = useState('');

  const activeSession = useMemo(() => cashSessions.find(s => s.status === 'Open'), [cashSessions]);

  const sessionsToDisplay = useMemo(() => {
    return cashSessions.filter(s => {
      const matchTab = activeTab === 'RECENTES' ? s.status !== 'Cancelled' : s.status === 'Cancelled';
      const matchSearch = s.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.includes(searchTerm);
      return matchTab && matchSearch;
    }).sort((a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime());
  }, [cashSessions, activeTab, searchTerm]);

  const handleCashMovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession && showMoveModal?.type !== 'ABERTURA') {
      alert("É necessário abrir um caixa primeiro!");
      return;
    }

    if (showMoveModal?.type === 'ABERTURA') {
      openCashSession(moveAmount, 'CRISTIANO'); // Operador default conforme foto
    } else {
      addTransaction({
        id: `move-${Date.now()}`,
        type: showMoveModal?.type === 'REFORÇO' ? 'Income' : 'Expense',
        category: showMoveModal?.type === 'REFORÇO' ? 'Reinforcement' : 'Bleeding',
        description: moveDesc || showMoveModal?.type || '',
        amount: moveAmount,
        date: new Date().toISOString(),
        sessionId: activeSession?.id
      });
    }

    setShowMoveModal(null);
    setMoveAmount(0);
    setMoveDesc('');
  };

  const getSessionStats = (sessionId: string) => {
    const sessionTx = transactions.filter(t => t.sessionId === sessionId);
    const sales = sessionTx.filter(t => t.category === 'Sale' || t.category === 'Service' || t.category === 'DigitalService').reduce((a, b) => a + b.amount, 0);
    const reinforcements = sessionTx.filter(t => t.category === 'Reinforcement').reduce((a, b) => a + b.amount, 0);
    const bleedings = sessionTx.filter(t => t.category === 'Bleeding').reduce((a, b) => a + b.amount, 0);
    const salesCount = sessionTx.filter(t => t.category === 'Sale' || t.category === 'Service' || t.category === 'DigitalService').length;
    
    return { sales, reinforcements, bleedings, salesCount };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 font-sans text-slate-600">
      
      {/* Barra de Ações Superior (Idêntica à foto) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64 group">
            <input 
              type="text" 
              placeholder="BUSCA" 
              className="w-full pl-4 pr-10 py-2.5 bg-slate-100 border-none rounded-lg text-sm font-bold uppercase placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
          
          <button className="bg-slate-100 text-teal-600 px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs uppercase hover:bg-teal-50 transition-colors">
            <CreditCard size={16} /> PAGAMENTOS
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {activeSession ? (
            <button 
              onClick={() => closeCashSession(activeSession.id)}
              className="bg-orange-50 text-orange-600 border border-orange-100 px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs uppercase hover:bg-orange-100 transition-colors shrink-0"
            >
              <Store size={16} /> FECHAR CAIXA
            </button>
          ) : (
            <button 
              onClick={() => setShowMoveModal({ type: 'ABERTURA' })}
              className="bg-green-50 text-green-600 border border-green-100 px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs uppercase hover:bg-green-100 transition-colors shrink-0"
            >
              <Plus size={16} /> ABRIR CAIXA
            </button>
          )}
          
          <button 
            onClick={() => setShowMoveModal({ type: 'REFORÇO' })}
            className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs uppercase hover:bg-slate-200 transition-colors shrink-0"
          >
            <Plus size={16} /> REFORÇO
          </button>
          
          <button 
            onClick={() => setShowMoveModal({ type: 'SANGRIA' })}
            className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs uppercase hover:bg-slate-200 transition-colors shrink-0"
          >
            <Minus size={16} /> SANGRIA
          </button>

          <button className="bg-green-50 text-green-600 px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs uppercase hover:bg-green-100 transition-colors ml-auto md:ml-4 shrink-0">
             <FileText size={16} /> EXPORTAR
          </button>
        </div>
      </div>

      {/* Tabs e Filtros (Idênticos à foto) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('RECENTES')}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'RECENTES' ? 'bg-white text-sky-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            RECENTES
          </button>
          <button 
            onClick={() => setActiveTab('CANCELADAS')}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'CANCELADAS' ? 'bg-white text-sky-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            CANCELADAS
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
           <select 
             className="bg-slate-100 border-none rounded-lg text-[10px] font-black uppercase text-slate-500 py-2 px-4 outline-none focus:ring-1 focus:ring-sky-500/20"
             value={selectedYear}
             onChange={e => setSelectedYear(e.target.value)}
           >
             <option>- ANO -</option>
             <option>2023</option>
             <option>2024</option>
             <option>2025</option>
           </select>
           <select 
             className="bg-slate-100 border-none rounded-lg text-[10px] font-black uppercase text-slate-500 py-2 px-4 outline-none focus:ring-1 focus:ring-sky-500/20"
             value={selectedMonth}
             onChange={e => setSelectedMonth(e.target.value)}
           >
             <option>- MÊS -</option>
             {['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'].map(m => <option key={m}>{m}</option>)}
           </select>
        </div>
      </div>

      {/* Tabela de Fluxo de Caixa (Espelhada conforme foto) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100">
              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-5 text-center">ABERTURA<br/><span className="font-medium text-[8px] opacity-60">FECHAMENTO</span></th>
                <th className="px-6 py-5 text-center">VALOR<br/>INICIAL</th>
                <th className="px-6 py-5 text-center">VENDA(S)<br/><span className="font-medium text-[8px] opacity-60">REFORÇO(S)</span></th>
                <th className="px-6 py-5 text-center">ESTORNO(S)<br/><span className="font-medium text-[8px] opacity-60">SANGRIA(S)</span></th>
                <th className="px-6 py-5 text-center">EM CAIXA<br/><span className="font-medium text-[8px] opacity-60">RESULTADO</span></th>
                <th className="px-6 py-5 text-right">DETALHES<br/><span className="font-medium text-[8px] opacity-60">EDITAR</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-sky-500 text-xs">
              {sessionsToDisplay.map(session => {
                const stats = getSessionStats(session.id);
                const result = session.initialValue + stats.sales + stats.reinforcements - stats.bleedings;
                const d = new Date(session.openedAt);
                
                return (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-4">
                       <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-1.5">
                             <span className="bg-sky-50 text-sky-500 px-2 py-0.5 rounded border border-sky-100 text-[10px]">{d.getDate()}</span>
                             <span className="bg-sky-50 text-sky-500 px-2 py-0.5 rounded border border-sky-100 text-[10px] uppercase">
                                {['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][d.getMonth()]}
                             </span>
                             <span className="bg-sky-50 text-sky-500 px-2 py-0.5 rounded border border-sky-100 text-[10px]">{d.getFullYear()}</span>
                             <span className="bg-sky-50 text-sky-500 px-2 py-0.5 rounded border border-sky-100 text-[10px]">
                                {d.getHours().toString().padStart(2,'0')}:{d.getMinutes().toString().padStart(2,'0')}
                             </span>
                          </div>
                          <div className="w-full text-center">
                             <span className="text-[10px] text-sky-600 font-black uppercase tracking-widest">{session.operatorName}</span>
                          </div>
                          {session.status === 'Open' ? (
                            <span className="bg-sky-50 text-sky-500 px-3 py-0.5 rounded-full text-[8px] font-black border border-sky-100 animate-pulse">CAIXA ABERTO</span>
                          ) : (
                            <span className="text-slate-400 text-[8px] font-black uppercase">FECHADO EM {session.closedAt ? new Date(session.closedAt).toLocaleTimeString() : '---'}</span>
                          )}
                       </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                       <p>{session.initialValue > 0 ? session.initialValue.toFixed(2).replace('.', ',') : '.'}</p>
                    </td>

                    <td className="px-6 py-4">
                       <div className="flex flex-col items-center gap-1.5">
                          <div className="flex items-center gap-2">
                             <span className="bg-sky-50 text-sky-400 px-2 py-0.5 rounded text-[10px]">{stats.salesCount || '.'}</span>
                             <span className="text-sky-500">{stats.sales > 0 ? stats.sales.toFixed(2).replace('.', ',') : '.'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="bg-sky-50 text-sky-200 px-2 py-0.5 rounded text-[10px]">.</span>
                             <span className="text-sky-300">{stats.reinforcements > 0 ? stats.reinforcements.toFixed(2).replace('.', ',') : '.'}</span>
                          </div>
                       </div>
                    </td>

                    <td className="px-6 py-4">
                       <div className="flex flex-col items-center gap-1.5 opacity-60">
                          <div className="flex items-center gap-2">
                             <span className="bg-sky-50 text-sky-200 px-2 py-0.5 rounded text-[10px]">.</span>
                             <span className="text-sky-300">.</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="bg-sky-50 text-sky-200 px-2 py-0.5 rounded text-[10px]">.</span>
                             <span className="text-sky-300">{stats.bleedings > 0 ? stats.bleedings.toFixed(2).replace('.', ',') : '.'}</span>
                          </div>
                       </div>
                    </td>

                    <td className="px-6 py-4">
                       <div className="flex flex-col items-center gap-1.5">
                          <p className="text-sky-500">{result.toFixed(2).replace('.', ',')}</p>
                          <p className="text-sky-500/50">{result.toFixed(2).replace('.', ',')}</p>
                       </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2">
                          <button className="p-2 bg-green-50 text-green-500 rounded-lg hover:bg-green-100 transition-all shadow-sm">
                             <Store size={18} />
                          </button>
                          <button onClick={() => cancelCashSession(session.id)} className="p-2 bg-sky-50 text-sky-500 rounded-lg hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all shadow-sm">
                             <Edit2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}

              {sessionsToDisplay.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                     <div className="flex flex-col items-center gap-3 opacity-20">
                        <History size={48} />
                        <p className="font-black uppercase tracking-widest text-xs">Nenhum registro encontrado</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Abertura / Reforço / Sangria */}
      {showMoveModal && (
        <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${showMoveModal.type === 'SANGRIA' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                       <DollarSign size={24} />
                    </div>
                    <h3 className="font-black text-slate-800 uppercase tracking-tighter">MOVIMENTAR {showMoveModal.type}</h3>
                 </div>
                 <button onClick={() => setShowMoveModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={24}/>
                 </button>
              </div>

              <form onSubmit={handleCashMovement} className="p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Valor do Lançamento (R$)</label>
                    <input 
                      type="number" step="0.01" required autoFocus
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-3xl text-sky-500 focus:border-sky-500 focus:ring-0 outline-none transition-all"
                      value={moveAmount || ''}
                      onChange={e => setMoveAmount(Number(e.target.value))}
                      placeholder="0,00"
                    />
                 </div>

                 {showMoveModal.type !== 'ABERTURA' && (
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Motivo / Descrição</label>
                       <input 
                         className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 focus:border-sky-500 focus:ring-0 outline-none transition-all"
                         value={moveDesc}
                         onChange={e => setMoveDesc(e.target.value)}
                         placeholder="Ex: Pagamento Fornecedor"
                       />
                    </div>
                 )}

                 <button 
                  type="submit" 
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${showMoveModal.type === 'SANGRIA' ? 'bg-red-500 text-white' : 'bg-sky-500 text-white'}`}
                 >
                    {showMoveModal.type === 'ABERTURA' ? 'ABRIR CAIXA AGORA' : `CONFIRMAR ${showMoveModal.type}`}
                    <ArrowRight size={20}/>
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CashFlow;
