'use client';

import { useRef } from 'react';
import {
  C,
  Frame,
  Head,
  Joint,
  Seg,
  Hand,
  Foot,
  TorsoFront,
  TorsoSide,
  Shorts,
  MuscleGlow,
  useRepAnim,
  rep,
} from './kit';

export function CableCrunchAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-torso'), 0);
    rep(tl, {
      eccDur: 1.1,
      conDur: 0.95,
      ecc: [{ target: q('.j-torso'), vars: { rotation: 38 } }],
      con: [{ target: q('.j-torso'), vars: { rotation: 0 } }],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Kneeling cable crunch"
      phaseA="① Tall kneel"
      phaseB="② Ribs to pelvis"
      sets={sets}
      reps={reps}
      muscleLabel="Abs"
    >
      <rect x="108" y="10" width="24" height="12" rx="2" fill={C.metal} />
      <ellipse cx="92" cy="142" rx="8" ry="4" fill={C.equip} />
      <ellipse cx="148" cy="142" rx="8" ry="4" fill={C.equip} />

      <g className="j-torso" transform="translate(120,120)">
        <Joint />
        <g transform="translate(0,-36)">
          <TorsoFront rx={16} ry={30} />
          <MuscleGlow type="abs" />
        </g>
        <g transform="translate(0,-72)">
          <Head face="front" r={9.5} />
        </g>
        <line x1="0" y1="-78" x2="0" y2="-110" stroke={C.accent} strokeWidth="2.8" />
        <g transform="translate(0,-78)">
          <Hand />
        </g>
      </g>
    </Frame>
  );
}

export function HangingKneeAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-hip'), 0);
    setJointRotation(q('.j-knee-l'), 10);
    setJointRotation(q('.j-knee-r'), -10);
    rep(tl, {
      ecc: [
        { target: q('.j-hip'), vars: { rotation: -70 } },
        { target: q('.j-knee-l'), vars: { rotation: 55 } },
        { target: q('.j-knee-r'), vars: { rotation: -55 } },
      ],
      con: [
        { target: q('.j-hip'), vars: { rotation: 0 } },
        { target: q('.j-knee-l'), vars: { rotation: 10 } },
        { target: q('.j-knee-r'), vars: { rotation: -10 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Hang · knee raise"
      phaseA="① Hang still"
      phaseB="② Knees to chest"
      sets={sets}
      reps={reps}
      muscleLabel="Abs"
    >
      <line x1="48" y1="18" x2="192" y2="18" stroke={C.metal} strokeWidth="7" strokeLinecap="round" />
      <g transform="translate(88,18)">
        <Hand r={3.5} />
        <Seg x2={20} y2={30} w={8} />
      </g>
      <g transform="translate(152,18)">
        <Hand r={3.5} />
        <Seg x2={-20} y2={30} w={8} />
      </g>
      <g transform="translate(120,50)">
        <Head face="front" r={9.5} />
      </g>
      <g transform="translate(120,82)">
        <TorsoFront rx={15} ry={24} />
        <MuscleGlow type="abs" />
      </g>

      <g className="j-hip" transform="translate(120,102)">
        <Joint />
        <g className="j-knee-l" transform="translate(-8,0)">
          <Seg x2={-16} y2={36} w={9} />
          <g transform="translate(-16,36)">
            <Joint />
            <Seg x2={-4} y2={16} w={8} />
          </g>
        </g>
        <g className="j-knee-r" transform="translate(8,0)">
          <Seg x2={16} y2={36} w={9} />
          <g transform="translate(16,36)">
            <Joint />
            <Seg x2={4} y2={16} w={8} />
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function PlankAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    gsap.to(q('.gp-pulse'), {
      opacity: 0.35,
      scale: 1,
      duration: 1.1,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%',
    });
    gsap.fromTo(
      q('.j-body'),
      { y: 0 },
      { y: 1.5, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' }
    );
  });

  return (
    <Frame
      ref={ref}
      title="Forearm plank · one line"
      phaseA="① Brace core"
      phaseB="② Hold steady"
      sets={sets}
      reps={reps}
      muscleLabel="Core"
    >
      <rect x="24" y="138" width="192" height="8" rx="2" fill={C.bench} />
      <line x1="42" y1="108" x2="196" y2="86" stroke={C.accentDim} strokeWidth="1.5" strokeDasharray="4 3" />

      <g className="j-body" transform="translate(120,100)">
        <g transform="translate(60,-18)">
          <Head r={9} />
        </g>
        <g transform="translate(0,0) rotate(-8)">
          <TorsoSide rx={52} ry={13} />
          <MuscleGlow type="abs" scale={0.95} />
        </g>
        <g transform="translate(-60,10)">
          <Seg x2={0} y2={28} w={8} />
          <line x1={-16} y1={28} x2={16} y2={28} stroke={C.bone} strokeWidth="8" strokeLinecap="round" />
        </g>
        <g transform="translate(52,-6)">
          <Seg x2={18} y2={24} w={7} />
        </g>
        <circle className="gp-pulse" cx={0} cy={0} r={6} fill={C.accent} />
        <text x={-12} y={-12} fill={C.accent} fontSize="7" fontFamily="system-ui" className="gp-pulse">
          brace
        </text>
      </g>
    </Frame>
  );
}

export function DeadBugAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    gsap.set(q('.j-limbs'), { scaleX: 1, transformOrigin: '120px 110px' });
    tl.to(q('.j-limbs'), { scaleX: -1, duration: 1.2, ease: 'power1.inOut' })
      .to({}, { duration: 0.25 })
      .to(q('.j-limbs'), { scaleX: 1, duration: 1.2, ease: 'power1.inOut' })
      .to({}, { duration: 0.25 });
  });

  return (
    <Frame
      ref={ref}
      title="Floor · dead bug"
      phaseA="① Opposite reach"
      phaseB="② Switch sides"
      sets={sets}
      reps={reps}
      muscleLabel="Core"
    >
      <rect x="28" y="138" width="184" height="8" rx="2" fill={C.bench} />
      <g transform="translate(120,90)">
        <Head face="front" r={9.5} />
      </g>
      <g transform="translate(120,110)">
        <TorsoSide rx={44} ry={13} />
        <MuscleGlow type="abs" scale={0.9} />
      </g>
      <text x="96" y="116" fill={C.ink} fontSize="6.5" fontFamily="system-ui" fontWeight="700" opacity="0.45">
        back flat
      </text>

      <g className="j-limbs">
        <line x1="84" y1="108" x2="48" y2="58" stroke={C.accent} strokeWidth="8" strokeLinecap="round" />
        <line x1="156" y1="108" x2="192" y2="132" stroke={C.bone} strokeWidth="8" strokeLinecap="round" />
        <line x1="84" y1="116" x2="52" y2="136" stroke={C.bone} strokeWidth="8" strokeLinecap="round" />
        <line x1="156" y1="116" x2="192" y2="64" stroke={C.accent} strokeWidth="8" strokeLinecap="round" />
      </g>
    </Frame>
  );
}

