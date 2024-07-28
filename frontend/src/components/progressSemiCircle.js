import React from 'react';
import styled from 'styled-components';


const StyledContainer=styled.div`
    width:600px;
    margin:auto;
    @media(max-width:670px){
        width:100%;
    }
`   

const StyledCircle=styled.div`
    position: relative;
    margin:auto;
    width: 200px;
    height: 200px;
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
    `;

    const Napis=styled.p`
        position:absolute;
        text-align:center;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        font-size:1.2rem;
        font-weight:800;
        margin:0;
    `

    const UsersContainer=styled.div`
        width:220px;
        margin-left:auto;
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    `   

    const StyledUser=styled.div`
        display:flex;
        flex-wrap:nowrap;
        margin:0 5px;
        width:100px;
        @media(max-width:670px){
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
            <StyledCircle>
                <Napis>Pozostało 40%</Napis>
            </StyledCircle>
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
        </StyledContainer>
    );
};

export default ProgressSemiCircle;
