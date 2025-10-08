'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'


// ------------------------------------------------
// 1. TIPOS DE DADOS
// ------------------------------------------------

type ContentBlock = {
  id: string
  content: string // o URL, ou o texto em si
  type: 'text' | 'video' | 'link' | 'image'
}

type Lesson = {
  id: string
  title: string
  completed: boolean
  contents: ContentBlock[]
}

type Course = {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  progress: number
}

interface AddCourseProps {
  onAdd: (course: Course) => void
  onClose: () => void
}

export default function AddCourse({ onAdd, onClose }: AddCourseProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [lessons, setLessons] = useState<Lesson[]>([])

// ------------------------------------------------
// 2. FUNÇÕES DE ESTADO DA LIÇÃO
// ------------------------------------------------

  const addLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: '',
      completed: false,
      contents: []
    }
    setLessons([...lessons, newLesson])
  }

  // Permite atualizar APENAS title e completed
  const updateLesson = (id: string, field: 'title' | 'completed', value: string | boolean) => {
    // TypeScript exige que o valor seja compatível com o tipo do campo
    setLessons(lessons.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id))
  }

// ------------------------------------------------
// 3. FUNÇÕES DE ESTADO DO CONTEÚDO (Blocos Aninhados)
// ------------------------------------------------

  const addContentBlock = (lessonId: string, type: ContentBlock['type']) => {
    const newContentBlock: ContentBlock = {
      id: Date.now().toString() + Math.random().toString().slice(2,5),
      content: '',
      type: type,
    }
    setLessons(lessons.map(lesson => 
      lesson.id === lessonId
        ? { ...lesson, contents: [...lesson.contents, newContentBlock] }
        : lesson
    ))
  }
  // ^^^ Onde o erro estava: faltava fechar a função antes da próxima constante

  const updateContentBlock = (lessonId: string, contentId: string, value: string) => {
    setLessons(lessons.map(lesson => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          contents: lesson.contents.map(content =>
            content.id === contentId ? { ...content, content: value } : content
          ),
        }
      }
      return lesson
    }))
  }

  const removeContentBlock = (lessonId: string, contentId: string) => {
    setLessons(lessons.map(lesson => {
      if (lesson.id === lessonId) {
        return {
          ...lesson,
          contents: lesson.contents.filter(content => content.id !== contentId),
        }
      }
      return lesson
    }))
  }

// ------------------------------------------------
// 4. FUNÇÃO DE SUBMISSÃO
// ------------------------------------------------

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
      onClose() // Fechar após adicionar
    }
  }


// ------------------------------------------------
// 5. JSX (Marcação)
// ------------------------------------------------

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-text dark:text-gray-100">Add Novo Curso</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Campo Título do Curso */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text mb-2 dark:text-gray-300">
              Nome do Curso
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:text-white"
              required
            />
          </div>

          {/* Campo Descrição */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text mb-2 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:text-white"
            />
          </div>

          {/* Seção de Lições */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-text dark:text-gray-100">Lições</h3>
              <button
                type="button"
                onClick={addLesson}
                className="flex items-center px-3 py-1 bg-accent text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Lição
              </button>
            </div>
            
            {/* Loop de Lições */}
            <div className="space-y-4">
              {lessons.map(lesson => (
                <div key={lesson.id} className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                  
                  {/* Título da Lição e Botão Remover */}
                  <div className="flex justify-between items-start mb-4">
                    <input
                      type="text"
                      placeholder="Título da Lição"
                      value={lesson.title}
                      onChange={(e) => updateLesson(lesson.id, 'title', e.target.value)} 
                      className="flex-1 mr-4 px-3 py-2 border bg-gray-300 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeLesson(lesson.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Seleção para Adicionar Blocos de Conteúdo */}
                  <div className="mb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-text mb-2 dark:text-gray-300">
                      Adicionar Novo Bloco de Conteúdo:
                    </label>
                    <select
                      onChange={(e) => {
                        const type = e.target.value as ContentBlock['type'];
                        if (type) {
                          addContentBlock(lesson.id, type);
                          e.target.value = ""; // Reseta o select
                        }
                      }}
                      className="mr-4 px-3 py-2 border bg-gray-300 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:text-white"
                      defaultValue=""
                    >
                      <option value="" disabled>Selecione um tipo</option>
                      <option value="text">Texto</option>
                      <option value="video">Vídeo</option>
                      <option value="link">Link</option>
                      <option value="image">Imagem</option>
                    </select>
                  </div>

                  {/* Renderiza Múltiplos Blocos de Conteúdo */}
                  <div className="space-y-4">
                    {lesson.contents.map(content => (
                      <div key={content.id} className="p-3 border rounded shadow-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm capitalize text-gray-700 dark:text-gray-200">
                            {content.type}:
                          </span>
                          <button
                            type="button"
                            onClick={() => removeContentBlock(lesson.id, content.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Renderização condicional do campo de input/textarea */}
                        {content.type === 'text' ? (
                          <textarea
                            placeholder="Digite o conteúdo de texto da lição..."
                            value={content.content}
                            onChange={(e) => updateContentBlock(lesson.id, content.id, e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:text-white"
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder={`Insira o URL para ${content.type}`}
                            value={content.content}
                            onChange={(e) => updateContentBlock(lesson.id, content.id, e.target.value)}
                            className="w-full px-3 py-2 border bg-gray-200 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-accent dark:text-white"
                          />
                        )}
                      </div>
                    ))}
                    
                    {/* Mensagem se não houver conteúdo */}
                    {lesson.contents.length === 0 && (
                      <p className="text-sm text-gray-500 italic pt-2">
                        Nenhum conteúdo adicionado. Selecione um tipo acima.
                      </p>
                    )}
                  </div>
                  
                </div> // FIM da div da Lição
              ))}
            </div>
            {/* </div> // 🛑 Havia um </div> extra aqui na sua versão */}

          </div> 
          
          {/* Botões de Ação Final */}
          <div className="flex justify-end space-x-4 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Add Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}