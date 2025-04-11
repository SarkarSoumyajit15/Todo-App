import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TodoList from './components/TodoList';
import { TodoProvider } from './context/TodoContext';

function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'John Doe',
    username: 'john_doe',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe'
  });

  return (
    <TodoProvider>
      <div className="min-h-screen">
        <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4">
            <TodoList currentUser={currentUser} />
          </main>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;