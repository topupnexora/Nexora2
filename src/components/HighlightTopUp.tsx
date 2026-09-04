import React from 'react';

interface HighlightTopUpProps {
  text: string;
  className?: string;
  redClassName?: string;
}

export const RED_TOPUP_COLOR_CLASS = 'text-red-500';

/**
 * Renders text while visually coloring any variation of "Top-Up" or "Top Up" in gaming red.
 * Only the specific "Top-Up" / "Top Up" words receive the red styling.
 */
export const HighlightTopUp: React.FC<HighlightTopUpProps> = ({
  text,
  className = '',
  redClassName = RED_TOPUP_COLOR_CLASS,
}) => {
  if (!text) return null;

  // Split by Top-Up variations (preserving the captured word)
  // Matches Top-Up, Top Up, TOP-UP, TOP UP, top-up, top up, and plurals (top-ups, Top Ups)
  const regex = /(top[- ]ups?)/gi;
  const parts = text.split(regex);

  if (parts.length === 1) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (regex.test(part)) {
          regex.lastIndex = 0;
          return (
            <span key={index} className={`${redClassName} transition-colors`}>
              {part}
            </span>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};

export default HighlightTopUp;
