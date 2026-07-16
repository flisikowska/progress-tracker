import React, { useEffect, useState } from 'react';
import DayPicker from '../components/dayPicker';
import MonthPicker from '../components/monthPicker';
import YearActivity from '../components/yearActivity';
import styled from 'styled-components';
import UserActivities from '../components/userActivities';
import PeriodSummary from '../components/periodSummary';
import { Clock } from '@styled-icons/fa-solid/Clock';
import { CalendarCheck } from '@styled-icons/fa-solid/CalendarCheck';
import { Fire } from '@styled-icons/fa-solid/Fire';
import { FormattedDate, MinutesToFormattedTime, longestDayStreak } from '../helpers/functions';
import axios from 'axios';

const host = process.env.REACT_APP_API_HOST;

// nazwy miesiecy w miejscowniku ("w lipcu", "w czerwcu"...)
const MONTHS_LOCATIVE = [
  'styczniu', 'lutym', 'marcu', 'kwietniu', 'maju', 'czerwcu',
  'lipcu', 'sierpniu', 'wrześniu', 'październiku', 'listopadzie', 'grudniu',
];


const StyledContainer= styled.div`
  width:100%;
  height:100%;
  margin:0;
`

function Diary({activePeriod, activityTypes, userActivitiesForTheDay, refreshUsersActivities, fetchUserActivities, selectedDays, setSelectedDays, onEditActivity}) {
  const [pickedDays, setPickedDays] = useState([]);

  useEffect(()=>{
    fetchUserActivities(selectedDays);
  },[selectedDays, fetchUserActivities]);

  const pickedActivities = userActivitiesForTheDay.filter(
    (a) => pickedDays.includes((a.activity_date || '').slice(0, 10)));

  const dayActivities = selectedDays.length === 1
    ? userActivitiesForTheDay.filter(
        (a) => selectedDays.includes((a.activity_date || '').slice(0, 10)))
    : [];

  const monthRef = selectedDays[0] || FormattedDate(new Date());
  const [refYear, refMonth] = monthRef.split('-').map(Number); // refMonth: 1-12
  const daysInMonth = new Date(refYear, refMonth, 0).getDate();
  const activeDaySet = new Set(
    userActivitiesForTheDay.map((a) => (a.activity_date || '').slice(0, 10)));
  const activeDays = activeDaySet.size;
  const monthTotalMinutes = userActivitiesForTheDay.reduce((t, a) => t + a.time, 0);
  const longestStreak = longestDayStreak(activeDaySet);
  const nonePicked = pickedDays.length === 0;

  const handleActivityDelete = (id) => {
    axios.delete(`${host}/activities/${id}`, { withCredentials: true })
      .then(res => {
        refreshUsersActivities();
        fetchUserActivities(selectedDays);
    })
  };

  return (
    <StyledContainer>
      {activePeriod==='dzien'?
      <>
        <DayPicker
          fetchSelectedDaysToParent={(d) => {
            setSelectedDays(d);
          }}
          multipleDaySelect={false}
          daysCount={7}
        />
        <UserActivities activityTypes={activityTypes} deleteActivity={handleActivityDelete} activities={dayActivities} onEditActivity={onEditActivity}/>
        </>
      : activePeriod==='miesiac'?
      <>
        <MonthPicker
          fetchSelectedDaysToParent={(d) => {
            setSelectedDays(d);
          }}
          onPickedDaysChange={setPickedDays}
          activities={userActivitiesForTheDay}
        />
        {nonePicked ? (
          <PeriodSummary
            stats={[
              { icon: Clock, value: MinutesToFormattedTime(monthTotalMinutes), label: `Łącznie w ${MONTHS_LOCATIVE[refMonth - 1]}` },
              { icon: CalendarCheck, value: `${activeDays}/${daysInMonth}`, label: 'Dni z aktywnością' },
              { icon: Fire, value: longestStreak ? `${longestStreak} ${longestStreak === 1 ? 'dzień' : 'dni'}` : '—', label: 'Najdłuższa passa' },
            ]}
            breakdownActivities={userActivitiesForTheDay}
            activityTypes={activityTypes}
          />
        ) : (
          <UserActivities
            activityTypes={activityTypes}
            deleteActivity={handleActivityDelete}
            activities={pickedActivities}
            showDate
          />
        )}
        </>
      : activePeriod==='rok'?
        <YearActivity/>
      :<></>
}
      </StyledContainer>
  )
};

export default Diary;

