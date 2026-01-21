'use client'

import { useState, useEffect } from 'react';
import { FilterType, Todo } from './types';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';


/**
 * Home Component
 * 
 * The main entry point for the To-Do application.
 * Handles task management logic including adding, toggling, deleting,
 * and persistent storage using localStorage.
 */
export default function Home() {  
  
  const {data: session, status} = useSession();
  const router = useRouter()

  /** State to track if the initial data load from localStorage is complete */
  const [isLoaded, setIsLoaded] = useState(false);

  /** Main todos state array */
  const [todos, setTodos] = useState<Todo[]>([]);

  /** State for the new todo input field */
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const fetchTodos = async () => {
    const res = await fetch('/api/todos');
    const data = await res.json();

    setTodos(data);
    setIsLoaded(true);
  }

  /** Load todos from database on initial component mount */
  useEffect(() => {
    fetchTodos()
  }, []);

  // Loading State 
  if (status === 'loading'){
    return(
      <div className='flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950'>
        <div className='text-center'>
          <div className='text-4xl mb-4'>🔄</div>
            <p className='text-zinc-600 dark:text-zinc-400'>Loading...</p>
        </div>
      </div>
    )
  }

  if(status === 'unauthenticated'){
    return(
      <div className='flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950 '>
        <div className='w-full max-w-md bg-white dark:bg-zinc-900/50 glass p-8 rounded-2xl shadow-xl text-center space-y-6'>
          <div className=''>
            <h1 className='text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>Welcome to My Tasks</h1>
            <p className='mt-2 text-zinc-600 font-semibold'>You are not signed in, please sign in to manage your tasks.</p>
          </div>
          
          <div className='space-y-3'>
            <button className='w-full rounded-md bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 transition duration-250 hover:scale-110'
            onClick={() => {router.push('/login')}}>Login</button>
            <button className='w-full rounded-md bg-zinc-200 dark:bg-zinc-800 px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition duration-250 hover:scale-110' 
            onClick={() => {router.push('/register')}}>Create Account</button>
          </div>
        </div>
      </div>
  )}

  /** 
   * Adds a new todo to the list.
   * Generates a unique ID and sets the initial completed status to false.
   */
  const addTodo = async () => {
    if(inputValue.trim() === '') return;
    
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({
        text: inputValue
      }),
    });


    const newTodo = await response.json();
    setTodos([newTodo, ...todos]);
    setInputValue('');

  }


  /** 
   * Toggles the completion status of a todo item.
   * @param id The unique identifier of the todo to toggle
   */
  const toggleTodo = async (id: string) => { 
    const todoToUpdate = todos.find(task => task.id === id);

    const newstatus = !todoToUpdate?.completed;
    
    const response = await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        completed: newstatus
      })
    });

    const toggledTodo = await response.json();
    
  
  
  
      setTodos(todos.map(task => {
    if(task.id === id){
      return toggledTodo;
    } else {
      return task;
    }
  })
  );



  }

  /** 
   * Deletes a todo item from the list.
   * @param id The unique identifier of the todo to delete
   */
  const deleteTodo = async (id: string) => {
    const response = await fetch('/api/todos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    });
  
    setTodos(todos.filter( task => task.id !== id));
  }

  const filteredTodos = todos.filter(todo => {
    if(filter === 'active') return !todo.completed;
    if(filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 transition-colors dark:bg-zinc-950">
      <button onClick={() => signOut()}
      className='fixed top-6 left-6 px-4 py-2 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-all shadow-xl text-sm font-medium z-50'>Logout</button>

      {/* Theme toggle button */}
      <ThemeToggle />

      <main className="w-full max-w-md bg-white dark:bg-zinc-900/50 space-y-8 glass p-8 rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Tasks
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Stay organized and productive.
          </p>
        </div>

        

        <div className="flex gap-2">
        
          <input 
            type="text"
            placeholder="What needs to be done?"
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder-zinc-500 dark:text-zinc-200 placeholder-zinc-600"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          
          <button 
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition-colors"
            onClick={addTodo}
          >
            Add
          </button>

          
        </div>

        <ul className="space-y-3">
        <div className='flex justify-center gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800'>
          {
            (['all', 'active', 'completed'] as const).map((f) => (
              <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
      filter === f
        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
        : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
    }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))
          }
        </div>


          {filteredTodos.map((todo) => {
            return (
              <li key={todo.id} className='group flex items-center justify-between p-4 mb-2 rounded-xl border border-transparent bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all font-medium text-zinc-800 dark:text-zinc-200'><span className={todo.completed ? 'line-through text-zinc-400' : ''}>{todo.text}</span> <div className='flex gap-2 transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100'>
                <button onClick={() => toggleTodo(todo.id)} className='text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:scale-105 transition-all'>Done</button>
                <button onClick={() => deleteTodo(todo.id)} className='text-xs px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:scale-105 transition-all'>Delete</button>
                </div></li>
            )
          }
          )}
        </ul>
      </main>
    </div>
  );
}



