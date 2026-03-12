import { ShieldCheck } from 'lucide-react';

export function AnonymousIndicator() {
  return (
    <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-center text-emerald-800 text-sm font-medium">
      <ShieldCheck className="w-4 h-4 mr-2" />
      <span>Modo anônimo ativo — sua identidade não está sendo rastreada.</span>
    </div>
  );
}
