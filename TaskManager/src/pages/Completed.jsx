import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Completed() {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompletedTasks = async () => {
            try {
                const response = await axios.get('http://localhost:8000/tasks/');
                if (Array.isArray(response.data)) {
                    setTasks(response.data.filter(task => task.status === 'Completed'));
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCompletedTasks();
    }, []);

    if (error) {
        return <div style={styles.error}>Error fetching tasks: {error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>Completed Tasks</h1>
            {tasks.length > 0 ? (
                <ul style={styles.taskList}>
                    {tasks.map(task => (
                        <li key={task.id} style={styles.taskItem}>
                            <div style={styles.taskContent}>
                                <div style={styles.taskDetails}>
                                    <h2 style={styles.taskTitle}>{task.title}</h2>
                                    <p style={styles.taskDescription}>{task.description}</p>
                                    <p style={styles.taskDate}>Deadline: {task.deadline}</p>
                                </div>
                                <div style={styles.taskMembers}>
                                    {Array.isArray(task.members) && task.members.length > 0 ? (
                                        task.members.map((member, index) => (
                                            <div
                                                key={index}
                                                style={styles.memberBadge}
                                                onMouseEnter={(e) => showTooltip(e)}
                                                onMouseLeave={(e) => hideTooltip(e)}
                                            >
                                                {member.email ? member.email[0] : '?'}
                                                <div
                                                    style={{
                                                        ...styles.tooltip,
                                                        display: 'none' // hidden by default
                                                    }}
                                                    className="tooltip"
                                                >
                                                    <p>Email: {member.email}</p>
                                                    <p>Role: {member.role || 'N/A'}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No members assigned.</p>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No completed tasks found.</p>
            )}
        </div>
    );

    function showTooltip(e) {
        const tooltip = e.currentTarget.querySelector('.tooltip');
        if (tooltip) {
            tooltip.style.display = 'block';
        }
    }

    function hideTooltip(e) {
        const tooltip = e.currentTarget.querySelector('.tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
}

const styles = {
    container: {
        backgroundColor: '#fff', // White background for the entire component
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
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
        padding: 0
    },
    taskItem: {
        display: 'flex',
        justifyContent: 'space-between',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#f9f9f9'
    },
    taskContent: {
        display: 'flex',
        width: '100%'
    },
    taskDetails: {
        flex: '0 0 70%',
        paddingRight: '10px'
    },
    taskMembers: {
        flex: '0 0 30%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        position: 'relative'
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
    },
    memberBadge: {
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '5px',
        fontSize: '0.9em',
        position: 'relative',
        cursor: 'pointer',
        padding: '5px',
        textAlign: 'center'
    },
    tooltip: {
        position: 'absolute',
        bottom: '120%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#333',
        color: '#fff',
        padding: '5px',
        borderRadius: '3px',
        fontSize: '0.8em',
        whiteSpace: 'nowrap',
        zIndex: 1000
    }
};

export default Completed;
