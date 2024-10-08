import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// Animation for highlighting the card
const outlineAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 2px black;
  }
  60% {
    box-shadow: 0 0 0 1px black;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
`;

// Card component with dynamic styles based on viewMode and highlighting
const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  width: ${(props) => (props.viewMode === 'list' ? '100%' : '250px')};
  height: auto;  /* Allow height to adjust automatically */
  box-sizing: border-box;
  position: relative;
  transition: width 0.3s ease, height 0.3s ease;
  overflow: visible;  /* Ensure content is not cut off */
  animation: ${(props) => (props.isHighlighted ? outlineAnimation : 'none')} 1s ease-in-out;
`;

// Header for the card
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

// Priority label with dynamic color based on priority
const Priority = styled.span`
  font-weight: bold;
  font-size: ${(props) => (props.viewMode === 'list' ? '12px' : '14px')};
  color: ${(props) => getPriorityColor(props.priority)};
  margin-right: 16px;
`;

// Title of the task
const Title = styled.div`
  font-size: ${(props) => (props.viewMode === 'list' ? '16px' : '18px')};
  font-weight: 600;
  margin-bottom: ${(props) => (props.viewMode === 'list' ? '4px' : '8px')};
  flex: 1;
  text-align: left;
`;

// Details of the task
const Details = styled.div`
  font-size: ${(props) => (props.viewMode === 'list' ? '12px' : '14px')};
  color: #555;
  margin-bottom: 8px;
`;

// Subtasks list
const Subtasks = styled.div`
  margin-bottom: ${(props) => (props.viewMode === 'list' ? '4px' : '8px')};
  color: #777;
  font-size: 12px;

  ul {
    padding-left: 20px; /* Indent list items */
    margin-top: 8px;
    margin-bottom: 8px;
  }

  li {
    margin-bottom: 4px;
  }
`;

// Team members display
const Team = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: ${(props) => (props.viewMode === 'list' ? '8px' : '8px')}; /* Ensure margin in list view */
`;

// Tooltip for team members
const Tooltip = styled.div`
  visibility: hidden;
  width: 150px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 10px;
  position: absolute;
  z-index: 10;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 14px;
`;

// Team member avatar
const TeamMember = styled.div`
  width: ${(props) => (props.viewMode === 'list' ? '32px' : '40px')};
  height: ${(props) => (props.viewMode === 'list' ? '32px' : '40px')};
  border-radius: 50%;
  background-color: #007bff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.viewMode === 'list' ? '14px' : '16px')};
  font-weight: bold;
  cursor: pointer;
  position: relative;
  overflow: visible; /* Ensure tooltip is not cut off */
  
  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;

// Edit and Delete buttons
const EditButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  color: #fff;
  background-color: #28a745;
  cursor: pointer;
  margin-right: 8px;
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  color: #fff;
  background-color: #dc3545;
  cursor: pointer;
`;

// Main TaskCard component
function TaskCard({ task, onEdit, onDelete, viewMode, highlightedId }) {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const members = task?.members || [];
  const subtasks = task?.subtasks || [];

  useEffect(() => {
    if (task?.id === highlightedId) {
      setIsHighlighted(true);
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 2000); // Highlight for 2 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [task?.id, highlightedId]);

  return (
    <Card viewMode={viewMode} isHighlighted={isHighlighted}>
      <Header viewMode={viewMode}>
        <Priority priority={task?.priority} viewMode={viewMode}>
          {task?.priority}
        </Priority>
        <Title viewMode={viewMode}>
          {task?.title}
        </Title>
      </Header>
      {viewMode === 'card' && (
        <>
          <Details viewMode={viewMode}>
            {task?.description}
          </Details>
          <Subtasks viewMode={viewMode}>
            <ul>
              {subtasks.map((subtask, index) => (
                <li key={index}>{subtask}</li>
              ))}
            </ul>
          </Subtasks>
          <Team viewMode={viewMode}>
            {members.map((member) => (
              <TeamMember key={member.email} viewMode={viewMode}>
                <span>{member.email[0].toUpperCase()}</span>
                <Tooltip viewMode={viewMode}>
                  <div>Email: {member.email}</div>
                  <div>Role: {member.role}</div>
                </Tooltip>
              </TeamMember>
            ))}
          </Team>
          <EditButton onClick={() => onEdit(task)}>Edit</EditButton>
          <DeleteButton onClick={() => onDelete(task.id)}>Delete</DeleteButton>
        </>
      )}
      {viewMode === 'list' && (
        <>
          <Subtasks viewMode={viewMode}>
            <ul>
              {subtasks.map((subtask, index) => (
                <li key={index}>{subtask} </li>
              ))}
            </ul>
          </Subtasks>
          <Team viewMode={viewMode}>
            {members.map((member) => (
              <TeamMember key={member.email} viewMode={viewMode}>
                <span>{member.email[0].toUpperCase()}</span>
                <Tooltip viewMode={viewMode}>
                  <div>Email: {member.email}</div>
                  <div>Role: {member.role}</div>
                </Tooltip>
              </TeamMember>
            ))}
          </Team>
        </>
      )}
    </Card>
  );
}

// Function to determine the color based on priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return '#d9534f'; // Red
    case 'Medium':
      return '#f0ad4e'; // Orange
    case 'Low':
      return '#5bc0de'; // Blue
    default:
      return '#999'; // Gray
  }
};

export default TaskCard;
