import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { PageHeader, Card } from '../../components/ui/Page';
import { Input, Button } from '../../components/ui/Forms';
import { TrashIcon, PrayerIcon } from '../../components/ui/Icons';
import type { PastoralAvailability } from '../../types';

const weekDays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

const AgendaModule: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    
    const { pastoralAvailability, addPastoralAvailability, deletePastoralAvailability, pastoralAgenda, isGoogleCalendarSynced } = context;

    const [newAvailability, setNewAvailability] = useState({ day: 'Segunda-feira', startTime: '09:00', endTime: '18:00' });

    const handleAddAvailability = (e: React.FormEvent) => {
        e.preventDefault();
        addPastoralAvailability(newAvailability);
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Agenda Pastoral" subtitle="Defina seus horários de atendimento e gerencie os agendamentos." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Disponibilidade para Aconselhamento</h3>
                    {!isGoogleCalendarSynced && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-lg p-3 mb-4">
                           Para uma melhor gestão, conecte sua agenda com o Google Calendar na aba 'Integrações'.
                        </div>
                    )}
                    <form onSubmit={handleAddAvailability} className="bg-neutral-50 border border-[var(--color-border)] p-4 rounded-lg mb-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs text-[var(--color-text-secondary)]">Dia da Semana</label>
                                <select value={newAvailability.day} onChange={e => setNewAvailability({...newAvailability, day: e.target.value})} className="w-full bg-white border border-[var(--color-border)] rounded-lg py-2 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                                    {weekDays.map(day => <option key={day} value={day}>{day}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-[var(--color-text-secondary)]">Início</label>
                                <Input type="time" value={newAvailability.startTime} onChange={e => setNewAvailability({...newAvailability, startTime: e.target.value})} required />
                            </div>
                            <div>
                                <label className="text-xs text-[var(--color-text-secondary)]">Fim</label>
                                <Input type="time" value={newAvailability.endTime} onChange={e => setNewAvailability({...newAvailability, endTime: e.target.value})} required />
                            </div>
                        </div>
                         <div className="flex justify-end">
                            <Button type="submit">Adicionar</Button>
                        </div>
                    </form>
                    <div className="space-y-3">
                        {pastoralAvailability.length > 0 ? pastoralAvailability.map((item: PastoralAvailability) => (
                            <div key={item.id} className="bg-neutral-50 border border-[var(--color-border)] p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-[var(--color-text)]">{item.day}</p>
                                    <p className="text-[var(--color-text-secondary)] text-sm">{item.startTime} - {item.endTime}</p>
                                </div>
                                <button onClick={() => deletePastoralAvailability(item.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full transition-colors">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        )) : <p className="text-neutral-500 text-center py-4">Nenhum horário de disponibilidade adicionado.</p>}
                    </div>
                </Card>

                <Card>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Próximos Agendamentos</h3>
                     <div className="space-y-3">
                        {pastoralAgenda.length > 0 ? pastoralAgenda.map(item => (
                            <div key={item.id} className="bg-neutral-50 border border-[var(--color-border)] p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-[var(--color-text)]">{item.personName}</p>
                                        <p className="text-[var(--color-text-secondary)] text-sm">
                                            {item.type === 'Aconselhamento' 
                                                ? `${new Date(item.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} às ${item.time}`
                                                : `${new Date(item.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}`
                                            }
                                        </p>
                                        <p className="text-neutral-500 text-sm mt-1">
                                            {item.type === 'Aconselhamento' ? 'Assunto: ' : ''}{item.subject}
                                        </p>
                                    </div>
                                    {item.type === 'Oração' && (
                                        <div className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0">
                                            <PrayerIcon className="w-4 h-4" />
                                            <span>Oração</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : <p className="text-neutral-500 text-center py-4">Nenhum aconselhamento agendado.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};
export default AgendaModule;