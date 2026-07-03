import './App.css';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Profile from './views/profile';
import Group from './views/group';
import Menu from './components/menu';
import NotificationPopup from './components/notificationPopup';
import AddActivityPopup from './components/addActivityPopup';
import Login from './views/login';
import UserSettings from './views/userSettings';
import { User } from '@styled-icons/fa-solid/User';
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
    background-color: var(--color-background);
    @media(max-width:570px){
      padding:10px 0 70px 0;
    }
  `;
  
  const StyledWrapper= styled.div`
  width:900px;
  height:fit-content;
  border-radius:12px;
  position:relative;
  padding:20px;
  margin:auto;
  background-color: var(--white);
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
    align-items:center;
    padding-right:0px;
  }
`;

const StyledHeader=styled.h1`
  font-size:1rem;
  font-weight:500;
  color: var(--text-inactive);
  margin:0; 
  padding:0;
`;

const ProfileButton = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  margin: 0 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--primary-dark);
  transition: border-color 0.2s;
  &::before {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${p => p.$color ? `#${p.$color}55` : 'var(--primary-dark)'};
    top: 2px;
    left: 2px;
  }
  &:hover {
    border-color: var(--blue);
  }
  > svg {
    width: 13px;
    height: 13px;
    color: var(--text);
    position: relative;
    z-index: 1;
  }
`;

const GroupName=styled.span`
  display:block;
  font-size:1.2rem;
  font-weight:600;
  color:var(--text);
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

const StyledSeparator=styled.div`
  width:1px; 
  height:22px; 
  background:var(--primary);
  margin:0 10px;
  padding:0;
`

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
  const [currentUser, setCurrentUser] = useState(null);
  const [activeNotificationPopup, setActiveNotificationPopup] = useState(false);
  const [activeAddPopup, setActiveAddPopup] = useState(false);
  const host='localhost';

  useEffect(() => {
    axios.get(`http://${host}:5000/user`, {
      withCredentials: true,
    })
    .then(res => { setLoggedIn(true); setCurrentUser(res.data[0]); })
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
    axios.get(`http://${host}:5000/activities`, {params: {date: selectedDays}, withCredentials: true})
    .then(res => {
        setUserActivitiesForTheDay(res.data);
      });
  }

  const fetchGroupInfo=()=>{
    axios.get(`http://${host}:5000/group`, { withCredentials: true })
    .then(res => {
        setGroupName(res.data.group_name);
        setGoal(res.data.group_goal);
        setUsers(res.data.users);
      });
  }

  const fetchStatsActivities=()=>{
    axios.get(`http://${host}:5000/last-10-weeks`, { withCredentials: true })
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
            <StyledHeader>{site==='grupa' ?(<>Raport grupy:<GroupName>{groupName}</GroupName></>) : site==='moje' ? "Moja aktywność:" : "Profil"}</StyledHeader>
            <div id="buttons">
              <AddActivityPopup activityTypes={activityTypes} setActiveAddPopup={setActiveAddPopup} active={activeAddPopup} refreshStatsActivities={fetchStatsActivities} refreshUsersActivities={fetchUsersActivities} refreshUserActivities={fetchUserActivities}/>
              <StyledSeparator/>
              <NotificationPopup setActiveNotificationPopup={setActiveNotificationPopup} active={activeNotificationPopup}/>
              <ProfileButton $active={site==='profil'} $color={currentUser?.color} onClick={() => setSite(site === 'profil' ? 'grupa' : 'profil')}>
                <User />
              </ProfileButton>
            </div>
          </HeaderWrapper>
          {site==='grupa' ?(
            <Group statsData={statsData} activityTypes={activityTypes} users={users} goal={goal} usersActivities={usersActivities}/>
          ) : site==='moje' ? (
            <Profile activityTypes={activityTypes} users={users} userActivitiesForTheDay={userActivitiesForTheDay} refreshUsersActivities={fetchUsersActivities} fetchUserActivities={fetchUserActivities} logout={logout} />
          ) : (
            <UserSettings onSave={fetchGroupInfo} />
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
