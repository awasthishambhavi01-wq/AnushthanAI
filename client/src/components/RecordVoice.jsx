import { useRef, useState } from "react";
import { Mic, Square, Languages } from "lucide-react";

export default function RecordVoice({ onTranscript }) {
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState("hi-IN");
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return (
      <div className="text-xs text-zinc-500 mt-2">
        Voice input is not supported in this browser. Please use Chrome or
        Microsoft Edge.
      </div>
    );
  }

  const languages = [
    {
      value: "hi-IN",
      label: "हिन्दी",
      short: "HI",
    },
    {
      value: "en-IN",
      label: "English",
      short: "EN",
    },
    {
      value: "hi-IN",
      label: "Hinglish",
      short: "HI+EN",
    },
  ];

  function startRecording() {
    setError("");

    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;

      if (transcript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      setIsRecording(false);

      if (event.error === "not-allowed") {
        setError("Microphone permission denied.");
      } else if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else {
        setError("Voice input failed. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  }

  function stopRecording() {
    recognitionRef.current?.stop();
    setIsRecording(false);
  }

  return (
    <div className="mt-2">
      {/* Language selector */}
      <div className="flex items-center gap-2 mb-2">
        <Languages size={13} className="text-zinc-500" />

        <span className="text-[11px] text-zinc-500">
          Speak in
        </span>

        <div className="flex items-center gap-1">
          {languages.map((item) => (
            <button
              key={`${item.label}-${item.value}`}
              type="button"
              disabled={isRecording}
              onClick={() => setLanguage(item.value)}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                language === item.value
                  ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                  : "bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
              } disabled:opacity-40`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voice button */}
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`inline-flex items-center gap-2 text-xs font-medium px-3.5 py-2 rounded-full border transition-all ${
          isRecording
            ? "bg-red-500/15 border-red-500/40 text-red-400"
            : "bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:border-indigo-500/50 hover:text-indigo-300"
        }`}
      >
        {isRecording ? (
          <>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-40 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>

            Listening... tap to stop
          </>
        ) : (
          <>
            <Mic size={13} />
            Speak your product
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <p className="text-[11px] text-red-400 mt-2">
          {error}
        </p>
      )}

      {/* Helper text */}
      {!error && !isRecording && (
        <p className="text-[11px] text-zinc-600 mt-2">
          Describe your product naturally — for example, its quality,
          ingredients, material, or special features.
        </p>
      )}
    </div>
  );
}