import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Report, ChatMessage } from '../types';
import { Search, Send, Clock, CheckCircle, AlertCircle, User, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

interface TrackReportProps {
  key?: string;
  onBack: () => void;
  reports: Report[];
  updateReport: (report: Report) => void;
}

export function TrackReport({ onBack, reports, updateReport }: TrackReportProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = reports.find(r => r.id === code.trim().toUpperCase());
    if (found) {
      setReport(found);
      setError('');
    } else {
      setError('Código não encontrado. Verifique se digitou corretamente.');
      setReport(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !report) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    const updatedReport = {
      ...report,
      messages: [...report.messages, msg],
    };

    setReport(updatedReport);
    updateReport(updatedReport);
    setNewMessage('');

    // Simulate committee response
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'committee',
        text: 'Recebemos sua mensagem. O comitê de ética está analisando as informações adicionais.',
        timestamp: new Date().toISOString(),
      };
      const reportWithReply = {
        ...updatedReport,
        messages: [...updatedReport.messages, reply],
      };
      setReport(reportWithReply);
      updateReport(reportWithReply);
    }, 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [report?.messages]);

  if (!report) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Acompanhar Denúncia</h2>
          <p className="text-slate-500 mt-2">Insira o código gerado ao final do seu relato.</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
              Código de Acompanhamento
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: VS-4831-AK9"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors uppercase font-mono text-center text-lg tracking-widest"
              required
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Consultar Status
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 px-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-colors"
          >
            Voltar ao Início
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto grid md:grid-cols-3 gap-6"
    >
      <div className="md:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <button onClick={() => setReport(null)} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-6 flex items-center">
            &larr; Voltar para busca
          </button>
          
          <h3 className="text-lg font-bold text-slate-900 mb-4">Detalhes do Relato</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Código</p>
              <p className="font-mono font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block mt-1">{report.id}</p>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Status Atual</p>
              <div className="flex items-center mt-1 space-x-2">
                {report.status === 'Recebida' && <Clock className="w-5 h-5 text-amber-500" />}
                {report.status === 'Em análise' && <Search className="w-5 h-5 text-blue-500" />}
                {report.status === 'Em investigação' && <AlertCircle className="w-5 h-5 text-indigo-500" />}
                <span className="font-medium text-slate-900">{report.status}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Tipo</p>
              <p className="font-medium text-slate-900 mt-1">{report.incidentType}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Data do Relato</p>
              <p className="font-medium text-slate-900 mt-1">{new Date(report.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Comitê de Ética</h3>
              <p className="text-xs text-slate-500">Comunicação segura e anônima</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
          {report.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                msg.sender === 'user' 
                  ? "bg-indigo-600 text-white rounded-br-sm" 
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
              )}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={cn(
                  "text-[10px] mt-2 text-right",
                  msg.sender === 'user' ? "text-indigo-200" : "text-slate-400"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100 rounded-b-3xl">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Envie uma mensagem ou informação adicional..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-slate-50"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
