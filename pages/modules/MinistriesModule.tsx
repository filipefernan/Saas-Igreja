import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import type { Ministry, MinistryLeader, MinistryEvent } from '../../types';
import { PageHeader, Card } from '../../components/ui/Page';
import { Input, Textarea, Button } from '../../components/ui/Forms';
import { TrashIcon, PlusIcon, UsersIcon } from '../../components/ui/Icons';

const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const MinistryForm: React.FC<{
    ministryToEdit: Ministry | null;
    onSave: (ministry: Omit<Ministry, 'id'> | Ministry) => void;
    onCancel: () => void;
}> = ({ ministryToEdit, onSave, onCancel }) => {
    const initialMinistryState: Omit<Ministry, 'id'> = {
        name: '',
        purpose: '',
        leaders: [{ id: '1', name: '', contact: '' }],
        schedule: [{ id: '1', name: '', day: 'Sábado', time: '', location: '' }],
        howToJoin: ''
    };
    
    const [ministry, setMinistry] = useState(ministryToEdit || initialMinistryState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMinistry({ ...ministry, [e.target.name]: e.target.value });
    };

    const handleDynamicChange = (
        section: 'leaders' | 'schedule',
        index: number,
        field: keyof MinistryLeader | keyof MinistryEvent,
        value: string
    ) => {
        const newSection = [...ministry[section]];
        // @ts-ignore
        newSection[index][field] = value;
        setMinistry({ ...ministry, [section]: newSection });
    };

    const addDynamicField = (section: 'leaders' | 'schedule') => {
        const newItem = section === 'leaders'
            ? { id: `${Date.now()}`, name: '', contact: '' }
            : { id: `${Date.now()}`, name: '', day: 'Sábado', time: '', location: '' };
        setMinistry({ ...ministry, [section]: [...ministry[section], newItem] });
    };
    
    const removeDynamicField = (section: 'leaders' | 'schedule', index: number) => {
        if (ministry[section].length > 1) {
            const newSection = ministry[section].filter((_, i) => i !== index);
            setMinistry({ ...ministry, [section]: newSection });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!ministry.name) {
            alert("Por favor, preencha o nome do ministério.");
            return;
        }
        onSave(ministry);
    }
    
    return (
        <div>
             <PageHeader 
                title={ministryToEdit ? 'Editar Ministério' : 'Adicionar Novo Ministério'} 
                subtitle="Preencha as informações abaixo para treinar a IA."
            />
            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Informações Gerais</h3>
                     <div>
                        <label className="block text-sm font-bold mb-2">Nome do Ministério*</label>
                        <Input name="name" value={ministry.name} onChange={handleChange} placeholder="Ex: Ministério de Louvor" required />
                    </div>
                     <div className="mt-4">
                        <label className="block text-sm font-bold mb-2">Propósito</label>
                        <Textarea name="purpose" value={ministry.purpose} onChange={handleChange} placeholder="Descreva o objetivo principal deste ministério" rows={4} />
                    </div>
                </Card>

                 <Card className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-[var(--color-text)]">Liderança</h3>
                        <Button type="button" onClick={() => addDynamicField('leaders')} className="bg-transparent border border-neutral-700 text-neutral-700 font-semibold hover:bg-neutral-50 text-sm py-1.5 px-3 flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Adicionar Líder</Button>
                    </div>
                    <div className="space-y-3">
                        {ministry.leaders.map((leader, index) => (
                            <div key={leader.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center p-3 bg-neutral-50 rounded-lg border border-[var(--color-border)]">
                                <div className="md:col-span-2"><label className="text-xs text-[var(--color-text-secondary)]">Nome do Líder</label><Input value={leader.name} onChange={e => handleDynamicChange('leaders', index, 'name', e.target.value)} placeholder="João Silva" /></div>
                                <div className="md:col-span-2"><label className="text-xs text-[var(--color-text-secondary)]">Contato (WhatsApp)</label><Input value={leader.contact} onChange={e => handleDynamicChange('leaders', index, 'contact', e.target.value)} placeholder="(11) 99999-9999"/></div>
                                <button type="button" onClick={() => removeDynamicField('leaders', index)} disabled={ministry.leaders.length <= 1} className="p-2 bg-red-100 hover:bg-red-200 rounded-md text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                    </div>
                </Card>

                 <Card className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-[var(--color-text)]">Programação</h3>
                        <Button type="button" onClick={() => addDynamicField('schedule')} className="bg-transparent border border-neutral-700 text-neutral-700 font-semibold hover:bg-neutral-50 text-sm py-1.5 px-3 flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Adicionar Evento</Button>
                    </div>
                     <div className="space-y-3">
                        {ministry.schedule.map((event, index) => (
                             <div key={event.id} className="grid grid-cols-1 md:grid-cols-10 gap-3 items-center p-3 bg-neutral-50 rounded-lg border border-[var(--color-border)]">
                                <div className="md:col-span-3"><label className="text-xs text-[var(--color-text-secondary)]">Nome do Evento</label><Input value={event.name} onChange={e => handleDynamicChange('schedule', index, 'name', e.target.value)} placeholder="Ensaio" /></div>
                                <div className="md:col-span-2"><label className="text-xs text-[var(--color-text-secondary)]">Dia</label><select value={event.day} onChange={e => handleDynamicChange('schedule', index, 'day', e.target.value)} className="w-full bg-white border border-[var(--color-border)] rounded-lg py-2 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">{weekDays.map(day => <option key={day} value={day}>{day}</option>)}</select></div>
                                <div className="md:col-span-2"><label className="text-xs text-[var(--color-text-secondary)]">Horário</label><Input type="time" value={event.time} onChange={e => handleDynamicChange('schedule', index, 'time', e.target.value)}/></div>
                                <div className="md:col-span-2"><label className="text-xs text-[var(--color-text-secondary)]">Local</label><Input value={event.location} onChange={e => handleDynamicChange('schedule', index, 'location', e.target.value)} placeholder="Sala 1"/></div>
                                <button type="button" onClick={() => removeDynamicField('schedule', index)} disabled={ministry.schedule.length <= 1} className="p-2 bg-red-100 hover:bg-red-200 rounded-md text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                     <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Como Participar</h3>
                     <Textarea name="howToJoin" value={ministry.howToJoin} onChange={handleChange} placeholder="Explique como um novo membro pode se juntar a este ministério." rows={4} />
                </Card>

                 <div className="flex justify-end gap-4 mt-8 border-t border-[var(--color-border)] pt-6">
                    <Button type="button" onClick={onCancel} className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50">Cancelar</Button>
                    <Button type="submit" disabled={!ministry.name}>Salvar Ministério</Button>
                </div>
            </form>
        </div>
    )
}

const MinistryList: React.FC<{
    onAdd: () => void;
    onEdit: (ministry: Ministry) => void;
}> = ({ onAdd, onEdit }) => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { ministries, deleteMinistry } = context;

    return (
        <div>
             <div className="flex justify-between items-start">
                <PageHeader 
                    title="Gerenciar Ministérios" 
                    subtitle="Cadastre e atualize as informações dos ministérios da sua igreja."
                />
                <Button onClick={onAdd} className="flex-shrink-0">
                    <span className="flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" />
                        Adicionar Novo Ministério
                    </span>
                </Button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ministries.length > 0 ? ministries.map(m => (
                    <Card key={m.id}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                                <UsersIcon className="w-6 h-6 text-neutral-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[var(--color-text)]">{m.name}</h3>
                                {m.leaders.length > 0 && <p className="text-sm text-[var(--color-text-secondary)]">Líder: {m.leaders[0].name}</p>}
                            </div>
                        </div>
                        <p className="text-sm text-neutral-600 line-clamp-3 my-4 h-[60px]">{m.purpose || "Nenhum propósito definido."}</p>
                        <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-4">
                            <Button onClick={() => deleteMinistry(m.id)} className="bg-transparent text-red-600 hover:bg-red-50 font-semibold text-sm px-3 py-1.5">Excluir</Button>
                            <Button onClick={() => onEdit(m)} className="text-sm px-3 py-1.5">Editar</Button>
                        </div>
                    </Card>
                )) : (
                     <div className="md:col-span-2 lg:col-span-3 text-center py-16 border-2 border-dashed border-neutral-300 rounded-lg">
                        <UsersIcon className="w-12 h-12 text-neutral-400 mx-auto" />
                        <h3 className="text-xl font-bold text-neutral-700 mt-4">Nenhum ministério cadastrado</h3>
                        <p className="text-neutral-500">Clique em "Adicionar Novo Ministério" para começar.</p>
                    </div>
                )}
            </div>
        </div>
    )
}


const MinistriesModule: React.FC = () => {
    const context = useContext(AppContext);
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);

    if (!context) return null;
    const { addMinistry, updateMinistry } = context;

    const handleAddClick = () => {
        setEditingMinistry(null);
        setView('form');
    };
    
    const handleEditClick = (ministry: Ministry) => {
        setEditingMinistry(ministry);
        setView('form');
    };

    const handleCancel = () => {
        setEditingMinistry(null);
        setView('list');
    };

    const handleSave = (ministryData: Omit<Ministry, 'id'> | Ministry) => {
        if ('id' in ministryData) {
            updateMinistry(ministryData as Ministry);
        } else {
            addMinistry(ministryData);
        }
        handleCancel();
    };
    
    return (
        <div key={view} className="animate-fade-in">
            {view === 'list' && <MinistryList onAdd={handleAddClick} onEdit={handleEditClick} />}
            {view === 'form' && <MinistryForm ministryToEdit={editingMinistry} onSave={handleSave} onCancel={handleCancel} />}
        </div>
    );
};

export default MinistriesModule;