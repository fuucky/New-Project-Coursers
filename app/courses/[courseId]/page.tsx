'use client'

// ⭐️ CORREÇÃO DE IMPORTAÇÃO: useRouter do Next.js 13/14
import { useParams, useRouter } from 'next/navigation' 
import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Save, ExternalLink } from 'lucide-react' 

// AJUSTE O CAMINHO DE IMPORTAÇÃO SE NECESSÁRIO
import { Course, ContentBlock } from '../../../types' 

interface CourseDetailsParams {
  courseId: string
  //Esta linha permite que a interface aceitte outras chaves de string (que é o que o useParams retorna)
  [key:string]: string | string [];
}

// ⭐️ FUNÇÃO AUXILIAR: Extrai o ID do vídeo do YouTube (Não causa erro, mas é importante)
const getYouTubeId = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Componente auxiliar para renderizar cada tipo de bloco de conteúdo
const ContentBlockRenderer = ({ block }: { block: ContentBlock }) => {
  const { type, content } = block;
  const youTubeId = type === 'video' ? getYouTubeId(content) : null;

  switch (type) {
    case 'text':
      return <p className="text-gray-700 whitespace-pre-line dark:text-gray-300">{content}</p>;
    
    case 'video':
      // Renderiza o player incorporado do YouTube
      if (youTubeId) {
        return (
          <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-lg"> 
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youTubeId}`}
              title="Conteúdo do Vídeo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
      
      // Se não for um link válido do YouTube
      return (
        <div className="bg-red-100 p-4 border border-red-300 rounded dark:bg-red-900 dark:border-red-700">
          <p className="font-semibold text-sm mb-1 text-red-700 dark:text-red-300">Vídeo URL Inválido:</p>
          <a href={content} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline break-words">{content}</a>
        </div>
      );
      
    case 'image':
      return (
        <div className="p-4 border rounded text-center bg-gray-100 dark:bg-gray-700">
            <p className="font-semibold text-sm mb-1 text-text dark:text-gray-200">Imagem:</p>
            <img src={content} alt="Conteúdo da Lição" className="max-w-full h-auto rounded-md mt-2 shadow-md mx-auto"/>
        </div>
      );
      
    case 'link':
      return (
        <a 
          href={content} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center p-3 border rounded bg-blue-50 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <ExternalLink className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm text-text dark:text-gray-100">Abrir Link Externo</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 break-words">{content}</p>
          </div>
        </a>
      );
      
    default:
      return null;
  }
};


export default function CourseDetails() {
  const { courseId } = useParams<CourseDetailsParams>() 
  
  // ⭐️ CORREÇÃO: Inicialização correta do router
  const router = useRouter() 

  // ⭐️ CORREÇÃO: Estados de Curso e Anotações
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('') 

  // ⭐️ FUNÇÃO DE AÇÃO: Salvar Anotações
  const saveNotes = () => {
    localStorage.setItem(`course-notes-${courseId}`, notes)
    console.log(`Anotações salvas para o curso ${courseId}`)
    // Você pode adicionar uma notificação visual aqui!
  }

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    if (savedCourses) {
      const allCourses: Course[] = JSON.parse(savedCourses)
      
      const foundCourse = allCourses.find(c => c.id === courseId)
      
      // ⭐️ CORREÇÃO: setCourse para o estado encontrado
      setCourse(foundCourse || null)
    }
    
    setLoading(false)

    // Carregar anotações salvas para este curso
    const savedNotes = localStorage.getItem(`course-notes-${courseId}`)
    if (savedNotes) {
      // ⭐️ CORREÇÃO: setNotes para o estado carregado
      setNotes(savedNotes)
    }
  }, [courseId])

  if (loading) {
    return <div className="p-8 text-center text-xl text-primary">Carregando...</div>
  }

  if (!course) {
    // ⭐️ CORREÇÃO: Verifica se course é nulo antes de tentar acessar suas propriedades
    return <div className="p-8 text-center text-xl text-red-500">Curso não encontrado.</div>
  }

  // Se tudo estiver OK, o componente renderiza

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      <button
        onClick={() => router.back()}
        className="flex items-center text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Voltar para Meus Cursos
      </button>

      {/* Exibe Título e Descrição, que agora são garantidos pelo if (!course) */}
      <h1 className="text-3xl font-bold text-primary dark:text-gray-100 mb-2">{course.title}</h1>
      <p className="text-lg text-secondary dark:text-gray-300 mb-8">{course.description}</p>
      
      <div className="flex flex-col md:flex-row gap-8"> 
        
        {/* Bloco das Lições (2/3) */}
        <div className="w-full md:w-2/3">
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
        
        {/* Bloco de Notas (1/3) */}
        <div className="w-full md:w-1/3 sticky md:top-4 self-start">
          <div className="bg-white p-6 rounded-lg shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-gray-700">
              <h3 className="text-xl font-bold flex items-center text-primary dark:text-gray-100">
                <BookOpen className="h-5 w-5 mr-2" />
                Minhas Anotações
              </h3>
              <button
                onClick={saveNotes}
                className="flex items-center text-sm px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-blue-600 transition-colors"
                title="Salvar Anotações"
              >
                <Save className="h-4 w-4 mr-1" />
                Salvar
              </button>
            </div>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Digite suas anotações aqui..."
              rows={20}
              className="w-full p-2 border rounded-md resize-none bg-gray-100 dark:bg-gray-800 text-text dark:text-gray-200 focus:ring-accent focus:border-accent"
            />
          </div>
        </div>
        
      </div>
    </div>
  )
}