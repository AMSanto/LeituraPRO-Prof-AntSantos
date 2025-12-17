import React, { useMemo } from 'react';
import { Student, Assessment, SchoolClass } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock, BookOpen, Calculator, Sparkles, GraduationCap } from 'lucide-react';

interface DashboardProps {
  students: Student[];
  assessments: Assessment[];
  classes: SchoolClass[];
}

export const Dashboard: React.FC<DashboardProps> = ({ students, assessments, classes }) => {
  // Stats calculations
  const totalStudents = students.length;
  const totalAssessments = assessments.length;
  const avgAccuracy = useMemo(() => {
    if (assessments.length === 0) return 0;
    return Math.round(assessments.reduce((acc, curr) => acc + curr.accuracy, 0) / assessments.length);
  }, [assessments]);

  // Chart Data: Progress over time (WPM)
  const chartData = useMemo(() => {
    const last5 = [...assessments]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10)
      .map(a => ({
        date: new Date(a.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        wpm: a.wpm,
        student: students.find(s => s.id === a.studentId)?.name.split(' ')[0] || 'Aluno'
      }));
    return last5;
  }, [assessments, students]);

  // Chart Data: Levels distribution
  const levelData = useMemo(() => {
    const levels = ['Iniciante', 'Em Desenvolvimento', 'Intermediário', 'Avançado', 'Fluente'];
    return levels.map(level => ({
      name: level,
      count: students.filter(s => s.readingLevel === level).length
    }));
  }, [students]);

  const COLORS = ['#03e3fc', '#02c7de', '#019eb0', '#0ea5e9', '#2563eb'];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white rounded-3xl border border-gray-200 shadow-sm p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Educação potencializada por IA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Transforme o futuro através da <span className="text-primary-600">leitura</span>.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Acompanhe o desenvolvimento individual de seus alunos com análises precisas e materiais personalizados fundamentados pelo Google Search.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Análises em Tempo Real</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Gráficos Intuitivos</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full hidden lg:flex items-center justify-center opacity-10">
          <GraduationCap className="w-64 h-64 text-primary-500 rotate-12" />
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="w-6 h-6" />} 
          label="Total de Alunos" 
          value={totalStudents} 
          sub="Ativos no sistema"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6" />} 
          label="Precisão Média" 
          value={`${avgAccuracy}%`} 
          sub="Geral das turmas"
          color="bg-primary-50 text-primary-600"
        />
        <StatCard 
          icon={<BookOpen className="w-6 h-6" />} 
          label="Avaliações" 
          value={totalAssessments} 
          sub="Registradas este ano"
          color="bg-purple-50 text-purple-600"
        />
        <StatCard 
          icon={<Clock className="w-6 h-6" />} 
          label="Turmas" 
          value={classes.length} 
          sub="Sob sua gestão"
          color="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Evolução de Leitura (WPM)</h3>
            <div className="text-sm text-gray-500">Últimas 10 avaliações</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  labelStyle={{fontWeight: 'bold', color: '#1e293b'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="wpm" 
                  stroke="#03e3fc" 
                  strokeWidth={4} 
                  dot={{r: 6, fill: '#03e3fc', strokeWidth: 2, stroke: '#fff'}}
                  activeDot={{r: 8, strokeWidth: 0}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900">Distribuição de Níveis</h3>
            <div className="text-sm text-gray-500">Total por categoria</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 11}} width={120} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; subText?: string; color: string; sub: string }> = ({ icon, label, value, color, sub }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
      {icon}
    </div>
    <div className="text-sm font-medium text-gray-500 mb-1">{label}</div>
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-xs text-gray-400 font-medium">{sub}</div>
  </div>
);
