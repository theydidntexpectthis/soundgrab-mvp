import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Search } from "lucide-react";

// Define SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error?: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal?: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface VoiceSearchBoxProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export function VoiceSearchBox({ onSearch, isSearching = false }: VoiceSearchBoxProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  
  // Check if browser supports SpeechRecognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionConstructor() as SpeechRecognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const interimTranscript = Array.from(Array.from({length: event.results.length}, (_, i) => event.results[i]))
          .map(result => result[0].transcript)
          .join('');
        setTranscript(interimTranscript);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setErrorMessage(`Error occurred in recognition: ${event.error}`);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          // Small delay to make sure the user has finished speaking
          setTimeout(() => {
            onSearch(transcript);
          }, 1000);
        }
      };
      
      setSpeechRecognition(recognition);
    } else {
      setErrorMessage("Your browser doesn't support speech recognition. Try using a browser like Chrome.");
    }
    
    return () => {
      if (speechRecognition) {
        speechRecognition.abort();
      }
    };
  }, []);
  
  const toggleListening = () => {
    if (!speechRecognition) return;
    
    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setErrorMessage("");
      speechRecognition.start();
      setIsListening(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim()) {
      onSearch(transcript);
    }
  };
  
  return (
    <Card className="bg-surface shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Mic size={18} className="text-primary" />
              <h3 className="text-lg font-medium">Voice Search</h3>
            </div>
            
            <p className="text-text-secondary text-sm mb-2">
              Speak the name of a song, artist, or lyrics to find music
            </p>
            
            <div className="relative min-h-[120px] bg-surface-light rounded-md p-4 flex flex-col items-center justify-center">
              {isListening ? (
                <div className="flex flex-col items-center">
                  <div className="animate-pulse mb-4">
                    <Mic size={48} className="text-primary" />
                  </div>
                  <p className="text-center text-text-primary font-medium">
                    Listening...
                  </p>
                  <p className="text-center text-text-secondary text-sm mt-2">
                    {transcript || "Speak now..."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {transcript ? (
                    <div className="w-full">
                      <p className="text-center text-text-primary font-medium mb-2">
                        Is this what you said?
                      </p>
                      <p className="text-center text-text-primary text-lg font-semibold p-2 bg-surface-light rounded">
                        "{transcript}"
                      </p>
                      <div className="flex justify-center gap-2 mt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setTranscript("")}
                          size="sm"
                        >
                          Clear
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-primary hover:bg-primary/90"
                          size="sm"
                          disabled={isSearching}
                        >
                          <Search size={16} className="mr-1" />
                          {isSearching ? "Searching..." : "Search"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <MicOff size={32} className="text-text-secondary mb-2" />
                      <p className="text-center text-text-secondary text-sm">
                        Click the button below to start speaking
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {errorMessage && (
              <div className="text-destructive text-sm p-2 bg-destructive/10 rounded-md">
                {errorMessage}
              </div>
            )}
            
            <Button 
              type="button" 
              onClick={toggleListening}
              className={`mt-2 flex items-center gap-2 ${
                isListening 
                  ? "bg-destructive hover:bg-destructive/90" 
                  : "bg-primary hover:bg-primary/90"
              }`}
              disabled={!speechRecognition || isSearching}
            >
              {isListening ? (
                <>
                  <MicOff size={16} />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic size={16} />
                  Start Voice Search
                </>
              )}
            </Button>
            
            <div className="mt-2 text-xs text-text-secondary">
              <p>Tips:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Speak clearly and at a normal pace</li>
                <li>Try phrases like "Play songs by Ed Sheeran" or "Find Shape of You"</li>
                <li>You can also try reciting some lyrics you remember</li>
              </ul>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Add type declarations for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}