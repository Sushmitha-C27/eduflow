"use client";

export function FullPageLoader() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ position: "relative", width: 92, height: 92 }}>
        <div className="logo-core">E</div>
        <span className="orbit orb-1" />
        <span className="orbit orb-2" />
        <span className="orbit orb-3" />
      </div>
      <style jsx>{`
        .logo-core {
          width: 52px;
          height: 52px;
          border-radius: 999px;
          background: rgba(232, 184, 75, 0.14);
          border: 1px solid rgba(232, 184, 75, 0.5);
          display: grid;
          place-items: center;
          color: var(--gold);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.3rem;
          position: absolute;
          inset: 0;
          margin: auto;
        }
        .orbit {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 1px dashed rgba(232, 184, 75, 0.35);
          animation: spin 2.1s linear infinite;
        }
        .orbit::after {
          content: "";
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--gold);
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 10px rgba(232, 184, 75, 0.7);
        }
        .orb-2 {
          transform: scale(0.82);
          animation-duration: 1.7s;
          animation-direction: reverse;
        }
        .orb-3 {
          transform: scale(0.64);
          animation-duration: 1.35s;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
