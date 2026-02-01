
import React, { useState } from 'react';
import { Expense } from '../types';

interface DataManagerProps {
  expenses: Expense[];
  onImport: (data: Expense[]) => void;
}

const DataManager: React.FC<DataManagerProps> = ({ expenses, onImport }) => {
  const [importText, setImportText] = useState('');

  const handleCopy = () => {
    const dataStr = JSON.stringify(expenses);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert('全データをコピーしました！LINEなどで相手に送ってください。');
    });
  };

  const handleImport = () => {
    try {
      const decoded = JSON.parse(importText);
      if (Array.isArray(decoded)) {
        if (window.confirm('現在のデータが上書きされます。よろしいですか？')) {
          onImport(decoded);
        }
      } else {
        alert('無効なデータ形式です');
      }
    } catch (e) {
      alert('読み込みに失敗しました。正しいテキストを貼り付けてください。');
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <i className="fas fa-file-export text-indigo-500"></i>
          データを相手に送る
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          あなたの端末に保存されている全支出データをコピーします。相手のスマホでこのアプリを開き、「読み込む」に貼り付けてもらうことで同期できます。
        </p>
        <button
          onClick={handleCopy}
          className="w-full bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-copy"></i>
          全データをコピー
        </button>
      </section>

      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <i className="fas fa-file-import text-emerald-500"></i>
          データを受け取る・読み込む
        </h3>
        <textarea
          className="w-full p-3 h-24 bg-gray-50 border rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
          placeholder="相手から送られてきたテキストをここに貼り付けてください..."
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        ></textarea>
        <button
          onClick={handleImport}
          disabled={!importText.trim()}
          className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50 disabled:bg-gray-300 transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-file-circle-check"></i>
          データを読み込む
        </button>
      </section>

      <div className="bg-blue-50 p-4 rounded-xl flex gap-3">
        <i className="fas fa-lightbulb text-blue-500 mt-1"></i>
        <p className="text-[11px] text-blue-700 leading-relaxed">
          <strong>ヒント:</strong><br />
          このアプリはサーバーを介さないため、リアルタイム同期はできません。月に一度の精算時に、どちらかのスマホにデータを集約して精算することをおすすめします。
        </p>
      </div>
    </div>
  );
};

export default DataManager;
