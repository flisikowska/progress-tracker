import React from 'react';
import styled from 'styled-components';
import {data_V1} from '../helpers/data_v1';

const StyledMembersWrapper = styled.div`
  width:100%;
  overflow-y:auto;
  display:flex;
  flex-flow:column;
  justify-content:right;
  align-items:end;
`;

const Member=styled.div`
    padding: 3px 5px;
    display:flex;
    flex-flow:row-nowrap;
    align-items:center;
    >p{
        cursor:default;
        font-weight:600px;
        font-size:1rem;
    }
`;

const StyledColorSquare=styled.div`
    width:15px;
    height:15px;
    border-radius:2px;
    border:1px solid #000;
    margin-left:5px;
    background-color: ${(props)=> props.$color};
    border:1px solid ${(props)=> props.$color};
    fill-opacity: 0.3;
`;


function GroupMembers(){
    return(
      <StyledMembersWrapper className='scrollable'>
        {data_V1 &&
          data_V1.map(
            (
              {
                Type,
                Color
              }, key
            ) => (
                <Member key={key} >
                    <p>
                        {Type}
                    </p>
                    <StyledColorSquare $color={Color}/>
                </Member>
            ),
          )}
      </StyledMembersWrapper>
    );
};

export default GroupMembers;
