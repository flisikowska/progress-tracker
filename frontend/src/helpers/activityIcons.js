import React from 'react';
import { PersonSwimming } from '@styled-icons/fa-solid/PersonSwimming';
import { Futbol } from '@styled-icons/fa-solid/Futbol';
import { Basketball } from '@styled-icons/fa-solid/Basketball';
import { Spa } from '@styled-icons/fa-solid/Spa';
import { ChildReaching } from '@styled-icons/fa-solid/ChildReaching';
import { TableTennisPaddleBall } from '@styled-icons/fa-solid/TableTennisPaddleBall';
import { PersonWalking } from '@styled-icons/fa-solid/PersonWalking';
import { PersonRunning } from '@styled-icons/fa-solid/PersonRunning';
import { PersonBiking } from '@styled-icons/fa-solid/PersonBiking';
import { Dumbbell } from '@styled-icons/fa-solid/Dumbbell';
import { Volleyball } from '@styled-icons/fa-solid/Volleyball';
import { HandFist } from '@styled-icons/fa-solid/HandFist';
import { PingPongPaddleBall } from '@styled-icons/fa-solid/PingPongPaddleBall';
import { GolfBallTee } from '@styled-icons/fa-solid/GolfBallTee';
import { Baseball } from '@styled-icons/fa-solid/Baseball';
import { PersonHiking } from '@styled-icons/fa-solid/PersonHiking';
import { PersonSkiing } from '@styled-icons/fa-solid/PersonSkiing';
import { PersonSkating } from '@styled-icons/fa-solid/PersonSkating';
import { HockeyPuck } from '@styled-icons/fa-solid/HockeyPuck';
import { BowlingBall } from '@styled-icons/fa-solid/BowlingBall';
import { Mountain } from '@styled-icons/fa-solid/Mountain';
import { Music } from '@styled-icons/fa-solid/Music';
import { Medal } from '@styled-icons/fa-solid/Medal';

// klucz ikony (kolumna activity_type.icon) -> komponent fa-solid
const ICONS = {
  swimming: PersonSwimming,
  soccer: Futbol,
  basketball: Basketball,
  yoga: Spa,
  pilates: ChildReaching,
  tennis: TableTennisPaddleBall,
  walking: PersonWalking,
  running: PersonRunning,
  cycling: PersonBiking,
  gym: Dumbbell,
  volleyball: Volleyball,
  boxing: HandFist,
  tabletennis: PingPongPaddleBall,
  golf: GolfBallTee,
  baseball: Baseball,
  hiking: PersonHiking,
  skiing: PersonSkiing,
  skating: PersonSkating,
  hockey: HockeyPuck,
  bowling: BowlingBall,
  climbing: Mountain,
  dancing: Music,
};

// Medal jako fallback dla nieznanych kluczy
export const ActivityIcon = ({ name, className }) => {
  const Icon = ICONS[name] || Medal;
  return <Icon className={className} />;
};

export default ActivityIcon;
