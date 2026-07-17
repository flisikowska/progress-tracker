import './App.css';
import React, {useState, useEffect, useCallback} from 'react';
import styled from 'styled-components';
import Diary from './views/diary';
import Group from './views/group';
import Menu from './components/menu';
import NotificationPopup from './components/notificationPopup';
import Footer from './components/footer';
import AddActivityPopup from './components/addActivityPopup';
import Login from './views/login';
import UserSettings from './views/userSettings';
import { User } from '@styled-icons/fa-solid/User';
import { FormattedDate } from './helpers/functions';
import axios from 'axios';
import PeriodSelector from './components/periodSelector';
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
  border:2px solid #fff;
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
    margin:20px auto;
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

const UserButton = styled.div`
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
  transition:  0.3s;
  background-color: ${p => p.$color ? `#${p.$color}85` : 'var(--primary-dark)'};
  &:hover {
      background-color: ${p => p.$color ? `#${p.$color}` : 'var(--primary-dark)'};

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

const GroupSelect=styled.select`
  display:block;
  margin-top:7px;
  font-size:1rem;
  font-weight:500;
  color:var(--text);
  background:transparent;
  border:none;
  border-bottom:2px solid var(--primary);
  cursor:pointer;
  padding:2px 20px 2px 2px;
  &:focus{ outline:none; }
`;

const Loader=styled.div`
  width:48px;
  height:48px;
  margin:120px auto;
  border:5px solid var(--primary-dark);
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
  @media(max-width:570px){
    display:none;
  }
`

const LogoutButton= styled.div`
    width:fit-content;
    color:#000;
    font-weight:500;
    font-size:1rem;
    cursor:pointer;
    border:2px solid var(--primary-dark);
    border-radius: 20px;
    padding:7px 10px;
    margin-left:auto;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalCard = styled.div`
  background: var(--white);
  border-radius: 12px;
  padding: 28px;
  max-width: 360px;
  width: 90%;
  text-align: center;
  color: var(--text);
  > p { font-size: 1rem; margin: 8px 0; }
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 12px 0;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 22px;
`;

const AcceptBtn = styled.button`
  padding: 9px 22px;
  border-radius: 20px;
  background: var(--pale-blue);
  border: 2px solid var(--blue);
  color: var(--white);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: var(--blue); }
