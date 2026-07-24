import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceCommand(
  commands: Record<string, (transcript: string) => void>,
  onAnySpeech?: (transcript: string, matchedCommand: boolean) => void,
  onSpeechStart?: () => void,
  onSpeechEnd?: () => void
) {
  const commandsRef = useRef(commands);
  const onAnySpeechRef = useRef(onAnySpeech);
  const onSpeechStartRef = useRef(onSpeechStart);
  const onSpeechEndRef = useRef(onSpeechEnd);

  // Keep ref updated to avoid restarting the speech recognition when dependencies change
  useEffect(() => {
    commandsRef.current = commands;
    onAnySpeechRef.current = onAnySpeech;
    onSpeechStartRef.current = onSpeechStart;
    onSpeechEndRef.current = onSpeechEnd;
  }, [commands, onAnySpeech, onSpeechStart, onSpeechEnd]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    if (!(window as any)._globalSpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      (window as any)._globalSpeechRecognition = recognition;
      (window as any)._voiceCommands = new Set();

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.trim().toLowerCase();
        console.log("Voice recognized:", transcript);
        
        let matched = false;
        // Iterate through all registered command hooks
        for (const hook of (window as any)._voiceCommands) {
          const { commandsRef, onAnySpeechRef } = hook;
          for (const [key, callback] of Object.entries(commandsRef.current as Record<string, Function>)) {
            if (transcript.includes(key.toLowerCase())) {
              callback(transcript);
              matched = true;
            }
          }
          if (onAnySpeechRef.current) {
            (onAnySpeechRef.current as Function)(transcript, matched);
          }
        }
      };

      recognition.onspeechstart = () => {
        for (const hook of (window as any)._voiceCommands) {
          if (hook.onSpeechStartRef.current) hook.onSpeechStartRef.current();
        }
      };

      recognition.onspeechend = () => {
        for (const hook of (window as any)._voiceCommands) {
          if (hook.onSpeechEndRef.current) hook.onSpeechEndRef.current();
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        try {
          if ((window as any)._voiceCommands.size > 0) {
            recognition.start();
          }
        } catch (e) {
          // ignore
        }
      };

      const startRec = () => {
        try {
          recognition.start();
        } catch (e) {}
      };

      if ((window as any)._hasInteracted) {
        startRec();
      } else {
        const unlock = () => {
          (window as any)._hasInteracted = true;
          startRec();
          document.removeEventListener('click', unlock);
          document.removeEventListener('touchstart', unlock);
        };
        document.addEventListener('click', unlock);
        document.addEventListener('touchstart', unlock);
      }
    }

    const hookData = { commandsRef, onAnySpeechRef, onSpeechStartRef, onSpeechEndRef };
    (window as any)._voiceCommands.add(hookData);

    return () => {
      (window as any)._voiceCommands.delete(hookData);
      if ((window as any)._voiceCommands.size === 0) {
        if ((window as any)._globalSpeechRecognition) {
          const rec = (window as any)._globalSpeechRecognition;
          rec.onend = null;
          rec.stop();
          (window as any)._globalSpeechRecognition = null;
        }
      }
    };
  }, []);
}
