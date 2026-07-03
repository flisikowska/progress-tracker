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

const StyledStatsHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    gap: 16px;
`;

const StyledStatsTitle = styled.h2`
    font-size: 1.2rem;
    text-align: left;
    pointer-events: none;
    flex-shrink: 0;
    color:var(--text);
`;

const UserLegend = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    overflow-x: auto;
    margin-right:20px;
    padding: 8px 0;
    cursor:default;
    &::-webkit-scrollbar { height: 3px; }
    &::-webkit-scrollbar:hover { height: 3px; }
    &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
`;

const LegendItem = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    flex-shrink: 0;
`;

const LegendDot = styled.span`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
`;

const LegendName = styled.span`
    font-size: 0.85rem;
    color: var(--text-inactive);
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
    background-color: var(--color-background);
    border:1px solid transparent;
    transition:0.2s;
    &:hover{
      background-color: var(--primary);
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
    color: var(--text);
`;

const Time = styled.span`
    margin-left:auto;
    font-weight:600;
    font-size: 0.8rem;
    color: var(--text);
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
    font-size:1.2rem;
    font-weight:600;
    color:var(--text);
`;

const CloseBtn = styled.span`
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:5px;
    height:30px;
    padding:0 12px;
    flex-shrink:0;
    font-size:0.85rem;
    font-weight:600;
    line-height:1;
    border-radius:20px;
    color:var(--white);
    background:var(--text-inactive);
    transition:0.2s;
    > span{
        font-size:1.1rem;
    }
    &:hover{
    background:var(--text);
    }
`;

function Group({ statsData, activityTypes, users, goal, usersActivities }) {
    const areaChartWidth = 860;
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
                            <CloseBtn onClick={() => setSelected(null)}>Zamknij <span>×</span></CloseBtn>
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

            <StyledStatsHeader>
                <StyledStatsTitle>Statystyki grupy</StyledStatsTitle>
                <UserLegend>
                    {users.map(u => (
                        <LegendItem key={u.user_id}>
                            <LegendDot style={{ backgroundColor: '#' + u.user_color }} />
                            <LegendName>{u.user_name}</LegendName>
                        </LegendItem>
                    ))}
                </UserLegend>
            </StyledStatsHeader>
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
