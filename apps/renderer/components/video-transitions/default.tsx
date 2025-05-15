import React from "react";
import { TransitionSeries } from "@remotion/transitions";

export const TRANSITION_DURATION = 60;
export const MIN_SEQUENCE_DURATION = TRANSITION_DURATION + 1;
export const SEQUENCE_OVERLAP = 5; // Frames to overlap between sequences

interface DefaultProps {
  children: React.ReactNode;
  sequenceDuration: number;
}

export const Default: React.FC<DefaultProps> = ({
  children,
  sequenceDuration,
}) => {
  return (
    <TransitionSeries>
      {React.Children.map(children, (child, index) => {
        // Calculate the start offset for each sequence
        const offset = -TRANSITION_DURATION;

        return (
          <TransitionSeries.Sequence
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={`seq-${index}`}
            durationInFrames={sequenceDuration}
            offset={offset} // Start this sequence earlier
          >
            {child}
          </TransitionSeries.Sequence>
        );
      })}
    </TransitionSeries>
  );
};
