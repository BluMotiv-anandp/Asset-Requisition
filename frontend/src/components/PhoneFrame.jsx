import { Battery, Signal, Wifi } from 'lucide-react';

/**
 * PhoneFrame — wraps children in a realistic iPhone 17 Pro Max device mockup.
 *
 * Fix: Removed width: '100%' that was stretching the frame to full browser width.
 * Now the frame sizes itself from the aspect ratio (~440:956), capped by
 * max-height: 90vh, so it always reads as a phone mockup centered on the page.
 */
export default function PhoneFrame({ children }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-100 p-6">
      {/* Outer metallic edge */}
      <div
        className="relative flex flex-col items-center overflow-hidden"
        style={{
          aspectRatio: '440 / 956',
          maxHeight: '90vh',
          maxWidth: '90vw',
          alignSelf: 'center',
          borderRadius: '55px',
          background:
            'linear-gradient(145deg, #e0e0e0, #b0b0b0, #d0d0d0, #a0a0a0)',
          padding: '3px',
          boxShadow:
            '0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)',
        }}
      >
        {/* Inner black bezel */}
        <div
          className="relative flex flex-col w-full h-full overflow-hidden"
          style={{
            borderRadius: '52px',
            background: '#000000',
          }}
        >
          {/* Dynamic Island */}
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20"
            style={{
              width: '126px',
              height: '37px',
              borderRadius: '20px',
              background: '#000000',
            }}
          />

          {/* Screen area */}
          <div
            className="relative flex flex-col w-full h-full overflow-hidden"
            style={{
              borderRadius: '49px',
              margin: '3px',
              width: 'calc(100% - 6px)',
              height: 'calc(100% - 6px)',
              background: '#FFFFFF',
            }}
          >
            {/* Status bar */}
            <div className="relative flex items-center justify-between px-8 pt-4 pb-1 text-xs font-semibold text-ink z-10">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Signal size={13} />
                <Wifi size={13} />
                <Battery size={15} />
              </div>
            </div>

            {/* Chat content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
