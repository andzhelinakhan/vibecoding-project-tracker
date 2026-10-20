import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — M5 CRUD Modal Integration.
 */

// ==========================================
// 1. CONSTANTS & INITIAL DATA SETUP
// ==========================================

export const STAGES = [
  { id: 'todo',         label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',       label: 'Review' },
  { id: 'done',         label: 'Done' },
];

export const TEAM = ['Alice Smith', 'Bob Jones', 'Charlie Brown'];

const SEED_TASKS = [
  {
    id: 'task-1',
    title: 'Initialize repository and setup Tailwind',
    description: 'Configure Vite, React, and Tailwind CSS design tokens according to DESIGN.md.',
    type: 'feature',
    status: 'done',
    assignee: 'Alice Smith',
    dueDate: '2026-10-22',
    createdDate: '2026-10-20',
  },
  {
    id: 'task-2',
    title: 'Build four-column Kanban board layout',
    description: 'Render To Do, In Progress, Review, and Done columns with responsive grid layout.',
    type: 'feature',
    status: 'in-progress',
    assignee: 'Bob Jones',
    dueDate: '2026-10-25',
    createdDate: '2026-10-20',
  },
  {
    id: 'task-3',
    title: 'Fix mobile card overflow bug',
    description: 'Cards break outside column boundaries on screens smaller than 380px.',
    type: 'bug',
    status: 'todo',
    assignee: 'Charlie Brown',
    dueDate: '2026-10-24',
    createdDate: '2026-10-20',
  },
];

// ==========================================
// 2. CUSTOM LOCALSTORAGE PERSISTENCE HOOK
// ==========================================

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
    } catch {
      /* Ignore quota or private-mode errors */
    }
  }, [key, value]);

  return [value, setValue];
}

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', SEED_TASKS);
  
  // ==========================================
  // MILESTONE 5: MODAL & CRUD STATES
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null = creating, object = editing

  // Form input fields state
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState('feature');
  const [formStatus, setFormStatus] = useState('todo');
  const [formAssignee, setFormAssignee] = useState(TEAM[0]);
  const [formDueDate, setFormDueDate] = useState('');

  // Open modal to CREATE a new task
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

  // Open modal to EDIT an existing task (triggered by clicking a card)
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

  // Save task (Handles BOTH Create and Update)
  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      // UPDATE existing task
      setTasks(tasks.map(t => t.id === editingTask.id ? {
        ...t,
        title: formTitle,
        description: formDesc,
        type: formType,
        status: formStatus,
        assignee: formAssignee,
        dueDate: formDueDate
      } : t));
    } else {
      // CREATE new task
      const newTask = {
        id: `task-${Date.now().toString().slice(-4)}`,
        title: formTitle,
        description: formDesc,
        type: formType,
        status: formStatus,
        assignee: formAssignee,
        dueDate: formDueDate,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  // Handle DELETE task
  const handleDeleteTask = () => {
    if (editingTask && confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== editingTask.id));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-900">
      
      {/* Application Header */}
      <header className="mb-6 flex items-end justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Project Tracker
          </h1>
          <p className="text-sm text-slate-500">
            Team Alpha — GitLab-Style Issue Tracker
          </p>
        </div>
        {/* Real Trigger Button for M5 Modal */}
        <button
          onClick={() => handleOpenCreate('todo')}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition shadow-xs"
        >
          + Add Task
        </button>
      </header>

      {/* ========================================== */}
      {/* 4. KANBAN BOARD COLUMNS GRID (M4)          */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {STAGES.map((stage) => {
          const columnTasks = tasks.filter((task) => task.status === stage.id);
          
          return (
            <div
              key={stage.id}
              className="bg-slate-200/70 rounded-xl p-4 flex flex-col min-h-[500px] border border-slate-300/60"
            >
              {/* Column Header & Task Count Badge */}
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-700">
                  {stage.label}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full shadow-xs">
                    {columnTasks.length}
                  </span>
                  {/* Column quick-add button */}
                  <button
                    onClick={() => handleOpenCreate(stage.id)}
                    className="text-xs bg-white text-slate-700 hover:bg-slate-50 w-5 h-5 rounded flex items-center justify-center font-bold border border-slate-300 shadow-xs"
                    title="Add task in column"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tasks Container */}
              <div className="flex flex-col gap-3 flex-1">
                {columnTasks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-400 text-xs">
                    No tasks yet
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleOpenEdit(task)} // Milestone 5: Opens edit modal
                      className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 hover:shadow-md transition cursor-pointer relative overflow-hidden group"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.type === 'bug' ? 'bg-red-500' : 'bg-emerald-500'}`} />

                      <div className="flex justify-between items-center mb-1 pl-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{task.id}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          task.type === 'bug' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {task.type}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-slate-800 mb-1 pl-1">{task.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 pl-1">{task.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400 pl-1">
                        <span className="font-medium text-slate-600">👤 {task.assignee}</span>
                        {task.dueDate && <span>📅 {task.dueDate}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* 5. CRUD MODAL POPUP (Milestone 5)          */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingTask ? `Edit Task (${editingTask.id})` : 'Create New Task'}
            </h2>

            <form onSubmit={handleSaveTask} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Design user profile page"
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Provide brief issue details..."
                  className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status Column</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Assignee</label>
                  <select
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    {TEAM.map(member => <option key={member} value={member}>{member}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                  >
                    Delete Task
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium"
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