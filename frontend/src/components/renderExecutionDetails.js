import React from 'react';

const renderExecutionDetails = (task, yPos, width, height, viewColors) => {
  const { frequency } = task.execution.details;
  const dotSize = 2;
  const dots = [];
  let totalDots;
  // let interval;

  if (frequency === 'daily') {
    totalDots = 7; // represent a week
    // interval = 1;
  } else if (frequency === '3 times a week') {
    totalDots = 7;
    // interval = 2;
  }

  const dotSpacing = height / totalDots;

  for (let i = 0; i < totalDots; i++) {
    if (frequency === 'daily' || (frequency === '3 times a week' && i % 2 === 0 && i < 6)) {
      dots.push(
        <circle
          key={i}
          cx="0"
          cy={yPos + i * dotSpacing}
          r={dotSize}
          fill={viewColors.execution}
          fillOpacity="0.8"
        />
      );
    }
  }
  return dots;
};

export default renderExecutionDetails;