import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import type { ChurchInfo, AgentSettings, ScheduleItem } from '../types';
import { generateProfilePicture } from '../services/geminiService';
import { onboardingService } from '../services/api.js';
import { SparklesIcon, BuildingIcon } from '../components/ui/Icons';

// Reusable components for the onboarding UI
const OnboardingWrapper: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-[var(--color-text)] text-center">{title}</h1>
        <p className="text-[var(--color-text-secondary)] text-center mt-2 mb-10">{subtitle}</p>
        <div className="bg-white p-8 rounded-xl border border-[var(--color-border)] shadow-sm">
            {children}
        </div>
    </div>
);

const InputField: React.FC<{ label: string } & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, ...props }) => (
    <div className="mb-6">
        <label className="block text-[var(--color-text)] text-sm font-bold mb-2">{label}</label>
        <input className="w-full bg-white border border-[var(--color-border)] rounded-lg py-3 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-neutral-400 transition-all" {...props} />
    </div>
);

const TextAreaField: React.FC<{ label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ label, ...props }) => (
    <div className="mb-6">
        <label className="block text-[var(--color-text)] text-sm font-bold mb-2">{label}</label>
        <textarea className="w-full bg-white border border-[var(--color-border)] rounded-lg py-3 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-neutral-400 transition-all" {...props} />
    </div>
);


