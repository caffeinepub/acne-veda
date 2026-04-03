interface LeafDecorationsProps {
  opacity?: number;
}

export function LeafDecorations({ opacity = 0.18 }: LeafDecorationsProps) {
  return (
    <>
      {/* Top-left leaf cluster */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{ opacity }}
        aria-hidden="true"
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M10 130 C20 80, 70 40, 50 5 C40 50, -5 70, 10 130Z"
            fill="#4a7c59"
            fillOpacity="0.7"
          />
          <path
            d="M5 120 C30 95, 65 55, 80 15 C55 45, 20 75, 5 120Z"
            fill="#5a9068"
            fillOpacity="0.5"
          />
          <path
            d="M30 100 C45 75, 80 60, 95 30 C70 50, 40 70, 30 100Z"
            fill="#3d6b4a"
            fillOpacity="0.4"
          />
          <path
            d="M10 130 C25 100, 40 70, 50 5"
            stroke="#4a7c59"
            strokeWidth="1"
            fill="none"
            strokeOpacity="0.4"
          />
          <path
            d="M30 100 C50 80, 70 60, 95 30"
            stroke="#4a7c59"
            strokeWidth="0.8"
            fill="none"
            strokeOpacity="0.3"
          />
          <ellipse
            cx="35"
            cy="60"
            rx="28"
            ry="18"
            fill="#6aaa78"
            fillOpacity="0.2"
            transform="rotate(-40 35 60)"
          />
        </svg>
      </div>

      {/* Top-right small leaf */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{ opacity: opacity * 0.75 }}
        aria-hidden="true"
      >
        <svg
          width="90"
          height="100"
          viewBox="0 0 90 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M80 10 C60 30, 40 60, 60 90 C70 65, 90 40, 80 10Z"
            fill="#4a7c59"
            fillOpacity="0.6"
          />
          <path
            d="M90 5 C65 20, 50 50, 70 85 C80 55, 95 30, 90 5Z"
            fill="#5a9068"
            fillOpacity="0.4"
          />
          <path
            d="M80 10 C70 40, 65 65, 60 90"
            stroke="#4a7c59"
            strokeWidth="0.8"
            fill="none"
            strokeOpacity="0.35"
          />
        </svg>
      </div>

      {/* Bottom-left small leaf */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{ opacity: opacity * 0.75 }}
        aria-hidden="true"
      >
        <svg
          width="100"
          height="90"
          viewBox="0 0 100 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M5 85 C20 65, 50 50, 85 60 C60 45, 25 60, 5 85Z"
            fill="#4a7c59"
            fillOpacity="0.5"
          />
          <path
            d="M0 90 C25 70, 55 60, 90 70 C65 50, 25 65, 0 90Z"
            fill="#3d6b4a"
            fillOpacity="0.35"
          />
        </svg>
      </div>

      {/* Bottom-right leaf cluster */}
      <div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{ opacity }}
        aria-hidden="true"
      >
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="presentation"
        >
          <path
            d="M130 10 C120 60, 70 100, 90 135 C100 90, 145 70, 130 10Z"
            fill="#4a7c59"
            fillOpacity="0.7"
          />
          <path
            d="M135 20 C110 45, 75 85, 60 125 C85 95, 120 65, 135 20Z"
            fill="#5a9068"
            fillOpacity="0.5"
          />
          <path
            d="M110 40 C95 65, 60 80, 45 110 C70 90, 100 70, 110 40Z"
            fill="#3d6b4a"
            fillOpacity="0.4"
          />
          <path
            d="M130 10 C115 40, 100 70, 90 135"
            stroke="#4a7c59"
            strokeWidth="1"
            fill="none"
            strokeOpacity="0.4"
          />
          <ellipse
            cx="100"
            cy="80"
            rx="28"
            ry="18"
            fill="#6aaa78"
            fillOpacity="0.2"
            transform="rotate(40 100 80)"
          />
        </svg>
      </div>
    </>
  );
}
