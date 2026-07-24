import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceCommand(
  commands: Record<string, (transcript: string) => void>,
  onAnySpeech?: (transcript: string, matchedCommand: boolean) => void
) {
  const commandsRef = useRef(commands);
  const onAnySpeechRef = useRef(onAnySpeech);

  // Keep ref updated to avoid restarting the speech recognition when dependencies change
  useEffect(() => {
    commandsRef.current = commands;
    onAnySpeechRef.current = onAnySpeech;
  }, [commands, onAnySpeech]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.trim().toLowerCase();
      console.log("Voice recognized:", transcript);
      
      // Match spoken words with command keys
      let matched = false;
      for (const [key, callback] of Object.entries(commandsRef.current)) {
        if (transcript.includes(key.toLowerCase())) {
          callback(transcript);
          matched = true;
          // We don't break early so multiple actions could theoretically trigger, 
          // but mostly it's just finding the first matched keyword.
        }
      }
      
      if (onAnySpeechRef.current) {
        onAnySpeechRef.current(transcript, matched);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    // Auto-restart to continuously listen
    recognition.onend = () => {
      try {
        recognition.start();
      } catch (e) {
        // ignore
      }
    };

    // Start listening as soon as component mounts (prompts user for permission)
    try {
      recognition.start();
    } catch (e) {
      // ignore
    }

    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, []);
}
