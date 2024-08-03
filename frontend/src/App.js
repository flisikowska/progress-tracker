import './App.css';
import React, {useState} from 'react';
import styled from 'styled-components';
import Home from './views/moje';
import Grupa from './views/grupa';
import Menu from './components/menu';
import NotificationPopup from './components/notificationPopup';
import AddActivityPopup from './components/addActivityPopup';
import Login from './views/login';

const AppContainer=styled.div`
    width:100%;
    min-height:100vh;
    padding: 50px 0 100px 0;
    background-color:rgb(180,180,180);
    @media(max-width:450px){
      padding:10px 0 70px 0;
    }
  `;
  
  const StyledWrapper= styled.div`
  width:900px;
  height:fit-content;
  border-radius:4px;
  position:relative;
  border:3px solid #fff;
  padding:20px;
  margin:auto;
  background-color:rgb(220,220,220);
  @media(max-width:1000px){
    width:90%;
  }
  @media(max-width:450px){
    width:96%;
    padding:20px 10px;
    border-radius:0;
    margin:0 auto 0px auto;
  }
`;


const IconsWrapper=styled.div`
  width:100%;
  display:flex;
  flex-flow: row nowrap;
  padding:20px;
  justify-content:right;
  align-items:center;
  @media(max-width:770px){
      padding:0px;
    }
`;

function App() {
  const [site, setSite] = useState('grupa');
  const [loggedIn, setLoggedIn] = useState(true);
  const [activeNotificationPopup, setActiveNotificationPopup] = useState(false);
  const [activeAddPopup, setActiveAddPopup] = useState(false);
  return (
    <AppContainer>
    {loggedIn ?(
      <>
        <Menu site={site} setActiveAddPopup={setActiveAddPopup} setSite={setSite}/>
        <StyledWrapper>
          <IconsWrapper>  
            <AddActivityPopup setActiveAddPopup={setActiveAddPopup} active={activeAddPopup}/>
            <NotificationPopup setActiveNotificationPopup={setActiveNotificationPopup} active={activeNotificationPopup}/>
          </IconsWrapper>
          {site==='grupa' ?(
            <Grupa/>
          ):(
            <Home logout={()=>setLoggedIn(false)} />
          )}
        </StyledWrapper>
      </>
    ):(
      <StyledWrapper>
        <Login/>
     </StyledWrapper>

    )}
    </AppContainer>
  );
}

export default App;
