

import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Page';
import { ArrowLeftIcon, FilterIcon } from '../../components/ui/Icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Button } from '../../components/ui/Forms';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Period = 'this_week' | 'last_week' | 'one_month' | 'two_months' | 'three_months';

const periodLabels: Record<Period, string> = {
    this_week: 'Essa semana',
    last_week: 'Semana passada',
    one_month: 'Há um mês',
    two_months: 'Há dois meses',
    three_months: 'Há três meses',
};

const generateRandomData = (base: number, variance: number) => Math.round(base + (Math.random() - 0.5) * variance);

const generateMockData = (period: Period) => {
    const multiplier = { this_week: 1, last_week: 1.5, one_month: 4, two_months: 8, three_months: 12 }[period];
    const days = { this_week: 7, last_week: 7, one_month: 30, two_months: 60, three_months: 90 }[period];

    const kpis = {
        userMessages: generateRandomData(20 * multiplier, 10 * multiplier),
        agentMessages: generateRandomData(18 * multiplier, 10 * multiplier),
        humanMessages: generateRandomData(2 * multiplier, 2 * multiplier),
        userMessagesChange: generateRandomData(0, 200) - 100,
        agentMessagesChange: generateRandomData(0, 200) - 100,
        humanMessagesChange: generateRandomData(0, 200) - 100,
    };

    const step = days > 14 ? Math.floor(days / 7) : 1;
    const dateLabels = [];
    for (let i = 0; i < days; i+= step) {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        dateLabels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    }
    const numDataPoints = dateLabels.length;

    const messagesPerDay = {
        labels: dateLabels,
        datasets: [{
            label: 'Mensagens',
            data: Array.from({ length: numDataPoints }, () => generateRandomData(15 * step, 10 * step)),
            backgroundColor: '#8b5cf6',
        }],
    };
    
    const messagesPerChannel = {
        labels: dateLabels,
        datasets: [
            { label: 'Usuário', data: Array.from({ length: numDataPoints }, () => generateRandomData(10 * step, 5 * step)), backgroundColor: '#f59e0b' },
            { label: 'Agente', data: Array.from({ length: numDataPoints }, () => generateRandomData(8 * step, 4 * step)), backgroundColor: '#8b5cf6' }
        ]
    };

    const humanHandoffs = {
        labels: dateLabels,
        datasets: [{
            label: 'Passagens para humano',
            data: Array.from({ length: numDataPoints }, () => generateRandomData(2 * step, 2 * step)),
            backgroundColor: ['#10b981', '#3b82f6'],
        }],
    };

    return { kpis, messagesPerDay, messagesPerChannel, humanHandoffs };
};


const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { ticks: { color: '#555' }, grid: { display: false } },
        y: { ticks: { color: '#555' }, grid: { color: '#e5e5e5' } },
    },
};

const KpiCard: React.FC<{ title: string; value: number; change: number; comparisonText: string }> = ({ title, value, change, comparisonText }) => (
    <Card className="flex flex-col">
        <h3 className="text-md text-[var(--color-text-secondary)]">{title}</h3>
        <p className="text-3xl font-bold my-1 text-[var(--color-text)]">{value}</p>
        <div className={`text-sm font-semibold px-2 py-1 rounded-md self-start ${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {change > 0 ? `+${change}`: change}%
        </div>
        <p className="text-xs text-neutral-500 mt-1">{comparisonText}</p>
    </Card>
);

const FilterPanel: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    currentPeriod: Period,
    onApplyFilter: (period: Period) => void
}> = ({ isOpen, onClose, currentPeriod, onApplyFilter }) => {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>(currentPeriod);

    const handleApply = () => {
        onApplyFilter(selectedPeriod);
        onClose();
    };
    
    const handleClear = () => {
        setSelectedPeriod('this_week');
        onApplyFilter('this_week');
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-6">Filtrar por período</h2>
                <div className="space-y-3">
                    {Object.entries(periodLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center">
                            <input
                                id={key}
                                type="radio"
                                name="period"
                                value={key}
                                checked={selectedPeriod === key}
                                onChange={() => setSelectedPeriod(key as Period)}
                                className="w-4 h-4 text-[var(--color-accent)] bg-gray-100 border-gray-300 focus:ring-[var(--color-accent)] focus:ring-2"
                            />
                            <label htmlFor={key} className="ml-3 block text-sm font-medium text-[var(--color-text-secondary)]">{label}</label>
                        </div>
                    ))}
                </div>
                <div className="space-y-2 mt-6 border-t border-[var(--color-border)] pt-4">
                    <Button onClick={handleApply} className="w-full bg-[var(--color-text)] hover:bg-neutral-800">Aplicar filtro</Button>
                    <Button onClick={handleClear} className="w-full bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:bg-neutral-100">Limpar tudo</Button>
                </div>
            </div>
        </div>
    );
};

const MetricsModule: React.FC<{ goBack: () => void; }> = ({ goBack }) => {
    const [filterPeriod, setFilterPeriod] = useState<Period>('this_week');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const data = useMemo(() => generateMockData(filterPeriod), [filterPeriod]);
    
    const comparisonText = `a menos que ${periodLabels[filterPeriod] === 'Essa semana' ? 'a semana passada' : periodLabels[filterPeriod].toLowerCase()}`;

    return (
        <div className="animate-fade-in">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={goBack} className="p-2 rounded-full hover:bg-neutral-100">
                        <ArrowLeftIcon className="w-6 h-6 text-[var(--color-text-secondary)]"/>
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--color-text)]">Dashboard</h1>
                        <p className="text-[var(--color-text-secondary)] mt-1">Veja as métricas do seu agente</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[var(--color-border)] rounded-lg text-[var(--color-text)] font-semibold hover:bg-neutral-100 transition-colors"
                >
                    Filtrar <FilterIcon className="w-5 h-5"/>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <KpiCard title="Mensagens dos usuários" value={data.kpis.userMessages} change={data.kpis.userMessagesChange} comparisonText={comparisonText} />
                <KpiCard title="Mensagens dos agentes" value={data.kpis.agentMessages} change={data.kpis.agentMessagesChange} comparisonText={comparisonText} />
                <KpiCard title="Mensagens dos atendentes humanos" value={data.kpis.humanMessages} change={data.kpis.humanMessagesChange} comparisonText={comparisonText} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="lg:col-span-2 h-80">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Mensagens por dia</h3>
                    <div className="h-64"><Bar options={chartOptions} data={data.messagesPerDay} /></div>
                </Card>

                <Card className="h-80">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Mensagens por canal</h3>
                    <div className="h-64"><Bar options={{ ...chartOptions, scales: { x: { ...chartOptions.scales.x, stacked: true }, y: { ...chartOptions.scales.y, stacked: true } } }} data={data.messagesPerChannel} /></div>
                </Card>
                
                <Card className="h-80">
                     <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Passagens para humano</h3>
                    <div className="h-64"><Bar options={chartOptions} data={data.humanHandoffs} /></div>
                </Card>
            </div>
            
            <FilterPanel 
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentPeriod={filterPeriod}
                onApplyFilter={setFilterPeriod}
            />
        </div>
    );
};

export default MetricsModule;