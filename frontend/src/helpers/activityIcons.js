import React from 'react';
import { Medal } from '@styled-icons/fa-solid/Medal';

import swimming from '../assets/swimming.png';
import soccer from '../assets/soccer.png';
import basketball from '../assets/basketball.png';
import yoga from '../assets/yoga.png';
import pilates from '../assets/pilates.png';
import tennis from '../assets/tennis.png';
import walking from '../assets/walking.png';
import running from '../assets/run.png';
import cycling from '../assets/bicycle.png';
import gym from '../assets/dumbbell.png';
import volleyball from '../assets/volleyballPlayer.png';
import boxing from '../assets/boxingGloves.png';
import golf from '../assets/golfPlayer.png';
import baseball from '../assets/baseball.png';
import hiking from '../assets/hiking.png';
import skiing from '../assets/ski.png';
import skating from '../assets/iceSkating.png';
import bowling from '../assets/bowling.png';
import climbing from '../assets/climber.png';
import dancing from '../assets/dance.png';
import handball from '../assets/handball.png';
import nordicWalking from '../assets/nordicWalking.png';
import rollerSkater from '../assets/rollerSkater.png';
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
import hockey from '../assets/iceHockey.png';
import seks from '../assets/sex.png';
import gardening from '../assets/gardening.png';
import rowingMachine from '../assets/rowingMachine.png';
import interval from '../assets/interval.png';
import tabata from '../assets/tabata.png';
import kettlebell from '../assets/kettlebell.png';
import calisthenics from '../assets/calisthenics.png';
import jumpingRope from '../assets/jumpingRope.png';
import spinning from '../assets/spinning.png';
import exercising from '../assets/exercising.png';
import karate from '../assets/karate.png';
import judo from '../assets/judo.png';
import taekwondo from '../assets/taekwondo.png';
import sailing from '../assets/sailing.png';
import diving from '../assets/diving.png';
import surfing from '../assets/surfing.png';
import paddle from '../assets/paddle.png';
import snowboarding from '../assets/snowboarding.png';
import horseRiding from '../assets/horseRiding.png';
import archery from '../assets/archery.png';
import trampoline from '../assets/trampolineJumping.png';
import zumba from '../assets/zumba.png';

const ICONS = {
  swimming,
  soccer,
  basketball,
  yoga,
  pilates,
  tennis,
  walking,
  running,
  cycling,
  gym,
  volleyball,
  boxing,
  golf,
  baseball,
  hiking,
  skiing,
  skating,
  bowling,
  climbing,
  dancing,
  tabletennis,
  hockey,
  handball,
  nordicWalking,
  rollerSkater,
  aerobic,
  badminton,
  squash,
  crossfit,
  kayak,
  sup,
  stretching,
  cardio,
  treadmill,
  seks,
  gardening,
  rowingMachine,
  interval,
  tabata,
  kettlebell,
  calisthenics,
  jumpingRope,
  spinning,
  exercising,
  karate,
  judo,
  taekwondo,
  sailing,
  diving,
  surfing,
  paddle,
  snowboarding,
  horseRiding,
  archery,
  trampoline,
  zumba,
};

export const ActivityIcon = ({ name, className }) => {
  const src = ICONS[name];
  if (!src) return <Medal className={className} />;
  return <img className={className} src={src} alt={name} />;
};

export default ActivityIcon;
