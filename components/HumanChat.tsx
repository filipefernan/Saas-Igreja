import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, Tag } from '../types';
import { SearchIcon, PlusIcon, PhoneIcon, VideoCameraIcon, PaperclipIcon, SendIcon, CheckIcon, UserIcon } from './ui/Icons';

type Message = {
    id: number;
    sender: 'user' | 'member';
    text: string;
    timestamp: string;
    read: boolean;
};

// --- MOCK DATA ---
const mockTags: Tag[] = [
    { name: 'Agente', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { name: 'Urgente', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    { name: 'Novo Membro', bgColor: 'bg-green-100', textColor: 'text-green-800' },
];

const mockConversations: Conversation[] = [
    { id: 1, name: 'Ana Silva', avatar: `https://i.pravatar.cc/40?u=ana`, lastMessage: 'Olá, gostaria de saber sobre o batismo.', timestamp: '10:45', unreadCount: 2, tags: [mockTags[2]] },
    { id: 2, name: 'Carlos Souza', avatar: `https://i.pravatar.cc/40?u=carlos`, lastMessage: 'Preciso falar com o pastor, por favor.', timestamp: '09:30', unreadCount: 0, tags: [mockTags[1]] },
    { id: 3, name: 'Beatriz Costa', avatar: `https://i.pravatar.cc/40?u=bia`, lastMessage: 'Obrigada pela ajuda!', timestamp: 'Ontem', unreadCount: 0, tags: [] },
    { id: 4, name: 'Daniel Martins', avatar: `https://i.pravatar.cc/40?u=dani`, lastMessage: 'Qual o endereço do evento de jovens?', timestamp: 'Sexta', unreadCount: 0, tags: [mockTags[0]] },
];

const mockMessages: Record<number, Message[]> = {
    1: [
        { id: 1, sender: 'member', text: 'Oi, tudo bem? Eu sou nova na igreja e gostaria de saber como funciona o batismo.', timestamp: '10:40', read: true },
        { id: 2, sender: 'user', text: 'Olá Ana, seja bem-vinda! Que alegria ter você conosco. O batismo é um passo lindo na caminhada cristã. Temos um encontro preparatório no próximo sábado. Você tem interesse?', timestamp: '10:42', read: true },
        { id: 3, sender: 'member', text: 'Tenho sim! Que ótimo!', timestamp: '10:44', read: false },
        { id: 4, sender: 'member', text: 'Precisa levar algo?', timestamp: '10:45', read: false },
    ],
    2: [
        { id: 1, sender: 'member', text: 'Bom dia. Preciso falar com o pastor, por favor. É um assunto urgente.', timestamp: '09:30', read: true },
    ],
    3: [
        { id: 1, sender: 'member', text: 'Consegui fazer a inscrição, muito obrigada pela ajuda!', timestamp: 'Ontem', read: true },
    ],
    4: [
        { id: 1, sender: 'member', text: 'Qual o endereço do evento de jovens?', timestamp: 'Sexta', read: true },
        { id: 2, sender: 'user', text: 'O evento será no nosso salão principal, na Rua da Paz, 123. Esperamos você lá!', timestamp: 'Sexta', read: true },
    ],
};
// --- END OF MOCK DATA ---

const ConversationItem: React.FC<{ conv: Conversation; isSelected: boolean; onClick: () => void }> = ({ conv, isSelected, onClick }) => (
    <div onClick={onClick} className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-[var(--color-accent)]' : 'hover:bg-neutral-100'}`}>
        <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full mr-3" />
        <div className="flex-1 overflow-hidden">
            <div className="flex justify-between items-center">
                <p className={`font-bold truncate ${isSelected ? 'text-[var(--color-text)]' : 'text-[var(--color-text)]'}`}>{conv.name}</p>
                <p className={`text-xs flex-shrink-0 ${isSelected ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-text-secondary)]'}`}>{conv.timestamp}</p>
            </div>
            <div className="flex justify-between items-center mt-1">
                <p className={`text-sm truncate ${isSelected ? 'text-[var(--color-text-secondary)]' : 'text-neutral-500'}`}>{conv.lastMessage}</p>
                {conv.unreadCount && conv.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{conv.unreadCount}</span>
                )}
            </div>
        </div>
    </div>
);

const HumanChat: React.FC<{ closeChat: () => void }> = ({ closeChat }) => {
    const [conversations, setConversations] = useState(mockConversations);
    const [selectedConv, setSelectedConv] = useState(conversations[0]);
    const [messages, setMessages] = useState(mockMessages[selectedConv.id]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(mockMessages[selectedConv.id] || []);
    }, [selectedConv]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage: Message = {
            id: Date.now(),
            sender: 'user',
            text: input,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            read: false,
        };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
    };

    return (
        <div className="fixed bottom-20 right-5 z-40 w-[700px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col border border-[var(--color-border)] animate-fade-in">
            {/* Main container */}
            <div className="flex h-full">
                {/* Left Pane: Conversation List */}
                <aside className="w-[250px] h-full bg-neutral-50/50 border-r border-[var(--color-border)] flex flex-col">
                    <header className="p-3 border-b border-[var(--color-border)] flex-shrink-0">
                         <div className="flex justify-between items-center mb-3">
                             <h2 className="text-lg font-bold">Conversas</h2>
                             <button className="p-1 text-neutral-500 hover:text-neutral-800"><PlusIcon className="w-5 h-5" /></button>
                         </div>
                        <div className="relative">
                            <SearchIcon className="w-4 h-4 text-neutral-400 absolute top-1/2 left-3 -translate-y-1/2" />
                            <input type="text" placeholder="Pesquisar..." className="w-full bg-white border border-[var(--color-border)] rounded-md py-1.5 pl-8 pr-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]" />
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {conversations.map(conv => <ConversationItem key={conv.id} conv={conv} isSelected={selectedConv.id === conv.id} onClick={() => setSelectedConv(conv)} />)}
                    </div>
                </aside>

                {/* Right Pane: Chat Window */}
                <main className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <header className="flex items-center justify-between p-3 border-b border-[var(--color-border)] flex-shrink-0">
                        <div className="flex items-center">
                            <img src={selectedConv.avatar} alt={selectedConv.name} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <p className="font-bold">{selectedConv.name}</p>
                                <p className="text-xs text-green-600 font-semibold">Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-500">
                           <button className="p-2 hover:bg-neutral-100 rounded-full"><PhoneIcon className="w-5 h-5" /></button>
                           <button className="p-2 hover:bg-neutral-100 rounded-full"><VideoCameraIcon className="w-5 h-5" /></button>
                           <button onClick={closeChat} className="p-2 hover:bg-neutral-100 rounded-full text-xl leading-none">&times;</button>
                        </div>
                    </header>

                    {/* Messages */}
                    <div className="flex-1 p-4 bg-neutral-50 overflow-y-auto space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'member' && <img src={selectedConv.avatar} alt={selectedConv.name} className="w-7 h-7 rounded-full" />}
                                <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[var(--color-text)] text-white rounded-br-lg' : 'bg-white text-[var(--color-text)] rounded-bl-lg border border-neutral-200'}`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1.5">
                                        <p className={`text-xs ${msg.sender === 'user' ? 'text-neutral-300' : 'text-neutral-400'}`}>{msg.timestamp}</p>
                                        {msg.sender === 'user' && <CheckIcon className={`w-4 h-4 ${msg.read ? 'text-blue-400' : 'text-neutral-400'}`} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>

                    {/* Input Footer */}
                    <footer className="p-3 border-t border-[var(--color-border)] bg-white flex-shrink-0">
                        <div className="flex items-center gap-2">
                             <button className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-full"><PaperclipIcon className="w-5 h-5" /></button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 bg-neutral-100 border-transparent rounded-lg py-2 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all"
                            />
                            <button onClick={handleSend} disabled={!input.trim()} className="p-2 text-white bg-[var(--color-text)] rounded-lg hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed">
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default HumanChat;
