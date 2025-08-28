import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { createChatSession, sendMessage } from '../services/geminiService';
import { SparklesIcon, LinkIcon } from './ui/Icons';
import type { WebAppMessage } from '../types';
import type { Chat } from '@google/genai';

interface TestChatProps {
    closeChat: () => void;
}

const TestChat: React.FC<TestChatProps> = ({ closeChat }) => {
    const context = useContext(AppContext);
    const [messages, setMessages] = useState<WebAppMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Start as true for initialization
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        if (!context) return;

        // This effect re-initializes the chat session if the underlying context data changes.
        // This is desired behavior for a "test" environment.
        const initializeChat = async () => {
            setIsLoading(true);
            setChat(null);
            setMessages([{ 
                sender: 'ai', 
                text: `Olá! Sou ${context.agentSettings.name}. Estou atualizando meu conhecimento com as informações mais recentes...` 
            }]);

            const trainingData = {
                churchInfo: context.churchInfo,
                agentSettings: context.agentSettings,
                schedules: context.schedules,
                faqs: context.faqs,
                events: context.events,
                pastoralAvailability: context.pastoralAvailability,
                pastoralAgenda: context.pastoralAgenda,
                websiteUrl: context.websiteUrl,
                instagramUrl: context.instagramUrl,
                uploadedFiles: context.uploadedFiles,
                financialInfo: context.financialInfo,
                ministries: context.ministries,
            };

            try {
                const chatSession = await createChatSession(trainingData);
                setChat(chatSession);
                setMessages([{ 
                    sender: 'ai', 
                    text: `Pronto! Envie uma mensagem para testar como eu responderia aos membros da sua igreja.` 
                }]);
            } catch (error) {
                console.error("Failed to initialize chat session:", error);
                setMessages([{ 
                    sender: 'ai', 
                    text: "Desculpe, não consegui iniciar nossa conversa. Verifique as configurações e tente novamente." 
                }]);
            } finally {
                setIsLoading(false);
            }
        };

        initializeChat();
    }, [context]);

    const handleAppointmentScheduling = (text: string) => {
        if (!context) return;
        const regex = /AGENDA_MARCADA:\s*([^;]+);\s*([^;]+);\s*(\d{4}-\d{2}-\d{2});\s*(\d{2}:\d{2})/;
        const match = text.match(regex);
        
        if (match) {
            const [, personName, subject, date, time] = match;
            context.addPastoralAppointment({
                personName: personName.trim(),
                subject: subject.trim(),
                date: date.trim(),
                time: time.trim(),
                type: 'Aconselhamento'
            });
            console.log('Appointment scheduled via AI:', { personName, subject, date, time });
        }
    };
    
    const handlePrayerRequest = (text: string) => {
        if (!context) return;
        const regex = /ORACAO_REGISTRADA:\s*([^;]+);\s*([^;]+);\s*([^;]+)/;
        const match = text.match(regex);

        if (match) {
            const [, nome, contato, motivo] = match;
            context.addPrayerRequest({
                nome: nome.trim(),
                contato: contato.trim(),
                motivo: motivo.trim()
            });
            console.log('Prayer request registered via AI:', { nome, contato, motivo });
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || !context || !chat) return;

        const userMessage: WebAppMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        const { text: aiResponseText, sources } = await sendMessage(chat, currentInput);
        
        if (aiResponseText.startsWith('HUMAN_HANDOFF:')) {
            const handoffMessage = aiResponseText.replace('HUMAN_HANDOFF:', '').trim();
            const aiHandoffMessage: WebAppMessage = { sender: 'ai', text: handoffMessage };
            
            const systemMessage: WebAppMessage = {
                sender: 'ai',
                text: '--- Conversa transferida para o Atendimento Humano. ---'
            };
    
            setMessages(prev => [...prev, aiHandoffMessage, systemMessage]);
            setIsLoading(false);
            setChat(null); // Disable further interaction with AI
            setInput('Conversa transferida. Você pode fechar esta janela.');
            return;
        }

        handleAppointmentScheduling(aiResponseText);
        handlePrayerRequest(aiResponseText);

        const aiMessage: WebAppMessage = { sender: 'ai', text: aiResponseText, sources };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    if (!context) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-lg h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-[var(--color-border)]">
                <header className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-6 h-6 text-[var(--color-text)]"/>
                        <h2 className="text-lg font-bold text-[var(--color-text)]">Testar Agente: {context.agentSettings.name}</h2>
                    </div>
                    <button onClick={closeChat} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] text-3xl leading-none">&times;</button>
                </header>

                <div className="flex-1 p-4 bg-neutral-50 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && (
                                <img src={context.churchInfo.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${context.agentSettings.name}`} alt="AI" className="w-8 h-8 rounded-full bg-neutral-200 self-start"/>
                            )}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[var(--color-text)] text-white rounded-br-lg' : 'bg-neutral-200 text-[var(--color-text)] rounded-bl-lg'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-3 pt-2 border-t border-neutral-300/50">
                                        <p className="text-xs font-bold text-neutral-500 mb-1">Fontes:</p>
                                        <div className="space-y-1">
                                            {msg.sources.map((source, i) => (
                                                <a 
                                                    key={i} 
                                                    href={source.web.uri} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="flex items-center gap-1.5 text-neutral-600 text-xs hover:underline"
                                                >
                                                    <LinkIcon className="w-3 h-3"/>
                                                    <span>{source.web.title || source.web.uri}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                             <img src={context.churchInfo.profilePicture || `https://api.dicebear.com/7.x/bottts/svg?seed=${context.agentSettings.name}`} alt="AI" className="w-8 h-8 rounded-full bg-neutral-200"/>
                             <div className="max-w-xs p-3 rounded-2xl bg-neutral-200 text-[var(--color-text)] rounded-bl-lg">
                                 <div className="flex items-center gap-1">
                                     <span className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse delay-0"></span>
                                     <span className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse delay-150"></span>
                                     <span className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse delay-300"></span>
                                 </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="p-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isLoading ? 'Aguarde o agente iniciar...' : 'Digite sua mensagem...'}
                            className="flex-1 bg-white border border-[var(--color-border)] rounded-lg py-2 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all"
                            disabled={isLoading || !chat}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim() || !chat} className="px-4 py-2 bg-[var(--color-text)] text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed">
                            Enviar
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default TestChat;