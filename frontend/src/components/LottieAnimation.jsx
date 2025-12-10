import React, { Suspense, lazy } from 'react';

// Lazy load Lottie to improve initial bundle size
const Lottie = lazy(() => import('lottie-react'));

export default function LottieAnimation({
  animationData,
  animationUrl,
  className = '',
  loop = true,
  autoplay = true,
  speed = 1,
  style = {},
  ariaLabel = 'Animation',
}) {
  const [error, setError] = React.useState(false);

  // Fallback if Lottie fails to load
  if (error) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        role="img"
        aria-label={ariaLabel}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className={`flex items-center justify-center ${className}`}
          role="img"
          aria-label={`Loading ${ariaLabel}`}
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      }
    >
      <div className={className} style={style}>
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={loop}
            autoplay={autoplay}
            speed={speed}
            onError={() => setError(true)}
            aria-label={ariaLabel}
          />
        ) : animationUrl ? (
          <Lottie
            src={animationUrl}
            loop={loop}
            autoplay={autoplay}
            speed={speed}
            onError={() => setError(true)}
            aria-label={ariaLabel}
          />
        ) : (
          <div
            className="flex items-center justify-center w-full h-full"
            role="img"
            aria-label={ariaLabel}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </Suspense>
  );
}

// Default travel animation data (simplified JSON structure)
export const defaultTravelAnimation = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: 'Travel',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Circle',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [50, 50] },
              p: { a: 0, k: [0, 0] },
              nm: 'Ellipse Path 1',
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.2, 0.4, 0.8, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 1,
              ml: 4,
              bm: 0,
              nm: 'Stroke 1',
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
              sk: { a: 0, k: 0 },
              sa: { a: 0, k: 0 },
              nm: 'Transform',
            },
          ],
          nm: 'Ellipse 1',
          bm: 0,
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
};

