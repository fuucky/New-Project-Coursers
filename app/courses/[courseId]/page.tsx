'use client'

import { useParams, useRouter } from 'next/navigation' // ⭐️ IMPORTADO: Adicionado useRouter
import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react' // ⭐️ IMPORTADO: Ícone de seta para o botão
// ⭐️ AJUSTE O CAMINHO DE IMPORTAÇÃO SE NECESSÁRIO
import { Course, ContentBlock } from '../../../types' 

interface CourseDetailsParams {
  courseId: string
}

// Componente auxiliar para renderizar cada tipo de bloco de conteúdo (Mantido)
const ContentBlockRenderer = ({ block }: { block: ContentBlock }) => {
  const { type, content } = block;

  switch (type) {
    case 'text':
      return <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">{content}</p>;
    
    case 'video':
      return (
        <div className="bg-gray-100 p-4 border rounded dark:bg-gray-700">
          <p className="font-semibold text-sm mb-1 text-text dark:text-gray-200">Vídeo (URL):</p>
          <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-words">{content}</a>
        </div>
      );
      
    case 'image':
      return (
        <div className="bg-gray-100 p-4 border rounded text-center dark:bg-gray-700">
            <p className="font-semibold text-sm mb-1 text-text dark:text-gray-200">Imagem (URL):</p>
            {/* Você pode tentar exibir a imagem diretamente, mas o URL pode quebrar */}
            <img src={content} alt="Conteúdo da Lição" className="max-w-full h-auto rounded-md mt-2"/>
        </div>
      );
      
    case 'link':
      return (
        <div className="bg-gray-100 p-3 border rounded dark:bg-gray-700">
          <p className="font-semibold text-sm mb-1 text-text dark:text-gray-200">Link:</p>
          <a href={content} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-words">{content}</a>
        </div>
      );
      
    default:
      return null;
  }
};


export default function CourseDetails() {
  const { courseId } = useParams<CourseDetailsParams>() 
  const router = useRouter(); // ⭐️ HOOK: Inicializa o useRouter
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    if (savedCourses) {
      const allCourses: Course[] = JSON.parse(savedCourses)
      const foundCourse = allCourses.find(c => c.id === courseId)
      setCourse(foundCourse || null)
    }
    setLoading(false)
  }, [courseId])

  if (loading) {
    return <div className="p-8 text-center text-xl text-primary">Carregando...</div>
  }

  if (!course) {
    return <div className="p-8 text-center text-xl text-red-500">Curso não encontrado.</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* ⭐️ NOVO BOTÃO DE VOLTAR ⭐️ */}
      <button
        onClick={() => router.back()} // Ação: Volta para o Dashboard
        className="flex items-center text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Voltar para Meus Cursos
      </button>

      {/* Título e Descrição do Curso */}
      <h1 className="text-3xl font-bold text-primary dark:text-gray-100 mb-2">{course.title}</h1>
      <p className="text-lg text-secondary dark:text-gray-300 mb-8">{course.description}</p>
      
      {/* Lista de Lições */}
      <div className="space-y-10">
        {course.lessons.map((lesson, lessonIndex) => (
          <div key={lesson.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-accent dark:bg-gray-900 dark:border-blue-600">
            <h2 className="text-2xl font-semibold text-text dark:text-gray-100 mb-4">
              Lição {lessonIndex + 1}: {lesson.title}
            </h2>
            
            <div className="space-y-6">
              {lesson.contents.map((contentBlock) => (
                <ContentBlockRenderer 
                  key={contentBlock.id} 
                  block={contentBlock} 
                />
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
                <span className={`text-sm font-medium ${lesson.completed ? 'text-green-600' : 'text-gray-500'}`}>
                    {lesson.completed ? 'Completa' : 'Pendente'}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}