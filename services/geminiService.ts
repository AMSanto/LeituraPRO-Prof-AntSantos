import { GoogleGenAI, Type } from "@google/genai";
import { Assessment, Student, GroundingSource } from "../types";

// Inicialização utilizando a variável de ambiente conforme as diretrizes.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Gera uma análise pedagógica multidisciplinar utilizando o Google Search para referências educacionais.
 */
export const generateStudentAnalysis = async (
  student: Student & { grade?: string }, 
  assessments: Assessment[]
): Promise<{ text: string, sources: GroundingSource[] }> => {
  const recentHistory = assessments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map(a => {
      let details = '';
      if (a.criteria) {
        const c = a.criteria;
        const fluency = Object.entries(c.fluency).filter(([,v]) => v).length;
        const comp = Object.entries(c.comprehension).filter(([,v]) => v).length;
        const math = c.math ? Object.entries(c.math).filter(([,v]) => v).length : 0;
        details = ` | Fluência: ${fluency}/4, Compreensão: ${comp}/5, Matemática: ${math}/5. Notas: L:${a.comprehension}, M:${a.mathScore || 'N/A'}`;
      }
      return `Data: ${a.date}, WPM: ${a.wpm}, Precisão: ${a.accuracy}%${details}. Obs: ${a.notes}`;
    })
    .join('\n');

  const prompt = `
    Atue como um especialista pedagógico multidisciplinar.
    Analise o progresso do aluno abaixo e, usando informações atualizadas sobre práticas pedagógicas de 2024/2025, forneça um relatório.

    Aluno: ${student.name} 
    Série: ${student.grade || 'N/A'}
    Nível de Leitura Atual: ${student.readingLevel}
    
    Histórico recente:
    ${recentHistory}
    
    Estrutura (Markdown):
    1. **Desempenho**: Síntese atualizada.
    2. **Insights do Navegador**: Baseie-se em tendências educacionais modernas do Google Search.
    3. **Sugestões Práticas**: 3 atividades baseadas em evidências científicas recentes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return {
      text: response.text || "Análise indisponível.",
      sources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingSource[]) || []
    };
  } catch (error) {
    console.error("Erro ao gerar análise:", error);
    return { text: "Erro ao conectar com o serviço de pesquisa do Google.", sources: [] };
  }
};

/**
 * Gera material de leitura pedagógico fundamentado em informações reais do Google Search.
 */
export const generateReadingMaterial = async (level: string, topic: string): Promise<{ title: string; content: string; questions: string[]; sources: GroundingSource[] }> => {
  const prompt = `Gere um material de leitura pedagógico para o nível: ${level}.
    O tema é: ${topic}. Utilize fatos reais e atualizados do Google Search para fundamentar o texto.
    O material deve conter um título, o texto e 3 perguntas de compreensão.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "content", "questions"]
        }
      }
    });

    const jsonStr = response.text?.trim();
    const data = JSON.parse(jsonStr || "{}");
    const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingSource[]) || [];

    return { ...data, sources };
  } catch (error) {
    console.error("Erro ao gerar material:", error);
    throw error;
  }
};