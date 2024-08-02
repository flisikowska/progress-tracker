import React, {useRef, useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import TimePicker from './timePicker';
import {PersonRunning} from '@styled-icons/fa-solid/PersonRunning';
import {SportBasketball} from '@styled-icons/fluentui-system-regular/SportBasketball';
import {Tennisball} from '@styled-icons/ionicons-solid/Tennisball';
import {Volleyball} from '@styled-icons/fa-solid/Volleyball';
import {CloseOutline} from '@styled-icons/evaicons-outline/CloseOutline';

const StyledButton= styled.div`
    z-index:10;
    padding:7px 10px;
    font-size:0.9rem;
    font-weight:500;
    cursor:pointer;
    border:2px solid #999;
    border-radius:8px;
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
    flex-flow:column wrap;
    padding:25px;
    text-align:center;
    align-items:center;
    left:50%;
    top:50%;
    transform:translate(-50%, -50%);
    width:60%;
    height:90%;
    background-color:rgba(255,255,255);
    border-radius:10px;
    box-shadow:5px 5px 8px #aaa;
    z-index: 10;
    @media(max-width:900px){
        width:90%;
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

const StyledTitle= styled.div`
    font-weight:600;
    font-size:1.1rem;
`;

const ActivitiesWrapper= styled.div`
    height: calc(100% - 320px);
    width:60%;
    @media(max-width:900px){
        width:90%;
    }
    overflow-y: scroll;
    display: grid;
    margin:30px auto;
    grid-template-columns: repeat(3, 33.3%);
    @media(max-width:700px){
        grid-template-columns: repeat(2, 1fr);
    }
    @media(max-width:520px){
        grid-template-columns: repeat(1, 1fr);
        >div{
            width:80%;
            margin:10px auto;
        }
    }


`;

const StyledActivity= styled.div`
    padding:10px;
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
        border: 2px solid rgb(86, 186, 119);
        box-shadow: 0 0 4px rgb(86, 186, 119);
    `};

    >p{
        font-weight:600;
        font-size:0.9rem;
        margin:10px;
        @media(max-width:450px){
            font-size:0.7rem;
        }
    }
    >svg{
        color: rgba(86, 186, 119);
    }
`;

const ChooseButton= styled.div`
    padding:10px 0;
    cursor:pointer;
    text-align:center;
    border-radius:12px;
    border:2px solid #ccc;
    font-weight:600;
    font-size:0.9rem;
    transition:0.2s;
    width:100px;
    &:hover{
        background-color:rgba(86, 186, 119,0.8);
        border:2px solid rgba(86, 186, 119,0.8);
    }
`;


const AddActivityPopup=({active, setActiveAddPopup})=>{
    const [chosenItem, setChosenItem] = useState(null);

    const activePopupRef = useRef(active);
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

    return (
        <>
            <StyledButton onClick={()=> setActiveAddPopup(!active) }>Dodaj aktywność</StyledButton>
            <StyledWrapper id='addPopup' $active={active}>
                <CloseOutline onClick={()=>setActiveAddPopup(false)}/>
                <StyledTitle>Wybierz aktywność:</StyledTitle>
                <ActivitiesWrapper className="scrollable">
                    <StyledActivity $chosen={chosenItem===1} onClick={()=>setChosenItem(1)}><p>Bieganie</p><PersonRunning size="30"/></StyledActivity>
                    <StyledActivity $chosen={chosenItem===2} onClick={()=>setChosenItem(2)}><p>Koszykówka</p><SportBasketball size="30"/></StyledActivity>
                    <StyledActivity $chosen={chosenItem===3} onClick={()=>setChosenItem(3)}><p>Tenis</p><Tennisball size="30"/></StyledActivity>
                    <StyledActivity $chosen={chosenItem===4} onClick={()=>setChosenItem(4)}><p>Siatkówka</p><Volleyball size="30"/></StyledActivity>
                </ActivitiesWrapper>
                <TimePicker
                        id='timePicker'
                        title="ile czasu spędziłaś?"
                        name="activityTime"
                        onChange={(e) => {
                            // setFieldValue('activeCookingTime', e.hours + ':' + e.minutes);
                            // touched.activeCookingTime = true;
                            // validateForm();                        
                        }}
                        value={{
                            // hours: parseInt(values.activeCookingTime.split(':')[0]),
                            // minutes: parseInt(values.activeCookingTime.split(':')[1]),
                            hours:0,
                            minutes:0,
                        }}
                        />
                <ChooseButton>Wybierz</ChooseButton>
            </StyledWrapper>
        </>

    )
};

export default AddActivityPopup;
