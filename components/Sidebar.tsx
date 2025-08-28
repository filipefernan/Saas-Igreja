import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { BuildingIcon, CalendarIcon, FaqIcon, AgendaIcon, ContentIcon, IntegrationIcon, SparklesIcon, LogoutIcon, DashboardIcon, SettingsIcon, MenuIcon, FinancialIcon, PrayerIcon, UsersIcon } from './ui/Icons';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    openChat: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    pageName: string;
    activePage: string;
    setActivePage: (page: string) => void;
}> = ({ icon, label, pageName, activePage, setActivePage }) => {
    const isActive = activePage === pageName;
    return (
        <li
            onClick={() => setActivePage(pageName)}
            className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive
                    ? 'bg-neutral-100 text-[var(--color-text)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:bg-neutral-100/50 hover:text-[var(--color-text)]'
            }`}
        >
            {icon}
            <span className="ml-4 font-medium">{label}</span>
        </li>
    );
};

const UserProfile: React.FC<{ setActivePage: (page: string) => void }> = ({ setActivePage }) => {
    const context = useContext(AppContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!context) return null;
    const { userInfo, logout, credits } = context;
    
    const formattedCredits = new Intl.NumberFormat('pt-BR').format(credits);

    return (
        <div className="mt-4 relative" ref={menuRef}>
             <div className="p-3 border border-[var(--color-border)] rounded-lg mb-3">
                <p className="text-sm text-[var(--color-text-secondary)]">Créditos restantes</p>
                <p className="text-xl font-bold text-[var(--color-text)]">{formattedCredits}</p>
                <button 
                    onClick={() => setActivePage('conta')}
                    className="w-full text-center mt-2 text-sm bg-[var(--color-accent)] text-[var(--color-text)] font-bold py-1.5 rounded-md hover:bg-[var(--color-accent-dark)] transition-colors">
                    Comprar mais
                </button>
            </div>
            
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-100 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-800">
                        {userInfo.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                        <p className="font-bold text-[var(--color-text)] text-sm">{userInfo.name}</p>
                        <p className="text-xs text-[var(--color-text-secondary)]">{userInfo.email}</p>
                    </div>
                </div>
                <MenuIcon className="w-5 h-5 text-[var(--color-text-secondary)]"/>
            </div>

            {isMenuOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-[var(--color-border)] rounded-lg shadow-xl animate-fade-in p-2">
                    <ul>
                        <li 
                            onClick={() => {
                                setActivePage('conta');
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-100 cursor-pointer text-[var(--color-text-secondary)]">
                            <SettingsIcon className="w-5 h-5"/>
                            <span className="text-sm font-medium">Gerenciar conta</span>
                        </li>
                        <li 
                            onClick={logout}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-neutral-100 cursor-pointer text-[var(--color-text-secondary)]">
                            <LogoutIcon className="w-5 h-5"/>
                             <span className="text-sm font-medium">Sair da conta</span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, openChat }) => {
    const context = useContext(AppContext);
    
    if (!context) return null;
    const { churchInfo, agentSettings } = context;

    const navItems = [
        { icon: <DashboardIcon className="w-5 h-5" />, label: 'Dashboard', page: 'dashboard' },
        { icon: <BuildingIcon className="w-5 h-5" />, label: 'Institucional', page: 'institucional' },
        { icon: <UsersIcon className="w-5 h-5" />, label: 'Ministérios', page: 'ministerios' },
        { icon: <CalendarIcon className="w-5 h-5" />, label: 'Cultos e Eventos', page: 'eventos' },
        { icon: <FaqIcon className="w-5 h-5" />, label: 'Perguntas Frequentes', page: 'faq' },
        { icon: <AgendaIcon className="w-5 h-5" />, label: 'Agenda Pastoral', page: 'agenda' },
        { icon: <ContentIcon className="w-5 h-5" />, label: 'Conteúdos', page: 'conteudos' },
        { icon: <FinancialIcon className="w-5 h-5" />, label: 'Financeiro', page: 'financeiro' },
        { icon: <PrayerIcon className="w-5 h-5" />, label: 'Pedidos de Oração', page: 'oracoes' },
        { icon: <IntegrationIcon className="w-5 h-5" />, label: 'Integrações', page: 'integracoes' },
    ];

    return (
        <aside className="w-64 h-full bg-white p-4 flex flex-col justify-between border-r border-[var(--color-border)]">
            <div>
                <div className="flex items-center mb-8">
                    {churchInfo.profilePicture ? (
                        <img src={churchInfo.profilePicture} alt="Logo" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-accent)]" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                            <BuildingIcon className="w-6 h-6 text-[var(--color-text)]" />
                        </div>
                    )}
                    <div className="ml-3">
                        <h1 className="font-bold text-[var(--color-text)] text-lg leading-tight">{agentSettings.name}</h1>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-tight">{churchInfo.name}</p>
                    </div>
                </div>

                <nav>
                    <ul>
                        {navItems.map(item => (
                            <NavItem
                                key={item.page}
                                icon={item.icon}
                                label={item.label}
                                pageName={item.page}
                                activePage={activePage}
                                setActivePage={setActivePage}
                            />
                        ))}
                    </ul>
                </nav>
            </div>

            <div>
                 <button 
                    onClick={openChat}
                    className="w-full flex items-center justify-center p-3 rounded-lg bg-[var(--color-accent)] text-[var(--color-text)] font-bold hover:bg-[var(--color-accent-dark)] transition-colors shadow-sm">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Testar Agente
                </button>
                <UserProfile setActivePage={setActivePage} />
            </div>
        </aside>
    );
};

export default Sidebar;