/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useEffect } from 'react';
import { Modality } from '@google/genai';

import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import { createSystemInstructions } from '../../../lib/prompts';
import { useAgent, useUser } from '../../../lib/state';
import SearchResults from './SearchResults';
import VideoFeed from '../video-feed/VideoFeed';

export default function KeynoteCompanion() {
  const { client, connected, setConfig, searchResults, cameraOn } =
    useLiveAPIContext();
  const user = useUser();
  const { current } = useAgent();

  // Set the configuration for the Live API
  useEffect(() => {
    setConfig({
      tools: [{ googleSearch: {} }],
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: current.voice },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: createSystemInstructions(current, user),
          },
        ],
      },
    });
  }, [setConfig, user, current]);

  // Initiate the session when the Live API connection is established
  // Instruct the model to send an initial greeting message
  useEffect(() => {
    const beginSession = async () => {
      if (!connected) return;
      client.send(
        {
          text: 'رحب بالمستخدم وقدم نفسك ودورك.',
        },
        true
      );
    };
    beginSession();
  }, [client, connected]);

  return (
    <div className="w-full h-full flex items-center justify-center relative p-4">
      {!connected && (
        <div className="text-center text-gray-400">
          <p className="text-2xl mb-4">المساعد البصري جاهز للمساعدة</p>
          <p>اضغط على زر البدء في الأسفل لبدء الجلسة</p>
        </div>
      )}
      {connected && (
        <div
          className="text-center text-gray-500 animate-pulse"
          aria-live="polite"
        >
          <p className="text-lg">أستمع...</p>
        </div>
      )}
      <SearchResults results={searchResults} />
      {cameraOn && <VideoFeed />}
    </div>
  );
}
