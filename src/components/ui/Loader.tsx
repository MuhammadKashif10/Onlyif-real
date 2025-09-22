'use client';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

export default function Loader({
  size = 'md',
  variant = 'spinner',
  color = 'blue',
  className = ''
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  const renderSpinner = () => (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const renderDots = () => (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`${sizeClasses.sm} bg-current rounded-full animate-bounce ${colorClasses[color]}`} style={{ animationDelay: '0ms' }}></div>
      <div className={`${sizeClasses.sm} bg-current rounded-full animate-bounce ${colorClasses[color]}`} style={{ animationDelay: '150ms' }}></div>
      <div className={`${sizeClasses.sm} bg-current rounded-full animate-bounce ${colorClasses[color]}`} style={{ animationDelay: '300ms' }}></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} bg-current rounded-full animate-pulse ${colorClasses[color]} ${className}`}></div>
  );

  switch (variant) {
    case 'dots':
      return renderDots();
    case 'pulse':
      return renderPulse();
    case 'spinner':
    default:
      return renderSpinner();
  }
}
