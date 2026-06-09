"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "@/redux/store";
import { TooltipProvider } from "@/components/ui/tooltip";

const persistor = persistStore(store);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </PersistGate>
    </Provider>
  );
}