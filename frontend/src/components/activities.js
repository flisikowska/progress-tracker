import React, {useEffect} from 'react';
import styled from 'styled-components';
import {PersonRunning} from '@styled-icons/fa-solid/PersonRunning';
import {SportBasketball} from '@styled-icons/fluentui-system-regular/SportBasketball';
import {Tennisball} from '@styled-icons/ionicons-solid/Tennisball';
import {Volleyball} from '@styled-icons/fa-solid/Volleyball';
import { ResizeGridItems } from "../helpers/functions"
import {CloseOutline} from '@styled-icons/evaicons-outline/CloseOutline';

const StyledActivitiesWrapper = styled.div`
  width:60%;
  margin: 20px auto;
  place-items:center;
  display: grid;  
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  grid-auto-rows: 0; 
  @media(max-width:1400px){
    width:80%;
  }
  @media(max-width:600px){
      font-size:1rem;
      width:95%;
      gap:10px;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));

    }
  :first-child{
    >h1{
      font-size:1.5rem;
      margin-top:15px;
      @media(max-width:600px){
        font-size:1rem;
      }
    }}
`;

const StyledActivity=styled.div`
    width:150px;
    border:2px solid #bbb;
    border-radius:10px;
    padding:10px;
    text-align:center;
    cursor:default;
    grid-row-end: span 10;
    >svg{
      color: rgba(86, 186, 119);
      margin:15px;
    }

    @media(max-width:600px){
      width:120px;
    }
`;

const ActivityTitle= styled.h1`
    padding:0;
    font-weight:600;
    font-size:1.1rem;
    margin: 0 auto;
    text-align:center;
    @media(max-width:450px){
        font-size:0.7rem;
    }
`;

const StyledHeader=styled.div`
display:flex;
flex-flow:row nowrap;
align-items:center;
justify-content:space-between;
  >p{
    font-size:0.8rem;
    padding:0;
    color:#aaa;
  }
  >svg{
    color:#aaa;
    width:25px;
    height:25px;
    cursor:pointer;
  }
`


function Activities(){
    useEffect(() => {
        ResizeGridItems()
      })
    return(
      <StyledActivitiesWrapper className='activities'>
        {/* {activities &&
          activities.map(
            (
              {
                id,
                name,
                icon,
              },
              index,
            ) => (
              <Activity
                user={user}
                key={index}
                id={id}
                name={name}
                icon={icon}
              />
            ),
          )} */}
            <StyledActivity className='grid-item'><StyledHeader><p>Łącznie</p></StyledHeader><ActivityTitle>4h 35min</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledHeader><p>1.35h</p><CloseOutline/></StyledHeader><Tennisball size="35"/><ActivityTitle>Tenis</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledHeader><p>2h</p><CloseOutline/></StyledHeader><Volleyball size="35"/><ActivityTitle>Siatkówka plażowa</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledHeader><p>45min</p><CloseOutline/></StyledHeader><SportBasketball size="35"/><ActivityTitle>Skakanka na jednej nodze</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledHeader><p>1h</p><CloseOutline/></StyledHeader><Volleyball size="35"/><ActivityTitle>Siatkówka</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledHeader><p>1.33h</p><CloseOutline/></StyledHeader><PersonRunning size="35"/><ActivityTitle>Bieganie</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledHeader><p>1.35h</p><CloseOutline/></StyledHeader><Tennisball size="35"/><ActivityTitle>Tenis</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'><StyledHeader><p>45min</p><CloseOutline/></StyledHeader><SportBasketball size="35"/><ActivityTitle>Koszykówka</ActivityTitle></StyledActivity>
            <StyledActivity className='grid-item'> <StyledHeader><p>2h</p><CloseOutline/></StyledHeader><Volleyball size="35"/><ActivityTitle>Joga</ActivityTitle></StyledActivity>
      </StyledActivitiesWrapper>
    );
};

export default Activities;
