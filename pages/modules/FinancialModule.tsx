import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { PageHeader, Card } from '../../components/ui/Page';
import { Input, Button } from '../../components/ui/Forms';

const FinancialModule: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;
    const { financialInfo, setFinancialInfo } = context;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFinancialInfo({ ...financialInfo, [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-fade-in">
            <PageHeader title="Financeiro" subtitle="Gerencie as informações de dízimos e ofertas da sua igreja." />
            <Card>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Informações para Doação</h3>
                <p className="text-[var(--color-text-secondary)] mb-6 text-sm">
                    Preencha os dados abaixo para que o agente de IA possa informar aos membros como eles podem contribuir.
                    A IA nunca solicitará valores, apenas fornecerá as informações se for perguntada.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-2">Chave PIX</label>
                        <Input name="chavePix" value={financialInfo.chavePix} onChange={handleChange} placeholder="email@dominio.com ou CNPJ" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Nome do Banco</label>
                        <Input name="banco" value={financialInfo.banco} onChange={handleChange} placeholder="Ex: Banco do Brasil" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Agência</label>
                        <Input name="agencia" value={financialInfo.agencia} onChange={handleChange} placeholder="Ex: 0001" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Conta Corrente (com dígito)</label>
                        <Input name="conta" value={financialInfo.conta} onChange={handleChange} placeholder="Ex: 12345-6" />
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <Button onClick={() => alert("Informações financeiras salvas!")}>Salvar Alterações</Button>
                </div>
            </Card>
        </div>
    );
};

export default FinancialModule;