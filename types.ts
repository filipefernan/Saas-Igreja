

export interface ChurchInfo {
    name: string;
    address: string;
    pastorName: string;
    pastorBio: string;
    profilePicture: string;
}

export interface AgentSettings {
    name: string;
    personality: string;
}

export interface ScheduleItem {
    id: string;
    day: string;
    time: string;
    description: string;
}

export interface EventItem {
    id:string;
    name: string;
    date: string; // YYYY-MM-DD for start date
    endDate?: string; // Optional YYYY-MM-DD for end date
    description: string;
}

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
}

export interface StudyMaterial {
    id: string;
    title: string;
    content: string;
}

export interface PastoralAppointment {
    id:string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    personName: string;
    subject: string;
    type: 'Aconselhamento' | 'Oração';
}

export interface PastoralAvailability {
    id: string;
    day: string; // 'Segunda-feira', 'Terça-feira', etc.
    startTime: string; // 'HH:MM'
    endTime: string; // 'HH:MM'
}

export interface UploadedFile {
    id: string;
    name: string;
    // Em um app real, o conteúdo seria processado e armazenado em um backend/vector DB.
}

export interface GroundingChunk {
    web: {
        uri: string;
        title: string;
    };
}

export interface WebAppMessage {
    sender: 'user' | 'ai';
    text: string;
    sources?: GroundingChunk[];
}

export interface FinancialInfo {
    banco: string;
    agencia: string;
    conta: string;
    chavePix: string;
}

export interface PrayerRequest {
    id: string;
    nome: string;
    contato: string; // pode ser email ou telefone
    motivo: string;
    data: string; // YYYY-MM-DD
}

export interface Tag {
    name: string;
    bgColor: string;
    textColor: string;
}

export interface Conversation {
    id: number;
    name: string;
    avatar?: string;
    lastMessage: string;
    timestamp: string;
    unreadCount?: number;
    tags?: Tag[];
    isImage?: boolean;
    senderIcon?: React.ElementType;
}

export interface Contact {
    id: number;
    name: string;
    phone: string;
    avatar?: string;
}

// Tipos para o novo módulo de Ministérios
export interface MinistryLeader {
    id: string;
    name: string;
    contact: string;
}

export interface MinistryEvent {
    id: string;
    name: string;
    day: string;
    time: string;
    location: string;
}

export interface Ministry {
    id: string;
    name: string;
    purpose: string;
    leaders: MinistryLeader[];
    schedule: MinistryEvent[];
    howToJoin: string;
}