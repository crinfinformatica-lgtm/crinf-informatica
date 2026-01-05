
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages Públicas
import LayoutPage from './components/Layout';
import Home from './pages/Home';
import Store from './pages/Store';
import ServicesPage from './pages/Services';
import PickupService from './pages/PickupService';
import Login from './pages/Login';
import ReturnsPage from './pages/Returns';
import SocialProjectPage from './pages/SocialProject';
import DownloadsPage from './pages/Downloads';
import ContactPage from './pages/Contact';
import ClientsPage from './pages/Clients';
import About from './pages/About';

// Painel Administrativo
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import ContentEditor from './admin/ContentEditor';
import TwoFactorAuth from './admin/TwoFactorAuth';
import ServiceManager from './admin/ServiceManager';
import DownloadsManager from './admin/DownloadsManager';
import BusinessClientsManager from './admin/BusinessClientsManager';
import CommonClientsManager from './admin/CommonClientsManager';
import CashFlow from './admin/CashFlow';
import CRM from './admin/CRM';
import SuppliersManager from './admin/SuppliersManager';
import OSManager from './admin/OSManager';
import NeighborhoodManager from './admin/NeighborhoodManager';
import AboutManager from './admin/AboutManager';
import ContactManager from './admin/ContactManager';
import SocialProjectManager from './admin/SocialProjectManager';
import ReturnsManager from './admin/ReturnsManager';
import PickupManager from './admin/PickupManager';
import HomeManager from './admin/HomeManager';
import RecoveryManager from './admin/RecoveryManager';
import PDV from './admin/PDV';
import TechnicalServiceCatalog from './admin/TechnicalServiceCatalog';

const AdminRoute = ({ children }: React.PropsWithChildren<{}>) => {
  const { isAdmin, is2faVerified, isAuthenticated } = useAuth();
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" />;
  if (!is2faVerified) return <TwoFactorAuth />;
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LayoutPage />}>
              <Route index element={<Home />} />
              <Route path="loja" element={<Store />} />
              <Route path="servicos" element={<ServicesPage />} />
              <Route path="leva-e-traz" element={<PickupService />} />
              <Route path="politica-de-trocas" element={<ReturnsPage />} />
              <Route path="downloads" element={<DownloadsPage />} />
              <Route path="projeto-social" element={<SocialProjectPage />} />
              <Route path="contato" element={<ContactPage />} />
              <Route path="clientes" element={<ClientsPage />} />
              <Route path="sobre" element={<About />} />
            </Route>
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="pdv" element={<PDV />} />
              <Route path="catalogo-tecnico" element={<TechnicalServiceCatalog />} />
              <Route path="os" element={<OSManager />} />
              <Route path="bairros" element={<NeighborhoodManager />} />
              <Route path="financeiro" element={<CashFlow />} />
              <Route path="crm" element={<CRM />} />
              <Route path="produtos" element={<Products />} />
              <Route path="fornecedores" element={<SuppliersManager />} />
              <Route path="conteudo" element={<ContentEditor />} />
              <Route path="design" element={<HomeManager />} />
              <Route path="servicos-digitais" element={<ServiceManager />} />
              <Route path="leva-e-traz" element={<PickupManager />} />
              <Route path="trocas" element={<ReturnsManager />} />
              <Route path="sobre" element={<AboutManager />} />
              <Route path="contato" element={<ContactManager />} />
              <Route path="social" element={<SocialProjectManager />} />
              <Route path="vendas" element={<div className="p-10 text-2xl font-black uppercase italic text-[#0369A1]">Gestão de Vendas em Tempo Real</div>} />
              <Route path="clientes-empresas" element={<BusinessClientsManager />} />
              <Route path="clientes-comuns" element={<CommonClientsManager />} />
              <Route path="downloads" element={<DownloadsManager />} />
              <Route path="backup" element={<RecoveryManager />} />
              <Route path="config" element={<div className="p-10 text-2xl font-black uppercase italic text-[#0369A1]">Cores & Logo do App</div>} />
            </Route>
          </Routes>
        </HashRouter>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
