import React, { useState } from 'react';
import { LayoutDashboard, Users, PenTool, School, GraduationCap, Menu, X, PlusCircle } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Início', icon: LayoutDashboard },
    { id: ViewState.CLASSES, label: 'Turmas', icon: School },
    { id: ViewState.STUDENTS, label: 'Alunos', icon: Users },
  ];

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav(ViewState.DASHBOARD)}>
            <div className="bg-gradient-to-br from-primary-500 to-blue-600 p-1.5 rounded-lg shadow-md shadow-primary-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">LeituraPro</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const isActive = currentView === item.id || (item.id === ViewState.STUDENTS && currentView === ViewState.STUDENT_HISTORY);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            
            <button
              onClick={() => handleNav(ViewState.ASSESSMENT)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-sm font-bold shadow-lg shadow-primary-500/30 transition-transform hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Nova Avaliação
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
                  currentView === item.id ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </div>
              </button>
            ))}
            <button
              onClick={() => handleNav(ViewState.ASSESSMENT)}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-bold text-primary-600 bg-primary-50"
            >
              <div className="flex items-center gap-3">
                <PlusCircle className="w-5 h-5" />
                Nova Avaliação
              </div>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};