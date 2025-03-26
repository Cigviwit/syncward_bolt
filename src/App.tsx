import React, { useState, useEffect } from 'react'
import { CheckCircle2, Edit, Plus, Trash2 } from 'lucide-react'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [input, setInput] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setTodos([...todos, {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false
    }])
    setInput('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const editTodo = (id: string, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-purple-600" size={28} />
          Todo List
        </h1>

        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </form>

        <div className="space-y-3">
          {todos.slice().sort((a, b) => {
            if (a.completed === b.completed) return 0
            return a.completed ? 1 : -1
          }).map(todo => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className={`flex-1 ${todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {todo.text}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    const newText = prompt('Edit task', todo.text)
                    if (newText) editTodo(todo.id, newText)
                  }}
                  className="p-1 text-gray-500 hover:text-purple-600"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-1 text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="text-center text-gray-400 mt-6">
            No tasks yet - add your first todo!
          </div>
        )}
      </div>
    </div>
  )
}
