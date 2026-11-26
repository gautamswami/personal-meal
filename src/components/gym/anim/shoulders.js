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
  Dumbbell,
  TorsoFront,
  Shorts,
  MuscleGlow,
  useRepAnim,
  rep,
  Pivot,
} from './kit';

export function ShoulderPressAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    // Start DBs at ear height; press = straighten elbows overhead
    setJointRotation(q('.j-arm-l'), -40);
    setJointRotation(q('.j-arm-r'), 40);
    setJointRotation(q('.j-el-l'), -95);
    setJointRotation(q('.j-el-r'), 95);
    rep(tl, {
      eccDur: 1.05,
      conDur: 0.95,
      ecc: [
        { target: q('.j-arm-l'), vars: { rotation: -8 } },
        { target: q('.j-arm-r'), vars: { rotation: 8 } },
        { target: q('.j-el-l'), vars: { rotation: -8 } },
        { target: q('.j-el-r'), vars: { rotation: 8 } },
      ],
      con: [
        { target: q('.j-arm-l'), vars: { rotation: -40 } },
        { target: q('.j-arm-r'), vars: { rotation: 40 } },
        { target: q('.j-el-l'), vars: { rotation: -95 } },
        { target: q('.j-el-r'), vars: { rotation: 95 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Seated DB shoulder press"
      phaseA="① Press overhead"
      phaseB="② Lower to ears"
      sets={sets}
      reps={reps}
      muscleLabel="Shoulders"
    >
      <rect x="78" y="96" width="84" height="48" rx="5" fill={C.bench} />
      <rect x="86" y="88" width="68" height="12" rx="3" fill={C.pad} />
      <g transform="translate(120,44)">
        <Head face="front" r={11} />
      </g>
      <g transform="translate(120,76)">
        <TorsoFront rx={19} ry={28} />
        <MuscleGlow type="shoulder" scale={1.1} />
      </g>

      <Pivot x={102} y={68} className="j-arm-l">
        <Joint r={4.2} />
        <Seg x2={-8} y2={24} w={9} />
        <Pivot x={-8} y={24} className="j-el-l">
          <Joint />
          <Seg x2={-4} y2={-26} w={8} />
          <g transform="translate(-4,-26)">
            <Hand />
            <Dumbbell />
          </g>
        </Pivot>
      </Pivot>
      <Pivot x={138} y={68} className="j-arm-r">
        <Joint r={4.2} />
        <Seg x2={8} y2={24} w={9} />
        <Pivot x={8} y={24} className="j-el-r">
          <Joint />
          <Seg x2={4} y2={-26} w={8} />
          <g transform="translate(4,-26)">
            <Hand />
            <Dumbbell />
          </g>
        </Pivot>
      </Pivot>
    </Frame>
  );
}

export function LateralRaiseAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm-l'), 0);
    setJointRotation(q('.j-arm-r'), 0);
    rep(tl, {
      eccDur: 1.05,
      conDur: 0.95,
      ecc: [
        { target: q('.j-arm-l'), vars: { rotation: -72 } },
        { target: q('.j-arm-r'), vars: { rotation: 72 } },
      ],
      con: [
        { target: q('.j-arm-l'), vars: { rotation: 0 } },
        { target: q('.j-arm-r'), vars: { rotation: 0 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Standing · lateral raise"
      phaseA="① Raise to shoulders"
      phaseB="② Lower with control"
      sets={sets}
      reps={reps}
      muscleLabel="Side delts"
    >
      <g transform="translate(120,32)">
        <Head face="front" r={10} />
      </g>
      <g transform="translate(120,68)">
        <TorsoFront rx={17} ry={28} />
        <MuscleGlow type="shoulder" scale={1.1} />
      </g>
      <g transform="translate(120,94)">
        <Shorts />
      </g>
      <g transform="translate(106,110)">
        <Seg x2={-12} y2={28} w={9} />
        <g transform="translate(-12,28)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(134,110)">
        <Seg x2={12} y2={28} w={9} />
        <g transform="translate(12,28)">
          <Foot look={1} />
        </g>
      </g>
      <line x1="48" y1="58" x2="192" y2="58" stroke={C.accentDim} strokeWidth="1.3" strokeDasharray="3 3" />
      <text x="194" y="60" fill={C.accent} fontSize="7" fontFamily="system-ui" opacity="0.8">
        shoulder
      </text>

      <Pivot x={104} y={56} className="j-arm-l">
        <Joint />
        <Seg x2={-40} y2={36} w={9} />
        <g transform="translate(-40,36)">
          <Hand />
          <Dumbbell />
        </g>
      </Pivot>
      <Pivot x={136} y={56} className="j-arm-r">
        <Joint />
        <Seg x2={40} y2={36} w={9} />
        <g transform="translate(40,36)">
          <Hand />
          <Dumbbell />
        </g>
      </Pivot>
    </Frame>
  );
}

export function FrontRaiseAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm'), 15);
    rep(tl, {
      ecc: [{ target: q('.j-arm'), vars: { rotation: -80 } }],
      con: [{ target: q('.j-arm'), vars: { rotation: 15 } }],
    });
  });

  return (
    <Frame
      ref={ref}
      title="DB front raise · eye level"
      phaseA="① At thighs"
      phaseB="② Raise to eyes"
      sets={sets}
      reps={reps}
      muscleLabel="Front delts"
    >
      <g transform="translate(120,32)">
        <Head face="front" r={10} />
      </g>
      <g transform="translate(120,68)">
        <TorsoFront rx={17} ry={28} />
        <MuscleGlow type="shoulder" scale={0.95} />
      </g>
      <g transform="translate(120,94)">
        <Shorts />
      </g>
      <g transform="translate(106,110)">
        <Seg x2={-12} y2={28} w={9} />
        <g transform="translate(-12,28)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(134,110)">
        <Seg x2={12} y2={28} w={9} />
        <g transform="translate(12,28)">
          <Foot look={1} />
        </g>
      </g>
      <line x1="120" y1="40" x2="180" y2="40" stroke={C.accentDim} strokeWidth="1.3" strokeDasharray="3 3" />
      <text x="182" y="42" fill={C.accent} fontSize="7" fontFamily="system-ui" opacity="0.8">
        eye
      </text>

      <Pivot x={132} y={56} className="j-arm">
        <Joint />
        <Seg x2={12} y2={48} w={9} />
        <g transform="translate(12,48)">
          <Hand />
          <Dumbbell />
        </g>
      </Pivot>
    </Frame>
  );
}

export function RearDeltFlyAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, setJointRotation }) => {
    // Start hanging under torso; raise out to the sides
    setJointRotation(q('.j-arm-l'), 0);
    setJointRotation(q('.j-arm-r'), 0);
    rep(tl, {
      eccDur: 1.15,
      conDur: 1.0,
      holdBottom: 0.28,
      ecc: [
        { target: q('.j-arm-l'), vars: { rotation: -78 } },
        { target: q('.j-arm-r'), vars: { rotation: 78 } },
      ],
      con: [
        { target: q('.j-arm-l'), vars: { rotation: 0 } },
        { target: q('.j-arm-r'), vars: { rotation: 0 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Hinge · rear delt fly"
      phaseA="① Raise arms wide"
      phaseB="② Lower under chest"
      sets={sets}
      reps={reps}
      muscleLabel="Rear delts"
    >
      {/* back / 3/4 view — hinged torso, two clear shoulder pivots */}
      <ellipse cx="120" cy="148" rx="40" ry="5" fill="#000" opacity="0.35" />

      {/* legs */}
      <g transform="translate(102,118)">
        <Seg x2={-10} y2={26} w={9} />
        <g transform="translate(-10,26)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(138,118)">
        <Seg x2={10} y2={26} w={9} />
        <g transform="translate(10,26)">
          <Foot look={1} />
        </g>
      </g>

      {/* hinged torso leaning toward camera/down */}
      <ellipse cx="120" cy="88" rx="28" ry="36" fill={C.shirt} transform="rotate(8 120 88)" />
      {/* rear delt highlight on upper back — soft, not mistakable for weights */}
      <ellipse className="gp-muscle" cx="104" cy="72" rx="10" ry="8" fill={C.muscleSoft} />
      <ellipse className="gp-muscle" cx="136" cy="72" rx="10" ry="8" fill={C.muscleSoft} />

      <g transform="translate(120,48)">
        <Head face="front" r={11} />
      </g>

      {/* shoulder sockets fixed on torso */}
      <circle cx="96" cy="70" r="6" fill={C.skin} stroke={C.skinDeep} strokeWidth="1" />
      <circle cx="144" cy="70" r="6" fill={C.skin} stroke={C.skinDeep} strokeWidth="1" />

      {/* arms hang down from shoulders, then open wide */}
      <Pivot x={96} y={70} className="j-arm-l">
        <Seg x2={-4} y2={42} w={9} />
        <g transform="translate(-4,42)">
          <Hand r={4.5} />
          <Dumbbell />
        </g>
      </Pivot>
      <Pivot x={144} y={70} className="j-arm-r">
        <Seg x2={4} y2={42} w={9} />
        <g transform="translate(4,42)">
          <Hand r={4.5} />
          <Dumbbell />
        </g>
      </Pivot>
    </Frame>
  );
}

export function FacePullAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    gsap.set(q('.j-pull'), { x: 0 });
    setJointRotation(q('.j-arm-l'), 10);
    setJointRotation(q('.j-arm-r'), -10);
    rep(tl, {
      ecc: [
        { target: q('.j-pull'), vars: { x: -36 } },
        { target: q('.j-arm-l'), vars: { rotation: -35 } },
        { target: q('.j-arm-r'), vars: { rotation: 35 } },
      ],
      con: [
        { target: q('.j-pull'), vars: { x: 0 } },
        { target: q('.j-arm-l'), vars: { rotation: 10 } },
        { target: q('.j-arm-r'), vars: { rotation: -10 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Cable · face pull"
      phaseA="① Arms reach"
      phaseB="② Pull to face"
      sets={sets}
      reps={reps}
      muscleLabel="Rear delts"
    >
      <rect x="200" y="22" width="14" height="110" rx="2" fill={C.metal} />
      <circle cx="207" cy="44" r="6" fill={C.equip} />

      <g transform="translate(82,52)">
        <Head face="front" r={10} />
      </g>
      <g transform="translate(82,86)">
        <TorsoFront rx={15} ry={28} />
        <MuscleGlow type="rear-delt" scale={0.9} />
      </g>
      <g transform="translate(82,110)">
        <Shorts />
      </g>
      <g transform="translate(68,124)">
        <Seg x2={-12} y2={18} w={8} />
        <g transform="translate(-12,18)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(96,124)">
        <Seg x2={12} y2={18} w={8} />
        <g transform="translate(12,18)">
          <Foot look={1} />
        </g>
      </g>

      <g className="j-pull" transform="translate(150,54)">
        <line x1="0" y1="-4" x2="50" y2="-8" stroke={C.accent} strokeWidth="2.8" strokeLinecap="round" />
        <line x1="0" y1="8" x2="50" y2="4" stroke={C.accent} strokeWidth="2.8" strokeLinecap="round" />
        <line x1="50" y1="-2" x2="57" y2="-10" stroke={C.equip} strokeWidth="2" strokeDasharray="3 2" />
        <g className="j-arm-l" transform="translate(0,-4)">
          <Hand />
        </g>
        <g className="j-arm-r" transform="translate(0,8)">
          <Hand />
        </g>
      </g>
    </Frame>
  );
}
