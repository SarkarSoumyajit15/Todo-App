import { useState, useEffect } from 'react';
import { useTodoContext } from '../context/TodoContext';
import TodoList from './TodoList';
import { useUserContext } from '../context/UserContext';

const Dashboard = () => {
  const { todos, loading, error  } = useTodoContext();
  const {currentUser} = useUserContext();
  
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });

  useEffect(() => {
    if (todos.length > 0) {
      setStats({
        total: todos.length,
        completed: todos.filter(todo => todo.completed).length,
        pending: todos.filter(todo => !todo.completed).length,
        highPriority: todos.filter(todo => todo.priority === 'High' && !todo.completed).length
      });
    }
  }, [todos]);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {currentUser?.name || 'User'}!</h1>
        <p className="text-gray-600">Here's an overview of your tasks</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Tasks</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">High Priority</h3>
          <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Tasks for me</h2>
        <TodoList limit={2} showViewAll={true} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default Dashboard;