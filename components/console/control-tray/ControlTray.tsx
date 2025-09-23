/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import cn from 'classnames';

import { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { AudioRecorder } from '../../../lib/audio-recorder';

import { useLiveAPIContext } from '../../../contexts/LiveAPIContext';
import { useUI } from '../../../lib/state';

export type ControlTrayProps = {
  children?: ReactNode;
};

function ControlTray({ children }: ControlTrayProps) {
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  const connectButtonRef = useRef<HTMLButtonElement>(null);

  const { showUserConfig } = useUI();
  const { client, connected, connect, disconnect, cameraOn, setCameraOn } =
    useLiveAPIContext();

  // Stop the current agent if the user is editing the agent or user config
  useEffect(() => {
    if (showUserConfig) {
      if (connected) disconnect();
    }
  }, [showUserConfig, connected, disconnect]);

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: 'audio/pcm;rate=16000',
          data: base64,
        },
      ]);
    };
    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off('data', onData);
    };
  }, [connected, client, muted, audioRecorder]);

  const buttonBaseClasses =
    'w-14 h-14 rounded-full flex items-center justify-center text-white transition-all duration-200 focus:outline-none focus:ring-4';

  return (
    <section className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-full p-2 shadow-lg">
        <button
          className={cn(
            buttonBaseClasses,
            'focus:ring-red-500/50',
            { 'bg-red-600 hover:bg-red-700': !muted },
            { 'bg-gray-600 hover:bg-gray-500': muted },
            { 'opacity-50 cursor-not-allowed': !connected }
          )}
          onClick={() => setMuted(!muted)}
          aria-label={muted ? 'إلغاء كتم الميكروفون' : 'كتم الميكروفون'}
          disabled={!connected}
        >
          {!muted ? (
            <span className="material-symbols-outlined filled text-2xl">mic</span>
          ) : (
            <span className="material-symbols-outlined filled text-2xl">mic_off</span>
          )}
        </button>
        <button
          className={cn(
            buttonBaseClasses,
            'focus:ring-blue-500/50',
            { 'bg-blue-600 hover:bg-blue-700': cameraOn },
            { 'bg-gray-600 hover:bg-gray-500': !cameraOn },
            { 'opacity-50 cursor-not-allowed': !connected }
          )}
          onClick={() => setCameraOn(!cameraOn)}
          aria-label={cameraOn ? 'إيقاف تشغيل الكاميرا' : 'تشغيل الكاميرا'}
          disabled={!connected}
        >
          {cameraOn ? (
            <span className="material-symbols-outlined filled text-2xl">
              videocam
            </span>
          ) : (
            <span className="material-symbols-outlined filled text-2xl">
              videocam_off
            </span>
          )}
        </button>

        <div className="w-px h-10 bg-gray-600" />
        
        <button
          ref={connectButtonRef}
          className={cn(
            buttonBaseClasses,
            'w-16 h-16',
            'focus:ring-green-500/50',
            { 'bg-green-600 hover:bg-green-700': !connected },
            { 'bg-red-600 hover:bg-red-700': connected }
          )}
          onClick={connected ? disconnect : connect}
          aria-label={connected ? 'إيقاف الجلسة' : 'بدء الجلسة'}
        >
          <span className="material-symbols-outlined filled text-4xl">
            {connected ? 'pause' : 'play_arrow'}
          </span>
        </button>
      </div>
    </section>
  );
}

export default memo(ControlTray);
