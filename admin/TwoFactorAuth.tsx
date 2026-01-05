
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowRight, RefreshCw, Info } from 'lucide-react';

const TwoFactorAuth: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const { verify2fa } = useAuth();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verify2fa(code)) {
      setError(true);
      setCode('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0EA5E9] flex items-center justify-center p-6">
      <div className="bg-white rounded-[3rem] p-12 max-w-md w-full shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500 border border-sky-100">
        <div className="w-20 h-20 bg-[#FFFF00] text-[#0369A1] rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-[#FFFF00]/20 ring-4 ring-sky-50">
          <ShieldAlert size={40} strokeWidth={2.5} />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-[#0369A1] tracking-tighter uppercase italic">Segurança Ativa</h2>
          <p className="text-sky-400 text-sm font-medium leading-relaxed">
            Insira o código de 6 dígitos para acessar o painel administrativo CRINF.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <input 
            type="text" maxLength={6} placeholder="000000"
            className={`w-full text-center text-4xl font-black tracking-[0.5em] py-6 rounded-3xl bg-sky-50 border-none outline-none focus:ring-4 ${error ? 'focus:ring-red-500/20 text-red-500' : 'focus:ring-[#FFFF00]/50 text-[#0369A1]'}`}
            value={code} onChange={e => { setCode(e.target.value); setError(false); }}
          />
          
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex items-start gap-3 text-left">
            <Info size={16} className="text-[#0EA5E9] shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-[#0369A1] uppercase leading-relaxed">
              Dica: O código de acesso padrão para este sistema é <span className="bg-[#FFFF00] px-1 rounded">123456</span>
            </p>
          </div>

          {error && <p className="text-xs font-black text-red-500 uppercase tracking-widest">Código inválido.</p>}

          <button 
            type="submit"
            className="w-full bg-[#0EA5E9] text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-sky-500/20 hover:bg-[#0369A1] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Verificar Identidade <ArrowRight size={18} />
          </button>
        </form>

        <button className="text-sky-300 font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 justify-center mx-auto hover:text-[#0369A1] transition-colors">
          <RefreshCw size={14} /> Reenviar Código
        </button>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
