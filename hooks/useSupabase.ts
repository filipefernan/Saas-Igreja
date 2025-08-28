import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentChurchUser } from '../services/supabase';
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

// ========================================
// HOOK: useAuth
// ========================================
export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [churchUser, setChurchUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial user
        const getInitialUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            
            if (user) {
                const churchUserData = await getCurrentChurchUser();
                setChurchUser(churchUserData);
            }
            
            setLoading(false);
        };

        getInitialUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                
                if (session?.user) {
                    const churchUserData = await getCurrentChurchUser();
                    setChurchUser(churchUserData);
                } else {
                    setChurchUser(null);
                }
                
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    return {
        user,
        churchUser,
        loading,
        isAuthenticated: !!user,
        signOut
    };
};

// ========================================
// HOOK: useChurchData
// ========================================
export const useChurchData = (churchUser: any) => {
    const [churchInfo, setChurchInfo] = useState<ChurchInfo | null>(null);
    const [agentSettings, setAgentSettings] = useState<AgentSettings | null>(null);
    const [financialInfo, setFinancialInfo] = useState<FinancialInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!churchUser) {
            setLoading(false);
            return;
        }

        const fetchChurchData = async () => {
            setLoading(true);
            try {
                // Fetch church info
                const { data: church } = await supabase
                    .from('churches')
                    .select('*')
                    .eq('id', churchUser.church_id)
                    .single();

                if (church) {
                    setChurchInfo({
                        name: church.name,
                        address: church.address || '',
                        pastorName: church.pastor_name || '',
                        pastorBio: church.pastor_bio || '',
                        profilePicture: church.profile_picture || ''
                    });
                }

                // Fetch agent settings
                const { data: agent } = await supabase
                    .from('agent_settings')
                    .select('*')
                    .eq('church_id', churchUser.church_id)
                    .single();

                if (agent) {
                    setAgentSettings({
                        name: agent.name,
                        personality: agent.personality
                    });
                }

                // Fetch financial info
                const { data: financial } = await supabase
                    .from('financial_info')
                    .select('*')
                    .eq('church_id', churchUser.church_id)
                    .single();

                if (financial) {
                    setFinancialInfo({
                        banco: financial.banco || '',
                        agencia: financial.agencia || '',
                        conta: financial.conta || '',
                        chavePix: financial.chave_pix || ''
                    });
                }

            } catch (error) {
                console.error('Error fetching church data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChurchData();
    }, [churchUser]);

    const updateChurchInfo = useCallback(async (newInfo: Partial<ChurchInfo>) => {
        if (!churchUser) return;

        try {
            const { error } = await supabase
                .from('churches')
                .update({
                    name: newInfo.name,
                    address: newInfo.address,
                    pastor_name: newInfo.pastorName,
                    pastor_bio: newInfo.pastorBio,
                    profile_picture: newInfo.profilePicture
                })
                .eq('id', churchUser.church_id);

            if (!error && churchInfo) {
                setChurchInfo({ ...churchInfo, ...newInfo });
            }
        } catch (error) {
            console.error('Error updating church info:', error);
        }
    }, [churchUser, churchInfo]);

    const updateAgentSettings = useCallback(async (newSettings: Partial<AgentSettings>) => {
        if (!churchUser) return;

        try {
            const { error } = await supabase
                .from('agent_settings')
                .update({
                    name: newSettings.name,
                    personality: newSettings.personality
                })
                .eq('church_id', churchUser.church_id);

            if (!error && agentSettings) {
                setAgentSettings({ ...agentSettings, ...newSettings });
            }
        } catch (error) {
            console.error('Error updating agent settings:', error);
        }
    }, [churchUser, agentSettings]);

    const updateFinancialInfo = useCallback(async (newInfo: Partial<FinancialInfo>) => {
        if (!churchUser) return;

        try {
            const { error } = await supabase
                .from('financial_info')
                .update({
                    banco: newInfo.banco,
                    agencia: newInfo.agencia,
                    conta: newInfo.conta,
                    chave_pix: newInfo.chavePix
                })
                .eq('church_id', churchUser.church_id);

            if (!error && financialInfo) {
                setFinancialInfo({ ...financialInfo, ...newInfo });
            }
        } catch (error) {
            console.error('Error updating financial info:', error);
        }
    }, [churchUser, financialInfo]);

    return {
        churchInfo,
        agentSettings,
        financialInfo,
        loading,
        updateChurchInfo,
        updateAgentSettings,
        updateFinancialInfo
    };
};

