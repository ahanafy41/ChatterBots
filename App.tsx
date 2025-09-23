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

import ControlTray from './components/console/control-tray/ControlTray';
import ErrorScreen from './components/demo/ErrorSreen';
import KeynoteCompanion from './components/demo/keynote-companion/KeynoteCompanion';
import Header from './components/Header';
import UserSettings from './components/UserSettings';
import { LiveAPIProvider } from './contexts/LiveAPIContext';
import { useUI, useSettings } from './lib/state';

const FALLBACK_API_KEY = process.env.API_KEY as string;

/**
 * Main application component that provides a streaming interface for Live API.
 * Manages video streaming state and provides controls for webcam/screen capture.
 */
function App() {
  const { showUserConfig } = useUI();
  const { apiKey } = useSettings();
  const finalApiKey = apiKey || FALLBACK_API_KEY;

  if (!finalApiKey) {
    throw new Error(
      'Missing API_KEY. Please set it in your environment or in the application settings.',
    );
  }

  return (
    <div className="bg-black text-white h-screen w-screen flex flex-col">
      <LiveAPIProvider apiKey={finalApiKey}>
        <ErrorScreen />
        <Header />

        {showUserConfig && <UserSettings />}
        <main className="flex-1 flex flex-col items-center justify-center relative">
            <KeynoteCompanion />
            <ControlTray />
        </main>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
