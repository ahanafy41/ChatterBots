/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useAgent, useUI, useUser } from '../lib/state';

export default function Header() {
  const { showUserConfig, setShowUserConfig } = useUI();
  const { name } = useUser();
  const { current } = useAgent();

  return (
    <header className="p-4 flex justify-between items-center text-white fixed top-0 w-full z-20 bg-black/30 backdrop-blur-sm">
      <h1 className="text-xl md:text-2xl font-bold">{current.name}</h1>
      <button
        className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-lg transition-colors"
        onClick={() => setShowUserConfig(!showUserConfig)}
        aria-label="إعدادات المستخدم"
      >
        <p className="hidden md:inline text-gray-300">{name || 'اسمك'}</p>
        <span className="icon text-2xl">tune</span>
      </button>
    </header>
  );
}
