import React from 'react';
import styled from 'styled-components';


const StyledContainer=styled.div`
    width:100%;
    position:relative;    
`   

const StyledCircle=styled.div`
    position: relative;
    margin:auto;
    width: 205px;
    height: 205px;
    border-radius: 100px;
    &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 165px;
        height: 165px;
        transform:translate(-50%, -50%);
        background-color: #ddd;
        border-radius: 100px;
    }
    background: conic-gradient(
        #e94547 0deg 45deg,
        #7dcef5 45deg 90deg,
        #79c191 90deg 200deg,
        #ed5ad5 200deg 220deg,
        #dcdcdc 220deg 360deg
    );
    @media(max-width:570px){
        width:150px;
        height:150px;
        margin:0 25px 0 auto;
        &:before {
            width: 120px;
            height: 120px;
        }
    }
    `;

    const StyledHeader=styled.h2`
        position:absolute;
        text-align:center;
        top:50%;
        left:50%;
        cursor:default;
        transform:translate(-50%, -50%);
        font-size:1.2rem;
        font-weight:800;
        margin:0;
        @media(max-width:570px){
            font-size:1rem;
        }   
    }
    `

    const UsersContainer=styled.div`
        position:absolute;
        top:0;
        left:0;
    `   

    const StyledUser=styled.div`
        display:flex;
        flex-wrap:nowrap;
        margin-bottom: 10px;
        width:100px;
        @media(max-width:670px){
        margin-bottom: 7px;
            >p{
                font-size:0.8rem;
            }
        }
    `   

    const Square=styled.div`
        width:14px;
        height:14px;
        background-color: ${(props) => props.color};
        border-radius:5px;
        position:relative;
        top:15px;
        left:12px;
    `

    const StyledName=styled.p`
        z-index:1;
        font-weight:500;
        margin:5px;
    `   
;

function ProgressSemiCircle(){
    return(
        <StyledContainer>
            <UsersContainer>
                <StyledUser>
                    <Square color={"#e94547"}/>
                    <StyledName>Karolina</StyledName>
                </StyledUser>
                <StyledUser>
                    <Square color={"#7dcef5"}/>
                    <StyledName>Kasia</StyledName>
                </StyledUser>
                <StyledUser>
                    <Square color={"#79c191"}/>
                    <StyledName>Angelika</StyledName>
                </StyledUser>
                <StyledUser>
                    <Square color={"#ed5ad5"}/>
                    <StyledName>Emilia</StyledName>
                </StyledUser>
            </UsersContainer>
            <StyledCircle>
                <StyledHeader>Pozostało 40%</StyledHeader>
            </StyledCircle>
        </StyledContainer>
    );
};

export default ProgressSemiCircle;
