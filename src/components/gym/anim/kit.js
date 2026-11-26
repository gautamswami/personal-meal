'use client';

import { forwardRef, useId, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export const C = {
  skin: '#e8b896',
  skinDeep: '#c9926e',
  hair: '#1a1a1c',
  shirt: '#5a5a60',
  shirtDark: '#3e3e44',
  shorts: '#2e2e32',
  bone: '#d4a882',
  muscle: '#a3e635',
  muscleGlow: 'rgba(163,230,53,0.55)',
  muscleSoft: 'rgba(163,230,53,0.28)',
  accent: '#a3e635',
  accentDim: 'rgba(163,230,53,0.4)',
  equip: '#9a9aa0',
  metal: '#4a4a4e',
  metalLight: '#6e6e73',
  bench: '#3a3a3c',
  pad: '#2a2a2e',
  floor: '#2c2c2e',
  ink: '#1c1c1e',
  ghost: 'rgba(174,174,178,0.22)',
};

function readTranslate(attr) {
  const m = /translate\(\s*([-\d.]+)[,\s]+([-\d.]+)\s*\)/.exec(attr || '');
  return m ? { x: m[1], y: m[2] } : null;
}

function writeJointTransform(node, deg) {
  const t = readTranslate(node.getAttribute('transform'));
  // Keep any sibling translate(...) so className+translate joints stay planted.
  // Pivot joints have translate on the parent — child only gets rotate(...).
  node.setAttribute(
    'transform',
    t ? `translate(${t.x},${t.y}) rotate(${deg})` : `rotate(${deg})`
  );
}

/**
 * Rotate an SVG joint around its local (0,0) using the SVG transform
 * attribute — never CSS transformOrigin (that drifts limbs off the body).
 */
export function setJointRotation(el, deg) {
  const nodes = el?.length != null ? [...el] : [el];
  nodes.forEach((node) => {
    if (node) writeJointTransform(node, deg);
  });
}

export function tweenJoint(tl, el, deg, duration, position) {
  const nodes = el?.length != null ? [...el] : [el];
  nodes.forEach((node, i) => {
    if (!node) return;
    const proxy = { a: 0 };
    const current = /rotate\(\s*([-\d.]+)/.exec(node.getAttribute('transform') || '');
    proxy.a = current ? Number(current[1]) : 0;
    tl.to(
      proxy,
      {
        a: deg,
        duration,
        ease: 'power2.inOut',
        onUpdate: () => writeJointTransform(node, proxy.a),
      },
      i === 0 ? position : '<'
    );
  });
}

/** Looping eccentric → concentric rep with phase labels */
export function useRepAnim(scopeRef, build, deps = []) {
  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      const root = scopeRef.current;
      if (!root) return;

      const q = gsap.utils.selector(root);

      const phaseA = q('.gp-phase-a');
      const phaseB = q('.gp-phase-b');
      if (phaseA.length) gsap.set(phaseA, { opacity: 1 });
      if (phaseB.length) gsap.set(phaseB, { opacity: 0 });

      const muscle = q('.gp-muscle');
      if (muscle.length) {
        gsap.to(muscle, {
          opacity: 0.55,
          duration: 1.2,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      }

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'power2.inOut' },
      });

      build({ q, tl, gsap, root, setJointRotation, tweenJoint });

      if (phaseA.length && phaseB.length && tl.duration() > 0) {
        const mid = tl.duration() / 2;
        tl.set(phaseA, { opacity: 0 }, mid - 0.05);
        tl.set(phaseB, { opacity: 1 }, mid - 0.05);
        tl.set(phaseB, { opacity: 0 }, tl.duration() - 0.05);
        tl.set(phaseA, { opacity: 1 }, tl.duration() - 0.05);
      }
    },
    { scope: scopeRef, dependencies: deps }
  );
}

