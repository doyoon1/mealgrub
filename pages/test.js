import React, { useRef } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

export default function Test() {
  const { speak, speaking, supported } = useSpeechSynthesis();
  const readThisDivRef = useRef();

  const speakText = () => {
    const textToSpeak = readThisDivRef.current.innerText;
    speak({ text: textToSpeak });
  };

  return (
    <div>
      <div ref={readThisDivRef}>Read this</div>
      {supported ? (
        <div>
          <button onClick={speakText} disabled={speaking}>
            Speak
          </button>
          {speaking && <p>Speaking...</p>}
        </div>
      ) : (
        <p>Text-to-speech not supported in your browser.</p>
      )}
    </div>
  );
}
