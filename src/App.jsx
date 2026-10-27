import React, { useState, useEffect } from 'react';

// Default Stage Column Definitions (Customizable)
const DEFAULT_STAGES = [
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
  { name: 'Alice Smith', email: 'alice@projectalpha.com', initials: 'AS', color: 'bg-purple-600 text-white' },
  { name: 'Bob Jones', email: 'bob@projectalpha.com', initials: 'BJ', color: 'bg-amber-600 text-white' },
  { name: 'Charlie Brown', email: 'charlie@projectalpha.com', initials: 'CB', color: 'bg-emerald-600 text-white' },
];

const getTeamMember = (name) => {
  return TEAM.find((m) => m.name === name) || { name: name || 'Unassigned', initials: '??', color: 'bg-stone-500 text-white' };
};

// Color Themes for Feature vs Bug Badges
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
    context: `**Background**\nConfigure Vite, React, and Tailwind CSS design tokens for the Project Alpha workspace.\n\n**Constraints**\n- Ensure color variables adhere to warm stone palette standards.\n- Maintain responsive break points for all column layouts.\n\n**Tried so far**\nVerified Vite config and verified CSS utility purging.\n\n**Pick up**\nCompleted and merged into main repository.`,
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
    context: `**Background**\nRender To Do, In Progress, Review, and Done columns with responsive grid layout.\n\n**Constraints**\n- Columns must stack vertically on mobile screens.\n- Cards must stretch cleanly across four equal columns on desktop.\n\n**Tried so far**\nTested flexbox auto-wrap, switched to Tailwind CSS grid for stable column widths.\n\n**Pick up**\nRefine column padding and transition animations when cards move between stages.`,
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
    context: `**Background**\nCards break outside column boundaries on screens smaller than 380px.\n\n**Constraints**\n- Prevent horizontal scrollbars on narrow mobile viewports.\n- Maintain readable text sizes and minimum touching targets for buttons.\n\n**Tried so far**\nAdded overflow-hidden to card containers, but text truncation still needs line-clamp fixes.\n\n**Pick up**\nApply Tailwind line-clamp-2 to card description text and adjust column margins on small screens.`,
    contextTool: 'Cursor',
    contextUpdatedAt: new Date().toISOString(),
  },
];

const INITIAL_DELIVERABLES = {
  presentation: '',
  demo: '',
  report: '',
  documentation: '',
};

// Time-based urgency styling
const getTaskUrgency = (task) => {
  if (task.status === 'done') return 'neutral';
  if (!task.dueDate) return 'calm';

  const today = new Date('2026-10-26');
  today.setHours(0, 0, 0, 0);

  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);

  const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'alarm';
  if (diffDays <= 1) return 'warning';
  return 'calm';
};

