import React from 'react';
import { PageHeader, Card } from '../../components/ui/Page';

const PlaceholderModule: React.FC<{title: string}> = ({title}) => (
    <div>
        <PageHeader title={title} subtitle="Este módulo está em desenvolvimento." />
        <Card>
            <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-white">Em Breve</h3>
                <p className="text-slate-400 mt-2">Funcionalidades para {title.toLowerCase()} estarão disponíveis aqui.</p>
            </div>
        </Card>
    </div>
);

export default PlaceholderModule;
