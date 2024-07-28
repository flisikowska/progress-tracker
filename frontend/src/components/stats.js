import React from 'react';
import styled from 'styled-components';

const StyledWrapper=styled.div`
    padding:20px;
    width:60%;
    margin:auto;
    display:flex;
    flex-flow:row nowrap;
    align-items:end;
    @media(max-width:570px){
        width:100%;
    }
`

const StatContainer= styled.div`
    width:50px;
    text-align:center;
`;

const StyledBar= styled.div`
    display:flex;
    flex-flow: column;
    justify-content:space-between;
    height:315px;
    font-weight:600;
    margin-bottom:25px;
`;

const StatBar=styled.div`
    border: 2px solid hsl(${(props) => props.hue}, 100%, 40%);
    background-color:hsla(${(props) => props.hue}, 100%, 40%, 0.07);

    border-radius:10px 10px 0 0;
    margin:10px;
    width:30px;
    height:${(props) => props.statHeight}px;
    display:flex;
    justify-content:space-between;
    flex-wrap:nowrap;
`

const StyledDate=styled.p`
    font-size:0.9rem;
    font-weight:600;
    margin:auto;
    padding:0;
`


function Stats(){
    const percentage=30;
    const hue= 120*(percentage/100);
    const hue2= 120*(100/100);
    const hue3= 120*(0/100);
    return(
        <StyledWrapper>
            <StyledBar>
                <p>5h</p>
                <p>4h</p>
                <p>3h</p>
                <p>2h</p>
                <p>1h</p>
                <p>0h</p>
            </StyledBar>
            <StatContainer>
                <StatBar hue={hue} statHeight={percentage*3}/>
                <StyledDate>I/10</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={hue2} statHeight={100*3}/>
                <StyledDate>II/10</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={hue3} statHeight={0*3}/>
                <StyledDate>III/10</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(54/100)} statHeight={54*3}/>
                <StyledDate>IV/10</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(100/100)} statHeight={100*3}/>
                <StyledDate>I/11</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(100/100)} statHeight={100*3}/>
                <StyledDate>II/11</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(6/100)} statHeight={6*3}/>
                <StyledDate>III/11</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(100/100)} statHeight={100*3}/>
                <StyledDate>IV/11</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(75/100)} statHeight={75*3}/>
                <StyledDate>I/12</StyledDate>
            </StatContainer>
        </StyledWrapper>
    );
};

export default Stats;