export function Floor({ y = 144 }) {
  return (
    <>
      <ellipse cx="120" cy={y + 2} rx="100" ry="7" fill="#000" opacity="0.45" />
      <line x1="12" y1={y} x2="228" y2={y} stroke={C.floor} strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

export function Head({ r = 10, face = 'side', look = 1 }) {
  // Drawn at local origin (0,0) = center of head for joint nesting
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill={C.skin} />
      <ellipse cx={0} cy={-r * 0.5} rx={r * 0.88} ry={r * 0.36} fill={C.hair} />
      {face === 'front' ? (
        <>
          <circle cx={-3.2} cy={-0.4} r={1.5} fill={C.ink} opacity="0.75" />
          <circle cx={3.2} cy={-0.4} r={1.5} fill={C.ink} opacity="0.75" />
          <path d={`M${-2.8} 3.6 Q0 5.6 2.8 3.6`} fill="none" stroke={C.skinDeep} strokeWidth="1.2" />
        </>
      ) : (
        <>
          <circle cx={look * 3} cy={-0.3} r={1.6} fill={C.ink} opacity="0.75" />
          <path
            d={`M${look * 1.2} 3.2 Q${look * 3.2} 4.6 ${look * 4.8} 3`}
            fill="none"
            stroke={C.skinDeep}
            strokeWidth="1.15"
          />
        </>
      )}
    </g>
  );
}

export function Joint({ r = 3.6 }) {
  return <circle cx={0} cy={0} r={r} fill={C.skin} stroke={C.skinDeep} strokeWidth="0.9" />;
}

export function Seg({ x2, y2, w = 8, color = C.bone }) {
  return <line x1={0} y1={0} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />;
}

export function Hand({ r = 4.2 }) {
  return <circle cx={0} cy={0} r={r} fill={C.skin} stroke={C.skinDeep} strokeWidth="0.8" />;
}

export function Foot({ look = 1 }) {
  return <ellipse cx={look * 4} cy={0} rx={9} ry={3.2} fill={C.skin} />;
}

export function Plate({ r = 12 }) {
  return (
    <g>
      <circle cx={0} cy={0} r={r} fill={C.equip} stroke={C.accent} strokeWidth="1.6" />
      <circle cx={0} cy={0} r={r * 0.72} fill="none" stroke={C.metal} strokeWidth="1.2" />
      <circle cx={0} cy={0} r={r * 0.3} fill={C.metal} />
    </g>
  );
}

export function Dumbbell({ vertical = false }) {
  if (vertical) {
    return (
      <g>
        <rect x={-3.2} y={-12} width="6.4" height="24" rx="2.5" fill={C.metal} />
        <rect x={-6} y={-14} width="12" height="6" rx="2" fill={C.accent} />
        <rect x={-6} y={8} width="12" height="6" rx="2" fill={C.accent} />
      </g>
    );
  }
  return (
    <g>
      <circle cx={-8} cy={0} r="6.5" fill={C.accent} />
      <circle cx={8} cy={0} r="6.5" fill={C.accent} />
      <rect x={-6} y={-2.2} width="12" height="4.4" rx="1.5" fill={C.metal} />
    </g>
  );
}

export function BarbellFlat({ half = 42, plateR = 8 }) {
  return (
    <g>
      <line x1={-half} y1={0} x2={half} y2={0} stroke={C.accent} strokeWidth="4" strokeLinecap="round" />
      <g transform={`translate(${-half},0)`}>
        <Plate r={plateR} />
      </g>
      <g transform={`translate(${half},0)`}>
        <Plate r={plateR} />
      </g>
    </g>
  );
}

export function TorsoFront({ rx = 18, ry = 28 }) {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={C.shirt} />
      <ellipse cx={0} cy={2} rx={rx * 0.7} ry={ry * 0.55} fill={C.shirtDark} opacity="0.35" />
    </g>
  );
}

export function TorsoSide({ rx = 42, ry = 13 }) {
  return (
    <g>
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={C.shirt} />
      <ellipse cx={8} cy={-1} rx={rx * 0.45} ry={ry * 0.7} fill={C.shirtDark} opacity="0.3" />
    </g>
  );
}

export function Shorts() {
  return <rect x={-14} y={-2} width="28" height="16" rx="5" fill={C.shorts} />;
}

