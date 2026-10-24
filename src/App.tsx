import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ReviewsProvider } from './context/ReviewsContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MarketplaceCalculator } from './components/MarketplaceCalculator';
import { SafetyGuarantees } from './components/SafetyGuarantees';
import { CommunityReviews } from './components/CommunityReviews';
import { FaqSection } from './components/FaqSection';
import { InfoSection } from './components/InfoSection';
import { Footer } from './components/Footer';
import { OrderSimulatorModal } from './components/OrderSimulatorModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { GameId, MarketplaceMode } from './types';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('calculator');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [simulatorParams, setSimulatorParams] = useState<{
    gameId: GameId;
    mode: MarketplaceMode;
    server: string;
    amount: number;
    totalRub: number;
    deliveryMethodId: string;
    payoutMethod?: string;
    payoutRequisites?: string;
  } | undefined>(undefined);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartOrderSimulation = (params: {
    gameId: GameId;
    mode: MarketplaceMode;
    server: string;
    amount: number;
    totalRub: number;
    deliveryMethodId: string;
    payoutMethod?: string;
    payoutRequisites?: string;
  }) => {
    setSimulatorParams(params);
    setIsSimulatorOpen(true);
  };

  const handleOpenBanInspectorWithParams = (gameId: GameId, amount: number, methodId: string) => {
    scrollToSection('safety');
  };

  return (
    <div className="min-h-screen bg-[#080A0F] text-slate-100 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Header with Top Bar Contract & Top-Right Auth Widget */}
      <Header
        activeTab={activeTab}
        onNavigate={scrollToSection}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      <main className="flex-1">
        {/* Compact Hero Section */}
        <div id="home">
          <Hero
            onExploreCalculator={() => scrollToSection('calculator')}
            onExploreRisks={() => scrollToSection('safety')}
          />
        </div>

        {/* Compact Interactive Calculator & Order Box */}
        <MarketplaceCalculator
          onStartOrderSimulation={handleStartOrderSimulation}
          onOpenBanInspectorWithParams={handleOpenBanInspectorWithParams}
        />

        {/* Zero-Ban Safety & Protection Guarantees */}
        <SafetyGuarantees />

        {/* Community Reviews */}
        <CommunityReviews />

        {/* FAQ Knowledge Base */}
        <FaqSection />

        {/* Information, Official Contacts & Channel */}
        <InfoSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Order Simulator Modal */}
      <OrderSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        initialParams={simulatorParams}
      />

      {/* Persistent Auth Modal (Nickname & Password, No Email) */}
      <AuthModal />

      {/* User Profile & Game Nicknames Modal */}
      <UserProfileModal />

      {/* Admin Panel Modal (Restricted exclusively to root user "Администратор") */}
      <AdminPanelModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ReviewsProvider>
        <MainApp />
      </ReviewsProvider>
    </AuthProvider>
  );
}
