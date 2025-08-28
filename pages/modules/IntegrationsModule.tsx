import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { PageHeader, Card } from '../../components/ui/Page';
import { Button, Input } from '../../components/ui/Forms';
import { GoogleIcon, WhatsappIcon, LinkIcon, CopyIcon, InstagramIcon } from '../../components/ui/Icons';

const IntegrationsModule: React.FC = () => {
    const context = useContext(AppContext);
    const [showQrCode, setShowQrCode] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!context) return null;
    const { isGoogleCalendarSynced, toggleGoogleCalendarSync, churchInfo, agentSettings, instagramUrl, setInstagramUrl } = context;

    const handleGoogleConnect = () => {
        // Em uma aplicação real, aqui começaria o fluxo OAuth 2.0.
        // As credenciais devem vir de um arquivo de configuração seguro ou variáveis de ambiente.
        const CLIENT_ID = 'SEU_CLIENT_ID_DO_GOOGLE.apps.googleusercontent.com';
        const REDIRECT_URI = 'https://SEU_DOMINIO/oauth2callback';
        const SCOPES = 'https://www.googleapis.com/auth/calendar';
        
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        
        const params = {
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: 'token',
            scope: SCOPES,
            include_granted_scopes: 'true',
            state: 'pass-through-value',
        };
        
        const url = `${oauth2Endpoint}?${new URLSearchParams(params)}`;
        
        // Em uma aplicação real, você redirecionaria o usuário:
        // window.location.href = url;
        
        // Para esta demonstração, apenas exibimos um alerta e alternamos o estado.
        alert("Para conectar de verdade, você precisaria de um Client ID do Google e um backend para processar o token. A URL de autorização foi gerada no console.");
        console.log("URL de Autorização do Google Gerada:", url);
        toggleGoogleCalendarSync(); // Simula a conexão/desconexão
    };
    
    const websiteSnippet = `<div id="church-ai-chat-widget"></div>
<script>
  window.churchAiConfig = {
    churchName: "${churchInfo.name || 'Sua Igreja'}",
    agentName: "${agentSettings.name || 'Assistente Virtual'}",
    profilePicture: "${churchInfo.profilePicture || ''}"
  };
  
  (function() {
    var d = document;
    var s = d.createElement('script');
    // Em produção, este script estaria hospedado no seu domínio SAAS
    s.src = 'https://SUA-URL-DE-PRODUCAO/widget.js'; 
    s.async = true;
    d.getElementById('church-ai-chat-widget').appendChild(s);
  })();
</script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(websiteSnippet).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
            <div className="animate-fade-in">
                <PageHeader title="Integrações" subtitle="Conecte seu agente com outras plataformas e com seu site." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Google Calendar Integration */}
                    <Card>
                        <div className="flex items-center gap-4 mb-4">
                            <GoogleIcon className="w-10 h-10" />
                            <h3 className="text-xl font-bold text-[var(--color-text)]">Google Calendar</h3>
                        </div>
                        <p className="text-[var(--color-text-secondary)] mb-6 text-sm">Sincronize a agenda pastoral para que a IA possa verificar disponibilidades e marcar atendimentos diretamente no calendário do pastor.</p>
                        <Button onClick={handleGoogleConnect} className={isGoogleCalendarSynced ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#4285F4] text-white hover:bg-[#357ae8]'}>
                            {isGoogleCalendarSynced ? 'Desconectar do Google' : 'Conectar com Google'}
                        </Button>
                    </Card>

                    {/* WhatsApp Integration */}
                    <Card>
                         <div className="flex items-center gap-4 mb-4">
                            <WhatsappIcon className="w-10 h-10" />
                            <h3 className="text-xl font-bold text-[var(--color-text)]">WhatsApp</h3>
                        </div>
                        <p className="text-[var(--color-text-secondary)] mb-6 text-sm">Ative a IA no número de WhatsApp da sua igreja. Clique no botão e leia o QR Code com o aplicativo do WhatsApp.</p>
                        <Button onClick={() => setShowQrCode(true)} className="bg-[#25D366] text-white hover:bg-[#1ebe57]">Conectar com WhatsApp</Button>
                    </Card>

                    {/* Instagram Integration */}
                    <Card>
                        <div className="flex items-center gap-4 mb-4">
                            <InstagramIcon className="w-10 h-10" />
                            <h3 className="text-xl font-bold text-[var(--color-text)]">Instagram</h3>
                        </div>
                        <p className="text-[var(--color-text-secondary)] mb-6 text-sm">Adicione o link do perfil da igreja para que a IA possa recomendá-lo aos membros durante as conversas.</p>
                        <Input
                            placeholder="https://www.instagram.com/suaigreja"
                            value={instagramUrl}
                            onChange={(e) => setInstagramUrl(e.target.value)}
                        />
                    </Card>

                    {/* Website Chat Snippet */}
                    <div className="md:col-span-2">
                        <Card>
                            <div className="flex items-center gap-4 mb-4">
                                <LinkIcon className="w-8 h-8 text-[var(--color-text)]" />
                                <h3 className="text-xl font-bold text-[var(--color-text)]">Chat para seu Site</h3>
                            </div>
                            <p className="text-[var(--color-text-secondary)] mb-4 text-sm">Copie e cole o código abaixo no HTML do seu site para adicionar um balão de chat e permitir que os visitantes conversem com seu agente.</p>
                            <div className="bg-neutral-100 rounded-lg p-4 relative border border-[var(--color-border)]">
                                <pre className="text-neutral-600 text-xs whitespace-pre-wrap overflow-x-auto">
                                    <code>{websiteSnippet}</code>
                                </pre>
                                 <button onClick={handleCopy} className="absolute top-2 right-2 bg-white p-2 rounded-md hover:bg-neutral-100 border border-[var(--color-border)] transition-colors">
                                    <CopyIcon className="w-5 h-5 text-neutral-500"/>
                                 </button>
                            </div>
                            {copied && <p className="text-green-600 text-sm mt-2 text-right">Copiado para a área de transferência!</p>}
                        </Card>
                    </div>
                </div>
            </div>

            {/* QR Code Modal */}
            {showQrCode && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowQrCode(false)}>
                    <div className="bg-white p-8 rounded-lg shadow-2xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-[var(--color-text)] text-center font-bold text-xl mb-2">Conectar ao WhatsApp</h3>
                        <p className="text-[var(--color-text-secondary)] text-center text-sm mb-4 max-w-xs">Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e escaneie o código abaixo.</p>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://wa.me/123456789?text=Oi" alt="QR Code para WhatsApp" />
                        <p className="text-xs text-neutral-500 mt-4 text-center">(Este é um QR Code de demonstração)</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default IntegrationsModule;