import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import PieChart from '../components/pieChart';
import StackedAreaChart from '../components/stackedAreaChart';
import PieChartActivities from '../components/pieChartActivities';

const StyledPieChart = styled.div`
    width:100%;
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

const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
`;

const StyledStatsTitle = styled.h2`
    font-size: 1.4rem;
    margin-top: 40px;
    text-align: left;
`;

function Group({goal, membersActivities}) {
    const areaChartWidth=600;
    const areaChartHeight=400;
    const pieChartActivitiesRef = useRef();

    const processData = (data) => {
        const userMap = new Map();
        data.forEach(activity => {
            const { user_name, user_color, activity_amount, activity_type_name, activity_date, activity_type_icon } = activity;
            if (!userMap.has(user_name)) {
                userMap.set(user_name, {
                    Type: user_name,
                    Color: '#'+user_color,
                    activities: []
                });
            }

            userMap.get(user_name).activities.push({
                name: activity_type_name,
                icon: activity_type_icon,
                date: activity_date.split('T')[0],
                time: activity_amount
            });
        });

        return Array.from(userMap.values());
    };
    const activities=processData(membersActivities);
    return (
        <StyledContainer>
            <StyledPieChart>
                <PieChart
                    goal={goal}
                    activities={activities}
                    setComponent={pieChartActivitiesRef?.current?.setComponent}
                />
                <PieChartActivities
                    ref={pieChartActivitiesRef}
                    goal={goal}
                    activities={activities} 
                />
            </StyledPieChart>
            <StyledStatsTitle>Statystyki:</StyledStatsTitle>
            <StackedAreaChart
                goal={goal}
                width={areaChartWidth}
                height={areaChartHeight}
                activities={activities}
            />
        </StyledContainer>
    );
}

export default Group;