// Helper for relative time formatting
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
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks.v24', SEED_TASKS);
  const [deliverables, setDeliverables] = useLocalStorage('vibetracker.deliverables.v1', INITIAL_DELIVERABLES);
  const [currentUser, setCurrentUser] = useLocalStorage('vibetracker.user', TEAM[0].name);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('vibetracker.isLoggedIn', false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('bob@projectalpha.com');
  const [loginPassword, setLoginPassword] = useState('secret123');
  const [loginError, setLoginError] = useState('');

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // Customisation & Feature Visibility States
  const [pageBgColor, setPageBgColor] = useLocalStorage('vibetracker.theme.custombg', '#FBF9F5');
  const [stagesConfig, setStagesConfig] = useLocalStorage('vibetracker.stages', DEFAULT_STAGES);
  
  // Toggles for optional bars/features
  const [showTeamBar, setShowTeamBar] = useLocalStorage('vibetracker.features.teambar', false);
  const [showUrgencyLegendBar, setShowUrgencyLegendBar] = useLocalStorage('vibetracker.features.urgencylegend', false);
  const [showDeliverablesBanner, setShowDeliverablesBanner] = useLocalStorage('vibetracker.features.deliverables', true);
  const [highlightUrgency, setHighlightUrgency] = useLocalStorage('vibetracker.highlighturgency', false);

  // Accessibility States
  const [isAccessibleMode, setIsAccessibleMode] = useLocalStorage('vibetracker.accessible', false);
  const [fontSizeScale, setFontSizeScale] = useLocalStorage('vibetracker.fontsize', '14px'); // Global base font size
  const [fontStyleMode, setFontStyleMode] = useLocalStorage('vibetracker.fontstyle', 'default'); 

  // Unified Settings Menu Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('features'); // 'features' | 'accessibility' | 'appearance' | 'team'
  
  // User Dropdown State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [filterMyTasks, setFilterMyTasks] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

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

  const fontStyleClasses = {
    default: 'font-sans',
    dyslexic: 'font-mono tracking-wide',
    bold: 'font-sans font-semibold',
  }[fontStyleMode];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter email and password');
      return;
    }
    const matchedUser = TEAM.find(m => m.email.toLowerCase() === loginEmail.toLowerCase());
    if (matchedUser) {
      setCurrentUser(matchedUser.name);
      setIsLoggedIn(true);
      setLoginError('');
      showToast(`Welcome back, ${matchedUser.name}!`);
    } else {
      setLoginError('Invalid credentials. Use one of the demo accounts listed below.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    showToast('Logged out');
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStageId) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    setTasks(
      tasks.map((task) =>
        task.id === draggedTaskId ? { ...task, status: targetStageId } : task
      )
    );
    setDraggedTaskId(null);
    showToast('Task moved successfully');
  };

  const handleCopyContext = (e, taskData) => {
    if (e) e.stopPropagation();

    const title = taskData ? taskData.title : formTitle;
    const desc = taskData ? taskData.description : formDesc;
    const ctx = taskData ? taskData.context : formContext;
    const tool = taskData ? taskData.contextTool : formContextTool;

    const formattedBlock = `## Context (${tool || 'AI Assistant'})

**Task:** ${title}
**Description:** ${desc}

${ctx || ''}`;

    navigator.clipboard.writeText(formattedBlock).then(() => {
      showToast('Copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy');
    });
  };

  const handleDeliverableChange = (key, value) => {
    setDeliverables((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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

  // If user is logged out, show default login screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-lg border border-stone-200 shadow-xl p-8">
          <h1 className="text-2xl font-serif text-stone-900 font-medium mb-1 text-center">Project Alpha</h1>
          <p className="text-xs text-stone-500 text-center mb-6">Sign in to access your team workspace</p>

          {loginError && (
            <div className="mb-4 text-xs bg-red-50 text-red-700 p-3 rounded border border-red-200 font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. bob@projectalpha.com"
                className="w-full text-xs border border-stone-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs border border-stone-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-stone-900 text-white rounded p-2.5 text-xs font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Example Login Details Box */}
          <div className="mt-6 pt-6 border-t border-stone-200 bg-stone-50 p-4 rounded-md text-xs">
            <span className="font-mono font-bold uppercase text-[10px] tracking-wider text-stone-500 block mb-2">
              Default Demo Login Accounts:
            </span>
            <div className="flex flex-col gap-1.5 font-mono text-[11px] text-stone-700">
              <div className="flex justify-between border-b border-stone-200/60 pb-1">
                <span>bob@projectalpha.com</span>
                <span className="text-stone-400">secret123</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1">
                <span>alice@projectalpha.com</span>
                <span className="text-stone-400">secret123</span>
              </div>
              <div className="flex justify-between">
                <span>charlie@projectalpha.com</span>
                <span className="text-stone-400">secret123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ backgroundColor: pageBgColor, fontSize: fontSizeScale }} 
      className={`min-h-screen text-stone-900 p-6 md:p-8 ${fontStyleClasses} selection:bg-stone-200 relative transition-colors duration-200`} 
      role="main" 
      aria-label="Project Tracker Board"
    >
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 px-4 py-2.5 rounded-md shadow-lg font-mono font-medium flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Clean & Ultra-Minimal Header */}
      <header className="mb-4 flex items-center justify-between bg-white px-5 py-4 rounded-lg border border-stone-200 shadow-xs">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-serif text-stone-900 tracking-tight font-medium">Project Alpha</h1>
          
          {filterMyTasks && (
            <span className="text-xs bg-sky-100 text-sky-900 border border-sky-300 px-2.5 py-0.5 rounded-full font-mono font-bold">
              My Tasks Only
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          
          {/* Settings Menu Button */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="font-medium px-3.5 py-2 rounded-md border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Settings</span>
          </button>

          {/* User Profile Menu Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 bg-stone-50 hover:bg-stone-100 px-3.5 py-1.5 rounded-md border border-stone-200 cursor-pointer transition-colors"
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${currentUserObj.color}`}>
                {currentUserObj.initials}
              </span>
              <span className="font-medium text-stone-800">{currentUser}</span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md border border-stone-200 shadow-lg py-1 z-30 animate-fadeIn">
                <div className="px-3 py-2 border-b border-stone-100 font-mono text-[10px] text-stone-400 uppercase">
                  Logged in as {currentUser}
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setFilterMyTasks(!filterMyTasks);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 text-stone-700 font-medium cursor-pointer"
                >
                  {filterMyTasks ? 'Show All Tasks' : 'Filter My Tasks'}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 text-red-600 font-medium border-t border-stone-100 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Primary Action: Add Task Button */}
          <button
            type="button"
            onClick={() => handleOpenCreate('todo')}
            aria-label="Create a new task item"
            className="bg-stone-900 text-stone-50 px-4 py-2 rounded-md font-medium hover:bg-stone-800 transition-colors shadow-xs focus:ring-2 focus:ring-sky-600 focus:outline-none cursor-pointer flex items-center gap-1"
          >
            <span aria-hidden="true" className="font-bold">+</span> Add Task
          </button>
        </div>
      </header>

      {/* Unified Settings Modal/Drawer with Feature Toggles */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setIsSettingsOpen(false); }}
        >
          <div className="bg-white rounded-lg border border-stone-200 max-w-xl w-full p-6 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h2 className="text-base font-semibold text-stone-900">Workspace Settings & Features</h2>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-mono font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Settings Sub-Tabs */}
            <div className="flex border-b border-stone-200 mb-4 gap-4">
              <button
                type="button"
                onClick={() => setSettingsTab('features')}
                className={`pb-2 font-medium cursor-pointer border-b-2 transition-colors ${settingsTab === 'features' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
              >
                Feature Toggles
              </button>
              <button
                type="button"
                onClick={() => setSettingsTab('accessibility')}
                className={`pb-2 font-medium cursor-pointer border-b-2 transition-colors ${settingsTab === 'accessibility' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
              >
                Accessibility
              </button>
              <button
                type="button"
                onClick={() => setSettingsTab('appearance')}
                className={`pb-2 font-medium cursor-pointer border-b-2 transition-colors ${settingsTab === 'appearance' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
              >
                Appearance
              </button>
              <button
                type="button"
                onClick={() => setSettingsTab('team')}
                className={`pb-2 font-medium cursor-pointer border-b-2 transition-colors ${settingsTab === 'team' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}
              >
                Team Workload
              </button>
            </div>

            {/* Tab 1: Feature Toggles (Pick what bars to show) */}
            {settingsTab === 'features' && (
              <div className="flex flex-col gap-3">
                <span className="font-mono text-stone-500 font-bold uppercase tracking-wider text-[11px] mb-1">
                  Choose which optional bars and features appear on your board:
                </span>
                
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded border border-stone-200">
                  <div>
                    <span className="font-medium text-stone-800 block">Deliverables Anchor Banner</span>
                    <span className="text-[11px] text-stone-500">Quick links for presentations, reports, and demos.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showDeliverablesBanner}
                    onChange={(e) => setShowDeliverablesBanner(e.target.checked)}
                    className="accent-stone-900 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between bg-stone-50 p-3 rounded border border-stone-200">
                  <div>
                    <span className="font-medium text-stone-800 block">Team Workload Summary Bar</span>
                    <span className="text-[11px] text-stone-500">Display active ticket counts per team member.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showTeamBar}
                    onChange={(e) => setShowTeamBar(e.target.checked)}
                    className="accent-stone-900 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between bg-stone-50 p-3 rounded border border-stone-200">
                  <div>
                    <span className="font-medium text-stone-800 block">Urgency Legend Bar</span>
                    <span className="text-[11px] text-stone-500">Show color code guide for due dates.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showUrgencyLegendBar}
                    onChange={(e) => setShowUrgencyLegendBar(e.target.checked)}
                    className="accent-stone-900 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between bg-stone-50 p-3 rounded border border-stone-200">
                  <div>
                    <span className="font-medium text-stone-800 block">Highlight Cards by Urgency</span>
                    <span className="text-[11px] text-stone-500">Color-code cards based on deadline status.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={highlightUrgency}
                    onChange={(e) => setHighlightUrgency(e.target.checked)}
                    className="accent-stone-900 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Accessibility */}
            {settingsTab === 'accessibility' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded border border-stone-200">
                  <span className="font-medium text-stone-800">High Contrast Theme (Blue/Orange)</span>
                  <input
                    type="checkbox"
                    checked={isAccessibleMode}
                    onChange={(e) => setIsAccessibleMode(e.target.checked)}
                    className="accent-stone-900 w-4 h-4 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Global Font Size Scaling</label>
                  <div className="inline-flex rounded border border-stone-300 overflow-hidden bg-stone-50 w-full">
                    <button
                      type="button"
                      onClick={() => setFontSizeScale('12px')}
                      className={`flex-1 py-2 cursor-pointer text-center transition-colors ${fontSizeScale === '12px' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-200 text-stone-700'}`}
                    >
                      Compact (12px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSizeScale('14px')}
                      className={`flex-1 py-2 cursor-pointer text-center transition-colors border-l border-r border-stone-300 ${fontSizeScale === '14px' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-200 text-stone-700'}`}
                    >
                      Normal (14px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSizeScale('16px')}
                      className={`flex-1 py-2 cursor-pointer text-center transition-colors border-l border-r border-stone-300 ${fontSizeScale === '16px' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-200 text-stone-700'}`}
                    >
                      Large (16px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSizeScale('19px')}
                      className={`flex-1 py-2 cursor-pointer text-center transition-colors ${fontSizeScale === '19px' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-200 text-stone-700'}`}
                    >
                      X-Large (19px)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Font Style</label>
                  <div className="inline-flex rounded border border-stone-300 overflow-hidden bg-stone-50 w-full">
                    <button
                      type="button"
                      onClick={() => setFontStyleMode('default')}
                      className={`flex-1 py-2 cursor-pointer text-center transition-colors ${fontStyleMode === 'default' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-200 text-stone-700'}`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontStyleMode('bold')}
                      className={`flex-1 py-2 cursor-pointer text-center transition-colors border-l border-stone-300 ${fontStyleMode === 'bold' ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-200 text-stone-700'}`}
                    >
                      High Legibility Bold
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Appearance Customizer */}
            {settingsTab === 'appearance' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between bg-stone-50 p-3 rounded border border-stone-200">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-stone-700 font-mono block">Workspace Background Palette</span>
                    <span className="text-[11px] text-stone-500">Pick any custom hex tone.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={pageBgColor}
                      onChange={(e) => setPageBgColor(e.target.value)}
                      className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setPageBgColor('#FBF9F5')}
                      className="px-2.5 py-1 bg-white text-stone-700 rounded border border-stone-300 cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-stone-700 font-mono block mb-2">Column Tint Customizer</span>
                  <div className="grid grid-cols-2 gap-3">
                    {stagesConfig.map((stage, idx) => (
                      <div key={stage.id} className="bg-stone-50 p-2.5 rounded border border-stone-200 flex flex-col gap-1.5">
                        <span className="font-bold text-stone-800">{stage.label}</span>
                        <select
                          value={stage.bg}
                          onChange={(e) => {
                            const updated = [...stagesConfig];
                            updated[idx].bg = e.target.value;
                            setStagesConfig(updated);
                          }}
                          className="bg-white border border-stone-300 rounded p-1.5"
                        >
                          <option value="bg-purple-100/60">Purple Tint</option>
                          <option value="bg-amber-100/60">Amber Tint</option>
                          <option value="bg-orange-100/60">Orange Tint</option>
                          <option value="bg-emerald-100/60">Emerald Tint</option>
                          <option value="bg-sky-100/60">Sky Tint</option>
                          <option value="bg-stone-100">Neutral Gray</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Team Workload */}
            {settingsTab === 'team' && (
              <div className="flex flex-col gap-3">
                <span className="font-mono text-stone-500 font-bold uppercase tracking-wider text-[11px]">
                  Team Active Tasks:
                </span>
                {TEAM.map((member) => {
                  const memberTasks = tasks.filter((t) => t.assignee === member.name && t.status !== 'done');
                  return (
                    <div key={member.name} className="flex items-center justify-between bg-stone-50 px-3.5 py-2.5 rounded border border-stone-200">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${member.color}`}>
                          {member.initials}
                        </span>
                        <span className="font-medium text-stone-800">{member.name} ({member.email})</span>
                      </div>
                      <span className="font-bold text-stone-900 bg-white px-2.5 py-1 rounded border border-stone-300">{memberTasks.length} active tasks</span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      )}

      {/* OPTIONAL BAR 1: Team Workload Summary Bar (Shown if toggled on) */}
      {showTeamBar && (
        <div className="mb-4 bg-white border border-stone-200 rounded-lg p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <span className="font-mono text-stone-500 font-bold uppercase tracking-wider text-[10px]">
            Team Workload Overview:
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            {TEAM.map((member) => {
              const memberTasks = tasks.filter((t) => t.assignee === member.name && t.status !== 'done');
              return (
                <div key={member.name} className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1 rounded border border-stone-200">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${member.color}`}>
                    {member.initials}
                  </span>
                  <span className="font-medium text-stone-800">{member.name}: <strong>{memberTasks.length}</strong></span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* OPTIONAL BAR 2: Urgency Legend Bar (Shown if toggled on) */}
      {showUrgencyLegendBar && (
        <div className="mb-4 bg-white border border-stone-200 rounded-lg p-3.5 shadow-2xs flex flex-wrap items-center justify-end gap-6 animate-fadeIn">
          <span className="font-mono text-stone-500 font-bold uppercase tracking-wider text-[10px] mr-auto">
            Urgency Legend Guide:
          </span>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-sky-200 border border-sky-400" /><span className="text-stone-700">Normal</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-amber-200 border border-amber-400" /><span className="text-amber-950">Due Soon</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-red-200 border border-red-400" /><span className="text-red-950">Past Due</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-stone-50 border border-stone-300" /><span className="text-stone-600">Done</span></div>
        </div>
      )}

      {/* OPTIONAL BAR 3: Deliverables Anchor Banner (Shown if toggled on) */}
      {showDeliverablesBanner && (
        <div className="mb-6 bg-white border border-stone-200 rounded-lg p-3.5 shadow-2xs animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Presentation */}
            <div className="bg-stone-50 border border-stone-200 rounded p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold uppercase tracking-wider text-stone-700">Presentation</span>
                <span className={`w-2 h-2 rounded-full ${deliverables.presentation.trim() ? 'bg-emerald-500' : 'bg-stone-300'}`} />
              </div>
              <input
                type="url"
                value={deliverables.presentation}
                onChange={(e) => handleDeliverableChange('presentation', e.target.value)}
                placeholder="URL..."
                className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
            </div>

            {/* Demo */}
            <div className="bg-stone-50 border border-stone-200 rounded p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold uppercase tracking-wider text-stone-700">Demo</span>
                <span className={`w-2 h-2 rounded-full ${deliverables.demo.trim() ? 'bg-emerald-500' : 'bg-stone-300'}`} />
              </div>
              <input
                type="url"
                value={deliverables.demo}
                onChange={(e) => handleDeliverableChange('demo', e.target.value)}
                placeholder="URL..."
                className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
            </div>

            {/* Report */}
            <div className="bg-stone-50 border border-stone-200 rounded p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold uppercase tracking-wider text-stone-700">Report</span>
                <span className={`w-2 h-2 rounded-full ${deliverables.report.trim() ? 'bg-emerald-500' : 'bg-stone-300'}`} />
              </div>
              <input
                type="url"
                value={deliverables.report}
                onChange={(e) => handleDeliverableChange('report', e.target.value)}
                placeholder="URL..."
                className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
            </div>

            {/* Documentation */}
            <div className="bg-stone-50 border border-stone-200 rounded p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold uppercase tracking-wider text-stone-700">Docs</span>
                <span className={`w-2 h-2 rounded-full ${deliverables.documentation.trim() ? 'bg-emerald-500' : 'bg-stone-300'}`} />
              </div>
              <input
                type="url"
                value={deliverables.documentation}
                onChange={(e) => handleDeliverableChange('documentation', e.target.value)}
                placeholder="URL..."
                className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono text-stone-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
            </div>

          </div>
        </div>
      )}

      {/* Main Kanban Board Columns with Drag and Drop */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch" role="region" aria-label="Kanban Board Columns">
        {stagesConfig.map((stage) => {
          const columnTasks = displayedTasks.filter((task) => task.status === stage.id);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className={`border ${stage.border} ${stage.bg} rounded-lg p-4 flex flex-col min-h-[580px] w-full transition-colors duration-200 shadow-2xs`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <h2 className={`font-bold uppercase tracking-wider ${stage.headerText}`}>
                    {stage.label}
                  </h2>
                  <span className={`font-bold px-2 py-0.5 rounded-full border shadow-xs ${stage.countBadge}`}>
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenCreate(stage.id)}
                  aria-label={`Add new task to ${stage.label}`}
                  className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-md px-2.5 py-1 font-semibold shadow-xs focus:ring-2 focus:ring-sky-600 focus:outline-none transition-colors cursor-pointer flex items-center justify-center leading-none"
                >
                  +
                </button>
              </div>

              {/* Column Body */}
              <div className="flex flex-col gap-3 flex-1">
                {columnTasks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-stone-300/80 rounded-md p-6 text-center text-stone-400 font-mono">
                    Drop tasks here
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const assigneeObj = getTeamMember(task.assignee);
                    const urgency = getTaskUrgency(task);
                    const activeTheme = currentThemeSet[task.type] || currentThemeSet.feature;

                    // Only apply urgency color tint if highlightUrgency setting is explicitly checked
                    const urgencyClasses = highlightUrgency
                      ? {
                          calm: 'bg-sky-200/90 border-sky-400 shadow-xs text-sky-950',
                          warning: 'bg-amber-200/90 border-amber-400 shadow-xs text-amber-950',
                          alarm: 'bg-red-200/90 border-red-400 shadow-sm ring-1 ring-red-400 text-red-950',
                          neutral: 'bg-white border-stone-200 text-stone-800',
                        }[urgency]
                      : 'bg-white border-stone-200 shadow-2xs text-stone-800';

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => handleOpenEdit(task)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') handleOpenEdit(task);
                        }}
                        className={`pt-3.5 pb-4 px-4 rounded-md border ${urgencyClasses} transition-all duration-150 cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 focus:ring-2 focus:ring-sky-600 focus:outline-none flex flex-col justify-between`}
                      >
                        {/* Top ID, Badge, and Copy Icon Row */}
                        <div className="flex justify-between items-center mb-2 gap-2">
                          <span className="font-mono text-stone-600 uppercase font-bold tracking-tight">{task.id}</span>
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            {highlightUrgency && urgency === 'alarm' && (
                              <span className="bg-red-200 text-red-950 border border-red-400 px-1.5 py-0.5 rounded font-bold font-mono">PAST DUE</span>
                            )}
                            {highlightUrgency && urgency === 'warning' && (
                              <span className="bg-amber-200 text-amber-950 border border-amber-400 px-1.5 py-0.5 rounded font-bold font-mono">DUE SOON</span>
                            )}
                            <span className={`font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider border flex items-center gap-1 ${activeTheme.badge}`}>
                              <span aria-hidden="true">{activeTheme.symbol}</span>
                              {task.type}
                            </span>
                            
                            {/* Copy Context Icon Button */}
                            <button
                              type="button"
                              onClick={(e) => handleCopyContext(e, task)}
                              title="Copy Context"
                              aria-label="Copy Context"
                              className="p-1 rounded bg-black/5 hover:bg-black/10 text-stone-800 transition-colors cursor-pointer flex items-center justify-center"
                            >
                              <svg className="w-3.5 h-3.5 opacity-70 hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect width="13" height="13" x="9" y="9" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Card Title */}
                        <h3 className="font-bold text-stone-900 mb-1.5 leading-snug">
                          {task.title}
                        </h3>

                        {/* Card Description */}
                        <p className="text-stone-700 line-clamp-2 leading-relaxed mb-3">
                          {task.description}
                        </p>

                        {/* Clean Card Footer */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-black/10 text-stone-600 font-mono mt-auto">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${assigneeObj.color}`} title={assigneeObj.name}>
                              {assigneeObj.initials}
                            </span>
                            <span className="font-sans font-medium text-stone-900 truncate max-w-[110px]">{task.assignee}</span>
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
            <h2 className="font-semibold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center justify-between">
              <span>{editingTask ? `Task Details (${editingTask.id})` : 'Create New Task'}</span>
              {editingTask && <span className="font-mono font-normal text-stone-400 uppercase">{editingTask.id}</span>}
            </h2>

            <form onSubmit={handleSaveTask} className="flex flex-col gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Configure database schema"
                  className="w-full border border-stone-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Add context or notes..."
                  className="w-full border border-stone-300 rounded p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              {/* Task Context Markdown Textarea */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-semibold text-stone-700">Context</label>
                  
                  <button
                    type="button"
                    onClick={handleCopyContext}
                    title="Copy Context"
                    aria-label="Copy Context"
                    className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 transition-colors cursor-pointer flex items-center gap-1.5 font-semibold px-2"
                  >
                    <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="13" height="13" x="9" y="9" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    <span>Copy Context</span>
                  </button>
                </div>

                <textarea
                  rows="7"
                  value={formContext}
                  onChange={(e) => handleContextChange(e.target.value)}
                  placeholder="Markdown context for AI tools..."
                  className="w-full font-mono border border-stone-300 rounded p-3 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 leading-relaxed"
                />

                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-stone-500 font-mono">
                    Last updated {formatRelativeTime(formContextUpdatedAt)}
                  </span>
                </div>
              </div>

              {/* Optional AI Tool Dropdown */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">AI Tool</label>
                <select
                  value={formContextTool}
                  onChange={(e) => formContextTool(e.target.value)}
                  className="w-full border border-stone-300 rounded p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 font-medium"
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
                  <label className="block font-semibold text-stone-700 mb-1">Task Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full border border-stone-300 rounded p-2.5 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="feature">Feature</option>
                    <option value="bug">Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Status Column</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full border border-stone-300 rounded p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    {stagesConfig.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-semibold text-stone-700">Assignee</label>
                  {formAssignee !== currentUser && (
                    <button
                      type="button"
                      onClick={() => setFormAssignee(currentUser)}
                      className="text-sky-700 hover:underline font-medium cursor-pointer"
                    >
                      Assign to me ({currentUserObj.initials})
                    </button>
                  )}
                </div>
                <select
                  value={formAssignee}
                  onChange={(e) => setFormAssignee(e.target.value)}
                  className="w-full border border-stone-300 rounded p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600 font-medium"
                >
                  {TEAM.map((member) => (
                    <option key={member.name} value={member.name}>
                      {member.name} ({member.initials})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  className="w-full border border-stone-300 rounded p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-2">
                {editingTask ? (
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-medium px-3.5 py-2 rounded transition-colors cursor-pointer"
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
                    className="px-3.5 py-2 text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded transition-colors cursor-pointer font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white rounded font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
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