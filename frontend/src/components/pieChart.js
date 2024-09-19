import React from 'react';
import styled from 'styled-components';
import usePieChart from '../helpers/usePieChart';
import GroupMemberActivities from '../components/groupMemberActivities';
import { MinutesToFormattedTime } from '../helpers/functions';

const StyledContainer = styled.div`
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

const StyledInfoContainer = styled.div`
    width:calc(100% - 350px);
    height:100%;
    @media(max-width:1000px){
      width:100%;
    }
`;

const StyledInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width:100%;
    margin:0 auto auto auto;
    align-items: center;
    text-align:center;
    padding:20px 0;
    @media(max-width:767px)  {
        width: 100%; 
        min-height: 0;
        padding:10px 0;
    } 
`;

const StyledTitle = styled.div`
    font-weight:600;
    font-size:1.4rem;
    cursor:default;
    color:${(props) => props.$color};
`;

const StyledInfo = styled.div`
    width: 100%;
    padding: 20px;
    @media(max-width:767px)  {
        padding:10px 0;
    } 
`;

function PieChart({ goal, selectedComponent, setSelectedComponent, activities }) {
    const calculateAmount = (d) => {
        return d.activities.reduce((total, activity) => total + activity.time, 0);
    };

    const timeLeft= goal - activities.reduce((sum, d) => sum + calculateAmount(d), 0);
    usePieChart([...activities.map(d => ({
        Type: d.Type,
        Amount: calculateAmount(d),
        Color: d.Color,
        activities: d.activities
      })),
      {
        Type: 'Pozostało',
        Amount: timeLeft,
        Color: '#dcdcdc',
        activities: []
    }]
    , setSelectedComponent, selectedComponent);

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
            <StyledInfoContainer>
                {selectedComponent && (
                    <StyledInfoWrapper className="info-container">
                        <StyledTitle $color={ selectedComponent.Color} id="segmentTitle">
                            {selectedComponent.Type}
                        </StyledTitle>
                        <StyledInfo id="segmentInfo">
                            <GroupMemberActivities summary={selectedComponent.activities && selectedComponent.activities.reduce((total, activity) => total + activity.time, 0)} activities={selectedComponent.activities} />
                        </StyledInfo>
                    </StyledInfoWrapper>
                )}
            </StyledInfoContainer>
        </StyledContainer>
    );
}

export default PieChart;