const Onboarding: React.FC = () => {
    const context = useContext(AppContext);
    const [step, setStep] = useState(1);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    
    const weekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    const [churchData, setChurchData] = useState<ChurchInfo>({ name: '', address: '', pastorName: '', pastorBio: '', profilePicture: '' });
    const [agentData, setAgentData] = useState<AgentSettings>({ name: '', personality: 'Amigável e prestativo' });
    const [schedules, setSchedules] = useState<Partial<ScheduleItem>[]>([{ day: 'Domingo', time: '', description: '' }]);

    if (!context) return null;
    const { setIsOnboardingComplete, setChurchInfo, setAgentSettings, setSchedules: setGlobalSchedules } = context;

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleChurchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChurchData({ ...churchData, [e.target.name]: e.target.value });
    };
    
    const handleAgentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAgentData({ ...agentData, [e.target.name]: e.target.value });
    };

    const handleScheduleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newSchedules = [...schedules];
        newSchedules[index] = { ...newSchedules[index], [e.target.name]: e.target.value };
        setSchedules(newSchedules);
    };

    const addSchedule = () => {
        setSchedules([...schedules, { day: 'Domingo', time: '', description: '' }]);
    };

    const handleGenerateImage = async () => {
        setIsGeneratingImage(true);
        const prompt = `logo for a church named ${churchData.name}, modern, simple, welcoming`;
        const url = await generateProfilePicture(prompt);
        setChurchData({...churchData, profilePicture: url});
        setIsGeneratingImage(false);
    };

    const handleFinish = async () => {
        try {
            console.log('🚀 Iniciando finalização do onboarding...');
            
            // Preparar dados para envio
            const finalSchedules = schedules
                .filter(s => s.day && s.time && s.description)
                .map(s => ({
                    day: s.day,
                    time: s.time,
                    description: s.description
                }));

            const dadosOnboarding = {
                dadosIgreja: {
                    name: churchData.name,
                    address: churchData.address,
                    pastorName: churchData.pastorName,
                    pastorBio: churchData.pastorBio,
                    profilePicture: churchData.profilePicture,
                    websiteUrl: '',
                    instagramUrl: ''
                },
                configuracaoAgente: {
                    name: agentData.name,
                    personality: agentData.personality
                },
                programacao: finalSchedules
            };

            console.log('📤 Enviando dados do onboarding:', dadosOnboarding);

            // Enviar para o backend
            const response = await onboardingService.completar(dadosOnboarding);

            if (response.sucesso) {
                console.log('✅ Onboarding completado com sucesso!');
                
                // Atualizar contexto local
                setChurchInfo(churchData);
                setAgentSettings(agentData);
                setGlobalSchedules(
                    finalSchedules.map(s => ({...s, id: Date.now().toString() })) as ScheduleItem[]
                );
                
                // Marcar onboarding como concluído
                await setIsOnboardingComplete(true);
            }

        } catch (error) {
            console.error('❌ Erro ao finalizar onboarding:', error);
            alert('Erro ao finalizar onboarding. Tente novamente.');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <OnboardingWrapper title="Bem-vindo!" subtitle="Vamos começar configurando as informações da sua igreja.">
                        <InputField label="Nome da Igreja" name="name" value={churchData.name} onChange={(e) => handleChurchChange(e)} placeholder="Ex: Igreja da Comunidade" />
                        <InputField label="Endereço" name="address" value={churchData.address} onChange={(e) => handleChurchChange(e)} placeholder="Ex: Rua da Paz, 123, Cidade" />
                        <div className="flex justify-end mt-8">
                            <button onClick={handleNext} disabled={!churchData.name || !churchData.address} className="px-6 py-3 bg-[var(--color-text)] text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed">Próximo</button>
                        </div>
                    </OnboardingWrapper>
                );
            case 2:
                return (
                     <OnboardingWrapper title="Informações do Pastor" subtitle="Conte-nos um pouco sobre o líder da sua comunidade.">
                        <InputField label="Nome do Pastor" name="pastorName" value={churchData.pastorName} onChange={(e) => handleChurchChange(e)} placeholder="Ex: Pastor João Silva" />
                        <TextAreaField label="Breve Biografia" name="pastorBio" value={churchData.pastorBio} onChange={(e) => handleChurchChange(e)} placeholder="Ex: Pastor João é apaixonado por ensinar a palavra..." rows={4}/>
                        <div className="flex justify-between mt-8">
                            <button onClick={handleBack} className="px-6 py-3 bg-white border border-[var(--color-border)] text-[var(--color-text)] font-bold rounded-lg hover:bg-neutral-100 transition-colors">Voltar</button>
                            <button onClick={handleNext} disabled={!churchData.pastorName} className="px-6 py-3 bg-[var(--color-text)] text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed">Próximo</button>
                        </div>
                    </OnboardingWrapper>
                );
            case 3:
                return (
                    <OnboardingWrapper title="Configure seu Agente de IA" subtitle="Dê um nome e uma personalidade para seu assistente virtual.">
                         <InputField label="Nome do Agente" name="name" value={agentData.name} onChange={(e) => handleAgentChange(e)} placeholder="Ex: Assistente de Fé" />
                         <div className="mb-6">
                            <label className="block text-[var(--color-text)] text-sm font-bold mb-2">Tom e Personalidade</label>
                            <select name="personality" value={agentData.personality} onChange={handleAgentChange} className="w-full bg-white border border-[var(--color-border)] rounded-lg py-3 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all">
                                <option>Amigável e prestativo</option>
                                <option>Alegre e encorajador</option>
                                <option>Sério e informativo</option>
                                <option>Acolhedor e compassivo</option>
                            </select>
                        </div>
                        <div className="flex justify-between mt-8">
                             <button onClick={handleBack} className="px-6 py-3 bg-white border border-[var(--color-border)] text-[var(--color-text)] font-bold rounded-lg hover:bg-neutral-100 transition-colors">Voltar</button>
                            <button onClick={handleNext} disabled={!agentData.name} className="px-6 py-3 bg-[var(--color-text)] text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed">Próximo</button>
                        </div>
                    </OnboardingWrapper>
                );
            case 4:
                 return (
                    <OnboardingWrapper title="Foto de Perfil do WhatsApp" subtitle="Escolha uma imagem para seu agente ou gere uma com IA.">
                        <div className="flex flex-col items-center">
                            <div className="w-40 h-40 rounded-full bg-neutral-100 mb-6 flex items-center justify-center border-2 border-neutral-200">
                                {isGeneratingImage ? <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-800"></div> :
                                    churchData.profilePicture ? <img src={churchData.profilePicture} alt="Perfil" className="w-full h-full rounded-full object-cover"/> : <BuildingIcon className="w-20 h-20 text-neutral-300" />
                                }
                            </div>
                            <InputField label="Ou insira a URL de uma imagem" name="profilePicture" value={churchData.profilePicture} onChange={(e) => handleChurchChange(e)} placeholder="https://example.com/logo.png" />
                             <button onClick={handleGenerateImage} disabled={isGeneratingImage || !churchData.name} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-text)] text-white font-bold rounded-lg hover:bg-neutral-800 transition-opacity disabled:opacity-50 disabled:cursor-wait">
                                <SparklesIcon className="w-5 h-5" />
                                {isGeneratingImage ? "Gerando..." : "Gerar com IA"}
                             </button>
                              <p className="text-xs text-neutral-500 mt-2">A IA usará o nome da igreja para gerar uma imagem.</p>
                        </div>
                         <div className="flex justify-between mt-8">
                             <button onClick={handleBack} className="px-6 py-3 bg-white border border-[var(--color-border)] text-[var(--color-text)] font-bold rounded-lg hover:bg-neutral-100 transition-colors">Voltar</button>
                            <button onClick={handleNext} className="px-6 py-3 bg-[var(--color-text)] text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors">Próximo</button>
                        </div>
                    </OnboardingWrapper>
                 );
            case 5:
                return (
                     <OnboardingWrapper title="Cultos e Programações" subtitle="Informe os dias e horários das atividades regulares.">
                        <div className="space-y-4">
                            {schedules.map((s, i) => (
                                <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 bg-neutral-50 rounded-lg border border-[var(--color-border)]">
                                    <div className="md:col-span-2">
                                        <label className="block text-neutral-800 text-sm font-bold mb-1">Descrição</label>
                                        <input className="w-full bg-white border border-[var(--color-border)] rounded-lg py-2 px-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" name="description" value={s.description || ''} onChange={(e) => handleScheduleChange(i, e)} placeholder="Culto de Domingo"/>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-neutral-800 text-sm font-bold mb-1">Dia da Semana</label>
                                        <select name="day" value={s.day || 'Domingo'} onChange={(e) => handleScheduleChange(i, e)} className="w-full bg-white border border-[var(--color-border)] rounded-lg py-2 px-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] h-[42px]">
                                            {weekDays.map(day => <option key={day} value={day}>{day}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-neutral-800 text-sm font-bold mb-1">Horário</label>
                                        <input className="w-full bg-white border border-[var(--color-border)] rounded-lg py-2 px-3 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" name="time" value={s.time || ''} onChange={(e) => handleScheduleChange(i, e)} placeholder="19:00" type="time"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={addSchedule} className="mt-4 text-[var(--color-text)] font-bold hover:text-neutral-600 transition-colors">+ Adicionar outro horário</button>
                         <div className="flex justify-between mt-8 border-t border-[var(--color-border)] pt-6">
                             <button onClick={handleBack} className="px-6 py-3 bg-white border border-[var(--color-border)] text-[var(--color-text)] font-bold rounded-lg hover:bg-neutral-100 transition-colors">Voltar</button>
                            <button onClick={handleFinish} className="px-6 py-3 bg-[var(--color-accent)] text-[var(--color-text)] font-bold rounded-lg hover:bg-[var(--color-accent-dark)] transition-colors">Finalizar e Ir para o Painel</button>
                        </div>
                    </OnboardingWrapper>
                );
            default:
                return <div>Fim</div>;
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background-secondary)] flex flex-col items-center justify-center p-4">
            {renderStep()}
        </div>
    );
};

export default Onboarding;