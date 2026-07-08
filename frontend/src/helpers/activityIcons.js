import React from 'react';
import { Medal } from '@styled-icons/fa-solid/Medal';

// PNG-i z assets (autorzy w stopce - components/footer.js)
import swimming from '../assets/swimming.png';
import soccer from '../assets/soccer.png';
import basketball from '../assets/basketball.png';
import yoga from '../assets/yoga.png';
import pilates from '../assets/pilates.png';
import tennis from '../assets/tennis.png';
import walking from '../assets/walking.png';
import run from '../assets/run.png';
import bicycle from '../assets/bicycle.png';
import dumbbell from '../assets/dumbbell.png';
import volleyball from '../assets/volleyball-player.png';
import boxing from '../assets/boxing-gloves.png';
import golf from '../assets/golf-player.png';
import baseball from '../assets/baseball.png';
import hiking from '../assets/hiking.png';
import ski from '../assets/ski.png';
import iceSkating from '../assets/ice-skating.png';
import bowling from '../assets/bowling.png';
import climber from '../assets/climber.png';
import dance from '../assets/dance.png';
import handball from '../assets/handball.png';
import nordicWalking from '../assets/nordic-walking.png';
import rollerSkater from '../assets/roller-skater.png';
import aerobic from '../assets/aerobic.png';
import badminton from '../assets/badminton.png';
import squash from '../assets/squash.png';
import crossfit from '../assets/crossfit.png';
import kayak from '../assets/kayak.png';
import sup from '../assets/sup.png';
import stretching from '../assets/stretching.png';
import cardio from '../assets/cardio.png';
import treadmill from '../assets/treadmill.png';
import tabletennis from '../assets/ping-pong.png';
import hockey from '../assets/ice-hockey.png';
import sex from '../assets/sex.png';
import gardening from '../assets/gardening.png';
import rowingMachine from '../assets/rowing-machine.png';

// klucz ikony (kolumna activity_type.icon) -> obrazek PNG
const ICONS = {
  // istniejące typy (klucze bez zmian, podmieniona grafika)
  swimming,
  soccer,
  basketball,
  yoga,
  pilates,
  tennis,
  walking,
  running: run,
  cycling: bicycle,
  gym: dumbbell,
  volleyball,
  boxing,
  golf,
  baseball,
  hiking,
  skiing: ski,
  skating: iceSkating,
  bowling,
  climbing: climber,
  dancing: dance,
  tabletennis,
  hockey,
  // nowe sporty (klucz = nazwa pliku)
  handball,
  'nordic-walking': nordicWalking,
  'roller-skater': rollerSkater,
  aerobic,
  badminton,
  squash,
  crossfit,
  kayak,
  sup,
  stretching,
  cardio,
  treadmill,
  seks: sex,
  ogrodnictwo: gardening,
  wioslarz: rowingMachine,
};

// Medal jako fallback dla nieznanych kluczy (bez własnej grafiki)
export const ActivityIcon = ({ name, className }) => {
  const src = ICONS[name];
  if (!src) return <Medal className={className} />;
  return <img className={className} src={src} alt={name} />;
};

export default ActivityIcon;
