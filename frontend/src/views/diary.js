import React, { useEffect } from 'react';
import DayPicker from '../components/dayPicker';
import styled from 'styled-components';
import UserActivities from '../components/userActivities';
import axios from 'axios';

const host = process.env.REACT_APP_API_HOST;


const StyledContainer= styled.div`
  width:100%;
  height:100%;
  margin:0;
`

function Diary({activityTypes, userActivitiesForTheDay, refreshUsersActivities, fetchUserActivities, selectedDays, setSelectedDays}) {
  useEffect(()=>{
    fetchUserActivities(selectedDays);
  },[selectedDays, fetchUserActivities]);

  const handleActivityDelete = (id) => {
    axios.delete(`${host}/activities/${id}`, { withCredentials: true })
      .then(res => {
        refreshUsersActivities();
        fetchUserActivities(selectedDays);
    })
  };

  return (
    <StyledContainer>
        <DayPicker
          fetchSelectedDaysToParent={(d) => {
            setSelectedDays(d);
          }}
          multipleDaySelect={true}
          daysCount={7}
        />
        <UserActivities activityTypes={activityTypes} deleteActivity={handleActivityDelete} activities={userActivitiesForTheDay}/>
      </StyledContainer>
  )
};

export default Diary;

