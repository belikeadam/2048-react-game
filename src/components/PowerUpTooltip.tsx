import React from 'react';

interface PowerUpTooltipProps {
  title: string;
  description: string;
  uses: number;
  cooldown: number;
  unlockScore?: number;
}

const PowerUpTooltip: React.FC<PowerUpTooltipProps> = ({
  title,
  description,
  uses,
  cooldown,
  unlockScore
}) => {
  return (
    <div className="tooltip-content">
      <div className="tooltip-title">{title}</div>
      <div className="tooltip-description">{description}</div>
      <div className="tooltip-stats">
        <div>Uses: {uses}</div>
        <div>Cooldown: {cooldown}s</div>
        {unlockScore && <div>Unlock at: {unlockScore} points</div>}
      </div>
    </div>
  );
};

export default PowerUpTooltip;