// Define interfaces for the data structures
interface AlignmentData {
  text: string;
  alignment: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
}

interface Word {
  word: string;
  punctuated_word: string;
  start: number;
  end: number;
  confidence: number;
}

interface ConvertedOutput {
  metadata: {
    created: string;
    duration: number;
    channels: number;
  };
  results: {
    channels: Array<{
      alternatives: Array<{
        transcript: string;
        confidence: number;
        words: Word[];
        paragraphs: {
          transcript: string;
          paragraphs: Array<{
            sentences: Array<{
              text: string;
              start: number;
              end: number;
            }>;
            num_words: number;
            start: number;
            end: number;
          }>;
        };
      }>;
    }>;
  };
}

export function convertCharactersToWords(
  alignmentData: AlignmentData
): ConvertedOutput {
  // Clean only spacing punctuation, keep quotes
  alignmentData.alignment.characters = alignmentData.alignment.characters.map(char => 
    char.replace(/[.,!?;:](?:\s|$)/g, '')
  );

  const {
    characters,
    character_start_times_seconds,
    character_end_times_seconds,
  } = alignmentData.alignment;

  const words: Word[] = [];
  let currentWord = "";
  let wordStart = character_start_times_seconds[0];
  let wordEnd = 0;
  let lastCharEndTime = 0;

  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    const startTime = character_start_times_seconds[i];
    const endTime = character_end_times_seconds[i];

    // Detect significant pause between characters (> 300ms)
    const timeSinceLastChar = startTime - lastCharEndTime;
    const isSignificantPause = timeSinceLastChar > 0.3; // 300ms

    if (char === " " || isSignificantPause) {
      if (currentWord) {
        words.push({
          word: currentWord,
          punctuated_word: currentWord,
          start: wordStart,
          end: wordEnd,
          confidence: 0.99,
        });
        currentWord = "";
      }
      wordStart = endTime;
    } else {
      if (!currentWord) {
        wordStart = startTime;
      }
      currentWord += char;
      wordEnd = endTime;
    }

    lastCharEndTime = endTime;
  }

  // Push the last word if exists
  if (currentWord) {
    words.push({
      word: currentWord,
      punctuated_word: currentWord,
      start: wordStart,
      end: wordEnd,
      confidence: 0.99,
    });
  }

  return {
    metadata: {
      created: new Date().toISOString(),
      duration:
        character_end_times_seconds[character_end_times_seconds.length - 1],
      channels: 1,
    },
    results: {
      channels: [
        {
          alternatives: [
            {
              transcript: words.map((w) => w.punctuated_word).join(" "),
              confidence: 0.99,
              words: words,
              paragraphs: {
                transcript: words.map((w) => w.punctuated_word).join(" "),
                paragraphs: [
                  {
                    sentences: [
                      {
                        text: words.map((w) => w.punctuated_word).join(" "),
                        start: words[0].start,
                        end: words[words.length - 1].end,
                      },
                    ],
                    num_words: words.length,
                    start: words[0].start,
                    end: words[words.length - 1].end,
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };
}
