import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import type { ScheduleItem, EventItem } from '../../types';
import { PageHeader, Card } from '../../components/ui/Page';
import { Input, Textarea, Button } from '../../components/ui/Forms';
import { TrashIcon, CalendarIcon } from '../../components/ui/Icons';

const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

// Modal for Adding Fixed Schedules
const AddScheduleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (schedules: Omit<ScheduleItem, 'id'>[]) => void;
}> = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;

    const [schedules, setSchedules] = useState<(Omit<ScheduleItem, 'id' | 'day'> & { day: string })[]>([{ description: '', day: 'Domingo', time: '' }]);

    const handleScheduleChange = (index: number, field: string, value: string) => {
        const newSchedules = [...schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setSchedules(newSchedules);
    };

    const addScheduleField = () => {
        setSchedules([...schedules, { description: '', day: 'Domingo', time: '' }]);
    };

    const removeScheduleField = (index: number) => {
        if (schedules.length > 1) {
            setSchedules(schedules.filter((_, i) => i !== index));
        }
    };

    const handleSave = () => {
        const validSchedules = schedules.filter(s => s.description && s.day && s.time);
        if (validSchedules.length > 0) {
            onSave(validSchedules);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-2xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-6">Adicionar Programação Fixa</h3>
                <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 text-3xl leading-none">&times;</button>
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 mb-4">
                    {schedules.map((s, index) => (
                        <div key={index} className="bg-neutral-50 p-4 rounded-lg flex items-end gap-3 animate-fade-in border border-[var(--color-border)]">
                            <div className="flex-grow"><label className="text-xs text-[var(--color-text-secondary)]">Descrição</label><Input value={s.description} onChange={e => handleScheduleChange(index, 'description', e.target.value)} placeholder="Ex: Culto da Manhã" required /></div>
                            <div><label className="text-xs text-[var(--color-text-secondary)]">Dia</label><select value={s.day} onChange={e => handleScheduleChange(index, 'day', e.target.value)} className="w-full bg-white border border-[var(--color-border)] rounded-lg py-2 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">{weekDays.map(day => <option key={day} value={day}>{day}</option>)}</select></div>
                            <div><label className="text-xs text-[var(--color-text-secondary)]">Horário</label><Input type="time" value={s.time} onChange={e => handleScheduleChange(index, 'time', e.target.value)} required /></div>
                            <button onClick={() => removeScheduleField(index)} disabled={schedules.length <= 1} className="p-2 bg-red-100 hover:bg-red-200 rounded-md text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    ))}
                </div>
                <Button onClick={addScheduleField} className="bg-transparent border border-neutral-700 text-neutral-700 font-semibold hover:bg-neutral-50">+ Adicionar outro horário</Button>
                <div className="flex justify-end gap-4 mt-6 border-t border-[var(--color-border)] pt-4">
                    <Button onClick={onClose} className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50">Cancelar</Button>
                    <Button onClick={handleSave}>Salvar Horários</Button>
                </div>
            </div>
        </div>
    );
};

// Modal for Adding Special Events
const AddEventModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Omit<EventItem, 'id'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;

    const [newEvent, setNewEvent] = useState({ name: '', description: '', date: '', endDate: '', isMultiDay: false });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const { isMultiDay, ...eventData } = newEvent;
        if (!eventData.name || !eventData.date || !eventData.description) return;
        
        const finalEvent: Omit<EventItem, 'id'> = {
            name: eventData.name,
            description: eventData.description,
            date: eventData.date,
        };

        if (isMultiDay && eventData.endDate) {
            finalEvent.endDate = eventData.endDate;
        }

        onSave(finalEvent);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-2xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-6">Adicionar Evento Especial</h3>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 text-3xl leading-none">&times;</button>
                <div className="space-y-4">
                    <div><label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Nome do Evento</label><Input value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} placeholder="Ex: Congresso de Jovens" required /></div>
                    <div><label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Descrição</label><Textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Um dia de louvor, adoração e palavra." required /></div>
                    <div className="flex items-center gap-2 text-[var(--color-text-secondary)]"><input type="checkbox" id="isMultiDay" checked={newEvent.isMultiDay} onChange={e => setNewEvent({...newEvent, isMultiDay: e.target.checked})} className="w-4 h-4 bg-neutral-100 border-neutral-300 rounded text-[var(--color-text)] focus:ring-[var(--color-accent)]" /><label htmlFor="isMultiDay">Este evento dura mais de um dia</label></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-bold text-[var(--color-text)] mb-1 block">{newEvent.isMultiDay ? 'Data de Início' : 'Data'}</label>
                            <div className="relative">
                                <Input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} required className="pr-10"/>
                                <CalendarIcon className="w-5 h-5 text-neutral-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                        {newEvent.isMultiDay && 
                            <div className="animate-fade-in">
                                <label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Data de Fim</label>
                                <div className="relative">
                                    <Input type="date" value={newEvent.endDate} onChange={e => setNewEvent({...newEvent, endDate: e.target.value})} required={newEvent.isMultiDay} className="pr-10"/>
                                    <CalendarIcon className="w-5 h-5 text-neutral-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-6 border-t border-[var(--color-border)] pt-4">
                    <Button type="button" onClick={onClose} className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50">Cancelar</Button>
                    <Button type="submit">Adicionar Evento</Button>
                </div>
            </form>
        </div>
    );
};

