import React, { useState } from 'react';
import styled from 'styled-components';
import PieChart from '../components/pieChart';
import StackedAreaChart from '../components/stackedAreaChart';
import GroupMemberActivities from '../components/groupMemberActivities';
import { MinutesToFormattedTime } from '../helpers/functions';

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

const StatsList = styled.div`
    flex:1;
    display:flex;
    flex-direction:column;
    gap:8px;
    padding:0 10px;
    max-height:100%;
    overflow-y:auto;
    @media(max-width:1000px){
      width:100%;
      margin-top:20px;
    }
`;

const StatRow = styled.div`
    display:flex;
    align-items:center;
    gap:10px;
    padding:10px 14px;
    border-radius:6px;
    cursor:pointer;
    background-color:${(props) => (props.$active ? 'rgba(86,186,119,0.25)' : 'rgba(255,255,255,0.06)')};
    border:1px solid ${(props) => (props.$active ? 'rgba(86,186,119,0.8)' : 'transparent')};
    transition:0.2s;
    &:hover{
      background-color:rgba(255,255,255,0.15);
    }
`;

const Dot = styled.span`
    width:14px;
    height:14px;
    border-radius:50%;
    flex-shrink:0;
`;

const Name = styled.span`
    font-weight:600;
    color:#fff;
`;

const Time = styled.span`
    margin-left:auto;
    font-weight:600;
    color:#eee;
`;

const Details = styled.div`
    flex:1;
    padding:16px;
    border-radius:6px;
    background-color:rgba(255,255,255,0.06);
    @media(max-width:1000px){
      width:100%;
      margin-top:20px;
    }
`;

const DetailsHeader = styled.div`
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:10px;
    font-size:1.3rem;
    font-weight:600;
    color:#fff;
`;

const CloseBtn = styled.span`
    cursor:pointer;
    font-size:1.6rem;
    line-height:1;
    color:#eee;
    &:hover{ color:#fff; }
`;

function Group({ statsData, activityTypes, users, goal, usersActivities }) {
    const areaChartWidth = 600;
    const areaChartHeight = 400;
    const [selected, setSelected] = useState(null);

    const calculateAmount = (d) => d.activities.reduce((total, a) => total + a.time, 0);

    const members = usersActivities.map((d) => ({
        user_id: d.user_id,
        name: users.find((u) => u.user_id == d.user_id)?.user_name,
        color: '#' + users.find((u) => u.user_id == d.user_id)?.user_color,
        amount: calculateAmount(d),
        activities: d.activities,
    }));

    return (
        <StyledContainer>
            <StyledPieChart>
                <PieChart
                    goal={goal}
                    users={users}
                    usersActivities={usersActivities}
                    setComponent={setSelected}
                    selected={selected}
                />
                {selected ? (
                    <Details>
                        <DetailsHeader>
                            {selected.name}
                            <CloseBtn onClick={() => setSelected(null)}>×</CloseBtn>
                        </DetailsHeader>
                        <GroupMemberActivities
                            activityTypes={activityTypes}
                            summary={selected.amount}
                            activities={selected.activities}
                        />
                    </Details>
                ) : (
                    <StatsList>
                        {members.map((m) => (
                            <StatRow
                                key={m.user_id}
                                $active={selected?.user_id === m.user_id}
                                onClick={() => setSelected(m)}
                            >
                                <Dot style={{ backgroundColor: m.color }} />
                                <Name>{m.name}</Name>
                                <Time>{MinutesToFormattedTime(m.amount)}</Time>
                            </StatRow>
                        ))}
                    </StatsList>
                )}
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
