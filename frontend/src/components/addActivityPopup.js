import React, {useRef, useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import TimePicker from './timePicker';
import { FormattedDate } from '../helpers/functions';
import DayPicker from '../components/dayPicker';
import {CloseOutline} from '@styled-icons/evaicons-outline/CloseOutline';
import axios from 'axios';

const StyledButton= styled.div`
    z-index:10;
    padding:7px 10px;
    font-size:0.9rem;
    font-weight:500;
    cursor:pointer;
    border:3px solid #999;
    border-radius:4px;
     &:hover{
      color:#555; 
    }
    @media(max-width:570px){
        display:none;
    }   
`;

const StyledWrapper=styled.div`
    display: ${(props) => (props.$active ? 'flex' : 'none')};
    position:fixed;
    flex-flow:column nowrap;
    padding:25px;
    text-align:center;
    align-items:center;
    left:50%;
    top:50%;
    transform:translate(-50%, -50%);
    transition:0.4s;
    width:910px;
    height:90%;
    background-color:rgba(255,255,255);
    border-radius:4px;
    z-index: 10;
    @media(max-width:1000px){
        width:90%;
    }
    @media(max-width:570px){
        width:100%;
        height:100%;
        display: block;
        transform: translate(0, ${(props) => (props.$active ? '0' : '120%')});
        top:0;
        left:0;
        border-radius:0px;  
    }
    >svg{
        position:absolute;
        top:0;
        right:0;
        width:30px;
        height:30px;
        color:#000;
        margin:20px;
        cursor:pointer;
    }
    #timePicker{
        height:125px;
        margin:30px 0;
    }
    `;

const ActivitiesWrapper= styled.div`
    height: 300px;
    width:550px;
    @media(max-width:1000px){
        width:80%;
    }
    overflow-y: scroll;
    display: grid;
    margin:20px auto;
    grid-template-columns: repeat(3, 1fr);
    gap: 0px;
    align-items:center;
    @media(max-width:700px){
        grid-template-columns: repeat(2, 1fr);
    }
    @media(max-width:520px){
        grid-template-columns: repeat(1, 1fr);
        height: 200px;
        >div{
            width:90%;
            margin:10px auto;
        }
    }
`;

const StyledActivity= styled.div`
    padding:15px;
    margin:10px;
    width:150px;
    cursor:pointer;
    text-align:center;
    height:100px;
    border-radius:12px;
    border: 2px solid #ccc;
    ${(props) =>
    props.$chosen &&
    css`
        border: 2px solid  rgba(121, 193, 145, 0.7);
        box-shadow: 0 0 4px  rgba(121, 193, 145, 0.7);
    `};
    >p{
        font-weight:600;
        font-size:0.9rem;
        margin-top:10px;
        @media(max-width:450px){
            font-size:0.7rem;
        }
    }
`;

const StyledHeader= styled.div`
    font-size:1.1rem;
    color:#000;
    margin: 5px auto;
    font-weight:500;
`;

const ChooseButton= styled.div`
    padding:10px 0;
    cursor:pointer;
    text-align:center;
    border-radius:4px;
    border:2px solid #ccc;
    font-weight:600;
    font-size:0.9rem;
    transition:0.2s;
    width:100px;
    margin:auto;
    &:hover{
        background-color:rgba(86, 186, 119,0.8);
        border:2px solid rgba(86, 186, 119,0.8);
    }
`;


const AddActivityPopup=({activityTypes, setActiveAddPopup, active, refreshStatsActivities, refreshUsersActivities, refreshUserActivities})=>{
    const [chosenItem, setChosenItem] = useState(null);
    const activePopupRef = useRef(active);
    const [selectedDay, setSelectedDay] = useState(FormattedDate(new Date()));
    const [amount, setAmount]= useState(0);

    useEffect(() => {
        window.addEventListener('mouseup', (event) => {
            if (window.innerWidth >= 450) {
              if (!activePopupRef.current) return;
              var popup = document.getElementById('addPopup');
              if (event.target !== popup) {
                let parent = event.target.parentNode;
                while (parent !== null) {
                  if (parent === popup) return;
                  else parent = parent.parentNode;
                }
                setTimeout(() => setActiveAddPopup(false), 1);
              }
            }
          });
        return () => {
            activePopupRef.current = false;
        };
        // eslint-disable-next-line
      }, []);

    useEffect(() => {
        activePopupRef.current = active;
    }, [active]);


    const addActivity=(activity_type_id, date, amount)=>{
        const host='192.168.1.126';
        axios.post(`http://${host}:5000/activities`, {activity_type_id: activity_type_id, date: date, amount: amount})
        .then(res => {
           refreshUsersActivities();
           refreshUserActivities(selectedDay);
           setActiveAddPopup(false);
           refreshStatsActivities();
        });
      }

    return (
        <>
            <StyledButton onClick={()=> setActiveAddPopup(!active) }>Dodaj aktywność</StyledButton>
            <StyledWrapper id='addPopup' $active={active}>
                <CloseOutline onClick={()=>setActiveAddPopup(false)}/>
                <StyledHeader>Dodaj aktywność:</StyledHeader>
                <ActivitiesWrapper className="scrollable">
                {activityTypes.map((activity, index) => (
                    <StyledActivity
                        key={activity.id}
                        $chosen={chosenItem === index}
                        onClick={() => setChosenItem(index)}
                    >
                        <img src={activity.icon} alt={activity.name} width="40" height="40" />
                        <p>{activity.name}</p>
                    </StyledActivity>
                ))}
                </ActivitiesWrapper>
                <TimePicker
                        id='timePicker'
                        title="ile czasu spędziłaś?"
                        name="activityTime"
                        onChange={(e) => {setAmount(parseInt(e.hours)*60+parseInt(e.minutes))}}
                        value={{hours:0,minutes:0}}
                        />
                        <StyledHeader>Że niby kiedy?</StyledHeader>
                        <DayPicker
                            fetchSelectedDaysToParent={(selectedDays) => {
                                if (selectedDays.length === 1) setSelectedDay(selectedDays[0]);
                            }}
                            multipleDaySelect={false}
                            daysCount={7}
        />
                <ChooseButton onClick={()=>addActivity(activityTypes[chosenItem].id, selectedDay, amount)}>Wybierz</ChooseButton>
            </StyledWrapper>
        </>

    )
};

export default AddActivityPopup;
