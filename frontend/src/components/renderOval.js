import React from 'react';
import renderExecutionDetails from './renderExecutionDetails';

const renderOval = (tasks, selectedTasks, view, viewColors, setHoveredTask, hoveredTask) => {
  const logScale = (value, max) => {
    return Math.log(value + 1) / Math.log(max + 1) * 100;
  };

  const maxTime = Math.max(...tasks.flatMap(task =>
    [task.execution.time, task.impact.timePast + task.impact.timeFuture]
  ));
  const maxSpace = Math.max(...tasks.flatMap(task =>
    [task.execution.space, task.impact.space]
  ));

  return (
    <svg viewBox="-110 -110 220 220" className="w-100 h-100">
      <defs>
        <linearGradient id="xAxisGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#91A3B0" />
          <stop offset="50%" stopColor="#78C0E0" />
          <stop offset="100%" stopColor="#91A3B0" />
        </linearGradient>
      </defs>
      <ellipse cx="0" cy="0" rx="100" ry="100" fill="none" stroke="url(#xAxisGradient)" strokeWidth="2" />
      <line x1="-100" y1="0" x2="100" y2="0" stroke="url(#xAxisGradient)" strokeWidth="2" />
      <line x1="0" y1="-100" x2="0" y2="100" stroke="#ccc" />
      <circle cx="0" cy="0" r="3" fill="#333" />
      {tasks.filter(task => selectedTasks[task.id]).map((task, index) => {
        const taskData = task[view];
        const width = logScale(taskData.space, maxSpace);
        const height = view === 'execution'
          ? logScale(taskData.time, maxTime)
          : logScale(taskData.timePast + taskData.timeFuture, maxTime);
        const yPos = view === 'execution'
          ? -logScale(taskData.time / 2, maxTime)
          : (logScale(taskData.timeFuture, maxTime) - logScale(taskData.timePast, maxTime)) / 2;

        return (
          <g key={index}>
            <ellipse
              cx="0"
              cy={yPos}
              rx={width / 2}
              ry={height / 2}
              fill={viewColors[view]}
              fillOpacity="0.5"
              stroke={viewColors[view]}
              strokeWidth={hoveredTask && hoveredTask.id === task.id ? "3" : "1"}
              onMouseEnter={() => setHoveredTask(task)}
              onMouseLeave={() => setHoveredTask(null)}
            />
            {view === 'execution' && renderExecutionDetails(task, yPos, width, height, viewColors)}
          </g>
        );
      })}
      <text x="-20" y="15" fontSize="12" textAnchor="middle">Local</text>
      <text x="-105" y="15" fontSize="12" textAnchor="start">Global</text>
      <text x="105" y="15" fontSize="12" textAnchor="end">Global</text>
      <text x="-20" y="-90" fontSize="12">Future</text>
      <text x="-20" y="100" fontSize="12">Past</text>
    </svg>
  );
};

export default renderOval;