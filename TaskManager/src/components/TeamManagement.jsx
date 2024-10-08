import React, { useState } from 'react';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

function TeamManagement({ isModalOpen, onCloseModal }) {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Developer');
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Handle adding a new member
  const handleAddMember = () => {
    if (!newMemberEmail || !newMemberName) {
      alert('Both name and email of the member are required');
      return;
    }

    const newMember = {
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
    };

    setMembers([...members, newMember]);
    setNewMemberEmail('');
    setNewMemberName('');
    setNewMemberRole('Developer');
  };

  // Handle team creation
  const handleCreateTeam = async () => {
    if (!teamName) {
      alert('Team name is required');
      return;
    }
    if (!currentUser) {
      alert('User must be logged in to create a team');
      return;
    }
    if (isCreatingTeam) {
      console.log('Team creation is already in progress...');
      return;
    }

    setIsCreatingTeam(true);

    try {
      console.log('Creating team...');
      const teamId = `team_${Date.now()}`;
      const teamRef = ref(db, `teams/${teamId}`);

      const teamData = {
        teamName,
        createdBy: currentUser.email,
        members: {},
      };

      members.forEach(member => {
        const encodedEmail = member.email.replace(/\./g, ',');
        teamData.members[encodedEmail] = {
          name: member.name,
          role: member.role,
        };
      });

      const adminEmail = currentUser.email.replace(/\./g, ',');
      teamData.members[adminEmail] = {
        name: currentUser.displayName || 'Anonymous',
        role: 'Admin',
      };

      console.log('Team data to be saved:', teamData);

      // Save team data to Firebase
      await set(teamRef, teamData);

      console.log('Team created successfully');
      alert('Team created successfully!');
      onCloseModal(); // Close the modal after team creation
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Failed to create team. Please try again.');
    } finally {
      setIsCreatingTeam(false);
    }
  };

  // Render nothing if the modal is not open
  if (!isModalOpen) return null;

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <span style={styles.closeButton} onClick={onCloseModal}>&times;</span>
        <h2>Create a New Team</h2>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          style={styles.input}
        />
        <h3>Add Members</h3>
        <input
          type="text"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="Enter member name"
          style={styles.input}
        />
        <input
          type="email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="Enter member email"
          style={styles.input}
        />
        <select
          value={newMemberRole}
          onChange={(e) => setNewMemberRole(e.target.value)}
          style={styles.select}
        >
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Tester">Tester</option>
          <option value="Admin">Admin</option>
        </select>
        <button onClick={handleAddMember} style={styles.button}>Add Member</button>

        <ul style={styles.list}>
          {members.map((member, index) => (
            <li key={index} style={styles.listItem}>
              {member.name} ({member.email}) - {member.role}
            </li>
          ))}
        </ul>
        <button onClick={handleCreateTeam} style={styles.button} disabled={isCreatingTeam}>Create Team</button>
      </div>
    </div>
  );
}

// Styles for the modal
const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '500px',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    cursor: 'pointer',
  },
  input: {
    width: 'calc(100% - 100px)',
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
  },
  select: {
    marginLeft: '10px',
    padding: '5px',
    fontSize: '16px',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
    fontSize: '18px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
};

export default TeamManagement;
