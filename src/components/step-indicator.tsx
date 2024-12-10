import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  steps: string[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              index < currentStep
                ? "bg-primary border-primary text-primary-foreground"
                : index === currentStep
                ? "border-primary text-primary"
                : "border-gray-300 text-gray-300"
            }`}
          >
            {index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <span
            className={`ml-2 text-sm ${
              index <= currentStep ? "text-primary" : "text-gray-300"
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`w-10 h-0.5 mx-2 ${
                index < currentStep ? "bg-primary" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

