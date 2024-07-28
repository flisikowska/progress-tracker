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
  height:100%;
  min-height:600px;
  padding:50px 0 80px 0;
  background-color:rgb(180,180,180);
  background-image: url(${props => props.icon});
  #wrapper{
    width:60%;
    position:relative;
    border-radius:10px;
    border:3px solid #fff;
    padding:20px;
    margin:auto;
    background-color:rgb(220,220,220);
    @media(max-width:670px){
      width:90%;
    
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
`;

function App() {
  const [site, setSite] = useState('grupa');
  const [activeNotificationPopup, setActiveNotificationPopup] = useState(false);
  const [activeAddPopup, setActiveAddPopup] = useState(false);
  return (
    <AppContainer icon={icon}>
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
