import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import TaskBoard from './TaskBoard';

Modal.setAppElement('#root');

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setTasks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks.');
        setLoading(false);
      });
  }, []);

  const handleCreateTask = () => {
    const newTask = {
      title,
      description,
      priority,
      deadline,
      duration,
      status,
      subtasks,
      members
    };

    axios.post('http://localhost:8000/tasks/', newTask)
      .then(response => {
        setTasks(prevTasks => [...prevTasks, response.data]);
        setTitle('');
        setDescription('');
        setPriority('');
        setDeadline('');
        setDuration('');
        setStatus('');
        setSubtasks([]);
        setMembers([]);
        setIsModalOpen(false);
      })
      .catch(error => {
        console.error('Error creating task:', error);
      });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Tasks</h1>
        <button style={styles.createButton} onClick={openModal}>
          + Create Task
        </button>
      </div>
      <TaskBoard tasks={tasks} className='taskboard' />
      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={modalStyles}
      >
        <button style={styles.closeButton} onClick={closeModal}>&times;</button>
        <h2 style={styles.modalTitle}>Create a New Task</h2>
        <div style={styles.formContainer}>
          <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleCreateTask(); }}>
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
              <div style={styles.statusContainer}>
                <div
                  style={{
                    ...styles.statusOption,
                    ...styles.statusPending,
                    ...(status === 'Pending' ? styles.selectedPending : {}),
                  }}
                  onClick={() => setStatus('Pending')}
                >
                  Pending
                </div>
                <div
                  style={{
                    ...styles.statusOption,
                    ...styles.statusInProgress,
                    ...(status === 'In Progress' ? styles.selectedInProgress : {}),
                  }}
                  onClick={() => setStatus('In Progress')}
                >
                  In Progress
                </div>
                <div
                  style={{
                    ...styles.statusOption,
                    ...styles.statusCompleted,
                    ...(status === 'Completed' ? styles.selectedCompleted : {}),
                  }}
                  onClick={() => setStatus('Completed')}
                >
                  Completed
                </div>
              </div>
            </label>
            <label style={styles.formLabel}>
              Priority:
              <div style={styles.priorityContainer}>
                <div
                  style={{
                    ...styles.priorityOption,
                    ...styles.priorityLow,
                    ...(priority === 'Low' ? styles.selectedLow : {}),
                  }}
                  onClick={() => setPriority('Low')}
                >
                  Low
                </div>
                <div
                  style={{
                    ...styles.priorityOption,
                    ...styles.priorityMedium,
                    ...(priority === 'Medium' ? styles.selectedMedium : {}),
                  }}
                  onClick={() => setPriority('Medium')}
                >
                  Medium
                </div>
                <div
                  style={{
                    ...styles.priorityOption,
                    ...styles.priorityHigh,
                    ...(priority === 'High' ? styles.selectedHigh : {}),
                  }}
                  onClick={() => setPriority('High')}
                >
                  High
                </div>
              </div>
            </label>
            <label style={styles.formLabel}>
              Subtasks (comma-separated):
              <input type="text" value={subtasks.join(', ')} onChange={(e) => setSubtasks(e.target.value.split(',').map(subtask => subtask.trim()))} style={styles.formInput} />
            </label>
            <label style={styles.formLabel}>
              Members (comma-separated emails):
              <input type="text" value={members.join(', ')} onChange={(e) => setMembers(e.target.value.split(',').map(email => email.trim()))} style={styles.formInput} />
            </label>
            <button type="submit" style={styles.submitButton}>Add Task</button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '20px',
  },
  createButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  formContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px',
    maxWidth: '100%',
  },
  formLabel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  formInput: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  statusContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  statusOption: {
    padding: '8px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
  },
  statusPending: {
    backgroundColor: '#f8d7da',
  },
  statusInProgress: {
    backgroundColor: '#fff3cd',
  },
  statusCompleted: {
    backgroundColor: '#d4edda',
  },
  selectedPending: {
    backgroundColor: '#dc3545',
  },
  selectedInProgress: {
    backgroundColor: '#ffc107',
  },
  selectedCompleted: {
    backgroundColor: '#28a745',
  },
  priorityContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  priorityOption: {
    padding: '8px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
  },
  priorityLow: {
    backgroundColor: '#d4edda',
  },
  priorityMedium: {
    backgroundColor: '#fff3cd',
  },
  priorityHigh: {
    backgroundColor: '#f8d7da',
  },
  selectedLow: {
    backgroundColor: '#28a745',
  },
  selectedMedium: {
    backgroundColor: '#ffc107',
  },
  selectedHigh: {
    backgroundColor: '#dc3545',
  },
  submitButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  modalTitle: {
    margin: '0 0 20px',
    fontSize: '24px',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
};

const modalStyles = {
  content: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: 'auto',
    position: 'relative',
    overflow: 'visible',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

export default Tasks;
