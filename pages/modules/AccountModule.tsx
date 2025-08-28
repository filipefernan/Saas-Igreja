import React, { useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { PageHeader, Card } from '../../components/ui/Page';
import { Input, Button } from '../../components/ui/Forms';
import { ArrowLeftIcon, CreditCardIcon } from '../../components/ui/Icons';

// Sub-component for the "Buy Credits" modal
const BuyCreditsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const context = useContext(AppContext);
    const [batches, setBatches] = useState(1);
    const PRICE_PER_BATCH = 99.90;
    const CREDITS_PER_BATCH = 1000;

    if (!isOpen || !context) return null;
    const { addCredits } = context;

    const totalCredits = batches * CREDITS_PER_BATCH;
    const totalPrice = (batches * PRICE_PER_BATCH).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const handlePurchase = () => {
        addCredits(totalCredits);
        alert(`${totalCredits.toLocaleString('pt-BR')} créditos adicionados com sucesso!`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-2xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[var(--color-text)]">Comprar créditos</h3>
                <p className="text-[var(--color-text-secondary)] text-sm mt-1 mb-6">Cada lote de 1.000 créditos custa R$ 99,90.</p>
                
                <div className="grid grid-cols-2 gap-4 items-end">
                    <div>
                        <label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Escolha a quantidade de lotes</label>
                        <Input 
                            type="number"
                            value={batches}
                            onChange={e => setBatches(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                        />
                    </div>
                    <div>
                         <p className="text-sm text-[var(--color-text-secondary)]">Valor total</p>
                         <p className="text-2xl font-bold text-[var(--color-text)]">{totalPrice}</p>
                    </div>
                </div>

                <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                     <label className="text-sm font-bold text-[var(--color-text)] mb-2 block">Forma de pagamento</label>
                     <div className="flex items-center justify-between p-3 bg-neutral-50 border border-[var(--color-border)] rounded-lg">
                        <div className="flex items-center gap-3">
                            <CreditCardIcon className="w-6 h-6 text-neutral-500" />
                            <div>
                                <p className="font-semibold text-[var(--color-text)]">Visa **** 1234</p>
                                <p className="text-xs text-[var(--color-text-secondary)]">Vencimento 12/26</p>
                            </div>
                        </div>
                        <button className="text-sm font-semibold text-blue-600 hover:underline">Alterar</button>
                     </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-6 border-t border-[var(--color-border)] pt-4">
                    <Button type="button" onClick={onClose} className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50">Cancelar</Button>
                    <Button type="button" onClick={handlePurchase}>Comprar créditos</Button>
                </div>
                 <button type="button" onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 text-3xl leading-none">&times;</button>
            </div>
        </div>
    );
};

const ChangePaymentMethodModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Forma de pagamento alterada!');
        onClose();
    }

    return (
         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-2xl w-full max-w-lg relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-6">Alterar Forma de Pagamento</h3>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 text-3xl leading-none">&times;</button>
                <div className="space-y-4">
                     <div><label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Número do Cartão</label><Input placeholder="**** **** **** 1234" required /></div>
                     <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Validade</label><Input placeholder="MM/AA" required /></div>
                        <div><label className="text-sm font-bold text-[var(--color-text)] mb-1 block">CVC</label><Input placeholder="123" required /></div>
                     </div>
                </div>
                <div className="flex justify-end gap-4 mt-6 border-t border-[var(--color-border)] pt-4">
                    <Button type="button" onClick={onClose} className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50">Cancelar</Button>
                    <Button type="submit">Salvar Alterações</Button>
                </div>
            </form>
        </div>
    )
}

const ChangePlanModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [selectedPlan, setSelectedPlan] = useState('pro');
    
    const plans = [
        { id: 'basic', name: 'Plano Básico', price: 'R$ 49/mês', features: ['1 Agente', '5.000 créditos/mês', 'Suporte por E-mail'] },
        { id: 'pro', name: 'Plano Pro', price: 'R$ 99/mês', features: ['5 Agentes', '15.000 créditos/mês', 'Integração Google Calendar', 'Suporte Prioritário'] },
    ];

    return (
         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-2xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-6">Alterar Plano</h3>
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 text-3xl leading-none">&times;</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plans.map(plan => (
                        <div key={plan.id} onClick={() => setSelectedPlan(plan.id)} className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-blue-600 bg-blue-50' : 'border-[var(--color-border)] hover:border-neutral-400'}`}>
                            <h4 className="font-bold text-lg text-[var(--color-text)]">{plan.name}</h4>
                            <p className="text-2xl font-bold text-[var(--color-text)] my-2">{plan.price}</p>
                            <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                                {plan.features.map(feat => <li key={feat}>- {feat}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 mt-6 border-t border-[var(--color-border)] pt-4">
                    <Button type="button" onClick={onClose} className="bg-transparent border border-red-500 text-red-500 hover:bg-red-50">Cancelar</Button>
                    <Button type="button" onClick={() => { alert('Plano alterado com sucesso!'); onClose(); }}>Confirmar Alteração</Button>
                </div>
            </div>
        </div>
    )
}

const CancelPlanConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white p-6 rounded-xl border border-[var(--color-border)] shadow-2xl w-full max-w-md relative text-center" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">Confirmar Cancelamento</h3>
                 <button type="button" onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 text-3xl leading-none">&times;</button>
                <p className="text-[var(--color-text-secondary)] mb-6">Você tem certeza que deseja cancelar seu plano? Esta ação não pode ser desfeita.</p>
                <div className="flex justify-center gap-4 mt-6 border-t border-[var(--color-border)] pt-4">
                    <Button type="button" onClick={onClose} className="bg-white border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50">Não, voltar</Button>
                    <Button type="button" onClick={() => { alert('Plano cancelado com sucesso! (Simulação)'); onClose(); }} className="bg-red-600 text-white hover:bg-red-700">Sim, cancelar</Button>
                </div>
            </div>
        </div>
    )
}

