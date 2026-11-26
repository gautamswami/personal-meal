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
  Plate,
  Dumbbell,
  BarbellFlat,
  TorsoFront,
  Shorts,
  MuscleGlow,
  useRepAnim,
  rep,
} from './kit';

export function LatPulldownAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm-l'), -55);
    setJointRotation(q('.j-arm-r'), 55);
    setJointRotation(q('.j-el-l'), -15);
    setJointRotation(q('.j-el-r'), 15);
    gsap.set(q('.j-bar'), { y: 0 });
    rep(tl, {
      eccDur: 1.15,
      conDur: 1.0,
      // start overhead; pull down is concentric for lats
      ecc: [
        { target: q('.j-arm-l'), vars: { rotation: -20 } },
        { target: q('.j-arm-r'), vars: { rotation: 20 } },
        { target: q('.j-el-l'), vars: { rotation: -70 } },
        { target: q('.j-el-r'), vars: { rotation: 70 } },
        { target: q('.j-bar'), vars: { y: 36 } },
      ],
      con: [
        { target: q('.j-arm-l'), vars: { rotation: -55 } },
        { target: q('.j-arm-r'), vars: { rotation: 55 } },
        { target: q('.j-el-l'), vars: { rotation: -15 } },
        { target: q('.j-el-r'), vars: { rotation: 15 } },
        { target: q('.j-bar'), vars: { y: 0 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Lat pulldown · wide grip"
      phaseA="① Arms long overhead"
      phaseB="② Pull to upper chest"
      sets={sets}
      reps={reps}
      muscleLabel="Lats"
    >
      <rect x="104" y="10" width="32" height="12" rx="2" fill={C.metal} />
      <line x1="120" y1="22" x2="120" y2="34" stroke={C.equip} strokeWidth="2.5" />
      <rect x="68" y="132" width="104" height="10" rx="2" fill={C.bench} />
      <rect x="78" y="120" width="34" height="10" rx="2" fill={C.pad} />
      <rect x="128" y="120" width="34" height="10" rx="2" fill={C.pad} />

      <g transform="translate(120,78)">
        <Head face="front" r={9.5} />
      </g>
      <g transform="translate(120,102)">
        <TorsoFront rx={22} ry={22} />
        <MuscleGlow type="lats" scale={1.1} />
      </g>
      <g transform="translate(120,120)">
        <Shorts />
      </g>

      <g className="j-bar" transform="translate(120,36)">
        <line x1="-64" y1="0" x2="64" y2="0" stroke={C.accent} strokeWidth="4.2" strokeLinecap="round" />
        <line x1="0" y1="-4" x2="0" y2="0" stroke={C.equip} strokeWidth="2" />
      </g>

      <g className="j-arm-l" transform="translate(104,96)">
        <Joint />
        <Seg x2={-48} y2={-58} w={8.5} />
        <g className="j-el-l" transform="translate(-48,-58)">
          <Hand />
        </g>
      </g>
      <g className="j-arm-r" transform="translate(136,96)">
        <Joint />
        <Seg x2={48} y2={-58} w={8.5} />
        <g className="j-el-r" transform="translate(48,-58)">
          <Hand />
        </g>
      </g>
    </Frame>
  );
}

export function SeatedRowAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm'), 0);
    setJointRotation(q('.j-el'), 0);
    gsap.set(q('.j-handle'), { x: 0 });
    rep(tl, {
      eccDur: 1.1,
      conDur: 0.95,
      ecc: [
        { target: q('.j-arm'), vars: { rotation: -8 } },
        { target: q('.j-el'), vars: { rotation: -55 } },
        { target: q('.j-handle'), vars: { x: -34 } },
      ],
      con: [
        { target: q('.j-arm'), vars: { rotation: 0 } },
        { target: q('.j-el'), vars: { rotation: 0 } },
        { target: q('.j-handle'), vars: { x: 0 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Seated cable row"
      phaseA="① Reach long"
      phaseB="② Pull to ribs"
      sets={sets}
      reps={reps}
      muscleLabel="Back"
    >
      <rect x="20" y="132" width="110" height="10" rx="2" fill={C.bench} />
      <rect x="196" y="28" width="14" height="108" rx="2" fill={C.metal} />
      <circle cx="203" cy="46" r="6" fill={C.equip} />

      <g transform="translate(72,68)">
        <Head r={9.5} />
      </g>
      <g transform="translate(76,98)">
        <TorsoFront rx={17} ry={26} />
        <MuscleGlow type="lats" scale={0.9} />
      </g>
      <g transform="translate(64,120)">
        <Seg x2={-18} y2={20} w={8} />
        <g transform="translate(-18,20)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(90,120)">
        <Seg x2={18} y2={20} w={8} />
        <g transform="translate(18,20)">
          <Foot look={1} />
        </g>
      </g>

      <g className="j-arm" transform="translate(92,100)">
        <Joint />
        <Seg x2={52} y2={0} w={8.5} />
        <g className="j-el" transform="translate(52,0)">
          <Joint />
          <g className="j-handle" transform="translate(8,0)">
            <Hand />
            <rect x={-6} y={-8} width="22" height="16" rx="3" fill={C.accent} />
          </g>
        </g>
      </g>
      <line x1="170" y1="100" x2="203" y2="48" stroke={C.equip} strokeWidth="2" strokeDasharray="4 3" />
    </Frame>
  );
}

export function BentRowAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm'), 15);
    setJointRotation(q('.j-el'), 10);
    rep(tl, {
      eccDur: 1.05,
      conDur: 0.9,
      ecc: [
        { target: q('.j-arm'), vars: { rotation: -25 } },
        { target: q('.j-el'), vars: { rotation: -55 } },
      ],
      con: [
        { target: q('.j-arm'), vars: { rotation: 15 } },
        { target: q('.j-el'), vars: { rotation: 10 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Barbell · hinge ~45°"
      phaseA="① Hang long"
      phaseB="② Row to ribs"
      sets={sets}
      reps={reps}
      muscleLabel="Back"
    >
      <g transform="translate(78,44)">
        <Head r={9.5} />
      </g>
      <g transform="translate(112,80) rotate(38)">
        <TorsoFront rx={17} ry={32} />
        <MuscleGlow type="lats" scale={0.95} />
      </g>
      <g transform="translate(132,108)">
        <Seg x2={-16} y2={30} w={9} />
        <g transform="translate(-16,30)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(140,108)">
        <Seg x2={18} y2={30} w={9} />
        <g transform="translate(18,30)">
          <Foot look={1} />
        </g>
      </g>

      <g className="j-arm" transform="translate(112,84)">
        <Joint />
        <Seg x2={4} y2={32} w={8.5} />
        <g className="j-el" transform="translate(4,32)">
          <Joint />
          <Seg x2={0} y2={10} w={7} />
          <g transform="translate(0,10)">
            <Hand />
            <BarbellFlat half={44} plateR={8} />
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function SingleArmRowAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm'), 25);
    setJointRotation(q('.j-el'), 15);
    rep(tl, {
      ecc: [
        { target: q('.j-arm'), vars: { rotation: -20 } },
        { target: q('.j-el'), vars: { rotation: -50 } },
      ],
      con: [
        { target: q('.j-arm'), vars: { rotation: 25 } },
        { target: q('.j-el'), vars: { rotation: 15 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Bench · 1-arm DB row"
      phaseA="① Hang & stretch"
      phaseB="② Elbow to hip"
      sets={sets}
      reps={reps}
      muscleLabel="Lats"
    >
      <rect x="34" y="98" width="96" height="14" rx="3" fill={C.bench} />
      <rect x="44" y="112" width="10" height="28" rx="2" fill={C.metal} />
      <rect x="102" y="112" width="10" height="28" rx="2" fill={C.metal} />

      <g transform="translate(64,70)">
        <Head r={9} />
      </g>
      <g transform="translate(92,92) rotate(14)">
        <ellipse cx={0} cy={0} rx={30} ry={13} fill={C.shirt} />
        <MuscleGlow type="lats" scale={0.8} />
      </g>
      <g transform="translate(56,78)">
        <Seg x2={-14} y2={16} w={7} />
        <g transform="translate(-14,16)">
          <Hand />
        </g>
      </g>
      <g transform="translate(108,100)">
        <Seg x2={16} y2={36} w={8.5} />
        <g transform="translate(16,36)">
          <Foot look={1} />
        </g>
      </g>

      <g className="j-arm" transform="translate(112,88)">
        <Joint />
        <Seg x2={36} y2={28} w={8.5} />
        <g className="j-el" transform="translate(36,28)">
          <Joint />
          <g transform="translate(6,4)">
            <Hand />
            <Dumbbell />
          </g>
        </g>
      </g>
    </Frame>
  );
}
