import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from '@styled-icons/fa-solid/Link';
import { Check } from '@styled-icons/fa-solid/Check';

const host = process.env.REACT_APP_API_HOST;

const COLORS = [
  'F5B1C7', 'F4A0A0', 'F5C97B', 'A8D8A8',
  '7DCEF5', 'B8BDE1', '40C4FF', '9B8EC4',
  '40B7B0', 'F4A261', 'D4A5A5', 'C5E0B4',
  'C39BD3', 'F5E07B', '85C1E9', 'F1948A',
];

const StyledContainer = styled.div`
  width: 100%;
  padding: 20px 0;
`;

const Label = styled.p`
  font-size: 0.85rem;
  color: var(--text);
  margin: 0 0 8px 0;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  max-width:250px;
  padding: 10px 12px;
  border-radius: 20px;
  border: 1px solid var(--primary-dark);
  color: var(--text);
  font-size: 1rem;
  outline: none;
  margin-bottom: 24px;
  &:focus { border-color: var(--blue); }
`;

const ColorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ColorDot = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid ${p => p.$selected ? '#fff' : 'transparent'};
  outline: ${p => p.$selected ? '2px solid var(--blue)' : 'none'};
  transition: 0.15s;
  &:hover { transform: scale(1.15); }
`;

const SaveButton = styled.button`
  padding: 10px 24px;
  border-radius: 20px;
  background: var(--pale-blue);
  border:2px solid var(--blue);
  color: var(--white);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: var(--blue); }
`;

const ErrorMsg = styled.span`
  margin-left: 14px;
  color: var(--primary-dark);
  font-size: 0.9rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  color: var(--text);
  margin: 0 0 16px 0;
`;

const Select = styled.select`
  display: block;
  width: 100%;
  max-width: 250px;
  padding: 10px 12px;
  border-radius: 20px;
  border: 1px solid var(--primary-dark);
  color: var(--text);
  background: transparent;
  font-size: 1rem;
  outline: none;
  margin: 0 auto 24px;
  cursor: pointer;
  &:focus { border-color: var(--blue); }
`;

const LinkDisplay = styled.div`
  margin: 14px auto 4px;
  max-width: 280px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid var(--primary-dark);
  color: var(--text);
  font-size: 0.85rem;
  word-break: break-all;
  cursor: pointer;
  user-select: all;
`;

const CopyLinkButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 20px;
  background: ${p => p.$done ? 'var(--blue)' : 'var(--pale-blue)'};
  border: 2px solid var(--blue);
  color: var(--white);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  &:hover { background: var(--blue); }
  > svg { width: 15px; height: 15px; }
`;

const GroupList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
  width: 100%;
  margin-bottom: 8px;
`;

const GroupItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 18px;
  background: var(--white);
  border: 1px solid var(--primary-dark);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const GroupItemTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const GroupActions = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 4px;
`;

const ShareButton = styled.button`
  padding: 5px 12px;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: var(--text-inactive);
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.15s;
  &:hover { color: var(--dark-blue); background: rgba(64, 196, 255, 0.12); }
`;

const GroupItemName = styled.span`
  flex: 1;
  min-width: 0;
  color: var(--text);
  font-size: 1rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NickField = styled.label`
  display: block;
`;

const NickLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--text-inactive);
  margin-bottom: 6px;
`;

const SavedHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--blue);
  > svg { width: 11px; height: 11px; }
`;

const GroupNickInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 9px 14px;
  border-radius: 12px;
  border: 1px solid var(--primary-dark);
  background: var(--color-background);
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(64, 196, 255, 0.15); }
  &::placeholder { color: var(--text-inactive); }
`;

const LeaveButton = styled.button`
  padding: 5px 12px;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: var(--text-inactive);
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.15s;
  &:hover { color: var(--red); background: rgba(229, 83, 75, 0.12); }
`;

const Muted = styled.p`
  color: var(--text-inactive);
  font-size: 0.9rem;
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

const CreateModalCard = styled.div`
  background: var(--white);
  border-radius: 12px;
  padding: 28px;
  max-width: 340px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  color: var(--text);
  text-align: center;
`;

const FormFields = styled.div`
  max-width: 250px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

