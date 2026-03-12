import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Report, IncidentType, ChatMessage } from '../types';
import { generateTrackingCode, cn } from '../lib/utils';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { 
  Building2, UserX, UserCheck, Edit3, Mic, ArrowRight, 
  ArrowLeft, CheckCircle2, AlertTriangle, Copy, ShieldCheck,
  Sparkles, Send
} from 'lucide-react';

interface ReportFlowProps {
  key?: string;
  onComplete: (report: Report) => void;
  onCancel: () => void;
}

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function ReportFlow({ onComplete, onCancel }: ReportFlowProps) {
  const [step, setStep] = useState<Step>(0);
  const [reportData, setReportData] = useState<Partial<Report>>({
    destinationType: 'registered',
    complianceEmail: '',
    company: '',
    anonymity: 'anonymous',
    incidentType: '',
    date: '',
    location: '',
    peopleInvolved: '',
    witnesses: '',
    description: '',
  });
  
  const [method, setMethod] = useState<'manual' | 'voice' | null>(null);
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechRecognition();
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  
  const [isStructuring, setIsStructuring] = useState(false);
  const [structuredText, setStructuredText] = useState('');
  const [originalText, setOriginalText] = useState('');

  const nextStep = () => {
    if (step === 4 && !isStructuring) {
      setStep(6);
    } else if (step === 5) {
      handleUpdate('description', structuredText);
      setStep(6);
    } else {
      setStep((s) => Math.min(s + 1, 7) as Step);
    }
  };

  const prevStep = () => {
    if (step === 6 && !structuredText) {
      setStep(4);
    } else {
      setStep((s) => Math.max(s - 1, 0) as Step);
    }
  };

  const handleUpdate = (field: keyof Report, value: any) => {
    setReportData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVoiceProcess = () => {
    setIsProcessingVoice(true);
    // Simulate AI structuring the text
    setTimeout(() => {
      const lowerTranscript = transcript.toLowerCase();
      let suggestedType: IncidentType = 'Outro';
      
      if (lowerTranscript.includes('assédio') || lowerTranscript.includes('tocou')) {
        suggestedType = 'Assédio';
      } else if (lowerTranscript.includes('roubo') || lowerTranscript.includes('dinheiro') || lowerTranscript.includes('fraude')) {
        suggestedType = 'Fraude';
      } else if (lowerTranscript.includes('racismo') || lowerTranscript.includes('preconceito') || lowerTranscript.includes('discriminação')) {
        suggestedType = 'Discriminação';
      }

      setReportData(prev => ({
        ...prev,
        description: transcript,
        incidentType: suggestedType,
      }));
      
      setIsProcessingVoice(false);
      setMethod('manual'); // Switch to manual to review and edit
    }, 1500);
  };

  const handleStructureWithAI = async () => {
    setIsStructuring(true);
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é um assistente especializado em estruturar relatos de denúncias corporativas para equipes de compliance.

Sua função é receber um relato informal e transformá-lo em um relatório claro, objetivo e bem estruturado.

Regras:
* Não invente informações.
* Não altere o significado do relato.
* Apenas organize e corrija o texto.
* Se alguma informação não estiver presente, escreva "Não informado".

Estruture exatamente neste formato:

Tipo de incidente:
[tipo mais provável]

Data do ocorrido:
[informado ou "Não informado"]

Local do ocorrido:
[informado ou "Não informado"]

Pessoas envolvidas:
[informado ou "Não informado"]

Testemunhas:
[informado ou "Não informado"]

Descrição estruturada do ocorrido:
[texto organizado]

RELATO ORIGINAL:
"""
${reportData.description}
"""`
      });
      
      setOriginalText(reportData.description || '');
      setStructuredText(response.text || '');
      setStep(5);
    } catch (error) {
      console.error("Error structuring report:", error);
      alert("Ocorreu um erro ao estruturar o relato. Tente novamente.");
    } finally {
      setIsStructuring(false);
    }
  };

  const handleSubmit = () => {
    const finalReport: Report = {
      ...reportData,
      id: generateTrackingCode(),
      status: 'Recebida',
      createdAt: new Date().toISOString(),
      messages: [{
        id: Date.now().toString(),
        sender: 'committee',
        text: 'Olá. Recebemos seu relato e garantimos total sigilo. O comitê de ética iniciará a análise em breve. Você pode usar este canal para enviar mais informações ou tirar dúvidas de forma anônima.',
        timestamp: new Date().toISOString()
      }]
    } as Report;
    
    setReportData(finalReport);
    nextStep(); // Go to success step
    onComplete(finalReport);
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Como deseja enviar esta denúncia?</h2>
              <p className="text-slate-500 mt-2">Escolha o destino do seu relato.</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => { handleUpdate('destinationType', 'registered'); nextStep(); }}
                className="flex items-start p-6 rounded-2xl border-2 text-left transition-all duration-200 border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
              >
                <div className="p-3 rounded-full mr-4 bg-indigo-100 text-indigo-600">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Empresa já utiliza o Voz Segura</h3>
                  <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                    A empresa já possui cadastro no Voz Segura. Sua denúncia será encaminhada diretamente para o comitê de ética ou compliance da empresa.
                  </p>
                </div>
              </button>

              <button
                onClick={() => { handleUpdate('destinationType', 'direct_email'); nextStep(); }}
                className="flex items-start p-6 rounded-2xl border-2 text-left transition-all duration-200 border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
              >
                <div className="p-3 rounded-full mr-4 bg-slate-100 text-slate-500">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Enviar diretamente para o compliance da empresa</h3>
                  <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                    Se sua empresa ainda não utiliza o Voz Segura, você pode enviar esta denúncia diretamente para o e-mail do setor de compliance ou recursos humanos.
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Identificação da Empresa</h2>
              <p className="text-slate-500 mt-2">Para direcionarmos seu relato ao comitê correto.</p>
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
                Código ou Nome da Empresa
              </label>
              <input
                type="text"
                id="company"
                value={reportData.company}
                onChange={(e) => handleUpdate('company', e.target.value)}
                placeholder="Ex: EMPRESA-123 ou Nome da Empresa"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                autoFocus
              />
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Nível de Anonimato</h2>
              <p className="text-slate-500 mt-2">Sua identidade será protegida em ambas as opções.</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleUpdate('anonymity', 'anonymous')}
                className={cn(
                  "flex items-start p-6 rounded-2xl border-2 text-left transition-all duration-200",
                  reportData.anonymity === 'anonymous' 
                    ? "border-emerald-500 bg-emerald-50/50 shadow-sm" 
                    : "border-slate-200 hover:border-emerald-200 hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "p-3 rounded-full mr-4",
                  reportData.anonymity === 'anonymous' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                )}>
                  <UserX className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    Totalmente Anônimo
                    <span className="ml-3 text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase tracking-wide">
                      Recomendado
                    </span>
                  </h3>
                  <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                    Nenhuma informação pessoal será coletada. O comitê não saberá quem você é.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleUpdate('anonymity', 'identified')}
                className={cn(
                  "flex items-start p-6 rounded-2xl border-2 text-left transition-all duration-200",
                  reportData.anonymity === 'identified' 
                    ? "border-indigo-500 bg-indigo-50/50 shadow-sm" 
                    : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "p-3 rounded-full mr-4",
                  reportData.anonymity === 'identified' ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                )}>
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Identificado (Confidencial)</h3>
                  <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                    Você fornecerá seus dados, mas eles serão mantidos em sigilo absoluto pelo comitê de ética.
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Como deseja fazer o relato?</h2>
              <p className="text-slate-500 mt-2">Escolha a forma mais confortável para você.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <button
                onClick={() => { setMethod('manual'); nextStep(); }}
                className="group flex flex-col items-center p-8 rounded-3xl border-2 border-slate-200 hover:border-indigo-600 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="bg-slate-50 p-5 rounded-full mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Edit3 className="w-10 h-10 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Preencher Manualmente</h3>
                <p className="text-slate-500 text-center text-sm leading-relaxed">
                  Preencha os campos com os detalhes do ocorrido no seu tempo.
                </p>
              </button>

              <button
                onClick={() => { setMethod('voice'); nextStep(); }}
                className="group flex flex-col items-center p-8 rounded-3xl border-2 border-slate-200 hover:border-indigo-600 hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="bg-slate-50 p-5 rounded-full mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Mic className="w-10 h-10 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Relatar por Voz</h3>
                <p className="text-slate-500 text-center text-sm leading-relaxed">
                  Conte o que aconteceu. A IA irá transcrever e ajudar a organizar seu relato.
                </p>
              </button>
            </div>
          </motion.div>
        );

      case 4:
        if (method === 'voice') {
          return (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Relato por Voz</h2>
                <p className="text-slate-500 mt-2">Fale naturalmente. Nós transcreveremos para você.</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-8">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={cn(
                    "relative flex items-center justify-center w-32 h-32 rounded-full shadow-2xl transition-all duration-300 focus:outline-none",
                    isListening 
                      ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                      : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
                  )}
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75"></span>
                  )}
                  <Mic className="w-12 h-12 text-white z-10" />
                </button>
                
                <p className="text-lg font-medium text-slate-700">
                  {isListening ? "Gravando... Clique para parar." : "Clique no microfone para começar"}
                </p>

                <div className="w-full max-w-2xl bg-slate-50 rounded-2xl p-6 min-h-[150px] border border-slate-200 shadow-inner">
                  {transcript ? (
                    <p className="text-slate-800 leading-relaxed text-lg">{transcript}</p>
                  ) : (
                    <p className="text-slate-400 italic text-center mt-8">Sua transcrição aparecerá aqui...</p>
                  )}
                </div>

                {transcript && !isListening && (
                  <button
                    onClick={handleVoiceProcess}
                    disabled={isProcessingVoice}
                    className="flex items-center px-8 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-70"
                  >
                    {isProcessingVoice ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-3 animate-spin" />
                        A IA está estruturando seu relato...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        Revisar e Estruturar Relato
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        }

        // Manual Flow
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Detalhes do Relato</h2>
              <p className="text-slate-500 mt-2">Preencha com o máximo de informações que puder.</p>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Incidente *</label>
                <select
                  value={reportData.incidentType}
                  onChange={(e) => handleUpdate('incidentType', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Assédio">Assédio</option>
                  <option value="Discriminação">Discriminação</option>
                  <option value="Fraude">Fraude</option>
                  <option value="Conduta inadequada">Conduta inadequada</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data (Aproximada)</label>
                  <input
                    type="date"
                    value={reportData.date}
                    onChange={(e) => handleUpdate('date', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Local</label>
                  <input
                    type="text"
                    value={reportData.location}
                    onChange={(e) => handleUpdate('location', e.target.value)}
                    placeholder="Ex: Sala de reunião 2, Refeitório"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pessoas Envolvidas</label>
                <input
                  type="text"
                  value={reportData.peopleInvolved}
                  onChange={(e) => handleUpdate('peopleInvolved', e.target.value)}
                  placeholder="Nomes ou cargos dos envolvidos"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Descrição Detalhada *</label>
                <textarea
                  value={reportData.description}
                  onChange={(e) => handleUpdate('description', e.target.value)}
                  rows={6}
                  placeholder="Descreva o que aconteceu com o máximo de detalhes possível..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                ></textarea>

                {reportData.description && reportData.description.length > 10 && (
                  <button
                    onClick={handleStructureWithAI}
                    disabled={isStructuring}
                    className="mt-4 flex items-center px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors border border-indigo-200 w-full justify-center disabled:opacity-70"
                  >
                    {isStructuring ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Estruturando relato...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        ✨ Estruturar relato com IA
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* AI Assistant Suggestion Simulation */}
              {reportData.description && reportData.description.length > 20 && (!reportData.location || !reportData.date) && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">Dica da IA Assistente</p>
                    <p className="text-sm text-indigo-700 mt-1">
                      Seu relato pode ficar mais completo se você incluir {(!reportData.location && !reportData.date) ? 'a data e o local' : !reportData.location ? 'o local' : 'a data'} do ocorrido. Isso ajuda muito na investigação.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Relato Estruturado</h2>
              <p className="text-slate-500 mt-2">A IA organizou seu relato. Você pode editar o texto final antes de prosseguir.</p>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Relato Original</label>
                <div className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 whitespace-pre-wrap text-sm">
                  {originalText}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Relato Estruturado pela IA</label>
                <textarea
                  value={structuredText}
                  onChange={(e) => setStructuredText(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none bg-white shadow-sm"
                ></textarea>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center mb-8">
              <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Revisão Final</h2>
              <p className="text-slate-500 mt-2">Revise as informações antes de enviar de forma segura.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                <div className="p-4 sm:p-6 grid sm:grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-slate-500">Empresa</div>
                  <div className="sm:col-span-2 font-medium text-slate-900">{reportData.company}</div>
                </div>
                <div className="p-4 sm:p-6 grid sm:grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-slate-500">Anonimato</div>
                  <div className="sm:col-span-2 font-medium text-slate-900">
                    {reportData.anonymity === 'anonymous' ? 'Totalmente Anônimo' : 'Identificado (Confidencial)'}
                  </div>
                </div>
                <div className="p-4 sm:p-6 grid sm:grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-slate-500">Tipo de Incidente</div>
                  <div className="sm:col-span-2 font-medium text-slate-900">{reportData.incidentType || 'Não especificado'}</div>
                </div>
                <div className="p-4 sm:p-6 grid sm:grid-cols-3 gap-4">
                  <div className="text-sm font-medium text-slate-500">Descrição</div>
                  <div className="sm:col-span-2 text-slate-700 whitespace-pre-wrap">{reportData.description}</div>
                </div>
                {reportData.destinationType === 'direct_email' && (
                  <div className="p-4 sm:p-6 grid sm:grid-cols-3 gap-4 bg-indigo-50/50">
                    <div className="text-sm font-medium text-slate-500">E-mail do compliance ou RH *</div>
                    <div className="sm:col-span-2">
                      <input
                        type="email"
                        value={reportData.complianceEmail}
                        onChange={(e) => handleUpdate('complianceEmail', e.target.value)}
                        placeholder="Ex: compliance@empresa.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" required id="confirm" />
                <span className="text-sm text-slate-700 leading-relaxed">
                  Confirmo que este relato é verdadeiro de acordo com meu conhecimento e entendo que falsas acusações intencionais podem ter consequências.
                </span>
              </label>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-8"
          >
            <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold text-slate-900">
                {reportData.destinationType === 'direct_email' 
                  ? 'Denúncia enviada com sucesso para o e-mail informado.' 
                  : 'Relato Enviado com Sucesso!'}
              </h2>
              <p className="text-lg text-slate-600 max-w-lg mx-auto">
                {reportData.destinationType === 'direct_email'
                  ? 'Sua voz foi ouvida. O e-mail foi encaminhado de forma segura e anônima para o setor responsável.'
                  : 'Sua voz foi ouvida. O comitê de ética já foi notificado e iniciará a análise em breve.'}
              </p>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-3xl p-8 max-w-md mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
              <p className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-4">Seu Código de Acompanhamento</p>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <span className="text-4xl font-mono font-bold text-slate-900 tracking-widest bg-white px-6 py-4 rounded-xl shadow-sm border border-indigo-100">
                  {reportData.id}
                </span>
              </div>
              
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(reportData.id || '');
                  alert('Código copiado!');
                }}
                className="flex items-center justify-center w-full py-3 bg-white text-indigo-600 border border-indigo-200 rounded-xl font-medium hover:bg-indigo-50 transition-colors"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copiar Código
              </button>
              
              <p className="text-sm text-indigo-700 mt-6 leading-relaxed">
                <strong>Guarde este código em um local seguro.</strong> Ele é a única forma de acompanhar sua denúncia e conversar com o comitê de forma anônima.
              </p>
            </div>

            <button
              onClick={onCancel}
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Voltar ao Início
            </button>
          </motion.div>
        );
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !reportData.company;
    if (step === 4 && method === 'manual') return !reportData.incidentType || !reportData.description;
    if (step === 5) return !structuredText;
    if (step === 6 && reportData.destinationType === 'direct_email') return !reportData.complianceEmail;
    return false;
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
      {/* Progress Bar */}
      {step > 0 && step < 7 && (
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-2 w-8 sm:w-12 rounded-full transition-colors duration-300",
                  i < (step === 5 ? 5 : step === 6 ? 6 : step) ? "bg-indigo-600" : i === (step === 5 ? 5 : step === 6 ? 6 : step) ? "bg-indigo-400" : "bg-slate-200"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-slate-500">Passo {step === 5 ? 5 : step === 6 ? 6 : step} de 6</span>
        </div>
      )}

      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <div key={step}>
            {renderStepContent()}
          </div>
        </AnimatePresence>

        {step < 7 && (
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              onClick={step === 0 ? onCancel : prevStep}
              className="flex items-center px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              {step === 0 ? 'Cancelar' : (
                <>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Voltar
                </>
              )}
            </button>

            {step === 6 ? (
              <button
                onClick={() => {
                  const checkbox = document.getElementById('confirm') as HTMLInputElement;
                  if (checkbox && checkbox.checked) {
                    if (reportData.destinationType === 'direct_email' && !reportData.complianceEmail) {
                      alert('Por favor, preencha o e-mail do compliance.');
                      return;
                    }
                    handleSubmit();
                  } else {
                    alert('Por favor, confirme que o relato é verdadeiro.');
                  }
                }}
                className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
              >
                Enviar Denúncia
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </button>
            ) : (
              // Don't show next button on step 0 (destination selection), step 3 (method selection) or step 4 (voice recording)
              (step !== 0 && step !== 3 && !(step === 4 && method === 'voice')) && (
                <button
                  onClick={nextStep}
                  disabled={isNextDisabled()}
                  className="flex items-center px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
