import React, {useRef, useEffect, useState} from 'react';
import styled, {css} from 'styled-components';
import TimePicker from './timePicker';
import { FormattedDate } from '../helpers/functions';
import DayPicker from '../components/dayPicker';
import {CloseOutline} from '@styled-icons/evaicons-outline/CloseOutline';
import { Plus } from '@styled-icons/fa-solid/Plus';
import { ActivityIcon } from '../helpers/activityIcons';
import axios from 'axios';

const host = process.env.REACT_APP_API_HOST;

const StyledButton= styled.div`
    z-index:10;
    padding:7px 10px;
    font-size:0.9rem;
    font-weight:600;
    cursor:pointer;
    background-color: var(--blue);
    border-radius:20px;
    color:var(--white);
    display:flex;
    align-items:center;
    gap:6px;
    >svg{
        width:12px;
        height:12px;
    }
    @media(max-width:570px){
        display:none;
    }
`;

const Overlay=styled.div`
    display: ${(props) => (props.$active ? 'block' : 'none')};
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.5);
    z-index:9;
`;

const StyledWrapper=styled.div`
    display: ${(props) => (props.$active ? 'flex' : 'none')};
    position:fixed;
    flex-flow:column nowrap;
    padding:25px;
    text-align:center;
    align-items:center;
    left:50%;
    top:50%;
    transform:translate(-50%, -50%);
    transition:0.4s;
    width:910px;
    height:90%;
    background-color:rgba(255,255,255);
    border-radius:12px;
    z-index: 10;
    overflow-y:auto;
    > * {
        flex-shrink: 0;
    }
    @media(max-width:1000px){
        width:90%;
    }
    @media(max-width:570px){
        width:100%;
        height:100%;
        display: block;
        transform: translate(0, ${(props) => (props.$active ? '0' : '120%')});
        top:0;
        left:0;
        border-radius:0px;  
    }
    >svg{
        position:absolute;
        top:0;
        right:0;
        width:30px;
        height:30px;
        color:var(--text);
        margin:20px;
        cursor:pointer;
    }
    #timePicker{
        height:125px;
        margin:20px 0;
    }
    `;

const ActivitiesWrapper= styled.div`
    height: 150px;
    width:550px;
    @media(max-width:1000px){
        width:80%;
    }
    overflow-y: auto;
    display: grid;
    margin:20px auto;
    grid-template-columns: repeat(4, 1fr);
    gap: 0px;
    align-content:start;
    @media(max-width:700px){
        grid-template-columns: repeat(3, 1fr);
    }
    @media(max-width:520px){
        grid-template-columns: repeat(2, 1fr);
        height: 400px;
        >div{
            width:90%;
            margin:8px auto;
        }
    }
`;

const StyledActivity= styled.div`
    padding:10px;
    margin:6px;
    width:110px;
    cursor:pointer;
    text-align:center;
    height:80px;
    border-radius:12px;
    border: 1px solid var(--primary);
    ${(props) =>
    props.$chosen &&
    css`
        border: 2px solid var(--pale-blue);
        box-shadow: 0 0 4px var(--pale-blue);
    `};
    >p{
        font-weight:600;
        font-size:0.65rem;
        margin-top:8px;
        @media(max-width:450px){
            font-size:0.7rem;
        }
    }
`;

const StyledHeader= styled.div`
    font-size:1rem;
    color:var(--text);
    font-weight:500;
    width:550px;
    max-width:100%;
    margin: 5px auto;
    text-align:left;
    @media(max-width:1000px){
        width:80%;
    }
`;

const SearchInput= styled.input`
    width:550px;
    max-width:100%;
    margin: 8px auto 0 auto;
    padding:8px 14px;
    border-radius:12px;
    border:1px solid var(--primary-dark);
    color:var(--text);
    font-size:0.9rem;
    outline:none;
    &:focus{ border-color: var(--blue); }
    @media(max-width:1000px){
        width:80%;
    }
`;

const StyledActivityIcon= styled(ActivityIcon)`
    width:32px;
    height:32px;
    color: var(--icon);
`;

const NoResults= styled.p`
    grid-column: 1 / -1;
    color: var(--text-inactive);
    font-size:0.9rem;
    text-align:center;
    margin:20px 0;
`;

const ChooseButton= styled.div`
    padding:10px 0;
    cursor:pointer;
    text-align:center;
    border-radius:20px;
    border:2px solid var(--primary);
    font-weight:600;
    font-size:1rem;
    transition:0.2s;
    width:300px;
    margin:20px auto 0 auto;
    background-color: var(--blue);
    color:var(--white);
    &:hover{
        background-color:var(--blue);
        border:2px solid var(--blue);
    }
`;

const ErrorMsg= styled.p`
    color:#d9534f;
    font-size:0.85rem;
    font-weight:600;
    text-align:center;
    margin:12px auto 0 auto;
    min-height:1rem;
`;

