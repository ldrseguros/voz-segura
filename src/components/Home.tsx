import { motion } from 'motion/react';
import { ShieldAlert, Search, Phone, Shield, Scale, HeartHandshake, Stethoscope, AlertCircle } from 'lucide-react';

interface HomeProps {
  key?: string;
  onStartReport: () => void;
  onTrackReport: () => void;
}

export function Home({ onStartReport, onTrackReport }: HomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-3xl mx-auto text-center space-y-12"
    >
      <div className="space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Canal Anônimo de Denúncias
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Relate situações de assédio, discriminação, fraude ou conduta inadequada de forma segura e confidencial. Sua voz é importante para um ambiente de trabalho melhor.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <button
          onClick={onStartReport}
          className="group relative flex flex-col items-center justify-center p-8 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          <div className="bg-white/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <span className="text-xl font-bold mb-2">Fazer uma denúncia</span>
          <span className="text-indigo-100 text-sm text-center">
            Relate um incidente de forma segura e anônima.
          </span>
        </button>

        <button
          onClick={onTrackReport}
          className="group relative flex flex-col items-center justify-center p-8 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl shadow-sm hover:border-indigo-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          <div className="bg-slate-100 p-4 rounded-full mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <Search className="w-8 h-8 text-slate-600 group-hover:text-indigo-600" />
          </div>
          <span className="text-xl font-bold mb-2">Acompanhar denúncia</span>
          <span className="text-slate-500 text-sm text-center">
            Consulte o status e interaja com o comitê.
          </span>
        </button>
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 max-w-4xl mx-auto text-left shadow-sm">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-8 h-8 text-rose-600" />
          <h2 className="text-2xl font-bold text-slate-900">Precisa de ajuda imediata?</h2>
        </div>
        <p className="text-slate-700 mb-8 text-lg">
          Se você estiver em situação de risco ou precisar de apoio imediato, procure um dos canais oficiais abaixo.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Polícia Militar</h3>
            </div>
            <div className="mb-2">
              <span className="inline-block bg-rose-600 text-white font-black text-xl px-3 py-1 rounded-lg tracking-wider shadow-sm">190</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Para emergências ou situações de perigo imediato.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 leading-tight">Central de Atendimento à Mulher</h3>
            </div>
            <div className="mb-2">
              <span className="inline-block bg-rose-600 text-white font-black text-xl px-3 py-1 rounded-lg tracking-wider shadow-sm">Ligue 180</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Canal nacional gratuito e confidencial que orienta e recebe denúncias de violência contra a mulher.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">Delegacia da Mulher</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              Procure a delegacia especializada mais próxima para registrar ocorrência e solicitar medidas protetivas.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 leading-tight">Ministério Público / Promotorias</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              Órgãos que atuam na proteção das vítimas e podem orientar sobre direitos e medidas legais.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900">CRAM</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              Centros de Referência de Atendimento à Mulher oferecem acolhimento psicológico, social e orientação jurídica.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-rose-100 p-2 rounded-full text-rose-600">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 leading-tight">Serviços de Saúde</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              Hospitais e centros de saúde podem oferecer atendimento médico e psicológico especializado à violência sexual.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
