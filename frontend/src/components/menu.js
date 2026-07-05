import React from 'react';
import styled, {css} from 'styled-components';
import { ChannelAdd } from '@styled-icons/fluentui-system-filled/ChannelAdd';
import { PeopleGroup } from '@styled-icons/fa-solid/PeopleGroup';
import { Calendar3 } from '@styled-icons/bootstrap/Calendar3';

const StyledMenu = styled.div`
    display:flex;
    width:900px;
    flex-flow:row nowrap;
    justify-content:left;
    padding-left:65px;
    margin:auto;
    z-index:4;
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
    @media(max-width:1000px){
        width:90%;
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
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        padding-right:10px;
        cursor:pointer;
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
    z-index: ${(props) => (props.$active ? '2' : '1')};
    &:before{
        background-color: ${(props) => (props.$active ? 'var(--blue)' : 'var(--white)')};
        border: .1em solid #fff;
        content: '';
        z-index:-1;
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        border-bottom: none;
        border-radius: 12px 12px 0 0;
        transform: scale(1.2, 1.3) perspective(.5em) rotateX(5deg);
        transform-origin: bottom;
    }

${(props) =>
    props.$active &&
    css`
      .item-name,
      .item-icon {
        color: ${(props) =>
    props.$active ? 'var(--white)':'var(--text)'};

     @media (max-width: 570px) {
       color: ${(props) =>
    props.$active ? 'var(--text)':'var(--text-inactive)'};
       }}
    `}

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
            color: ${(props) => (props.$active ? 'var(--text)' : 'var(--text-inactive)')};
        }
        >span{
            color: ${(props) => (props.$active ? 'var(--text)' : 'var(--text-inactive)')};
        }
        &#add{
            display:block;
            >svg{
                color:var(--blue);
            }
        }
    }
`;

const MenuItemName = styled.span`
    font-size: 0.9rem;
    cursor:pointer;
    font-weight: 600;
    @media (max-width: 450px) {
        font-size: 0.75rem;
        margin-top: 5px;
        color: var(--text);
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
  return (
      <StyledMenu id="menu">
        <ItemWrapper $active={site==='grupa'} onClick={()=>setSite('grupa')} >
            <PeopleGroup className="item-icon"/>
            <MenuItemName className="item-name">Grupa</MenuItemName>
        </ItemWrapper>
        <ItemWrapper id="add" onClick={()=>setActiveAddPopup(true)}>
            <ChannelAdd />
        </ItemWrapper>
        <ItemWrapper $active={site==='moje'} onClick={()=>setSite('moje')}>
            <Calendar3 className="item-icon"/>
            <MenuItemName className="item-name">Aktywności</MenuItemName>
        </ItemWrapper>
        <StyledCircle/>
      </StyledMenu>
  );
};

export default Menu;
