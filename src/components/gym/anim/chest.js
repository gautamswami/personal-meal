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
  TorsoSide,
  TorsoFront,
  Shorts,
  MuscleGlow,
  useRepAnim,
  rep,
  Pivot,
} from './kit';

/**
 * Flat bench · 3/4 view
 * Bar + both hands are one GSAP unit so the grip never detaches.
 * Elbows fold as the bar lowers to mid-chest.
 */
export function BenchPressAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    gsap.set(q('.j-press'), { y: 0 });
    setJointRotation(q('.j-el-l'), 12);
    setJointRotation(q('.j-el-r'), -12);
    rep(tl, {
      eccDur: 1.25,
      conDur: 1.0,
      holdBottom: 0.3,
      ecc: [
        { target: q('.j-press'), vars: { y: 30 } },
        { target: q('.j-el-l'), vars: { rotation: 55 } },
        { target: q('.j-el-r'), vars: { rotation: -55 } },
      ],
      con: [
        { target: q('.j-press'), vars: { y: 0 } },
        { target: q('.j-el-l'), vars: { rotation: 12 } },
        { target: q('.j-el-r'), vars: { rotation: -12 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Flat bench · 3/4 view"
      phaseA="① Lower bar to mid-chest"
      phaseB="② Press & lock out"
      sets={sets}
      reps={reps}
      muscleLabel="Chest"
    >
      <rect x="28" y="20" width="9" height="118" rx="2" fill={C.metal} opacity="0.5" />
      <rect x="203" y="20" width="9" height="118" rx="2" fill={C.metal} opacity="0.5" />
      <rect x="22" y="44" width="22" height="5" rx="1" fill={C.equip} opacity="0.45" />
      <rect x="196" y="44" width="22" height="5" rx="1" fill={C.equip} opacity="0.45" />

      <rect x="52" y="118" width="136" height="14" rx="4" fill={C.bench} />
      <rect x="58" y="112" width="124" height="10" rx="3" fill={C.pad} />
      <rect x="68" y="132" width="11" height="18" rx="2" fill={C.metal} />
      <rect x="161" y="132" width="11" height="18" rx="2" fill={C.metal} />

      <g transform="translate(120,50)">
        <Head face="front" r={11} />
      </g>
      <ellipse cx="120" cy="96" rx="38" ry="24" fill={C.shirt} />
      <ellipse cx="120" cy="88" rx="24" ry="15" fill={C.muscleGlow} className="gp-muscle" />
      {/* planted shoulder joints on torso */}
      <circle cx="88" cy="84" r="5" fill={C.skin} stroke={C.skinDeep} strokeWidth="0.8" />
      <circle cx="152" cy="84" r="5" fill={C.skin} stroke={C.skinDeep} strokeWidth="0.8" />
      <rect x="100" y="112" width="40" height="14" rx="5" fill={C.shorts} />
      <g transform="translate(100,124)">
        <Seg x2={-16} y2={18} w={9} />
        <g transform="translate(-16,18)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(140,124)">
        <Seg x2={16} y2={18} w={9} />
        <g transform="translate(16,18)">
          <Foot look={1} />
        </g>
      </g>

      {/* Pivot keeps x/y placement; GSAP only moves the inner .j-press */}
      <Pivot x={120} y={52} className="j-press">
        <BarbellFlat half={58} plateR={11} />
        <g transform="translate(-42,0)">
          <Hand r={5} />
          <g className="j-el-l">
            <Seg x2={4} y2={30} w={10} />
            <g transform="translate(4,30)">
              <Joint r={4} />
              <Seg x2={-8} y2={8} w={9} />
            </g>
          </g>
        </g>
        <g transform="translate(42,0)">
          <Hand r={5} />
          <g className="j-el-r">
            <Seg x2={-4} y2={30} w={10} />
            <g transform="translate(-4,30)">
              <Joint r={4} />
              <Seg x2={8} y2={8} w={9} />
            </g>
          </g>
        </g>
      </Pivot>
    </Frame>
  );
}

export function InclineDbPressAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm-l'), 18);
    setJointRotation(q('.j-arm-r'), 18);
    setJointRotation(q('.j-el-l'), 55);
    setJointRotation(q('.j-el-r'), 55);
    rep(tl, {
      eccDur: 1.15,
      conDur: 0.9,
      ecc: [
        { target: q('.j-arm-l'), vars: { rotation: 42 } },
        { target: q('.j-arm-r'), vars: { rotation: 42 } },
        { target: q('.j-el-l'), vars: { rotation: 95 } },
        { target: q('.j-el-r'), vars: { rotation: 95 } },
      ],
      con: [
        { target: q('.j-arm-l'), vars: { rotation: 18 } },
        { target: q('.j-arm-r'), vars: { rotation: 18 } },
        { target: q('.j-el-l'), vars: { rotation: 55 } },
        { target: q('.j-el-r'), vars: { rotation: 55 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Incline 30–45° · dumbbells"
      phaseA="① Lower with stretch"
      phaseB="② Press up"
      sets={sets}
      reps={reps}
      muscleLabel="Upper chest"
    >
      <path d="M40 148 L40 108 L150 52 L150 148 Z" fill={C.bench} opacity="0.92" />
      <line x1="40" y1="108" x2="150" y2="52" stroke={C.metal} strokeWidth="8" strokeLinecap="round" />

      <g transform="translate(102,92) rotate(-28)">
        <TorsoSide rx={38} ry={15} />
        <MuscleGlow type="chest-side" />
      </g>
      <g transform="translate(148,50)">
        <Head r={9.5} />
      </g>
      <g transform="translate(68,112)">
        <Seg x2={-14} y2={28} w={8} />
        <g transform="translate(-14,28)">
          <Foot look={-1} />
        </g>
      </g>

      {/* near arm */}
      <g className="j-arm-l" transform="translate(92,78)">
        <Joint />
        <Seg x2={-22} y2={-8} w={8.5} />
        <g className="j-el-l" transform="translate(-22,-8)">
          <Joint />
          <Seg x2={-18} y2={-14} w={7.5} />
          <g transform="translate(-18,-14)">
            <Hand />
            <Dumbbell />
          </g>
        </g>
      </g>
      {/* far arm */}
      <g className="j-arm-r" transform="translate(118,66)">
        <Joint />
        <Seg x2={22} y2={-10} w={8.5} />
        <g className="j-el-r" transform="translate(22,-10)">
          <Joint />
          <Seg x2={18} y2={-14} w={7.5} />
          <g transform="translate(18,-14)">
            <Hand />
            <Dumbbell />
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function DbBenchAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-arm-l'), -25);
    setJointRotation(q('.j-arm-r'), 25);
    setJointRotation(q('.j-el-l'), -40);
    setJointRotation(q('.j-el-r'), 40);
    rep(tl, {
      ecc: [
        { target: q('.j-arm-l'), vars: { rotation: -55 } },
        { target: q('.j-arm-r'), vars: { rotation: 55 } },
        { target: q('.j-el-l'), vars: { rotation: -85 } },
        { target: q('.j-el-r'), vars: { rotation: 85 } },
      ],
      con: [
        { target: q('.j-arm-l'), vars: { rotation: -25 } },
        { target: q('.j-arm-r'), vars: { rotation: 25 } },
        { target: q('.j-el-l'), vars: { rotation: -40 } },
        { target: q('.j-el-r'), vars: { rotation: 40 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Flat bench · dumbbells"
      phaseA="① Lower wide"
      phaseB="② Press & squeeze"
      sets={sets}
      reps={reps}
      muscleLabel="Chest"
    >
      <rect x="48" y="108" width="144" height="14" rx="3" fill={C.bench} />
      <rect x="64" y="122" width="10" height="24" rx="2" fill={C.metal} />
      <rect x="166" y="122" width="10" height="24" rx="2" fill={C.metal} />

      <g transform="translate(120,100)">
        <TorsoSide rx={48} ry={13} />
        <MuscleGlow type="chest-front" scale={0.95} />
      </g>
      <g transform="translate(172,84)">
        <Head r={9.5} />
      </g>
      <g transform="translate(78,112)">
        <Seg x2={-16} y2={26} w={8} />
        <g transform="translate(-16,26)">
          <Foot look={-1} />
        </g>
      </g>

      <g className="j-arm-l" transform="translate(88,92)">
        <Joint />
        <Seg x2={0} y2={-28} w={8.5} />
        <g className="j-el-l" transform="translate(0,-28)">
          <Joint />
          <Seg x2={0} y2={-22} w={7.5} />
          <g transform="translate(0,-22)">
            <Hand />
            <Dumbbell />
          </g>
        </g>
      </g>
      <g className="j-arm-r" transform="translate(148,92)">
        <Joint />
        <Seg x2={0} y2={-28} w={8.5} />
        <g className="j-el-r" transform="translate(0,-28)">
          <Joint />
          <Seg x2={0} y2={-22} w={7.5} />
          <g transform="translate(0,-22)">
            <Hand />
            <Dumbbell />
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function CableFlyAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, setJointRotation }) => {
    // Arms start open (stretch); hinge at shoulders only — body stays planted
    setJointRotation(q('.j-arm-l'), 0);
    setJointRotation(q('.j-arm-r'), 0);
    rep(tl, {
      eccDur: 1.15,
      conDur: 1.05,
      holdBottom: 0.3,
      ecc: [
        { target: q('.j-arm-l'), vars: { rotation: 58 } },
        { target: q('.j-arm-r'), vars: { rotation: -58 } },
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
      title="Cable fly · hug the midline"
      phaseA="① Squeeze to midline"
      phaseB="② Open with stretch"
      sets={sets}
      reps={reps}
      muscleLabel="Chest"
    >
      {/* cable towers */}
      <rect x="14" y="18" width="12" height="122" rx="2" fill={C.metal} />
      <rect x="214" y="18" width="12" height="122" rx="2" fill={C.metal} />
      <circle cx="20" cy="30" r="6" fill={C.equip} />
      <circle cx="220" cy="30" r="6" fill={C.equip} />

      {/* planted body — never animated */}
      <g transform="translate(120,40)">
        <Head face="front" r={11} />
      </g>
      <g transform="translate(120,78)">
        <TorsoFront rx={22} ry={32} />
        <MuscleGlow type="chest-front" scale={1.2} />
      </g>
      {/* shoulder sockets on the torso (not the neck) */}
      <circle cx="96" cy="70" r="7" fill={C.skin} stroke={C.skinDeep} strokeWidth="1" />
      <circle cx="144" cy="70" r="7" fill={C.skin} stroke={C.skinDeep} strokeWidth="1" />
      <g transform="translate(120,108)">
        <Shorts />
      </g>
      <g transform="translate(106,122)">
        <Seg x2={-14} y2={20} w={8} />
        <g transform="translate(-14,20)">
          <Foot look={-1} />
        </g>
      </g>
      <g transform="translate(134,122)">
        <Seg x2={14} y2={20} w={8} />
        <g transform="translate(14,20)">
          <Foot look={1} />
        </g>
      </g>

      <line x1="20" y1="30" x2="52" y2="74" stroke={C.equip} strokeWidth="1.6" strokeDasharray="3 2" />
      <line x1="220" y1="30" x2="188" y2="74" stroke={C.equip} strokeWidth="1.6" strokeDasharray="3 2" />

      {/* arms hinge from shoulder sockets — only rotate, body stays planted */}
      <Pivot x={96} y={70} className="j-arm-l">
        <Seg x2={-52} y2={10} w={10} />
        <g transform="translate(-52,10)">
          <Hand r={5} />
          <circle r="6" fill={C.accent} />
        </g>
      </Pivot>
      <Pivot x={144} y={70} className="j-arm-r">
        <Seg x2={52} y2={10} w={10} />
        <g transform="translate(52,10)">
          <Hand r={5} />
          <circle r="6" fill={C.accent} />
        </g>
      </Pivot>
    </Frame>
  );
}

export function ChestDipAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    gsap.set(q('.j-body'), { y: 0, transformOrigin: '0 0' });
    setJointRotation(q('.j-arm-l'), -28);
    setJointRotation(q('.j-arm-r'), 28);
    setJointRotation(q('.j-el-l'), -20);
    setJointRotation(q('.j-el-r'), 20);
    rep(tl, {
      eccDur: 1.2,
      conDur: 0.95,
      ecc: [
        { target: q('.j-body'), vars: { y: 28 } },
        { target: q('.j-arm-l'), vars: { rotation: -55 } },
        { target: q('.j-arm-r'), vars: { rotation: 55 } },
        { target: q('.j-el-l'), vars: { rotation: -55 } },
        { target: q('.j-el-r'), vars: { rotation: 55 } },
      ],
      con: [
        { target: q('.j-body'), vars: { y: 0 } },
        { target: q('.j-arm-l'), vars: { rotation: -28 } },
        { target: q('.j-arm-r'), vars: { rotation: 28 } },
        { target: q('.j-el-l'), vars: { rotation: -20 } },
        { target: q('.j-el-r'), vars: { rotation: 20 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Parallel bars · lean forward"
      phaseA="① Lower elbows back"
      phaseB="② Press up"
      sets={sets}
      reps={reps}
      muscleLabel="Chest"
    >
      <line x1="52" y1="24" x2="52" y2="132" stroke={C.metal} strokeWidth="7" strokeLinecap="round" />
      <line x1="188" y1="24" x2="188" y2="132" stroke={C.metal} strokeWidth="7" strokeLinecap="round" />
      <line x1="52" y1="56" x2="188" y2="56" stroke={C.equip} strokeWidth="6" strokeLinecap="round" />

      <g className="j-body" transform="translate(120,58)">
        <g transform="translate(0,-2)">
          <Head face="front" r={9.5} />
        </g>
        <g transform="translate(0,32)">
          <TorsoFront rx={17} ry={26} />
          <MuscleGlow type="chest-front" />
        </g>
        <g transform="translate(-8,56)">
          <Seg x2={-10} y2={28} w={8} />
        </g>
        <g transform="translate(8,56)">
          <Seg x2={10} y2={28} w={8} />
        </g>

        <g className="j-arm-l" transform="translate(-12,18)">
          <Joint />
          <Seg x2={-36} y2={-18} w={8.5} />
          <g className="j-el-l" transform="translate(-36,-18)">
            <Joint />
            <Seg x2={-16} y2={-8} w={7} />
            <g transform="translate(-16,-8)">
              <Hand />
            </g>
          </g>
        </g>
        <g className="j-arm-r" transform="translate(12,18)">
          <Joint />
          <Seg x2={36} y2={-18} w={8.5} />
          <g className="j-el-r" transform="translate(36,-18)">
            <Joint />
            <Seg x2={16} y2={-8} w={7} />
            <g transform="translate(16,-8)">
              <Hand />
            </g>
          </g>
        </g>
      </g>
    </Frame>
  );
}
