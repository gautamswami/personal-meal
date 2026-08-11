'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();
  const todayActive = pathname === '/';
  const progressActive = pathname === '/progress';

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-[#2c2c2e] bg-black/95 backdrop-blur">
      <div className="max-w-md mx-auto grid grid-cols-2 h-14 relative">
        <Link
          href="/"
          className={`relative flex flex-col items-center justify-center gap-0.5 text-xs font-medium ${
            todayActive ? 'text-[#a3e635]' : 'text-[#8e8e93]'
          }`}
        >
          {todayActive && <span className="absolute top-0 inset-x-0 h-0.5 bg-[#a3e635]" />}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          Today
        </Link>
        <Link
          href="/progress"
          className={`relative flex flex-col items-center justify-center gap-0.5 text-xs font-medium ${
            progressActive ? 'text-[#a3e635]' : 'text-[#8e8e93]'
          }`}
        >
          {progressActive && <span className="absolute top-0 inset-x-0 h-0.5 bg-[#a3e635]" />}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Progress
        </Link>
      </div>
    </nav>
  );
}
