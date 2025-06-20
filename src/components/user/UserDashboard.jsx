import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Card from '../shared/Card';
import { 
  CheckSquare, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  TrendingUp,
  Target,
  Zap,
  Award,
  Activity,
  BarChart3,
  Users,
  Timer,
  Download
} from 'lucide-react';

const UserDashboard = () => {
  const { currentUser, getUserTasks } = useApp();
  const [activeView, setActiveView] = useState('overview');
  const [hoveredSection, setHoveredSection] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0
  });
  
  if (!currentUser) return null;

  const userTasks = getUserTasks(currentUser.id);
  
  const stats = {
    total: userTasks.length,
    todo: userTasks.filter(task => task.status === 'todo').length,
    backlog: userTasks.filter(task => task.status === 'backlog').length,
    inProgress: userTasks.filter(task => task.status === 'in-progress').length,
    hold: userTasks.filter(task => task.status === 'hold').length,
    completed: userTasks.filter(task => task.status === 'done').length
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats(stats);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  
  
  const productivityScore = Math.min(100, Math.round(
    (stats.completed * 40 + stats.inProgress * 20 + stats.todo * 10) / Math.max(1, stats.total)
  ));

  
  const overdueCount = userTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return task.status !== 'done' && dueDate < today;
  }).length;
  
  const tasksDueToday = userTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return task.status !== 'done' && 
           dueDate.toDateString() === today.toDateString();  }).length;

  
  const downloadUserData = () => {
    const userData = {
      user: {
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role
      },
      statistics: {
        totalTasks: stats.total,
        completedTasks: stats.completed,
        inProgressTasks: stats.inProgress,
        todoTasks: stats.todo,
        backlogTasks: stats.backlog,
        holdTasks: stats.hold,
        completionRate: completionRate,
        productivityScore: productivityScore,
        tasksDueToday: tasksDueToday,
        overdueTasks: overdueCount
      },
      tasks: userTasks,
      exportDate: new Date().toISOString()
    };

    
    const csvContent = [
      ['Metric', 'Value'],
      ['User Name', currentUser.name],
      ['Total Tasks', stats.total],
      ['Completed Tasks', stats.completed],
      ['In Progress Tasks', stats.inProgress],
      ['Todo Tasks', stats.todo],
      ['Backlog Tasks', stats.backlog],
      ['Hold Tasks', stats.hold],
      ['Completion Rate', `${completionRate}%`],
      ['Productivity Score', `${productivityScore}%`],
      ['Tasks Due Today', tasksDueToday],
      ['Overdue Tasks', overdueCount],
      ['Export Date', new Date().toLocaleDateString()],
      ['', ''], 
      ['Task Details', ''],
      ['ID', 'Title', 'Description', 'Status', 'Priority', 'Due Date', 'Project'],
      ...userTasks.map(task => [
        task.id,
        task.title,
        task.description,
        task.status,
        task.priority,
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date',
        task.project || 'No project'
      ])
    ].map(row => row.join(',')).join('\n');

    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-tasks-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  
  const EnhancedStatCard = ({ title, value, icon: Icon, gradient, trend, subtitle, onClick, delay = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        let start = 0;
        const increment = value / 30;
        const counter = setInterval(() => {
          start += increment;
          if (start >= value) {
            setDisplayValue(value);
            clearInterval(counter);
          } else {
            setDisplayValue(Math.floor(start));
          }
        }, 50);
        return () => clearInterval(counter);
      }, delay);
      return () => clearTimeout(timer);
    }, [value, delay]);

    return (
      <div
        className={`
          relative overflow-hidden rounded-2xl p-6 cursor-pointer
          transform transition-all duration-500 hover:scale-105 hover:-translate-y-2
          ${gradient}
          shadow-lg hover:shadow-2xl
          group
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20"></div>
          <div className="absolute -left-2 -bottom-2 w-16 h-16 rounded-full bg-white/10"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`
              p-3 rounded-xl bg-white/20 backdrop-blur-sm
              transform transition-transform duration-300
              ${isHovered ? 'rotate-12 scale-110' : ''}
            `}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            {trend && (
              <div className="flex items-center space-x-1 text-white/80">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">{trend}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-white/80 text-sm font-medium uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-3xl font-bold text-white font-mono">
              {displayValue}
            </p>
            {subtitle && (
              <p className="text-white/70 text-xs">
                {subtitle}
              </p>
            )}          </div>
        </div>
      </div>
    );
  };

  
  const ProgressRing = ({ progress, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${circumference} ${circumference}`;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-blue-500 transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{progress}%</span>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Welcome back, {currentUser.name}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Ready to conquer your tasks today? Let's make it happen!
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all duration-200
                  ${activeView === 'overview' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md'
                  }
                `}
                onClick={() => setActiveView('overview')}
              >
                Overview
              </button>              <button 
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all duration-200
                  ${activeView === 'analytics' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md'
                  }
                `}
                onClick={() => setActiveView('analytics')}
              >
                Analytics
              </button>
              <button 
                className="p-3 bg-white/70 hover:bg-white rounded-2xl transition-all duration-300 hover:shadow-lg"
                onClick={downloadUserData}
                title="Download My Tasks Report"
              >
                <Download className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>        
        {activeView === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <EnhancedStatCard
            title="Total Tasks"
            value={stats.total}
            icon={Target}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            trend="+12%"
            subtitle="All time tasks"
            delay={0}
          />
          <EnhancedStatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Zap}
            gradient="bg-gradient-to-br from-yellow-500 to-orange-500"
            trend="+5%"
            subtitle="Active now"
            delay={100}
          />
          <EnhancedStatCard
            title="Completed"
            value={stats.completed}
            icon={Award}
            gradient="bg-gradient-to-br from-green-500 to-emerald-600"
            trend="+23%"
            subtitle="Great job!"
            delay={200}
          />
          <EnhancedStatCard
            title="Due Today"
            value={tasksDueToday}
            icon={Timer}
            gradient="bg-gradient-to-br from-purple-500 to-pink-500"
            subtitle={overdueCount > 0 ? `${overdueCount} overdue` : 'On track'}
            delay={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">          
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30"></div>
              <div className="absolute top-4 right-4 w-20 h-20 bg-blue-100/30 rounded-full blur-xl"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Completion Rate</h3>
                    <p className="text-sm text-gray-600">Your progress overview</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <ProgressRing progress={completionRate} size={100} strokeWidth={6} />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                        <div className="text-xl font-bold text-green-600">{stats.completed}</div>
                        <div className="text-xs text-gray-600">Done</div>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30">
                        <div className="text-xl font-bold text-blue-600">{stats.total - stats.completed}</div>
                        <div className="text-xs text-gray-600">Pending</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Total Tasks</span>
                        <span className="text-lg font-bold text-gray-900">{stats.total}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Task Distribution</h3>
              <div className="space-y-4">
                {[
                  { label: 'Backlog', value: stats.backlog, color: 'bg-gray-400', max: stats.total },
                  { label: 'To Do', value: stats.todo, color: 'bg-blue-500', max: stats.total },
                  { label: 'In Progress', value: stats.inProgress, color: 'bg-yellow-500', max: stats.total },
                  { label: 'On Hold', value: stats.hold, color: 'bg-orange-500', max: stats.total },
                  { label: 'Completed', value: stats.completed, color: 'bg-green-500', max: stats.total },
                ].map((item) => (
                  <div key={item.label} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-700">
                      {item.label}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${item.max > 0 ? (item.value / item.max) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-sm font-bold text-gray-900">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>        
        

        {overdueCount > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-xl mr-4">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {overdueCount} Overdue Task{overdueCount > 1 ? 's' : ''} 🚨
                    </h3>
                    <p className="text-white/90 mt-1">
                      Time to tackle these tasks and get back on track!
                    </p>
                  </div>                </div>
              </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Productivity Score
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Score</span>
                <span className="text-2xl font-bold text-blue-600">{productivityScore}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${productivityScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {productivityScore >= 80 ? '🚀 You\'re on fire!' : 
                 productivityScore >= 60 ? '💪 Great momentum!' : 
                 '📈 Building up steam!'}
              </p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Quick Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                <span className="text-gray-700">Tasks This Week</span>
                <span className="font-bold text-blue-600">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <span className="text-gray-700">Completion Rate</span>
                <span className="font-bold text-green-600">{completionRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
                <span className="text-gray-700">Active Tasks</span>
                <span className="font-bold text-yellow-600">{stats.inProgress + stats.todo}</span>
              </div>            </div>
          </div>
        </div>
        </>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-6 w-6 mr-3" />
                Task Analytics & Insights
              </h2>
              <p className="text-gray-600">Detailed analysis of your productivity patterns and task completion metrics.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Completion Trends
                </h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{completionRate}%</div>
                    <p className="text-gray-600">Overall Completion Rate</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                      <span className="font-medium text-gray-700">Tasks Completed Today</span>
                      <span className="text-xl font-bold text-blue-600">{stats.completed}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                      <span className="font-medium text-gray-700">Success Rate</span>
                      <span className="text-xl font-bold text-green-600">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl">
                      <span className="font-medium text-gray-700">Average Daily Tasks</span>
                      <span className="text-xl font-bold text-orange-600">{Math.ceil(stats.total / 7)}</span>
                    </div>
                  </div>
                </div>
              </div>              
      
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-xl mr-3">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    Task Distribution
                  </h3>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Total: {stats.total} tasks
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="relative w-64 h-64 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                        className="opacity-20"
                      />
                      
                      {[
                        { status: 'completed', count: stats.completed, color: '#10b981', offset: 0 },
                        { status: 'inProgress', count: stats.inProgress, color: '#f59e0b', offset: stats.completed },
                        { status: 'todo', count: stats.todo, color: '#3b82f6', offset: stats.completed + stats.inProgress },
                        { status: 'hold', count: stats.hold, color: '#f97316', offset: stats.completed + stats.inProgress + stats.todo },
                        { status: 'backlog', count: stats.backlog, color: '#6b7280', offset: stats.completed + stats.inProgress + stats.todo + stats.hold }
                      ].map((item, index) => {
                        const percentage = stats.total > 0 ? (item.count / stats.total) : 0;
                        const circumference = 2 * Math.PI * 45;
                        const strokeDasharray = circumference;
                        const strokeDashoffset = circumference - (percentage * circumference);
                        const rotation = (item.offset / stats.total) * 360;
                          return item.count > 0 ? (
                          <circle
                            key={item.status}
                            cx="50"
                            cy="50"
                            r="45"
                            stroke={item.color}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out cursor-pointer hover:opacity-80"
                            style={{
                              transformOrigin: '50% 50%',
                              transform: `rotate(${rotation}deg)`
                            }}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
                              setHoveredSection({
                                label: item.status === 'completed' ? 'Completed' :
                                       item.status === 'inProgress' ? 'In Progress' :
                                       item.status === 'todo' ? 'To Do' :
                                       item.status === 'hold' ? 'On Hold' : 'Backlog',
                                count: item.count,
                                percentage: ((item.count / stats.total) * 100).toFixed(1)
                              });
                              setTooltipPosition({
                                x: rect.left + rect.width / 2 - svgRect.left,
                                y: rect.top + rect.height / 2 - svgRect.top
                              });
                            }}
                            onMouseLeave={() => setHoveredSection(null)}
                          />
                        ) : null;
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
                        <div className="text-sm text-gray-500 font-medium">Total Tasks</div>
                      </div>
                    </div>

                    {hoveredSection && (
                      <div 
                        className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium z-10 pointer-events-none transform -translate-x-1/2 -translate-y-full"
                        style={{
                          left: tooltipPosition.x,
                          top: tooltipPosition.y - 10
                        }}
                      >
                        <div className="text-center">
                          <div className="font-semibold">{hoveredSection.label}</div>
                          <div className="text-xs opacity-90">
                            {hoveredSection.count} tasks ({hoveredSection.percentage}%)
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>                
                <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
                  {[
                    { label: 'Completed', count: stats.completed, color: 'bg-green-500' },
                    { label: 'In Progress', count: stats.inProgress, color: 'bg-yellow-500' },
                    { label: 'To Do', count: stats.todo, color: 'bg-blue-500' },
                    { label: 'On Hold', count: stats.hold, color: 'bg-orange-500' },
                    { label: 'Backlog', count: stats.backlog, color: 'bg-gray-500' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                      <span className="text-gray-600">{item.label}: {item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Productivity Insights
                </h3>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{productivityScore}</div>
                    <p className="text-gray-600 mb-3">Productivity Score</p>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${productivityScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-xl font-bold text-green-600">{tasksDueToday}</div>
                      <p className="text-xs text-gray-600">Due Today</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                      <div className="text-xl font-bold text-red-600">{overdueCount}</div>
                      <p className="text-xs text-gray-600">Overdue</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                    <span className="font-medium text-gray-700">Efficiency Rating</span>
                    <span className="text-xl font-bold text-blue-600">
                      {stats.total > 0 ? Math.min(Math.round((stats.completed / (stats.completed + overdueCount + 1)) * 100), 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                    <span className="font-medium text-gray-700">Task Velocity</span>
                    <span className="text-xl font-bold text-purple-600">{Math.ceil(stats.completed / 7)}/day</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                    <span className="font-medium text-gray-700">Quality Score</span>
                    <span className="text-xl font-bold text-green-600">
                      {overdueCount === 0 && stats.completed > 0 ? '95%' : 
                       overdueCount <= 1 ? '85%' : '75%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
