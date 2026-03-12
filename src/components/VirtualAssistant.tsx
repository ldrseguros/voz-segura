import { useState } from 'react';
import { MessageCircle, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Assistente Virtual"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span className="font-medium">Assistente de Ajuda</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-indigo-100 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto text-sm text-gray-700">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">Como funciona o anonimato?</p>
                <p>O sistema não registra seu IP, localização ou dados do dispositivo. Se escolher "Totalmente anônimo", nenhuma informação pessoal será ligada ao relato.</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">Como fazer um bom relato?</p>
                <p>Seja o mais específico possível. Inclua datas, locais, nomes de envolvidos e testemunhas, se houver. Quanto mais detalhes, mais fácil será a investigação.</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold text-gray-900 mb-1">Como acompanhar a denúncia?</p>
                <p>Ao finalizar, você receberá um código único (ex: VS-1234-ABC). Guarde-o com segurança. Use-o na opção "Acompanhar denúncia" para ver o status e conversar com o comitê.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
