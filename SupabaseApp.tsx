import React, { useState } from 'react';
import { SupabaseProvider, useSupabaseContext } from './context/SupabaseContext';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import TestChat from './components/TestChat';
import Login from './pages/Login';
import HumanChat from './components/HumanChat';
import { WhatsappIcon } from './components/ui/Icons';

const AppContainer = () => {
    const { isAuthenticated, authLoading, churchUser } = useSupabaseContext();
    const [pageHistory, setPageHistory] = useState(['dashboard']);
    const activePage = pageHistory[pageHistory.length - 1];
    
    const [isTestChatOpen, setTestChatOpen] = useState(false);
    const [isHumanChatOpen, setHumanChatOpen] = useState(false);

    const navigateTo = (page: string) => {
        if (page !== activePage) {
            setPageHistory(prev => [...prev, page]);
        }
    };

    const goBack = () => {
        if (pageHistory.length > 1) {
            setPageHistory(prev => prev.slice(0, -1));
        }
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-[var(--color-background-secondary)]">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--color-text-secondary)]">Carregando...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - show login
    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <>
            <div className="flex h-screen bg-[var(--color-background-secondary)] overflow-hidden">
                <Sidebar 
                    activePage={activePage} 
                    setActivePage={navigateTo} 
                    openChat={() => setTestChatOpen(true)} 
                />
                <main className="flex-1 overflow-y-auto">
                    <Dashboard activePage={activePage} goBack={goBack} />
                </main>
                {isTestChatOpen && <TestChat closeChat={() => setTestChatOpen(false)} />}
            </div>
            
            <button 
                onClick={() => setHumanChatOpen(!isHumanChatOpen)}
                className="fixed bottom-5 right-5 z-50 bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:scale-110 transition-transform"
                aria-label={isHumanChatOpen ? "Fechar chat humano" : "Abrir chat humano"}
            >
                {isHumanChatOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <WhatsappIcon className="w-10 h-10" />
                )}
            </button>
            
            {isHumanChatOpen && <HumanChat closeChat={() => setHumanChatOpen(false)} />}
        </>
    );
};

const SupabaseApp: React.FC = () => {
    return (
        <SupabaseProvider>
            <AppContainer />
        </SupabaseProvider>
    );
};

export default SupabaseApp;