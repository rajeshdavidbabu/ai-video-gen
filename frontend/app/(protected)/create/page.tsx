import { StepEight } from "@/components/create/step-eight";
import { StepFive } from "@/components/create/step-five";
import { StepFour } from "@/components/create/step-four";
import { StepOne } from "@/components/create/step-one";
import { StepSeven } from "@/components/create/step-seven";
import { StepSix } from "@/components/create/step-six";
import { StepThree } from "@/components/create/step-three";
import { StepTwo } from "@/components/create/step-two";

export default function Create() {
  return (
    <div className="grid h-[calc(100vh-40px)]">
      {/* Center container */}
      <div className="flex justify-center px-2 sm:px-8 py-4">
        {/* Main card - Grid with 2 rows: auto for header, 1fr for content */}
        <div className="w-full max-w-4xl grid grid-rows-[auto_1fr] bg-white rounded-2xl shadow-md border border-gray-100">
          {/* Fixed Header - auto height */}
          <div className="px-4 sm:px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-serif">Create Your Video</h1>
          </div>

          {/* Scrollable container - 1fr to take remaining space */}
          <div className="relative">
            {/* Absolute positioned scrollable content */}
            <div className="absolute inset-0 overflow-y-auto">
              <div className="px-4 sm:px-8 py-6 space-y-10">
                <StepOne />
                <StepTwo />
                <StepThree />
                <StepFour />
                <StepFive />
                <StepSix />
                <StepSeven />
                <StepEight />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
