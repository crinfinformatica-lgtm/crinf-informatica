
export enum ServiceCategory {
  PRINTING = 'Impressões',
  BINDING = 'Encadernação',
  TECHNICAL = 'Serviço Técnico',
  PICKUP = 'Leva e Traz',
  PHOTO = 'Impressão de Foto',
  RESUME = 'Currículos',
  LAMINATION = 'Plastificação',
  STATIONERY = 'Papelaria',
  XEROX = 'Xerox / Cópias'
}

export type OSStatus = 'Budget' | 'Waiting_Parts' | 'In_Progress' | 'Ready' | 'Delivered' | 'Cancelled';

export interface TechnicalService {
  id: string;
  name: string;
  category: 'Computador' | 'Notebook' | 'Impressora' | 'Monitor' | 'Celular' | 'Outros';
  price: number;
  description: string;
  isVisible: boolean;
  image: string;
}

export interface NeighborhoodRate {
  id: string;
  name: string;
  rate: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  purchasePrice: number;
  salePrice: number;
  wholesalePrice?: number;
  barcode: string;
  stock: number;
  minStock?: number;
  expirationDate?: string;
  image: string;
  category: string;
  qualityAlert: boolean;
  qualityNotes?: string;
  supplierId: string;
  exchangesCount: number;
  salesCount: number;
  condition: 'Novo' | 'Usado';
  warranty: string;
  unitType?: 'UN' | 'KG';
  measureUnit?: string;
  isKit?: boolean;
  isArchived?: boolean;
  isOnline?: boolean;
  isPhysical?: boolean;
}

export interface AppConfig {
  primaryColor: string;
  secondaryColor: string;
  adminPrimaryColor?: string;
  adminSecondaryColor?: string;
  adminLogo?: string;
  adminTitle?: string;
  adminSubtitle?: string;
  adminMenuOrder?: string[];
  headerBgColor: string;
  headerTextColor: string;
  footerBgColor: string;
  footerTextColor: string;
  logo: string;
  bannerImage: string;
  heroText: string;
  heroSubtext: string;
  footerText: string;
  headerText: string;
  whatsapp: string;
  socialLinks: { platform: string; url: string }[];
  footerLinks: FooterLink[];
  address: string;
  mapEmbedUrl?: string;
  email: string;
  homeCampaigns: {
    title: string;
    image: string;
    link: string;
  }[];
  shortcut1Title: string;
  shortcut1Desc: string;
  shortcut2Title: string;
  shortcut2Desc: string;
  shortcut3Title: string;
  shortcut3Desc: string;
  shortcut4Title: string;
  shortcut4Desc: string;
  aboutContent: { 
    heroTitle: string;
    heroSubtitle: string;
    historyTitle: string;
    text: string; 
    secondaryText: string;
    image: string;
    mission: string;
    vision: string;
    values: string;
    logo?: string;
    testimonials: Testimonial[];
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  contactPage: {
    title: string;
    subtitle: string;
    image: string;
    units: UnitInfo[];
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  clientsPage: {
    title: string;
    subtitle: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor?: string;
    textColor?: string;
    texts?: Record<string, string>;
  };
  returnsPage: {
    title: string;
    subtitle: string;
    description?: string;
    heroImage: string;
    formFields: FormField[];
    primaryColor: string;
    backgroundColor?: string;
    textColor?: string;
  };
  pickupPage: {
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    formFields: FormField[];
    gallery: ProjectImage[];
    prices?: { label: string; value: number }[];
  };
  socialProject: {
    name: string;
    logo: string;
    pixKey: string;
    pixQrCode: string;
    description: string;
    primaryColor: string;
    images: ProjectImage[];
    socialLinks: { platform: string; url: string }[];
  };
  downloadsPage: {
    title: string;
    subtitle: string;
    description: string;
  };
  servicesPage: {
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
    backgroundColor?: string;
    textColor?: string;
  };
  osPage: {
    title: string;
    activeTitle: string;
    readyTitle: string;
    totalTitle: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    cardBg: string;
  };
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date';
  required: boolean;
  options?: string[];
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
  category: 'Navegação' | 'Institucional';
}

export interface Supplier {
  id: string;
  code?: string;
  name: string;
  email: string;
  phone: string;
  doc: string; // CPF/CNPJ
  representative: string;
  category: string;
  // Endereço
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  // Métricas BI
  priceScore: number; // 1-5
  deliverySpeed: number; // 1-5
  exchangeQuality: number; // 1-5
  reliability: number; // Média ponderada
}

export interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  category: 'Sale' | 'Inventory' | 'Maintenance' | 'Other' | 'Service' | 'DigitalService' | 'Reinforcement' | 'Bleeding';
  description: string;
  amount: number;
  date: string;
  referenceId?: string;
  sessionId?: string;
}

export interface CashSession {
  id: string;
  openedAt: string;
  closedAt?: string;
  operatorName: string;
  initialValue: number;
  status: 'Open' | 'Closed' | 'Cancelled';
  totalSales: number;
  totalReinforcements: number;
  totalBleedings: number;
  totalReversals: number;
  finalBalance: number;
}

export interface PerformedService {
  serviceId: string;
  description: string;
  price: number;
}

export interface EquipmentChecklist {
  type: 'Notebook' | 'Desktop' | 'Monitor' | 'Other';
  screenState?: string;
  batteryState?: string;
  casingState?: string;
  chargerState?: string;
  keyboardState?: string;
  touchpadState?: string;
  portsState?: string;
  chargingPortState?: string;
  isGamer?: boolean;
  cabinetState?: string;
  structureState?: string;
  processor?: string;
  hdSize?: string;
  ramSize?: string;
  motherboardModel?: string;
  customFields?: { label: string; value: string }[];
}

export interface ServiceOrder {
  id: string;
  bookingId?: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  equipment: string;
  serialNumber?: string;
  accessories: string;
  problemDescription: string;
  technicalReport?: string;
  checklist: EquipmentChecklist;
  status: OSStatus;
  isPaid: boolean;
  paymentMethod?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  laborValue: number;
  partsValue: number;
  shippingValue: number;
  totalValue: number;
  partsUsed: { productId: string; quantity: number; price: number }[];
  servicesPerformed: PerformedService[];
  entryDate: string;
  predictedDate?: string;
  startDate?: string;
  finishDate?: string;
  technicianName: string;
  location: 'Shop' | 'OnSite';
}

export interface TieredPrice {
  minQty: number;
  price: number;
}

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory | string;
  basePrice: number;
  tieredPrices: TieredPrice[];
  description: string;
  image: string;
}

