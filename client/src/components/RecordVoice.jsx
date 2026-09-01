import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

export default function RecordVoice({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return (
      <div className="text-xs text-red-400 mt-2">
        Voice input is not supported in this browser. Please use Google Chrome.
      </div>
    );
  }

  function startRecording() {
    setError("");

    const recognition = new SpeechRecognition();

    // Hindi voice input
    recognition.lang = "hi-IN";

    // Don't show partial results
    recognition.interimResults = false;

    // Give us the best result
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started");
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      console.log("✅ Speech result:", event);

      const transcript = event.results[0][0].transcript;

      console.log("📝 Transcript:", transcript);

      if (transcript) {
        onTranscript(transcript);
      }

      setIsRecording(false);
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);

      setIsRecording(false);

      if (event.error === "not-allowed") {
        setError("Microphone permission denied.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try speaking again.");
      } else if (event.error === "network") {
        setError("Speech recognition network error. Check your internet.");
      } else {
        setError(`Voice input error: ${event.error}`);
      }
    };

    recognition.onnomatch = () => {
      console.log("⚠️ No speech match found");
      setError("I couldn't understand the speech. Please try again.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log("🛑 Speech recognition ended");
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error("Could not start recognition:", err);
      setIsRecording(false);
      setError("Could not start microphone.");
    }
  }

  function stopRecording() {
    console.log("⏹ Stopping speech recognition...");
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
          isRecording
            ? "bg-red-500/15 border-red-500/40 text-red-400"
            : "bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:border-indigo-500/50 hover:text-indigo-300"
        }`}
      >
        {isRecording ? <Square size={12} /> : <Mic size={12} />}

        {isRecording ? "Listening... tap to stop" : "Speak instead"}
      </button>

      {error && (
        <div className="text-xs text-red-400 mt-2">
          {error}
        </div>
      )}
    </div>
  );
}