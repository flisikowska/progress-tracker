import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { ResizeGridItems } from "../helpers/functions"
import {CloseOutline} from '@styled-icons/evaicons-outline/CloseOutline';
import { MinutesToFormattedTime } from '../helpers/functions';
import { ActivityIcon } from '../helpers/activityIcons';


const StyledActivitiesWrapper = styled.div`
  margin: 20px auto;
  padding: 0 50px;
  max-height:400px;
  overflow-y:auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, 150px); /* stala szer. = szer. kafelka */
  justify-content: center; /* centruje blok kolumn, nie pojedyncze elementy */
  align-items: start;
  gap:15px;
  @media(max-width:650px){
    gap:10px;
    padding: 0 20px;
  }
  @media(max-width:420px){
    gap:10px;
    padding: 0 10px;
    grid-template-columns: repeat(auto-fill, 130px);
  }
`;

const StyledTotal = styled.div`
  width:150px;
  min-height:105px; /* = wysokosc kafelka aktywnosci, zeby napis nie skakal gdy brak aktywnosci */
  display:flex;
  flex-direction:column;
  justify-content:center;
  font-size:1.6rem;
  font-weight:700;
  color:var(--text);
  @media(max-width:450px){
    font-size:1.1rem;
  }
  >p{
    font-size:1rem;
      font-weight:500;

  }
`;


const StyledActivity=styled.div`
  width:150px;
  border:2px solid var(--primary-dark);
  border-radius:12px;
  padding:8px 10px;
  text-align:center;
  cursor:default;
  >svg{
    color: var(--text-inactive);
    margin:15px;
  }
  @media(max-width:420px){
    width:130px;
  }
`;

const ActivityTitle= styled.h1`
    padding:0;
    pointer-events:none;
    font-weight:600;
    font-size:0.95rem;
    margin: 0 auto;
    text-align:center;
    @media(max-width:450px){
        font-size:0.8rem;
    }
`;

const StyledHeader=styled.div`
>p{
  pointer-events:none;
}
display:flex;
flex-flow:row nowrap;
align-items:center;
justify-content:space-between;
  >p{
    font-size:0.8rem;
    padding:0;
    color:var(--text-inactive);
  }
  >svg{
    color:var(--text-inactive);
    width:20px;
    height:20px;
    cursor:pointer;
  }
`

const StyledIcon=styled(ActivityIcon)`
  width:35px;
  height:35px;
  margin:5px 0;
  color: var(--icon);
`;

const StyledDate=styled.div`
  font-size:0.75rem;
  margin-top:8px;
  color:var(--text-inactive);
  text-align:center;
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

const ConfirmBtn = styled.button`
  padding: 9px 22px;
  border-radius: 20px;
  background: var(--red);
  border: 2px solid var(--red);
  color: var(--white);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: var(--red-dark); border-color: var(--red-dark); }
`;

const CancelBtn = styled.button`
  padding: 9px 22px;
  border-radius: 20px;
  background: transparent;
  border: 2px solid var(--primary-dark);
  color: var(--text);
  font-size: 1rem;
  cursor: pointer;
  &:hover { background: var(--primary-dark); color: var(--white); }
`;

function UserActivities({activityTypes, deleteActivity, activities, showDate=false, hideTotal=false, onEditActivity}){
    useEffect(() => {
        ResizeGridItems("activities")
      })
    const [confirmId, setConfirmId] = useState(null); // id aktywnosci do usuniecia
    const total = activities.reduce((sum, activity) => sum + activity.time, 0);
    return(
      <>
      <StyledActivitiesWrapper className='scrollable activities'>
        {!hideTotal && <StyledTotal><p>Łącznie</p>{MinutesToFormattedTime(total)}</StyledTotal>}
        {activities &&
          activities.map(
            (
              {
                activity_id,
                activity_type_id,
                time,
                activity_date,
                group_ids
              }, key
            ) => (
              <StyledActivity key={key}  className='grid-item' style={{ cursor: (activity_id != null && onEditActivity) ? 'pointer' : 'default'}} onClick={()=> activity_id != null && onEditActivity?.(
                { activity_id, activity_type_id, time, activity_date, group_ids }
              )}>
                <StyledHeader><p>{MinutesToFormattedTime(time)}</p>{activity_id != null && <CloseOutline onClick={(e)=> { e.stopPropagation(); setConfirmId(activity_id);}}/>}</StyledHeader>
                <StyledIcon name={activityTypes.find(a=> a.id===activity_type_id)?.icon} />
                <ActivityTitle>{activityTypes.find(a=> a.id===activity_type_id).name}</ActivityTitle>
                {showDate && activity_date &&
                  <StyledDate>{activity_date.slice(0,10).split('-').reverse().slice(0,2).join('.')}</StyledDate>}
              </StyledActivity>
            ),
          )}
      </StyledActivitiesWrapper>

      {confirmId !== null && (
        <ModalOverlay onClick={() => setConfirmId(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Usunąć aktywność?</ModalTitle>
            <p>Tej operacji nie można cofnąć.</p>
            <ModalButtons>
              <CancelBtn onClick={() => setConfirmId(null)}>Anuluj</CancelBtn>
              <ConfirmBtn onClick={() => { deleteActivity(confirmId); setConfirmId(null); }}>Usuń</ConfirmBtn>
            </ModalButtons>
          </ModalCard>
        </ModalOverlay>
      )}
      </>
    );
};

export default UserActivities;
