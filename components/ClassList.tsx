import React, { useState, useEffect, useRef } from 'react';
import { SchoolClass, Student } from '../types';
import { School, Plus, Users, ArrowRight, MoreVertical, Edit, Trash2 } from 'lucide-react';

interface ClassListProps {
  classes: SchoolClass[];
  students: Student[];
  onAddClass: (newClass: Omit<SchoolClass, 'id'>) => void;
  onUpdateClass: (updatedClass: SchoolClass) => void;
  onDeleteClass: (id: string) => void;
  onViewStudents: (classId: string) => void;
}

export const ClassList: React.FC<ClassListProps> = ({ 
  classes, 
  students, 
  onAddClass, 
  onUpdateClass,
  onDeleteClass,
  onViewStudents 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<SchoolClass | undefined>(undefined);
  
  // State for Dropdown Menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAdd = () => {
    setClassToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cls: SchoolClass) => {
    setClassToEdit(cls);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
    onDeleteClass(id);
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Turmas</h1>
          <p className="text-gray-500">Gerencie as turmas e anos letivos</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nova Turma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => {
          const studentCount = students.filter(s => s.classId === cls.id).length;
          return (
            <div key={cls.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative">
               <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <School className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                    {cls.year}
                    </span>
                    <div className="relative">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === cls.id ? null : cls.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {activeMenuId === cls.id && (
                            <div ref={menuRef} className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 overflow-hidden animate-fade-in">
                                <button 
                                    onClick={() => handleOpenEdit(cls)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" /> Editar
                                </button>
                                <button 
                                    onClick={() => handleDelete(cls.id)}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Excluir
                                </button>
                            </div>
                        )}
                    </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{cls.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{cls.gradeLevel}</p>
              
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg mb-6">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{studentCount} Alunos cadastrados</span>
              </div>

              <div className="mt-auto">
                <button 
                  onClick={() => onViewStudents(cls.id)}
                  className="w-full py-2.5 px-4 border border-primary-200 text-primary-700 hover:bg-primary-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Ver Alunos
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <ClassModal 
            classToEdit={classToEdit}
            onClose={() => setIsModalOpen(false)} 
            onSave={(c) => {
                if (classToEdit) {
                    onUpdateClass({ ...classToEdit, ...c });
                } else {
                    onAddClass(c);
                }
            }} 
        />
      )}
    </div>
  );
};

const ClassModal: React.FC<{ classToEdit?: SchoolClass, onClose: () => void, onSave: (c: Omit<SchoolClass, 'id'>) => void }> = ({ classToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({ 
    name: classToEdit?.name || '', 
    gradeLevel: classToEdit?.gradeLevel || '', 
    year: classToEdit?.year || new Date().getFullYear() 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-900">{classToEdit ? 'Editar Turma' : 'Nova Turma'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
            <input 
              required 
              type="text" 
              placeholder="Ex: Turma 2A"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Série / Nível</label>
            <input 
              required 
              type="text" 
              placeholder="Ex: 2º Ano Fundamental"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none" 
              value={formData.gradeLevel} 
              onChange={e => setFormData({...formData, gradeLevel: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano Letivo</label>
            <input 
              required 
              type="number" 
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none" 
              value={formData.year} 
              onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} 
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};