export function MuscleGlow({ type, scale = 1 }) {
  const s = scale;
  if (type === 'chest-front') {
    return (
      <g className="gp-muscle">
        <ellipse cx={-8 * s} cy={-6 * s} rx={9 * s} ry={7 * s} fill={C.muscleGlow} />
        <ellipse cx={8 * s} cy={-6 * s} rx={9 * s} ry={7 * s} fill={C.muscleGlow} />
      </g>
    );
  }
  if (type === 'chest-side') {
    return <ellipse className="gp-muscle" cx={10 * s} cy={-2 * s} rx={8 * s} ry={11 * s} fill={C.muscleGlow} />;
  }
  if (type === 'lats') {
    return (
      <g className="gp-muscle">
        <ellipse cx={-11 * s} cy={2 * s} rx={8 * s} ry={12 * s} fill={C.muscleGlow} />
        <ellipse cx={11 * s} cy={2 * s} rx={8 * s} ry={12 * s} fill={C.muscleGlow} />
      </g>
    );
  }
  if (type === 'abs') {
    return (
      <g className="gp-muscle">
        <rect x={-7 * s} y={-4 * s} width={14 * s} height={22 * s} rx={3} fill={C.muscleSoft} />
        <rect x={-5.5 * s} y={-1 * s} width={5 * s} height={4 * s} rx={1} fill={C.muscleGlow} />
        <rect x={0.5 * s} y={-1 * s} width={5 * s} height={4 * s} rx={1} fill={C.muscleGlow} />
        <rect x={-5.5 * s} y={5 * s} width={5 * s} height={4 * s} rx={1} fill={C.muscleGlow} />
        <rect x={0.5 * s} y={5 * s} width={5 * s} height={4 * s} rx={1} fill={C.muscleGlow} />
      </g>
    );
  }
  if (type === 'shoulder') {
    return (
      <g className="gp-muscle">
        <ellipse cx={-17 * s} cy={-12 * s} rx={7.5 * s} ry={6.5 * s} fill={C.muscleGlow} />
        <ellipse cx={17 * s} cy={-12 * s} rx={7.5 * s} ry={6.5 * s} fill={C.muscleGlow} />
      </g>
    );
  }
  if (type === 'biceps') {
    return (
      <g className="gp-muscle">
        <ellipse cx={-19 * s} cy={0} rx={5.5 * s} ry={8 * s} fill={C.muscleGlow} />
        <ellipse cx={19 * s} cy={0} rx={5.5 * s} ry={8 * s} fill={C.muscleGlow} />
      </g>
    );
  }
  if (type === 'triceps') {
    return (
      <g className="gp-muscle">
        <ellipse cx={-17 * s} cy={0} rx={5 * s} ry={9 * s} fill={C.muscleGlow} />
        <ellipse cx={17 * s} cy={0} rx={5 * s} ry={9 * s} fill={C.muscleGlow} />
      </g>
    );
  }
  if (type === 'quads') {
    return (
      <g className="gp-muscle">
        <ellipse cx={-9 * s} cy={0} rx={7.5 * s} ry={13 * s} fill={C.muscleGlow} />
        <ellipse cx={9 * s} cy={0} rx={7.5 * s} ry={13 * s} fill={C.muscleGlow} />
      </g>
    );
  }
  if (type === 'hams') {
    return <ellipse className="gp-muscle" cx={0} cy={0} rx={7 * s} ry={12 * s} fill={C.muscleGlow} />;
  }
  if (type === 'glutes') {
    return <ellipse className="gp-muscle" cx={0} cy={0} rx={11 * s} ry={8 * s} fill={C.muscleGlow} />;
  }
  if (type === 'calves') {
    return (
      <g className="gp-muscle">
        <ellipse cx={-9 * s} cy={0} rx={5.5 * s} ry={9 * s} fill={C.muscleGlow} />
        <ellipse cx={9 * s} cy={0} rx={5.5 * s} ry={9 * s} fill={C.muscleGlow} />
      </g>
    );
  }
  if (type === 'rear-delt') {
    return (
      <g className="gp-muscle">
        <ellipse cx={-15 * s} cy={-10 * s} rx={6.5 * s} ry={5.5 * s} fill={C.muscleGlow} />
        <ellipse cx={15 * s} cy={-10 * s} rx={6.5 * s} ry={5.5 * s} fill={C.muscleGlow} />
      </g>
    );
  }
  return null;
}

