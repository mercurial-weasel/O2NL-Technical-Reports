import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '@lib/auth';
import { Header, Footer, Section, Card, Button } from '@common';
import { logger } from '@lib/logger';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, state } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    logger.info('Login page accessed');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      logger.info('Login attempt', { email });
      await signIn(email, password);
      logger.info('Login successful', { email });
      navigate('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
      logger.error('Login failed', { email, error: errorMessage });
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <div className="max-w-md mx-auto">
            <Card className="p-6" hover>
              <div className="text-center mb-6">
                <LogIn className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-text-primary">Welcome Back</h1>
                <p className="text-text-secondary mt-2">
                  Sign in to access O2NL Data Intelligence
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  icon={LogIn}
                  loading={state.loading}
                  fullWidth
                >
                  Sign In
                </Button>
              </form>
            </Card>
          </div>
        </Section>
      </div>
      <Footer />
    </div>
  );
}