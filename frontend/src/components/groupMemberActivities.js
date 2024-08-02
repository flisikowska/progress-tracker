import React, {useEffect} from 'react';
import styled from 'styled-components';
import { ResizeGridItems } from "../helpers/functions"

const StyledActivitiesWrapper = styled.div`
  width:430px;
  height: 400px;
  place-items:center;
  margin:auto;
  display: grid;  
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  grid-auto-rows: 0; 
  @media(max-width:600px){
    gap:10px;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  :first-child{
    >h1{
      font-size:1.2rem;
      margin-top:10px;
      @media(max-width:600px){
        font-size:1rem;
      }
    }}
`;

const StyledActivity=styled.div`
    width:130px;
    border:2px solid #bbb;
    border-radius:10px;
    padding:10px;
    text-align:center;
    cursor:default;
    grid-row-end: span 10;
    >svg{
      color: rgba(86, 186, 119);
      margin:10px;
    }

    @media(max-width:600px){
      width:100px;
    }
`;

const ActivityTitle= styled.h1`
    padding:0;
    font-weight:600;
    font-size:0.9rem;
    margin: 0 auto;
    text-align:center;
    @media(max-width:450px){
        font-size:0.7rem;
    }
`;

const StyledTime=styled.div`
    font-size:0.8rem;
    padding:0;
    color:#aaa;
    text-align:left;

`

function GroupMemberActivities({activities}){
    useEffect(() => {
        ResizeGridItems("groupMemberActivities")
      })
    return(
      <StyledActivitiesWrapper className='groupMemberActivities'>
        <StyledActivity className='grid-item'><StyledTime>Łącznie</StyledTime><ActivityTitle>4h 35min</ActivityTitle></StyledActivity>
        {activities &&
          activities.map(
            (
              {
                id,
                name,
                time,
                icon,
              }
            ) => (
                  <StyledActivity id={id} className='grid-item'><StyledTime>{time}</StyledTime>{icon}<ActivityTitle>{name}</ActivityTitle></StyledActivity>

            ),
          )}
            {/* <StyledActivity className='grid-item'><StyledTime>2h</StyledTime><Volleyball size="30"/><ActivityTitle>Siatkówka plażowa</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledTime>45min</StyledTime><SportBasketball size="30"/><ActivityTitle>Skakanka na jednej nodze</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledTime>1h</StyledTime><Volleyball size="30"/><ActivityTitle>Siatkówka</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledTime>1.33h</StyledTime><PersonRunning size="30"/><ActivityTitle>Bieganie</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledTime>1.35h</StyledTime><Tennisball size="30"/><ActivityTitle>Tenis</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledTime>45min</StyledTime><SportBasketball size="30"/><ActivityTitle>Koszykówka</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledTime>2h</StyledTime><Volleyball size="30"/><ActivityTitle>Joga</ActivityTitle></StyledActivity> */}
      </StyledActivitiesWrapper>
    );
};

export default GroupMemberActivities;
