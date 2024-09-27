import React, {useState, forwardRef, useImperativeHandle} from 'react';
import styled from 'styled-components';
import GroupMemberActivities from '../components/groupMemberActivities';

const StyledInfoContainer = styled.div`
    width:100%;
    height:100%;
    @media(max-width:1000px){
      width:100%;
    }
`;

const StyledInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width:100%;
    margin:0 auto auto auto;
    align-items: center;
    text-align:center;
    padding:20px 0;
    @media(max-width:767px)  {
        width: 100%; 
        min-height: 0;
        padding:10px 0;
    } 
`;

const StyledTitle = styled.div`
    pointer-events:none;
    font-weight:600;
    font-size:1.4rem;
    cursor:default;
    color:#000;
`;

const StyledInfo = styled.div`
    width: 100%;
    padding: 20px;
    @media(max-width:767px)  {
        padding:10px 0;
    } 
`;

const PieChartActivities = forwardRef(({activityTypes}, ref) => {
    const [selectedComponent, setSelectedComponent]= useState(null);
    useImperativeHandle(ref, () =>  ({
        setComponent(x) {
            setSelectedComponent(x);
        }
        })
    );

    return (
            <StyledInfoContainer>
                {selectedComponent && (
                    <StyledInfoWrapper className="info-container">
                        <StyledTitle id="segmentTitle">
                            {selectedComponent.name}
                        </StyledTitle>
                        <StyledInfo id="segmentInfo">
                            <GroupMemberActivities activityTypes={activityTypes} summary={selectedComponent.amount} activities={selectedComponent.activities} />
                        </StyledInfo>
                    </StyledInfoWrapper>
                )}
            </StyledInfoContainer>
    );
})

export default PieChartActivities;