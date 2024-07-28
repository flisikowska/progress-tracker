import React from 'react';
import styled from 'styled-components';
import ProgressSemiCircle from '../components/progressSemiCircle';
import Stats from '../components/stats';

const StyledContainer=styled.div`
    width:100%;
    height:100%;
`;

const StyledActivityTitle= styled.h2`
    font-size:1.2rem;
    margin-top:40px;
`;


function Grupa(){
    return(
        <StyledContainer>
            <ProgressSemiCircle/>
            <StyledActivityTitle>Statystyki:</StyledActivityTitle>
            <Stats/>
        </StyledContainer>
    )
};

export default Grupa;