import React from "react";
import { slide } from "@remotion/transitions/slide";
import { staticFile, Audio } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

export const TRANSITION_DURATION = 30;
export const MIN_SEQUENCE_DURATION = TRANSITION_DURATION + 1;

// Create a custom slide transition with sound
const createSlideWithWhoosh = (): TransitionPresentation<{}> => {
  const baseSlide = slide();
  
  return {
    component: (props: TransitionPresentationComponentProps<{}>) => {
      const SlideComponent = baseSlide.component;
      
      return (
        <>
          {props.presentationDirection === "entering" && (
            <Audio src={staticFile("audio/whoosh.mp3")} volume={0.6} />
          )}
          <SlideComponent {...props} />
        </>
      );
    },
    props: baseSlide.props || {},
  };
};

const slideWithWhoosh = createSlideWithWhoosh();

interface SlideProps {
  children: React.ReactNode;
  sequenceDuration: number;
}

export const Slide: React.FC<SlideProps> = ({ children, sequenceDuration }) => {
  // Convert children to array for mapping
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  // Build a flat array of elements
  const elements: any[] = [];
  
  childrenArray.forEach((child: any, index) => {
    const isLastItem = index === totalItems - 1;
    
    // Add the sequence
    elements.push(
      <TransitionSeries.Sequence 
        key={`seq-${index}`}
        durationInFrames={sequenceDuration}
      >
        {child}
      </TransitionSeries.Sequence>
    );
    
    // Add transition if not the last item
    if (!isLastItem) {
      elements.push(
        <TransitionSeries.Transition
          key={`trans-${index}`}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
          presentation={slideWithWhoosh}
        />
      );
    }
  });

  return (
    <TransitionSeries>
      {elements as any}
    </TransitionSeries>
  );
}; 