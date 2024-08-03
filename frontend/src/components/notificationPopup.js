import { Notifications } from '@styled-icons/material-outlined/Notifications';
import React, {useRef, useEffect} from 'react';
import styled from 'styled-components';

const StyledContainer=styled.div`
>svg{
    width:30px;
    height:30px;
    color:black;
    cursor:pointer;
    margin:0 10px;
    }
`;
    
const StyledWrapper=styled.div`
    z-index:10;
    overflow-y:scroll;
    display: ${(props) => (props.$active ? 'block' : 'none')};
    position:absolute;
    text-align:left;
    padding:15px;
    margin-top:10px;
    right:75px;
    width:400px;
    height:450px;
    background-color:rgba(255,255,255, 0.8);
    border-radius:4px;
    box-shadow:5px 5px 8px #aaa;
    >div{
        cursor:default;
        background-color:rgba(255,255,255);
        padding:5px 15px;
        border-radius:5px;
        border:2px solid #ddd;
        margin:10px 0;
    }
    #time{
        font-size:0.9rem;
        margin:5px 10px 0 0;
    }
    #info{
        font-size:1rem;
        margin:10px 0 5px 0;
        font-weight:bold;
    }
    @media(max-width:570px){
        width:70%;
        height:250px;
        #info{
            font-size:0.7rem;    
        }
        #time{
            font-size:0.6rem;
        }
    }    
`;


const NotificationPopup=({active, setActiveNotificationPopup})=>{
    const activePopupRef = useRef(active);
    useEffect(() => {
        window.addEventListener('mouseup', (event) => {
            if (window.innerWidth >= 450) {
              if (!activePopupRef.current) return;
              var popup = document.getElementById('popup');
              if (event.target !== popup) {
                let parent = event.target.parentNode;
                while (parent !== null) {
                  if (parent === popup) return;
                  else parent = parent.parentNode;
                }
                setTimeout(() => setActiveNotificationPopup(false), 1);
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

    return (
        <StyledContainer>
            <Notifications onClick={()=> setActiveNotificationPopup(!active) }/>
            <StyledWrapper className='scrollable' id='popup' $active={active}>
                <div>
                    <p id='time'>12.03 10:30</p>
                    <p id='info'>Karolina dodał/a "bieganie-30 min"</p>
                </div>
                <div>
                    <p id='time'>12.03 10:30</p>
                    <p id='info'>Angelika dodał/a "pływanie-1 h"</p>
                </div>
                <div>
                    <p id='time'>12.03 10:30</p>
                    <p id='info'>Karolina dodał/a "bieganie-30 min"</p>
                </div>
                <div>
                    <p id='time'>12.03 10:30</p>
                    <p id='info'>Angelika dodał/a "pływanie-1 h"</p>
                </div>
                <div>
                    <p id='time'>12.03 10:30</p>
                    <p id='info'>Karolina dodał/a "bieganie-30 min"</p>
                </div>
                <div>
                    <p id='time'>12.03 10:30</p>
                    <p id='info'>Angelika dodał/a "pływanie-1 h"</p>
                </div>
                <div>
                    <p id='time'>12.03 10:30</p>
                    <p id='info'>Karolina dodał/a "bieganie-30 min"</p>
                </div>
                <div>
                    <p id='time'>12.03 10:30</p>
                    <p id='info'>Angelika dodał/a "pływanie-1 h"</p>
                </div>
            </StyledWrapper>
        </StyledContainer>
    )
};

export default NotificationPopup;
