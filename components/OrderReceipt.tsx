
import React from 'react';
import { ShieldCheck, Calendar, Package, MapPin, Store, Receipt, Download, XCircle, Printer } from 'lucide-react';
import { Sale, Product } from '../types';

interface OrderReceiptProps {
  sale: Sale;
  products: Product[];
  onCancel?: (saleId: string) => void;
  onClose: () => void;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({ sale, products, onCancel, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#0369A1]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden border-8 border-white flex flex-col max-h-[90vh]">
        
        {/* Cabeçalho do Ticket */}
        <div className="bg-[#0EA5E9] p-10 text-white relative overflow-hidden shrink-0 print:bg-white print:text-[#0369A1] print:p-4">
          <div className="absolute -right-10 -top-10 opacity-10 rotate-12"><Receipt size={200} /></div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full border border-white/20">
                <ShieldCheck size={14} className="text-[#FFFF00]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Recibo Oficial CRINF</span>
              </div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Ticket #{sale.id}</h2>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> {new Date(sale.date).toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="bg-[#FFFF00] text-[#0369A1] p-4 rounded-2xl shadow-xl font-black italic text-xl">CR</div>
          </div>
        </div>

        {/* Conteúdo do Recibo */}
        <div className="p-10 lg:p-14 overflow-y-auto custom-scrollbar space-y-10 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]">
          
          {/* Itens */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-sky-300 uppercase tracking-[0.3em] border-b border-sky-50 pb-4">Equipamentos & Serviços</h3>
            {sale.items.map((item, idx) => {
              const product = products.find(p => p.id === item.productId);
              return (
                <div key={idx} className="flex justify-between items-center bg-sky-50/50 p-6 rounded-[2rem] border border-white shadow-sm">
                  <div className="space-y-1">
                    <p className="font-black text-[#0369A1] uppercase italic">{product?.name || 'Item Removido'}</p>
                    <div className="flex gap-4">
                      <p className="text-[9px] font-bold text-sky-400 uppercase">Qtd: {item.quantity}</p>
                      <p className="text-[9px] font-black text-[#0EA5E9] uppercase flex items-center gap-1">
                        <ShieldCheck size={10} /> Garantia: {product?.warranty || 'Consultar'}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-[#0369A1] italic">R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          {/* Logística & Notas Legais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-sky-50 shadow-sm space-y-4">
              <p className="text-[9px] font-black text-sky-300 uppercase tracking-widest">Entrega / Retirada</p>
              <div className="flex items-center gap-4 text-[#0369A1]">
                {sale.deliveryType === 'Residence' ? <MapPin size={24} className="text-[#0EA5E9]" /> : <Store size={24} className="text-[#0EA5E9]" />}
                <p className="font-black uppercase text-xs italic">
                  {sale.deliveryType === 'Residence' ? 'Entrega em Domicílio' : 'Retirada no Balcão'}
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-sky-50 shadow-sm space-y-4">
              <p className="text-[9px] font-black text-sky-300 uppercase tracking-widest">Status do Ticket</p>
              <div className="flex items-center gap-4 text-[#0369A1]">
                <span className={`h-3 w-3 rounded-full animate-pulse ${sale.status === 'Paid' ? 'bg-green-500' : 'bg-[#FFFF00]'}`} />
                <p className="font-black uppercase text-xs italic">{sale.status === 'Paid' ? 'Confirmado' : 'Aguardando'}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#FFFF00]/10 p-8 rounded-[3rem] border-2 border-dashed border-[#FFFF00] space-y-4">
            <h4 className="text-[10px] font-black text-[#0369A1] uppercase tracking-widest flex items-center gap-2">
              <InfoIcon size={16} /> Cláusulas de Garantia CRINF
            </h4>
            <ul className="text-[9px] font-bold text-sky-600 uppercase leading-relaxed space-y-2">
              <li>• Garantia de arrependimento: 7 dias corridos após a entrega (Art. 49 CDC).</li>
              <li>• Este ticket é indispensável para acionar a garantia técnica em Campo Largo.</li>
              <li>• A garantia de hardware está vinculada à integridade do selo de segurança.</li>
            </ul>
          </div>
        </div>

        {/* Footer de Ações */}
        <div className="p-10 border-t border-sky-50 flex flex-col md:flex-row gap-4 shrink-0 bg-white print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-[#0EA5E9] text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-[#0369A1] transition-all"
          >
            <Printer size={18} /> Imprimir / Salvar PDF
          </button>
          
          {sale.status !== 'Exchanged' && onCancel && (
            <button 
              onClick={() => onCancel(sale.id)}
              className="flex-1 bg-red-50 text-red-500 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all"
            >
              <XCircle size={18} /> Cancelar Pedido
            </button>
          )}

          <button 
            onClick={onClose}
            className="px-10 py-5 rounded-[2rem] font-black uppercase text-xs text-sky-300 hover:bg-sky-50 transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
);

export default OrderReceipt;
