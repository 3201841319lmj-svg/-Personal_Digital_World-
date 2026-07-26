import React from 'react';
import { HomeProvider, useHomeStore } from './store/useHomeStore';
import { HeaderSection } from './components/Header/HeaderSection';
import { HistoryDrawer } from './components/Drawer/HistoryDrawer';
import { HomeNavigation } from './components/Navigation/HomeNavigation';
import { SettingsModal } from './components/Modal/SettingsModal';
import { AgentSelectorModal } from './components/Modal/AgentSelectorModal';

import { HomePage } from './pages/HomePage';
import { LivingRoomPage } from './pages/LivingRoomPage';
import { StudyPage } from './pages/StudyPage';
import { BedroomPage } from './pages/BedroomPage';

const MainViewContent: React.FC = () => {
  const { activeTab, currentTheme } = useHomeStore();

  return (
    <main className="home-canvas" data-theme={currentTheme}>
      {/* Top 复古标题栏 (卧室为独立全屏织梦，不叠加全局标题栏) */}
      {activeTab !== 'bedroom' && <HeaderSection />}

      {/* Center Body: Drawer + Tab View */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <HistoryDrawer />
        
        {activeTab === 'farm' && <HomePage />}
        {activeTab === 'livingroom' && <LivingRoomPage />}
        {activeTab === 'study' && <StudyPage />}
        {activeTab === 'bedroom' && <BedroomPage />}
      </div>

      {/* Bottom Carved Wooden Desk Navigation */}
      <HomeNavigation />

      {/* Modals & Overlays */}
      <SettingsModal />
      <AgentSelectorModal />
    </main>
  );
};

export function App() {
  return (
    <HomeProvider>
      <MainViewContent />
    </HomeProvider>
  );
}

export default App;
