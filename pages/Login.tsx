import React, { useState, useContext } from 'react';
import { supabase } from '../services/supabase';
import { BuildingIcon } from '../components/ui/Icons';
import { AppContext } from '../context/AppContext';

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input className="w-full bg-white border border-[var(--color-border)] rounded-lg py-3 px-4 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent placeholder:text-neutral-400 transition-all" {...props} />
);

const Login: React.FC = () => {
    const context = useContext(AppContext);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!context) {
        return <div>Loading...</div>;
    }

    const { setIsAuthenticated } = context;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) {
                    setError(error.message);
                } else {
                    // Login bem-sucedido - atualizar estado
                    setIsAuthenticated(true);
                }
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) {
                    setError(error.message);
                } else {
                    setError('Verifique seu email para confirmar a conta!');
                }
            }
        } catch (err) {
            setError('Erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background-secondary)] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm mx-auto">
                <div className="text-center mb-8">
                     <div className="w-20 h-20 rounded-full bg-white mb-6 flex items-center justify-center border border-[var(--color-border)] mx-auto">
                        <BuildingIcon className="w-10 h-10 text-[var(--color-text)]" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--color-text)]">
                        {isLogin ? 'Acesse sua Conta' : 'Criar Conta'}
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mt-2">
                        {isLogin ? 'Bem-vindo de volta! Faça login para gerenciar seu agente.' : 'Crie sua conta para começar a usar o sistema.'}
                    </p>
                </div>

                <div className="bg-white p-8 rounded-xl border border-[var(--color-border)] shadow-sm">
                    <form onSubmit={handleAuth} className="space-y-6">
                        <div>
                            <label className="block text-[var(--color-text)] text-sm font-bold mb-2">Email</label>
                            <InputField 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="pastor@igreja.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--color-text)] text-sm font-bold mb-2">Senha</label>
                            <InputField 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 px-6 py-3 bg-[var(--color-text)] text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
                            </button>
                        </div>
                    </form>
                </div>
                 <p className="text-center text-[var(--color-text-secondary)] text-sm mt-6">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[var(--color-text)] font-medium hover:underline"
                    >
                        {isLogin ? 'Não tem uma conta? Crie uma agora' : 'Já tem conta? Faça login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
