import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { AssessmentForm } from './components/AssessmentForm';
import { ClassList } from './components/ClassList';
import { StudentHistory } from './components/StudentHistory';
import { ViewState, Student, Assessment, SchoolClass } from './types';
import { MOCK_STUDENTS, MOCK_ASSESSMENTS, MOCK_CLASSES } from './constants';
import { GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [assessments, setAssessments] = useState<Assessment[]>(MOCK_ASSESSMENTS);
  const [classes, setClasses] = useState<SchoolClass[]>(MOCK_CLASSES);
  
  // State for navigation details
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  // Class Handlers
  const handleAddClass = (newClass: Omit<SchoolClass, 'id'>) => {
    const cls: SchoolClass = {
      ...newClass,
      id: Math.random().toString(36).substr(2, 9)
    };
    setClasses([...classes, cls]);
  };

  const handleUpdateClass = (updatedClass: SchoolClass) => {
    setClasses(classes.map(c => c.id === updatedClass.id ? updatedClass : c));
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      setClasses(classes.filter(c => c.id !== id));
      setStudents(students.map(s => s.classId === id ? { ...s, classId: '' } : s));
    }
  };

  // Student Handlers
  const handleAddStudent = (newStudent: Omit<Student, 'id'>) => {
    const student: Student = {
      ...newStudent,
      id: Math.random().toString(36).substr(2, 9)
    };
    setStudents([...students, student]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const handleViewHistory = (studentId: string) => {
    setSelectedStudentId(studentId);
    setCurrentView(ViewState.STUDENT_HISTORY);
  };

  // Assessment Handlers
  const handleAddAssessment = (newAssessment: Omit<Assessment, 'id'>) => {
    const assessment: Assessment = {
      ...newAssessment,
      id: Math.random().toString(36).substr(2, 9)
    };
    setAssessments([...assessments, assessment]);
    setCurrentView(ViewState.DASHBOARD);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    if (view !== ViewState.STUDENTS) setSelectedClassId('');
    if (view !== ViewState.STUDENT_HISTORY) setSelectedStudentId('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard students={students} assessments={assessments} classes={classes} />;
      case ViewState.CLASSES:
        return (
          <ClassList 
            classes={classes} 
            students={students} 
            onAddClass={handleAddClass}
            onUpdateClass={handleUpdateClass}
            onDeleteClass={handleDeleteClass}
            onViewStudents={(classId) => {
              setSelectedClassId(classId);
              setCurrentView(ViewState.STUDENTS);
            }}
          />
        );
      case ViewState.STUDENTS:
        return (
          <StudentList 
            students={students} 
            classes={classes} 
            assessments={assessments} 
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onViewHistory={handleViewHistory}
            initialClassId={selectedClassId}
          />
        );
      case ViewState.STUDENT_HISTORY:
        const student = students.find(s => s.id === selectedStudentId);
        if (!student) return <Dashboard students={students} assessments={assessments} classes={classes} />;
        return (
          <StudentHistory 
            student={student}
            assessments={assessments.filter(a => a.studentId === student.id)}
            onBack={() => setCurrentView(ViewState.STUDENTS)}
          />
        );
      case ViewState.ASSESSMENT:
        return (
          <AssessmentForm 
            students={students} 
            classes={classes}
            onSave={handleAddAssessment} 
            onCancel={() => setCurrentView(ViewState.DASHBOARD)} 
          />
        );
      default:
        return <Dashboard students={students} assessments={assessments} classes={classes} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 p-1.5 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">LeituraPro AI</span>
            </div>
            <div className="flex gap-8 text-gray-500 text-sm font-medium">
              <button className="hover:text-primary-600 transition-colors">Funcionalidades</button>
              <button className="hover:text-primary-600 transition-colors">Pedagogia</button>
              <button className="hover:text-primary-600 transition-colors">Privacidade</button>
              <button className="hover:text-primary-600 transition-colors">Suporte</button>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-xs">
            <p>&copy; 2024 LeituraPro. Desenvolvido para transformar a educação alfabetizadora.</p>
            <div className="flex gap-4">
              <span>Português (BR)</span>
              <span>v2.1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
