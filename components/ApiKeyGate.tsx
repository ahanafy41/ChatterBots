/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState } from 'react';
import { useSettings } from '../lib/state';

export default function ApiKeyGate() {
  const { setApiKey } = useSettings();
  const [localApiKey, setLocalApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localApiKey.trim()) {
      setApiKey(localApiKey.trim());
    }
  };

  return (
    <div className="bg-black text-white h-screen w-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-white mb-4">مرحبًا بك</h2>
        <p className="text-gray-300 mb-6">
          لاستخدام هذا التطبيق، يرجى إدخال مفتاح واجهة برمجة التطبيقات (API Key) الخاص بك من Google Gemini.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder="أدخل مفتاح API الخاص بك هنا"
            className="bg-gray-800 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-500"
            disabled={!localApiKey.trim()}
          >
            متابعة
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-6">
          لن يتم تخزين مفتاحك على أي خادم. سيتم حفظه فقط في متصفحك.
        </p>
      </div>
    </div>
  );
}
