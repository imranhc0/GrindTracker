"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import { motion } from "framer-motion";

export default function GoalsInline() {
  const { goals, createGoal, updateGoal, deleteGoal, addTask, setToast } = useApp();
  const [form, setForm] = useState({ name: "", deadline: "", type: "recurring" });
  const [open, setOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [taskGoalId, setTaskGoalId] = useState("");
  const [taskName, setTaskName] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return setToast({ type: 'error', message: 'Name is required' });
    createGoal(form);
    setForm({ name: "", deadline: "", type: "recurring" });
    setOpen(false);
    setToast({ type: 'success', message: 'Goal created' });
  }
  // Listen for dashboard card add task requests
  useEffect(() => {
    function onOpen(e) {
      const id = e.detail?.goalId || "";
      setTaskGoalId(id);
      setOpenTask(true);
    }
    window.addEventListener('open-add-task-modal', onOpen);
    return () => window.removeEventListener('open-add-task-modal', onOpen);
  }, []);


  return (
    <div className="space-y-4">
      <motion.button
        className="button-primary flex items-center gap-2 hover-lift"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Icon name="Plus" className="w-4 h-4"/>
        New Goal
      </motion.button>
      <GoalModal open={open} onClose={() => setOpen(false)} form={form} setForm={setForm} onSubmit={onSubmit} />

      <TaskModal
        open={openTask}
        onClose={() => setOpenTask(false)}
        onSubmit={() => {
          if (!taskName.trim()) return;
          addTask(taskGoalId, taskName);
          setTaskName("");
          setOpenTask(false);
          setToast({ type: 'success', message: 'Task added' });
        }}
        taskName={taskName}
        setTaskName={setTaskName}
      />

      <div className="space-y-3">
        {goals.map(g => (
          <div key={g.id} className="section p-3 space-y-2">
            <div className="flex justify-between items-start gap-2">
              <input
                className="font-semibold bg-transparent border-none outline-none flex-1 text-sm text-gray-900 dark:text-gray-100"
                value={g.name}
                onChange={e => updateGoal(g.id, { name: e.target.value })}
                placeholder="Goal name"
              />
              <button
                className="text-red-500 text-xs hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => deleteGoal(g.id)}
              >
                Delete
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Deadline</label>
                <input
                  type="date"
                  className="input w-full text-xs px-2 py-1 rounded text-gray-900 dark:text-gray-100"
                  value={g.deadline || ''}
                  onChange={e => updateGoal(g.id, { deadline: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">Type</label>
                <select
                  className="input w-full text-xs px-2 py-1 rounded text-gray-900 dark:text-gray-100"
                  value={g.type}
                  onChange={e => updateGoal(g.id, { type: e.target.value })}
                >
                  <option value="one-time">One-time</option>
                  <option value="recurring">Recurring</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-all font-semibold ${
                  g.isActive
                    ? 'bg-green-600 text-white border border-green-600 dark:bg-green-500 dark:text-white dark:border-green-500'
                    : 'bg-gray-600 text-white border border-gray-600 dark:bg-gray-500 dark:text-white dark:border-gray-500'
                }`}
                onClick={() => updateGoal(g.id, { isActive: !g.isActive })}
              >
                {g.isActive ? (
                  <>
                    <Icon name="Pause" className="w-3 h-3"/>
                    Pause
                  </>
                ) : (
                  <>
                    <Icon name="Play" className="w-3 h-3"/>
                    Activate
                  </>
                )}
              </button>
            </div>

              <button
                className="text-xs border border-dashed border-black/20 dark:border-white/20 rounded px-2 py-1 flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-all"
                onClick={() => { setTaskGoalId(g.id); setOpenTask(true); }}
              >
                <Icon name="Plus" className="w-3 h-3"/>
                Add Task
              </button>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="section p-6 text-center">
            <Icon name="Target" className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No goals yet. Create your first goal above!</p>
          </div>
        )}
      </div>
    </div>
  );
}


function GoalModal({ open, onClose, form, setForm, onSubmit }) {
  return (
    <Modal open={open} onClose={onClose} title="Create New Goal">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Goal Name</label>
          <input
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)'
            }}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Learn Spanish, Exercise Daily, Read More"
            autoFocus
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Target Deadline (Optional)</label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)'
            }}
            value={form.deadline}
            onChange={e => setForm({ ...form, deadline: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Goal Type</label>
          <select
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)'
            }}
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            <option value="recurring">Recurring (Daily habits)</option>
            <option value="one-time">One-time (Project goals)</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm"
          >
            Create Goal
          </button>
        </div>
      </form>
    </Modal>
  );
}


function TaskModal({ open, onClose, onSubmit, taskName, setTaskName }) {
  return (
    <Modal open={open} onClose={onClose} title="Add Daily Task">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Task Name</label>
          <input
            className="w-full px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)'
            }}
            placeholder="e.g., Practice Spanish for 30 minutes, Do 20 push-ups"
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
            style={{
              borderColor: 'var(--input-border)',
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm"
            onClick={onSubmit}
          >
            Add Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
