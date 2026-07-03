import React, { useMemo } from 'react';
import styled from 'styled-components';
import { MinutesToFormattedTime } from '../helpers/functions';
import usePieChart from '../helpers/usePieChart';

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
      margin-top:40px;

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
`;

const StyledPieChart = styled.div`
    display: flex;
    width:100%;
    height:100%;
    cursor:pointer;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    @media(max-width:1000px) {
        transform: rotate(90deg); 
        transform-origin: 50% 50%; 
        transition: 1s; 
    }
`;

const StyledRemainingTime = styled.div`
    pointer-events:none;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    z-index:3;
    text-align:center;
        font-size:1.2rem;
        font-weight:600;
        cursor:default;
`;


function PieChart({ goal, users, usersActivities, setComponent, selected }) {
    const calculateAmount = (d) => {
        return d.activities.reduce((total, activity) => total + activity.time, 0);
    };
    const timeLeft= goal - usersActivities.reduce((sum, d) => sum + calculateAmount(d), 0);

    const data = useMemo(() => ([
      ...usersActivities.map(d => ({
        user_id: d.user_id,
        name: users.find(u => u.user_id == d.user_id)?.user_name,
        amount: calculateAmount(d),
        color: '#' + users.find(u => u.user_id == d.user_id)?.user_color,
        activities: d.activities,
      })),
      {
        name: 'Pozostało',
        amount: timeLeft,
        color: '#777879',
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
                    <p>Cel został osiągnięty!</p>
                    :
                    <p>{MinutesToFormattedTime(goal - timeLeft)} <br/> z {MinutesToFormattedTime(goal)} celu</p>}
                </StyledRemainingTime>
            </PieChartContainer>
        </StyledContainer>
    );
}

export default PieChart;