function PhaseCue({ a, b }) {
  return (
    <g className="gp-phase" fontFamily="var(--font-geist-sans),system-ui,sans-serif" fontSize="9" fontWeight="700">
      <rect x="6" y="5" width="136" height="18" rx="5" fill="#0a0a0a" opacity="0.88" />
      <text className="gp-phase-a" x="12" y="17.5" fill={C.accent}>
        {a}
      </text>
      <text className="gp-phase-b" x="12" y="17.5" fill={C.accent}>
        {b}
      </text>
    </g>
  );
}

function MuscleTag({ label }) {
  const w = Math.max(44, label.length * 5.4 + 12);
  return (
    <g fontFamily="var(--font-geist-sans),system-ui,sans-serif">
      <rect x={240 - w - 6} y={5} width={w} height="14" rx="4" fill={C.muscle} opacity="0.95" />
      <text x={240 - w} y={15} fill={C.ink} fontSize="8" fontWeight="700">
        {label}
      </text>
    </g>
  );
}

export const Frame = forwardRef(function Frame(
  { children, title, phaseA, phaseB, sets, reps, muscleLabel, viewBox = '0 0 240 168' },
  ref
) {
  const floorId = `ga-floor-${useId().replace(/:/g, '')}`;
  const localRef = useRef(null);
  const setRefs = (node) => {
    localRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div className="gym-anim-frame relative overflow-hidden rounded-xl bg-[#0a0a0a] border border-[#2c2c2e]">
      <svg ref={setRefs} viewBox={viewBox} className="w-full h-auto block" aria-hidden>
        <defs>
          <linearGradient id={floorId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#161616" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
        <rect width="240" height="168" fill={`url(#${floorId})`} />
        <Floor />
        {children}
        {phaseA && phaseB ? <PhaseCue a={phaseA} b={phaseB} /> : null}
        {muscleLabel ? <MuscleTag label={muscleLabel} /> : null}
      </svg>
      <div className="absolute bottom-1.5 left-2 right-2 flex items-end justify-between gap-2 pointer-events-none">
        <p className="text-[10px] text-[#636366] truncate leading-tight">{title}</p>
        {sets != null && reps != null ? (
          <span className="shrink-0 text-[10px] font-semibold text-[#a3e635] bg-[#1c1c1e]/90 border border-[#2c2c2e] rounded px-1.5 py-0.5">
            {sets}×{reps}
          </span>
        ) : null}
      </div>
    </div>
  );
});

/**
 * Helper: first-half motion → hold → return → hold.
 * Use `rotation` for joint hinges (SVG rotate around local 0,0).
 * Use other GSAP vars (y, x, …) for non-joint motion like a bar sliding.
 */
export function rep(tl, {
  ecc = [],
  con = [],
  eccDur = 1.15,
  conDur = 0.95,
  holdBottom = 0.22,
  holdTop = 0.18,
}) {
  const apply = (steps, duration, at) => {
    steps.forEach((step, i) => {
      const { target, vars } = step;
      const pos = i === 0 ? at : '<';
      if (vars && Object.prototype.hasOwnProperty.call(vars, 'rotation')) {
        tweenJoint(tl, target, vars.rotation, duration, pos);
        const rest = { ...vars };
        delete rest.rotation;
        if (Object.keys(rest).length) {
          tl.to(target, { ...rest, duration }, '<');
        }
      } else {
        tl.to(target, { ...vars, duration }, pos);
      }
    });
  };

  apply(ecc, eccDur, undefined);
  if (holdBottom) tl.to({}, { duration: holdBottom });
  apply(con, conDur, undefined);
  if (holdTop) tl.to({}, { duration: holdTop });
}

/** Position wrapper so GSAP rotation never eats the SVG translate */
export function Pivot({ x, y, className, children }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <g className={className}>{children}</g>
    </g>
  );
}
