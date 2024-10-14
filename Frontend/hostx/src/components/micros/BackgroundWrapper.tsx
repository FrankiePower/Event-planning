// components/BackgroundWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  let landingGradient = "";

  switch (pathname) {
    case '/events':
      landingGradient = "from-gray-700 via-gray-800 to-gray-950";
      break;
    case '/manage-event':
        landingGradient = "from-[#121212] via-stone-900 to-black";
        break;
    default:
      landingGradient = "from-stone-600/90 via-stone-800 to-stone-950";
  }
  // landingGradient = "from-amber-950/90 via-amber-900 to-orange-950";
  // 

  return (
    <div className={`bg-gradient-to-b ${landingGradient} min-h-screen`}>
      {children}
    </div>
  );
}