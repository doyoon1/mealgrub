import { BagContextProvider } from "@/components/BagContext";
import PlannerContextProvider from "@/components/PlannerContext";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SessionProvider } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import './App.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <SessionProvider>
        <DndProvider backend={HTML5Backend}>
          <BagContextProvider>
            <PlannerContextProvider>
              <Component {...pageProps} />
            </PlannerContextProvider>
          </BagContextProvider>
        </DndProvider>
        <Toaster />
      </SessionProvider>
    </>
  );
}
