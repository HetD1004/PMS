import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  FolderOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  Target,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Filter,
  Download,
  Lightbulb,
  Rocket,
  RefreshCw,
  Pause,
  Archive,
  History,
  Search,
  User,
  FileText
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const { getStatistics, allTasks, allUsers, allProjects, getTaskLogs } = useApp();
  const [activeView, setActiveView] = useState('overview');
  const [hoveredSection, setHoveredSection] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [logFilter, setLogFilter] = useState('all');
  const [logSearch, setLogSearch] = useState('');
  const stats = getStatistics();  const downloadData = () => {
    const dashboardData = {
      statistics: stats,
      projects: allProjects,
      users: allUsers.filter(user => user.role === 'user'),
      tasks: allTasks,
      recentActivity: recentActivity,
      taskLogs: getTaskLogs(),
      exportDate: new Date().toISOString()
    };    const csvContent = [
      ['Metric', 'Value'],
      ['Total Projects', stats.totalProjects],
      ['Team Members', stats.totalUsers],
      ['Total Tasks', stats.totalTasks],
      ['Completed Tasks', stats.tasksCompleted],
      ['Completion Rate', `${stats.totalTasks > 0 ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) : 0}%`],
      ['Tasks In Progress', stats.tasksInProgress],
      ['Export Date', new Date().toLocaleDateString()]
    ].map(row => row.join(',')).join('\n');    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  const getFilteredLogs = () => {
    let logs = getTaskLogs();
      if (logFilter !== 'all') {
      if (logFilter === 'recent') {
        logs = logs.slice(0, 50);
      } else if (logFilter === 'completed') {
        logs = logs.filter(log => log.newStatus === 'done');
      } else if (logFilter === 'critical') {
        logs = logs.filter(log => 
          log.newStatus === 'hold' || 
          (log.oldStatus === 'in-progress' && log.newStatus !== 'done')
        );
      }
    }
      if (logSearch) {
      const searchTerm = logSearch.toLowerCase();
      logs = logs.filter(log => 
        log.taskTitle.toLowerCase().includes(searchTerm) ||
        log.userName.toLowerCase().includes(searchTerm) ||
        log.projectName.toLowerCase().includes(searchTerm) ||
        log.changedByName.toLowerCase().includes(searchTerm)
      );
    }
    
    return logs;
  };
  const getStatusInfo = (status) => {
    const statusMap = {
      'backlog': { label: 'Backlog', color: 'bg-gray-100 text-gray-800', icon: Archive },
      'todo': { label: 'To Do', color: 'bg-blue-100 text-blue-800', icon: Lightbulb },
      'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: Rocket },
      'hold': { label: 'On Hold', color: 'bg-orange-100 text-orange-800', icon: Pause },
      'done': { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', icon: FileText };
  };

  const recentActivity = allTasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(task => {
      const user = allUsers.find(u => u.id === task.assignedTo);
      const project = allProjects.find(p => p.id === task.projectId);
      return {
        ...task,
        userName: user?.name || 'Unassigned',
        projectName: project?.name || 'Unknown Project'
      };
    });

  const EnhancedStatCard = ({ title, value, icon: Icon, gradient, trend, description, onClick }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [isHovered, setIsHovered] = useState(false);    useEffect(() => {
      const timer = setTimeout(() => {
        let start = 0;
        const increment = value / 20;
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
      }, 200);
      return () => clearTimeout(timer);
    }, [value]);return (
      <div
        className={`
          relative overflow-hidden rounded-3xl p-8 cursor-pointer
          transform transition-all duration-300 ease-out
          ${gradient}
          shadow-xl
          group
          ${isHovered ? 'scale-105 -translate-y-2 shadow-2xl' : 'scale-100 translate-y-0'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/20"></div>
          <div className="absolute -left-4 -bottom-4 w-20 h-20 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full bg-white/5"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className={`
              p-4 rounded-2xl bg-white/20 backdrop-blur-sm
              transform transition-all duration-300
              ${isHovered ? 'rotate-12 scale-110' : ''}
            `}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            {trend && (
              <div className="flex items-center space-x-2 text-white/90">
                {trend > 0 ? (
                  <ArrowUpRight className="h-5 w-5 text-green-300" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-300" />
                )}
                <span className="text-sm font-bold">
                  {Math.abs(trend)}%
                </span>
              </div>
            )}
          </div>
            <div className="space-y-2">
            <h3 className="text-white/90 text-sm font-semibold uppercase tracking-wider">
              {title}
            </h3>
            <p className="text-4xl font-bold text-white font-mono">
              {displayValue.toLocaleString()}
            </p>
            <p className="text-white/80 text-sm">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  };
  const taskStatusData = {
    labels: ['Backlog', 'To Do', 'In Progress', 'Hold', 'Done'],
    datasets: [
      {
        data: [
          allTasks.filter(task => task.status === 'backlog').length,
          allTasks.filter(task => task.status === 'todo').length,
          allTasks.filter(task => task.status === 'in-progress').length,
          allTasks.filter(task => task.status === 'hold').length,
          allTasks.filter(task => task.status === 'done').length,
        ],
        backgroundColor: ['#64748B', '#3B82F6', '#F59E0B', '#EF4444', '#10B981'],
        borderColor: ['#475569', '#2563EB', '#D97706', '#DC2626', '#059669'],
        borderWidth: 2,
        cutout: '60%'
      },
    ],  };

  const userWorkloadData = {
    labels: allUsers
      .filter(user => user.role === 'user')
      .map(user => user.name),
    datasets: [
      {
        label: 'Active Tasks',
        data: allUsers
          .filter(user => user.role === 'user')
          .map(user => 
            allTasks.filter(task => 
              task.assignedTo === user.id && task.status !== 'done'
            ).length
          ),
        backgroundColor: '#8B5CF6',
        borderColor: '#7C3AED',
        borderWidth: 1
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">        
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Complete overview of your project management ecosystem
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </div>
                <div className="text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>              
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className={`
                  px-6 py-3 rounded-2xl font-semibold transition-all duration-300
                  ${activeView === 'overview' 
                    ? 'bg-purple-500 text-white shadow-xl shadow-blue-500/25' 
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-lg'
                  }
                `}
                onClick={() => setActiveView('overview')}
              >
                Overview
              </button>
              <button 
                className={`
                  px-6 py-3 rounded-2xl font-semibold transition-all duration-300
                  ${activeView === 'analytics' 
                    ? 'bg-purple-500 text-white shadow-xl shadow-purple-500/25' 
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-lg'
                  }
                `}
                onClick={() => setActiveView('analytics')}
              >
                Analytics
              </button>
              <button 
                className={`
                  px-6 py-3 rounded-2xl font-semibold transition-all duration-300
                  ${activeView === 'logs' 
                    ? 'bg-green-500 text-white shadow-xl shadow-green-500/25' 
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-lg'
                  }
                `}
                onClick={() => setActiveView('logs')}
              >
                <History className="h-4 w-4 mr-2 inline" />
                Logs
              </button>
              <button 
                className="p-3 bg-white/70 hover:bg-white rounded-2xl transition-all duration-300 hover:shadow-lg"
                onClick={downloadData}
                title="Download Dashboard Report"
              >
                <Download className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>        {activeView === 'overview' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <EnhancedStatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={Target}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            trend={12}
            description="Active & completed projects"
          />
          <EnhancedStatCard
            title="Team Members"
            value={stats.totalUsers}
            icon={Users}
            gradient="bg-gradient-to-br from-purple-500 to-purple-700"
            trend={8}
            description="Registered users"
          />
          <EnhancedStatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={Zap}
            gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            trend={15}
            description="All tasks in system"
          />
          <EnhancedStatCard
            title="Completed"
            value={stats.tasksCompleted}
            icon={Award}
            gradient="bg-gradient-to-br from-emerald-500 to-green-600"
            trend={23}
            description="Finished tasks"
          />        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-3">
                  <PieChart className="h-6 w-6 text-blue-600" />
                </div>
                Task Distribution
              </h3>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Total: {stats.total} tasks
              </div>
            </div>
            
            <div className="relative">              <div className="h-80 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="backlogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9CA3AF" />
                        <stop offset="100%" stopColor="#6B7280" />
                      </linearGradient>
                      <linearGradient id="todoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                      <linearGradient id="holdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FB923C" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                      <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#34D399" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>                    </defs>

                    <circle cx="100" cy="100" r="90" fill="#F3F4F6" className="opacity-20" />
                    {(() => {
                      let cumulativeAngle = 0;
                      return [
                        { 
                          status: 'backlog', 
                          count: stats.backlog, 
                          color: 'url(#backlogGradient)',
                          icon: Archive,
                          label: 'Backlog'
                        },
                        { 
                          status: 'todo', 
                          count: stats.todo, 
                          color: 'url(#todoGradient)',
                          icon: Lightbulb,
                          label: 'To Do'
                        },
                        { 
                          status: 'inProgress', 
                          count: stats.inProgress, 
                          color: 'url(#progressGradient)',
                          icon: Rocket,
                          label: 'In Progress'
                        },
                        { 
                          status: 'hold', 
                          count: stats.hold, 
                          color: 'url(#holdGradient)',
                          icon: Pause,
                          label: 'On Hold'
                        },
                        { 
                          status: 'completed', 
                          count: stats.completed, 
                          color: 'url(#completedGradient)',
                          icon: CheckCircle,
                          label: 'Completed'
                        }
                      ].map((section, index) => {
                        const percentage = stats.total > 0 ? (section.count / stats.total) : (section.count === 0 ? 0 : 0.2); 
                        const angle = stats.total > 0 ? percentage * 360 : (section.count > 0 ? 72 : 0); 
                        
                        if (angle === 0 && stats.total > 0) return null; 
                        
                        const startAngle = cumulativeAngle;
                        const endAngle = startAngle + angle;
                        cumulativeAngle = endAngle;                         

                        const startAngleRad = (startAngle * Math.PI) / 180;
                        const endAngleRad = (endAngle * Math.PI) / 180;
                        
                        const x1 = 100 + 90 * Math.cos(startAngleRad);
                        const y1 = 100 + 90 * Math.sin(startAngleRad);
                        const x2 = 100 + 90 * Math.cos(endAngleRad);
                        const y2 = 100 + 90 * Math.sin(endAngleRad);
                        
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        const pathData = [
                          `M 100 100`,
                          `L ${x1} ${y1}`,
                          `A 90 90 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                          'Z'                        ].join(' ');

                        const iconAngle = startAngle + angle / 2;
                        const iconAngleRad = (iconAngle * Math.PI) / 180;
                        const iconX = 100 + 60 * Math.cos(iconAngleRad);
                        const iconY = 100 + 60 * Math.sin(iconAngleRad);                        return (
                          <g key={section.status}>
                            <path
                              d={pathData}
                              fill={section.color}
                              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                              strokeWidth="2"
                              stroke="white"
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
                                setHoveredSection({
                                  ...section,
                                  percentage: ((section.count / stats.total) * 100).toFixed(1)
                                });
                                setTooltipPosition({
                                  x: rect.left + rect.width / 2 - svgRect.left,
                                  y: rect.top + rect.height / 2 - svgRect.top
                                });
                              }}
                              onMouseLeave={() => setHoveredSection(null)}
                            />
                            {}
                            {angle > 20 && (
                              <foreignObject
                                x={iconX - 12}
                                y={iconY - 12}
                                width="24"
                                height="24"
                                className="pointer-events-none"
                              >
                                <div className="w-6 h-6 text-white flex items-center justify-center">
                                  <section.icon className="w-5 h-5" />
                                </div>
                              </foreignObject>
                            )}
                          </g>
                        );
                      }).filter(Boolean);
                    })()}
                    
                    {}
                    <circle cx="100" cy="100" r="35" fill="white" className="drop-shadow-lg" />
                  </svg>
                    {}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
                      <div className="text-sm text-gray-500 font-medium">Total Tasks</div>
                    </div>
                  </div>

                  {}
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
              </div>              {}
              <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
                {[
                  { label: 'Backlog', count: stats.backlog, color: 'bg-gray-500' },
                  { label: 'To Do', count: stats.todo, color: 'bg-blue-500' },
                  { label: 'In Progress', count: stats.inProgress, color: 'bg-yellow-500' },
                  { label: 'On Hold', count: stats.hold, color: 'bg-orange-500' },
                  { label: 'Completed', count: stats.completed, color: 'bg-green-500' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center space-x-1">
                    <div className={`w-2 h-2 ${item.color} rounded-full`}></div>
                    <span className="text-gray-600">{item.label}: {item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="h-6 w-6 mr-3 text-purple-500" />
              Team Workload
            </h3>
            <div className="relative h-80">
              <Bar 
                data={userWorkloadData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1
                      },
                      grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-green-500" />
            Recent Activity
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {activity.userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      Task "{activity.title}" assigned to {activity.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Project: {activity.projectName} • Due: {new Date(activity.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'done' 
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.status === 'done' ? 'Completed' : 
                       activity.status === 'in-progress' ? 'In Progress' : 'To Do'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Completion Rate</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray={`${stats.totalTasks > 0 ? (stats.tasksCompleted / stats.totalTasks) * 100 : 0}, 100`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">                <span className="text-2xl font-bold text-gray-900">
                  {stats.totalTasks > 0 ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) : 0}%
                </span>
              </div>
            </div>
            <p className="text-gray-600">
              {stats.tasksCompleted} of {stats.totalTasks} tasks completed
            </p>
          </div>

          {}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Project Status</h3>
            <div className="space-y-4">
              {allProjects.slice(0, 3).map((project, index) => (
                <div key={project.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {project.name}
                    </span>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performers</h3>
            <div className="space-y-4">
              {allUsers.filter(user => user.role === 'user').slice(0, 3).map((user, index) => {
                const userTasks = allTasks.filter(task => task.assignedTo === user.id);
                const completedTasks = userTasks.filter(task => task.status === 'done').length;
                return (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{completedTasks} completed</p>                    </div>
                    <div className="text-right">
                      <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                          style={{ width: `${userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>                );
              })}
            </div>
          </div>
        </div>          </>
        ) : activeView === 'analytics' ? (
          <>            {}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <div className="p-2 bg-blue-100 rounded-xl mr-3">
                      <PieChart className="h-6 w-6 text-blue-600" />
                    </div>
                    Task Distribution
                  </h3>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Total: {stats.total} tasks
                  </div>
                </div>
                
                <div className="relative">
                  <div className="h-80 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Doughnut 
                        data={taskStatusData} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          cutout: '60%',
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: {
                                padding: 25,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                font: {
                                  size: 13,
                                  weight: '600'
                                },
                                color: '#374151',
                                generateLabels: (chart) => {
                                  const data = chart.data;
                                  if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                      const value = data.datasets[0].data[i];
                                      const percentage = ((value / stats.total) * 100).toFixed(1);
                                      return {
                                        text: `${label} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        pointStyle: 'circle'
                                      };
                                    });
                                  }
                                  return [];
                                }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              titleColor: '#fff',
                              bodyColor: '#fff',
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                              borderWidth: 1,
                              cornerRadius: 8,
                              padding: 12,
                              callbacks: {
                                label: function(context) {
                                  const percentage = ((context.parsed / stats.total) * 100).toFixed(1);
                                  return `${context.label}: ${context.parsed} tasks (${percentage}%)`;
                                }
                              }
                            }
                          },
                          animation: {
                            animateRotate: true,
                            animateScale: false,
                            duration: 1000,
                            easing: 'easeOutQuart'
                          }
                        }}
                      />
                      {}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                          <div className="text-sm text-gray-500 font-medium">Total Tasks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3 text-purple-500" />
                  Team Workload
                </h3>
                <div className="relative h-80">
                  <Bar 
                    data={userWorkloadData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          },
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                          }
                        },
                        x: {
                          grid: {
                            display: false
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="h-6 w-6 mr-3 text-indigo-500" />
                Analytics Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalProjects}</div>
                  <div className="text-sm text-gray-600">Total Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.totalUsers}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600">{stats.totalTasks}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.totalTasks > 0 ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>            
            </div>
          </>
        ) : (
          <>
            {}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="p-2 bg-green-100 rounded-xl mr-3">
                    <History className="h-6 w-6 text-green-600" />
                  </div>
                  Task Activity Logs
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {getFilteredLogs().length} logs
                  </div>
                </div>
              </div>

              {}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs by task, user, or project..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Logs</option>
                    <option value="recent">Recent (50)</option>
                    <option value="completed">Completed Tasks</option>
                    <option value="critical">Critical Changes</option>
                  </select>
                </div>
              </div>

              {}
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                {getFilteredLogs().length > 0 ? (
                  getFilteredLogs().map((log, index) => {
                    const oldStatusInfo = getStatusInfo(log.oldStatus);
                    const newStatusInfo = getStatusInfo(log.newStatus);
                    
                    return (
                      <div 
                        key={log.id} 
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-md transition-all duration-300 animate-fade-in border-l-4 border-green-400"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                          <History className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {log.taskTitle}
                            </p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">
                              by {log.changedByName}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${oldStatusInfo.color}`}>
                              <oldStatusInfo.icon className="w-3 h-3 mr-1" />
                              {oldStatusInfo.label}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${newStatusInfo.color}`}>
                              <newStatusInfo.icon className="w-3 h-3 mr-1" />
                              {newStatusInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{log.userName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="w-3 h-3" />
                              <span>{log.projectName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {logSearch || logFilter !== 'all' ? 'No logs match your filters' : 'No task activity logs yet'}
                    </p>
                    {(logSearch || logFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setLogSearch('');
                          setLogFilter('all');
                        }}
                        className="mt-2 text-sm text-green-600 hover:text-green-700 underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              {getFilteredLogs().length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Showing {getFilteredLogs().length} of {getTaskLogs().length} total logs
                    </span>
                    <span>
                      Logs are automatically generated when tasks change status
                    </span>
                  </div>
                </div>
              )}
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Total Activity</h4>
                <div className="text-3xl font-bold text-green-600">{getTaskLogs().length}</div>
                <div className="text-sm text-gray-600">All-time logs</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Today's Activity</h4>
                <div className="text-3xl font-bold text-blue-600">
                  {getTaskLogs().filter(log => {
                    const today = new Date().toDateString();
                    return new Date(log.timestamp).toDateString() === today;
                  }).length}
                </div>
                <div className="text-sm text-gray-600">Logs today</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Completed Tasks</h4>
                <div className="text-3xl font-bold text-emerald-600">
                  {getTaskLogs().filter(log => log.newStatus === 'done').length}
                </div>
                <div className="text-sm text-gray-600">Completion logs</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Most Active User</h4>
                <div className="text-2xl font-bold text-purple-600">
                  {(() => {
                    const userActivity = {};
                    getTaskLogs().forEach(log => {
                      userActivity[log.userName] = (userActivity[log.userName] || 0) + 1;
                    });
                    const mostActive = Object.entries(userActivity).sort((a, b) => b[1] - a[1])[0];
                    return mostActive ? mostActive[0] : 'None';
                  })()}
                </div>
                <div className="text-sm text-gray-600">Most task changes</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
