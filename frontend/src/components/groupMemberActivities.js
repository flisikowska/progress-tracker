import React, {useEffect} from 'react';
import styled from 'styled-components';
import { ResizeGridItems } from "../helpers/functions"

const StyledActivitiesWrapper = styled.div`
  width:100%;
  // height: 400px;
  place-items:center;
  padding:0 20px;
  margin:auto;
  display: grid;  
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
  grid-auto-rows: 0; 
  @media(max-width:600px){
    gap:10px;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
  >div:first-child{
    border:2px solid #888;
    >div{
      color:#000;
      font-size:1rem;
      margin-bottom:10px;
    }
    >h1{
      font-size:1.2rem;
      @media(max-width:900px){
        font-size:0.9rem;
      }
    }
  }
`;

const StyledActivity=styled.div`
    width:130px;
    border:2px solid #bbb;
    border-radius:4px;
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
    font-weight:600;
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
      </StyledActivitiesWrapper>
    );
};

export default GroupMemberActivities;
