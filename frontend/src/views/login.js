import React from 'react';
import styled from 'styled-components';
import girl from '../assets/Girl.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

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
  font-size:3rem;
  >p{
    font-size:1.5rem;
    margin-top:10px;
    font-weight:400;
  }
`

const StyledGirl=styled.div`
margin-left:auto;
  width:400px;
  aspect-ratio: 2/3;
  background: URL(${girl});
  background-size:contain;
  background-repeat:no-repeat;
`;

const GoogleLoginContainer= styled.div`
  width: fit-content;
  margin: 30px 0;
  display: flex;
  justify-content: flex-start;
`

const onFailure = (error) => {
  console.log('Login failed:', error);
};

function Login({onLogin}) {
  // TODO: Control from env
  // const host = "http://localhost:5000";
  const host = "https://trenujemy.flisikowska.com";
  const onSuccess = async (response) => {
    const { credential } = response;
    try {
      await axios.post(`${host}/google-auth`, {
        credential,
      }, {
        withCredentials: true,
      });
      onLogin();
    } catch (err){
      console.log('Login failed: ', err);
    }
  };
  return (    
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <StyledContainer>
        <StyledGirl/>
        <Right>
          <StyledHeader>Cześć!<p>Zbierz drużynę i razem osiągnijcie wymarzony cel.</p></StyledHeader>
          <GoogleLoginContainer>
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onFailure}
              theme="outline"
              shape="pill"
              size="large"
              text="continue_with"
              width="250"
              locale="pl"
            />
          </GoogleLoginContainer>
          
      </Right>
      </StyledContainer>
    </GoogleOAuthProvider>
  )
};

export default Login;

