
// Motor de Banco de Dados Local (Substituto Definitivo do Firebase)
// Este arquivo emula a API do Firestore usando LocalStorage para máxima estabilidade.

const STORAGE_PREFIX = 'crinf_db_';

const getFromLS = (key: string) => {
  const data = localStorage.getItem(STORAGE_PREFIX + key);
  return data ? JSON.parse(data) : [];
};

const saveToLS = (key: string, data: any) => {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
};

export const db = { type: 'local_storage_engine' };

export const auth = {
  currentUser: { uid: 'admin-local', email: 'admin@crinf.com' },
  onAuthStateChanged: (callback: any) => {
    callback({ uid: 'admin-local', email: 'admin@crinf.com' });
    return () => {};
  }
};

// Emulação de funções do Firestore
export const collection = (dbInstance: any, collectionName: string) => ({
  type: 'collection',
  name: collectionName
});

export const doc = (dbInstance: any, collectionName: string, docId: string) => ({
  type: 'doc',
  collection: collectionName,
  id: docId
});

export const onSnapshot = (ref: any, callback: any) => {
  // Simula o carregamento inicial
  setTimeout(() => {
    if (ref.type === 'collection') {
      const data = getFromLS(ref.name);
      callback({
        docs: data.map((item: any) => ({
          id: item.id,
          data: () => item,
          exists: () => true
        }))
      });
    } else {
      const data = getFromLS(ref.collection);
      const item = data.find((i: any) => i.id === ref.id);
      callback({
        exists: () => !!item,
        data: () => item
      });
    }
  }, 10);
  return () => {}; // Função de unsubscribe
};

export const setDoc = async (ref: any, data: any) => {
  const collectionData = getFromLS(ref.collection || ref.name);
  const index = collectionData.findIndex((i: any) => i.id === (ref.id || data.id));
  
  const newItem = { ...data, id: ref.id || data.id };
  
  if (index > -1) {
    collectionData[index] = newItem;
  } else {
    collectionData.push(newItem);
  }
  
  saveToLS(ref.collection || ref.name, collectionData);
  window.dispatchEvent(new Event('storage')); // Notifica outras abas
  return true;
};

export const updateDoc = async (ref: any, data: any) => {
  const collectionData = getFromLS(ref.collection);
  const index = collectionData.findIndex((i: any) => i.id === ref.id);
  
  if (index > -1) {
    collectionData[index] = { ...collectionData[index], ...data };
    saveToLS(ref.collection, collectionData);
    window.dispatchEvent(new Event('storage'));
  }
  return true;
};

export const deleteDoc = async (ref: any) => {
  const collectionData = getFromLS(ref.collection);
  const filtered = collectionData.filter((i: any) => i.id !== ref.id);
  saveToLS(ref.collection, filtered);
  window.dispatchEvent(new Event('storage'));
  return true;
};

export default { db, auth };