const ProfileTab: React.FC = () => {
    const context = useContext(AppContext);
    if(!context) return null;

    const { userInfo, setUserInfo } = context;
    const [name, setName] = useState(userInfo.name);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleInfoSave = (e: React.FormEvent) => {
        e.preventDefault();
        setUserInfo({ ...userInfo, name });
        alert('Informações salvas com sucesso!');
    };

    const handlePasswordSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('A nova senha e a confirmação não são iguais.');
            return;
        }
        if (passwords.new.length < 6) {
             alert('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }
        alert('Senha alterada com sucesso! (Simulação)');
        setPasswords({ current: '', new: '', confirm: '' });
    };

    return (
        <div className="space-y-6">
            <Card>
                <form onSubmit={handleInfoSave}>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Dados Pessoais</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Nome Completo</label>
                            <Input value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-[var(--color-text)] mb-1 block">E-mail de Acesso</label>
                            <Input value={userInfo.email} disabled className="bg-neutral-100 cursor-not-allowed"/>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button type="submit">Salvar Alterações</Button>
                    </div>
                </form>
            </Card>
             <Card>
                <form onSubmit={handlePasswordSave}>
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Alterar Senha</h3>
                    <div className="space-y-4">
                        <div><label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Senha Atual</label><Input type="password" value={passwords.current} onChange={e => setPasswords(p => ({...p, current: e.target.value}))} required /></div>
                        <div><label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Nova Senha</label><Input type="password" value={passwords.new} onChange={e => setPasswords(p => ({...p, new: e.target.value}))} required /></div>
                        <div><label className="text-sm font-bold text-[var(--color-text)] mb-1 block">Confirmar Nova Senha</label><Input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({...p, confirm: e.target.value}))} required /></div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button type="submit">Alterar Senha</Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}


