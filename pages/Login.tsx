
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck, UserPlus, Home, User, Zap } from 'lucide-react';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminQuickAccess = async () => {
    setLoading(true);
    try {
      await login('admin@crinf.com', 'admin123');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    await loginWithGoogle();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decoração Celeste */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFFF00]/10 rounded-full blur-3xl" />

      {/* Botão Voltar Início */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-[#0369A1] font-black uppercase text-[10px] tracking-widest hover:bg-[#FFFF00] transition-all bg-white px-6 py-3 rounded-2xl shadow-md border border-sky-100"
      >
        <Home size={16} /> Voltar para Início
      </Link>

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex p-5 bg-[#0EA5E9] rounded-[2rem] shadow-2xl ring-4 ring-[#FFFF00] animate-bounce-subtle">
            <ShieldCheck size={40} className="text-[#FFFF00]" />
          </div>
          <h1 className="text-4xl font-black text-[#0369A1] tracking-tighter uppercase italic">
            {isRegister ? 'Crie sua Conta' : 'Acesse sua Conta'}
          </h1>
          <p className="text-sky-400 font-medium uppercase text-[10px] tracking-[0.2em]">
            {isRegister ? 'Rápido, fácil e celeste' : 'Bem-vindo à CRINF Informática'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-sky-500/10 border border-sky-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-200 group-focus-within:text-[#0EA5E9] transition-colors" size={20} />
                <input 
                  required type="text" placeholder="Nome Completo"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-sky-50 border-none focus:ring-2 focus:ring-[#0EA5E9]/30 outline-none font-bold placeholder:text-sky-200 text-[#0369A1]"
                  value={name} onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-200 group-focus-within:text-[#0EA5E9] transition-colors" size={20} />
              <input 
                required type="email" placeholder="E-mail"
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-sky-50 border-none focus:ring-2 focus:ring-[#0EA5E9]/30 outline-none font-bold placeholder:text-sky-200 text-[#0369A1]"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-200 group-focus-within:text-[#0EA5E9] transition-colors" size={20} />
              <input 
                required type="password" placeholder="Senha"
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-sky-50 border-none focus:ring-2 focus:ring-[#0EA5E9]/30 outline-none font-bold placeholder:text-sky-200 text-[#0369A1]"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#0EA5E9] text-white py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-sky-500/20 hover:bg-[#FFFF00] hover:text-[#0369A1] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {loading ? 'Processando...' : isRegister ? 'Cadastrar Agora' : 'Acessar Conta'} 
              {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
            </button>
          </form>

          {!isRegister && (
            <div className="mt-6">
               <button 
                onClick={handleAdminQuickAccess}
                className="w-full bg-sky-50 text-[#0EA5E9] border border-sky-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all"
              >
                <Zap size={14} /> Acesso Rápido Admin (Demo)
              </button>
              <p className="text-[9px] text-center text-sky-300 mt-2 font-bold uppercase">Usa e-mail com "admin" e código 2FA 123456</p>
            </div>
          )}

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-sky-100"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase font-black text-sky-200 tracking-[0.3em] bg-white px-4">Conexão Celeste</div>
          </div>

          <button 
            onClick={handleGoogle}
            className="w-full bg-white border-2 border-sky-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-sky-50 transition-all text-[#0369A1] text-sm"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Entrar com Google
          </button>
        </div>

        <p className="text-center text-sky-300 font-bold text-xs uppercase tracking-widest">
          {isRegister ? 'Já possui conta?' : 'Novo por aqui?'} {' '}
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-[#0EA5E9] hover:text-[#0369A1] font-black underline ml-1"
          >
            {isRegister ? 'Faça Login' : 'Crie sua conta'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
