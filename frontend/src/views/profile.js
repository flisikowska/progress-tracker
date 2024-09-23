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

const StyledButton= styled.div`
    width:fit-content;
    color:#000;
    font-weight:500;
    font-size:1rem;
    cursor:pointer;
    border:2px solid #999;
    border-radius: 4px;
    padding:7px 10px;
    margin-left:auto;
`;

function Profile({members, userActivitiesFromTheDay, refreshMembersActivities, fetchUserActivities, logout}) {
  const [selectedDays, setSelectedDays] = useState([FormattedDate(new Date())]);

  useEffect(()=>{
    fetchUserActivities(selectedDays);
  },[selectedDays]);

  const handleActivityDelete = (id) => {
    axios.delete(`http://localhost:5000/activities/${id}`) 
      .then(res => {
        refreshMembersActivities();
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
        <UserActivities deleteActivity={handleActivityDelete} activities={userActivitiesFromTheDay}/>
        <StyledButton onClick={logout}>Wyloguj się</StyledButton>
      </StyledContainer>
  )
};

export default Profile;

