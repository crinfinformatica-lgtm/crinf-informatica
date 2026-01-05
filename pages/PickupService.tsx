
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, User, MapPin, Calendar, Clock, Camera, 
  Send, Info, ShieldCheck, CheckCircle2, XCircle, 
  ArrowLeft, Monitor, Smartphone, Cpu, ClipboardList,
  Mail, AlertCircle, HelpCircle, Briefcase, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Booking } from '../types';

const PickupService: React.FC = () => {
  const { config, neighborhoods, addBooking, bookings, technicalServices } = useApp();
  const page = config.pickupPage;
  
  const [serviceMode, setServiceMode] = useState<'Pickup' | 'OnSite'>('Pickup');
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [clientEmail, setClientEmail] = useState('');
  const [clientDoc, setClientDoc] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Obtém categorias únicas do catálogo técnico para o formulário
  const techCategories = useMemo(() => 
    Array.from(new Set(technicalServices.map(s => s.category))), 
  [technicalServices]);

  const neighborhoodData = neighborhoods.find(n => n.id === selectedNeighborhood);
  const baseRate = neighborhoodData?.rate || 0;
  const finalRate = serviceMode === 'Pickup' ? baseRate * 2 : baseRate;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const newBooking: Booking = {
      id: bookingId,
      type: serviceMode,
      clientId: 'guest',
      clientName: formValues['clientName'] || 'Cliente Anônimo',
      clientEmail,
      clientDoc,
      pickupAddress: formValues['address'] || 'Retirada solicitada',
      scheduledAt: `${formValues['date']} ${formValues['time']}`,
      equipmentType: formValues['equipmentType'] || 'Não informado',
      equipmentPhoto: photo || '',
      observation: formValues['observation'] || '',
      neighborhoodId: selectedNeighborhood,
      totalCost: finalRate,
      status: 'Pending',
      customFields: formValues
    };

    addBooking(newBooking);
    setSuccessId(bookingId);
    setLoading(false);
  };

  if (successId) {
    const current = bookings.find(b => b.id === successId);
    return (
      <div className="max-w-4xl mx-auto py-32 px-8 text-center animate-in zoom-in-95 duration-500">
        <div className="w-32 h-32 bg-[#FFFF00] text-[#0369A1] rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl ring-8 ring-sky-50">
          <CheckCircle2 size={64} strokeWidth={2.5} />
        </div>
        <h2 className="text-5xl font-black text-[#0369A1] tracking-tighter uppercase italic mb-6">Agendamento Confirmado!</h2>
        
        <div className="bg-white p-12 rounded-[4.5rem] border border-sky-100 shadow-2xl text-left space-y-8 mb-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[4rem] flex items-center justify-center text-sky-200">
              <Truck size={48} />
           </div>
           
           <div className="space-y-2">
              <p className="text-[10px] font-black text-sky-300 uppercase tracking-[0.4em]">Protocolo Técnico CRINF</p>
              <h3 className="text-3xl font-black text-[#0369A1] italic">Ticket #{successId}</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-sky-50">
              <div>
                 <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Serviço</p>
                 <p className="font-bold text-[#0369A1]">{serviceMode === 'Pickup' ? 'Leva e Traz (Coleta)' : 'Atendimento no Local'}</p>
              </div>
              <div>
                 <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Taxa de Logística</p>
                 <p className="text-2xl font-black text-[#0EA5E9] italic">R$ {current?.totalCost.toFixed(2)}</p>
              </div>
           </div>
        </div>

        <Link to="/" className="inline-flex items-center gap-4 bg-[#0369A1] text-white px-12 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest shadow-xl hover:bg-[#0EA5E9] transition-all border-4 border-white/10">
          <ArrowLeft size={18} /> Voltar ao Início
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#FFFF00] selection:text-[#0369A1]">
      {/* Header Comercial Dinâmico */}
      <section className="relative py-24 px-6 text-center overflow-hidden bg-[#0369A1]">
        <div className="absolute inset-0">
          <img src={page.heroImage} className="w-full h-full object-cover opacity-20" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0369A1] to-transparent" />
        </div>
        <div className="max-w-5xl mx-auto space-y-8 relative z-10 text-white">
          <div className="inline-flex p-4 bg-[#FFFF00] text-[#0369A1] rounded-[2rem] shadow-2xl rotate-3 mb-4">
             <Truck size={40} />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none drop-shadow-2xl">
            {page.title}
          </h1>
          <p className="text-2xl text-white/90 font-medium italic max-w-3xl mx-auto leading-relaxed">
            {page.subtitle}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-24 px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-sky-50 p-12 rounded-[4rem] border border-sky-100 shadow-xl space-y-10 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-5 text-[#0369A1] group-hover:rotate-12 transition-transform duration-700">
               <Briefcase size={240} />
            </div>
            <h2 className="text-3xl font-black text-[#0369A1] uppercase italic tracking-tighter flex items-center gap-4 relative z-10">
               Como <span className="text-[#0EA5E9]">Funciona</span>
            </h2>
            <div className="prose prose-sky max-w-none text-sky-600 font-medium italic leading-relaxed relative z-10">
               {page.description}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
           <form onSubmit={handleSubmit} className="bg-white p-12 md:p-16 rounded-[5rem] border border-sky-50 shadow-[0_40px_80px_-20px_rgba(14,165,233,0.15)] space-y-12">
              
              <div className="flex flex-col md:flex-row gap-6">
                 <button 
                  type="button"
                  onClick={() => setServiceMode('Pickup')}
                  className={`flex-1 p-8 rounded-[3rem] border-4 transition-all flex flex-col items-center gap-4 text-center ${serviceMode === 'Pickup' ? 'bg-[#0369A1] border-[#FFFF00] text-white shadow-2xl scale-[1.02]' : 'bg-sky-50 border-transparent text-sky-400 opacity-60 hover:opacity-100'}`}
                 >
                    <Truck size={40} className={serviceMode === 'Pickup' ? 'text-[#FFFF00]' : ''} />
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest">Leva e Traz</p>
                    </div>
                 </button>
                 <button 
                  type="button"
                  onClick={() => setServiceMode('OnSite')}
                  className={`flex-1 p-8 rounded-[3rem] border-4 transition-all flex flex-col items-center gap-4 text-center ${serviceMode === 'OnSite' ? 'bg-[#0369A1] border-[#FFFF00] text-white shadow-2xl scale-[1.02]' : 'bg-sky-50 border-transparent text-sky-400 opacity-60 hover:opacity-100'}`}
                 >
                    <User size={40} className={serviceMode === 'OnSite' ? 'text-[#FFFF00]' : ''} />
                    <div>
                       <p className="text-xs font-black uppercase tracking-widest">Visita Local</p>
                    </div>
                 </button>
              </div>

              <div className="space-y-12">
                 <section className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Tipo de Equipamento (Catálogo)</label>
                          <select required className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1] focus:ring-4 focus:ring-[#FFFF00]/40 outline-none" value={formValues['equipmentType']} onChange={e => setFormValues({...formValues, equipmentType: e.target.value})}>
                             <option value="">Selecione...</option>
                             {techCategories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Bairro (CL)</label>
                          <select required className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1] focus:ring-4 focus:ring-[#FFFF00]/40 outline-none appearance-none" value={selectedNeighborhood} onChange={e => setSelectedNeighborhood(e.target.value)}>
                             <option value="">Selecione...</option>
                             {neighborhoods.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                          </select>
                       </div>
                    </div>
                 </section>

                 <button 
                    type="submit"
                    disabled={loading || !photo}
                    className="w-full bg-[#FFFF00] text-[#0369A1] py-8 rounded-[3rem] font-black uppercase text-sm tracking-[0.4em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 border-4 border-white/20"
                 >
                    {loading ? 'Agendando...' : 'Confirmar Agendamento'} <Send size={24} />
                 </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default PickupService;