export function BirdDogAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, setJointRotation, tweenJoint }) => {
    setJointRotation(q('.j-arm'), 0);
    setJointRotation(q('.j-leg'), 0);
    tweenJoint(tl, q('.j-arm'), -18, 1.15, 0);
    tweenJoint(tl, q('.j-leg'), 18, 1.15, 0);
    tl.to({}, { duration: 0.2 });
    tweenJoint(tl, q('.j-arm'), 0, 1.0, '>');
    tweenJoint(tl, q('.j-leg'), 0, 1.0, '<');
    tl.to({}, { duration: 0.15 });
    tl.to(q('.j-reach'), { scaleX: -1, duration: 0.01 });
    tweenJoint(tl, q('.j-arm'), -18, 1.15, '>');
    tweenJoint(tl, q('.j-leg'), 18, 1.15, '<');
    tl.to({}, { duration: 0.2 });
    tweenJoint(tl, q('.j-arm'), 0, 1.0, '>');
    tweenJoint(tl, q('.j-leg'), 0, 1.0, '<');
    tl.to(q('.j-reach'), { scaleX: 1, duration: 0.01 });
  });

  return (
    <Frame
      ref={ref}
      title="All fours · bird dog"
      phaseA="① Reach long"
      phaseB="② Switch sides"
      sets={sets}
      reps={reps}
      muscleLabel="Core"
    >
      <g transform="translate(88,68)">
        <Head r={9} />
      </g>
      <g transform="translate(120,104)">
        <TorsoSide rx={44} ry={13} />
        <MuscleGlow type="abs" scale={0.8} />
      </g>
      <g transform="translate(88,110)">
        <Seg x2={-8} y2={26} w={8} />
      </g>
      <g transform="translate(148,110)">
        <Seg x2={8} y2={26} w={8} />
      </g>
      <line x1="40" y1="78" x2="200" y2="78" stroke={C.accentDim} strokeWidth="1.3" strokeDasharray="3 3" />

      <g className="j-reach" transform="translate(120,100)">
        <g className="j-arm" transform="translate(-40,-2)">
          <Seg x2={-36} y2={-28} w={8.5} color={C.accent} />
        </g>
        <g className="j-leg" transform="translate(40,-2)">
          <Seg x2={36} y2={-28} w={8.5} color={C.accent} />
        </g>
      </g>
    </Frame>
  );
}

