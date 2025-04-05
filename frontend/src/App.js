
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Use the environment variable for API_URL or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.49.2:30001/api';
console.log(API_URL);

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to fetch tasks. Please check your backend service.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingTask({ ...editingTask, [name]: value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      await axios.post(`${API_URL}/tasks`, newTask);
      setNewTask({ title: '', description: '' });
      fetchTasks();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    }
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) {
      setError('Task title is required.');
      return;
    }

    try {
      await axios.put(`${API_URL}/tasks/${editingTask.id}`, {
        title: editingTask.title,
        description: editingTask.description || '', // Handle empty description
      });
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager</h1>
        <h2>by Bhanu Reddy (2022bcd0026)</h2>
      </header>

      <div className="container">
        {error && <div className="error-message">{error}</div>}

        <div className="form-container">
          <h2>Add New Task</h2>
          <form onSubmit={createTask}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn">Add Task</button>
          </form>
        </div>

        <div className="tasks-container">
          <h2>Tasks</h2>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks found. Add a new task to get started.</p>
          ) : (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <li key={task.id} className="task-item">
                  {editingTask && editingTask.id === task.id ? (
                    <form onSubmit={updateTask} className="edit-form">
                      <div className="form-group">
                        <label htmlFor={`edit-title-${task.id}`}>Title:</label>
                        <input
                          type="text"
                          id={`edit-title-${task.id}`}
                          name="title"
                          value={editingTask.title}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`edit-description-${task.id}`}>Description:</label>
                        <textarea
                          id={`edit-description-${task.id}`}
                          name="description"
                          value={editingTask.description}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="button-group">
                        <button type="submit" className="btn save">Save</button>
                        <button type="button" className="btn cancel" onClick={cancelEditing}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="task-content">
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <small>Created: {new Date(task.created_at).toLocaleString()}</small>
                      </div>
                      <div className="task-actions">
                        <button onClick={() => startEditing(task)} className="btn edit">Edit</button>
                        <button onClick={() => deleteTask(task.id)} className="btn delete">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;