export interface Booking {
  id: string;
  type: 'Pickup' | 'OnSite';
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientDoc: string;
  pickupAddress: string;
  scheduledAt: string;
  equipmentType: string;
  equipmentPhoto?: string;
  observation: string;
  neighborhoodId: string;
  totalCost: number;
  status: 'Pending' | 'Approved' | 'Completed' | 'Cancelled';
  customFields?: Record<string, any>;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  type: 'Individual' | 'Business';
  logo?: string;
  description?: string;
  socialLinks?: { platform: 'Instagram' | 'Website' | 'Facebook'; url: string }[];
  history: { date: string; value: number; type: 'Purchase' | 'Exchange' | 'Service' | 'Digital' }[];
  reviews?: { rating: number; comment: string }[];
  lastPurchaseDate?: string;
}

export interface DownloadProgram {
  id: string;
  name: string;
  description: string;
  link: string;
  category: string;
  image: string;
  caption: string;
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  date: string;
  deliveryType: 'Residence' | 'Counter';
  status: 'Paid' | 'Processing' | 'Completed' | 'Exchanged';
  neighborhoodId?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
  avatar: string;
}

export interface UnitInfo {
  tag: string;
  name: string;
  address: string;
  location: string;
  hours: string;
  email: string;
  mapEmbedUrl: string;
  isMain?: boolean;
}

export interface ProjectImage {
  url: string;
  caption: string;
}

export interface ExchangeRequest {
  id: string;
  saleId: string;
  productId: string;
  clientName: string;
  clientEmail: string;
  purchaseDate: string;
  warrantyPeriod: string;
  reason: string;
  photo: string;
  ticketInfo: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}