export function InclineWalkAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, setJointRotation, tweenJoint }) => {
    setJointRotation(q('.j-leg-a'), -22);
    setJointRotation(q('.j-leg-b'), 24);
    setJointRotation(q('.j-arm-a'), 20);
    setJointRotation(q('.j-arm-b'), -18);

    tweenJoint(tl, q('.j-leg-a'), 24, 0.45, 0);
    tweenJoint(tl, q('.j-leg-b'), -22, 0.45, 0);
    tweenJoint(tl, q('.j-arm-a'), -18, 0.45, 0);
    tweenJoint(tl, q('.j-arm-b'), 20, 0.45, 0);
    tweenJoint(tl, q('.j-leg-a'), -22, 0.45, '>');
    tweenJoint(tl, q('.j-leg-b'), 24, 0.45, '<');
    tweenJoint(tl, q('.j-arm-a'), 20, 0.45, '<');
    tweenJoint(tl, q('.j-arm-b'), -18, 0.45, '<');
  });

  return (
    <Frame
      ref={ref}
      title="Treadmill · 8–12% incline"
      phaseA="① Drive knee"
      phaseB="② Push back"
      sets={sets}
      reps={reps}
    >
      <line x1="20" y1="142" x2="220" y2="92" stroke={C.metal} strokeWidth="10" strokeLinecap="round" />
      <line x1="20" y1="142" x2="220" y2="92" stroke={C.accentDim} strokeWidth="2" strokeDasharray="6 4" />
      <rect x="204" y="46" width="14" height="54" rx="2" fill={C.equip} />

      <g transform="translate(118,46)">
        <Head r={9} />
      </g>
      <g transform="translate(124,74) rotate(8)">
        <TorsoFront rx={13} ry={22} />
      </g>

      <g className="j-leg-a" transform="translate(128,94)">
        <Seg x2={-18} y2={36} w={8.5} />
      </g>
      <g className="j-leg-b" transform="translate(128,94)">
        <Seg x2={28} y2={22} w={8.5} color={C.accent} />
      </g>
      <g className="j-arm-a" transform="translate(118,64)">
        <Seg x2={-20} y2={22} w={7} />
      </g>
      <g className="j-arm-b" transform="translate(118,64)">
        <Seg x2={24} y2={16} w={7} color={C.accent} />
      </g>
    </Frame>
  );
}

export function BikeAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    gsap.to(q('.j-crank'), {
      rotation: 360,
      duration: 0.7,
      repeat: -1,
      ease: 'none',
      transformOrigin: '0 0',
    });
    gsap.to(q('.j-pedal'), {
      rotation: 360,
      duration: 0.7,
      repeat: -1,
      ease: 'none',
      transformOrigin: '0 0',
    });
  });

  return (
    <Frame
      ref={ref}
      title="Bike · 30s hard / 60s easy"
      phaseA="① Hard effort"
      phaseB="② Easy spin"
      sets={sets}
      reps={reps}
    >
      <circle cx="72" cy="128" r="24" fill="none" stroke={C.metal} strokeWidth="4.5" />
      <circle cx="168" cy="128" r="24" fill="none" stroke={C.metal} strokeWidth="4.5" />
      <line x1="72" y1="128" x2="168" y2="128" stroke={C.equip} strokeWidth="4.5" />
      <line x1="120" y1="128" x2="120" y2="96" stroke={C.equip} strokeWidth="3.5" />
      <line x1="120" y1="96" x2="90" y2="76" stroke={C.equip} strokeWidth="3.5" />

      <g className="j-crank" transform="translate(120,128)">
        <circle r="6" fill={C.accent} />
        <line x1="0" y1="0" x2="16" y2="0" stroke={C.metalLight} strokeWidth="3" />
      </g>

      <g transform="translate(104,48)">
        <Head r={9} />
      </g>
      <g transform="translate(110,74) rotate(12)">
        <TorsoFront rx={13} ry={20} />
      </g>
      <g transform="translate(102,64)">
        <Seg x2={-18} y2={14} w={7} />
        <g transform="translate(-18,14)">
          <Hand r={3.5} />
        </g>
      </g>
      <g className="j-pedal" transform="translate(118,92)">
        <Seg x2={16} y2={36} w={8.5} />
      </g>
    </Frame>
  );
}
