import React, { useMemo } from 'react';
import styled from 'styled-components';
import { MinutesToFormattedTime, timeLeftInPeriod } from '../helpers/functions';
import usePieChart from '../helpers/usePieChart';
import { HourglassHalf } from '@styled-icons/fa-solid/HourglassHalf';

const StyledContainer = styled.div`
    width:350px;
    height:400px;
    display:flex;
    position:relative;
    align-items:center;
    flex-flow:row nowrap;
    @media(max-width:1000px){
      flex-flow: column;
      height:unset;
      margin:40px auto;
    }
    @media(max-width:400px){
      width:100%;
    }
`;

const PieChartContainer = styled.div`
    width:300px;
    height:300px;
    margin:20px;
    z-index:1;
    @media(max-width:750px){
      width:260px;
      height:260px;
    }
    @media(max-width:400px){
      width:90vw;
      height:auto;
      aspect-ratio:1 / 1;
      margin:10px auto;
    }
`;

const StyledPieChart = styled.div`
    display: flex;
    width:100%;
    height:100%;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    svg { overflow: visible; }
    @media(max-width:1000px) {
        transform: rotate(90deg); 
        transform-origin: 50% 50%; 
        transition: 1s; 
    }
`;

const StyledRemainingTime = styled.div`
    pointer-events:none;
    position:absolute;
    color: var(--text);
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    z-index:3;
    text-align:center;
    font-size:1.2rem;
    font-weight:600;
    cursor:default;
    line-height:1rem;
    span{
        font-size:0.9rem;
        font-weight:500;
    }
`;

const PeriodCountdown = styled.div`
    margin-top:12px;
    display:inline-flex;
    align-items:center;
    gap:5px;
    padding:3px 11px;
    border-radius:14px;
    background:${p => p.$urgent ? 'var(--red)' : 'var(--primary)'};
    color:${p => p.$urgent ? 'var(--white)' : 'var(--text)'};
    font-size:0.72rem;
    font-weight:600;
    white-space:nowrap;
    > svg{ width:11px; height:11px; }
`;


const PERIOD_LABELS = {
    week: 'tygodniowego',
    month: 'miesięcznego',
    year: 'rocznego',
};

function PieChart({ goal, goalPeriod, users, usersActivities, setComponent, selected }) {
    const periodLabel = PERIOD_LABELS[goalPeriod] || PERIOD_LABELS.week;
    const calculateAmount = (d) => {
        return d.activities.reduce((total, activity) => total + activity.time, 0);
    };
    const timeLeft= goal - usersActivities.reduce((sum, d) => sum + calculateAmount(d), 0);
    const periodLeft = timeLeftInPeriod(goalPeriod);

    const data = useMemo(() => ([
      ...usersActivities.map(d => ({
        user_id: d.user_id,
        name: users.find(u => u.user_id === d.user_id)?.user_name,
        amount: calculateAmount(d),
        color: '#' + users.find(u => u.user_id === d.user_id)?.user_color,
        activities: d.activities,
      })),
      {
        name: 'Pozostało',
        amount: timeLeft,
        color: 'var(--primary)',
        activities: [],
      },
    ]), [usersActivities, users, timeLeft]);

    usePieChart(data, setComponent, selected);

    return (
        <StyledContainer>
            <PieChartContainer id="pieChartContainer">
                <StyledPieChart id="pieChart" />
                <StyledRemainingTime>
                    {timeLeft<=0?
                    <p>Cel osiągnięty!<br/><span>{MinutesToFormattedTime(goal)} razem</span></p>
                    :
                    <p>{MinutesToFormattedTime(goal - timeLeft)} <br/> <span>z {MinutesToFormattedTime(goal)} celu {periodLabel}</span></p>}
                    <PeriodCountdown $urgent={periodLeft.days <= 1}>
                        <HourglassHalf /> {periodLeft.text}
                    </PeriodCountdown>
                </StyledRemainingTime>
            </PieChartContainer>
        </StyledContainer>
    );
}

export default PieChart;