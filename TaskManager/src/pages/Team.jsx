// src/components/Team.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import TeamManagement from '../components/TeamManagement';

function Team() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teams, setTeams] = useState([]);
    const [expandedTeamId, setExpandedTeamId] = useState(null);
    const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Handlers to open and close the modal
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    // Fetch the list of teams where the user is a member
    useEffect(() => {
        const fetchTeams = async () => {
            setLoading(true);

            const currentUser = auth.currentUser;

            if (!currentUser) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }

            const teamsRef = ref(db, 'teams');
            onValue(teamsRef, (snapshot) => {
                const teamsData = snapshot.val();
                const userTeams = [];

                for (const teamId in teamsData) {
                    if (teamsData[teamId].members) {
                        const userEmail = currentUser.email.replace(/\./g, ',');
                        if (teamsData[teamId].members[userEmail]) {
                            userTeams.push({
                                id: teamId,
                                name: teamsData[teamId].teamName,
                                members: teamsData[teamId].members,
                            });
                        }
                    }
                }
                setTeams(userTeams);
                setLoading(false);
            }, (error) => {
                setError(error.message);
                setLoading(false);
            });
        };

        fetchTeams();
    }, []);

    // Toggle expand/collapse for a team
    const handleToggleExpand = (teamId) => {
        if (expandedTeamId === teamId) {
            setExpandedTeamId(null);
            setSelectedTeamMembers([]);
        } else {
            setExpandedTeamId(teamId);
            const team = teams.find((team) => team.id === teamId);
            if (team && team.members) {
                const membersArray = Object.entries(team.members);
                setSelectedTeamMembers(membersArray);
            }
        }
    };

    // Function to create a task using selected team members
    const handleCreateTask = () => {
        console.log('Task created with members:', selectedTeamMembers);
        // Add logic to create the task using the selected team members
    };

    if (loading) return <p>Loading teams...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={styles.container}>
            <button onClick={handleOpenModal} style={styles.newTeamButton}>New Team</button>
            <TeamManagement isModalOpen={isModalOpen} onCloseModal={handleCloseModal} />

            <h2 style={styles.header}>Your Teams</h2>
            <ul style={styles.teamList}>
                {teams.map(team => (
                    <li key={team.id} style={styles.teamItem}>
                        <div
                            onClick={() => handleToggleExpand(team.id)}
                            style={styles.teamTitle}
                        >
                            {team.name}
                        </div>
                        {expandedTeamId === team.id && (
                            <ul style={styles.memberList}>
                                {Object.entries(team.members).map(([email, member]) => (
                                    <li key={email} style={styles.memberItem}>
                                        <div><strong>Email:</strong> {email.replace(/,/g, '.')}</div>
                                        <div><strong>Role:</strong> {member.role}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

           
        </div>
    );
}

// Styles for the component
const styles = {
    container: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
        boxSizing: 'border-box',
    },
    header: {
        margin: '0 0 20px',
        fontSize: '24px',
    },
    newTeamButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        marginBottom: '20px',
    },
    teamList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    teamItem: {
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
    },
    teamTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    memberList: {
        marginTop: '10px',
        paddingLeft: '20px',
        listStyleType: 'none',
    },
    memberItem: {
        marginBottom: '5px',
        padding: '5px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#fff',
    },
    taskCreation: {
        marginTop: '20px',
    },
    createTaskButton: {
        padding: '10px 20px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Team;
