import React from 'react';
import styled from 'styled-components';
import girl from '../assets/Girl.png';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const StyledContainer= styled.div`
  box-sizing:border-box;
  width:100%;
  height:100%;
  margin:0;
  padding:32px;
  display:flex;
  flex-flow:column nowrap;
  cursor:default;
  @media (max-width: 768px){
    padding:25px 16px;
  }
`

const Brand=styled.div`
  display:flex;
  align-items:center;
  gap:10px;
  user-select:none;
`

const Content=styled.div`
  flex:1;
  display:flex;
  flex-flow:row nowrap;
  align-items:center;
  justify-content:center;
  gap:24px;

  @media (max-width: 768px){
    justify-content:center;
    gap:0;
  }
`

const Right=styled.div`
  max-width:480px;
  @media (max-width: 768px){
    width:100%;
    max-width:unset;
  }
`

const BrandName=styled.span`
  font-size:1.6rem;
  font-weight:700;
  letter-spacing:0.5px;
  color:var(--text);
  >span{
    color:var(--blue);
  }

`

const Logo=() => (
  <svg width="40" height="40" viewBox="0 0 48 48" aria-label="TrenujeMY logo">
    {/* Kwadrat z zaokrąglonymi rogami */}
    <rect x="1" y="1" width="46" height="46" rx="12" fill="var(--blue)"/>
    {/* Trzy postacie rosnące w górę = budująca się społeczność */}
    <g fill="var(--white)">
      <circle cx="14" cy="24" r="3.5"/>
      <rect x="10" y="29" width="8" height="13" rx="4"/>
      <circle cx="24" cy="18" r="4"/>
      <rect x="19" y="24" width="10" height="18" rx="5"/>
      <circle cx="34" cy="24" r="3.5"/>
      <rect x="30" y="29" width="8" height="13" rx="4"/>
    </g>
  </svg>
)


const StyledHeader=styled.h1`
  font-size:2.5rem;
  line-height:1.15;
  margin:0;
  >p{
    font-size:1.2rem;
    font-weight:300;
    line-height:1.5;
    margin-top:16px;
  }

  @media (max-width: 768px){
    font-size:2rem;
    margin-top:20px;
    >p{
      font-size:1.05rem;
      margin-top:12px;
    }
  }
`

const StyledGirl=styled.div`
  flex:0 0 auto;
  height:400px;
  aspect-ratio: 2/3;
  background: URL(${girl});
  background-size:contain;
  background-repeat:no-repeat;

  @media (max-width: 768px){
    display:none;
  }
`;

const GoogleLoginContainer= styled.div`
  width: fit-content;
  margin: 20px 0 0;
  display: flex;
  justify-content: flex-start;
`

const LoginHint= styled.p`
  margin: 5px 0 0 10px;
  font-size: 0.7rem;
  font-weight: 300;
  color: var(--text-inactive);
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
        <Brand>
          <Logo/>
          <BrandName>Trenuje<span>MY</span></BrandName>
        </Brand>
        <Content>
          <StyledGirl/>
          <Right>
            <StyledHeader>Razem trenuje się lepiej
              <p>Zbierz drużynę i wyznaczcie wspólny cel. Trzymajcie tempo i motywujcie się nawzajem!</p></StyledHeader>
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
            <LoginHint>Za darmo, bez zakładania osobnego konta</LoginHint>
          </Right>
        </Content>
      </StyledContainer>
    </GoogleOAuthProvider>
  )
};

export default Login;

