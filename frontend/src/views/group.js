import React, { useRef } from 'react';
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
    font-size: 1.2rem;
    margin-top: 40px;
    text-align: left;
    pointer-events: none;

`;

function Group({statsData, activityTypes, users, goal, usersActivities}) {
    const areaChartWidth=600;
    const areaChartHeight=400;
    const pieChartActivitiesRef = useRef();
    return (
        <StyledContainer>
            <StyledPieChart>
                <PieChart
                    goal={goal}
                    users={users}
                    usersActivities={usersActivities}
                    setComponent={(x)=>pieChartActivitiesRef?.current?.setComponent(x)}
                />
                <PieChartActivities
                    activityTypes={activityTypes}
                    ref={pieChartActivitiesRef}
                />
            </StyledPieChart>
            <StyledStatsTitle>Statystyki:</StyledStatsTitle>
            <StackedAreaChart
                data={statsData}
                goal={goal}
                width={areaChartWidth}
                height={areaChartHeight}
                users={users}
            />
        </StyledContainer>
    );
}

export default Group;