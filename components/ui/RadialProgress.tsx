import React from 'react';

interface RadialProgressProps {
  progress: number;
  strokeWidth?: number;
  colorClass?: string;
  label?: string;
}

const RadialProgress: React.FC<RadialProgressProps> = ({
  progress,
  strokeWidth = 8,
  colorClass = 'text-blue-600',
  label,
}) => {
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} transition-all duration-500 ease-in-out`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="text-center">
        <span className="text-xl font-bold text-gray-800">{progress.toFixed(0)}%</span>
        {label && <p className="text-xs text-gray-500">{label}</p>}
      </div>
    </div>
  );
};

export default RadialProgress;
