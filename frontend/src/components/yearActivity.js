import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import axios from 'axios';
import { ArrowLeftOutline } from '@styled-icons/evaicons-outline/ArrowLeftOutline';
import { Clock } from '@styled-icons/fa-solid/Clock';
import { CalendarCheck } from '@styled-icons/fa-solid/CalendarCheck';
import { Fire } from '@styled-icons/fa-solid/Fire';
import { FormattedDate, MinutesToFormattedTime, longestDayStreak } from '../helpers/functions';
import PeriodSummary from './periodSummary';

const host = process.env.REACT_APP_API_HOST;

const MONTHS_SHORT = [
  'Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze',
  'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru',
];
const WEEKDAY_LABELS = ['Pon', '', 'Śr', '', 'Pt', '', ''];

const COLORS = ['#e8eaed', '#cfeefd', '#96dbfa', '#40c4ff', '#0098cc'];
const bucket = (m) => {
  if (!m) return 0;
  if (m < 30) return 1;
  if (m < 60) return 2;
  if (m < 120) return 3;
  return 4;
};

const CELL = 12;
const GAP = 3;
const GUTTER = 30; // szerokosc kolumny z etykietami dni tygodnia

const StyledWrapper = styled.div`
  text-align: center;
  margin: 10px auto 0 auto;
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  >svg {
    color: var(--pale-blue);
    cursor: pointer;
    width: 34px;
    height: 34px;
    :hover { color: var(--blue); }
  }
  >svg:nth-of-type(2) { transform: rotate(180deg); }
  >p {
    color: var(--text);
    font-size: 1.1rem;
    min-width: 90px;
    pointer-events: none;
  }
`;

const Scroll = styled.div`
  overflow-x: auto;
  padding-bottom: 6px;
`;

const Board = styled.div`
  display: inline-block;
  text-align: left;
`;

const Months = styled.div`
  display: grid;
  grid-template-columns: repeat(${(p) => p.$weeks}, ${CELL}px);
  gap: ${GAP}px;
  margin-left: ${GUTTER}px;
  margin-bottom: 4px;
  >span {
    font-size: 0.6rem;
    color: var(--text-inactive);
    white-space: nowrap;
    line-height: 1;
    text-align: center; /* wysrodkowanie nad calym blokiem kolumn miesiaca */
  }
`;

const Body = styled.div`
  display: flex;
`;

const Weekdays = styled.div`
  display: grid;
  grid-template-rows: repeat(7, ${CELL}px);
  gap: ${GAP}px;
  width: ${GUTTER}px;
  >span {
    font-size: 0.6rem;
    color: var(--text-inactive);
    line-height: ${CELL}px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(7, ${CELL}px);
  grid-auto-columns: ${CELL}px;
  gap: ${GAP}px;
`;

const Cell = styled.div`
  width: ${CELL}px;
  height: ${CELL}px;
  border-radius: 3px;
  background: ${(p) => p.$color};
  cursor: default;
  ${(p) => p.$hidden && css`visibility: hidden;`}

`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 0.7rem;
  color: var(--text-inactive);
  margin: 8px ${GUTTER}px 0 0;
  >i {
    width: ${CELL}px;
    height: ${CELL}px;
    border-radius: 3px;
  }
`;

// poniedzialek w dniu lub przed dana data
const mondayOnOrBefore = (date) => {
  const dow = date.getDay() || 7; // 1..7 (Pon..Nd)
  const d = new Date(date);
  d.setDate(d.getDate() - (dow - 1));
  return d;
};

const YearActivity = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearActivities, setYearActivities] = useState([]);

  const fetchYear = useCallback(() => {
    axios.get(`${host}/activities?from=${year}-01-01&to=${year}-12-31`, { withCredentials: true })
      .then((res) => setYearActivities(res.data));
  }, [year]);

  useEffect(() => { fetchYear(); }, [fetchYear]);

  const minutesByDate = yearActivities.reduce((acc, a) => {
    const day = (a.activity_date || '').slice(0, 10);
    if (day) acc[day] = (acc[day] || 0) + a.time;
    return acc;
  }, {});

  // statystyki do kafelkow
  const yearTotal = yearActivities.reduce((t, a) => t + a.time, 0);
  const activeDaySet = new Set(
    yearActivities.map((a) => (a.activity_date || '').slice(0, 10)));
  const activeDays = activeDaySet.size;
  const longestStreak = longestDayStreak(activeDaySet);

  // siatka: od poniedzialku <= 1 stycznia do niedzieli >= 31 grudnia
  const start = mondayOnOrBefore(new Date(year, 0, 1));
  const end = new Date(year, 11, 31);
  const endSunday = new Date(end);
  endSunday.setDate(endSunday.getDate() + (7 - (end.getDay() || 7)));

  const days = [];
  for (let d = new Date(start); d <= endSunday; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  const weeks = days.length / 7;

  const monthSpans = [];
  for (let c = 0; c < weeks; c++) {
    let month = null;
    for (let r = 0; r < 7; r++) {
      const cd = days[c * 7 + r];
      if (cd.getFullYear() === year) { month = cd.getMonth(); break; }
    }
    if (month === null) continue;
    const last = monthSpans[monthSpans.length - 1];
    if (last && last.month === month) last.end = c;
    else monthSpans.push({ month, start: c, end: c });
  }

  return (
    <StyledWrapper>
      <StyledHeader>
        <ArrowLeftOutline onClick={() => setYear((y) => y - 1)} />
        <p>{year}</p>
        <ArrowLeftOutline onClick={() => setYear((y) => y + 1)} />
      </StyledHeader>

      <Scroll>
        <Board>
          <Months $weeks={weeks}>
            {monthSpans.map((s) => (
              <span key={s.month} style={{ gridColumn: `${s.start + 1} / ${s.end + 2}` }}>
                {MONTHS_SHORT[s.month]}
              </span>
            ))}
          </Months>
          <Body>
            <Weekdays>
              {WEEKDAY_LABELS.map((w, i) => <span key={i}>{w}</span>)}
            </Weekdays>
            <Grid>
              {days.map((d, i) => {
                const inYear = d.getFullYear() === year;
                const iso = FormattedDate(d);
                const minutes = minutesByDate[iso] || 0;
                return (
                  <Cell
                    key={i}
                    $color={COLORS[bucket(minutes)]}
                    $hidden={!inYear}
                    title={inYear ? `${iso}: ${minutes ? MinutesToFormattedTime(minutes) : 'brak'}` : undefined}
                  />
                );
              })}
            </Grid>
          </Body>
          <Legend>
            Mniej
            {COLORS.map((c, i) => <i key={i} style={{ background: c }} />)}
            Więcej
          </Legend>
        </Board>
      </Scroll>

      <PeriodSummary stats={[
        { icon: Clock, value: MinutesToFormattedTime(yearTotal), label: `Łącznie w ${year} roku` },
        { icon: CalendarCheck, value: `${activeDays}`, label: 'Aktywnych dni' },
        { icon: Fire, value: longestStreak ? `${longestStreak} ${longestStreak === 1 ? 'dzień' : 'dni'}` : '—', label: 'Najdłuższa passa' },
      ]} />
    </StyledWrapper>
  );
};

export default YearActivity;
