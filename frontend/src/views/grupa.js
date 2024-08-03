import React, {useRef} from 'react';
import styled from 'styled-components';
import PieChart from '../components/pieChart';
import { data } from "../helpers/data";
import StackedAreaChart from '../components/stackedAreaChart';

const StyledContainer=styled.div`
    width:100%;
    height:100%;
    text-align:center;
`;

const StyledStatsTitle= styled.h2`
    font-size:1.2rem;
    margin-top:40px;
    text-align:left;
`;

function Grupa(){
    return(
        <StyledContainer >
            <PieChart/>
            <StyledStatsTitle>Statystyki:</StyledStatsTitle>
            <StackedAreaChart data={data} width={600} height={400} />
        </StyledContainer>
    )
};

export default Grupa;