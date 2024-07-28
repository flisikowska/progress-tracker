import React from 'react';
import styled from 'styled-components';
import { PersonRunning } from '@styled-icons/fa-solid/PersonRunning';
import { BookPulse } from '@styled-icons/fluentui-system-regular/BookPulse';
import { NoteAdd } from '@styled-icons/fluentui-system-filled/NoteAdd';


const StyledMenu = styled.div`
    display:flex;
    flex-flow:row nowrap;
    justify-content:right;
    padding-right:65px;
    margin:auto;
    z-index:4;
    width:60%;
    #add{
        display:none;
        width:2em;
        >svg{
            padding:0;
            width:30px;
            height:30px;
            position:relative;
            bottom:10px;
        }
    }
    @media (max-width: 570px) {
        position:fixed;
        width:100%;
        margin:0;
        padding:0;
        transition: 0s ease-in-out;
        bottom: 0;
        height:60px;
        border-top: #fff;
        background-color:#fff;
    }
`;

const ItemWrapper = styled.div`
    > svg {
        width: 25px;
        height: 25px;
        padding-right:10px;
        cursor:pointer;
        color: #fff;
    }
    align-items:center;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    justify-content:center;    
    margin: 0 -.3em;
    width: 10em;
  	padding: .7em 2em .5em;
    z-index: ${(props) => (props.active ? '2' : '1')};
    &:before{
        background-color: ${(props) => (props.active ? 'rgba(86, 186, 119,0.8)' : 'rgba(100,100,100,0.3)')};
        border: .2em solid #fff;
        content: '';
        z-index:-1;
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        border-bottom: none;
        border-radius: .7em .7em 0 0;
        transform: scale(1.2, 1.3) perspective(.5em) rotateX(5deg);
        transform-origin: bottom;
    }
    @media (max-width: 570px) {
        &:before{
            display:none;
        }
        padding:0;
        margin:0;
        height:60px;
        width:100%;
        >svg{
            width: 23px;
            height: 23px;
            color: ${(props) => (props.active ? '#000' : '#bbb')};
        }
        >span{
            color: ${(props) => (props.active ? '#000' : '#bbb')};
        }
        &#add{
            display:block;
            >svg{
                color:rgba(86, 186, 119);
            }
        }
    }
`;

const MenuItemName = styled.span`
    font-size: 1rem;
    cursor:pointer;
    color: #fff;
    font-weight: 600;
    transition: 0.3s;
    @media (max-width: 450px) {
        font-size: 0.75rem;
        margin-top: 5px;
        color: #eee;
    }
`;

const StyledCircle = styled.div`
    position:absolute;
    bottom:5px;
    display:none;
    left:50%;
    transform:translate(-50%, 0);
    width:80px;
    height:80px;
    border-radius:100%;
    background-color:#fff;
    @media(max-width:570px){
        display:block;
    }
    &:before{
        content:'';
        width:28px;
        height:28px;
        position:absolute;
        bottom:54px;
        left:-19px;
        background:transparent;
        border-radius:50%;
        box-shadow: 15px 18px #fff;
    }
        &:after{
        content:'';
        width:28px;
        height:28px;
        position:absolute;
        bottom:54px;
        right:-19px;
        background:transparent;
        border-radius:50%;
        box-shadow: -15px 18px #fff;
    }
`;


const Menu = ({site, setSite, setActiveAddPopup}) => {
//   const { user, requestsCount } = useSelector((state) => ({
//     user: state.user,
//     requestsCount: state.requestsCount,
//   }));

  return (
      <StyledMenu id="menu">
        <ItemWrapper active={site==='grupa'} onClick={()=>setSite('grupa')} >
            <PersonRunning /> 
            <MenuItemName>Raport</MenuItemName>
        </ItemWrapper>
        <ItemWrapper id="add" onClick={()=>setActiveAddPopup(true)}>
            <NoteAdd />
        </ItemWrapper>
        <ItemWrapper  active={site==='moje'} onClick={()=>setSite('moje')}>
            <BookPulse />
            <MenuItemName>Profil</MenuItemName>
        </ItemWrapper>
        <StyledCircle/>
      </StyledMenu>
  );
};

export default Menu;
