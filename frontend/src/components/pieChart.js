import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import usePieChart from '../helpers/usePieChart';
import { data_V1 } from '../helpers/data_v1';
import GroupMemberActivities from '../components/groupMemberActivities';
import { startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
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

const StyledRemainingTime = styled.p`
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

function PieChart({ selectedComponent, setSelectedComponent }) {
    const [chosenComponent, setChosenComponent]=useState(null);
    const goal=1200;
    const filterActivitiesThisWeek = (activities) => {
        const now = new Date();
        const start = startOfWeek(now, { weekStartsOn: 1 });
        const end = endOfWeek(now, { weekStartsOn: 1 });
        return activities.filter(activity => {
            const activityDate = parseISO(activity.date);
            return isWithinInterval(activityDate, { start, end });
        });
    };

    const calculateAmount = (d) => {
        return d.activities.reduce((total, activity) => total + activity.time, 0);
      };

    const filteredData = data_V1.map(d => ({...d, activities: filterActivitiesThisWeek(d.activities) }));
    const timeLeft= goal - filteredData.reduce((sum, d) => sum + calculateAmount(d), 0);
    usePieChart([...filteredData.map(d => ({
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
    , setSelectedComponent, selectedComponent, chosenComponent);
    useEffect(() => {
        if (selectedComponent) {
            const selectedData = filteredData.find(d => d.Type === selectedComponent);
            setChosenComponent(selectedData || null);

        } else {
            setChosenComponent(null);
        }
    }, [selectedComponent]);
    return (
        <StyledContainer>
            <PieChartContainer id="pieChartContainer">
                <StyledPieChart id="pieChart" />
                <StyledRemainingTime>
                    Pozostało<br />
                    {MinutesToFormattedTime(timeLeft)}
                </StyledRemainingTime>
            </PieChartContainer>
            <StyledInfoContainer>
                {chosenComponent && (
                    <StyledInfoWrapper className="info-container">
                        <StyledTitle $color={ chosenComponent.Color} id="segmentTitle">
                            {chosenComponent.Type}
                        </StyledTitle>
                        <StyledInfo id="segmentInfo">
                            <GroupMemberActivities summary={chosenComponent.activities.reduce((total, activity) => total + activity.time, 0)} activities={chosenComponent.activities} />
                        </StyledInfo>
                    </StyledInfoWrapper>
                )}
            </StyledInfoContainer>
        </StyledContainer>
    );
}

export default PieChart;