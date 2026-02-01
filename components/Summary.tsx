
import React, { useMemo } from 'react';
import { Expense } from '../types';

interface SummaryProps {
  expenses: Expense[];
  onSettleUp: () => void;
}

const Summary: React.FC<SummaryProps> = ({ expenses, onSettleUp }) => {
  const unsettedExpenses = useMemo(() => expenses.filter(e => !e.isSettled), [expenses]);

  const stats = useMemo(() => {
    let aPaid = 0;
    let bPaid = 0;
    let bOwesA = 0; // B needs to pay A
    let aOwesB = 0; // A needs to pay B

    unsettedExpenses.forEach(e => {
      if (e.payer === 'Aさん') {
        aPaid += e.amount;
        bOwesA += e.amount * e.burdenRate;
      } else {
        bPaid += e.amount;
        aOwesB += e.amount * e.burdenRate;
      }
    });

    const diff = bOwesA - aOwesB;

    return {
      aPaid,
      bPaid,
      bOwesA,
      aOwesB,
      diff, // Positive: B pays A, Negative: A pays B
    };
  }, [unsettedExpenses]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <i className="fas fa-chart-pie text-indigo-500"></i>
        精算サマリー
      </h2>

      {/* Individual Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <p className="text-xs text-indigo-600 font-bold mb-1">Aさんの支払合計</p>
          <p className="text-xl font-bold text-indigo-900">¥{stats.aPaid.toLocaleString()}</p>
          <p className="text-[10px] text-indigo-400 mt-2">Bさんへの請求分: ¥{stats.bOwesA.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <p className="text-xs text-emerald-600 font-bold mb-1">Bさんの支払合計</p>
          <p className="text-xl font-bold text-emerald-900">¥{stats.bPaid.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-400 mt-2">Aさんへの請求分: ¥{stats.aOwesB.toLocaleString()}</p>
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center shadow-inner">
        <p className="text-sm text-gray-500 mb-4">精算結果</p>
        
        {stats.diff === 0 ? (
          <div className="py-4">
            <i className="fas fa-check-circle text-green-500 text-4xl mb-2"></i>
            <p className="font-bold text-lg text-gray-700">貸し借りなし！</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-bold text-indigo-600 text-xl">
                {stats.diff > 0 ? 'Bさん' : 'Aさん'}
              </span>
              <span> が </span>
              <span className="font-bold text-emerald-600 text-xl">
                {stats.diff > 0 ? 'Aさん' : 'Bさん'}
              </span>
              <span> に</span>
            </p>
            <p className="text-4xl font-black text-gray-900 my-4">
              ¥{Math.abs(stats.diff).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">支払う必要があります</p>
          </div>
        )}
      </div>

      {/* Settle Button */}
      {unsettedExpenses.length > 0 ? (
        <button
          onClick={() => {
            if (window.confirm('未精算のデータをすべて「精算済」にしますか？')) {
              onSettleUp();
            }
          }}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-check-double"></i>
          精算を確定する
        </button>
      ) : (
        <div className="text-center text-gray-400 italic py-4">
          未精算の支出はありません
        </div>
      )}

      {/* Helper Text */}
      <div className="bg-yellow-50 p-4 rounded-xl flex gap-3 items-start">
        <i className="fas fa-circle-info text-yellow-500 mt-1"></i>
        <div className="text-xs text-yellow-700 leading-relaxed">
          <strong>計算ルール:</strong><br />
          精算金額 = 金額 × 指定した割合<br />
          精算確定ボタンを押すと、すべての未精算データが精算済に更新され、今後の計算から除外されます。
        </div>
      </div>
    </div>
  );
};

export default Summary;
