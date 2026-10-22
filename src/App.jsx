import React, { useState, useEffect } from 'react';

// Column Definition with Solid Tints & 1px Borders
export const STAGES = [
  {
    id: 'todo',
    label: 'To Do',
    bg: 'bg-purple-100/80',
    border: 'border-purple-300',
    headerText: 'text-purple-950',
    countBadge: 'bg-purple-200 text-purple-950 border-purple-300',
  },
  {
    id: 'in-progress',
    label: 'In Progress',
    bg: 'bg-amber-100/80',
    border: 'border-amber-300',
    headerText: 'text-amber-950',
    countBadge: 'bg-amber-200 text-amber-950 border-amber-300',
  },
  {
    id: 'review',
    label: 'Review',
    bg: 'bg-orange-100/80',
    border: 'border-orange-300',
    headerText: 'text-orange-950',
    countBadge: 'bg-orange-200 text-orange-950 border-orange-300',
  },
  {
    id: 'done',
    label: 'Done',
    bg: 'bg-emerald-100/80',
    border: 'border-emerald-300',
    headerText: 'text-emerald-950',
    countBadge: 'bg-emerald-200 text-emerald-950 border-emerald-300',
  },
];

export const TEAM = ['Alice Smith', 'Bob Jones', 'Charlie Brown'];

// Dual Color Modes for Accessibility Compliance
export const COLOR_MODES = {
  standard: {
    name: 'Standard (Red & Green)',
    feature: {
      bg: 'bg-white',
      border: 'border-stone-200',
      badge: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      bar: 'bg-emerald-500',
      symbol: '★',
    },
    bug: {
      bg: 'bg-white',
      border: 'border-stone-200',
      badge: 'bg-red-100 text-red-950 border-red-300',
      bar: 'bg-red-500',
      symbol: '▲',
    },
  },
  accessible: {
    name: 'Accessible (Blue & Orange)',
    feature: {
      bg: 'bg-white',
      border: 'border-stone-200',
      badge: 'bg-blue-100 text-blue-950 border-blue-300',
      bar: 'bg-blue-600',
      symbol: '★',
    },
    bug: {
      bg: 'bg-white',
      border: 'border-stone-200',
      badge: 'bg-orange-100 text-orange-950 border-orange-300',
      bar: 'bg-orange-500',
      symbol: '▲',
    },
  },
};

const SEED_TASKS = [
  {
    id: 'task-1',
    title: 'Initialize repository and setup Tailwind',
    description: 'Configure Vite, React, and Tailwind CSS design tokens according to DESIGN.md.',
    type: 'feature',
    status: 'done',
    assignee: 'Alice Smith',
    dueDate: '2026-10-22',
  },
  {
    id: 'task-2',
    title: 'Build four-column Kanban board layout',
    description: 'Render To Do, In Progress, Review, and Done columns with responsive grid layout.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Bob Jones',
    dueDate: '2026-10-25',
  },
  {
    id: 'task-3',
    title: 'Fix mobile card overflow bug',
    description: 'Cards break outside column boundaries on screens smaller than 380px.',
    type: 'bug',
    status: 'todo',
    assignee: 'Charlie Brown',
    dueDate: '2026-10-24',
  },
];

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
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', SEED_TASKS);
  const [isAccessibleMode, setIsAccessibleMode] = useLocalStorage('vibetracker.accessible', false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState('feature');
  const [formStatus, setFormStatus] = useState('todo');
  const [formAssignee, setFormAssignee] = useState(TEAM[0]);
  const [formDueDate, setFormDueDate] = useState('');

  const handleOpenCreate = (defaultStatus = 'todo') => {
    setEditingTask(null);
    setFormTitle('');
    setFormDesc('');
    setFormType('feature');
    setFormStatus(defaultStatus);
    setFormAssignee(TEAM[0]);
    setFormDueDate('');
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
    setIsModalOpen(true);
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

  const currentThemeSet = isAccessibleMode ? COLOR_MODES.accessible : COLOR_MODES.standard;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 p-6 md:p-8 font-sans selection:bg-stone-200" role="main" aria-label="Project Tracker Board">
      
      {/* Header Bar */}
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 tracking-tight font-medium">Project Tracker</h1>
          <p className="text-xs text-stone-500 mt-1 font-mono">CM6312/CM6812 — Team Alpha Kanban</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <label className="text-xs font-medium text-stone-700 flex items-center gap-2 cursor-pointer bg-stone-50 px-3.5 py-2 rounded-md border border-stone-200 hover:border-stone-300 transition-colors">
            <input
              type="checkbox"
              checked={isAccessibleMode}
              onChange={(e) => setIsAccessibleMode(e.target.checked)}
              className="accent-stone-900 rounded-sm focus:ring-2 focus:ring-sky-600 focus:outline-none w-4 h-4"
            />
            Accessible Mode (Blue & Orange)
          </label>

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

      {/* Grid with 4 Equal Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch" role="region" aria-label="Kanban Board Columns">
        {STAGES.map((stage) => {
          const columnTasks = tasks.filter((task) => task.status === stage.id);

          return (
            <div
              key={stage.id}
              className={`border ${stage.border} ${stage.bg} rounded-lg p-4 flex flex-col min-h-[580px] w-full transition-all shadow-2xs`}
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

                {/* Column "+ Add Task" button with explicit padding and spacing */}
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
                    No tasks yet
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const activeTheme = currentThemeSet[task.type] || currentThemeSet.feature;

                    return (
                      <div
                        key={task.id}
                        onClick={() => handleOpenEdit(task)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') handleOpenEdit(task);
                        }}
                        className={`pt-3.5 pb-4 px-4 pl-6 rounded-md border ${activeTheme.border} bg-white shadow-xs transition-all duration-150 cursor-pointer relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 focus:ring-2 focus:ring-sky-600 focus:outline-none flex flex-col justify-between`}
                      >
                        {/* Accent Side Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${activeTheme.bar}`} aria-hidden="true" />

                        {/* Top ID and Badge Row */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-mono text-stone-500 uppercase font-bold tracking-tight">{task.id}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border flex items-center gap-1 ${activeTheme.badge}`}>
                            <span aria-hidden="true">{activeTheme.symbol}</span>
                            {task.type}
                          </span>
                        </div>

                        {/* Card Title */}
                        <h3 className="text-sm font-bold text-stone-900 mb-1.5 leading-snug">
                          {task.title}
                        </h3>

                        {/* Card Description */}
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
                          {task.description}
                        </p>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px] text-stone-500 font-mono mt-auto">
                          <span className="font-sans font-medium text-stone-800 truncate max-w-[110px]">{task.assignee}</span>
                          {task.dueDate && <span className="shrink-0">Due: {task.dueDate}</span>}
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

      {/* Task Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50" 
          role="dialog" 
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="bg-white rounded-lg border border-stone-200 max-w-md w-full p-6 shadow-xl">
            <h2 className="text-base font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center justify-between">
              <span>{editingTask ? `Edit Task` : 'Create New Task'}</span>
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
                  rows="3"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Add context or notes..."
                  className="w-full text-sm border border-stone-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Assignee</label>
                  <select
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="w-full text-sm border border-stone-300 rounded p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    {TEAM.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>
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
                    className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline focus:ring-2 focus:ring-sky-600 focus:outline-none rounded px-1"
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
                    className="px-3.5 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-stone-900 text-white rounded text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
                  >
                    {editingTask ? 'Save Changes' : 'Create Task'}
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