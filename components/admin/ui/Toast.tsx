"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: number; title: string; description?: string; variant?: "default" | "destructive" };
const Ctx = createContext<{ toast: (t: Omit<Toast, "id">) => void }>({ toast: () => undefined });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { ...t, id }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast ${t.variant === "destructive" ? "toast--bad" : ""}`}>
            <strong>{t.title}</strong>
            {t.description ? <span>{t.description}</span> : null}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
