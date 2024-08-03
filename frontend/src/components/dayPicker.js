import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {ArrowLeftOutline} from '@styled-icons/evaicons-outline/ArrowLeftOutline';
import { addDays, FormattedDate } from '../helpers/functions.js';

const StyledDaySquare = styled.div`
  margin: 0 6px;
  cursor: pointer;
  width: 60px;
  height: 65px;                                   
  color: #000;
  font-size: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 3px;
  @media (max-width: 450px) {
    font-size: 0.75rem;
  }
    
  ${(props) =>
    props.selected &&
    css`
      background: rgba(121, 193, 145, 0.7);
      border:2px solid rgb(121, 193, 145);
      p{
        color:#fff;
      }
  `};
`;

const StyledDay = styled.p`
  font-size: 1.2rem;
  margin: 3px auto 0 auto;
  @media (max-width: 450px) {
    font-size: 1rem;
  }
`;

const StyledDate = styled.p`
  font-size: 0.8rem;
  margin-top:7px;
  color: black;
  @media (max-width: 450px) {
    font-size: 0.75rem;
  }
`;

const DayPickerItem = ({
  selected,
  onClick,
  day
}) => {

  return (
      <StyledDaySquare className="dayPickerItem" onClick={onClick} selected={selected}>
        <StyledDay>{day.split('-')[2]}</StyledDay>
        <StyledDate>{day.split('-')[1]}/{day.split('-')[0].slice(2)}</StyledDate>
      </StyledDaySquare>
  );
};


//////////////////////

const StyledDayPickerWrapper = styled.div`
    >svg{
      color: #79c191;
      cursor: pointer;
      width: 40px;
      height: 40px;
      :hover {
        color:#55a670;
      }
    }
    text-align: center;
    margin: 30px 0;
    white-space: nowrap;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    >svg:nth-of-type(2){
        transform:rotate(180deg);
    }
    `;

const StyledDaysWrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  & > {
    *:nth-child(1),
    *:nth-last-child(1) {
      @media (max-width: 900px) {
        display: none;
      }
    }

    *:nth-child(2),
    *:nth-last-child(2) {
      @media (max-width: 600px) and (min-width: 450px) {
        display: none;
      }
      @media (max-width: 450px) {
        display: none;
      }
    }

    *:nth-child(3),
    *:nth-last-child(3) {
      @media (max-width: 250px) {
        display: none;
      }
    }
  }
`;

const DayPicker = ({
  fetchSelectedDaysToParent,
  multipleDaySelect,
  daysCount,
  valueForTheDay,
  visibleDaysChanged,
}) => {
  const initialStartDay = FormattedDate(addDays(new Date(), -3));
  const [startDay, setStartDay] = useState(initialStartDay);
  const [weekdays, setWeekdays] = useState([initialStartDay]);
  const [selectedDays, setSelectedDays] = useState([FormattedDate(addDays(initialStartDay, 3))]);

  useEffect(() => {
    let days = [startDay];
    for (let index = 1; index < daysCount; index++) {
      const day = FormattedDate(addDays(startDay, index));
      days = [...days, day];
    }
    setWeekdays(days);
    if (visibleDaysChanged) {
      visibleDaysChanged(days);
    }
    // eslint-disable-next-line
  }, [startDay, daysCount]);

  useEffect(() => {
    fetchSelectedDaysToParent(selectedDays);
    // eslint-disable-next-line
  }, [selectedDays]);

  useEffect(() => {
    let days = [startDay];
    for (let index = 1; index < daysCount; index++) {
      const day = FormattedDate(addDays(startDay, index));
      days = [...days, day];
    }
    setWeekdays(days);
    // eslint-disable-next-line
  }, [startDay]);
  return (
    <StyledDayPickerWrapper>
        <ArrowLeftOutline onClick={() => setStartDay(FormattedDate(addDays(startDay, -1)))}/>
        <StyledDaysWrapper>
        {weekdays.map((day, i) => (
          <DayPickerItem
            value={valueForTheDay ? valueForTheDay(day) : undefined}
            day={day}
            key={i}
            selectedDays={selectedDays}
            onClick={() => {
              if (!multipleDaySelect) setSelectedDays([day]);
              else {
                if (selectedDays.some((s) => s === day))
                  setSelectedDays(selectedDays.filter((s) => s !== day));
                else setSelectedDays([...selectedDays, day]);
              }
            }}
            selected={selectedDays.some((s) => s === day)}
          />
        ))}
        </StyledDaysWrapper>
        <ArrowLeftOutline onClick={() => setStartDay(FormattedDate(addDays(startDay, 1)))} />
        </StyledDayPickerWrapper>
  );
};

export default DayPicker;
