// src/sharedState.js
const sharedState = {
    selectedTeamMembers: [],
    setSelectedTeamMembers(newMembers) {
      this.selectedTeamMembers = newMembers;
    },
  };
  
  export default sharedState;
  