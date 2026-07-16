import { Notifications } from '@styled-icons/material-outlined/Notifications';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { MinutesToFormattedTime } from '../helpers/functions';

const StyledContainer = styled.div`
  width:35px;
  height:35px;
  background: var(--primary);
  border-radius:30px;
  display:flex;
  justify-content:center;
  align-items:center;
  position:relative;
  >svg{
    width:20px;
    height:20px;
    padding:0;
    margin:0;
    color:var(--text);
  }
`;

const Badge = styled.span`
  position:absolute;
  top:-4px;
  right:-4px;
  min-width:16px;
  height:16px;
  padding:0 4px;
  border-radius:8px;
  background:var(--red);
  color:#fff;
  font-size:0.7rem;
  font-weight:bold;
  display:flex;
  align-items:center;
  justify-content:center;
`;

const StyledWrapper = styled.div`
  z-index:10;
  overflow-y:scroll;
  display: ${(props) => (props.$active ? 'block' : 'none')};
  position:absolute;
  text-align:left;
  padding:15px;
  margin-top:10px;
  right:30px;
  top:20px;
  width:400px;
  height:450px;
  background-color:rgb(255,255,255);
  border-radius:12px;
  box-shadow:5px 5px 8px #ddd;
  @media(max-width:570px){
    width:70vw;
    height:60vh;
  }
`;

const Header = styled.div`
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:8px;
  margin-bottom:10px;
`;

const HeaderActions = styled.div`
  display:flex;
  gap:14px;
  flex-shrink:0;
  button{
    padding:0;
    font-size:0.8rem;
    border:none;
    background:none;
    color:var(--blue);
    font-weight:600;
    cursor:pointer;
    &:hover{ text-decoration:underline; }
    &:disabled{ opacity:0.4; cursor:default; text-decoration:none; }
  }
  *:nth-child(2){
    color:var(--red);
  }
`;

const Item = styled.div`
  cursor:default;
  background-color: ${(props) => (props.$unread ? 'var(--pale-blue, #eaf2ff)' : '#fff')};
  padding:5px 15px;
  border-radius:5px;
  border:2px solid ${(props) => (props.$unread ? 'var(--blue, #9cc0ff)' : '#ddd')};
  margin:10px 0;
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
    #info{ font-size:0.7rem; }
    #time{ font-size:0.6rem; }
  }
`;

const Empty = styled.p`
  text-align:center;
  color:var(--text-inactive);
  margin-top:60px;
`;
// "05.07 10:30"
const formatTime = (iso) => {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}.${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const NotificationPopup = ({ active, setActiveNotificationPopup, host, onNotificationsChanged = () => {} }) => {
  const [notifications, setNotifications] = useState([]);
  const activePopupRef = useRef(active);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // zawsze wolaj najnowszy callback (unikamy stale closure przy zmianie propa)
  const onChangeRef = useRef(onNotificationsChanged);
  useEffect(() => { onChangeRef.current = onNotificationsChanged; }, [onNotificationsChanged]);
  // najwyzsze widziane id - by wykryc NOWA notyfikacje (nowa aktywnosc czlonka grupy)
  const lastMaxIdRef = useRef(null);

  // jedna wspólna lista ze wszystkich grup
  const fetchNotifications = useCallback(() => {
    axios.get(`${host}/notifications`, { withCredentials: true })
      .then((res) => {
        setNotifications(res.data);
        const maxId = res.data.reduce((m, n) => Math.max(m, n.notification_id), 0);
        // pojawilo sie nowe id (poza pierwszym pobraniem) -> ktos dodal aktywnosc, odswiezamy pie/statystyki
        if (lastMaxIdRef.current !== null && maxId > lastMaxIdRef.current) {
          onChangeRef.current();
        }
        lastMaxIdRef.current = maxId;
      })
      .catch(() => {});
  }, [host]);

  // pobierz od razu + odświeżaj co 30s (nowe wpisy od innych członków)
  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  const markAllRead = () => {
    axios.post(`${host}/notifications/mark-read`, {}, { withCredentials: true })
      .then(() => setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true }))));
  };

  const deleteAll = () => {
    axios.delete(`${host}/notifications`, { withCredentials: true })
      .then(() => setNotifications([]));
  };

  // zamykanie po kliknięciu poza popupem (jak było wcześniej)
  useEffect(() => {
    const handler = (event) => {
      if (!activePopupRef.current) return;
      const popup = document.getElementById('popup');
      if (event.target !== popup) {
        let parent = event.target.parentNode;
        while (parent !== null) {
          if (parent === popup) return;
          parent = parent.parentNode;
        }
        setTimeout(() => setActiveNotificationPopup(false), 1);
      }
    };
    window.addEventListener('mouseup', handler);
    return () => window.removeEventListener('mouseup', handler);
    // eslint-disable-next-line
  }, []);

  useEffect(() => { activePopupRef.current = active; }, [active]);

  return (
    <StyledContainer onClick={() => setActiveNotificationPopup(!active)}>
      <Notifications />
      {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
      <StyledWrapper className='scrollable' id='popup' $active={active} onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderActions>
            <button onClick={markAllRead} disabled={unreadCount === 0}>Odczytaj wszystkie</button>
            <button onClick={deleteAll} disabled={notifications.length === 0}>Wyczyść</button>
          </HeaderActions>
        </Header>
        {notifications.length === 0 ? (
          <Empty>Brak powiadomień</Empty>
        ) : (
          notifications.map((n) => (
            <Item key={n.notification_id} $unread={!n.is_read}>
              <p id='time'>{formatTime(n.created_at)}</p>
              <p id='info'>
              {n.type === 'edit'
                ? <>{n.actor_name} zmienił/a aktywność w grupie {n.group_name} na "{n.activity_type_name}-{MinutesToFormattedTime(n.amount)}"</>
                : <>{n.actor_name} dodał/a "{n.activity_type_name}-{MinutesToFormattedTime(n.amount)}" w grupie {n.group_name}</>}
              </p>
            </Item>
          ))
        )}
      </StyledWrapper>
    </StyledContainer>
  );
};

export default NotificationPopup;
