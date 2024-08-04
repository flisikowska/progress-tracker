import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DayPicker from '../components/dayPicker';
import { FormattedDate } from '../helpers/functions';
import styled from 'styled-components';
import UserActivities from '../components/userActivities';

const StyledContainer= styled.div`
  width:100%;
  height:100%;
  margin:0;
`

const StyledActivityTitle=styled.h2`
  font-size:1.2rem;
  margin:30px 0;
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

function Home({logout}) {
  const [selectedDay, setSelectedDay] = useState(FormattedDate(new Date()));
  const [dayPickerVisibleDays, setDayPickerVisibleDays] = useState([]);
  // const dispatch = useDispatch();
  // const { meals } = useSelector((state) => ({
    //   meals: state.meals
    // }));
  return (
    <StyledContainer>
        <DayPicker
          fetchSelectedDaysToParent={(selectedDays) => {
            if (selectedDays.length === 1) setSelectedDay(selectedDays[0]);
          }}
          multipleDaySelect={false}
          daysCount={7}
          valueForTheDay={(date) =>
            // meals
            //   .filter((m) => m.meal.dateTime.split('T')[0] === date)
            //   .map((m) => m.macronutrientsToEat.calories)
            //   .reduce((x, y) => x + y, 0)
            //   .toFixed(1)
            0
          }
          visibleDaysChanged={(days) => setDayPickerVisibleDays(days)}
        />
        <StyledActivityTitle>Twoja aktywność:</StyledActivityTitle>
        <UserActivities/>
          <StyledButton onClick={logout}>Wyloguj sie</StyledButton>
      </StyledContainer>
  )
};

export default Home;

