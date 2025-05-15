"use client";

import { FaqSectionWithCategories } from "@/components/blocks/faq-with-categories";

const FAQ_ITEMS = [
  {
    question: "What is AI Shorts Pro?",
    answer:
      "AI Shorts Pro is a powerful tool that helps you create engaging short-form videos using artificial intelligence. It streamlines the video creation process by automating creating images, adding captions, and optimizing content for various platforms.",
    category: "General",
  },
  {
    question: "How does the AI video generation work?",
    answer:
      "Our content engine uses AI to generate script, images, captions, audio and background music. Once all the assets are generated, we programatically create the video using them.",
    category: "Technology",
  },
  {
    question: "What video formats are supported?",
    answer:
      "The videos are created in MP4 format. Currently only 9/16 aspect ratio is supported. In the future we will support more aspect ratios.",
    category: "Features",
  },
  {
    question: "How long are the generated videos?",
    answer:
      "Currently the videos are 60 seconds to 70 seconds long. We are working on supporting longer videos in the future.",
    category: "Features",
  },
  {
    question: "What languages are supported?",
    answer:
      "We could ideally support any language. But currently we only support English and add more languages based on user demand.",
    category: "Features",
  },
  {
    question: "What will happen to my credits, if video generation fails?",
    answer:
      "The credits will only be deducted if the video generation is successful. If it fails, the credits will be refunded.",
    category: "Features",
  },
  {
    question: "I don't like the images generated, can I change them?",
    answer:
      "AI generated images are unpredictable sometimes. Currently we don't support changing the images. We are working on adding this feature in the future.",
    category: "Features",
  },
  {
    question: "How much does it cost to generate a video?",
    answer:
      "Each video creation costs 1 credit. We are working on offering a subscription model in the future.",
    category: "Pricing",
  },
  {
    question: "What if generated video has missing frames",
    answer:
      "This means that all your assets were generated successfully but video assembly failed. You can try re-generating the video. If it still fails, please contact support.",
    category: "Failures",
  },
];

export function FaqSection() {
  return (
    <FaqSectionWithCategories
      title="Frequently Asked Questions"
      description="Questions that our users ask the most"
      items={FAQ_ITEMS}
      contactInfo={{
        title: "Still have questions?",
        description:
          "Our support team is here to help you get the most out of AI Shorts Pro.",
        buttonText: "Contact Support",
        onContact: () => {
          // You can implement your contact logic here
          window.location.href = "mailto:support@aishorts.pro";
        },
      }}
      className="bg-background border-t border-border/60"
    />
  );
}
