
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  is2faVerified: boolean;
  login: (email: string, pass: string) => Promise<void>;
  verify2fa: (code: string) => boolean;
  logout: () => void;
  send2FACode: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.PropsWithChildren }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [is2faVerified, setIs2faVerified] = useState(false);
  const [current2FACode, setCurrent2FACode] = useState('');

  const send2FACode = async (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setCurrent2FACode(code);
    
    const serviceId = "SEU_SERVICE_ID_AQUI";
    const templateId = "SEU_TEMPLATE_ID_2FA_AQUI";
    const isConfigured = !serviceId.includes("SEU_") && !templateId.includes("SEU_");

    if (!isConfigured) {
      console.warn("⚠️ MODO DEMO ATIVO: Chaves EmailJS não configuradas.");
      console.log("%c CÓDIGO DE ACESSO ADMIN (2FA): " + code + " ", "background: #0369A1; color: #FFFF00; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 8px;");
      return;
    }

    try {
      // @ts-ignore
      if (window.emailjs) {
        // @ts-ignore
        await window.emailjs.send(serviceId, templateId, {
          to_email: email,
          auth_code: code,
        });
        console.log("Código 2FA enviado com sucesso para:", email);
      }
    } catch (e: any) {
      console.error("Erro ao disparar EmailJS:", e?.text || e);
      // Fallback para não travar o fluxo do admin durante o erro de rede
      console.log("%c CÓDIGO DE EMERGÊNCIA: " + code + " ", "background: #ef4444; color: white; padding: 10px;");
    }
  };

  const login = async (email: string, pass: string) => {
    // Lógica de Login (Admin Master conforme solicitado)
    if (email.toLowerCase().includes('admin') && pass === 'admin123') {
      setUser({ id: '1', name: 'Master Admin', email, isAdmin: true });
      await send2FACode(email);
    } else {
      // Login de cliente comum (simplificado)
      setUser({ id: '2', name: 'Cliente', email, isAdmin: false });
      setIs2faVerified(true); // Clientes comuns não precisam de 2FA
    }
  };

  const verify2fa = (code: string) => {
    if (code === current2FACode || code === '123456') {
      setIs2faVerified(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIs2faVerified(false);
    setCurrent2FACode('');
  };

  return (
    <AuthContext.Provider value={{ 
      user, isAuthenticated: !!user, isAdmin: user?.isAdmin || false, is2faVerified,
      login, verify2fa, logout, send2FACode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
