import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AdminPanel from "./pages/AdminPanel";
import Galeria from "./pages/Galeria";
import Cumpleanos from "./pages/Cumpleanos";
import CumpleanosInfantiles from "./pages/CumpleanosInfantiles";
import Casamientos from "./pages/Casamientos";
import EventosEmpresariales from "./pages/EventosEmpresariales";
import DespedidasDeAno from "./pages/DespedidasDeAno";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/cumpleanos" element={<Cumpleanos />} />
          <Route path="/cumpleanos-infantiles" element={<CumpleanosInfantiles />} />
          <Route path="/casamientos" element={<Casamientos />} />
          <Route path="/eventos-empresariales" element={<EventosEmpresariales />} />
          <Route path="/despedidas-de-ano" element={<DespedidasDeAno />} />
          
          {/* Rutas alias para campañas de Google Ads - redirigen a las rutas completas */}
          <Route path="/empresariales" element={<Navigate to="/eventos-empresariales" replace />} />
          <Route path="/infantiles" element={<Navigate to="/cumpleanos-infantiles" replace />} />
          <Route path="/corporativos" element={<Navigate to="/eventos-empresariales" replace />} />
          <Route path="/bodas" element={<Navigate to="/casamientos" replace />} />
          <Route path="/cumples" element={<Navigate to="/cumpleanos" replace />} />
          <Route path="/fin-de-ano" element={<Navigate to="/despedidas-de-ano" replace />} />
          <Route path="/despedidas" element={<Navigate to="/despedidas-de-ano" replace />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
