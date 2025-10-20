import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import Home from "./pages/Home";
import PageView from "./pages/PageView";
import DataCatalog from "./pages/DataCatalog";
import DatasetDetails from "./pages/DatasetDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  useKeyboardShortcuts();
  
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/page/:pageId" element={<PageView />} />
        <Route path="/data" element={<DataCatalog />} />
        <Route path="/data/:datasetId" element={<DatasetDetails />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
