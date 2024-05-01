import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      if (Array.isArray(response.data)) {
        setExpenses(response.data);
        setLoading(false);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Error fetching expenses. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/expenses', {
        name,
        amount,
        category,
      });
      setExpenses([...expenses, response.data]);
      setName('');
      setAmount('');
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('Error adding expense. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="container">
      <h1 className="title">Expense Tracker</h1>
      <div className="form">
        <input
          className="input"
          type="text"
          placeholder="Expense name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          className="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="food">Food</option>
          <option value="transportation">Transportation</option>
          <option value="shopping">Shopping</option>
          <option value="bills">Bills</option>
          <option value="health_and_wellness">Health and Wellness</option>
        </select>
        <button className="button" onClick={handleAddExpense}>Add Expense</button>
      </div>
      <div className="expenses">
        <h2 className="subtitle">Expenses</h2>
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li className="expense-item" key={expense._id}>
              <span>{expense.name}</span>
              <span>₱{expense.amount.toFixed(2)}</span>
              <span>({expense.category})</span>
            </li>
          ))}
        </ul>
        <p className="total">Total Expenses: ₱{totalExpenses.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default App;
