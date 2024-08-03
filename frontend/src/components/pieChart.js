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
    @media(max-width:1000px){
      flex-flow: column;
      height:unset;
    }
`;

const PieChartContainer= styled.div`
    width:300px;
    height:300px;
    margin:20px;
    z-index:1;
    transition: transform 1s ease-in-out;
    transform: translateX(270px); 
    @media(max-width:1000px){
      transform: translateX(0); 
    }
`;

const StyledPieChart= styled.div`
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
    width:calc(100% - 350px);
    height:100%;
    @media(max-width:1000px){
      width:100%;
    }
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
    "Amount": 9450,
    "Component": () => <GroupMemberActivities activities={karolinaActivities}/>
  }, {
    "Type": "Angelika",
    "Amount": 4600,
    "Component": () => <GroupMemberActivities activities={angelikaActivities}/>
  }, {
    "Type": "Kasia",
    "Amount": 2600,
    "Component": () => <GroupMemberActivities activities={kasiaActivities}/>
  }, {
    "Type": "Emilia",
    "Amount": 6750,
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
