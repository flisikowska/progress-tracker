import React, {useState} from 'react';
import styled from 'styled-components';
import usePieChart from '../helpers/usePieChart';
import GroupMemberActivities from '../components/groupMemberActivities';
import {PersonRunning} from '@styled-icons/fa-solid/PersonRunning';
import {SportBasketball} from '@styled-icons/fluentui-system-regular/SportBasketball';
import {Tennisball} from '@styled-icons/ionicons-solid/Tennisball';
import {Volleyball} from '@styled-icons/fa-solid/Volleyball';

const StyledContainer= styled.div`
    width:100%;
    height:400px;
    display:flex;
    align-items:center;
    flex-flow:row nowrap;
    @media(max-width:760px){
        flex-flow: column;
    }
`;

const PieChartContainer= styled.div`
    width:300px;
    height:300px;
    margin:auto;
    z-index:1;
    transition: transform 1s ease-in-out;
    transform: translateX(12vw); 
`;

const StyledPieChart= styled.div`
    display: flex;
    width:100%;
    cursor:pointer;
    height:100%;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    @media(min-width:768px) {
        transition: 1s;
    }
    @media(max-width:767px) {
        transform: rotate(90deg); 
        transform-origin: 50% 50%; 
        transition: 1s; 
        max-width: 50%; 
    }
`;

const StyledRemainingTime= styled.p`
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

const StyledInfoContainer=styled.div`
    width:50%;
    height:100%;
`;

const StyledInfoWrapper=styled.div`
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
    } 
`;



const StyledTitle=styled.div`
    font-weight:600;
    font-size:1.2rem;
    cursor:default;
`;

const StyledInfo=styled.div`
    width: 100%;
    padding: 20px;
`;

const kasiaActivities=[{
    name: 'Siatkówka plażowa',
    time: '1.35h',
    icon: <Tennisball size="30"/>,
  },{
    name: 'Skakanka na jednej nodze',
    time: '2h',
    icon: <Volleyball size="30"/>,
  },{
    name: 'Siatkówka',
    time: '0.35h',
    icon: <SportBasketball size="30"/>,
  }];
  
const angelikaActivities=[{
    name: 'Siatkówka plażowa',
    time: '1.35h',
    icon: <Tennisball size="30"/>,
  },{
    name: 'Skakanka na jednej nodze',
    time: '2h',
    icon: <Volleyball size="30"/>,
  },{
    name: 'Siatkówka',
    time: '0.35h',
    icon: <SportBasketball size="30"/>,
  },{
    name: 'Siatkówka plażowa',
    time: '1.35h',
    icon: <Tennisball size="30"/>,
  },{
    name: 'Skakanka na jednej nodze',
    time: '2h',
    icon: <Volleyball size="30"/>,
  },{
    name: 'Siatkówka',
    time: '0.35h',
    icon: <PersonRunning size="30"/>,
  }];

const karolinaActivities=[];

const emiliaActivities=[{
    name: 'Siatkówka plażowa',
    time: '1.35h',
    icon: <Tennisball size="30"/>,
  }];


const data_V1 = [{
    "Type": "Karolina",
    "Amount": 0,
    "Component": () => <GroupMemberActivities activities={karolinaActivities}/>
  }, {
    "Type": "Angelika",
    "Amount": 1000,
    "Component": () => <GroupMemberActivities activities={angelikaActivities}/>
  }, {
    "Type": "Kasia",
    "Amount": 600,
    "Component": () => <GroupMemberActivities activities={kasiaActivities}/>
  }, {
    "Type": "Emilia",
    "Amount": 1750,
    "Component": () => <GroupMemberActivities activities={emiliaActivities}/>
  }, {
    "Type": "Pozostało",
    "Amount": 3300,
    "Component": () => <></>
  }];

function PieChart(){
    const [selectedComponent, setSelectedComponent] = useState(null);
    usePieChart(data_V1, setSelectedComponent);
    return(
    <StyledContainer>
        <PieChartContainer id="pieChartContainer">
            <StyledPieChart id="pieChart"/>
            <StyledRemainingTime>Pozostało<br/>10h 35min</StyledRemainingTime>
        </PieChartContainer>
        <StyledInfoContainer>
            {selectedComponent && (
                <StyledInfoWrapper className="info-container">
                    <StyledTitle id="segmentTitle">{ selectedComponent.data.Type + ": " + selectedComponent.data.Amount}</StyledTitle>
                    <StyledInfo id="segmentInfo">
                        {selectedComponent.data.Component()}
                    </StyledInfo>     
                </StyledInfoWrapper>   
            )}
        </StyledInfoContainer>
    </StyledContainer>
    );
};

export default PieChart;
