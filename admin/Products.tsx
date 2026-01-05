
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Search, Edit3, Trash2, Tag, DollarSign, AlertTriangle, 
  Image as ImageIcon, X, TrendingUp, Filter, ShieldCheck, 
  Barcode, Briefcase, ChevronDown, CheckCircle2, Upload, Scissors,
  Package, ShoppingCart, Save, Type, Globe, Store, Percent,
  Truck, Layers, AlertCircle, Info, FileUp, FileDown
} from 'lucide-react';
import ImageEditor from './ImageEditor';
import { Product } from '../types';
import * as XLSX from 'xlsx';

const Products: React.FC = () => {
  const { 
    products = [], addProduct, updateProduct, deleteProduct, 
    categories = [], setCategories, suppliers = [], config 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (p.barcode || '').includes(searchTerm) ||
                        (p.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setShowEditor(true);
  };

  const handleNew = () => {
    setEditingProduct({
      id: `p-${Date.now()}`,
      name: '',
      description: '',
      shortDescription: '',
      purchasePrice: 0,
      salePrice: 0,
      barcode: '',
      stock: 0,
      image: 'https://i.imgur.com/kS5sM6C.png',
      category: categories[0] || 'Geral',
      condition: 'Novo',
      warranty: '90 Dias',
      isOnline: true,
      isPhysical: true,
      qualityAlert: false,
      supplierId: suppliers[0]?.id || ''
    });
    setShowEditor(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditingProduct({ ...editingProduct, image: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const productToSave = editingProduct as Product;
      const exists = products.find(p => p.id === productToSave.id);
      exists ? updateProduct(productToSave) : addProduct(productToSave);
      setShowEditor(false);
      setEditingProduct(null);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName && !categories.includes(newCategoryName)) {
      setCategories([...categories, newCategoryName]);
      setEditingProduct(prev => prev ? { ...prev, category: newCategoryName } : prev);
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  // Utilitário robusto para converter valores do Excel para números
  const parseXLSXNumber = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const cleaned = val.replace(/[^\d,.-]/g, '').replace(',', '.');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const handleExportXLSX = () => {
    try {
      const exportData = products.map(p => ({
        'ID': p.id,
        'Nome': p.name,
        'Descricao': p.description,
        'Destaque': p.shortDescription || '',
        'Preco_Compra': p.purchasePrice,
        'Preco_Venda': p.salePrice,
        'Estoque': p.stock,
        'Categoria': p.category,
        'Barcode': p.barcode,
        'Condicao': p.condition,
        'Garantia': p.warranty,
        'Online': p.isOnline ? 'Sim' : 'Não',
        'Alerta_Qualidade': p.qualityAlert ? 'Sim' : 'Não'
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Produtos");
      XLSX.writeFile(wb, `crinf_produtos_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      alert("✅ Catálogo exportado com sucesso! O arquivo foi salvo na sua pasta de downloads.");
    } catch (err) {
      console.error(err);
      alert("❌ Ocorreu um erro ao tentar exportar o arquivo Excel.");
    }
  };

  const handleImportXLSX = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        if (jsonData.length === 0) {
          alert("⚠️ O arquivo parece estar vazio ou não contém dados válidos.");
          return;
        }

        let count = 0;
        for (const row of jsonData) {
          // Mapeamento flexível de chaves (aceita variações de nomes de coluna)
          const product: Product = {
            id: String(row.ID || row.id || `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`),
            name: String(row.Nome || row.name || row.Produto || 'Produto sem nome'),
            description: String(row.Descricao || row.description || ''),
            shortDescription: String(row.Destaque || row.shortDescription || ''),
            purchasePrice: parseXLSXNumber(row.Preco_Compra || row.purchasePrice || row.Custo || 0),
            salePrice: parseXLSXNumber(row.Preco_Venda || row.salePrice || row.Preco || 0),
            stock: parseXLSXNumber(row.Estoque || row.stock || row.Quantidade || 0),
            category: String(row.Categoria || row.category || 'Hardware'),
            barcode: String(row.Barcode || row.barcode || row['Código de Barras'] || ''),
            condition: (row.Condicao === 'Usado' || row.condition === 'Usado' ? 'Usado' : 'Novo') as 'Novo' | 'Usado',
            warranty: String(row.Garantia || row.warranty || '90 Dias'),
            isOnline: (row.Online === 'Sim' || row.isOnline === true || row.online === 'Sim'),
            qualityAlert: (row.Alerta_Qualidade === 'Sim' || row.qualityAlert === true),
            image: 'https://i.imgur.com/kS5sM6C.png',
            supplierId: '',
            exchangesCount: 0,
            salesCount: 0,
            isPhysical: true
          };

          const exists = products.find(p => p.id === product.id);
          if (!exists) {
            await addProduct(product);
            count++;
          }
        }
        alert(`🎉 Sucesso! ${count} novos produtos foram importados e adicionados ao sistema.`);
      } catch (err) {
        console.error("Erro na importação:", err);
        alert("❌ Erro na Importação: Certifique-se de que o arquivo é um XLSX válido e que os cabeçalhos das colunas não foram removidos.");
      }
    };
    reader.readAsArrayBuffer(file);
    // Limpar o input para permitir importar o mesmo arquivo novamente se necessário
    e.target.value = '';
  };

  const profit = (editingProduct?.salePrice || 0) - (editingProduct?.purchasePrice || 0);
  const margin = editingProduct?.purchasePrice ? (profit / editingProduct.purchasePrice) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24 font-sans">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <input type="file" ref={importInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleImportXLSX} />
      
      {/* Header Estilizado */}
      <div className="bg-[#0369A1] p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border-8 border-white">
        <Package className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                 <ShieldCheck size={14} className="text-[#FFFF00]" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#FFFF00]">Gestão de Ativos & PDV</span>
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Controle de Estoque</h2>
              <p className="max-w-xl font-medium opacity-80 text-lg italic leading-relaxed">
                Gerencie seu catálogo físico e online, analise lucros e monitore a qualidade dos produtos.
              </p>
           </div>
           
           <div className="flex flex-col gap-4">
              <button onClick={handleNew} className="bg-[#FFFF00] text-[#0369A1] px-12 py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl border-4 border-white hover:scale-105 transition-all flex items-center justify-center gap-3">
                <Plus size={24} /> ADICIONAR PRODUTO
              </button>
              <div className="flex gap-2">
                <button onClick={() => importInputRef.current?.click()} className="flex-1 bg-white/10 text-white px-6 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <FileUp size={16} /> Importar XLSX
                </button>
                <button onClick={handleExportXLSX} className="flex-1 bg-white/10 text-white px-6 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <FileDown size={16} /> Exportar XLSX
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Barra de Pesquisa e Filtros */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-sky-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-200 group-focus-within:text-[#0EA5E9]" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, barcode ou categoria..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-sky-50 border-none font-bold text-[#0369A1] focus:ring-4 focus:ring-[#FFFF00]/40 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <div className="text-center px-6 border-r border-sky-50">
              <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Total Itens</p>
              <p className="text-2xl font-black text-[#0369A1] italic">{products.length}</p>
           </div>
           <div className="text-center px-6">
              <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Valor em Estoque</p>
              <p className="text-2xl font-black text-[#0EA5E9] italic">R$ {products.reduce((a, b) => a + (b.purchasePrice * b.stock), 0).toLocaleString('pt-BR')}</p>
           </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded-[3.5rem] border border-sky-50 shadow-2xl overflow-hidden flex flex-col group hover:border-[#0EA5E9] transition-all">
            <div className="relative aspect-square overflow-hidden bg-sky-50 shadow-inner">
               <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
               <div className="absolute top-5 left-5 flex flex-col gap-2">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg border-2 border-white ${product.condition === 'Novo' ? 'bg-[#FFFF00] text-[#0369A1]' : 'bg-slate-800 text-white'}`}>{product.condition}</span>
                  {product.qualityAlert && (
                    <span className="bg-red-50 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg border-2 border-white flex items-center gap-1">
                       <AlertTriangle size={10} /> Alta Troca
                    </span>
                  )}
               </div>
               <div className="absolute inset-0 bg-[#0369A1]/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button onClick={() => handleEdit(product)} className="bg-[#FFFF00] text-[#0369A1] p-4 rounded-2xl shadow-xl hover:scale-110 transition-all"><Edit3 size={20}/></button>
                  <button onClick={() => deleteProduct(product.id)} className="bg-white text-red-500 p-4 rounded-2xl shadow-xl hover:scale-110 transition-all"><Trash2 size={20}/></button>
               </div>
            </div>
            <div className="p-8 space-y-4 flex-grow">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{product.category}</p>
                  <h3 className="text-xl font-black text-[#0369A1] uppercase italic leading-none truncate">{product.name}</h3>
                  <p className="text-[10px] font-bold text-sky-300 italic line-clamp-1">{product.shortDescription || 'Sem destaque definido'}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-50">
                     <p className="text-[8px] font-black text-sky-300 uppercase tracking-widest">Estoque</p>
                     <p className="text-xl font-black text-[#0369A1] italic">{product.stock} un</p>
                  </div>
                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-50">
                     <p className="text-[8px] font-black text-sky-300 uppercase tracking-widest">Venda</p>
                     <p className="text-xl font-black text-[#0EA5E9] italic">R$ {product.salePrice.toFixed(2)}</p>
                  </div>
               </div>
            </div>
            <div className="px-8 pb-8 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Globe size={14} className={product.isOnline ? 'text-green-500' : 'text-slate-300'} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{product.isOnline ? 'Online' : 'Físico'}</span>
               </div>
               <button onClick={() => handleEdit(product)} className="text-[#0EA5E9] font-black text-[10px] uppercase tracking-widest hover:underline">Ver Detalhes</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDITOR DE PRODUTO SÊNIOR */}
      {showEditor && editingProduct && (
        <div className="fixed inset-0 z-[110] bg-[#0369A1]/90 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-[5rem] w-full max-w-7xl shadow-2xl border-8 border-white animate-in zoom-in-95 duration-500 flex flex-col max-h-[95vh] overflow-hidden">
             
             {/* Header Modal */}
             <div className="p-10 border-b border-sky-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-6">
                   <div className="p-4 bg-[#FFFF00] text-[#0369A1] rounded-3xl shadow-xl rotate-3"><Package size={36} /></div>
                   <div>
                      <h3 className="text-4xl font-black text-[#0369A1] uppercase italic tracking-tighter">Editor Técnico de Ativo</h3>
                      <p className="text-[10px] font-black text-sky-300 uppercase tracking-widest mt-1">Configuração de Omnichannel, BI e Imagem IA</p>
                   </div>
                </div>
                <button onClick={() => setShowEditor(false)} className="p-5 bg-sky-50 rounded-full text-sky-200 hover:text-red-400 transition-all shadow-sm"><X size={36} /></button>
             </div>

             <form onSubmit={handleSaveProduct} className="flex-grow overflow-y-auto custom-scrollbar p-10 lg:p-14 space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                   
                   {/* COLUNA ESQUERDA: IMAGEM E DESIGN */}
                   <div className="lg:col-span-5 space-y-10">
                      <div className="space-y-4">
                         <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2 flex items-center gap-2">
                           <ImageIcon size={14} /> Imagem do Produto
                         </label>
                         <div className="relative group aspect-square bg-sky-50 rounded-[4.5rem] border-4 border-dashed border-sky-100 flex items-center justify-center overflow-hidden shadow-inner ring-8 ring-sky-50/50">
                            <img src={editingProduct.image} className="w-full h-full object-contain p-8" />
                            <div className="absolute inset-0 bg-[#0369A1]/90 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md gap-4">
                               <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-[#FFFF00] text-[#0369A1] px-10 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
                                  <Upload size={20} /> Upload Imagem
                               </button>
                               <button type="button" onClick={() => setImageToEdit(editingProduct.image!)} className="bg-white/10 px-10 py-4 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 border border-white/20 hover:bg-white/20 transition-all">
                                  <Scissors size={20} /> Studio IA (Ajustes)
                               </button>
                            </div>
                         </div>
                      </div>

                      <div className="bg-[#0369A1] p-10 rounded-[3.5rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
                         <TrendingUp className="absolute -right-6 -top-6 w-32 h-32 opacity-10" />
                         <h4 className="text-xs font-black text-[#FFFF00] uppercase tracking-widest flex items-center gap-2 border-b border-white/20 pb-4">
                           <DollarSign size={18}/> Inteligência de Lucro
                         </h4>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-sky-300 uppercase">Lucro Líquido</p>
                               <p className="text-4xl font-black italic text-[#FFFF00]">R$ {profit.toFixed(2)}</p>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-black text-sky-300 uppercase">Margem Bruta</p>
                               <div className="flex items-center gap-2">
                                  <p className="text-4xl font-black italic">{margin.toFixed(0)}%</p>
                                  <Percent size={24} className="text-[#FFFF00]" />
                               </div>
                            </div>
                         </div>
                         <div className="pt-4 flex items-start gap-4 opacity-70">
                            <Info size={16} className="shrink-0 mt-1" />
                            <p className="text-[9px] font-bold uppercase leading-relaxed italic">Baseado em preço unitário. Taxas de gateway e logística não inclusas.</p>
                         </div>
                      </div>
                   </div>

                   {/* COLUNA DIREITA: DADOS TÉCNICOS */}
                   <div className="lg:col-span-7 space-y-12">
                      
                      {/* Sessão 1: Identidade */}
                      <section className="space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                               <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Nome Comercial</label>
                               <input required className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-2xl text-[#0369A1] italic outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="Ex: Mouse Gamer Razer" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[11px] font-black text-sky-400 uppercase tracking-widest px-2">Código de Barras / SKU</label>
                               <div className="relative">
                                  <input className="w-full pl-14 pr-8 py-5 rounded-[2rem] bg-sky-50 border-none font-black text-sky-500 uppercase outline-none focus:ring-4 focus:ring-[#FFFF00]/40" value={editingProduct.barcode} onChange={e => setEditingProduct({...editingProduct, barcode: e.target.value})} placeholder="7890000..." />
                                  <Barcode className="absolute left-6 top-1/2 -translate-y-1/2 text-sky-200" size={24} />
                               </div>
                            </div>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[11px] font-black text-[#0EA5E9] uppercase tracking-widest px-2 flex items-center gap-2">
                               <Type size={14} /> Texto Breve de Destaque (Aparece na Loja)
                            </label>
                            <input className="w-full px-8 py-5 rounded-[2rem] bg-sky-50 border-2 border-[#FFFF00]/30 font-bold text-[#0369A1] italic outline-none focus:border-[#FFFF00]" value={editingProduct.shortDescription} onChange={e => setEditingProduct({...editingProduct, shortDescription: e.target.value})} placeholder="Ex: RGB Chroma / Sensor 16.000 DPI" />
                         </div>
                      </section>

                      {/* Sessão 2: Categorização & Suprimentos */}
                      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50/50 p-10 rounded-[4rem] border border-slate-100">
                         <div className="space-y-3">
                            <div className="flex justify-between items-center px-2">
                               <label className="text-[10px] font-black text-sky-400 uppercase">Categoria</label>
                               <button type="button" onClick={() => setShowAddCategory(!showAddCategory)} className="text-[9px] font-black text-[#0EA5E9] uppercase hover:underline">+ Nova</button>
                            </div>
                            {showAddCategory ? (
                              <div className="flex gap-2 animate-in slide-in-from-top-2">
                                 <input className="flex-grow px-4 py-3 rounded-xl bg-white border border-sky-100 font-bold text-xs" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Nome Categoria" />
                                 <button type="button" onClick={handleAddCategory} className="p-3 bg-[#0EA5E9] text-white rounded-xl"><CheckCircle2 size={18}/></button>
                              </div>
                            ) : (
                              <select className="w-full px-6 py-4 rounded-2xl bg-white border-none font-bold text-[#0369A1] shadow-sm appearance-none cursor-pointer" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                            )}
                         </div>

                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-sky-400 uppercase px-2">Fornecedor Vinculado</label>
                            <select className="w-full px-6 py-4 rounded-2xl bg-white border-none font-bold text-[#0369A1] shadow-sm appearance-none cursor-pointer" value={editingProduct.supplierId} onChange={e => setEditingProduct({...editingProduct, supplierId: e.target.value})}>
                               <option value="">Selecione um fornecedor...</option>
                               {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                         </div>
                      </section>

                      {/* Sessão 3: Valores & Estoque */}
                      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Custo Compra (R$)</label>
                            <input type="number" step="0.01" className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-black text-xl text-red-500 shadow-inner" value={editingProduct.purchasePrice || ''} onChange={e => setEditingProduct({...editingProduct, purchasePrice: Number(e.target.value)})} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Revenda Final (R$)</label>
                            <input type="number" step="0.01" className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-black text-xl text-green-500 shadow-inner" value={editingProduct.salePrice || ''} onChange={e => setEditingProduct({...editingProduct, salePrice: Number(e.target.value)})} />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-sky-400 uppercase tracking-widest px-2">Estoque Disponível</label>
                            <input type="number" className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-black text-xl text-[#0369A1] shadow-inner" value={editingProduct.stock || ''} onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} />
                         </div>
                      </section>

                      {/* Sessão 4: Estado, Garantia e Qualidade */}
                      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-sky-400 uppercase px-2">Condição</label>
                            <div className="flex bg-sky-100 p-1.5 rounded-2xl border border-sky-200">
                               <button type="button" onClick={() => setEditingProduct({...editingProduct, condition: 'Novo'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${editingProduct.condition === 'Novo' ? 'bg-white text-[#0EA5E9] shadow-md' : 'text-sky-400'}`}>NOVO</button>
                               <button type="button" onClick={() => setEditingProduct({...editingProduct, condition: 'Usado'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${editingProduct.condition === 'Usado' ? 'bg-white text-slate-800 shadow-md' : 'text-sky-400'}`}>USADO</button>
                            </div>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-sky-400 uppercase px-2">Prazo Garantia</label>
                            <input className="w-full px-6 py-4 rounded-2xl bg-sky-50 border-none font-black text-[#0369A1] text-center" value={editingProduct.warranty} onChange={e => setEditingProduct({...editingProduct, warranty: e.target.value})} placeholder="90 Dias" />
                         </div>
                         <div className="flex items-center gap-4 bg-red-50 p-4 rounded-2xl border border-red-100 group">
                            <div className="flex-grow">
                               <p className="text-[9px] font-black text-red-400 uppercase">Alerta Troca?</p>
                               <p className="text-[8px] font-bold text-red-300 uppercase leading-none mt-1 italic">Defeitos frequentes</p>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setEditingProduct({...editingProduct, qualityAlert: !editingProduct.qualityAlert})}
                              className={`w-12 h-6 rounded-full relative transition-all ${editingProduct.qualityAlert ? 'bg-red-500' : 'bg-slate-200'}`}
                            >
                               <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${editingProduct.qualityAlert ? 'left-7' : 'left-1'}`} />
                            </button>
                         </div>
                      </section>

                      {/* Sessão 5: Visibilidade Online */}
                      <div className="flex items-center justify-between p-10 rounded-[3.5rem] bg-[#FFFF00]/10 border-4 border-dashed border-[#FFFF00]">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-[#FFFF00] rounded-2xl shadow-xl text-[#0369A1]"><Globe size={32}/></div>
                            <div>
                               <h4 className="font-black text-[#0369A1] uppercase italic text-xl">Vitrine Online CRINF</h4>
                               <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">Liberar este item para compra direta no site?</p>
                            </div>
                         </div>
                         <button 
                            type="button"
                            onClick={() => setEditingProduct({...editingProduct, isOnline: !editingProduct.isOnline})}
                            className={`px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-widest transition-all shadow-xl border-4 ${editingProduct.isOnline ? 'bg-[#0369A1] text-white border-white' : 'bg-white text-slate-300 border-slate-100'}`}
                         >
                            {editingProduct.isOnline ? 'ATIVO NO SITE' : 'APENAS BALCÃO'}
                         </button>
                      </div>
                   </div>
                </div>

                <div className="flex justify-end gap-6 pt-12 border-t border-sky-50">
                   <button type="button" onClick={() => setShowEditor(false)} className="px-12 py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-widest text-sky-300 hover:bg-sky-50 transition-all">Descartar</button>
                   <button type="submit" className="px-24 py-7 rounded-[3rem] bg-[#0369A1] text-white font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-sky-300 flex items-center gap-4">
                      <Save size={28} /> SALVAR ATIVO
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Editor de Imagem Integrado */}
      {imageToEdit && (
        <ImageEditor 
          initialImage={imageToEdit}
          onSave={(edited) => {
            setEditingProduct(prev => prev ? { ...prev, image: edited } : prev);
            setImageToEdit(null);
          }}
          onCancel={() => setImageToEdit(null)}
        />
      )}
    </div>
  );
};

export default Products;
