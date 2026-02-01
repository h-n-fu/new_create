
import React, { useState, useEffect, useCallback } from 'react';
import { Expense, ViewState } from './types';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Summary from './components/Summary';
import DataManager from './components/DataManager';

const STORAGE_KEY = 'split_bill_expenses_v1';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LIST');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setExpenses(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse expenses from storage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = useCallback((expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
    setView('LIST');
  }, []);

  const handleUpdateExpense = useCallback((updated: Expense) => {
    setExpenses(prev => prev.map(e => (e.id === updated.id ? updated : e)));
    setEditingExpense(undefined);
    setView('LIST');
  }, []);

  const handleDeleteExpense = useCallback((id: string) => {
    if (window.confirm('この支出を削除しますか？')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  }, []);

  const handleSettleUp = useCallback(() => {
    setExpenses(prev => prev.map(e => ({ ...e, isSettled: true })));
    setView('LIST');
  }, []);

  const handleImportData = useCallback((newData: Expense[]) => {
    setExpenses(newData);
    setView('LIST');
    alert('データを読み込みました');
  }, []);

  const openForm = (expense?: Expense) => {
    setEditingExpense(expense);
    setView('FORM');
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md z-10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-wallet"></i>
          割り勘君
        </h1>
        <div className="flex gap-2">
          {view === 'LIST' && (
            <button 
              onClick={() => setView('DATA')}
              className="text-white opacity-80 hover:opacity-100 p-2"
              title="データ共有"
            >
              <i className="fas fa-share-nodes"></i>
            </button>
          )}
          {view === 'LIST' && (
            <button 
              onClick={() => setView('SUMMARY')}
              className="bg-indigo-500 hover:bg-indigo-400 text-sm py-1 px-3 rounded-full transition-colors flex items-center gap-1 shadow-inner"
            >
              <i className="fas fa-calculator"></i>
              精算
            </button>
          )}
          {view !== 'LIST' && (
            <button 
              onClick={() => {
                setEditingExpense(undefined);
                setView('LIST');
              }}
              className="text-sm py-1 px-3 rounded-full border border-white hover:bg-white hover:text-indigo-600 transition-all"
            >
              戻る
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 p-4">
        {view === 'LIST' && (
          <ExpenseList 
            expenses={expenses} 
            onEdit={openForm} 
            onDelete={handleDeleteExpense} 
          />
        )}
        {view === 'FORM' && (
          <ExpenseForm 
            onSave={editingExpense ? handleUpdateExpense : handleAddExpense} 
            initialData={editingExpense}
          />
        )}
        {view === 'SUMMARY' && (
          <Summary 
            expenses={expenses} 
            onSettleUp={handleSettleUp} 
          />
        )}
        {view === 'DATA' && (
          <DataManager 
            expenses={expenses} 
            onImport={handleImportData} 
          />
        )}
      </main>

      {/* Floating Action Button */}
      {view === 'LIST' && (
        <button 
          onClick={() => openForm()}
          className="fixed bottom-8 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-90 z-20 border-4 border-white"
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
      )}

      {/* Status Bar for settled info */}
      {view === 'LIST' && expenses.some(e => !e.isSettled) && (
        <div className="bg-orange-50 p-2 text-center text-xs text-orange-600 font-medium border-t border-orange-100 animate-pulse">
          未精算の支出があります。サマリーを確認してください。
        </div>
      )}
    </div>
  );
};

export default App;
