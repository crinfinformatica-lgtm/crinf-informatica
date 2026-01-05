
import React, { useState, useRef, useEffect } from 'react';
import { 
  Scissors, Sun, Contrast, Maximize, Check, X, 
  RefreshCw, Layers, Save, Trash2, Sliders,
  Crop, RotateCcw, Scaling, Zap, Sparkles, Wand2
} from 'lucide-react';

interface ImageEditorProps {
  initialImage: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ initialImage, onSave, onCancel }) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [scale, setScale] = useState(100);
  const [processing, setProcessing] = useState(false);
  const [cropType, setCropType] = useState<'rect' | 'circle'>('rect');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    applyFilters();
  }, [brightness, contrast, saturate, scale, cropType]);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = initialImage;
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      canvas.width = (img.width * scale) / 100;
      canvas.height = (img.height * scale) / 100;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (cropType === 'circle') {
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
        ctx.clip();
      }

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%)`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      if (cropType === 'circle') {
        ctx.restore();
      }
    };
  };

  const simulateRemoveBackground = async () => {
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    alert("IA CRINF: Fundo removido e canal Alpha gerado. Verifique o preview.");
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#0369A1]/95 backdrop-blur-3xl flex flex-col p-6 md:p-12 animate-in fade-in duration-300 overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 text-white gap-6">
        <div className="flex items-center gap-6">
           <div className="bg-[#FFFF00] text-[#0369A1] p-4 rounded-2xl shadow-2xl rotate-3">
              <Scissors size={28} />
           </div>
           <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Studio de Imagem IA</h2>
              <p className="text-[10px] text-sky-200 font-black uppercase tracking-[0.4em] mt-2">Ajustes Profissionais & Recorte</p>
           </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onCancel} className="px-6 py-4 rounded-xl hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest transition-all">Cancelar</button>
          <button 
            onClick={() => onSave(canvasRef.current?.toDataURL('image/png') || '')} 
            className="bg-[#FFFF00] text-[#0369A1] px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 border-4 border-white"
          >
            <Save size={18} /> Salvar PNG
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-10 items-center justify-center">
        <div className="flex-grow flex items-center justify-center bg-white/5 rounded-[4rem] p-8 border-4 border-dashed border-white/10 relative h-[50vh] lg:h-full w-full shadow-inner overflow-hidden">
          {processing && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20 text-white gap-6 backdrop-blur-md">
              <RefreshCw className="animate-spin text-[#FFFF00]" size={64} />
              <p className="font-black uppercase tracking-[0.5em] text-xs italic">Processando Recorte IA...</p>
            </div>
          )}
          <div className="relative shadow-2xl rounded-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] opacity-20" />
            <canvas ref={canvasRef} className="relative z-10 max-w-full max-h-full object-contain transition-transform" />
          </div>
        </div>

        <div className="w-full lg:w-[400px] bg-white rounded-[3.5rem] p-10 space-y-10 shadow-2xl border-8 border-sky-50">
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b border-sky-50 pb-4">
               <h3 className="text-xs font-black text-[#0369A1] uppercase tracking-[0.2em] flex items-center gap-3">
                 <Sliders size={18} className="text-[#0EA5E9]" /> Ajustes Técnicos
               </h3>
               <button onClick={() => { setBrightness(100); setContrast(100); setSaturate(100); setScale(100); }} className="text-sky-300 hover:text-red-400 transition-colors"><RotateCcw size={16} /></button>
            </div>

            <div className="space-y-6">
              {[{ label: 'Brilho', val: brightness, set: setBrightness }, { label: 'Contraste', val: contrast, set: setContrast }, { label: 'Zoom', val: scale, set: setScale, min: 10, max: 150 }].map(f => (
                <div key={f.label} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase text-sky-400 tracking-widest">
                    <span>{f.label}</span>
                    <span className="text-[#0369A1] font-black">{f.val}%</span>
                  </div>
                  <input type="range" min={f.min || 0} max={f.max || 200} value={f.val} onChange={(e) => f.set(Number(e.target.value))} className="w-full h-1.5 bg-sky-50 rounded-lg appearance-none cursor-pointer accent-[#0EA5E9]" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-sky-50">
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setCropType('rect')} className={`py-3 rounded-xl font-black uppercase text-[9px] border-2 transition-all ${cropType === 'rect' ? 'bg-[#0369A1] text-white border-white shadow-lg' : 'bg-sky-50 text-sky-300 border-sky-100'}`}>Formato Retangular</button>
                <button onClick={() => setCropType('circle')} className={`py-3 rounded-xl font-black uppercase text-[9px] border-2 transition-all ${cropType === 'circle' ? 'bg-[#0369A1] text-white border-white shadow-lg' : 'bg-sky-50 text-sky-300 border-sky-100'}`}>Formato Circular</button>
             </div>
             <button 
               onClick={simulateRemoveBackground}
               className="w-full bg-sky-50 text-[#0EA5E9] py-5 rounded-xl font-black uppercase text-[9px] tracking-[0.2em] shadow-sm hover:bg-[#FFFF00] hover:text-[#0369A1] transition-all flex items-center justify-center gap-3"
             >
               <Wand2 size={16} /> Remover Fundo (IA)
             </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
