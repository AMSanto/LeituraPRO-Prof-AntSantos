import React from 'react';
import { Student, Assessment } from '../types';
import { ArrowLeft, Calendar, FileText, CheckCircle, Clock, Book, Calculator } from 'lucide-react';

interface StudentHistoryProps {
  student: Student;
  assessments: Assessment[];
  onBack: () => void;
}

export const StudentHistory: React.FC<StudentHistoryProps> = ({ student, assessments, onBack }) => {
  // Ordenar avaliações da mais recente para a mais antiga
  const sortedAssessments = [...assessments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Desenvolvimento</h1>
          <p className="text-gray-500">Acompanhamento detalhado: {student.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center sticky top-8">
            <img 
              src={student.avatarUrl} 
              alt={student.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-primary-50 mb-4" 
            />
            <h2 className="text-lg font-bold text-gray-900">{student.name}</h2>
            <div className="mt-2 inline-flex px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              {student.readingLevel}
            </div>
            <div className="mt-6 w-full space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Total de Avaliações</span>
                 <span className="font-semibold">{assessments.length}</span>
               </div>
               <div className="w-full h-px bg-gray-100"></div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Média WPM</span>
                 <span className="font-semibold">
                   {assessments.length > 0 
                     ? Math.round(assessments.reduce((acc, curr) => acc + curr.wpm, 0) / assessments.length) 
                     : 0}
                 </span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-gray-500">Média Matemática</span>
                 <span className="font-semibold text-orange-600">
                   {assessments.length > 0 
                     ? (assessments.reduce((acc, curr) => acc + (curr.mathScore || 0), 0) / assessments.length).toFixed(1) 
                     : 0}
                 </span>
               </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3 space-y-4">
          {sortedAssessments.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-gray-200 border-dashed text-center">
              <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Nenhuma avaliação registrada para este aluno.</p>
            </div>
          ) : (
            sortedAssessments.map((assessment) => (
              <div key={assessment.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-gray-100 pb-4">
                   <div className="flex items-center gap-3">
                     <div className="bg-primary-50 p-2.5 rounded-lg text-primary-700">
                       <FileText className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-bold text-gray-900">{assessment.textTitle}</h3>
                       <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                         <Calendar className="w-3 h-3" />
                         {new Date(assessment.date).toLocaleDateString('pt-BR')}
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex gap-4">
                     <div className="text-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                       <div className="text-[10px] text-gray-400 font-bold uppercase">Leitura</div>
                       <div className="font-bold text-gray-900 text-lg flex items-center gap-1 justify-center">
                         <Clock className="w-4 h-4 text-primary-500" />
                         {assessment.wpm}
                       </div>
                     </div>
                     <div className="text-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                       <div className="text-[10px] text-gray-400 font-bold uppercase">Matemática</div>
                       <div className="font-bold text-orange-600 text-lg flex items-center gap-1 justify-center">
                         <Calculator className="w-4 h-4 text-orange-400" />
                         {assessment.mathScore || '-'}
                       </div>
                     </div>
                   </div>
                </div>

                <div className="space-y-4">
                   {/* Notas */}
                   <div>
                     <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Observações:</p>
                     <p className="text-gray-600 text-sm italic bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                       "{assessment.notes || 'Sem observações adicionais.'}"
                     </p>
                   </div>

                   {/* Critérios Combinados */}
                   {assessment.criteria && (
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                       <div className="bg-blue-50/40 p-3 rounded-lg border border-blue-100">
                         <h4 className="text-[10px] font-bold text-blue-700 uppercase mb-2">Fluência</h4>
                         <div className="flex flex-wrap gap-1.5">
                           {assessment.criteria.fluency.rhythm && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded">Ritmo</span>}
                           {assessment.criteria.fluency.intonation && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded">Entonação</span>}
                           {assessment.criteria.fluency.security && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded">Segurança</span>}
                         </div>
                       </div>
                       <div className="bg-primary-50/40 p-3 rounded-lg border border-primary-100">
                         <h4 className="text-[10px] font-bold text-primary-700 uppercase mb-2">Compreensão</h4>
                         <div className="flex flex-wrap gap-1.5">
                           {assessment.criteria.comprehension.mainIdea && <span className="bg-primary-100 text-primary-700 text-[10px] px-1.5 py-0.5 rounded">Ideia Princ.</span>}
                           {assessment.criteria.comprehension.inference && <span className="bg-primary-100 text-primary-700 text-[10px] px-1.5 py-0.5 rounded">Inferência</span>}
                         </div>
                       </div>
                       <div className="bg-orange-50/40 p-3 rounded-lg border border-orange-100">
                         <h4 className="text-[10px] font-bold text-orange-700 uppercase mb-2">Matemática</h4>
                         <div className="flex flex-wrap gap-1.5">
                           {assessment.criteria.math?.numberSense && <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded">S. Numérico</span>}
                           {assessment.criteria.math?.operations && <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded">Operações</span>}
                           {assessment.criteria.math?.problemSolving && <span className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0.5 rounded">Prob.</span>}
                         </div>
                       </div>
                     </div>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};