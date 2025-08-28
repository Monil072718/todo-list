"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";

export default function TasksPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", description: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  async function fetchTasks() {
    try {
      setLoadingList(true);
      const res = await api.get("/tasks");
      setTasks(res.data?.tasks || []);
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to load tasks");
    } finally {
      setLoadingList(false);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await api.post("/tasks", form);
      setTasks((t) => [res.data.task, ...t]);
      setForm({ title: "", description: "" });
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to add task");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(task) {
    try {
      const res = await api.put(`/tasks/${task._id}`, {
        status: task.status === "completed" ? "pending" : "completed",
      });
      setTasks((list) => list.map((t) => (t._id === task._id ? res.data.task : t)));
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to update task");
    }
  }

  async function removeTask(id) {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((list) => list.filter((t) => t._id !== id));
    } catch (e) {
      setError(e?.response?.data?.error || "Failed to delete task");
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Tasks</h1>
        <button onClick={logout} className="text-sm underline">Logout</button>
      </div>

      <form onSubmit={addTask} className="mb-6 space-y-3">
        <input
          placeholder="Task title"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <textarea
          placeholder="Description (optional)"
          className="w-full p-2 border rounded"
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={saving} className="px-4 py-2 rounded bg-black text-white">
          {saving ? "Adding..." : "Add Task"}
        </button>
      </form>

      {loadingList ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-600">No tasks yet. Add your first one!</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li key={t._id} className="p-3 border rounded flex items-center justify-between">
              <div>
                <p className={`font-medium ${t.status === "completed" ? "line-through text-gray-500" : ""}`}>{t.title}</p>
                {t.description && <p className="text-sm text-gray-600">{t.description}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Status: <span className="uppercase">{t.status}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleStatus(t)} className="px-3 py-1 rounded border">
                  {t.status === "completed" ? "Mark Pending" : "Mark Done"}
                </button>
                <button onClick={() => removeTask(t._id)} className="px-3 py-1 rounded border border-red-500 text-red-600">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
