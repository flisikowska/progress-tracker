import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  width: 200px;
  height: 100px;
  overflow: hidden;
  margin: 5px auto;
  @media (max-width: 370px) {
    width: 100%;
    padding: 0 4px;
  }
`;


const StyledTitle = styled.h5`
  color: #000;
  text-transform: uppercase;
  min-height: 15px;
  margin: 0;
  padding: 0;
  font-weight: 400;
  font-size: 0.7rem;
`;

const StyledWrapper = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor:pointer;
`;

const PickerName = styled.p`
  position: absolute;
  top: 66%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 13px;
  font-size: 0.6rem;
  opacity: 0.6;
  color: #fff;
  padding: 0;
  margin: 0;
  font-weight: 600;
  text-transform: uppercase;
  background-color: #aaa;
  z-index: -1;
  padding: 0 15px;
  border-radius: 3px;
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;
  margin: 0 auto;
  .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 1.1rem;
    opacity: 0.4;
    position: relative;
    color:#000;
  }
  .swiper-slide-active {
    font-weight: 600;
    opacity: 1;
    width: 100%;
  }
`;

const hoursArray = [...new Array(24).keys()].map((x) => ('0' + x).slice(-2));
const minutesArray = [...new Array(60 / 5).keys()]
  .map((x) => x * 5)
  .map((x) => ('0' + x).slice(-2));

const TimePicker = ({ id, name, onChange, value, title }) => {
  const [hours, setHours] = useState(value && value.hours ? value.hours : 0);
  const [minutes, setMinutes] = useState(value && value.minutes ? value.minutes : 0);

  useEffect(() => {
    onChange({ hours, minutes });
    //eslint-disable-next-line
  }, [hours, minutes]);

  useEffect(() => {
    if (value && value.hours) setHours(value.hours);
    if (value && value.minutes) setMinutes(value.minutes);
  }, [value]);

  return (
    <div id={id}>
      <StyledTitle>{title}</StyledTitle>
      <StyledContainer name={name}>
        <StyledWrapper>
          <StyledSwiper
            loop={true}
            centeredSlides={true}
            slidesPerView={3}
            direction={'vertical'}
            onSlideChange={(e) => {
              setHours(hoursArray[e.realIndex]);
            }}
            initialSlide={value && value.hours ? value.hours : 0}
          >
            {hoursArray.map((hours, index) => (
              <SwiperSlide key={index}>
                <div>{hours}</div>
              </SwiperSlide>
            ))}
          </StyledSwiper>
          <PickerName>Godziny</PickerName>
        </StyledWrapper>
        <StyledWrapper>
          <StyledSwiper
            loop={true}
            centeredSlides={true}
            slidesPerView={3}
            direction={'vertical'}
            onSlideChange={(e) => {
              setMinutes(minutesArray[e.realIndex]);
            }}
            initialSlide={value && value.minutes ? value.minutes / 5 : 0}
          >
            {minutesArray.map((minute, index) => (
              <SwiperSlide key={index}>
                <div>{minute}</div>
              </SwiperSlide>
            ))}
          </StyledSwiper>
          <PickerName>Minuty</PickerName>
        </StyledWrapper>
      </StyledContainer>
    </div>
  );
};

TimePicker.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.object,
  title: PropTypes.string,
};

export default TimePicker;
