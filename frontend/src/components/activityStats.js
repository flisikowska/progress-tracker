import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 70px;
  margin: 40px auto;
  @media (max-width: 725px) {
    flex-wrap: nowrap;
    gap: 16px;
  }
  @media (max-width: 450px) {
    gap: 8px;
    margin: 28px auto;
  }
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  @media (max-width: 725px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
  }
  @media (max-width: 450px) {
    gap: 4px;
  }
  > svg {
    width: 32px;
    height: 32px;
    color: var(--blue);
    flex-shrink: 0;
    @media (max-width: 450px) {
      width: 20px;
      height: 20px;
    }
  }
`;

const StatText = styled.div`
  > h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text);
    @media (max-width: 450px) {
      font-size: 1.05rem;
    }
  }
  > p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-inactive);
    @media (max-width: 450px) {
      font-size: 0.7rem;
    }
  }
`;

const ActivityStats = ({ stats = [] }) => (
  <Wrapper>
    {stats.map((s, i) => {
      const Icon = s.icon;
      return (
        <Stat key={i}>
          {Icon && <Icon />}
          <StatText>
            <h2>{s.value}</h2>
            <p>{s.label}</p>
          </StatText>
        </Stat>
      );
    })}
  </Wrapper>
);

export default ActivityStats;
