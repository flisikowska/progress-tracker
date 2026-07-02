import './App.css';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Profile from './views/profile';
import Group from './views/group';
import Menu from './components/menu';
import NotificationPopup from './components/notificationPopup';
import AddActivityPopup from './components/addActivityPopup';
import Login from './views/login';
import axios from 'axios';

import yoga from './assets/yoga.png';
import walking from './assets/walking.png';
import tennis from './assets/tennis.png';
import swimming from './assets/swimming.png';
import pilates from './assets/pilates.png';
import soccer from './assets/soccer.png';
import basketball from './assets/basketball.png';
import confused from './assets/confused.png';

const AppContainer=styled.div`
    width:100%;
    min-height:100vh;
    padding: 50px 0 100px 0;
    background-color: rgba(31,33,35,255);
    @media(max-width:570px){
      padding:10px 0 70px 0;
    }
  `;
  
  const StyledWrapper= styled.div`
  width:900px;
  height:fit-content;
  border-radius:4px;
  position:relative;
  border:1px solid #fff;
  padding:20px;
  margin:auto;
  background-color:rgba(119,120,121,255);
  @media(max-width:1000px){
    width:90%;
  }
  @media(max-width:570px){
    width:96%;
    padding:20px 10px;
    border-radius:0;
    margin:0 auto;
  }
`;

const HeaderWrapper=styled.div`
  width:100%;
  display:flex;
  flex-flow: row nowrap;
  padding-top:20px;
  justify-content:space-between;
  align-items:flex-start;
  @media(max-width:770px){
      padding:0px;
  }
  #buttons{
    display:flex;
    flex-flow:row-nowrap;
    padding-right:0px;
  }
`;

const StyledHeader=styled.h1`
  font-size:1.1rem;
  font-weight:500;
  color: rgba(255,255,255,0.2);
  margin:0; 
  padding:0;
  // color:#000;
`;

const GroupName=styled.span`
  display:block;
  font-size:1.3rem;
  font-weight:600;
  color:#eee;
    margin:0;
  padding:0;
`;

const Loader=styled.div`
  width:48px;
  height:48px;
  margin:120px auto;
  border:5px solid rgba(255,255,255,0.2);
  border-top-color:#eee;
  border-radius:50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin{ to { transform: rotate(360deg); } }
`;

function App() {
  const [users, setUsers] = useState([]);
  const [usersActivities, setUsersActivities] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [userActivitiesForTheDay, setUserActivitiesForTheDay] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [goal, setGoal] = useState(0);
  const [site, setSite] = useState('grupa');
  const [loggedIn, setLoggedIn] = useState(null);
  const [activeNotificationPopup, setActiveNotificationPopup] = useState(false);
  const [activeAddPopup, setActiveAddPopup] = useState(false);
  const host='localhost';

  useEffect(() => {
    axios.get(`http://${host}:5000/user`, {
      withCredentials: true,
    })
    .then(() => setLoggedIn(true))
    .catch(()=> setLoggedIn(false));
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchUsersActivities();
      fetchStatsActivities();
      fetchGroupInfo();
      fetchActivityTypes();
    }
  }, [loggedIn]);

  const logout=()=>{
    axios.post(`http://${host}:5000/logout`, {}, {
      withCredentials: true,
    })
    .finally(() => setLoggedIn(false));
  }

  const fetchUsersActivities=()=>{
    axios.get(`http://${host}:5000/current-week`, {
      withCredentials: true,
    })
    .then(res => {
        setUsersActivities(res.data);
      });
  }

  const fetchUserActivities=(selectedDays)=>{
    axios.get(`http://${host}:5000/activities`, {params: {date: selectedDays}})
    .then(res => {
        setUserActivitiesForTheDay(res.data);
      });
  }

  const fetchGroupInfo=()=>{
    axios.get(`http://${host}:5000/group`)
    .then(res => {
        setGroupName(res.data.group_name);
        setGoal(res.data.group_goal);
        setUsers(res.data.users);
      });
  }

  const fetchStatsActivities=()=>{
    axios.get(`http://${host}:5000/last-10-weeks`)
    .then(res => {
        setStatsData(res.data);
    });
}

  const activityIcons = {
    tennis,
    yoga,
    walking, 
    soccer,
    swimming,
    basketball,
    pilates
};

  const fetchActivityTypes=()=>{
    axios.get(`http://${host}:5000/activity-types`)
        .then(res => {
            const activitiesWithIcons = res.data.map(activity => ({
                ...activity,
                icon: activityIcons[activity.icon] || confused,
            }));
            setActivityTypes(activitiesWithIcons);
        })
  }

  if (loggedIn === null) {
    return (
      <AppContainer>
        <Loader/>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
    {loggedIn ?(
      <>
        <Menu site={site} setActiveAddPopup={setActiveAddPopup} setSite={setSite}/>
        <StyledWrapper>
          <HeaderWrapper>  
            <StyledHeader>{site==='grupa' ?(<>Raport grupy:<GroupName>{groupName}</GroupName></>):("Moja aktywność:")}</StyledHeader>
            <div id="buttons">
              <AddActivityPopup activityTypes={activityTypes} setActiveAddPopup={setActiveAddPopup} active={activeAddPopup} refreshStatsActivities={fetchStatsActivities} refreshUsersActivities={fetchUsersActivities} refreshUserActivities={fetchUserActivities}/>
              <NotificationPopup setActiveNotificationPopup={setActiveNotificationPopup} active={activeNotificationPopup}/>
            </div>
          </HeaderWrapper>
          {site==='grupa' ?(
            <Group statsData={statsData} activityTypes={activityTypes} users={users} goal={goal} usersActivities={usersActivities}/>
          ):(
            <Profile activityTypes={activityTypes} users={users} userActivitiesForTheDay={userActivitiesForTheDay} refreshUsersActivities={fetchUsersActivities} fetchUserActivities={fetchUserActivities} logout={logout} />
          )}
        </StyledWrapper>
      </>
    ):(
      <StyledWrapper>
        <Login onLogin={()=>setLoggedIn(true)}/>
     </StyledWrapper>

    )}
    </AppContainer>
  );
}

export default App;
