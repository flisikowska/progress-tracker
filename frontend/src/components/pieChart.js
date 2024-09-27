import React from 'react';
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
    }
`;

const PieChartContainer = styled.div`
    width:300px;
    height:300px;
    margin:20px;
    z-index:1;
    transition: transform 1s ease-in-out;
    transform: translateX(270px); 
    @media(max-width:1000px){
      transform: translateX(0); 
    }
    @media(max-width:750px){
      width:200px;
      height:200px;
      scale:70%;
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


function PieChart({ goal, users, usersActivities, setComponent }) {
    const calculateAmount = (d) => {
        return d.activities.reduce((total, activity) => total + activity.time, 0);
    };
    const timeLeft= goal - usersActivities.reduce((sum, d) => sum + calculateAmount(d), 0);

    usePieChart([...usersActivities.map(d => (
        {
        user_id: d.user_id,
        name: users.find(u=> u.user_id==d.user_id)?.user_name,
        amount: calculateAmount(d),
        color: '#'+users.find(u=> u.user_id==d.user_id)?.user_color,
        activities: d.activities
      })),
      {
        name: 'Pozostało',
        amount: timeLeft,
        color: '#777879',
        activities: []
    }], 
    setComponent
   );

    return (
        <StyledContainer>
            <PieChartContainer id="pieChartContainer">
                <StyledPieChart id="pieChart" />
                <StyledRemainingTime>
                    {timeLeft<=0? 
                    <p>Cel został osiągnięty!</p>
                    :
                    <p>Pozostało <br/> {MinutesToFormattedTime(timeLeft)}</p>}
                </StyledRemainingTime>
            </PieChartContainer>
        </StyledContainer>
    );
}

export default PieChart;