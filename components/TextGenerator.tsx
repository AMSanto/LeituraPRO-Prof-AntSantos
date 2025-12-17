import React, { useState } from 'react';
import { generateReadingMaterial } from '../services/geminiService';
import { Sparkles, Printer, Copy, RefreshCw, Globe, ExternalLink } from 'lucide-react';
import { ReadingMaterial } from '../types';

export const TextGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('2º Ano Fundamental');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReadingMaterial | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await generateReadingMaterial(level, topic);
      setResult({
        ...data,
        level: level,
        suggestedQuestions: data.questions
      });
    } catch (err) {
      setError('Erro ao gerar material. Tente novamente ou verifique as configurações.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      const text = `${result.title}\n\n${result.content}\n\nPerguntas:\n${result.suggestedQuestions.join('\n')}`;
      navigator.clipboard.writeText(text);
      alert("Texto copiado!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Globe className="w-8 h-8 text-white opacity-80" />
          Gerador com Google Search
        </h1>
        <p className="opacity-90 max-w-xl">
          Crie materiais de leitura fundamentados em fatos reais e tendências pedagógicas atuais pesquisadas em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível Escolar</label>
              <select 
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary-500"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option>1º Ano Fundamental</option>
                <option>2º Ano Fundamental</option>
                <option>3º Ano Fundamental</option>
                <option>4º Ano Fundamental</option>
                <option>5º Ano Fundamental</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema Atual</label>
              <input 
                type="text"
                required
                placeholder="Ex: Mudanças Climáticas, Olimpíadas..."
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary-500"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all ${
                loading ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Pesquisando...' : 'Gerar com Google'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>

        <div className="md:col-span-2">
          {result ? (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">{result.title}</h2>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-serif whitespace-pre-wrap">
                    {result.content}
                  </div>
                </div>
                
                <div className="p-6 bg-primary-50 border-t border-primary-100">
                  <h3 className="font-semibold text-primary-900 mb-3">Questões de Compreensão:</h3>
                  <ul className="list-disc list-inside space-y-2 text-primary-800 text-sm">
                    {result.suggestedQuestions.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t border-gray-200">
                  <button onClick={() => window.print()} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg flex items-center gap-2 text-sm">
                    <Printer className="w-4 h-4" /> Imprimir
                  </button>
                  <button onClick={copyToClipboard} className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 text-sm shadow-sm">
                    <Copy className="w-4 h-4" /> Copiar
                  </button>
                </div>
              </div>

              {result.sources && result.sources.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary-600" /> Referências de Pesquisa (Grounding)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.sources.map((source, idx) => source.web && (
                      <a 
                        key={idx} 
                        href={source.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 text-xs text-primary-700 truncate"
                      >
                        {source.web.title || source.web.uri}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
              <Globe size={48} className="mb-4 opacity-30" />
              <p>O navegador Google ajudará a criar o texto...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