// Main page component for payments
const PaymentsTab: React.FC<{
    onBuyCredits: () => void;
    onChangePayment: () => void;
    onChangePlan: () => void;
    onCancelPlan: () => void;
}> = ({ onBuyCredits, onChangePayment, onChangePlan, onCancelPlan }) => {
    const paymentActions = [
        { title: 'Alterar forma de pagamento', description: 'Caso deseje alterar a forma de pagamento, basta clicar no botão ao lado', buttonText: 'Alterar forma de pagamento', action: onChangePayment },
        { title: 'Alterar plano', description: 'Caso deseje alterar o plano da sua conta, basta clicar no botão ao lado', buttonText: 'Alterar plano', action: onChangePlan },
        { title: 'Comprar créditos', description: `Cada lote de 1000 créditos custa R$ 99,90 e você pode adquirir quantos quiser para continuar usando o seu Agente`, buttonText: 'Comprar créditos', action: onBuyCredits },
        { title: 'Cancelar plano', description: 'Caso deseje cancelar a sua conta, basta clicar no botão ao lado', buttonText: 'Cancelar plano', action: onCancelPlan, isCancel: true },
    ];

    return (
        <div className="space-y-4">
            {paymentActions.map(action => (
                <div key={action.title} className="flex items-center justify-between p-4 bg-white border border-[var(--color-border)] rounded-lg">
                    <div>
                        <h4 className="font-bold text-[var(--color-text)]">{action.title}</h4>
                        <p className="text-sm text-[var(--color-text-secondary)] max-w-md">{action.description}</p>
                    </div>
                    <Button
                        onClick={action.action}
                        className={action.isCancel ? 'bg-transparent border border-red-500 text-red-500 hover:bg-red-50' : 'bg-blue-600 text-white hover:bg-blue-700'}>
                        {action.buttonText}
                    </Button>
                </div>
            ))}
        </div>
    );
}

// Main AccountModule component
const AccountModule: React.FC<{ goBack: () => void; }> = ({ goBack }) => {
    const [activeTab, setActiveTab] = useState('pagamentos');
    const [isBuyCreditsOpen, setIsBuyCreditsOpen] = useState(false);
    const [isChangePaymentOpen, setIsChangePaymentOpen] = useState(false);
    const [isChangePlanOpen, setIsChangePlanOpen] = useState(false);
    const [isCancelPlanOpen, setIsCancelPlanOpen] = useState(false);

    const tabs = [
        { id: 'perfil', label: 'Perfil' },
        { id: 'pagamentos', label: 'Pagamentos' },
    ];

    return (
        <>
            <div className="animate-fade-in">
                 <header className="flex items-center gap-4 mb-8">
                    <button onClick={goBack} className="p-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeftIcon className="w-6 h-6 text-[var(--color-text-secondary)]"/>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text)]">Conta</h1>
                        <p className="text-[var(--color-text-secondary)] mt-1">Veja os seus dados e gerencie a sua conta</p>
                    </div>
                </header>

                <div className="mb-6 border-b border-[var(--color-border)]">
                    <nav className="flex space-x-6">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-3 px-1 text-md font-semibold transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-b-2 border-[var(--color-text)] text-[var(--color-text)]'
                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div>
                    {activeTab === 'pagamentos' && <PaymentsTab 
                        onBuyCredits={() => setIsBuyCreditsOpen(true)}
                        onChangePayment={() => setIsChangePaymentOpen(true)}
                        onChangePlan={() => setIsChangePlanOpen(true)}
                        onCancelPlan={() => setIsCancelPlanOpen(true)}
                    />}
                    {activeTab === 'perfil' && <ProfileTab />}
                </div>
            </div>

            {/* Modals are rendered outside the main animated div to ensure they are properly centered */}
            <BuyCreditsModal isOpen={isBuyCreditsOpen} onClose={() => setIsBuyCreditsOpen(false)} />
            <ChangePaymentMethodModal isOpen={isChangePaymentOpen} onClose={() => setIsChangePaymentOpen(false)} />
            <ChangePlanModal isOpen={isChangePlanOpen} onClose={() => setIsChangePlanOpen(false)} />
            <CancelPlanConfirmationModal isOpen={isCancelPlanOpen} onClose={() => setIsCancelPlanOpen(false)} />
        </>
    );
};

export default AccountModule;