// ========================================
// HOOK: useSchedules
// ========================================
export const useSchedules = (churchUser: any) => {
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!churchUser) {
            setLoading(false);
            return;
        }

        const fetchSchedules = async () => {
            try {
                const { data, error } = await supabase
                    .from('schedules')
                    .select('*')
                    .eq('church_id', churchUser.church_id)
                    .order('day', { ascending: true });

                if (data) {
                    setSchedules(data.map(item => ({
                        id: item.id.toString(),
                        day: item.day,
                        time: item.time,
                        description: item.description
                    })));
                }
            } catch (error) {
                console.error('Error fetching schedules:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, [churchUser]);

    const addSchedule = useCallback(async (schedule: Omit<ScheduleItem, 'id'>) => {
        if (!churchUser) return;

        try {
            const { data, error } = await supabase
                .from('schedules')
                .insert({
                    church_id: churchUser.church_id,
                    day: schedule.day,
                    time: schedule.time,
                    description: schedule.description
                })
                .select()
                .single();

            if (data) {
                const newSchedule = {
                    id: data.id.toString(),
                    day: data.day,
                    time: data.time,
                    description: data.description
                };
                setSchedules(prev => [...prev, newSchedule]);
            }
        } catch (error) {
            console.error('Error adding schedule:', error);
        }
    }, [churchUser]);

    const updateSchedule = useCallback(async (schedule: ScheduleItem) => {
        try {
            const { error } = await supabase
                .from('schedules')
                .update({
                    day: schedule.day,
                    time: schedule.time,
                    description: schedule.description
                })
                .eq('id', parseInt(schedule.id));

            if (!error) {
                setSchedules(prev => prev.map(s => s.id === schedule.id ? schedule : s));
            }
        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    }, []);

    const deleteSchedule = useCallback(async (id: string) => {
        try {
            const { error } = await supabase
                .from('schedules')
                .delete()
                .eq('id', parseInt(id));

            if (!error) {
                setSchedules(prev => prev.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    }, []);

    return {
        schedules,
        loading,
        addSchedule,
        updateSchedule,
        deleteSchedule
    };
};

// ========================================
// HOOK: useEvents
// ========================================
export const useEvents = (churchUser: any) => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!churchUser) {
            setLoading(false);
            return;
        }

        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .eq('church_id', churchUser.church_id)
                    .order('start_date', { ascending: true });

                if (data) {
                    setEvents(data.map(item => ({
                        id: item.id.toString(),
                        name: item.name,
                        date: item.start_date,
                        endDate: item.end_date || undefined,
                        description: item.description || ''
                    })));
                }
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [churchUser]);

    const addEvent = useCallback(async (event: Omit<EventItem, 'id'>) => {
        if (!churchUser) return;

        try {
            const { data, error } = await supabase
                .from('events')
                .insert({
                    church_id: churchUser.church_id,
                    name: event.name,
                    description: event.description,
                    start_date: event.date,
                    end_date: event.endDate || null
                })
                .select()
                .single();

            if (data) {
                const newEvent = {
                    id: data.id.toString(),
                    name: data.name,
                    date: data.start_date,
                    endDate: data.end_date || undefined,
                    description: data.description || ''
                };
                setEvents(prev => [...prev, newEvent]);
            }
        } catch (error) {
            console.error('Error adding event:', error);
        }
    }, [churchUser]);

    const updateEvent = useCallback(async (event: EventItem) => {
        try {
            const { error } = await supabase
                .from('events')
                .update({
                    name: event.name,
                    description: event.description,
                    start_date: event.date,
                    end_date: event.endDate || null
                })
                .eq('id', parseInt(event.id));

            if (!error) {
                setEvents(prev => prev.map(e => e.id === event.id ? event : e));
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    }, []);

    const deleteEvent = useCallback(async (id: string) => {
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', parseInt(id));

            if (!error) {
                setEvents(prev => prev.filter(e => e.id !== id));
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    }, []);

    return {
        events,
        loading,
        addEvent,
        updateEvent,
        deleteEvent
    };
};

// ========================================
// HOOK: usePrayerRequests
// ========================================
export const usePrayerRequests = (churchUser: any) => {
    const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!churchUser) {
            setLoading(false);
            return;
        }

        const fetchPrayerRequests = async () => {
            try {
                const { data, error } = await supabase
                    .from('prayer_requests')
                    .select('*')
                    .eq('church_id', churchUser.church_id)
                    .order('created_at', { ascending: false });

                if (data) {
                    setPrayerRequests(data.map(item => ({
                        id: item.id.toString(),
                        nome: item.nome,
                        contato: item.contato || '',
                        motivo: item.motivo,
                        data: item.created_at.split('T')[0] // Extract date part
                    })));
                }
            } catch (error) {
                console.error('Error fetching prayer requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrayerRequests();
    }, [churchUser]);

    const addPrayerRequest = useCallback(async (request: Omit<PrayerRequest, 'id' | 'data'>) => {
        if (!churchUser) return;

        try {
            const { data, error } = await supabase
                .from('prayer_requests')
                .insert({
                    church_id: churchUser.church_id,
                    nome: request.nome,
                    contato: request.contato,
                    motivo: request.motivo
                })
                .select()
                .single();

            if (data) {
                const newRequest = {
                    id: data.id.toString(),
                    nome: data.nome,
                    contato: data.contato || '',
                    motivo: data.motivo,
                    data: data.created_at.split('T')[0]
                };
                setPrayerRequests(prev => [newRequest, ...prev]);
            }
        } catch (error) {
            console.error('Error adding prayer request:', error);
        }
    }, [churchUser]);

    const deletePrayerRequest = useCallback(async (id: string) => {
        try {
            const { error } = await supabase
                .from('prayer_requests')
                .delete()
                .eq('id', parseInt(id));

            if (!error) {
                setPrayerRequests(prev => prev.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error('Error deleting prayer request:', error);
        }
    }, []);

    return {
        prayerRequests,
        loading,
        addPrayerRequest,
        deletePrayerRequest
    };
};