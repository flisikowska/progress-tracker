import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from '@styled-icons/fa-solid/Link';
import { Check } from '@styled-icons/fa-solid/Check';

const COLORS = [
  'F5B1C7', 'F4A0A0', 'F5C97B', 'A8D8A8',
  '7DCEF5', 'B8BDE1', '40C4FF', '9B8EC4',
  '40B7B0', 'F4A261', 'D4A5A5', 'C5E0B4',
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
  gap: 10px;
  margin-bottom: 28px;
`;

const ColorDot = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid ${p => p.$selected ? '#fff' : 'transparent'};
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

const SuccessMsg = styled.span`
  margin-left: 14px;
  color: var(--blue);
  font-size: 0.9rem;
`;

const ErrorMsg = styled.span`
  margin-left: 14px;
  color: var(--primary-dark);
  font-size: 0.9rem;
`;

const Separator = styled.hr`
  border: none;
  border-top: 1px solid var(--primary-dark);
  margin: 32px 0 24px 0;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin-bottom: 8px;
`;

const GroupItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  background-color: var(--primary);
  border-radius: 25px;
`;

const GroupActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ShareButton = styled.button`
  padding: 6px 16px;
  border-radius: 16px;
  background: transparent;
  border: 2px solid var(--blue);
  color: var(--blue);
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: var(--blue); color: var(--white); }
`;

const GroupItemName = styled.span`
  color: var(--text);
  font-size: 0.95rem;
  font-weight:500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LeaveButton = styled.button`
  padding: 6px 16px;
  border-radius: 16px;
  background: transparent;
  border: 2px solid var(--red);
  color: var(--red);
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: var(--red); color: var(--white); }
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
  // TODO: Control from env
  // const host = 'localhost:5000';
  const host = 'https://trenujemy.flisikowska.com';

  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [saved, setSaved] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [groupGoal, setGroupGoal] = useState('');
  const [groupPeriod, setGroupPeriod] = useState('week');
  const [groupError, setGroupError] = useState('');
  const [myGroups, setMyGroups] = useState([]);
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

  const fetchMyGroups = () => {
    axios.get(`${host}/my-groups`, { withCredentials: true })
      .then(res => setMyGroups(res.data));
  };

  useEffect(() => {
    axios.get(`${host}/user`, { withCredentials: true })
      .then(res => {
        setName(res.data[0].name);
        setColor(res.data[0].color);
      });
    fetchMyGroups();
  }, []);

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

  const handleSave = () => {
    axios.put(`${host}/user`, { name, color }, { withCredentials: true })
      .then(() => {
        setSaved(true);
        if (onSave) onSave();
        setTimeout(() => setSaved(false), 2000);
      });
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
      <Label>Nick</Label>
      <Input
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={30}
      />
      <Label>Kolor</Label>
      <ColorGrid>
        {COLORS.map(c => (
          <ColorDot
            key={c}
            style={{ backgroundColor: '#' + c }}
            $selected={color.toUpperCase() === c.toUpperCase()}
            onClick={() => setColor(c)}
          />
        ))}
      </ColorGrid>
      <SaveButton onClick={handleSave}>Zapisz</SaveButton>
      {saved && <SuccessMsg>Zapisano!</SuccessMsg>}

      <Separator />
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
              <GroupItemName>{g.name}</GroupItemName>
              <GroupActions>
                <ShareButton onClick={() => openInviteModal(g)}>Zaproś</ShareButton>
                <LeaveButton onClick={() => setGroupToLeave(g)}>Opuść</LeaveButton>
              </GroupActions>
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
