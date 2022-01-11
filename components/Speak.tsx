import React, { useState } from "react";
import { useSpeechSynthesis } from "../components/useSpeechSynthesis";

const Speak = () => {
  const [text, setText] = useState("I am a robot");
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState<string | null>(null);

  const onEnd = () => console.log("Speaking finished");

  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });

  if (!voices) {
    return (
      <div className="p-8 text-xl" role={"alert"}>
        😞 Sorry service not available on this device...
      </div>
    );
  }

  const voice = voices.find(({ name }) => name === voiceIndex);

  return (
    <div id="speak" className="my-4">
      <form>
        {!supported && (
          <div className="p-8 text-xl" role={"alert"}>
            😞 Oh no, it looks like your browser doesn&#39;t support Speech
            Synthesis.
          </div>
        )}

        {supported && (
          <div className="flex flex-col gap-y-4">
            <p>
              {`Type a message below then click 'Speak'`}
              {/*  and SpeechSynthesis will read it out. */}
            </p>

            <div id="voice-input">
              <label
                htmlFor="voice"
                className="block text-sm font-medium text-gray-700"
              >
                Voice
              </label>
              <select
                id="voice"
                name="voice"
                value={voiceIndex || ""}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={(event) => {
                  setVoiceIndex(event.target.value);
                }}
              >
                {/* <option value="">Select a voice</option> */}
                {voices &&
                  voices.map((option, index) => (
                    <option key={option.voiceURI} value={index}>
                      {/* {`${option.lang} - ${option.name}`} */}
                      {option.name}
                    </option>
                  ))}
              </select>
            </div>

            <div id="rate-input">
              <div className="flex flex-row gap-2">
                <label
                  htmlFor="rate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rate:{" "}
                </label>
                <div className="rate-value">{rate}</div>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                defaultValue="1"
                step="0.1"
                id="rate"
                className="w-full h-6 p-0 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none"
                onChange={(event) => {
                  setRate(parseInt(event.target.value));
                }}
              />
            </div>
            <div id="pitch-input">
              <div className="flex flex-row gap-2">
                <label
                  htmlFor="pitch"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pitch:{" "}
                </label>
                <div className="pitch-value">{pitch}</div>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                defaultValue="1"
                step="0.1"
                id="pitch"
                className="w-full h-6 p-0 bg-indigo-600 focus:outline-none focus:ring-0 focus:shadow-none"
                onChange={(event) => {
                  setPitch(parseInt(event.target.value));
                }}
              />
            </div>
            <div id="message-input">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={text}
                placeholder="Tye a message"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                defaultValue={""}
                onChange={(event) => {
                  setText(event.target.value);
                }}
              />
            </div>
            {speaking && (
              <button
                type="button"
                className="inline-flex items-center px-3 py-3 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={cancel}
              >
                Stop
              </button>
            )}
            {!speaking && (
              <button
                type="button"
                className="inline-flex text-center items-center px-3 py-3 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => speak({ text, voice, rate, pitch })}
              >
                Speak
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Speak;