const EventsModule: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { 
        schedules, addSchedule, deleteSchedule,
        events, addEvent, deleteEvent 
    } = context;

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

    const handleSaveSchedules = (newSchedules: Omit<ScheduleItem, 'id'>[]) => {
        newSchedules.forEach(schedule => addSchedule(schedule));
    };

    const handleSaveEvent = (newEvent: Omit<EventItem, 'id'>) => {
        addEvent(newEvent);
    };

    const formatEventDate = (event: EventItem) => {
        const options: Intl.DateTimeFormatOptions = { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' };
        try {
            const startDate = new Date(event.date).toLocaleDateString('pt-BR', options);
            if (event.endDate) {
                const endDate = new Date(event.endDate).toLocaleDateString('pt-BR', options);
                return `${startDate} a ${endDate}`;
            }
            return startDate;
        } catch (e) {
            return event.date; // Fallback for invalid date format
        }
    };
    
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <>
            <div className="animate-fade-in">
                <PageHeader title="Cultos e Eventos" subtitle="Gerencie a programação fixa e os eventos especiais da sua igreja." />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[var(--color-text)]">Programação Fixa</h3>
                            <Button onClick={() => setIsScheduleModalOpen(true)}>Adicionar Horário</Button>
                        </div>
                        <div className="space-y-3">
                            {schedules.length > 0 ? schedules.map((item: ScheduleItem) => (
                                <div key={item.id} className="bg-neutral-50 border border-[var(--color-border)] p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-[var(--color-text)]">{item.description}</p>
                                        <p className="text-[var(--color-text-secondary)] text-sm">{item.day} às {item.time}</p>
                                    </div>
                                    <button onClick={() => deleteSchedule(item.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors">Excluir</button>
                                </div>
                            )) : <p className="text-neutral-500 text-center py-4">Nenhuma programação fixa adicionada.</p>}
                        </div>
                    </Card>

                    <Card>
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[var(--color-text)]">Eventos Especiais</h3>
                            <Button onClick={() => setIsEventModalOpen(true)}>Adicionar Evento</Button>
                        </div>
                         <div className="space-y-3">
                            {sortedEvents.length > 0 ? sortedEvents.map((item: EventItem) => (
                                <div key={item.id} className="bg-neutral-50 border border-[var(--color-border)] p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-[var(--color-text)]">{item.name}</p>
                                        <p className="text-[var(--color-text-secondary)] text-sm">{formatEventDate(item)}</p>
                                        <p className="text-neutral-500 text-xs mt-1">{item.description}</p>
                                    </div>
                                    <button onClick={() => deleteEvent(item.id)} className="text-red-600 hover:text-red-800 text-sm font-semibold transition-colors ml-4">Excluir</button>
                                </div>
                            )) : <p className="text-neutral-500 text-center py-4">Nenhum evento especial adicionado.</p>}
                        </div>
                    </Card>
                </div>
            </div>

            <AddScheduleModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} onSave={handleSaveSchedules} />
            <AddEventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} onSave={handleSaveEvent} />
        </>
    );
};
export default EventsModule;