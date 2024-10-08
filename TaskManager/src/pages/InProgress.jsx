import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function InProgress() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInProgressTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tasks/');
                if (Array.isArray(response.data)) {
                    setTasks(response.data.filter(task => task.status === 'In Progress' || task.status === 'Pending'));
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchInProgressTasks();
    }, []);

    const handleTaskClick = (taskId) => {
        navigate(`/tasks?highlight=${taskId}`);  // Pass taskId as query param
    };

    if (error) {
        return <div style={styles.error}>Error fetching tasks: {error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>In Progress Tasks</h1>
            {tasks.length > 0 ? (
                <ul style={styles.taskList}>
                    {tasks.map(task => (
                        <li
                            key={task.id}
                            style={styles.taskItem}
                            onClick={() => handleTaskClick(task.id)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                        >
                            <div style={styles.taskDetails}>
                                <h2 style={styles.taskTitle}>{task.title}</h2>
                                <p style={styles.taskDescription}>{task.description}</p>
                                <p style={styles.taskDate}>Deadline: {task.deadline}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No in-progress tasks found.</p>
            )}
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: '#fff', // White background for the entire component
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
        boxSizing: 'border-box', // Ensures padding doesn't affect overall width
    },
    header: {
        margin: '0 0 20px',
        fontSize: '24px',
    },
    error: {
        color: 'red',
        padding: '10px',
        border: '1px solid red',
        borderRadius: '4px',
        backgroundColor: '#fdd',
        textAlign: 'center',
    },
    taskList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0, // Remove any default margin
    },
    taskItem: {
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#f9f9f9',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        textDecoration: 'none'
    },
    taskDetails: {
        display: 'flex',
        flexDirection: 'column'
    },
    taskTitle: {
        fontSize: '1.2em',
        margin: 0
    },
    taskDescription: {
        margin: '5px 0'
    },
    taskDate: {
        color: '#666'
    }
};

export default InProgress;
