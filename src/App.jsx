import { useState, useEffect } from 'react';

/**
 * Vibecoding Project Tracker — M4 Data Model & Board Scaffold.
 */

// ==========================================
// 1. CONSTANTS & INITIAL DATA SETUP
// ==========================================

// Define the four columns of the Kanban board in their exact render order.
export const STAGES = [
  { id: 'todo',         label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review',       label: 'Review' },
  { id: 'done',         label: 'Done' },
];

// Predefined team members from PRD §8 (allowed values for task assignees)
export const TEAM = ['Alice Smith', 'Bob Jones', 'Charlie Brown'];

// Seed tasks to ensure the board isn't completely empty on first load (M4 requirement)
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

/**
 * A tiny localStorage hook to ensure tasks survive page reloads without needing a backend.
 */
export function useLocalStorage(key, initialValue) {
  // Step A: Initialize state by reading from browser localStorage, falling back to seed data
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Step B: Automatically write changes back to localStorage whenever `value` updates
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Ignore quota or private-mode errors for the hackathon */
    }
  }, [key, value]);

  return [value, setValue];
}

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  // Step 1: Manage tasks state using our localStorage hook (M4 Data Model)
  const [tasks, setTasks] = useLocalStorage('vibetracker.tasks', SEED_TASKS);
  
  // Step 2: State placeholder for editing/adding tasks via modal (M5 prep)
  const [editing, setEditing] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-900">
      
      {/* Step 3: Application Header */}
      <header className="mb-6 flex items-end justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Project Tracker
          </h1>
          <p className="text-sm text-slate-500">
            Team Alpha — GitLab-Style Issue Tracker
          </p>
        </div>
        {/* Placeholder trigger button for M5 Modal */}
        <button
          onClick={() => alert('Modal open for M5 (Add Task)')}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
        >
          + Add Task
        </button>
      </header>

      {/* ========================================== */}
      {/* 4. KANBAN BOARD COLUMNS GRID (M4)          */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Map through each predefined column stage */}
        {STAGES.map((stage) => {
          // Filter tasks that belong specifically to this column's status ID
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
                <span className="text-xs font-bold bg-white text-slate-600 px-2 py-0.5 rounded-full shadow-xs">
                  {columnTasks.length}
                </span>
              </div>

              {/* Tasks Container */}
              <div className="flex flex-col gap-3 flex-1">
                {/* Show empty state placeholder if no tasks exist in this column */}
                {columnTasks.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-400 text-xs">
                    No tasks yet
                  </div>
                ) : (
                  // Map and render individual task cards
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setEditing(task)} // Pre-wiring for M5 edit on click
                      className="bg-white p-4 rounded-lg shadow-xs border border-slate-200 hover:shadow-md transition cursor-pointer relative overflow-hidden group"
                    >
                      {/* Left indicator strip: Red for bugs, Emerald for features (M6 prep) */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.type === 'bug' ? 'bg-red-500' : 'bg-emerald-500'}`} />

                      {/* Card Header: ID and Type Badge */}
                      <div className="flex justify-between items-center mb-1 pl-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{task.id}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          task.type === 'bug' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {task.type}
                        </span>
                      </div>

                      {/* Task Title and Description Preview */}
                      <h3 className="font-semibold text-sm text-slate-800 mb-1 pl-1">{task.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 pl-1">{task.description}</p>

                      {/* Card Footer: Assignee & Due Date */}
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
    </div>
  );
}