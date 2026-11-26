'use client';

import { BenchPressAnim, InclineDbPressAnim, DbBenchAnim, CableFlyAnim, ChestDipAnim } from './anim/chest';
import { LatPulldownAnim, SeatedRowAnim, BentRowAnim, SingleArmRowAnim } from './anim/back';
import {
  TricepPushdownAnim,
  OverheadExtAnim,
  SkullCrusherAnim,
  BarbellCurlAnim,
  HammerCurlAnim,
  PreacherCurlAnim,
} from './anim/arms';
import {
  BackSquatAnim,
  RdlAnim,
  LegPressAnim,
  LegExtensionAnim,
  LyingLegCurlAnim,
  LungeAnim,
  HipThrustAnim,
  CalfRaiseAnim,
} from './anim/legs';
import {
  ShoulderPressAnim,
  LateralRaiseAnim,
  FrontRaiseAnim,
  RearDeltFlyAnim,
  FacePullAnim,
} from './anim/shoulders';
import {
  CableCrunchAnim,
  HangingKneeAnim,
  PlankAnim,
  DeadBugAnim,
  BirdDogAnim,
  InclineWalkAnim,
  BikeAnim,
} from './anim/core';

const ANIM_MAP = {
  'bench-press': BenchPressAnim,
  'incline-db-press': InclineDbPressAnim,
  'cable-fly': CableFlyAnim,
  'chest-dip': ChestDipAnim,
  'tricep-pushdown': TricepPushdownAnim,
  'overhead-extension': OverheadExtAnim,
  'lat-pulldown': LatPulldownAnim,
  'seated-cable-row': SeatedRowAnim,
  'bent-over-row': BentRowAnim,
  'single-arm-row': SingleArmRowAnim,
  'barbell-curl': BarbellCurlAnim,
  'hammer-curl': HammerCurlAnim,
  'back-squat': BackSquatAnim,
  'leg-press': LegPressAnim,
  'leg-extension': LegExtensionAnim,
  'romanian-deadlift': RdlAnim,
  'lying-leg-curl': LyingLegCurlAnim,
  'walking-lunge': LungeAnim,
  'hip-thrust': HipThrustAnim,
  'standing-calf-raise': CalfRaiseAnim,
  'calf-raise': CalfRaiseAnim,
  'db-shoulder-press': ShoulderPressAnim,
  'lateral-raise': LateralRaiseAnim,
  'front-raise': FrontRaiseAnim,
  'rear-delt-fly': RearDeltFlyAnim,
  'face-pull': FacePullAnim,
  'cable-crunch': CableCrunchAnim,
  'hanging-knee-raise': HangingKneeAnim,
  'db-bench': DbBenchAnim,
  'skull-crusher': SkullCrusherAnim,
  'preacher-curl': PreacherCurlAnim,
  'incline-walk': InclineWalkAnim,
  'bike-intervals': BikeAnim,
  plank: PlankAnim,
  'dead-bug': DeadBugAnim,
  'bird-dog': BirdDogAnim,
};

export default function ExerciseAnimation({ animationId, sets, reps }) {
  const Comp = ANIM_MAP[animationId] || BenchPressAnim;
  return <Comp sets={sets} reps={reps} />;
}
