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

// Atrybucja Flaticon - jedna linia na autora (licencja wymaga podania autora,
// ale ikony tego samego autora można zgrupować pod jednym wpisem/linkiem).
const CREDITS = [
  ['Freepik', 'https://www.flaticon.com/authors/freepik'],
  ['Culmbio', 'https://www.flaticon.com/free-icons/soccer'],
  ['Smashicons', 'https://www.flaticon.com/free-icons/basketball'],
  ['muh zakaria', 'https://www.flaticon.com/free-icons/people'],
  ['justicon', 'https://www.flaticon.com/free-icons/golf'],
  ['ultimatearm', 'https://www.flaticon.com/free-icons/sport'],
  ['Good Ware', 'https://www.flaticon.com/free-icons/hiking'],
  ['IconKanan', 'https://www.flaticon.com/free-icons/baseball'],
  ['Mayor Icons', 'https://www.flaticon.com/free-icons/enjoy'],
  ['Iconriver', 'https://www.flaticon.com/free-icons/treadmill'],
  ['Ylivdesign', 'https://www.flaticon.com/free-icons/sup'],
  ['NT Sookruay', 'https://www.flaticon.com/free-icons/racket'],
  ['khld939', 'https://www.flaticon.com/free-icons/crossfit'],
  ['Ajmal Naha', 'https://www.flaticon.com/free-icons/ping-pong'],
  ['Pixelmeetup', 'https://www.flaticon.com/free-icons/ice-hockey'],
  ['kosonicon', 'https://www.flaticon.com/free-icons/sex'],
  ['gravisio', 'https://www.flaticon.com/free-icons/rower'],
];

const Footer = () => (
  <StyledFooter>
    <details>
      <summary>Autorzy ikon</summary>
      <div className="credits">
        {CREDITS.map(([author, href], i) => (
          <a key={i} href={href} title={`${author} - Flaticon`} target="_blank" rel="noreferrer">Ikony: {author} – Flaticon</a>
        ))}
      </div>
    </details>
  </StyledFooter>
);

export default Footer;
