import React, { useState, useEffect, useRef } from 'react';
import { Student, SchoolClass, GroundingSource } from '../types';
import { Search, Plus, MoreVertical, BookOpen, User, School, Filter, Printer, Edit, Trash2, Image as ImageIcon, History, Upload, ExternalLink, Globe } from 'lucide-react';
import { generateStudentAnalysis } from '../services/geminiService';
import { Assessment } from '../types';

interface StudentListProps {
  students: Student[];
  classes: SchoolClass[];
  assessments: Assessment[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewHistory: (id: string) => void;
  initialClassId?: string;
}

export const StudentList: React.FC<StudentListProps> = ({ 
  students, 
  classes, 
  assessments, 
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onViewHistory,
  initialClassId = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassId, setFilterClassId] = useState(initialClassId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | undefined>(undefined);
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{ text: string, sources: GroundingSource[] } | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (initialClassId) {
      setFilterClassId(initialClassId);
    }
  }, [initialClassId]);

  const getClassName = (classId: string) => classes.find(c => c.id === classId)?.name || 'Sem turma';

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClassId ? s.classId === filterClassId : true;
    return matchesSearch && matchesClass;
  });

  const handleGenerateReport = async (student: Student) => {
    setLoadingAi(true);
    setAiAnalysis(null);
    setSelectedStudent(student);
    
    const studentClass = classes.find(c => c.id === student.classId);
    const enrichedStudent = { ...student, grade: studentClass?.gradeLevel || 'N/A' };

    const studentAssessments = assessments.filter(a => a.studentId === student.id);
    const report = await generateStudentAnalysis(enrichedStudent, studentAssessments);
    
    setAiAnalysis(report);
    setLoadingAi(false);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setAiAnalysis(null);
  };

  const handleOpenAddModal = () => {
    setStudentToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Alunos</h1>
          <p className="text-gray-500 text-sm">Gerencie o desempenho individual</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Aluno
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative md:w-1/3">
          <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterClassId}
            onChange={(e) => setFilterClassId(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm appearance-none"
          >
            <option value="">Todas as Turmas</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por nome do aluno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => (
          <div key={student.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img src={student.avatarUrl} alt={student.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary-100 bg-gray-100" />
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                     <School className="w-3 h-3" />
                     {getClassName(student.classId)}
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === student.id ? null : student.id);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {activeMenuId === student.id && (
                  <div ref={menuRef} className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden animate-fade-in">
                     <button onClick={() => { onViewHistory(student.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <History className="w-4 h-4" /> Ver Histórico
                    </button>
                    <button onClick={() => handleOpenEditModal(student)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Edit className="w-4 h-4" /> Editar
                    </button>
                    <button onClick={() => { onDeleteStudent(student.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
               <span className="text-xs font-medium text-primary-700 bg-primary-50 px-2 py-1 rounded">
                 {student.readingLevel}
               </span>
               <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                 {assessments.filter(a => a.studentId === student.id).length} Avaliações
               </span>
            </div>

            <button 
              onClick={() => handleGenerateReport(student)}
              className="w-full mt-2 py-2 px-3 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Análise com Google Search
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <StudentModal 
          classes={classes}
          studentToEdit={studentToEdit}
          onClose={() => setIsModalOpen(false)} 
          onSave={(s) => {
            if (studentToEdit) onUpdateStudent({ ...studentToEdit, ...s });
            else onAddStudent(s);
          }} 
        />
      )}

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:bg-white">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary-600" />
                Relatório de {selectedStudent.name}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              {loadingAi ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
                  <p className="text-gray-500">O Google Search está fundamentando a análise...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="prose prose-primary max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {aiAnalysis?.text}
                  </div>
                  
                  {aiAnalysis?.sources && aiAnalysis.sources.length > 0 && (
                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Fontes Consultadas via Google
                      </h4>
                      <div className="space-y-2">
                        {aiAnalysis.sources.map((source, idx) => source.web && (
                          <a 
                            key={idx} 
                            href={source.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all text-xs text-primary-700 font-medium"
                          >
                            {source.web.title || source.web.uri}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={closeModal} className="px-6 py-2 bg-gray-900 text-white rounded-lg">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ... Restante do arquivo StudentModal permanece similar
const StudentModal: React.FC<any> = ({ classes, studentToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({ 
    name: studentToEdit?.name || '', 
    classId: studentToEdit?.classId || (classes.length > 0 ? classes[0].id : ''), 
    readingLevel: studentToEdit?.readingLevel || 'Iniciante',
    avatarUrl: studentToEdit?.avatarUrl || ''
  });
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatarUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({ ...formData, avatarUrl: formData.avatarUrl || `https://picsum.photos/seed/${Math.random()}/200` });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">{studentToEdit ? 'Editar Aluno' : 'Novo Aluno'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input required type="text" className="w-full border p-2 rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Foto</label>
            <input type="file" className="text-sm" onChange={handleFileChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Turma</label>
            <select className="w-full border p-2 rounded-lg" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})}>
              {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
