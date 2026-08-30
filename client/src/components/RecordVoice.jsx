import { useRef, useState } from "react";

/**
 * Voice-to-text input using the browser's built-in SpeechRecognition API
 * (Chrome/Edge support this natively — no backend voice agent needed for
 * the MVP). Transcribed text is appended to whatever the seller already typed.
 *
 * If the browser doesn't support this API, the button is hidden and the
 * seller can just type instead — text input always works as a fallback.
 */
export default function RecordVoice({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null; // graceful fallback — typing still works fine
  }

  function startRecording() {
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN"; // Hindi/Hinglish friendly; browser still
                                 // picks up English words reasonably well
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  return (
    <button
      type="button"
      className="btn-secondary"
      onClick={isRecording ? stopRecording : startRecording}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: isRecording ? "var(--color-carrot)" : "var(--color-pink)",
        color: isRecording ? "var(--color-white)" : "var(--color-text)",
      }}
    >
      <span>{isRecording ? "⏺" : "🎙️"}</span>
      {isRecording ? "Listening... tap to stop" : "Speak instead"}
    </button>
  );
}
