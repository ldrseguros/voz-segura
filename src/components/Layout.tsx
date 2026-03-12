import { ReactNode } from 'react';
import { AnonymousIndicator } from './AnonymousIndicator';
import { VirtualAssistant } from './VirtualAssistant';
import { Shield } from 'lucide-react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <AnonymousIndicator />
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Voz Segura</span>
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        {children}
      </main>
      <VirtualAssistant />
    </div>
  );
}
