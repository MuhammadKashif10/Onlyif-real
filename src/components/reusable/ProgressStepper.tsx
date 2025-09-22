interface ProgressStepperProps {
  steps: {
    id: string;
    title: string;
    description?: string;
  }[];
  currentStep: number;
  className?: string;
}

export default function ProgressStepper({ steps, currentStep, className = "" }: ProgressStepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center justify-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
              </div>

              {/* Step Info */}
              <div className="ml-3 hidden sm:block">
                <div className={`text-sm font-medium ${
                  isCompleted 
                    ? 'text-green-600' 
                    : isCurrent 
                    ? 'text-blue-600' 
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-400">
                    {step.description}
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden mt-4 text-center">
        <span className="text-sm text-gray-600">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </span>
      </div>
    </div>
  );
} 