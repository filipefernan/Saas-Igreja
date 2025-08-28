import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import type { ChurchInfo, AgentSettings, ScheduleItem, EventItem, FaqItem, StudyMaterial, PastoralAppointment, PastoralAvailability, UploadedFile, FinancialInfo, PrayerRequest, Ministry } from '../types';

interface UserInfo {
    name: string;
    email: string;
    profilePicture: string; // Could be a URL
}

interface AppContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (status: boolean) => void;
    logout: () => void;
    isOnboardingComplete: boolean;
    setIsOnboardingComplete: (status: boolean) => void;
    
    userInfo: UserInfo;
    setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
    credits: number;
    addCredits: (amount: number) => void;

    churchInfo: ChurchInfo;
    setChurchInfo: React.Dispatch<React.SetStateAction<ChurchInfo>>;
    agentSettings: AgentSettings;
    setAgentSettings: React.Dispatch<React.SetStateAction<AgentSettings>>;
    schedules: ScheduleItem[];
    setSchedules: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
    events: EventItem[];
    setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
    faqs: FaqItem[];
    setFaqs: React.Dispatch<React.SetStateAction<FaqItem[]>>;
    
    pastoralAvailability: PastoralAvailability[];
    addPastoralAvailability: (availability: Omit<PastoralAvailability, 'id'>) => void;
    deletePastoralAvailability: (id: string) => void;

    pastoralAgenda: PastoralAppointment[];
    addPastoralAppointment: (appointment: Omit<PastoralAppointment, 'id'>) => void;
    deletePastoralAppointment: (id: string) => void;

    websiteUrl: string;
    setWebsiteUrl: React.Dispatch<React.SetStateAction<string>>;
    instagramUrl: string;
    setInstagramUrl: React.Dispatch<React.SetStateAction<string>>;
    uploadedFiles: UploadedFile[];
    addFile: (file: Omit<UploadedFile, 'id'>) => void;
    deleteFile: (id: string) => void;
    
    isGoogleCalendarSynced: boolean;
    toggleGoogleCalendarSync: () => void;
    
    addFaq: (faq: Omit<FaqItem, 'id'>) => void;
    updateFaq: (faq: FaqItem) => void;
    deleteFaq: (id: string) => void;

    addSchedule: (schedule: Omit<ScheduleItem, 'id'>) => void;
    updateSchedule: (schedule: ScheduleItem) => void;
    deleteSchedule: (id: string) => void;

    addEvent: (event: Omit<EventItem, 'id'>) => void;
    updateEvent: (event: EventItem) => void;
    deleteEvent: (id: string) => void;

    financialInfo: FinancialInfo;
    setFinancialInfo: React.Dispatch<React.SetStateAction<FinancialInfo>>;

    prayerRequests: PrayerRequest[];
    addPrayerRequest: (request: Omit<PrayerRequest, 'id' | 'data'>) => void;
    deletePrayerRequest: (id: string) => void;

    ministries: Ministry[];
    addMinistry: (ministry: Omit<Ministry, 'id'>) => void;
    updateMinistry: (ministry: Ministry) => void;
    deleteMinistry: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const initialChurchInfo: ChurchInfo = { name: '', address: '', pastorName: '', pastorBio: '', profilePicture: '' };
