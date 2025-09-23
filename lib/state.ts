/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { create } from 'zustand';
import { persist } from 'zustand';
import { Agent, VisionAssistant } from './presets/agents';

/**
 * Settings
 */

export const useSettings = create(
  persist<{
    apiKey?: string;
    setApiKey: (apiKey: string) => void;
  }>(
    (set) => ({
      apiKey: '',
      setApiKey: (apiKey) => set({ apiKey }),
    }),
    {
      name: 'google-ai-studio-gemini-vision',
    },
  ),
);


/**
 * User
 */
export type User = {
  name?: string;
  info?: string;
};

export const useUser = create<
  {
    setName: (name: string) => void;
    setInfo: (info: string) => void;
  } & User
>(set => ({
  name: '',
  info: '',
  setName: name => set({ name }),
  setInfo: info => set({ info }),
}));

/**
 * Agents
 */
export const useAgent = create<{
  current: Agent;
  update: (adjustments: Partial<Agent>) => void;
}>(set => ({
  current: VisionAssistant,
  update: (adjustments: Partial<Agent>) =>
    set(state => ({ current: { ...state.current, ...adjustments } })),
}));

/**
 * UI
 */
export const useUI = create<{
  showUserConfig: boolean;
  setShowUserConfig: (show: boolean) => void;
}>(set => ({
  showUserConfig: true,
  setShowUserConfig: (show: boolean) => set({ showUserConfig: show }),
}));