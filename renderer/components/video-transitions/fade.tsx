import React from "react";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

export const TRANSITION_DURATION = 60;
export const MIN_SEQUENCE_DURATION = TRANSITION_DURATION + 1;

interface FadeProps {
  children: React.ReactNode;
  sequenceDuration: number;
}

export const Fade: React.FC<FadeProps> = ({ children, sequenceDuration }) => {
  // Convert children to array for mapping
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  return (
    <TransitionSeries>
      {React.Children.map(children, (child, index) => {
        const isLastItem = index === totalItems - 1;

        return (
          <React.Fragment
            key={`seq-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              index
            }`}
          >
            <TransitionSeries.Sequence durationInFrames={sequenceDuration}>
              {child}
            </TransitionSeries.Sequence>
            {!isLastItem && (
              <TransitionSeries.Transition
                key={`trans-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index
                }`}
                timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
                presentation={fade()}
              />
            )}
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};
