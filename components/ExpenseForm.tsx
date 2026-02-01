
import React, { useState, useEffect } from 'react';
import { Expense, Payer } from '../types';

interface ExpenseFormProps {
  onSave: (expense: Expense) => void;
  initialData?: Expense;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSave, initialData }) => {
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [payer, setPayer] = useState<Payer>('Aさん');
  const [amount, setAmount] = useState<string>('');
  const [burdenRate, setBurdenRate] = useState<number>(0.5);

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setPayer(initialData.payer);
      setAmount(initialData.amount.toString());
      setBurdenRate(initialData.burdenRate);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('有効な金額を入力してください');
      return;
    }

    const expense: Expense = {
      id: initialData?.id || Date.now().toString(),
      date,
      payer,
      amount: numAmount,
      burdenRate,
      isSettled: initialData?.isSettled || false,
    };

    onSave(expense);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-bold text-gray-700 border-b pb-2">
        {initialData ? '支出を編集' : '支出を入力'}
      </h2>

      {/* Date */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">日付</label>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
        />
      </div>

      {/* Payer */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">支払者</label>
        <div className="flex gap-2">
          {(['Aさん', 'Bさん'] as Payer[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPayer(p)}
              className={`flex-1 p-3 rounded-lg border font-medium transition-all ${
                payer === p 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">金額 (¥)</label>
        <input 
          type="number" 
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-lg font-mono"
        />
      </div>

      {/* Burden Rate (Other person's share) */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-600">
          相手への請求割合 (割り勘設定)
        </label>
        <div className="flex gap-2">
          {[
            { label: '0%', value: 0 },
            { label: '50%', value: 0.5 },
            { label: '100%', value: 1.0 },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setBurdenRate(item.value)}
              className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                burdenRate === item.value 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {item.label}
              <div className="text-[10px] opacity-80 mt-1">
                {item.value === 0 ? '個人支出' : item.value === 0.5 ? '半分ずつ' : '相手全負担'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button 
          type="submit"
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-save"></i>
          保存する
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
