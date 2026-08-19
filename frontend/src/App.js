import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Analytics from "./components/Analytics";
import { LangProvider } from "./context/LangContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Health from "./pages/Health";
import HealthInsurance from "./pages/Products";
import Tools from "./pages/Tools";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/Privacypolicy";
import TermsConditions from "./pages/Terms&Conditions";
import Disclosure from "./pages/Disclosure";
import Disclaimer from "./pages/Disclaimer";
import "./App.css";
import AIChatWidget from "./components/ui/AIChatWidget";

function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <Analytics />
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/tools" element={<Layout><Tools /></Layout>} />
          <Route path="/health-insurance" element={<Layout><HealthInsurance /></Layout>} />
          <Route path="/products" element={<Navigate to="/health-insurance" replace />} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />

          <Route path="/terms-and-conditions" element={<Layout><TermsConditions /></Layout>} />

          <Route path="/disclosure" element={<Layout><Disclosure /></Layout>} />
          <Route path="/regulatory-disclosures" element={<Layout><Disclosure /></Layout>} />
          <Route path="/disclaimer" element={<Layout><Disclaimer /></Layout>} />
          <Route path="/health" element={<Layout><Health /></Layout>} />
        </Routes>
        <AIChatWidget />
      </LangProvider>
    </BrowserRouter>
  );
}

export default App;