`;

const DeclineBtn = styled.button`
  padding: 9px 22px;
  border-radius: 20px;
  background: transparent;
  border: 2px solid var(--red);
  color: var(--red);
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: var(--red); color: var(--white); }
`;


function App() {
  const [users, setUsers] = useState([]);
  const [usersActivities, setUsersActivities] = useState([]);
  const [statsData, setStatsData] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [userActivitiesForTheDay, setUserActivitiesForTheDay] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups]= useState([]);
  const [activeGroupId, setActiveGroupId] = useState(() => {
    const saved = localStorage.getItem('activeGroupId');
    return saved ? Number(saved) : null;
  });
  const [goal, setGoal] = useState(0);
  const [goalPeriod, setGoalPeriod] = useState('week');
  const [site, setSite] = useState('grupa');
  const [loggedIn, setLoggedIn] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDays, setSelectedDays] = useState([FormattedDate(new Date())]);
  const [activeNotificationPopup, setActiveNotificationPopup] = useState(false);
  const [activeAddPopup, setActiveAddPopup] = useState(false);
  const [pendingInvite, setPendingInvite] = useState(null);
  const [inviteInfo, setInviteInfo] = useState(null);
  const [editActivity, setEditActivity]= useState(null);
  const [activePeriod, setActivePeriod]= useState('dzien');
  const host = process.env.REACT_APP_API_HOST;

  const fetchCurrentUser=useCallback(()=>{
    return axios.get(`${host}/user`, { withCredentials: true })
      .then(res => setCurrentUser(res.data[0]));
  }, [host])

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setLoggedIn(false);
          return new Promise(() => {});
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  useEffect(() => {
    axios.get(`${host}/user`, {
      withCredentials: true,
    })
    .then(res => { setLoggedIn(true); setCurrentUser(res.data[0]); })
    .catch(()=> setLoggedIn(false));
  }, [host]);

  // odczyt tokenu zaproszenia z linku (?invite=...) - trzymamy go na czas logowania
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite') || localStorage.getItem('pendingInvite');
    if (token) {
      setPendingInvite(token);
      localStorage.setItem('pendingInvite', token);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // po zalogowaniu pobierz podgląd grupy z zaproszenia (bez dołączania)
  useEffect(() => {
    if (loggedIn && pendingInvite) {
      axios.get(`${host}/invite-info?token=${pendingInvite}`, { withCredentials: true })
        .then(res => setInviteInfo(res.data))
        .catch(() => clearInvite());
    }
  }, [loggedIn, pendingInvite, host]);

  const clearInvite = () => {
    setInviteInfo(null);
    setPendingInvite(null);
    localStorage.removeItem('pendingInvite');
  };

  const acceptInvite = () => {
    axios.post(`${host}/join`, { token: pendingInvite }, { withCredentials: true })
      .then(res => {
        const newId = res.data.group_id;
        fetchMyGroups().then(() => { setActiveGroupId(newId); setSite('grupa'); });
      })
      .finally(clearInvite);
  };

  const logout=()=>{
    axios.post(`${host}/logout`, {}, {
      withCredentials: true,
    })
    .finally(() => setLoggedIn(false));
  }

  const fetchMyGroups=useCallback(()=>{
    return axios.get(`${host}/my-groups`, { withCredentials: true })
    .then(res => {
        setGroups(res.data);
        setActiveGroupId(prev =>
          prev && res.data.some(g => g.group_id === prev)
            ? prev
            : res.data[0]?.group_id ?? null
        );
      });
  }, [host])

  // trzymaj aktywna grupe w localStorage, zeby przetrwala odswiezenie strony
  useEffect(() => {
    if (activeGroupId != null) localStorage.setItem('activeGroupId', String(activeGroupId));
    else localStorage.removeItem('activeGroupId');
  }, [activeGroupId])

  const fetchUsersActivities=useCallback((groupId = activeGroupId)=>{
    if (!groupId) return;
    axios.get(`${host}/current-period?group_id=${groupId}`, {
      withCredentials: true,
    })
    .then(res => {
        setUsersActivities(res.data);
      });
  }, [host, activeGroupId])

  const fetchUserActivities=useCallback((days = selectedDays)=>{
    const query = days.map(d => `date=${encodeURIComponent(d)}`).join('&');
    axios.get(`${host}/activities?${query}`, {withCredentials: true})
    .then(res => {
        setUserActivitiesForTheDay(res.data);
      });
  }, [host, selectedDays])

  const fetchGroupInfo=useCallback((groupId = activeGroupId)=>{
    if (!groupId) return;
    axios.get(`${host}/group?group_id=${groupId}`, { withCredentials: true })
    .then(res => {
        setGroupName(res.data.group_name);
        setGoal(res.data.group_goal);
        setGoalPeriod(res.data.group_goal_period);
        setUsers(res.data.users);
      });
  }, [host, activeGroupId])

  const fetchStatsActivities=useCallback((groupId = activeGroupId)=>{
    if (!groupId) return;
    axios.get(`${host}/last-10-weeks?group_id=${groupId}`, { withCredentials: true })
    .then(res => {
        setStatsData(res.data);
    });
}, [host, activeGroupId])

  const fetchActivityTypes=useCallback(()=>{
    axios.get(`${host}/activity-types`, { withCredentials: true })
        .then(res => setActivityTypes(res.data))
  }, [host])

  // po zalogowaniu pobierz dane początkowe
  useEffect(() => {
    if (loggedIn) {
      fetchCurrentUser();
      fetchActivityTypes();
      fetchMyGroups();
    }
  }, [loggedIn, fetchCurrentUser, fetchActivityTypes, fetchMyGroups]);

  useEffect(() => {
    if (loggedIn && activeGroupId) {
      fetchUsersActivities();
      fetchStatsActivities();
      fetchGroupInfo();
    } else if (loggedIn && !activeGroupId) {
      setGroupName('');
      setUsers([]);
      setUsersActivities([]);
      setStatsData([]);
      setGoal(0);
    }
  }, [loggedIn, activeGroupId, fetchUsersActivities, fetchStatsActivities, fetchGroupInfo]);

  if (loggedIn === null) {
    return (
      <AppContainer>
        <Loader/>
      </AppContainer>
    );
  }

  const currentUserColor = users.find(u => u.user_id === currentUser?.user_id)?.user_color ?? '000000';

  return (
    <AppContainer>
    {inviteInfo && (
      <ModalOverlay>
        <ModalCard>
          <ModalTitle>Zaproszenie do grupy</ModalTitle>
          <p>Czy chcesz dołączyć do grupy <b>{inviteInfo.name}</b>?</p>
          <ModalButtons>
            <DeclineBtn onClick={clearInvite}>Odrzuć</DeclineBtn>
            <AcceptBtn onClick={acceptInvite}>Dołącz</AcceptBtn>
          </ModalButtons>
        </ModalCard>
      </ModalOverlay>
    )}
    {loggedIn ?(
      <>
        <Menu site={site} setActiveAddPopup={setActiveAddPopup} setSite={setSite}/>
        <StyledWrapper>
          <HeaderWrapper>  
            <StyledHeader>
              {site==='grupa' ? (
              <>Raport grupy:
                {groups.length > 1 ? (
                  <GroupSelect value={activeGroupId ?? ''} onChange={e => setActiveGroupId(Number(e.target.value))}>
                    {groups.map(g => <option key={g.group_id} value={g.group_id}>{g.name}</option>)}
                  </GroupSelect>
                ) : (
                  <GroupName>{groupName}</GroupName>
                )}
              </>
            ) : site==='moje' ? 
            <PeriodSelector activePeriod={activePeriod} setActivePeriod={(e)=> setActivePeriod(e)}/> : 
            "Profil"}</StyledHeader>
            {site==='userSettings' ?
            <LogoutButton onClick={logout}>Wyloguj się</LogoutButton>
            :
            (
            <div id="buttons">
              <AddActivityPopup groups={groups} activityTypes={activityTypes} setActiveAddPopup={setActiveAddPopup} active={activeAddPopup} refreshStatsActivities={fetchStatsActivities} refreshUsersActivities={fetchUsersActivities} editActivity={editActivity} setEditActivity={setEditActivity} defaultDay={activePeriod === 'dzien' ? selectedDays[0] : undefined} refreshUserActivities={fetchUserActivities}/>
              <StyledSeparator/>
              <NotificationPopup setActiveNotificationPopup={setActiveNotificationPopup} active={activeNotificationPopup} host={host} onNotificationsChanged={() => { fetchUsersActivities(); fetchStatsActivities(); }} />
              <UserButton $color={currentUserColor} onClick={() => setSite("userSettings")}>
                <User />
              </UserButton>
            </div>
)}
          </HeaderWrapper>
          {site==='grupa' ?(
            <Group hasGroup={!!activeGroupId} statsData={statsData} activityTypes={activityTypes} users={users} goal={goal} goalPeriod={goalPeriod} usersActivities={usersActivities}/>
          ) : site==='moje' ? (
            <Diary activePeriod={activePeriod} activityTypes={activityTypes} users={users} userActivitiesForTheDay={userActivitiesForTheDay} refreshUsersActivities={fetchUsersActivities} fetchUserActivities={fetchUserActivities} selectedDays={selectedDays} setSelectedDays={setSelectedDays} onEditActivity={(e)=> {setEditActivity(e); setActiveAddPopup(true);}} />
          ) : (
            <UserSettings logout={logout} onSave={() => { fetchGroupInfo(); fetchCurrentUser(); }} onGroupCreated={(newId) => { fetchMyGroups().then(() => setActiveGroupId(newId)); }} onGroupsChanged={() => fetchMyGroups()} />
          )}
        </StyledWrapper>
        {site==='userSettings' && <Footer/>}
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
