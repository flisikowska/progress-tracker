import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DayPicker from '../components/dayPicker';
import { FormattedDate } from '../helpers/functions';
import styled from 'styled-components';
import UserActivities from '../components/userActivities';
import axios from 'axios';

const StyledContainer= styled.div`
  width:100%;
  height:100%;
  margin:0;
`

function Diary({activityTypes, userActivitiesForTheDay, refreshUsersActivities, fetchUserActivities, selectedDays, setSelectedDays}) {
  const host='localhost';

  useEffect(()=>{
    fetchUserActivities(selectedDays);
  },[selectedDays]);

  const handleActivityDelete = (id) => {
    axios.delete(`http://${host}:5000/activities/${id}`, { withCredentials: true })
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

