import styled, {css} from 'styled-components'
import React from 'react'

const StyledContainer= styled.div`
    display:flex;
    flex-flow:row nowrap;
    align-items:center;
    background-color:var(--primary);
    padding:1px;
    border-radius:20px;
`

const StyledItem=styled.div`
    font-size:.95rem;
    font-weight:400;
    color: var(--text);
    padding:5px 12px;
    margin:0 2px;
    cursor:pointer;
    ${(props)=> props.$active &&
        css`
            font-weight:500;
            background-color:var(--blue);
            border:2px solid var(--primary);
            border-radius: 20px;
                color: var(--white);

        `
    }
`

const PeriodSelector=({activePeriod, setActivePeriod})=>{
    return (
        <StyledContainer>
            <StyledItem $active={activePeriod==='dzien'} onClick={()=> setActivePeriod('dzien')}>Dzień</StyledItem>
            <StyledItem $active={activePeriod==='miesiac'} onClick={()=> setActivePeriod('miesiac')}>Miesiąc</StyledItem>
            <StyledItem $active={activePeriod==='rok'} onClick={()=> setActivePeriod('rok')}>Rok</StyledItem>
        </StyledContainer>
    )
}

export default PeriodSelector;