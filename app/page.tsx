'use client'

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FilterType, Todo } from './types'; // [STEP 2a] Import FilterType here once defined


/**
 * Home Component
 * 
 * The main entry point for the To-Do application.
 * Handles task management logic including adding, toggling, deleting,
 * and persistent storage using localStorage.
 */
export default function Home() {
  const { theme, setTheme } = useTheme();

  /** State to track if the component has mounted to prevent hydration mismatches */
  const [mounted, setMounted] = useState(false);

  /** State to track if the initial data load from localStorage is complete */
  const [isLoaded, setIsLoaded] = useState(false);

  /** Set mounted state to true once the component is in the browser */
  useEffect(() => {
    setMounted(true);
  }, []);

  /** Main todos state array */
  const [todos, setTodos] = useState<Todo[]>([]);

  /** State for the new todo input field */
  const [inputValue, setInputValue] = useState('');

  // [STEP 2b] Add filter state here
  // const [filter, setFilter] = ... (default to 'all')

  const [filter, setFilter] = useState<FilterType>('all');

  /** 
   * Adds a new todo to the list.
   * Generates a unique ID and sets the initial completed status to false.
   */
  const addTodo = () => {
    if(inputValue.trim() === '') return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      createdAt: Date.now()
    }

    setTodos([...todos, newTodo]);
    setInputValue('');

  }


  /** 
   * Toggles the completion status of a todo item.
   * @param id The unique identifier of the todo to toggle
   */
  const toggleTodo = (id: string) => { 
    
    setTodos(todos.map(task => {
    if(task.id === id){
      return {...task, completed: !task.completed};
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
  const deleteTodo = (id: string) => {
    setTodos(todos.filter( task => task.id !== id));
  }

  /** Save todos to localStorage whenever the list changes */
  useEffect(() => {
    if(isLoaded){localStorage.setItem('my-todos', JSON.stringify(todos))}
  }, [todos])

  /** Load todos from localStorage on initial component mount */
  useEffect(() => {

    const saved = localStorage.getItem('my-todos');
    if(saved){
      setTodos(JSON.parse(saved));
    }

    setIsLoaded(true);
  }, []);

  const filteredTodos = todos.filter(todo => {
    if(filter === 'active') return !todo.completed;
    if(filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 transition-colors dark:bg-zinc-950">
      <button onClick={() => setTheme(mounted && theme === 'dark' ? 'light' : 'dark')} className='fixed top-6 right-6 p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 hover:scale-110 transition-all z-50 text-xl'> {theme === 'dark' ? '☀️' : '🌙'} </button>

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
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder-zinc-500 dark:text-zinc-200"
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
          
          {/* [STEP 3] Replace 'todos' with 'filteredTodos' in the map below */}
          {/* Create the filteredTodos variable above first! */}

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
              <li key={todo.id} className='group flex items-center justify-between p-4 mb-2 rounded-xl border border-transparent bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all font-medium text-zinc-800 dark:text-zinc-200'><span className={todo.completed ? 'line-through text-zinc-400' : ''}>{todo.text}</span> <div className='flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
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



