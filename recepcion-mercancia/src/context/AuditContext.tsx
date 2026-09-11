import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Product } from '../types/Product';
import { AuditEntry } from '../types/AuditEntry';
import { mockProducts } from '../data/products';

interface AuditContextType {
  products: Product[];
  auditLogs: AuditEntry[];
  addAuditEntry: (entry: AuditEntry) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);

  // Función que se llamará cada vez que el escáner valide una carga
  const addAuditEntry = (entry: AuditEntry) => {
    // 1. Guardamos el log georreferenciado al inicio de la lista
    setAuditLogs((prevLogs) => [entry, ...prevLogs]);
    
    // 2. Descontamos 1 unidad del stock esperado para dar feedback visual
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === entry.productId && p.expectedStock > 0
          ? { ...p, expectedStock: p.expectedStock - 1 }
          : p
      )
    );
  };

  return (
    <AuditContext.Provider value={{ products, auditLogs, addAuditEntry }}>
      {children}
    </AuditContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente en cualquier pantalla
export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit debe usarse dentro de un AuditProvider');
  }
  return context;
};