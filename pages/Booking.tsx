
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, MapPin, User, Send, 
  CheckCircle, Info, Settings,
  Upload, Zap, Briefcase, MousePointer2, Cable, Monitor
} from 'lucide-react';
import { Booking as BookingType } from '../types';

const Booking: React.FC = () => {
  const { neighborhoods, addBooking, bookings, config } = useApp();
  const pageConfig = config.pickupPage;
  const [serviceType, setServiceType] = useState<'Pickup' | 'OnSite'>('Pickup');
  const [formData, setFormData] = useState<any>({
    name: '', email: '', doc: '', address: '',
    neighborhoodId: '', date: '', time: '', observation: '',
  });
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, any>>({});
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastBookingId, setLastBookingId] = useState<string | null>(null);

  const selectedNeighborhood = neighborhoods.find(n => n.id === formData.neighborhoodId);
  const baseRate = selectedNeighborhood?.rate || 0;
  const totalCost = serviceType === 'Pickup' ? baseRate * 2 : baseRate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const booking: BookingType = {
      id: newId,
      type: serviceType,
      clientId: 'guest',
      clientName: formData.name,
      clientEmail: formData.email,
      clientDoc: formData.doc,
      pickupAddress: `${formData.address}, ${selectedNeighborhood?.name}`,
      scheduledAt: `${formData.date} ${formData.time}`,
      equipmentType: customFieldValues['Tipo de Equipamento'] || 'Não especificado',
      equipmentPhoto: photo || undefined,
      observation: formData.observation,
      neighborhoodId: formData.neighborhoodId,
      totalCost: totalCost,
      status: 'Pending',
      customFields: {
        ...customFieldValues,
        'Acessórios Inclusos': selectedAccessories.join(', ')
      }
    };
    
    addBooking(booking);
    setLastBookingId(newId);
    setShowSuccess(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (showSuccess && lastBookingId) {
    return (
      <div className="max-w-3xl mx-auto py-32 px-8 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-[#FFFF00] text-[#0369A1] rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl ring-4 ring-sky-50">
          <CheckCircle size={48} strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-black text-[#0369A1] tracking-tighter mb-4 uppercase italic">Agendamento Realizado!</h2>
        <p className="text-sky-600 font-medium mb-10 leading-relaxed max-w-xl mx-auto">
          Protocolo <b>#{lastBookingId}</b> gerado com sucesso.
        </p>
        <button onClick={() => setShowSuccess(false)} className="bg-[#0EA5E9] text-white px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl">Voltar ao Início</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-20 px-6 font-sans">
      <div className="text-center mb-16 space-y-6">
        <div className="inline-flex items-center gap-4 bg-white p-2 rounded-[2.5rem] shadow-2xl border border-sky-100">
           <button onClick={() => setServiceType('Pickup')} className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${serviceType === 'Pickup' ? 'bg-[#0EA5E9] text-white shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}>
             <Truck size={20} /> Leva e Traz
           </button>
           <button onClick={() => setServiceType('OnSite')} className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${serviceType === 'OnSite' ? 'bg-[#FFFF00] text-[#0369A1] shadow-xl' : 'text-sky-300 hover:text-[#0EA5E9]'}`}>
             <User size={20} /> Atendimento Local
           </button>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-[#0369A1] tracking-tighter uppercase italic">{pageConfig.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <form onSubmit={handleSubmit} className="bg-white rounded-[4rem] shadow-2xl border border-sky-100 overflow-hidden p-10 lg:p-16 space-y-16">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Nome Completo</label>
                <input required className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">E-mail</label>
                <input type="email" required className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1]" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </section>

            <section className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(pageConfig.formFields || []).map(field => (
                  <div key={field.id} className="space-y-2">
                     <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">{field.label}</label>
                     {field.type === 'select' ? (
                       <select required={field.required} className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1]" value={customFieldValues[field.label]} onChange={e => setCustomFieldValues({...customFieldValues, [field.label]: e.target.value})}>
                         <option value="">Selecione...</option>
                         {(field.options || []).map(o => <option key={o} value={o}>{o}</option>)}
                       </select>
                     ) : (
                       <input type={field.type} required={field.required} className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-bold text-[#0369A1]" value={customFieldValues[field.label]} onChange={e => setCustomFieldValues({...customFieldValues, [field.label]: e.target.value})} />
                     )}
                  </div>
                ))}
              </div>
            </section>

            <button type="submit" className="w-full bg-[#FFFF00] text-[#0369A1] py-6 rounded-[2.5rem] font-black uppercase text-xs shadow-xl flex items-center justify-center gap-4">
               Finalizar Agendamento <Send size={20}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
