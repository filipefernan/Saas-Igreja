import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { ChurchInfo, AgentSettings, ScheduleItem, FaqItem, EventItem, PastoralAvailability, UploadedFile, GroundingChunk, FinancialInfo, PastoralAppointment, Ministry } from '../types';

interface TrainingData {
    churchInfo: ChurchInfo;
    agentSettings: AgentSettings;
    schedules: ScheduleItem[];
    faqs: FaqItem[];
    events: EventItem[];
    pastoralAvailability: PastoralAvailability[];
    pastoralAgenda: PastoralAppointment[];
    websiteUrl: string;
    instagramUrl: string;
    uploadedFiles: UploadedFile[];
    financialInfo: FinancialInfo;
    ministries: Ministry[];
}

// Simulates calling the Gemini API to generate an image.
export const generateProfilePicture = async (prompt: string): Promise<string> => {
    console.log(`Simulating AI image generation for prompt: "${prompt}"`);
    return new Promise(resolve => {
        setTimeout(() => {
            const randomId = Math.floor(Math.random() * 1000);
            resolve(`https://picsum.photos/id/${randomId}/200/200`);
        }, 2000);
    });
};

const buildSystemInstruction = (trainingData: TrainingData): string => {
    const { churchInfo, agentSettings, schedules, events, faqs, pastoralAvailability, pastoralAgenda, websiteUrl, instagramUrl, uploadedFiles, financialInfo, ministries } = trainingData;

    const scheduleText = schedules.length > 0
        ? schedules.map(s => `- ${s.description}: Toda ${s.day} às ${s.time}.`).join('\n')
        : 'Nenhuma programação fixa cadastrada.';

    const eventsText = events.length > 0
        ? events.map(e => {
            const startDate = new Date(e.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            if (e.endDate) {
                const endDate = new Date(e.endDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                return `- ${e.name} (Data: de ${startDate} a ${endDate}): ${e.description}.`;
            }
            return `- ${e.name} (Data: ${startDate}): ${e.description}.`;
        }).join('\n')
        : 'Nenhum evento especial agendado.';

    const faqsText = faqs.length > 0
        ? faqs.map(f => `P: ${f.question}\nR: ${f.answer}`).join('\n\n')
        : 'Nenhuma pergunta frequente cadastrada.';
        
    const availabilityText = pastoralAvailability.length > 0
        ? pastoralAvailability.map(a => `- ${a.day}: das ${a.startTime} às ${a.endTime}.`).join('\n')
        : 'O pastor não definiu horários de atendimento no momento.';

    const agendaText = pastoralAgenda.length > 0
        ? pastoralAgenda.map(a => {
            if (a.type === 'Oração') {
                return `- ${new Date(a.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}: Pedido de oração de ${a.personName}. (Não bloqueia o horário para aconselhamento).`;
            }
            return `- ${new Date(a.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} às ${a.time}: Horário ocupado para aconselhamento.`;
        }).join('\n')
        : 'Nenhum horário agendado no momento.';

    const websiteText = websiteUrl ? `O site oficial da igreja é ${websiteUrl}. Você tem permissão para usar sua ferramenta de busca para consultar este site se a resposta não estiver na base de conhecimento.` : '';
    const instagramText = instagramUrl ? `O perfil oficial da igreja no Instagram é ${instagramUrl}. Você pode recomendá-lo para os membros se manterem atualizados.` : '';
    
    const filesText = uploadedFiles.length > 0
        ? 'Você também tem acesso aos seguintes documentos para consulta: ' + uploadedFiles.map(f => f.name).join(', ') + '.'
        : '';
    
    const financialText = (financialInfo.chavePix || financialInfo.conta)
        ? `Se alguém perguntar como doar, ofertar ou entregar o dízimo, forneça as seguintes informações:
- Banco: ${financialInfo.banco || 'Não informado'}
- Agência: ${financialInfo.agencia || 'Não informada'}
- Conta: ${financialInfo.conta || 'Não informada'}
- Chave PIX: ${financialInfo.chavePix || 'Não informada'}
Nunca peça valores. Apenas forneça os dados se for perguntado.`
        : 'As informações para doações não foram cadastradas.';

    const ministriesText = ministries.length > 0
        ? ministries.map(m => `
### Ministério: ${m.name}
- Propósito: ${m.purpose}
- Líderes: ${m.leaders.map(l => `${l.name} (Contato: ${l.contact})`).join(', ')}
- Programação:
${m.schedule.map(s => `  - ${s.name}: ${s.day} às ${s.time} no(a) ${s.location}.`).join('\n')}
- Como Participar: ${m.howToJoin}
`).join('\n')
        : 'Nenhum ministério cadastrado.';

    return `Você é "${agentSettings.name}", um assistente de IA para a igreja "${churchInfo.name}".
Sua personalidade definida é: "${agentSettings.personality}".
Seu objetivo é responder às perguntas dos membros da igreja de forma humana e precisa, mantendo o contexto da conversa.

--- BASE DE CONHECIMENTO ---

## Informações Gerais
- Nome da Igreja: ${churchInfo.name}
- Pastor Responsável: ${churchInfo.pastorName}
- Biografia do Pastor: ${churchInfo.pastorBio || 'Não informada.'}
- Endereço da Igreja: ${churchInfo.address}
${websiteText}
${instagramText}
${filesText}

## Ministérios
${ministriesText}

## Programação e Eventos
- Programação Fixa:
${scheduleText}
- Eventos Especiais:
${eventsText}

## Perguntas Frequentes (FAQ)
${faqsText}

## Agenda Pastoral (Aconselhamento)
- Horários disponíveis do pastor:
${availabilityText}
- Horários já agendados:
${agendaText}

## Doações (Dízimos e Ofertas)
${financialText}

--- PROTOCOLOS DE AÇÃO ---

## PERMISSÃO DE AGENDAMENTO
Você TEM permissão para agendar aconselhamentos. Cada aconselhamento dura EXATAMENTE 1 HORA. Ao receber um pedido, converse com o usuário para obter o nome da pessoa, o assunto, o dia e o horário desejado (baseado na disponibilidade). Antes de confirmar, VERIFIQUE a lista de 'Horários já agendados' para evitar conflitos. Itens marcados como "Pedido de oração" NÃO bloqueiam o horário. Você PODE marcar um aconselhamento no mesmo dia de um pedido de oração. Apenas horários marcados como "ocupado para aconselhamento" criam conflito. Após confirmar TODOS os dados e verificar que não há conflito, finalize a conversa com a frase EXATA e em uma única mensagem:
"AGENDA_MARCADA: [Nome da Pessoa]; [Assunto]; [YYYY-MM-DD]; [HH:MM]"
Substitua os colchetes com os dados reais. Ex: "Ok, agendado para você. AGENDA_MARCADA: Maria Silva; Oração; 2024-10-28; 15:00"

## PEDIDOS DE ORAÇÃO
Você PODE receber pedidos de oração. Se alguém pedir oração, seja empático e peça o nome da pessoa, um contato (telefone ou email, que é opcional) e o motivo da oração. Após obter os dados, finalize com a frase EXATA em uma única mensagem:
"ORACAO_REGISTRADA: [Nome da Pessoa]; [Contato]; [Motivo da Oração]"
Exemplo: "Entendido. Estaremos orando por você. ORACAO_REGISTRADA: Carlos; carlos@email.com; Saúde da família"

## PROTOCOLO DE ATENDIMENTO HUMANO
Se o usuário expressar um desejo claro de falar com uma pessoa, pastor, ou qualquer atendente humano (ex: "quero falar com um humano", "posso falar com alguém?"), sua ÚNICA resposta deve ser a frase EXATA: \`HUMAN_HANDOFF: A conversa será transferida para um de nossos atendentes.\` Não adicione mais nada à resposta.


--- REGRAS DE COMPORTAMENTO ---
- Sempre responda em português do Brasil.
- Mantenha o tom definido pela sua personalidade.
- Se não souber a resposta, diga que não tem a informação e que a pessoa pode contatar a secretaria da igreja.
- Não invente informações. Baseie-se APENAS na base de conhecimento fornecida.
- Se a pergunta for sobre um assunto que não está na sua base de conhecimento, você pode usar a busca do Google para encontrar a informação. Sempre cite as fontes encontradas.
- Para agendamentos e pedidos de oração, siga ESTRITAMENTE o formato de saída definido.
`;
};

let ai: GoogleGenAI | null = null;

// This function initializes the GoogleGenAI instance using an API key
// from environment variables. It's designed to be a singleton.
const getAI = (): GoogleGenAI => {
    if (!ai) {
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            console.error("API_KEY is not set in environment variables.");
            // In a real app, you might want to show a more user-friendly error.
            // For this project, we throw an error to make the issue clear during development.
            alert("A chave de API do Google não foi configurada. O chat de teste não funcionará.");
            throw new Error("API Key for Google GenAI is not configured.");
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
};


export const createChatSession = async (trainingData: TrainingData): Promise<Chat> => {
    const ai = getAI();
    const systemInstruction = buildSystemInstruction(trainingData);

    const tools = [{ googleSearch: {} }];

    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
            tools
        },
    });

    return chat;
};

export const sendMessage = async (chat: Chat, message: string): Promise<{ text: string; sources?: GroundingChunk[] }> => {
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        const text = response.text;
        const sources: GroundingChunk[] | undefined = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
        return { text, sources };
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return { text: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde." };
    }
};