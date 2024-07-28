import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { ArrowLeftS } from '@styled-icons/remix-line/ArrowLeftS';
import { ArrowRightS } from '@styled-icons/remix-line/ArrowRightS';
import { addDays, FormattedDate } from '../helpers/functions.js';

const StyledDayPickerItemWrapper = styled.div`
  margin: 0 6px;
  cursor: pointer;
`;

const StyledDaySquare = styled.div`
  width: 60px;
  height: 75px;
  transition: 0.3s;
  color: black;
  font-size: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 15px;
  @media (max-width: 450px) {
    font-size: 0.75rem;
  }
  ${(props) =>
    props.selected &&
    css`
      background: rgba(86, 186, 119, 0.8);
      p{
        color:white;
      }
    `};

`;

const StyledDay = styled.p`
  font-size: 1.3rem;
  font-family: "DM Sans", sans-serif;
  margin: 10px auto 0 auto;
  transition: 0.3s;
  @media (max-width: 450px) {
    font-size: 1rem;
  }
`;

const StyledDate = styled.p`
  font-size: 0.8rem;
  margin-top:5px;
  font-family: "DM Sans", sans-serif;
  color: black;
  transition: 0.3s;
  @media (max-width: 450px) {
    font-size: 0.75rem;
  }
`;
const DayPickerItem = ({
  selected,
  onClick,
  day,
  value,
  caloriesGoal,
}) => {
  const valueForCalories = value ? value : 0;

  return (
    <StyledDayPickerItemWrapper
      title={caloriesGoal > 0 ? (value ? ((value / caloriesGoal) * 100).toFixed(0) + '%' : '') : ''}
      className="dayPickerItem"
      onClick={onClick}
    >
      <StyledDaySquare
        calories={valueForCalories}
        $caloricSurplus={valueForCalories > caloriesGoal}
        selected={selected}
      >
        <StyledDay>{day.split('-')[2]}</StyledDay>
        <StyledDate>
          {day.split('-')[1]}/{day.split('-')[0].slice(2)}
        </StyledDate>
      </StyledDaySquare>
    </StyledDayPickerItemWrapper>
  );
};


//////////////////////

const StyledDayPickerWrapper = styled.div`
    .icon{
      color: #79c191;
      cursor: pointer;
      width: 40px;
      height: 40px;
      :hover {
        transition: 0.2s;
        color:#55a670;
        }
        @media (max-width: 450px) {
            display:none;
        }
    }
    text-align: center;
    margin: 30px 0;
    white-space: nowrap;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
   
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
      @media (max-width: 370px) {
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
        <ArrowLeftS className="icon" onClick={() => setStartDay(FormattedDate(addDays(startDay, -1)))}/>
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
        <ArrowRightS  className="icon" onClick={() => setStartDay(FormattedDate(addDays(startDay, 1)))} />
        </StyledDayPickerWrapper>
  );
};

DayPicker.propTypes = {
  fetchSelectedDaysToParent: PropTypes.func,
  multipleDaySelect: PropTypes.bool,
  daysCount: PropTypes.number,
  valueForTheDay: PropTypes.func,
  visibleDaysChanged: PropTypes.func
};

DayPickerItem.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  day: PropTypes.string,
  value: PropTypes.string,
};

export default DayPicker;
