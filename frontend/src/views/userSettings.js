import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

function UserSettings({ onSave, logout }) {
  const host = 'localhost';
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get(`http://${host}:5000/user`, { withCredentials: true })
      .then(res => {
        setName(res.data[0].name);
        setColor(res.data[0].color);
      });
  }, []);

  const handleSave = () => {
    axios.put(`http://${host}:5000/user`, { name, color }, { withCredentials: true })
      .then(() => {
        setSaved(true);
        if (onSave) onSave();
        setTimeout(() => setSaved(false), 2000);
      });
  };

  return (
    <StyledContainer>
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
    </StyledContainer>
  );
}

export default UserSettings;
