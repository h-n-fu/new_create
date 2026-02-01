
import React, { useState, useMemo } from 'react';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(e => e.date.startsWith(currentMonth))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, currentMonth]);

  const months = useMemo(() => {
    const allMonths = expenses.map(e => e.date.substring(0, 7));
    const current = new Date().toISOString().substring(0, 7);
    if (!allMonths.includes(current)) allMonths.push(current);
    // Add explicit string types to the sort parameters to fix the error where they are inferred as unknown.
    return Array.from(new Set(allMonths)).sort((a: string, b: string) => b.localeCompare(a));
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <i className="fas fa-receipt text-5xl mb-4 opacity-20"></i>
        <p>支出がありません</p>
        <p className="text-sm">右下の「＋」ボタンから追加してください</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Selector */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {months.map(m => (
          <button
            key={m}
            onClick={() => setCurrentMonth(m)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentMonth === m 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {m.replace('-', '年')}月
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-gray-500 py-8">この月の支出はありません</p>
        ) : (
          filteredExpenses.map(expense => {
            const settlementAmount = expense.amount * expense.burdenRate;
            return (
              <div 
                key={expense.id}
                className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex justify-between items-center group"
              >
                {/* Status Indicator */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${expense.isSettled ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-mono">{expense.date}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${expense.isSettled ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {expense.isSettled ? '精算済' : '未精算'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-lg">¥{expense.amount.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">
                      支払: <span className="text-indigo-600 font-medium">{expense.payer}</span>
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    負担率: {expense.burdenRate * 100}% (精算対象: ¥{settlementAmount.toLocaleString()})
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    title="編集"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => onDelete(expense.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="削除"
                  >
                    <i className="fas fa-trash-can"></i>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
