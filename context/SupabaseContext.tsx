import React, { createContext, useContext, ReactNode } from 'react';
import { 
    useAuth, 
    useChurchData, 
    useSchedules, 
    useEvents, 
    usePrayerRequests 
} from '../hooks/useSupabase';
import type { 
    ChurchInfo, 
    AgentSettings, 
    ScheduleItem, 
    EventItem, 
    FaqItem, 
    PastoralAvailability, 
    PastoralAppointment, 
    UploadedFile, 
    FinancialInfo, 
    PrayerRequest, 
    Ministry 
} from '../types';

interface SupabaseContextType {
    // Auth
    user: any;
    churchUser: any;
    isAuthenticated: boolean;
    authLoading: boolean;
    signOut: () => Promise<void>;

    // Church Data
    churchInfo: ChurchInfo | null;
    agentSettings: AgentSettings | null;
    financialInfo: FinancialInfo | null;
    updateChurchInfo: (info: Partial<ChurchInfo>) => Promise<void>;
    updateAgentSettings: (settings: Partial<AgentSettings>) => Promise<void>;
    updateFinancialInfo: (info: Partial<FinancialInfo>) => Promise<void>;

    // Schedules
    schedules: ScheduleItem[];
    addSchedule: (schedule: Omit<ScheduleItem, 'id'>) => Promise<void>;
    updateSchedule: (schedule: ScheduleItem) => Promise<void>;
    deleteSchedule: (id: string) => Promise<void>;

    // Events
    events: EventItem[];
    addEvent: (event: Omit<EventItem, 'id'>) => Promise<void>;
    updateEvent: (event: EventItem) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;

    // Prayer Requests
    prayerRequests: PrayerRequest[];
    addPrayerRequest: (request: Omit<PrayerRequest, 'id' | 'data'>) => Promise<void>;
    deletePrayerRequest: (id: string) => Promise<void>;

    // Loading states
    dataLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const useSupabaseContext = () => {
    const context = useContext(SupabaseContext);
    if (!context) {
        throw new Error('useSupabaseContext must be used within a SupabaseProvider');
    }
    return context;
};

export const SupabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Auth hook
    const { user, churchUser, loading: authLoading, isAuthenticated, signOut } = useAuth();
    
    // Church data hooks
    const {
        churchInfo,
        agentSettings, 
        financialInfo,
        loading: churchDataLoading,
        updateChurchInfo,
        updateAgentSettings,
        updateFinancialInfo
    } = useChurchData(churchUser);

    // Schedules hook
    const {
        schedules,
        loading: schedulesLoading,
        addSchedule,
        updateSchedule,
        deleteSchedule
    } = useSchedules(churchUser);

    // Events hook
    const {
        events,
        loading: eventsLoading,
        addEvent,
        updateEvent,
        deleteEvent
    } = useEvents(churchUser);

    // Prayer requests hook
    const {
        prayerRequests,
        loading: prayerLoading,
        addPrayerRequest,
        deletePrayerRequest
    } = usePrayerRequests(churchUser);

    // Combined loading state
    const dataLoading = churchDataLoading || schedulesLoading || eventsLoading || prayerLoading;

    const value: SupabaseContextType = {
        // Auth
        user,
        churchUser,
        isAuthenticated,
        authLoading,
        signOut,

        // Church Data
        churchInfo,
        agentSettings,
        financialInfo,
        updateChurchInfo,
        updateAgentSettings,
        updateFinancialInfo,

        // Schedules
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,

        // Events
        events,
        addEvent,
        updateEvent,
        deleteEvent,

        // Prayer Requests
        prayerRequests,
        addPrayerRequest,
        deletePrayerRequest,

        // Loading
        dataLoading
    };

    return (
        <SupabaseContext.Provider value={value}>
            {children}
        </SupabaseContext.Provider>
    );
};