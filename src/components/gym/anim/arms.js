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
  BarbellFlat,
  TorsoFront,
  TorsoSide,
  Shorts,
  MuscleGlow,
  useRepAnim,
  rep,
} from './kit';

export function TricepPushdownAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm-l'), 25);
    setJointRotation(q('.j-arm-r'), -25);
    setJointRotation(q('.j-el-l'), 55);
    setJointRotation(q('.j-el-r'), -55);
    rep(tl, {
      eccDur: 1.0,
      conDur: 0.85,
      ecc: [
        { target: q('.j-el-l'), vars: { rotation: 5 } },
        { target: q('.j-el-r'), vars: { rotation: -5 } },
        { target: q('.j-arm-l'), vars: { rotation: 8 } },
        { target: q('.j-arm-r'), vars: { rotation: -8 } },
      ],
      con: [
        { target: q('.j-el-l'), vars: { rotation: 55 } },
        { target: q('.j-el-r'), vars: { rotation: -55 } },
        { target: q('.j-arm-l'), vars: { rotation: 25 } },
        { target: q('.j-arm-r'), vars: { rotation: -25 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Cable · rope pushdown"
      phaseA="① Elbows bent"
      phaseB="② Lock & spread"
      sets={sets}
      reps={reps}
      muscleLabel="Triceps"
    >
      <rect x="108" y="10" width="24" height="12" rx="2" fill={C.metal} />
      <line x1="120" y1="22" x2="120" y2="40" stroke={C.equip} strokeWidth="2.5" />

      <g transform="translate(120,54)">
        <Head face="front" r={10} />
      </g>
      <g transform="translate(120,90)">
        <TorsoFront rx={17} ry={28} />
        <MuscleGlow type="triceps" />
      </g>
      <g transform="translate(120,114)">
        <Shorts />
      </g>
      <g transform="translate(106,128)">
        <Seg x2={-12} y2={18} w={8} />
        <g transform="translate(-12,18)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(134,128)">
        <Seg x2={12} y2={18} w={8} />
        <g transform="translate(12,18)">
          <Foot look={1} />
        </g>
      </g>

      <line x1="120" y1="40" x2="96" y2="88" stroke={C.accent} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="120" y1="40" x2="144" y2="88" stroke={C.accent} strokeWidth="2.6" strokeLinecap="round" />

      <g className="j-arm-l" transform="translate(106,74)">
        <Joint />
        <Seg x2={-8} y2={22} w={8} />
        <g className="j-el-l" transform="translate(-8,22)">
          <Joint />
          <Seg x2={-10} y2={16} w={7} />
          <g transform="translate(-10,16)">
            <Hand />
          </g>
        </g>
      </g>
      <g className="j-arm-r" transform="translate(134,74)">
        <Joint />
        <Seg x2={8} y2={22} w={8} />
        <g className="j-el-r" transform="translate(8,22)">
          <Joint />
          <Seg x2={10} y2={16} w={7} />
          <g transform="translate(10,16)">
            <Hand />
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function OverheadExtAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm'), 0);
    setJointRotation(q('.j-el'), 100);
    rep(tl, {
      ecc: [
        { target: q('.j-el'), vars: { rotation: 20 } },
      ],
      con: [
        { target: q('.j-el'), vars: { rotation: 100 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="DB · overhead extension"
      phaseA="① Bend behind head"
      phaseB="② Extend tall"
      sets={sets}
      reps={reps}
      muscleLabel="Triceps"
    >
      <g transform="translate(120,54)">
        <Head face="front" r={10} />
      </g>
      <g transform="translate(120,90)">
        <TorsoFront rx={16} ry={28} />
        <MuscleGlow type="triceps" scale={0.95} />
      </g>
      <g transform="translate(120,114)">
        <Shorts />
      </g>
      <g transform="translate(106,128)">
        <Seg x2={-12} y2={18} w={8} />
        <g transform="translate(-12,18)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(134,128)">
        <Seg x2={12} y2={18} w={8} />
        <g transform="translate(12,18)">
          <Foot look={1} />
        </g>
      </g>

      <g className="j-arm" transform="translate(120,62)">
        <Joint />
        <Seg x2={22} y2={-8} w={8.5} />
        <g className="j-el" transform="translate(22,-8)">
          <Joint />
          <Seg x2={-8} y2={-24} w={7.5} />
          <g transform="translate(-8,-24)">
            <Hand />
            <Dumbbell />
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function SkullCrusherAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    // Both forearms + bar share one elbow hinge so the bar stays in the hands
    setJointRotation(q('.j-forearms'), 0);
    rep(tl, {
      eccDur: 1.15,
      conDur: 0.9,
      ecc: [{ target: q('.j-forearms'), vars: { rotation: 78 } }],
      con: [{ target: q('.j-forearms'), vars: { rotation: 0 } }],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Flat bench · skull crusher"
      phaseA="① Lower to forehead"
      phaseB="② Extend arms"
      sets={sets}
      reps={reps}
      muscleLabel="Triceps"
    >
      <rect x="48" y="110" width="144" height="14" rx="3" fill={C.bench} />
      <g transform="translate(120,104)">
        <TorsoSide rx={46} ry={12} />
        <MuscleGlow type="triceps" scale={0.85} />
      </g>
      <g transform="translate(172,88)">
        <Head r={9.5} />
      </g>
      <g transform="translate(76,112)">
        <Seg x2={-16} y2={24} w={8} />
      </g>

      {/* fixed upper arms */}
      <g transform="translate(108,96)">
        <Seg x2={0} y2={-34} w={9} />
      </g>
      <g transform="translate(132,96)">
        <Seg x2={0} y2={-34} w={9} />
      </g>

      <g className="j-forearms" transform="translate(120,62)">
        <Joint />
        <g transform="translate(-12,0)">
          <Seg x2={0} y2={-20} w={7.5} />
          <g transform="translate(0,-20)">
            <Hand />
          </g>
        </g>
        <g transform="translate(12,0)">
          <Seg x2={0} y2={-20} w={7.5} />
          <g transform="translate(0,-20)">
            <Hand />
          </g>
        </g>
        <g transform="translate(0,-20)">
          <BarbellFlat half={34} plateR={6.5} />
        </g>
      </g>
    </Frame>
  );
}

export function BarbellCurlAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-curl'), 0);
    rep(tl, {
      eccDur: 1.05,
      conDur: 0.95,
      // first half = curl up (phase B label after mid); start hang
      ecc: [{ target: q('.j-curl'), vars: { rotation: -118 } }],
      con: [{ target: q('.j-curl'), vars: { rotation: 0 } }],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Standing · barbell curl"
      phaseA="① Curl to chest"
      phaseB="② Lower with control"
      sets={sets}
      reps={reps}
      muscleLabel="Biceps"
    >
      <g transform="translate(120,34)">
        <Head face="front" r={10} />
      </g>
      <g transform="translate(120,70)">
        <TorsoFront rx={17} ry={28} />
        <MuscleGlow type="biceps" scale={1.05} />
      </g>
      <g transform="translate(120,96)">
        <Shorts />
      </g>
      <g transform="translate(106,112)">
        <Seg x2={-12} y2={28} w={9} />
        <g transform="translate(-12,28)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(134,112)">
        <Seg x2={12} y2={28} w={9} />
        <g transform="translate(12,28)">
          <Foot look={1} />
        </g>
      </g>

      {/* single hinge at shoulders so bar stays glued to both hands */}
      <g className="j-curl" transform="translate(120,58)">
        <g transform="translate(-16,0)">
          <Joint />
          <Seg x2={-8} y2={46} w={8.5} />
          <g transform="translate(-8,46)">
            <Hand />
          </g>
        </g>
        <g transform="translate(16,0)">
          <Joint />
          <Seg x2={8} y2={46} w={8.5} />
          <g transform="translate(8,46)">
            <Hand />
          </g>
        </g>
        <g transform="translate(0,48)">
          <BarbellFlat half={46} plateR={7} />
        </g>
      </g>
    </Frame>
  );
}

export function HammerCurlAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-el-l'), 0);
    setJointRotation(q('.j-el-r'), 0);
    rep(tl, {
      ecc: [
        { target: q('.j-el-l'), vars: { rotation: -118 } },
        { target: q('.j-el-r'), vars: { rotation: 118 } },
      ],
      con: [
        { target: q('.j-el-l'), vars: { rotation: 0 } },
        { target: q('.j-el-r'), vars: { rotation: 0 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="DBs · neutral hammer curl"
      phaseA="① Curl up"
      phaseB="② Lower with control"
      sets={sets}
      reps={reps}
      muscleLabel="Biceps"
    >
      <g transform="translate(120,34)">
        <Head face="front" r={10} />
      </g>
      <g transform="translate(120,70)">
        <TorsoFront rx={17} ry={28} />
        <MuscleGlow type="biceps" />
      </g>
      <g transform="translate(120,96)">
        <Shorts />
      </g>
      <g transform="translate(106,112)">
        <Seg x2={-12} y2={28} w={9} />
        <g transform="translate(-12,28)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(134,112)">
        <Seg x2={12} y2={28} w={9} />
        <g transform="translate(12,28)">
          <Foot look={1} />
        </g>
      </g>

      <g transform="translate(104,58)">
        <Joint />
        <g className="j-el-l">
          <Seg x2={-10} y2={48} w={8.5} />
          <g transform="translate(-10,48)">
            <Hand />
            <Dumbbell vertical />
          </g>
        </g>
      </g>
      <g transform="translate(136,58)">
        <Joint />
        <g className="j-el-r">
          <Seg x2={10} y2={48} w={8.5} />
          <g transform="translate(10,48)">
            <Hand />
            <Dumbbell vertical />
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function PreacherCurlAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-el'), 15);
    rep(tl, {
      ecc: [{ target: q('.j-el'), vars: { rotation: -110 } }],
      con: [{ target: q('.j-el'), vars: { rotation: 15 } }],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Preacher bench · curl"
      phaseA="① Extend on pad"
      phaseB="② Curl up"
      sets={sets}
      reps={reps}
      muscleLabel="Biceps"
    >
      <path d="M42 148 L78 62 L162 62 L130 148 Z" fill={C.bench} />
      <line x1="78" y1="62" x2="162" y2="62" stroke={C.metal} strokeWidth="6" />
      <g transform="translate(104,46)">
        <Head r={9} />
      </g>
      <g transform="translate(116,74)">
        <ellipse cx={0} cy={0} rx={15} ry={13} fill={C.shirt} />
        <MuscleGlow type="biceps" scale={0.7} />
      </g>

      <g transform="translate(102,64)">
        <Joint />
        <Seg x2={14} y2={40} w={10} />
        <g className="j-el" transform="translate(14,40)">
          <Joint />
          <g transform="translate(0,8)">
            <Hand />
            <BarbellFlat half={26} plateR={6} />
          </g>
        </g>
      </g>
    </Frame>
  );
}
