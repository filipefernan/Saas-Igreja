import React from 'react';
import InstitutionalModule from './modules/InstitutionalModule';
import EventsModule from './modules/EventsModule';
import FaqModule from './modules/FaqModule';
import AgendaModule from './modules/AgendaModule';
import ContentModule from './modules/ContentModule';
import IntegrationsModule from './modules/IntegrationsModule';
import MetricsModule from './modules/MetricsModule';
import AccountModule from './modules/AccountModule';
import FinancialModule from './modules/FinancialModule';
import PrayerRequestsModule from './modules/PrayerRequestsModule';
import MinistriesModule from './modules/MinistriesModule';

interface DashboardProps {
    activePage: string;
    goBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activePage, goBack }) => {
    const renderActivePage = () => {
        switch (activePage) {
            case 'institucional':
                return <InstitutionalModule />;
            case 'ministerios':
                return <MinistriesModule />;
            case 'eventos':
                return <EventsModule />;
            case 'faq':
                return <FaqModule />;
            case 'agenda':
                return <AgendaModule />;
            case 'conteudos':
                return <ContentModule />;
            case 'integracoes':
                return <IntegrationsModule />;
            case 'financeiro':
                return <FinancialModule />;
            case 'oracoes':
                return <PrayerRequestsModule />;
            case 'dashboard':
                return <MetricsModule goBack={goBack} />;
            case 'conta':
                return <AccountModule goBack={goBack} />;
            default:
                return <MetricsModule goBack={goBack} />;
        }
    };

    return (
        <div className="p-8 h-full">
            {renderActivePage()}
        </div>
    );
};

export default Dashboard;