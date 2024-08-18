import React, { useState } from 'react';
import styled from 'styled-components';
import PieChart from '../components/pieChart';
import StackedAreaChart from '../components/stackedAreaChart';
import * as d3 from 'd3';
import usePieChart from '../helpers/usePieChart';
import { data_V1 } from '../helpers/data_v1';
const StyledContainer = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
`;

const StyledStatsTitle = styled.h2`
    font-size: 1.4rem;
    margin-top: 40px;
    text-align: left;
`;

function Grupa() {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const areaChartWidth=600;
    const areaChartHeight=400;

    const changeRef = usePieChart(
        // dane, które przekazujesz do usePieChart
        data_V1, 
        setSelectedComponent, 
        selectedComponent
    );

    return (
        <StyledContainer>
            <PieChart
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                changeRef={changeRef} // Przekazanie ref do PieChart
            />
            <StyledStatsTitle>Statystyki:</StyledStatsTitle>
            <StackedAreaChart
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                changeRef={changeRef}  // Przekazanie ref do StackedAreaChart
                width={areaChartWidth}
                height={areaChartHeight}
            />
        </StyledContainer>
    );
}

export default Grupa;