import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { PageHeader, Card } from '../../components/ui/Page';
import { Input, Textarea, Button } from '../../components/ui/Forms';

const InstitutionalModule: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { churchInfo, setChurchInfo } = context;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setChurchInfo({ ...churchInfo, [e.target.name]: e.target.value });
    };

    // The 'Salvar Alterações' button is present for UI, but state is saved on change by the context.
    // In a real backend scenario, this button would trigger an API call.
    return (
        <div className="animate-fade-in">
            <PageHeader title="Informações Institucionais" subtitle="Edite as informações principais da sua igreja e do pastor." />
            <Card>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Dados da Igreja</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-bold mb-2">Nome da Igreja</label>
                        <Input name="name" value={churchInfo.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Endereço</label>
                        <Input name="address" value={churchInfo.address} onChange={handleChange} />
                    </div>
                </div>
                 <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Dados do Pastor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Nome do Pastor</label>
                        <Input name="pastorName" value={churchInfo.pastorName} onChange={handleChange} />
                    </div>
                     <div>
                        <label className="block text-sm font-bold mb-2">Foto de Perfil (URL)</label>
                        <Input name="profilePicture" value={churchInfo.profilePicture} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-2">Biografia do Pastor</label>
                        <Textarea name="pastorBio" value={churchInfo.pastorBio} onChange={handleChange} rows={4} />
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <Button onClick={() => alert("Informações salvas!")}>Salvar Alterações</Button>
                </div>
            </Card>
        </div>
    );
};

export default InstitutionalModule;