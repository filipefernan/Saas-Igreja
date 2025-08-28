import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import type { FaqItem } from '../../types';
import { PageHeader, Card } from '../../components/ui/Page';
import { Input, Textarea, Button } from '../../components/ui/Forms';
import { TrashIcon } from '../../components/ui/Icons';

const AddFaqModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (faqs: Omit<FaqItem, 'id'>[]) => void;
}> = ({ isOpen, onClose, onSave }) => {
    if (!isOpen) return null;

    const [faqs, setFaqs] = useState<Omit<FaqItem, 'id'>[]>([{ question: '', answer: '' }]);

    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        const newFaqs = [...faqs];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setFaqs(newFaqs);
    };

    const addFaqField = () => {
        setFaqs([...faqs, { question: '', answer: '' }]);
    };

    const removeFaqField = (index: number) => {
        if (faqs.length > 1) {
            setFaqs(faqs.filter((_, i) => i !== index));
        }
    };

    const handleSave = () => {
        const validFaqs = faqs.filter(f => f.question && f.answer);
        if (validFaqs.length > 0) {
            onSave(validFaqs);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-2xl w-full max-w-3xl relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-6">Adicionar Perguntas Frequentes</h3>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 text-3xl leading-none">&times;</button>
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4 mb-4">
                    {faqs.map((f, index) => (
                         <div key={index} className="bg-neutral-50 border border-[var(--color-border)] p-4 rounded-lg space-y-3 animate-fade-in relative">
                            <button type="button" onClick={() => removeFaqField(index)} disabled={faqs.length <= 1} className="absolute top-3 right-3 p-1 bg-red-100 hover:bg-red-200 rounded-md text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <TrashIcon className="w-4 h-4"/>
                            </button>
                            <div>
                                <label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Pergunta</label>
                                <Input value={f.question} onChange={e => handleFaqChange(index, 'question', e.target.value)} placeholder="Ex: Crianças podem participar dos cultos?" required />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Resposta</label>
                                <Textarea value={f.answer} onChange={e => handleFaqChange(index, 'answer', e.target.value)} placeholder="Ex: Sim, temos um espaço especial para crianças..." required rows={3} />
                            </div>
                        </div>
                    ))}
                </div>
                <Button type="button" onClick={addFaqField} className="bg-transparent border border-neutral-700 text-neutral-700 font-semibold hover:bg-neutral-50">+ Adicionar outra pergunta</Button>
                <div className="flex justify-end gap-4 mt-6 border-t border-[var(--color-border)] pt-4">
                    <Button type="button" onClick={onClose} className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50">Cancelar</Button>
                    <Button type="button" onClick={handleSave}>Salvar Perguntas</Button>
                </div>
            </div>
        </div>
    );
};


const FaqModule: React.FC = () => {
    const context = useContext(AppContext);
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

    if (!context) return null;
    const { faqs, addFaq, deleteFaq } = context;

    const handleSaveFaqs = (newFaqs: Omit<FaqItem, 'id'>[]) => {
        newFaqs.forEach(faq => addFaq(faq));
    };
    
    return (
        <>
            <div className="max-w-5xl mx-auto animate-fade-in">
                <PageHeader title="Perguntas Frequentes" subtitle="Adicione e gerencie as perguntas e respostas que treinarão seu agente." />
                
                 <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-[var(--color-text)]">Perguntas e Respostas</h3>
                        <Button onClick={() => setIsFaqModalOpen(true)}>Adicionar Perguntas</Button>
                    </div>
                    <div className="space-y-4">
                        {faqs.length > 0 ? faqs.map((faq: FaqItem) => (
                            <div key={faq.id} className="bg-neutral-50 border border-[var(--color-border)] p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div className="pr-4">
                                        <p className="font-bold text-[var(--color-text)]"><span className="font-semibold text-neutral-500 mr-2">P:</span>{faq.question}</p>
                                        <p className="text-[var(--color-text-secondary)] mt-2 whitespace-pre-wrap"><span className="font-semibold text-neutral-500 mr-2">R:</span>{faq.answer}</p>
                                    </div>
                                    <button onClick={() => deleteFaq(faq.id)} className="text-red-600 hover:text-red-800 font-semibold transition-colors flex-shrink-0 ml-4">Excluir</button>
                                </div>
                            </div>
                        )) : <p className="text-neutral-500 text-center py-4">Nenhuma pergunta frequente adicionada ainda.</p>}
                    </div>
                </Card>
            </div>
            <AddFaqModal isOpen={isFaqModalOpen} onClose={() => setIsFaqModalOpen(false)} onSave={handleSaveFaqs} />
        </>
    )
}

export default FaqModule;