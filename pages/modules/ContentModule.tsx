import React, { useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import { PageHeader, Card } from '../../components/ui/Page';
import { Input, Button } from '../../components/ui/Forms';
import { UploadIcon, PdfIcon, TrashIcon, LinkIcon } from '../../components/ui/Icons';
import type { UploadedFile } from '../../types';

const ContentModule: React.FC = () => {
    const context = useContext(AppContext);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!context) return null;
    const { websiteUrl, setWebsiteUrl, uploadedFiles, addFile, deleteFile } = context;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            Array.from(event.target.files).forEach(file => {
                if (file.type === 'application/pdf') {
                    addFile({ name: file.name });
                } else {
                    alert('Por favor, envie apenas arquivos PDF.');
                }
            });
        }
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Conteúdos para Treinamento" subtitle="Alimente sua IA com o site da igreja e documentos importantes." />
            <div className="space-y-8">
                <Card>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2"><LinkIcon className="w-6 h-6"/> Site da Igreja</h3>
                    <p className="text-[var(--color-text-secondary)] mb-4 text-sm">Forneça o link do site da sua igreja para que a IA possa buscar informações sobre notícias, eventos e ministérios.</p>
                    <Input 
                        placeholder="https://www.minhaigreja.com" 
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                    />
                </Card>

                <Card>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2"><UploadIcon className="w-6 h-6"/> Documentos (PDF)</h3>
                    <p className="text-[var(--color-text-secondary)] mb-4 text-sm">Faça o upload de estudos de células, informativos de ministérios, doutrinas ou outros materiais em PDF para aprofundar o conhecimento da IA.</p>
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf"
                        multiple
                    />
                    <Button onClick={() => fileInputRef.current?.click()}>
                        <span className="flex items-center gap-2">
                            <UploadIcon className="w-5 h-5"/>
                            Selecionar Arquivos PDF
                        </span>
                    </Button>

                    <div className="mt-6 space-y-3">
                        <h4 className="text-lg font-semibold text-[var(--color-text)]">Arquivos Carregados</h4>
                        {uploadedFiles.length > 0 ? uploadedFiles.map((file: UploadedFile) => (
                            <div key={file.id} className="bg-neutral-50 border border-[var(--color-border)] p-3 rounded-lg flex justify-between items-center animate-fade-in">
                                <div className="flex items-center gap-3">
                                    <PdfIcon className="w-6 h-6 text-red-500" />
                                    <p className="font-medium text-[var(--color-text)]">{file.name}</p>
                                </div>
                                <button onClick={() => deleteFile(file.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full transition-colors">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        )) : (
                            <p className="text-neutral-500 text-center py-4 border-2 border-dashed border-neutral-300 rounded-lg">
                                Nenhum arquivo PDF carregado.
                            </p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ContentModule;