import React, { useState, useEffect } from 'react';

// Stage Column Definitions
export const STAGES = [
  {
    id: 'todo',
    label: 'To Do',
    bg: 'bg-purple-100/60',
    border: 'border-purple-300',
    headerText: 'text-purple-950',
    countBadge: 'bg-purple-200 text-purple-950 border-purple-300',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    bg: 'bg-amber-100/60',
    border: 'border-amber-300',
    headerText: 'text-amber-950',
    countBadge: 'bg-amber-200 text-amber-950 border-amber-300',
  },
  {
    id: 'review',
    label: 'Review',
    bg: 'bg-orange-100/60',
    border: 'border-orange-300',
    headerText: 'text-orange-950',
    countBadge: 'bg-orange-200 text-orange-950 border-orange-300',
  },
  {
    id: 'done',
    label: 'Done',
    bg: 'bg-emerald-100/60',
    border: 'border-emerald-300',
    headerText: 'text-emerald-950',
    countBadge: 'bg-emerald-200 text-emerald-950 border-emerald-300',
  },
];

export const TEAM = [
  { name: 'Alice Smith', initials: 'AS', color: 'bg-purple-600 text-white' },
  { name: 'Bob Jones', initials: 'BJ', color: 'bg-amber-600 text-white' },
  { name: 'Charlie Brown', initials: 'CB', color: 'bg-emerald-600 text-white' },
];

const getTeamMember = (name) => {
  return TEAM.find((m) => m.name === name) || { name: name || 'Unassigned', initials: '??', color: 'bg-stone-500 text-white' };
};

// High-Contrast Accessible Color Themes
export const COLOR_MODES = {
  standard: {
    feature: { badge: 'bg-emerald-100 text-emerald-950 border-emerald-300', symbol: '★' },
    bug: { badge: 'bg-red-100 text-red-950 border-red-300', symbol: '▲' },
  },
  accessible: {
    feature: { badge: 'bg-blue-600 text-white border-blue-700 font-bold', symbol: '★' },
    bug: { badge: 'bg-orange-600 text-white border-orange-700 font-bold', symbol: '▲' },
  },
};

const SEED_TASKS = [
  {
    id: 'task-1',
    title: 'Initialize repository and setup Tailwind',
    description: 'Configure Vite, React, and Tailwind CSS design tokens.',
    type: 'feature',
    status: 'done',
    assignee: 'Alice Smith',
    dueDate: '2026-10-20',
    context: `**Background**
Configure Vite, React, and Tailwind CSS design tokens for the Project Alpha workspace.

**Constraints**
- Ensure color variables adhere to warm stone palette standards.
- Maintain responsive break points for all column layouts.

**Tried so far**
Verified Vite config and verified CSS utility purging.

**Pick up**
Completed and merged into main repository.`,
    contextTool: 'Claude',
    contextUpdatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Build four-column Kanban board layout',
    description: 'Render To Do, In Progress, Review, and Done columns with responsive grid layout.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Bob Jones',
    dueDate: '2026-10-23',
    context: `**Background**
Render To Do, In Progress, Review, and Done columns with responsive grid layout.

**Constraints**
- Columns must stack vertically on mobile screens.
- Cards must stretch cleanly across four equal columns on desktop.

**Tried so far**
Tested flexbox auto-wrap, switched to Tailwind CSS grid for stable column widths.

**Pick up**
Refine column padding and transition animations when cards move between stages.`,
    contextTool: 'ChatGPT',
    contextUpdatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Fix mobile card overflow bug',
    description: 'Cards break outside column boundaries on screens smaller than 380px.',
    type: 'bug',
    status: 'todo',
    assignee: 'Charlie Brown',
    dueDate: '2026-10-20',
    context: `**Background**
Cards break outside column boundaries on screens smaller than 380px.

**Constraints**
- Prevent horizontal scrollbars on narrow mobile viewports.
- Maintain readable text sizes and minimum touching targets for buttons.

**Tried so far**
Added overflow-hidden to card containers, but text truncation still needs line-clamp fixes.

**Pick up**
Apply Tailwind line-clamp-2 to card description text and adjust column margins on small screens.`,
    contextTool: 'Cursor',
    contextUpdatedAt: new Date().toISOString(),
  },
];

// Calculation for time-based urgency state (Milestone 8)
const getTaskUrgency = (task) => {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return 'calm';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'alarm';       // Past due
  if (diffDays <= 1) return 'warning';    // Less than 24 hours
  return 'calm';                          // More than 2 days out
};

