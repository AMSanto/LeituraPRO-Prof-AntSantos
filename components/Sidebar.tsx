import React from 'react';
import { LayoutDashboard, Users, PenTool, School, GraduationCap } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.CLASSES, label: 'Minhas Turmas', icon: School },
    { id: ViewState.STUDENTS, label: 'Meus Alunos', icon: Users },
    { id: ViewState.ASSESSMENT, label: 'Nova Avaliação', icon: PenTool },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden md:flex flex-col shadow-sm z-10">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="bg-gradient-to-br from-primary-500 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-primary-500/30">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">LeituraPro</h1>
          <p className="text-xs text-primary-700 font-medium">Educador Assistente</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm ring-1 ring-primary-100' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <span className="text-yellow-400">✨</span>
            <p className="text-sm font-bold">Dica do Dia</p>
          </div>
          <p className="text-xs leading-relaxed opacity-80 font-light">
            A consistência vence a intensidade. 10 minutos de leitura diária valem mais que 1 hora semanal.
          </p>
        </div>
      </div>
    </aside>
  );
};