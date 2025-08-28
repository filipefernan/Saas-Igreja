import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { PageHeader, Card } from '../../components/ui/Page';
import { TrashIcon, UserIcon, MailIcon, PhoneIcon } from '../../components/ui/Icons';
import type { PrayerRequest } from '../../types';

const PrayerRequestsModule: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { prayerRequests, deletePrayerRequest } = context;

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('pt-BR', {
                timeZone: 'UTC',
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };
    
    const isEmail = (contact: string) => contact.includes('@');

    return (
        <div className="animate-fade-in">
            <PageHeader title="Pedidos de Oração" subtitle="Visualize os pedidos de oração recebidos através do assistente de IA." />
            <Card>
                <div className="space-y-4">
                    {prayerRequests.length > 0 ? prayerRequests.map((request: PrayerRequest) => (
                        <div key={request.id} className="bg-neutral-50 border border-[var(--color-border)] p-4 rounded-lg animate-fade-in">
                            <div className="flex justify-between items-start">
                                <div className="pr-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <UserIcon className="w-5 h-5 text-neutral-500" />
                                        <p className="font-bold text-[var(--color-text)]">{request.nome}</p>
                                    </div>
                                    {request.contato && (
                                        <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] mb-3">
                                            {isEmail(request.contato) ? <MailIcon className="w-5 h-5 text-neutral-500" /> : <PhoneIcon className="w-5 h-5 text-neutral-500" />}
                                            <p>{request.contato}</p>
                                        </div>
                                    )}
                                    <p className="text-[var(--color-text-secondary)] mt-2 whitespace-pre-wrap">
                                        <span className="font-semibold text-neutral-600">Motivo:</span> {request.motivo}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                     <p className="text-xs text-neutral-400 mb-2">{formatDate(request.data)}</p>
                                    <button onClick={() => deletePrayerRequest(request.id)} className="text-red-500 hover:text-red-700 font-semibold transition-colors p-2 rounded-full hover:bg-red-100">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-neutral-500 text-center py-8">Nenhum pedido de oração recebido ainda.</p>}
                </div>
            </Card>
        </div>
    );
};

export default PrayerRequestsModule;