const NewGroupButton = styled.button`
  padding: 8px 18px;
  border-radius: 20px;
  background: var(--pale-blue);
  border: 2px solid var(--blue);
  color: var(--white);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: var(--blue); }
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

const GOAL_PERIODS = [
  { value: 'week', label: 'Tygodniowy' },
  { value: 'month', label: 'Miesięczny' },
  { value: 'year', label: 'Roczny' },
];

function UserSettings({ onSave, onGroupCreated, onGroupsChanged, logout }) {
  const [name, setName] = useState('');

  const [groupName, setGroupName] = useState('');
  const [groupGoal, setGroupGoal] = useState('');
  const [groupPeriod, setGroupPeriod] = useState('week');
  const [groupError, setGroupError] = useState('');
  const [myGroups, setMyGroups] = useState([]);
  const [nickSavedId, setNickSavedId] = useState(null);
  const nickTimers = useRef({});
  const [groupToLeave, setGroupToLeave] = useState(null);
  const [inviteModal, setInviteModal] = useState(null);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const openCreateModal = () => {
    setGroupName('');
    setGroupGoal('');
    setGroupPeriod('week');
    setGroupError('');
    setShowCreateModal(true);
  };

  const closeCreateModal = () => setShowCreateModal(false);

  const fetchMyGroups = useCallback(() => {
    axios.get(`${host}/my-groups`, { withCredentials: true })
      .then(res => setMyGroups(res.data));
  }, []);

  useEffect(() => {
    axios.get(`${host}/user`, { withCredentials: true })
      .then(res => {
        setName(res.data[0].name);
      });
    fetchMyGroups();
  }, [fetchMyGroups]);

  const confirmLeaveGroup = () => {
    const group = groupToLeave;
    axios.delete(`${host}/my-groups/${group.group_id}`, { withCredentials: true })
      .then(() => {
        setMyGroups(prev => prev.filter(g => g.group_id !== group.group_id));
        if (onGroupsChanged) onGroupsChanged();
      })
      .finally(() => setGroupToLeave(null));
  };

  const openInviteModal = (group) => {
    axios.get(`${host}/group-invite?group_id=${group.group_id}`, { withCredentials: true })
      .then(res => {
        setInviteCopied(false);
        setInviteModal({
          name: group.name,
          link: `${window.location.origin}/?invite=${res.data.invite_token}`,
        });
      });
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteModal.link)
      .then(() => {
        setInviteCopied(true);
        setTimeout(() => setInviteCopied(false), 2000);
      })
      .catch(() => {});
  };

  const handleCreateGroup = () => {
    setGroupError('');
    const goal = Number(groupGoal);
    if (!groupName.trim() || !goal || goal <= 0) {
      setGroupError('Podaj nazwę i dodatni cel.');
      return;
    }
    axios.post(`${host}/groups`, { name: groupName.trim(), goal, goal_period: groupPeriod }, { withCredentials: true })
      .then(res => {
        fetchMyGroups();
        setShowCreateModal(false);
        setInviteCopied(false);
        setInviteModal({
          name: res.data.name,
          link: `${window.location.origin}/?invite=${res.data.invite_token}`,
        });
        if (onGroupCreated) onGroupCreated(res.data.group_id);
      })
      .catch(() => setGroupError('Nie udało się utworzyć grupy.'));
  };

  const saveGroupNickname = (group_id, nickname) => {
    axios.put(`${host}/my-groups/${group_id}/nickname`, { nickname }, { withCredentials: true })
      .then(() => {
        setMyGroups(prev => prev.map(g =>
          g.group_id === group_id ? { ...g, nickname } : g
        ));
        setNickSavedId(group_id);
        setTimeout(() => setNickSavedId(prev => (prev === group_id ? null : prev)), 2000);
        if (onGroupsChanged) onGroupsChanged();
      });
  };

  // zapis nicku po 1 s bezczynności od ostatniego wpisanego znaku
  const handleNickChange = (group_id, value) => {
    clearTimeout(nickTimers.current[group_id]);
    nickTimers.current[group_id] = setTimeout(() => {
      saveGroupNickname(group_id, value);
    }, 1000);
  };

  const saveGroupColor = (group_id, newColor) => {
    axios.put(`${host}/my-groups/${group_id}/color`, { color: newColor }, { withCredentials: true })
      .then(() => {
        setMyGroups(prev => prev.map(g =>
          g.group_id === group_id ? { ...g, color: newColor } : g
        ));
        if (onSave) onSave();
      });
  };


  return (
    <StyledContainer>
      {groupToLeave && (
        <ModalOverlay>
          <ModalCard>
            <ModalTitle>Opuścić grupę</ModalTitle>
            <p>Czy na pewno chcesz opuścić grupę <b>{groupToLeave.name}</b>?</p>
            <ModalButtons>
              <CancelBtn onClick={() => setGroupToLeave(null)}>Anuluj</CancelBtn>
              <ConfirmBtn onClick={confirmLeaveGroup}>Opuść</ConfirmBtn>
            </ModalButtons>
          </ModalCard>
        </ModalOverlay>
      )}
      <SectionHeader>
        <SectionTitle style={{ margin: 0 }}>Twoje grupy</SectionTitle>
        <NewGroupButton onClick={openCreateModal}>+ Nowa grupa</NewGroupButton>
      </SectionHeader>
      {myGroups.length === 0 ? (
        <Muted>Nie należysz do żadnej grupy.</Muted>
      ) : (
        <GroupList>
          {myGroups.map(g => (
            <GroupItem key={g.group_id}>
              <GroupItemTop>
                <GroupItemName>{g.name}</GroupItemName>
                <GroupActions>
                  <ShareButton onClick={() => openInviteModal(g)}>Zaproś</ShareButton>
                  <LeaveButton onClick={() => setGroupToLeave(g)}>Opuść</LeaveButton>
                </GroupActions>
              </GroupItemTop>
              <NickField>
                <NickLabel>
                  Twój nick
                  {nickSavedId === g.group_id && <SavedHint><Check /> Zapisano</SavedHint>}
                </NickLabel>
                <GroupNickInput
                  key={`${g.group_id}-${name}`}
                  defaultValue={g.nickname || name}
                  placeholder="Nick w tej grupie"
                  maxLength={30}
                  onChange={e => handleNickChange(g.group_id, e.target.value)}
                />
              </NickField>
              <div>
                <NickLabel>Twój kolor</NickLabel>
                <ColorGrid>
                  {COLORS.map(c => (
                    <ColorDot
                      key={c}
                      style={{ backgroundColor: '#' + c }}
                      $selected={(g.color || '000000').toUpperCase() === c.toUpperCase()}
                      onClick={() => saveGroupColor(g.group_id, c)}
                    />
                  ))}
                </ColorGrid>
              </div>
            </GroupItem>
          ))}
        </GroupList>
      )}

      {showCreateModal && (
        <ModalOverlay>
          <CreateModalCard>
            <ModalTitle>Utwórz nową grupę</ModalTitle>
            <FormFields>
              <Label>Nazwa grupy</Label>
              <Input
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                maxLength={50}
              />
              <Label>Okres celu</Label>
              <Select value={groupPeriod} onChange={e => setGroupPeriod(e.target.value)}>
                {GOAL_PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </Select>
              <Label>Cel (w minutach na okres)</Label>
              <Input
                type="number"
                min={1}
                value={groupGoal}
                onChange={e => setGroupGoal(e.target.value)}
              />
            </FormFields>
            {groupError && <ErrorMsg style={{ marginLeft: 0 }}>{groupError}</ErrorMsg>}

            <ModalButtons>
              <CancelBtn onClick={closeCreateModal}>Anuluj</CancelBtn>
              <SaveButton onClick={handleCreateGroup}>Utwórz grupę</SaveButton>
            </ModalButtons>
          </CreateModalCard>
        </ModalOverlay>
      )}

      {inviteModal && (
        <ModalOverlay>
          <ModalCard>
            <ModalTitle>Zaproś do grupy</ModalTitle>
            <p>Wyślij ten link, żeby zaprosić znajomych do <b>{inviteModal.name}</b>:</p>
            <LinkDisplay onClick={e => window.getSelection().selectAllChildren(e.currentTarget)}>
              {inviteModal.link}
            </LinkDisplay>
            <ModalButtons>
              <CancelBtn onClick={() => setInviteModal(null)}>Zamknij</CancelBtn>
              <CopyLinkButton onClick={copyInviteLink} $done={inviteCopied}>
                {inviteCopied ? <><Check /> Skopiowano!</> : <><Link /> Kopiuj link</>}
              </CopyLinkButton>
            </ModalButtons>
          </ModalCard>
        </ModalOverlay>
      )}
    </StyledContainer>
  );
}

export default UserSettings;