const GroupChecks= styled.div`
    width:550px;
    max-width:100%;
    margin:8px auto 0 auto;
    display:flex;
    flex-flow:row wrap;
    justify-content:flex-start;
    gap:10px;
    @media(max-width:1000px){
        width:80%;
    }
`;

const GroupCheck= styled.label`
    display:inline-flex;
    align-items:center;
    gap:6px;
    padding:6px;
    font-size:0.85rem;
    color:var(--text);
    cursor:pointer;
    user-select:none;
    > input{
        accent-color: var(--blue);
        cursor:pointer;
    }
`;


const AddActivityPopup=({groups = [], activityTypes, setActiveAddPopup, active, refreshStatsActivities, refreshUsersActivities, refreshUserActivities})=>{
    const [chosenItem, setChosenItem] = useState(null);
    const activePopupRef = useRef(active);
    const [selectedDay, setSelectedDay] = useState(FormattedDate(new Date()));
    const [amount, setAmount]= useState(0);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [pickerKey, setPickerKey] = useState(0);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (active && wrapperRef.current) {
            requestAnimationFrame(() => {
                if (wrapperRef.current) wrapperRef.current.scrollTop = 0;
            });
        }
    }, [active]);

    // przy każdym otwarciu popupu zaznacz wszystkie grupy
    useEffect(() => {
        if (active) setSelectedGroups(groups.map(g => g.group_id));
    }, [active, groups]);

    const toggleGroup = (id) => {
        setSelectedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    };

    const filteredActivities = activityTypes.filter(a =>
        a.name.toLowerCase().includes(search.trim().toLowerCase())
    );

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


    const handleAdd=()=>{
        if (!chosenItem) {
            setError('Wybierz aktywność');
            return;
        }
        if (!amount || amount <= 0) {
            setError('Podaj czas większy niż 0');
            return;
        }
        setError('');
        addActivity(chosenItem, selectedDay, amount);
    }

    const addActivity=(activity_type_id, date, amount)=>{
        axios.post(`${host}/activities`, {activity_type_id: activity_type_id, date: date, amount: amount, group_ids: selectedGroups}, { withCredentials: true })
        .then(res => {
           refreshUsersActivities();
           refreshUserActivities();
           setActiveAddPopup(false);
           refreshStatsActivities();
           setChosenItem(null);
           setAmount(0);
           setSearch('');
           setError('');
           setPickerKey(k => k + 1);
        });
      }

    return (
        <>
            <StyledButton onClick={()=> setActiveAddPopup(!active) }><Plus/>Dodaj aktywność</StyledButton>
            <Overlay $active={active} onClick={()=>setActiveAddPopup(false)}/>
            <StyledWrapper ref={wrapperRef} id='addPopup' $active={active}>
                <CloseOutline onClick={()=>setActiveAddPopup(false)}/>
                <StyledHeader>Aktywność</StyledHeader>
                <SearchInput
                    placeholder="Szukaj aktywności..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <ActivitiesWrapper>
                {filteredActivities.map((activity) => (
                    <StyledActivity
                        key={activity.id}
                        $chosen={chosenItem === activity.id}
                        onClick={() => { setChosenItem(activity.id); setError(''); }}
                    >
                        <StyledActivityIcon name={activity.icon} />
                        <p>{activity.name}</p>
                    </StyledActivity>
                ))}
                {filteredActivities.length === 0 && <NoResults>Brak pasujących aktywności</NoResults>}
                </ActivitiesWrapper>
                <StyledHeader>Ile czasu spędziłeś?</StyledHeader>
                <TimePicker
                        key={pickerKey}
                        id='timePicker'
                        name="activityTime"
                        onChange={(e) => {const a = parseInt(e.hours)*60+parseInt(e.minutes); setAmount(a); if (a > 0) setError('');}}
                        value={{hours:0,minutes:0}}
                        />
                        <StyledHeader>Kiedy?</StyledHeader>
                        <DayPicker
                            fetchSelectedDaysToParent={(selectedDays) => {
                                if (selectedDays.length === 1) setSelectedDay(selectedDays[0]);
                            }}
                            multipleDaySelect={false}
                            daysCount={7}
        />
                {groups.length > 1 && (
                    <>
                        <StyledHeader>Widoczne w grupach</StyledHeader>
                        <GroupChecks>
                            {groups.map(g => (
                                <GroupCheck key={g.group_id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedGroups.includes(g.group_id)}
                                        onChange={() => toggleGroup(g.group_id)}
                                    />
                                    {g.name}
                                </GroupCheck>
                            ))}
                        </GroupChecks>
                    </>
                )}
                {error && <ErrorMsg>{error}</ErrorMsg>}
                <ChooseButton onClick={handleAdd}>Dodaj aktywność</ChooseButton>
            </StyledWrapper>
        </>

    )
};

export default AddActivityPopup;
