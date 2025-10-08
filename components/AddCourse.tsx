'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

type Course = {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  progress: number
}

type Lesson = {
  id: string
  title: string
  content: string
  type: 'text' | 'video' | 'link' | 'image'
  completed: boolean
}

interface AddCourseProps {
  onAdd: (course: Course) => void
  onClose: () => void
}

export default function AddCourse({ onAdd, onClose }: AddCourseProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [lessons, setLessons] = useState<Lesson[]>([])

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: '',
      content: '',
      type: 'text',
      completed: false
    }
    setLessons([...lessons, newLesson])
  }

  const updateLesson = (id: string, field: keyof Lesson, value: string) => {
    setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      const newCourse: Course = {
        id: Date.now().toString(),
        title,
        description,
        lessons,
        progress: 0
      }
      onAdd(newCourse)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-text">Add Novo Curso</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text mb-2">
              Nome do Curso
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-text">Lições</h3>
              <button
                type="button"
                onClick={addLesson}
                className="flex items-center px-3 py-1 bg-accent text-white rounded-md hover:bg-blue-600"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Lição
              </button>
            </div>
            <div className="space-y-4">
              {lessons.map(lesson => (
                <div key={lesson.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start mb-4">
                    <input
                      type="text"
                      placeholder="Lesson title"
                      value={lesson.title}
                      onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)}
                      className="flex-1 mr-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={() => removeLesson(lesson.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mb-4">
                    <select
                      value={lesson.type}
                      onChange={(e) => updateLesson(lesson.id, 'type', e.target.value)}
                      className="mr-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="text">Texto</option>
                      <option value="video">Video</option>
                      <option value="link">Link</option>
                      <option value="image">Imagem</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Lesson content"
                    value={lesson.content}
                    onChange={(e) => updateLesson(lesson.id, 'content', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary hover:text-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-blue-600"
            >
              Add Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}