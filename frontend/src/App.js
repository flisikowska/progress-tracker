import './App.css';
import React, {useState} from 'react';
import styled from 'styled-components';
import Home from './views/moje';
import Grupa from './views/grupa';
import Menu from './components/menu';
import icon from './assets/bg2.png';
import NotificationPopup from './components/notificationPopup';
import AddActivityPopup from './components/addActivityPopup';


const AppContainer=styled.div`
  width:100%;
  min-height:100vh;
  padding-bottom: 80px;
  background-color:rgb(180,180,180);
  background-image: url(${props => props.$icon});
  #wrapper{
    width:60%;
    position:relative;
    border-radius:10px;
    border:3px solid #fff;
    padding:20px;
    margin:auto;
    background-color:rgb(220,220,220);
    @media(max-width:770px){
      width:90%;
    }
  }
`;

const StyledLoginContainer=styled.div`
  display:flex;
  flex-flow: row nowrap;
  justify-content: right;
  padding:10px;
  >div{
    color:#000;
    font-weight:500;
    font-size:1rem;
    cursor:pointer;
    padding:7px 10px;
    margin:5px;
    &:hover{
      color:#555 
    }
  }
    >div:nth-of-type(2){
      border:2px solid #999;
      border-radius: 10px;
  }
  @media(max-width:770px){
    >div{
      font-size:0.8rem;
    }
  }
`;


const IconsWrapper=styled.div`
  width:100%;
  display:flex;
  box-sizing:border-box;
  flex-flow: row nowrap;
  padding:20px;
  justify-content:right;
  align-items:center;
  @media(max-width:770px){
      padding:0px;
      margin-bottom:30px;
    }
`;

function App() {
  const [site, setSite] = useState('grupa');
  const [activeNotificationPopup, setActiveNotificationPopup] = useState(false);
  const [activeAddPopup, setActiveAddPopup] = useState(false);
  return (
    <AppContainer $icon={icon}>
      <StyledLoginContainer>
        <div>Zaloguj się</div>
        <div>Utwórz konto</div>
      </StyledLoginContainer>
      <Menu site={site} setActiveAddPopup={setActiveAddPopup} setSite={setSite}/>
      <div id='wrapper'>
        <IconsWrapper>  
          <AddActivityPopup setActiveAddPopup={setActiveAddPopup} active={activeAddPopup}/>
          <NotificationPopup setActiveNotificationPopup={setActiveNotificationPopup} active={activeNotificationPopup}/>
        </IconsWrapper>
        {site==='grupa' ?(
            <Grupa/>
        ):(
          <Home/>
        )}
      </div>
    </AppContainer>
  );
}

export default App;
