import React from 'react';
import styled from 'styled-components';
import girl from '../assets/girl2.png';

const StyledContainer= styled.div`
  width:100%;
  height:100%;
  margin:0;
  display:flex;
  flex-flow:row nowrap;
  cursor:default;
  align-items:start;
  justify-content:left;
`

const Right=styled.div`
    margin-top:100px;
`;

const StyledHeader=styled.h1`
    font-size:1.5rem;
    margin-top:10px;
    font-weight:400;
`

const StyledGirl=styled.div`
  width:600px;
  height:450px;
  background: URL(${girl});
  background-size:contain;
  background-repeat:no-repeat;
`;

const StyledLoginContainer=styled.div`
  display:flex;
  flex-flow: row nowrap;
  margin-top:20px;
  >div{
    color:#000;
    font-weight:500;
    font-size:1rem;
    cursor:pointer;
    padding:7px 10px 7px 0;
    &:hover{
      color:#555;
    }
  }
    >div:nth-of-type(2){
      border:2px solid #999;
      border-radius: 4px;
      padding:7px 10px;

  }
  @media(max-width:770px){
    >div{
      font-size:0.8rem;
    }
  }
`;


function Invite() {
  return (
    <StyledContainer>
        <StyledGirl/>
        <Right>
          <StyledHeader>Wyślij zaproszenia znajomym</StyledHeader>
          <StyledLoginContainer>
          </StyledLoginContainer>
      </Right>
      </StyledContainer>
  )
};

export default Invite;

