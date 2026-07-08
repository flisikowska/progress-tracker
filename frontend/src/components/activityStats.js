import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 70px;
  margin: 40px auto;
  @media (max-width: 450px) {
    gap: 36px;
  }
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  > svg {
    width: 32px;
    height: 32px;
    color: var(--blue);
    flex-shrink: 0;
    @media (max-width: 450px) {
      width: 26px;
      height: 26px;
    }
  }
`;

const StatText = styled.div`
  > h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text);
    @media (max-width: 450px) {
      font-size: 1.3rem;
    }
  }
  > p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-inactive);
    @media (max-width: 450px) {
      font-size: 0.75rem;
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