// Helper for relative time formatting (Milestone 9)
const formatRelativeTime = (isoString) => {
  if (!isoString) return 'Never updated';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks.v4', SEED_TASKS);
  const [currentUser, setCurrentUser] = useLocalStorage('vibetracker.user', TEAM[0].name);
  const [isAccessibleMode, setIsAccessibleMode] = useLocalStorage('vibetracker.accessible', false);

  const [filterMyTasks, setFilterMyTasks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState('feature');
  const [formStatus, setFormStatus] = useState('todo');
  const [formAssignee, setFormAssignee] = useState(currentUser);
  const [formDueDate, setFormDueDate] = useState('');
  const [formContext, setFormContext] = useState('');
  const [formContextTool, setFormContextTool] = useState('Claude');
  const [formContextUpdatedAt, setFormContextUpdatedAt] = useState(null);

  const currentUserObj = getTeamMember(currentUser);
  const currentThemeSet = isAccessibleMode ? COLOR_MODES.accessible : COLOR_MODES.standard;

  const handleOpenCreate = (defaultStatus = 'todo') => {
    setEditingTask(null);
    setFormTitle('');
    setFormDesc('');
    setFormType('feature');
    setFormStatus(defaultStatus);
    setFormAssignee(currentUser);
    setFormDueDate('');
    setFormContext(`**Background**\nDescribe the task background...\n\n**Constraints**\nNote any constraints...\n\n**Tried so far**\nNote what you've tried...\n\n**Pick up**\nNext steps...`);
    setFormContextTool('Claude');
    setFormContextUpdatedAt(new Date().toISOString());
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description);
    setFormType(task.type);
    setFormStatus(task.status);
    setFormAssignee(task.assignee);
    setFormDueDate(task.dueDate || '');
    setFormContext(task.context || `**Background**\n${task.description}\n\n**Constraints**\nFollow guidelines\n\n**Tried so far**\nInitial work\n\n**Pick up**\nNext steps`);
    setFormContextTool(task.contextTool || 'Claude');
    setFormContextUpdatedAt(task.contextUpdatedAt || null);
    setIsModalOpen(true);
  };

  const handleContextChange = (newVal) => {
    setFormContext(newVal);
    setFormContextUpdatedAt(new Date().toISOString());
  };

  const handleSaveTask = (e) => {
    if (e) e.preventDefault();
    if (!formTitle.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (editingTask) {
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                title: formTitle.trim(),
                description: formDesc,
                type: formType,
                status: formStatus,
                assignee: formAssignee,
                dueDate: formDueDate,
                context: formContext,
                contextTool: formContextTool,
                contextUpdatedAt: formContextUpdatedAt || new Date().toISOString(),
              }
            : t
        )
      );
    } else {
      const existingIds = tasks.map((t) => parseInt(t.id.replace('task-', ''), 10) || 0);
      const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

      const newTask = {
        id: `task-${nextNum}`,
        title: formTitle.trim(),
        description: formDesc,
        type: formType,
        status: formStatus,
        assignee: formAssignee,
        dueDate: formDueDate,
        createdDate: new Date().toISOString().split('T')[0],
        context: formContext,
        contextTool: formContextTool,
        contextUpdatedAt: formContextUpdatedAt || new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = () => {
    if (editingTask && confirm("Delete this task? This can't be undone.")) {
      setTasks(tasks.filter((t) => t.id !== editingTask.id));
      setIsModalOpen(false);
    }
  };

  const displayedTasks = filterMyTasks
    ? tasks.filter((t) => t.assignee === currentUser)
    : tasks;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 p-6 md:p-8 font-sans selection:bg-stone-200" role="main" aria-label="Project Tracker Board">
      
      {/* Header Bar */}
      <header className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 tracking-tight font-medium">Project Alpha Kanban Board</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* User Login / Profile Switcher */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 pl-3 rounded-md border border-stone-200 text-xs">
            <span className="text-stone-500 font-mono hidden sm:inline">Logged in:</span>
            <div className="flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${currentUserObj.color}`}>
                {currentUserObj.initials}
              </span>
              <select
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                className="bg-white border border-stone-300 rounded text-xs font-semibold px-2 py-1 text-stone-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-600"
              >
                {TEAM.map((member) => (
                  <option key={member.name} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Accessible Mode Checkbox */}
          <label className="text-xs font-medium text-stone-700 flex items-center gap-2 cursor-pointer bg-stone-50 px-3 py-2 rounded-md border border-stone-200 hover:border-stone-300 transition-colors">
            <input
              type="checkbox"
              checked={isAccessibleMode}
              onChange={(e) => setIsAccessibleMode(e.target.checked)}
              className="accent-stone-900 rounded-sm focus:ring-2 focus:ring-sky-600 focus:outline-none w-4 h-4 cursor-pointer"
            />
            <span>Accessible Mode</span> <span className="text-[10px] text-stone-500">(Blue/Orange)</span>
          </label>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={() => handleOpenCreate('todo')}
            aria-label="Create a new task item"
            className="bg-stone-900 text-stone-50 px-4 py-2 rounded-md text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs focus:ring-2 focus:ring-sky-600 focus:outline-none cursor-pointer flex items-center gap-1"
          >
            <span aria-hidden="true" className="font-bold">+</span> Add Task
          </button>
        </div>
      </header>

      {/* Team Workload Strip & Quick Filters */}
      <div className="mb-4 bg-white border border-stone-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
            Team Workload:
          </span>

          <button
            type="button"
            onClick={() => setFilterMyTasks(!filterMyTasks)}
            className={`text-xs font-medium px-3 py-1 rounded-md border transition-colors cursor-pointer ${
              filterMyTasks
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            {filterMyTasks ? '✓ Showing My Tasks Only' : 'Show My Tasks Only'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {TEAM.map((member) => {
            const memberTasks = tasks.filter((t) => t.assignee === member.name && t.status !== 'done');
            return (
              <div key={member.name} className="flex items-center gap-2 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${member.color}`}>
                  {member.initials}
                </span>
                <span className="text-xs font-medium text-stone-800">{member.name}</span>
                <span className="text-[10px] font-bold bg-white text-stone-600 px-1.5 py-0.5 rounded-full border border-stone-200">
                  {memberTasks.length} active
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* TASK URGENCY LEGEND STRIP */}
      <div className="mb-6 bg-white border border-stone-200 rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-end gap-5 text-xs shadow-2xs">
        <span className="font-mono text-stone-500 font-bold uppercase tracking-wider text-[11px] mr-auto">
          Task Urgency:
        </span>
        
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-sky-200 border border-sky-400 shadow-2xs" />
          <span className="text-stone-700 font-medium">More than 2 days out</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-amber-200 border border-amber-400" />
          <span className="text-amber-950 font-medium">Less than 24 hours</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-red-200 border border-red-400" />
          <span className="text-red-950 font-medium">Past due</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-stone-50 border border-stone-300" />
          <span className="text-stone-600 font-medium">Done</span>
        </div>
      </div>

      {/* Grid with 4 Equal Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch" role="region" aria-label="Kanban Board Columns">
        {STAGES.map((stage) => {
          const columnTasks = displayedTasks.filter((task) => task.status === stage.id);

          return (
            <div
              key={stage.id}
              className={`border ${stage.border} ${stage.bg} rounded-lg p-4 flex flex-col min-h-[580px] w-full transition-colors duration-200 shadow-2xs`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <h2 className={`text-xs font-bold uppercase tracking-wider ${stage.headerText}`}>
                    {stage.label}
                  </h2>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${stage.countBadge}`}>
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenCreate(stage.id)}
                  aria-label={`Add new task to ${stage.label}`}
                  className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-md px-2.5 py-1 text-xs font-semibold shadow-xs focus:ring-2 focus:ring-sky-600 focus:outline-none transition-colors cursor-pointer flex items-center justify-center leading-none"
                >
                  +
                </button>
              </div>

              {/* Column Body */}
              <div className="flex flex-col gap-3 flex-1">
                {columnTasks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-stone-300/80 rounded-md p-6 text-center text-stone-400 text-xs font-mono">
                    No tasks found
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const assigneeObj = getTeamMember(task.assignee);
                    const urgency = getTaskUrgency(task);
                    const activeTheme = currentThemeSet[task.type] || currentThemeSet.feature;

                    const urgencyClasses = {
                      calm: 'bg-sky-200/90 border-sky-400 shadow-xs text-sky-950',
                      warning: 'bg-amber-200/90 border-amber-400 shadow-xs text-amber-950',
                      alarm: 'bg-red-200/90 border-red-400 shadow-sm ring-1 ring-red-400 text-red-950',
                      neutral: 'bg-stone-50/90 border-stone-200 text-stone-700 opacity-90',
                    }[urgency];

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleOpenEdit(task)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') handleOpenEdit(task);
                        }}
                        className={`pt-3.5 pb-4 px-4 rounded-md border ${urgencyClasses} transition-all duration-150 cursor-pointer hover:shadow-md hover:-translate-y-0.5 focus:ring-2 focus:ring-sky-600 focus:outline-none flex flex-col justify-between`}
                      >
                        {/* Top ID and Badge Row */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-mono text-stone-600 uppercase font-bold tracking-tight">{task.id}</span>
                          <div className="flex items-center gap-1.5">
                            {urgency === 'alarm' && (
                              <span className="text-[9px] bg-red-200 text-red-950 border border-red-400 px-1.5 py-0.5 rounded font-bold font-mono">PAST DUE</span>
                            )}
                            {urgency === 'warning' && (
                              <span className="text-[9px] bg-amber-200 text-amber-950 border border-amber-400 px-1.5 py-0.5 rounded font-bold font-mono">DUE SOON</span>
                            )}
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider border flex items-center gap-1 ${activeTheme.badge}`}>
                              <span aria-hidden="true">{activeTheme.symbol}</span>
                              {task.type}
                            </span>
                          </div>
                        </div>

                        {/* Card Title */}
                        <h3 className="text-sm font-bold text-stone-900 mb-1.5 leading-snug">
                          {task.title}
                        </h3>

                        {/* Card Description */}
                        <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed mb-3">
                          {task.description}
                        </p>

                        {/* Card Footer with Assignee Avatar & Initials */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-black/10 text-[11px] text-stone-600 font-mono mt-auto">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${assigneeObj.color}`} title={assigneeObj.name}>
                              {assigneeObj.initials}
                            </span>
                            <span className="font-sans font-medium text-stone-900 truncate max-w-[95px]">{task.assignee}</span>
                          </div>
                          {task.dueDate && <span className="shrink-0 font-bold">Due: {task.dueDate}</span>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Modal with Markdown Context Area & AI Tool Selector */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" 
          role="dialog" 
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-white rounded-lg border border-stone-200 max-w-lg w-full p-6 shadow-xl my-8">
            <h2 className="text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center justify-between">
              <span>{editingTask ? `Task Details (${editingTask.id})` : 'Create New Task'}</span>
              {editingTask && <span className="text-xs font-mono font-normal text-stone-400 uppercase">{editingTask.id}</span>}
            </h2>

            <form onSubmit={handleSaveTask} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Configure database schema"
                  className="w-full text-sm border border-stone-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Add context or notes..."
                  className="w-full text-sm border border-stone-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              {/* Milestone 9: Task Context Markdown Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-stone-700">Context</label>
                  <span className="text-[10px] text-stone-500 font-mono">
                    Last updated {formatRelativeTime(formContextUpdatedAt)}
                  </span>
                </div>
                <textarea
                  rows="7"
                  value={formContext}
                  onChange={(e) => handleContextChange(e.target.value)}
                  placeholder="Markdown context for AI tools..."
                  className="w-full font-mono text-xs border border-stone-300 rounded p-3 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 leading-relaxed"
                />
              </div>

              {/* Milestone 9: Optional AI Tool Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">AI Tool</label>
                <select
                  value={formContextTool}
                  onChange={(e) => formContextTool(e.target.value)}
                  className="w-full text-sm border border-stone-300 rounded p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 font-medium"
                >
                  <option value="Claude">Claude</option>
                  <option value="ChatGPT">ChatGPT</option>
                  <option value="Cursor">Cursor</option>
                  <option value="Lovable">Lovable</option>
                  <option value="Replit">Replit</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Task Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full text-sm border border-stone-300 rounded p-2.5 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Status Column</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full text-sm border border-stone-300 rounded p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-stone-700">Assignee</label>
                  {formAssignee !== currentUser && (
                    <button
                      type="button"
                      onClick={() => setFormAssignee(currentUser)}
                      className="text-[11px] text-sky-700 hover:underline font-medium cursor-pointer"
                    >
                      Assign to me ({currentUserObj.initials})
                    </button>
                  )}
                </div>
                <select
                  value={formAssignee}
                  onChange={(e) => setFormAssignee(e.target.value)}
                  className="w-full text-sm border border-stone-300 rounded p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 font-medium"
                >
                  {TEAM.map((member) => (
                    <option key={member.name} value={member.name}>
                      {member.name} ({member.initials})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full text-sm border border-stone-300 rounded p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-2">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    className="text-xs bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-medium px-3.5 py-2 rounded transition-colors cursor-pointer"
                  >
                    Delete Task
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 text-xs text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded transition-colors cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
                  >
                    {editingTask ? 'Save' : 'Create Task'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}