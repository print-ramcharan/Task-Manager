import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TaskCard from './TaskCard';

const PRIORITY_LEVELS = ['Low', 'Medium', 'High'];

function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'

  // Filter states
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('more'); // 'more' for deadlines far, 'less' for deadlines close

  // Modal form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [deadline, setDeadline] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/tasks/')
      .then(response => {
        if (Array.isArray(response.data)) {
          setTasks(response.data);
        } else {
          setError('Unexpected data format.');
        }
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch tasks.');
        setLoading(false);
      });
  }, []);

  const calculateDaysDifference = (dateString) => {
    const currentDate = new Date();
    const taskDate = new Date(dateString);
    const differenceInTime = taskDate - currentDate;
    return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
  };

  const filteredTasks = tasks
    .filter(task => !priorityFilter || task.priority === priorityFilter)
    .sort((a, b) => {
      const aDuration = calculateDaysDifference(a.deadline);
      const bDuration = calculateDaysDifference(b.deadline);
      return sortOrder === 'more' ? bDuration - aDuration : aDuration - bDuration;
    });

  const handleEdit = (task) => {
    setCurrentTask(task);
    setTitle(task.title || '');
    setDescription(task.description || '');
    setPriority(task.priority || '');
    setDeadline(task.deadline || '');
    setDuration(task.duration || '');
    setStatus(task.status || '');
    setSubtasks(task.subtasks || []);
    setMembers(task.members.map(member => member.email || member) || []);
    setIsEditModalOpen(true);
  };

  const handleDelete = (taskId) => {
    if (!taskId) {
      console.error('Task ID is undefined.');
      return;
    }
    console.log(`Deleting task with ID: ${taskId}`);

    axios.delete(`http://localhost:8000/tasks/${taskId}/`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
  };

  const handleUpdateTask = () => {
    if (!currentTask || !currentTask.id) {
      console.error('Current task or task ID is not defined.');
      return;
    }

    const updatedTask = {
      title,
      description,
      priority,
      deadline,
      duration,
      status,
      subtasks,
      members
    };

    axios.put(`http://localhost:8000/tasks/${currentTask.id}/`, updatedTask)
      .then(response => {
        setTasks(tasks.map(task => task.id === currentTask.id ? response.data : task));
        setIsEditModalOpen(false);
      })
      .catch(error => {
        console.error('Error updating task:', error);
      });
  };

  const closeModal = () => setIsEditModalOpen(false);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!tasks.length) {
    return <div style={styles.empty}>No tasks available.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.filters}>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={styles.filterSelect}>
          <option value="">Filter by Priority</option>
          {PRIORITY_LEVELS.map(level => (
            <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
          ))}
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={styles.filterSelect}>
          <option value="more">Sort by Deadline: Far</option>
          <option value="less">Sort by Deadline: Close</option>
        </select>
        <button onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')} style={styles.viewButton}>
          {viewMode === 'card' ? 'View as List' : 'View as Cards'}
        </button>
      </div>
      <div style={viewMode === 'card' ? styles.cardBoard : styles.listBoard}>
        {filteredTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
            viewMode={viewMode}
            
          />
        ))}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <button style={styles.closeButton} onClick={closeModal}>&times;</button>
        <h2 style={{ margin: '0', padding: '0' }}>Edit Task</h2>
        <div style={styles.formContainer}>
          <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleUpdateTask(); }}>
            <label style={styles.formLabel}>
              Title:
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={styles.formInput} />
            </label>
            <label style={styles.formLabel}>
              Description:
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required style={styles.formInput} />
            </label>
            <label style={styles.formLabel}>
              Deadline:
              <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required style={styles.formInput} />
            </label>
            <label style={styles.formLabel}>
              Duration:
              <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} required style={styles.formInput} />
            </label>
            <label style={styles.formLabel}>
              Status:
              <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required style={styles.formInput} />
            </label>
            <label style={styles.formLabel}>
              Priority:
              <input type="text" value={priority} onChange={(e) => setPriority(e.target.value)} required style={styles.formInput} />
            </label>
            <label style={styles.formLabel}>
              Subtasks (comma-separated):
              <input type="text" value={subtasks.join(', ')} onChange={(e) => setSubtasks(e.target.value.split(',').map(subtask => subtask.trim()))} style={styles.formInput} />
            </label>
            <label style={styles.formLabel}>
              Members (comma-separated emails):
              <input type="text" value={members.join(', ')} onChange={(e) => setMembers(e.target.value.split(',').map(email => email.trim()))} style={styles.formInput} />
            </label>
            <button type="submit" style={styles.submitButton}>Update Task</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  filterSelect: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  viewButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  cardBoard: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  listBoard: {
    display: 'block',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20px',
  },
  error: {
    textAlign: 'center',
    marginTop: '20px',
    color: 'red',
  },
  empty: {
    textAlign: 'center',
    marginTop: '20px',
    color: 'gray',
  },
  formContainer: {
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  formLabel: {
    marginBottom: '5px',
  },
  formInput: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  submitButton: {
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
  }
};

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    width: '80%',
    maxWidth: '500px',
    borderRadius: '8px',
  },
};

export default TaskBoard;
