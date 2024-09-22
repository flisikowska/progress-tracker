import React, { useState } from 'react';
import styled from 'styled-components';
import PieChart from '../components/pieChart';
import StackedAreaChart from '../components/stackedAreaChart';

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
    const [selectedComponent, setSelectedComponent] = useState(null);
    const areaChartWidth=600;
    const areaChartHeight=400;

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
            <PieChart
                goal={goal}
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                activities={activities}
            />
            <StyledStatsTitle>Statystyki:</StyledStatsTitle>
            <StackedAreaChart
                goal={goal}
                selectedComponent={selectedComponent}
                setSelectedComponent={(e)=> setSelectedComponent(activities.find(d => d.Type === e))}
                width={areaChartWidth}
                height={areaChartHeight}
                activities={activities}
            />
        </StyledContainer>
    );
}

export default Group;