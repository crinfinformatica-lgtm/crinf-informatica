
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Product, Service, Client, Booking, AppConfig, NeighborhoodRate, 
  DownloadProgram, Sale, ExchangeRequest, Supplier, Transaction, 
  ServiceOrder, OSStatus, CashSession, TechnicalService
} from '../types';
import { INITIAL_NEIGHBORHOODS, THEME } from '../constants';

interface AppContextType {
  products: Product[];
  services: Service[];
  technicalServices: TechnicalService[];
  clients: Client[];
  suppliers: Supplier[];
  sales: Sale[];
  serviceOrders: ServiceOrder[];
  neighborhoods: NeighborhoodRate[];
  downloads: DownloadProgram[];
  bookings: Booking[];
  exchanges: ExchangeRequest[];
  transactions: Transaction[];
  cashSessions: CashSession[];
  config: AppConfig;
  cart: { productId: string; quantity: number }[];
  loading: boolean;
  categories: string[];
  setCategories: (cats: string[]) => void;
  
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addClient: (c: Client) => Promise<void>;
  updateClient: (c: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addSupplier: (s: Supplier) => Promise<void>;
  updateSupplier: (s: Supplier) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  addNeighborhood: (n: NeighborhoodRate) => Promise<void>;
  updateNeighborhood: (n: NeighborhoodRate) => Promise<void>;
  deleteNeighborhood: (id: string) => Promise<void>;
  addDownload: (d: DownloadProgram) => Promise<void>;
  updateDownload: (d: DownloadProgram) => Promise<void>;
  deleteDownload: (id: string) => Promise<void>;
  addService: (s: Service) => Promise<void>;
  updateService: (s: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addTechnicalService: (s: TechnicalService) => Promise<void>;
  updateTechnicalService: (s: TechnicalService) => Promise<void>;
  deleteTechnicalService: (id: string) => Promise<void>;
  addBooking: (b: Booking) => Promise<void>;
  addExchange: (e: ExchangeRequest) => Promise<void>;
  addTransaction: (t: Transaction) => Promise<void>;
  addSale: (s: Sale) => Promise<void>;
  addDigitalServiceSale: (desc: string, amount: number, cName: string, cPhone: string) => Promise<void>;
  cancelSale: (id: string) => Promise<void>;
  openCashSession: (initial: number, operator: string) => Promise<void>;
  closeCashSession: (id: string) => Promise<void>;
  cancelCashSession: (id: string) => Promise<void>;
  addServiceOrder: (os: ServiceOrder) => Promise<void>;
  updateServiceOrder: (os: ServiceOrder) => Promise<void>;
  finalizeServiceOrder: (id: string, method: string) => Promise<void>;
  importFullSnapshot: (data: any) => Promise<void>;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.PropsWithChildren }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [technicalServices, setTechnicalServices] = useState<TechnicalService[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodRate[]>(INITIAL_NEIGHBORHOODS);
  const [downloads, setDownloads] = useState<DownloadProgram[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cashSessions, setCashSessions] = useState<CashSession[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [categories, setCategories] = useState<string[]>(['Hardware', 'Periféricos', 'Impressão']);
  const [cart, setCart] = useState<{ productId: string; quantity: number }[]>([]);
  
  const [config, setConfig] = useState<AppConfig>({
    primaryColor: THEME.skyBlue,
    secondaryColor: THEME.citrusYellow,
    headerBgColor: '#FFFFFF',
    headerTextColor: '#0369A1',
    footerBgColor: '#0369A1',
    footerTextColor: '#FFFFFF',
    logo: 'https://i.imgur.com/kS5sM6C.png',
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1920',
    heroText: 'CRINF INFORMÁTICA',
    heroSubtext: 'Referência em Campo Largo',
    whatsapp: '5541991426745',
    email: 'crinf.informatica@gmail.com',
    address: 'Campo Largo - PR',
    headerText: 'CRINF',
    footerText: 'CRINF INFORMÁTICA',
    footerLinks: [], socialLinks: [], homeCampaigns: [],
    shortcut1Title: 'HARDWARE', shortcut1Desc: 'PC & Notebook',
    shortcut2Title: 'SERVIÇOS', shortcut2Desc: 'Xerox & Impressão',
    shortcut3Title: 'COLETA', shortcut3Desc: 'Leva e Traz',
    shortcut4Title: 'SOCIAL', shortcut4Desc: 'Gotinhas de Amor',
    aboutContent: { heroTitle: 'Nossa História', heroSubtitle: '', historyTitle: '', text: '', secondaryText: '', image: '', mission: '', vision: '', values: '', testimonials: [] },
    contactPage: { title: 'Fale Conosco', subtitle: '', image: '', units: [], primaryColor: '#0369A1' },
    clientsPage: { title: 'Clientes', subtitle: '', primaryColor: '#0369A1', secondaryColor: '#FFFF00' },
    returnsPage: { title: 'Trocas', subtitle: '', heroImage: '', formFields: [], primaryColor: '#0369A1' },
    pickupPage: { title: 'Leva e Traz', subtitle: '', description: '', heroImage: '', formFields: [], gallery: [] },
    socialProject: { name: 'Gotinhas de Amor', logo: '', pixKey: '', pixQrCode: '', description: '', primaryColor: '#0EA5E9', images: [], socialLinks: [] },
    downloadsPage: { title: 'Downloads', subtitle: '', description: '' },
    servicesPage: { title: 'Serviços', subtitle: '', description: '', heroImage: '' },
    osPage: { title: 'Manutenção', activeTitle: 'Ordens Ativas', readyTitle: 'Prontas', totalTitle: 'Faturado', primaryColor: '#1E1B4B', secondaryColor: '#FFFF00', accentColor: '#0EA5E9', backgroundColor: '#F0F9FF', textColor: '#0369A1', cardBg: '#FFFFFF' }
  });

  const fetchData = async () => {
    try {
      const { data: p } = await supabase.from('products').select('*');
      if (p) setProducts(p);

      const { data: c } = await supabase.from('clients').select('*');
      if (c) setClients(c);

      const { data: s } = await supabase.from('suppliers').select('*');
      if (s) setSuppliers(s);

      const { data: n } = await supabase.from('neighborhoods').select('*');
      if (n && n.length > 0) setNeighborhoods(n);

      const { data: d } = await supabase.from('downloads').select('*');
      if (d) setDownloads(d);

      const { data: b } = await supabase.from('bookings').select('*');
      if (b) setBookings(b);

      const { data: e } = await supabase.from('exchanges').select('*');
      if (e) setExchanges(e);

      const { data: sa } = await supabase.from('sales').select('*');
      if (sa) setSales(sa);

      const { data: tx } = await supabase.from('transactions').select('*');
      if (tx) setTransactions(tx);

      const { data: cs } = await supabase.from('cash_sessions').select('*');
      if (cs) setCashSessions(cs);

      const { data: os } = await supabase.from('service_orders').select('*');
      if (os) setServiceOrders(os);

      const { data: ts } = await supabase.from('technical_services').select('*');
      if (ts) setTechnicalServices(ts);

      const { data: srv } = await supabase.from('services').select('*');
      if (srv) setServices(srv);

    } catch (e) { console.error("Erro Supabase:", e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateConfig = async (next: Partial<AppConfig>) => {
    const updated = { ...config, ...next };
    setConfig(updated);
    // Persistência das configurações em uma tabela 'settings' pode ser feita aqui
  };

  // Funções CRUD com Supabase
  const addProduct = async (p: Product) => { await supabase.from('products').insert([p]); fetchData(); };
  const updateProduct = async (p: Product) => { await supabase.from('products').update(p).eq('id', p.id); fetchData(); };
  const deleteProduct = async (id: string) => { await supabase.from('products').delete().eq('id', id); fetchData(); };

  const addClient = async (c: Client) => { await supabase.from('clients').insert([c]); fetchData(); };
  const updateClient = async (c: Client) => { await supabase.from('clients').update(c).eq('id', c.id); fetchData(); };
  const deleteClient = async (id: string) => { await supabase.from('clients').delete().eq('id', id); fetchData(); };

  const addSupplier = async (s: Supplier) => { await supabase.from('suppliers').insert([s]); fetchData(); };
  const updateSupplier = async (s: Supplier) => { await supabase.from('suppliers').update(s).eq('id', s.id); fetchData(); };
  const deleteSupplier = async (id: string) => { await supabase.from('suppliers').delete().eq('id', id); fetchData(); };

  const addNeighborhood = async (n: NeighborhoodRate) => { await supabase.from('neighborhoods').insert([n]); fetchData(); };
  const updateNeighborhood = async (n: NeighborhoodRate) => { await supabase.from('neighborhoods').update(n).eq('id', n.id); fetchData(); };
  const deleteNeighborhood = async (id: string) => { await supabase.from('neighborhoods').delete().eq('id', id); fetchData(); };

  const addDownload = async (d: DownloadProgram) => { await supabase.from('downloads').insert([d]); fetchData(); };
  const updateDownload = async (d: DownloadProgram) => { await supabase.from('downloads').update(d).eq('id', d.id); fetchData(); };
  const deleteDownload = async (id: string) => { await supabase.from('downloads').delete().eq('id', id); fetchData(); };

  const addService = async (s: Service) => { await supabase.from('services').insert([s]); fetchData(); };
  const updateService = async (s: Service) => { await supabase.from('services').update(s).eq('id', s.id); fetchData(); };
  const deleteService = async (id: string) => { await supabase.from('services').delete().eq('id', id); fetchData(); };

  const addTechnicalService = async (s: TechnicalService) => { await supabase.from('technical_services').insert([s]); fetchData(); };
  const updateTechnicalService = async (s: TechnicalService) => { await supabase.from('technical_services').update(s).eq('id', s.id); fetchData(); };
  const deleteTechnicalService = async (id: string) => { await supabase.from('technical_services').delete().eq('id', id); fetchData(); };

  const addBooking = async (b: Booking) => { await supabase.from('bookings').insert([b]); fetchData(); };
  const addExchange = async (e: ExchangeRequest) => { await supabase.from('exchanges').insert([e]); fetchData(); };
  const addTransaction = async (t: Transaction) => { await supabase.from('transactions').insert([t]); fetchData(); };
  const addSale = async (s: Sale) => { 
    await supabase.from('sales').insert([s]); 
    await addTransaction({ id: `tx-${Date.now()}`, type: 'Income', category: 'Sale', description: `VENDA: ${s.clientName}`, amount: s.total, date: s.date });
    fetchData(); 
  };
  
  const addDigitalServiceSale = async (desc: string, amount: number, cName: string, cPhone: string) => {
    await addTransaction({ id: `tx-ds-${Date.now()}`, type: 'Income', category: 'DigitalService', description: `SERVIÇO DIGITAL: ${desc} (${cName})`, amount: amount, date: new Date().toISOString() });
    fetchData();
  };

  const cancelSale = async (id: string) => { await supabase.from('sales').update({ status: 'Cancelled' }).eq('id', id); fetchData(); };

  const openCashSession = async (initial: number, operator: string) => {
    const newSession: CashSession = { id: `sess-${Date.now()}`, openedAt: new Date().toISOString(), operatorName: operator, initialValue: initial, status: 'Open', totalSales: 0, totalReinforcements: 0, totalBleedings: 0, totalReversals: 0, finalBalance: initial };
    await supabase.from('cash_sessions').insert([newSession]);
    fetchData();
  };

  const closeCashSession = async (id: string) => {
    await supabase.from('cash_sessions').update({ status: 'Closed', closedAt: new Date().toISOString() }).eq('id', id);
    fetchData();
  };

  const cancelCashSession = async (id: string) => {
    await supabase.from('cash_sessions').update({ status: 'Cancelled' }).eq('id', id);
    fetchData();
  };

  const addServiceOrder = async (os: ServiceOrder) => { await supabase.from('service_orders').insert([os]); fetchData(); };
  const updateServiceOrder = async (os: ServiceOrder) => { await supabase.from('service_orders').update(os).eq('id', os.id); fetchData(); };
  const finalizeServiceOrder = async (id: string, method: string) => {
    await supabase.from('service_orders').update({ status: 'Delivered', isPaid: true, paymentMethod: method, finishDate: new Date().toISOString() }).eq('id', id);
    fetchData();
  };

  const importFullSnapshot = async (data: any) => {
    alert("Iniciando restauração de snapshot...");
    // Lógica para percorrer tabelas e dar insert
    fetchData();
  };

  const addToCart = (pid: string, qty: number) => {
    setCart(prev => {
      const ex = prev.find(i => i.productId === pid);
      if (ex) return prev.map(i => i.productId === pid ? { ...i, quantity: i.quantity + qty } : i).filter(i => i.quantity > 0);
      return [...prev, { productId: pid, quantity: qty }];
    });
  };

  const removeFromCart = (pid: string) => setCart(prev => prev.filter(item => item.productId !== pid));

  return (
    <AppContext.Provider value={{ 
      products, services, technicalServices, clients, suppliers, sales, config, cart, loading, serviceOrders, 
      neighborhoods, downloads, bookings, exchanges, transactions, cashSessions, categories, setCategories,
      updateConfig, addProduct, updateProduct, deleteProduct, 
      addClient, updateClient, deleteClient, addSupplier, updateSupplier, deleteSupplier,
      addNeighborhood, updateNeighborhood, deleteNeighborhood, addDownload, updateDownload, deleteDownload,
      addService, updateService, deleteService, addTechnicalService, updateTechnicalService, deleteTechnicalService,
      addBooking, addExchange, addTransaction, addSale, addDigitalServiceSale, cancelSale,
      openCashSession, closeCashSession, cancelCashSession, addServiceOrder, updateServiceOrder, finalizeServiceOrder,
      importFullSnapshot, addToCart, removeFromCart
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
