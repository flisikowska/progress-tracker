import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { ArrowLeftOutline } from '@styled-icons/evaicons-outline/ArrowLeftOutline';
import { FormattedDate } from '../helpers/functions.js';

const MONTHS = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];
const WEEKDAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

const StyledWrapper = styled.div`
  margin: 20px 60px;
  text-align: center;
  @media (max-width: 650px) {
    margin: 20px 16px;
  }
  @media (max-width: 450px) {
    margin: 16px 8px;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  margin-bottom: 12px;

  >svg {
    color: var(--pale-blue);
    cursor: pointer;
    width: 34px;
    height: 34px;
    :hover {
      color: var(--blue);
    }
    @media (max-width: 450px) {
      width: 26px;
      height: 26px;
    }
  }
  >svg:nth-of-type(2) {
    transform: rotate(180deg);
  }
  >p {
    color: var(--text);
    font-size: 1.1rem;
    min-width: 170px;
    pointer-events: none;
    @media (max-width: 450px) {
      font-size: 0.95rem;
      min-width: 130px;
    }
  }
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  @media (max-width: 450px) {
    gap: 3px;
  }
`;

const StyledWeekday = styled.p`
  font-size: 0.75rem;
  color: #aaa;
  pointer-events: none;
  margin: 0 0 4px 0;
`;

const StyledDay = styled.div`
  height: clamp(38px, 7vw, 64px);
  box-sizing: border-box;
  border: 2px solid transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  cursor: pointer;
  color: var(--text);
  font-size: clamp(0.8rem, 2.2vw, 0.95rem);
  user-select: none;
  @media (max-width: 768px) {
    padding-bottom: 8px;
  }
  >span {
    position: absolute;
    bottom: 7px;
    left: 0;
    right: 0;
    font-size: clamp(0.5rem, 1.6vw, 0.65rem);
    line-height: 1;
    color: var(--dark-blue);
    @media (max-width: 450px) {
      bottom: 5px;
    }
  }
  ${(props) =>
    props.active &&
    css`
      color: var(--dark-blue);
    `};
  ${(props) =>
    props.picked &&
    css`
      background: var(--pale-blue);
      border: 2px solid var(--blue);
      color: #fff;
      >span {
        color: #fff;
      }
    `};
  ${(props) =>
    props.today &&
    css`
      box-shadow: inset 0 0 0 2px var(--pale-blue);
    `};
`;

// "in" z "min" - chowane na mniejszych ekranach, zostaje samo "m" 
const MinUnit = styled.span`
  @media (max-width: 550px) {
    display: none;
  }
`;

const renderTime = (total) => {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (m === 0) return `${h}h`;
  const mins = <>{m}m<MinUnit>in</MinUnit></>;
  return h === 0 ? mins : <>{`${h}h `}{mins}</>;
};

const MonthPicker = ({ fetchSelectedDaysToParent, onPickedDaysChange = () => {}, activities = [] }) => {
  const today = new Date();
  const todayIso = FormattedDate(today);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-based
  const [pickedDays, setPickedDays] = useState([]); // dni klikniete przez usera

  const minutesByDate = activities.reduce((acc, a) => {
    const day = (a.activity_date || '').slice(0, 10);
    if (day) acc[day] = (acc[day] || 0) + a.time;
    return acc;
  }, {});

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const leadingBlanks = (new Date(viewYear, viewMonth, 1).getDay() || 7) - 1;
  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  useEffect(() => {
    const all = Array.from({ length: daysInMonth }, (_, i) =>
      FormattedDate(new Date(viewYear, viewMonth, i + 1)));
    fetchSelectedDaysToParent(all);
    setPickedDays([]); 
    // eslint-disable-next-line
  }, [viewYear, viewMonth]);

  useEffect(() => {
    onPickedDaysChange(pickedDays);
    // eslint-disable-next-lines
  }, [pickedDays]);

  const togglePicked = (iso) => {
    setPickedDays((prev) =>
      prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso]);
  };

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const goToNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  return (
    <StyledWrapper>
      <StyledHeader>
        <ArrowLeftOutline onClick={goToPrevMonth} />
        <p>{MONTHS[viewMonth]} {viewYear}</p>
        <ArrowLeftOutline onClick={goToNextMonth} />
      </StyledHeader>
      <StyledGrid>
        {WEEKDAYS.map((wd) => <StyledWeekday key={wd}>{wd}</StyledWeekday>)}
        {cells.map((dayNum, i) => {
          if (dayNum === null) return <div key={`blank-${i}`} />;
          const iso = FormattedDate(new Date(viewYear, viewMonth, dayNum));
          const minutes = minutesByDate[iso];
          return (
            <StyledDay
              key={dayNum}
              onClick={() => togglePicked(iso)}
              active={minutes > 0}
              picked={pickedDays.includes(iso)}
              today={iso === todayIso}
            >
              {dayNum}
              {minutes > 0 && <span>{renderTime(minutes)}</span>}
            </StyledDay>
          );
        })}
      </StyledGrid>
    </StyledWrapper>
  );
};

export default MonthPicker;
