import React from 'react';
import styled from 'styled-components';

// Stopka z atrybucją ikon (Flaticon). Mała, ledwo widoczna, zwinięta domyślnie -
// rozwija się dopiero po kliknięciu, więc nie zajmuje miejsca ani nie rozprasza.
const StyledFooter = styled.footer`
  width: 900px;
  max-width: 90%;
  margin: 12px auto 0;
  text-align: center;
  opacity: 0.3;
  font-size: 0.65rem;
  color: var(--text-inactive);
  transition: opacity 0.2s;
  &:hover { opacity: 0.7; }

  details summary {
    cursor: pointer;
    list-style: none;
    user-select: none;
  }
  details summary::-webkit-details-marker { display: none; }
  details[open] summary { margin-bottom: 6px; }

  .credits {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 150px;
    overflow-y: auto;
    padding: 0 10px;
  }
  a { color: inherit; text-decoration: underline; }
`;

// źródło: lista przekazana przez autorkę (Flaticon)
const CREDITS = [
  ['https://www.flaticon.com/free-icons/soccer', 'soccer icons', 'Soccer icons created by Culmbio - Flaticon'],
  ['https://www.flaticon.com/free-icons/swimming', 'swimming icons', 'Swimming icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/basketball', 'basketball icons', 'Basketball icons created by Smashicons - Flaticon'],
  ['https://www.flaticon.com/free-icons/pilates', 'pilates icons', 'Pilates icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/people', 'people icons', 'People icons created by muh zakaria - Flaticon'],
  ['https://www.flaticon.com/free-icons/yoga', 'yoga icons', 'Yoga icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/tennis', 'tennis icons', 'Tennis icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/volleyball-player', 'Volleyball player icons', 'Volleyball player icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/golf', 'golf icons', 'Golf icons created by justicon - Flaticon'],
  ['https://www.flaticon.com/free-icons/sport', 'sport icons', 'Sport icons created by ultimatearm - Flaticon'],
  ['https://www.flaticon.com/free-icons/roller-skate', 'roller-skate icons', 'Roller-skate icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/ice-skating', 'ice-skating icons', 'Ice-skating icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/bowling', 'bowling icons', 'Bowling icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/hiking', 'hiking icons', 'Hiking icons created by Good Ware - Flaticon'],
  ['https://www.flaticon.com/free-icons/climbing', 'climbing icons', 'Climbing icons created by Culmbio - Flaticon'],
  ['https://www.flaticon.com/free-icons/baseball', 'baseball icons', 'Baseball icons created by IconKanan - Flaticon'],
  ['https://www.flaticon.com/free-icons/bicycle', 'bicycle icons', 'Bicycle icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/gym', 'gym icons', 'Gym icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/boxing-gloves', 'boxing gloves icons', 'Boxing gloves icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/enjoy', 'enjoy icons', 'Enjoy icons created by Mayor Icons - Flaticon'],
  ['https://www.flaticon.com/free-icons/exercise', 'exercise icons', 'Exercise icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/winter-sports', 'winter sports icons', 'Winter sports icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/treadmill', 'treadmill icons', 'Treadmill icons created by Iconriver - Flaticon'],
  ['https://www.flaticon.com/free-icons/sup', 'sup icons', 'Sup icons created by Ylivdesign - Flaticon'],
  ['https://www.flaticon.com/free-icons/racket', 'racket icons', 'Racket icons created by NT Sookruay - Flaticon'],
  ['https://www.flaticon.com/free-icons/kayak', 'kayak icons', 'Kayak icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/crossfit', 'crossfit icons', 'Crossfit icons created by khld939 - Flaticon'],
  ['https://www.flaticon.com/free-icons/stretching', 'stretching icons', 'Stretching icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/badminton', 'badminton icons', 'Badminton icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/nordic', 'nordic icons', 'Nordic icons created by Ylivdesign - Flaticon'],
  ['https://www.flaticon.com/free-icons/handball', 'handball icons', 'Handball icons created by Freepik - Flaticon'],
  ['https://www.flaticon.com/free-icons/ping-pong', 'ping pong icons', 'Ping pong icons created by Ajmal Naha - Flaticon'],
  ['https://www.flaticon.com/free-icons/ice-hockey', 'ice hockey icons', 'Ice hockey icons created by Pixelmeetup - Flaticon'],
];

const Footer = () => (
  <StyledFooter>
    <details>
      <summary>Autorzy ikon</summary>
      <div className="credits">
        {CREDITS.map(([href, title, text], i) => (
          <a key={i} href={href} title={title} target="_blank" rel="noreferrer">{text}</a>
        ))}
      </div>
    </details>
  </StyledFooter>
);

export default Footer;
