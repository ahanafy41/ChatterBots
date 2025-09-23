/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import Modal from './Modal';
import { useUI, useUser, useAgent, useSettings } from '../lib/state';
import {
  INTERLOCUTOR_VOICE,
  INTERLOCUTOR_VOICES,
} from '../lib/presets/agents';

export default function UserSettings() {
  const { name, info, setName, setInfo } = useUser();
  const { apiKey, setApiKey } = useSettings();
  const { current, update: updateAgent } = useAgent();
  const { setShowUserConfig } = useUI();

  return (
    <Modal onClose={() => setShowUserConfig(false)}>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white">الإعدادات</h2>
        <p className="text-gray-300 leading-relaxed">
          هذه الإعدادات تساعد في تخصيص تجربتك مع المساعد البصري.
        </p>

        <form
          className="mt-4 pt-6 border-t border-gray-700 space-y-6"
          onSubmit={e => {
            e.preventDefault();
            setShowUserConfig(false);
          }}
        >
          <div>
            <p className="text-gray-300 mb-4">
              معلوماتك الشخصية (اختياري):
            </p>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="userName" className="text-gray-200">
                  اسمك
                </label>
                <input
                  type="text"
                  id="userName"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ماذا تحب أن نناديك؟"
                  className="bg-gray-800 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="userInfo" className="text-gray-200">
                  معلوماتك
                </label>
                <textarea
                  id="userInfo"
                  rows={3}
                  name="info"
                  value={info}
                  onChange={e => setInfo(e.target.value)}
                  placeholder="أشياء يجب أن نعرفها عنك... الإعجابات، الكراهية، الهوايات، الاهتمامات، الأفلام المفضلة، الكتب، البرامج التلفزيونية، الأطعمة، إلخ."
                  className="bg-gray-800 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <p className="text-gray-300 mb-2">
              مفتاح واجهة برمجة التطبيقات (API Key):
            </p>
            <p className="text-sm text-gray-400 mb-4">
              يمكنك استخدام مفتاح API الخاص بك في Gemini. إذا تركته فارغًا، فسيتم استخدام المفتاح الافتراضي.
            </p>
            <div className="flex flex-col gap-2">
              <label htmlFor="apiKey" className="text-gray-200">
                مفتاح Gemini API
              </label>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="أدخل مفتاح API الخاص بك هنا"
                className="bg-gray-800 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <p className="text-gray-300 mb-4">تفضيلات المساعد:</p>
            <div className="flex flex-col gap-2">
              <label htmlFor="voicePickerSelect" className="text-gray-200">
                الصوت
              </label>
              <select
                id="voicePickerSelect"
                value={current.voice}
                onChange={e => {
                  updateAgent({
                    voice: e.target.value as INTERLOCUTOR_VOICE,
                  });
                }}
                className="bg-gray-800 border border-gray-600 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              >
                {INTERLOCUTOR_VOICES.map(voice => (
                  <option key={voice} value={voice}>
                    {voice}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg self-start transition-colors">
            إغلاق
          </button>
        </form>
      </div>
    </Modal>
  );
}