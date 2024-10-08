import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [taskData, setTaskData] = useState({
    tasks: [],
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todos: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/tasks/');
        
        const totalTasks = data.length;
        const completedTasks = data.filter(task => task.status === 'Completed').length;
        const inProgressTasks = data.filter(task => task.status === 'In Progress').length;
        const todos = data.filter(task => task.status === 'Pending').length;

        setTaskData({
          tasks: data,
          totalTasks,
          completedTasks,
          inProgressTasks,
          todos,
        });

        setChartData([
          { name: 'Completed', value: completedTasks },
          { name: 'In Progress', value: inProgressTasks },
          { name: 'Pending', value: todos },
        ]);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const renderStatCard = (title, count, lastMonthCount) => (
    <div style={styles.statCard}>
      <h4>{title}</h4>
      <h2>{count}</h2>
      <p>{lastMonthCount} last month</p>
    </div>
  );

  return (
    <div style={styles.dashboard}>
      <div style={styles.statsContainer}>
        {renderStatCard('Total Tasks', taskData.totalTasks, taskData.totalTasks)}
        {renderStatCard('Completed Tasks', taskData.completedTasks, taskData.completedTasks)}
        {renderStatCard('In Progress', taskData.inProgressTasks, taskData.inProgressTasks)}
        {renderStatCard('Todos', taskData.todos, taskData.todos)}
      </div>

      <div style={styles.chartSection}>
        <h3>Task Status Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
const styles = {
  dashboard: {
    padding: '25px',
    backgroundColor: '#f5f5f5',
    fontFamily: '"Roboto", sans-serif',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    color: '#333333', // Added text color for better visibility
  },
  chartSection: {
    background: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
    color: '#333333', // Added text color for better visibility
  },
};


export default Dashboard;
