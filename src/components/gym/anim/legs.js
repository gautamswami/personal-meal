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

export function BackSquatAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-hip'), 0);
    setJointRotation(q('.j-knee'), 0);
    setJointRotation(q('.j-torso'), 0);
    rep(tl, {
      eccDur: 1.25,
      conDur: 1.0,
      ecc: [
        { target: q('.j-hip'), vars: { rotation: 28 } },
        { target: q('.j-knee'), vars: { rotation: -70 } },
        { target: q('.j-torso'), vars: { rotation: 12 } },
      ],
      con: [
        { target: q('.j-hip'), vars: { rotation: 0 } },
        { target: q('.j-knee'), vars: { rotation: 0 } },
        { target: q('.j-torso'), vars: { rotation: 0 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Squat rack · side view"
      phaseA="① Stand tall"
      phaseB="② Sit to parallel"
      sets={sets}
      reps={reps}
      muscleLabel="Quads"
    >
      <line x1="40" y1="20" x2="40" y2="148" stroke={C.metal} strokeWidth="7" strokeLinecap="round" />
      <line x1="40" y1="48" x2="68" y2="48" stroke={C.equip} strokeWidth="4" />
      <line x1="90" y1="120" x2="210" y2="120" stroke={C.accentDim} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="176" y="116" fill={C.accent} fontSize="7" fontFamily="system-ui" opacity="0.85">
        parallel
      </text>

      {/* ankle planted — chain: ankle → knee → hip → torso → bar */}
      <g transform="translate(128,142)">
        <Foot look={1} />
        <g className="j-knee" transform="translate(0,-2)">
          <Seg x2={-6} y2={-34} w={10} />
          <g className="j-hip" transform="translate(-6,-34)">
            <Joint r={4} />
            <g transform="translate(0,-8)">
              <ellipse className="gp-muscle" cx={4} cy={10} rx={8} ry={14} fill={C.muscleGlow} />
            </g>
            <Seg x2={4} y2={-36} w={10} />
            <g className="j-torso" transform="translate(4,-36)">
              <Joint />
              <g transform="translate(4,-22)">
                <TorsoFront rx={14} ry={24} />
              </g>
              <g transform="translate(6,-50)">
                <Head r={9.5} />
              </g>
              {/* bar on upper traps — plate end-on */}
              <g transform="translate(-14,-36)">
                <Hand r={3.4} />
                <Plate r={11} />
              </g>
              <Seg x2={-14} y2={-34} w={6} />
            </g>
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function RdlAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-hip'), 0);
    setJointRotation(q('.j-arm'), 0);
    rep(tl, {
      eccDur: 1.25,
      conDur: 1.0,
      ecc: [
        { target: q('.j-hip'), vars: { rotation: 42 } },
        { target: q('.j-arm'), vars: { rotation: -8 } },
      ],
      con: [
        { target: q('.j-hip'), vars: { rotation: 0 } },
        { target: q('.j-arm'), vars: { rotation: 0 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Barbell · hip hinge"
      phaseA="① Tall hips"
      phaseB="② Hinge stretch"
      sets={sets}
      reps={reps}
      muscleLabel="Hams"
    >
      <g transform="translate(110,142)">
        <Foot look={-1} />
      </g>
      <g transform="translate(130,142)">
        <Foot look={1} />
      </g>

      <g className="j-hip" transform="translate(120,108)">
        <Joint r={4} />
        <g transform="translate(8,8)">
          <MuscleGlow type="hams" scale={1.1} />
        </g>
        <Seg x2={0} y2={-34} w={10} />
        <g transform="translate(0,-34)">
          <Joint />
          <g transform="translate(0,-24)">
            <TorsoFront rx={15} ry={26} />
          </g>
          <g transform="translate(0,-54)">
            <Head r={9.5} />
          </g>
          <g className="j-arm" transform="translate(0,-8)">
            <Seg x2={0} y2={36} w={7.5} />
            <g transform="translate(0,36)">
              <Hand />
              <BarbellFlat half={50} plateR={9} />
            </g>
          </g>
        </g>
        {/* legs down to feet */}
        <Seg x2={-10} y2={34} w={10} />
        <Seg x2={10} y2={34} w={10} />
      </g>
    </Frame>
  );
}

export function LegPressAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    gsap.set(q('.j-sled'), { x: 0, y: 0 });
    setJointRotation(q('.j-leg-l'), -35);
    setJointRotation(q('.j-leg-r'), -20);
    rep(tl, {
      eccDur: 1.2,
      conDur: 0.95,
      ecc: [
        { target: q('.j-sled'), vars: { x: -20, y: 24 } },
        { target: q('.j-leg-l'), vars: { rotation: -8 } },
        { target: q('.j-leg-r'), vars: { rotation: 5 } },
      ],
      con: [
        { target: q('.j-sled'), vars: { x: 0, y: 0 } },
        { target: q('.j-leg-l'), vars: { rotation: -35 } },
        { target: q('.j-leg-r'), vars: { rotation: -20 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Leg press machine"
      phaseA="① Knees ~90°"
      phaseB="② Press sled"
      sets={sets}
      reps={reps}
      muscleLabel="Quads"
    >
      <path d="M28 144 L96 40 L196 40 L196 72 L108 144 Z" fill={C.bench} />
      <rect x="96" y="40" width="100" height="10" fill={C.metal} />

      <g transform="translate(68,96)">
        <Head r={9} />
      </g>
      <g transform="translate(70,116)">
        <ellipse cx={0} cy={0} rx={19} ry={17} fill={C.shirt} />
      </g>

      <g className="j-sled" transform="translate(150,42)">
        <rect x={-32} y={-12} width="64" height="18" rx="2" fill={C.equip} />
        <rect x={-24} y={-20} width="48" height="10" rx="2" fill={C.accent} opacity="0.9" />
        <g className="j-leg-l" transform="translate(-20,8)">
          <Seg x2={-48} y2={52} w={10} />
          <g transform="translate(-48,52)">
            <Foot look={1} />
          </g>
        </g>
        <g className="j-leg-r" transform="translate(8,8)">
          <Seg x2={-40} y2={52} w={10} />
          <g transform="translate(-40,52)">
            <Foot look={1} />
          </g>
        </g>
      </g>
      <g transform="translate(118,90)">
        <MuscleGlow type="quads" scale={0.9} />
      </g>
    </Frame>
  );
}

export function LegExtensionAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-shin'), 55);
    rep(tl, {
      ecc: [{ target: q('.j-shin'), vars: { rotation: -15 } }],
      con: [{ target: q('.j-shin'), vars: { rotation: 55 } }],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Leg extension · squeeze quads"
      phaseA="① Knees bent"
      phaseB="② Kick out"
      sets={sets}
      reps={reps}
      muscleLabel="Quads"
    >
      <rect x="42" y="56" width="68" height="60" rx="6" fill={C.bench} />
      <circle cx="118" cy="106" r="8" fill={C.metal} />
      <g transform="translate(74,48)">
        <Head face="front" r={9.5} />
      </g>
      <g transform="translate(76,82)">
        <TorsoFront rx={15} ry={24} />
      </g>
      <g transform="translate(148,106)">
        <MuscleGlow type="quads" scale={0.85} />
      </g>

      <g className="j-shin" transform="translate(118,106)">
        <Joint r={4} />
        <Seg x2={48} y2={22} w={11} />
        <g transform="translate(48,22)">
          <rect x={-8} y={-6} width="32" height="13" rx="3" fill={C.accent} />
        </g>
      </g>
    </Frame>
  );
}

export function LyingLegCurlAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-shin'), 10);
    rep(tl, {
      ecc: [{ target: q('.j-shin'), vars: { rotation: -100 } }],
      con: [{ target: q('.j-shin'), vars: { rotation: 10 } }],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Lying leg curl"
      phaseA="① Legs straight"
      phaseB="② Heels to glutes"
      sets={sets}
      reps={reps}
      muscleLabel="Hams"
    >
      <rect x="30" y="90" width="130" height="14" rx="3" fill={C.bench} />
      <g transform="translate(48,74)">
        <Head r={9} />
      </g>
      <g transform="translate(104,92)">
        <ellipse cx={0} cy={0} rx={44} ry={13} fill={C.shirt} />
        <g transform="translate(36,4)">
          <MuscleGlow type="hams" scale={1.05} />
        </g>
      </g>

      <g className="j-shin" transform="translate(148,94)">
        <Joint />
        <Seg x2={34} y2={28} w={10} />
        <g transform="translate(34,28)">
          <circle r="10" fill={C.accent} />
        </g>
      </g>
    </Frame>
  );
}

export function LungeAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-front-knee'), 0);
    setJointRotation(q('.j-back-knee'), 0);
    gsap.set(q('.j-body'), { y: 0 });
    rep(tl, {
      eccDur: 1.1,
      conDur: 0.95,
      ecc: [
        { target: q('.j-body'), vars: { y: 16 } },
        { target: q('.j-front-knee'), vars: { rotation: -35 } },
        { target: q('.j-back-knee'), vars: { rotation: 40 } },
      ],
      con: [
        { target: q('.j-body'), vars: { y: 0 } },
        { target: q('.j-front-knee'), vars: { rotation: 0 } },
        { target: q('.j-back-knee'), vars: { rotation: 0 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="DB walking lunge"
      phaseA="① Step long"
      phaseB="② Drop to 90°"
      sets={sets}
      reps={reps}
      muscleLabel="Quads"
    >
      <line x1="60" y1="132" x2="190" y2="132" stroke={C.accentDim} strokeWidth="1.5" strokeDasharray="3 3" />
      <text x="150" y="126" fill={C.accent} fontSize="7" fontFamily="system-ui" opacity="0.85">
        90°
      </text>

      <g className="j-body" transform="translate(120,34)">
        <Head face="front" r={9.5} />
        <g transform="translate(0,30)">
          <TorsoFront rx={15} ry={24} />
          <MuscleGlow type="quads" scale={0.55} />
        </g>
        <g transform="translate(-18,28)">
          <Dumbbell />
        </g>
        <g transform="translate(18,28)">
          <Dumbbell />
        </g>

        <g className="j-front-knee" transform="translate(6,52)">
          <Seg x2={32} y2={40} w={9.5} />
          <g transform="translate(32,40)">
            <Joint />
            <Seg x2={10} y2={22} w={9} />
            <g transform="translate(10,22)">
              <Foot look={1} />
            </g>
          </g>
        </g>
        <g className="j-back-knee" transform="translate(-6,52)">
          <Seg x2={-34} y2={40} w={9.5} />
          <g transform="translate(-34,40)">
            <Joint />
            <Seg x2={-12} y2={22} w={9} />
            <g transform="translate(-12,22)">
              <Foot look={-1} />
            </g>
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function HipThrustAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    setJointRotation(q('.j-hip'), 28);
    rep(tl, {
      eccDur: 1.0,
      conDur: 0.9,
      ecc: [{ target: q('.j-hip'), vars: { rotation: -8 } }],
      con: [{ target: q('.j-hip'), vars: { rotation: 28 } }],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Bench · hip thrust"
      phaseA="① Hips low"
      phaseB="② Squeeze lockout"
      sets={sets}
      reps={reps}
      muscleLabel="Glutes"
    >
      <rect x="22" y="58" width="56" height="16" rx="3" fill={C.bench} />

      <g transform="translate(58,52)">
        <Head r={9} />
      </g>

      <g className="j-hip" transform="translate(78,66)">
        <Joint />
        <g transform="translate(40,8)">
          <ellipse cx={0} cy={0} rx={42} ry={13} fill={C.shirt} />
          <g transform="translate(16,4)">
            <MuscleGlow type="glutes" scale={1.15} />
          </g>
          <BarbellFlat half={36} plateR={7} />
        </g>
        <g transform="translate(72,16)">
          <Seg x2={-10} y2={48} w={10} />
          <g transform="translate(-10,48)">
            <Foot look={-1} />
          </g>
        </g>
        <g transform="translate(84,16)">
          <Seg x2={16} y2={48} w={10} />
          <g transform="translate(16,48)">
            <Foot look={1} />
          </g>
        </g>
      </g>
    </Frame>
  );
}

export function CalfRaiseAnim({ sets, reps }) {
  const ref = useRef(null);
  useRepAnim(ref, ({ q, tl, gsap, setJointRotation }) => {
    gsap.set(q('.j-body'), { y: 6 });
    setJointRotation(q('.j-ankle-l'), 18);
    setJointRotation(q('.j-ankle-r'), -18);
    rep(tl, {
      eccDur: 0.85,
      conDur: 0.7,
      holdBottom: 0.15,
      holdTop: 0.25,
      ecc: [
        { target: q('.j-body'), vars: { y: -12 } },
        { target: q('.j-ankle-l'), vars: { rotation: -25 } },
        { target: q('.j-ankle-r'), vars: { rotation: 25 } },
      ],
      con: [
        { target: q('.j-body'), vars: { y: 6 } },
        { target: q('.j-ankle-l'), vars: { rotation: 18 } },
        { target: q('.j-ankle-r'), vars: { rotation: -18 } },
      ],
    });
  });

  return (
    <Frame
      ref={ref}
      title="Calf raise · full ROM"
      phaseA="① Heels hang"
      phaseB="② Rise & squeeze"
      sets={sets}
      reps={reps}
      muscleLabel="Calves"
    >
      <rect x="78" y="132" width="84" height="10" rx="2" fill={C.bench} />
      <text x="168" y="136" fill={C.accent} fontSize="7" fontFamily="system-ui" opacity="0.8">
        stretch
      </text>

      <g className="j-body" transform="translate(120,32)">
        <Head face="front" r={10} />
        <g transform="translate(0,32)">
          <TorsoFront rx={15} ry={26} />
        </g>
        <g transform="translate(0,54)">
          <Shorts />
        </g>
        <g transform="translate(0,88)">
          <MuscleGlow type="calves" scale={1.05} />
        </g>
        <g className="j-ankle-l" transform="translate(-10,72)">
          <Seg x2={-6} y2={32} w={9.5} />
          <g transform="translate(-6,32)">
            <ellipse cx={-2} cy={0} rx={8} ry={3.2} fill={C.skin} />
          </g>
        </g>
        <g className="j-ankle-r" transform="translate(10,72)">
          <Seg x2={6} y2={32} w={9.5} />
          <g transform="translate(6,32)">
            <ellipse cx={2} cy={0} rx={8} ry={3.2} fill={C.skin} />
          </g>
        </g>
        <circle cx={0} cy={-12} r={6} fill={C.accent} opacity="0.9" />
      </g>
    </Frame>
  );
}
