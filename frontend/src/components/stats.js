import React from 'react';
import styled from 'styled-components';

const StyledWrapper=styled.div`
    padding:20px;
    width:60%;
    margin:auto;
    display:flex;
    flex-flow:row nowrap;
    align-items:end;
    justify-content:center;
    @media(max-width:600px){
        width:100%;
        margin:20px 0;
        padding:0;
    }
`;

const StyledBar= styled.div`
    display:flex;
    flex-flow: column;
    justify-content:space-between;
    height:315px;
    font-weight:600;
    margin-bottom:38px;
    font-size:1rem;
    @media(max-width:600px){
        font-size:0.7rem;
    }

`;

const StatContainer= styled.div`
    text-align:center;
     @media(max-width:600px){
        >div{
            height:${(props) => props.statHeight}px/2;
            width:13px;
            border-radius:5px 5px 0 0;

        }
        >p{
            font-size:0.6rem;
        }
    }
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
    font-size:0.8rem;
    font-weight:600;
    margin:auto;
    padding:0;
    cursor:default;

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
                <StyledDate>24<br/>tydz.</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={hue2} statHeight={100*3}/>
                <StyledDate>25<br/>tydz.</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={hue3} statHeight={0*3}/>
                <StyledDate>26<br/>tydz.</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(54/100)} statHeight={54*3}/>
                <StyledDate>27<br/>tydz.</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(100/100)} statHeight={100*3}/>
                <StyledDate>28<br/>tydz.</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(100/100)} statHeight={100*3}/>
                <StyledDate>29<br/>tydz.</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(6/100)} statHeight={6*3}/>
                <StyledDate>30<br/>tydz.</StyledDate>
            </StatContainer>
            <StatContainer>
                <StatBar hue={120*(40/100)} statHeight={40*3}/>
                <StyledDate>31<br/>tydz.</StyledDate>
            </StatContainer>
        </StyledWrapper>
    );
};

export default Stats;