const initialAgentSettings: AgentSettings = { name: '', personality: 'Amigável e prestativo' };
const initialUserInfo: UserInfo = { name: 'Gabriel Santinelli', email: 'gabriel@exemplo.com', profilePicture: '' };
const initialFinancialInfo: FinancialInfo = { banco: '', agencia: '', conta: '', chavePix: '' };


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
    const [isOnboardingComplete, setIsOnboardingCompleteState] = useState<boolean>(false);
    
    const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
    const [credits, setCredits] = useState<number>(23000);

    const [churchInfo, setChurchInfo] = useState<ChurchInfo>(initialChurchInfo);
    const [agentSettings, setAgentSettings] = useState<AgentSettings>(initialAgentSettings);
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [faqs, setFaqs] = useState<FaqItem[]>([]);
    const [pastoralAvailability, setPastoralAvailability] = useState<PastoralAvailability[]>([]);
    const [pastoralAgenda, setPastoralAgenda] = useState<PastoralAppointment[]>([]);
    const [websiteUrl, setWebsiteUrl] = useState<string>('');
    const [instagramUrl, setInstagramUrl] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isGoogleCalendarSynced, setIsGoogleCalendarSynced] = useState<boolean>(false);
    const [financialInfo, setFinancialInfo] = useState<FinancialInfo>(initialFinancialInfo);
    const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
    const [ministries, setMinistries] = useState<Ministry[]>([]);

    useEffect(() => {
        try {
            const storedAuth = localStorage.getItem('isAuthenticated');
            if (storedAuth) setIsAuthenticatedState(JSON.parse(storedAuth));
            
            const storedOnboarding = localStorage.getItem('isOnboardingComplete');
            if (storedOnboarding) setIsOnboardingCompleteState(JSON.parse(storedOnboarding));

            const storedData = localStorage.getItem('appData');
            if (storedData) {
                const data = JSON.parse(storedData);
                setUserInfo(data.userInfo || initialUserInfo);
                setCredits(data.credits !== undefined ? data.credits : 23000);
                setChurchInfo(data.churchInfo || initialChurchInfo);
                setAgentSettings(data.agentSettings || initialAgentSettings);
                setSchedules(data.schedules || []);
                setEvents(data.events || []);
                setFaqs(data.faqs || []);
                setPastoralAvailability(data.pastoralAvailability || []);
                setPastoralAgenda(data.pastoralAgenda || []);
                setWebsiteUrl(data.websiteUrl || '');
                setInstagramUrl(data.instagramUrl || '');
                setUploadedFiles(data.uploadedFiles || []);
                setIsGoogleCalendarSynced(data.isGoogleCalendarSynced || false);
                setFinancialInfo(data.financialInfo || initialFinancialInfo);
                setPrayerRequests(data.prayerRequests || []);
                setMinistries(data.ministries || []);
            }
        } catch (error) {
            console.error("Failed to load state from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            const appData = {
                userInfo, credits, churchInfo, agentSettings, schedules, events, faqs,
                pastoralAvailability, pastoralAgenda, websiteUrl, instagramUrl, uploadedFiles, isGoogleCalendarSynced,
                financialInfo, prayerRequests, ministries
            };
            localStorage.setItem('appData', JSON.stringify(appData));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }, [
        userInfo, credits, churchInfo, agentSettings, schedules, events, faqs,
        pastoralAvailability, pastoralAgenda, websiteUrl, instagramUrl, uploadedFiles, isGoogleCalendarSynced,
        financialInfo, prayerRequests, ministries
    ]);

    const setIsAuthenticated = useCallback((status: boolean) => {
        setIsAuthenticatedState(status);
        localStorage.setItem('isAuthenticated', JSON.stringify(status));
    }, []);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
    }, [setIsAuthenticated]);

    const setIsOnboardingComplete = useCallback((status: boolean) => {
        setIsOnboardingCompleteState(status);
        localStorage.setItem('isOnboardingComplete', JSON.stringify(status));
    }, []);
    
    const addCredits = useCallback((amount: number) => {
        setCredits(prev => prev + amount);
    }, []);

    const addPastoralAppointment = useCallback((appointment: Omit<PastoralAppointment, 'id'>) => setPastoralAgenda(prev => [...prev, { ...appointment, id: `${Date.now()}-${Math.random()}` }]), []);
    const deletePastoralAppointment = useCallback((id: string) => setPastoralAgenda(prev => prev.filter(a => a.id !== id)), []);

    const addFaq = useCallback((faq: Omit<FaqItem, 'id'>) => setFaqs(prev => [...prev, { ...faq, id: `${Date.now()}-${Math.random()}` }]), []);
    const updateFaq = useCallback((updated: FaqItem) => setFaqs(prev => prev.map(f => f.id === updated.id ? updated : f)), []);
    const deleteFaq = useCallback((id: string) => setFaqs(prev => prev.filter(f => f.id !== id)), []);

    const addSchedule = useCallback((schedule: Omit<ScheduleItem, 'id'>) => setSchedules(prev => [...prev, { ...schedule, id: `${Date.now()}-${Math.random()}` }]), []);
    const updateSchedule = useCallback((updated: ScheduleItem) => setSchedules(prev => prev.map(s => s.id === updated.id ? updated : s)), []);
    const deleteSchedule = useCallback((id: string) => setSchedules(prev => prev.filter(s => s.id !== id)), []);

    const addEvent = useCallback((event: Omit<EventItem, 'id'>) => setEvents(prev => [...prev, { ...event, id: `${Date.now()}-${Math.random()}` }]), []);
    const updateEvent = useCallback((updated: EventItem) => setEvents(prev => prev.map(e => e.id === updated.id ? updated : e)), []);
    const deleteEvent = useCallback((id: string) => setEvents(prev => prev.filter(e => e.id !== id)), []);
    
    const addPastoralAvailability = useCallback((availability: Omit<PastoralAvailability, 'id'>) => setPastoralAvailability(prev => [...prev, { ...availability, id: `${Date.now()}-${Math.random()}` }]), []);
    const deletePastoralAvailability = useCallback((id: string) => setPastoralAvailability(prev => prev.filter(a => a.id !== id)), []);

    const addFile = useCallback((file: Omit<UploadedFile, 'id'>) => setUploadedFiles(prev => [...prev, { ...file, id: `${Date.now()}-${Math.random()}` }]), []);
    const deleteFile = useCallback((id: string) => setUploadedFiles(prev => prev.filter(f => f.id !== id)), []);

    const addPrayerRequest = useCallback((request: Omit<PrayerRequest, 'id' | 'data'>) => {
        const newRequest = {
            ...request,
            id: `${Date.now()}-${Math.random()}`,
            data: new Date().toISOString().split('T')[0]
        };
        setPrayerRequests(prev => [newRequest, ...prev]);
        addPastoralAppointment({
            personName: request.nome,
            subject: `Pedido de oração: ${request.motivo.substring(0, 30)}${request.motivo.length > 30 ? '...' : ''}`,
            date: new Date().toISOString().split('T')[0],
            time: "N/A",
            type: 'Oração'
        });
    }, [addPastoralAppointment]);
    const deletePrayerRequest = useCallback((id: string) => setPrayerRequests(prev => prev.filter(r => r.id !== id)), []);

    const toggleGoogleCalendarSync = useCallback(() => setIsGoogleCalendarSynced(prev => !prev), []);

    const addMinistry = useCallback((ministry: Omit<Ministry, 'id'>) => setMinistries(prev => [...prev, { ...ministry, id: `${Date.now()}-${Math.random()}` }]), []);
    const updateMinistry = useCallback((updated: Ministry) => setMinistries(prev => prev.map(m => m.id === updated.id ? updated : m)), []);
    const deleteMinistry = useCallback((id: string) => setMinistries(prev => prev.filter(m => m.id !== id)), []);

    const value = useMemo<AppContextType>(() => ({
        isAuthenticated, setIsAuthenticated, logout, isOnboardingComplete, setIsOnboardingComplete,
        userInfo, setUserInfo, credits, addCredits,
        churchInfo, setChurchInfo, agentSettings, setAgentSettings, schedules, setSchedules, events, setEvents, faqs, setFaqs,
        pastoralAvailability, addPastoralAvailability, deletePastoralAvailability,
        pastoralAgenda, addPastoralAppointment, deletePastoralAppointment,
        websiteUrl, setWebsiteUrl, instagramUrl, setInstagramUrl, uploadedFiles, addFile, deleteFile, isGoogleCalendarSynced, toggleGoogleCalendarSync,
        addFaq, updateFaq, deleteFaq, addSchedule, updateSchedule, deleteSchedule, addEvent, updateEvent, deleteEvent,
        financialInfo, setFinancialInfo, prayerRequests, addPrayerRequest, deletePrayerRequest,
        ministries, addMinistry, updateMinistry, deleteMinistry
    }), [
        isAuthenticated, userInfo, credits, churchInfo, agentSettings, schedules, events, faqs,
        pastoralAvailability, pastoralAgenda, websiteUrl, instagramUrl, uploadedFiles, isGoogleCalendarSynced, financialInfo, prayerRequests, ministries,
        setIsAuthenticated, logout, setIsOnboardingComplete, setUserInfo, addCredits, setChurchInfo, setAgentSettings, setSchedules,
        setEvents, setFaqs, addPastoralAvailability, deletePastoralAvailability, addPastoralAppointment,
        deletePastoralAppointment, setWebsiteUrl, setInstagramUrl, addFile, deleteFile, toggleGoogleCalendarSync,
        addFaq, updateFaq, deleteFaq, addSchedule, updateSchedule, deleteSchedule, addEvent, updateEvent, deleteEvent,
        setFinancialInfo, addPrayerRequest, deletePrayerRequest, addMinistry, updateMinistry, deleteMinistry
    ]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};