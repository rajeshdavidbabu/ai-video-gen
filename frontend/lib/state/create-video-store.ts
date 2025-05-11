import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  videoFormDataSchema,
  type VideoFormData,
  type TopicType,
  CONTENT_LIMITS,
  ContentUnion,
} from "./create-video-schema";

interface CreateVideoStore {
  // Form Data
  form: VideoFormData;

  // Content-specific actions
  setContentType: (type: ContentUnion["contentType"]) => void;
  setPromptText: (text: string) => void;
  setScriptText: (text: string) => void;
  setTopic: (topic: TopicType) => void;

  // Generic field update for radio/select inputs
  updateField: <K extends keyof Omit<VideoFormData, "content">>(
    field: K,
    value: VideoFormData[K]
  ) => void;

  // Form state
  isValid: boolean;
  errors: Record<string, string[] | undefined>;

  // Validation
  validateForm: () => boolean;

  // Reset
  resetForm: () => void;

  // Add these methods
  getValidatedFormData: () => VideoFormData | null;
  getCurrentFormData: () => VideoFormData;
}

export const defaultFormValues: VideoFormData = {
  targetLength: "short",
  content: {
    contentType: "prompt",
    text: "",
  },
  language: "en",
  voice: "tA1VCNzCpAUIo9dguV0U",
  style: "realistic",
  fontFamily: "montserrat-extrabold",
  fontColor: "sunset",
  captionAlignment: "center",
  music: "none",
  overlay: "none",
};

export const useCreateVideo = create<CreateVideoStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        form: defaultFormValues,
        isValid: false,
        errors: {},

        // Content type handling
        setContentType: (type: ContentUnion["contentType"]) => {
          set((state) => ({
            form: {
              ...state.form,
              content: type === "topic"
                ? { contentType: "topic", selectedTopic: null }
                : { contentType: type, text: "" } as ContentUnion
            },
          }));
          get().validateForm();
        },

        // Text content handling
        setPromptText: (text) => {
          if (text.length <= CONTENT_LIMITS.PROMPT_LIMIT) {
            set((state) => ({
              form: {
                ...state.form,
                content: {
                  contentType: "prompt",
                  text,
                },
              },
            }));
            get().validateForm();
          }
        },

        setScriptText: (text) => {
          if (text.length <= CONTENT_LIMITS.SCRIPT_LIMIT) {
            set((state) => ({
              form: {
                ...state.form,
                content: {
                  contentType: "script",
                  text,
                },
              },
            }));
            get().validateForm();
          }
        },

        setTopic: (topic) => {
          set((state) => ({
            form: {
              ...state.form,
              content: {
                contentType: "topic",
                selectedTopic: topic, // We'll validate this
              },
            },
          }));
          get().validateForm();
        },

        // Generic field update
        updateField: (field, value) => {
          set((state) => ({
            form: {
              ...state.form,
              [field]: value,
            },
          }));
          get().validateForm();
        },

        // Validation
        validateForm: () => {
          const form = get().form;
          const result = videoFormDataSchema.safeParse(form);

          // Custom validation for topic if it null
          if (
            form.content.contentType === "topic" &&
            form.content.selectedTopic === null
          ) {
            set({
              isValid: false,
              errors: {
                ...(!result.success ? result.error.formErrors.fieldErrors : {}),
                selectedTopic: ["Please select a topic"],
              },
            });
            return false;
          }

          const isValid = result.success;
          const errors = !result.success
            ? result.error.formErrors.fieldErrors
            : {};

          set({ isValid, errors });
          return isValid;
        },

        // Reset
        resetForm: () => {
          set({
            form: defaultFormValues,
            isValid: false,
            errors: {},
          });
        },

        // Get validated form data
        getValidatedFormData: () => {
          const isValid = get().validateForm();
          return isValid ? get().form : null;
        },

        // Get current form data without validation
        getCurrentFormData: () => get().form,
      }),
      {
        name: "create-video-storage",
        skipHydration: true, // Prevents hydration issues
      }
    )
  )
);
