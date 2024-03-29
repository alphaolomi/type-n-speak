import { useEffect, useState } from "react";

interface UseSpeechSynthesisReturn {
  onEnd?: () => void;
  onStart?: () => void;
}

/**
 * useSpeechSynthesis
 *
 * ## Params
 * - `onStart` called when starting speaking,
 * - `onEnd` called when end speaking
 *
 *
 * ```typescript
 * const useSpeechSynthesis: ({ onStart, onEnd, }: {
 *     onEnd?: (() => void) | undefined;
 *     onStart?: (() => void) | undefined;
 * }) => {
 *     supported: boolean;
 *     speak: (args: {
 *         voice: SpeechSynthesisVoice | undefined | null;
 *         text: string;
 *         rate?: number | undefined;
 *         pitch?: number | undefined;
 *         volume?: number | undefined;
 *     }) => void;
 *     speaking: boolean;
 *     cancel: () => void;
 *     voices: SpeechSynthesisVoice[] | null;
 * }
 * ```
 */
export const useSpeechSynthesis = ({
  onStart = () => {},
  onEnd = () => {},
}: UseSpeechSynthesisReturn) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[] | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  const processVoices = (voiceOptions: SpeechSynthesisVoice[]) => {
    if (voiceOptions.length > 0) {
      setVoices(voiceOptions);
    }
  };

  const getVoices = () => {
    // Firefox seems to have voices upfront and never calls the
    // voiceschanged event
    let voiceOptions = window.speechSynthesis.getVoices();
    if (voiceOptions.length > 0) {
      processVoices(voiceOptions);
      return;
    }

    window.speechSynthesis.onvoiceschanged = (event) => {
      if (event !== null && event.target !== null) {
        if ("getVoices" in event.target) {
          // FIXME: this is a hack to get around the fact that the
          // voiceschanged event is not fired when the browser is
          // restarted
          // @ts-ignore
          voiceOptions = event.target.getVoices();
          processVoices(voiceOptions);
        }
      }
    };
  };

  const handleEnd = () => {
    setSpeaking(false);
    onEnd();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
      getVoices();
    }
  }, []);

  const speak = (args: {
    voice: SpeechSynthesisVoice | undefined | null;
    text: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  }) => {
    const { voice = null, text = "", rate = 1, pitch = 1, volume = 1 } = args;
    if (!supported) return;
    setSpeaking(true);
    onStart();

    // Firefox won't repeat an utterance that has been
    // spoken, so we need to create a new instance each time
    const utterance = new window.SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.voice = voice;
    utterance.onend = handleEnd;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    window.speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (!supported) return;
    setSpeaking(false);
    window.speechSynthesis.cancel();
  };

  return {
    supported,
    speak,
    speaking,
    cancel,
    voices,
  };
};
