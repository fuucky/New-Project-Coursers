'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Plus, Settings } from 'lucide-react'
// Importação correta dos tipos centralizados
import { Course } from '../types/index' // Simplificado para importar apenas o necessário
import CourseList from './CourseList'
import Schedule from './Schedule'
import AddCourse from './AddCourse'


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [showAddCourse, setShowAddCourse] = useState(false)
  
  // ⭐️ NOVO ESTADO: Rastreia o curso que está sendo editado
  const [editingCourse, setEditingCourse] = useState<Course | null>(null) 

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses))
    }
  }, [])

  const saveCourses = (newCourses: Course[]) => {
    setCourses(newCourses)
    localStorage.setItem('courses', JSON.stringify(newCourses))
  }

  // A função addCourse será usada APENAS para adição, se você quiser ser explícito.
  // Mas vamos simplificar e usar updateCourse para lidar tanto com atualização quanto com adição,
  // ajustando a lógica de estado do modal.
  const addCourse = (course: Course) => {
    // Se o curso já tem ID (estamos editando), tratamos como atualização
    if (courses.some(c => c.id === course.id)) {
      updateCourse(course);
    } else {
      // Se for novo curso
      const newCourses = [...courses, course]
      saveCourses(newCourses)
    }
    closeAddCourse(); // Usar a nova função para fechar e limpar
  }

  const updateCourse = (updatedCourse: Course) => {
    const newCourses = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c)
    saveCourses(newCourses)
  }

  const deleteCourse = (courseId: string) => {
    const newCourses = courses.filter(c => c.id !== courseId)
    saveCourses(newCourses)
  }

  // ⭐️ NOVA FUNÇÃO: Prepara a edição (é chamada pelo CourseList)
  const startEditCourse = (course: Course) => {
    setEditingCourse(course)
    setShowAddCourse(true)
  }
  
  // ⭐️ NOVA FUNÇÃO: Limpa o estado e fecha o modal (usada em vez de apenas setShowAddCourse(false))
  const closeAddCourse = () => {
    setEditingCourse(null) // Limpa o curso em edição
    setShowAddCourse(false)
  }

  return (
    <div className="min-h-screen bg-gray-300">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-primary">Aprimore Conhecimentos</h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'courses' ? 'bg-accent text-white' : 'text-secondary hover:text-primary'
                }`}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Cursos
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'schedule' ? 'bg-accent text-white' : 'text-secondary hover:text-primary'
                }`}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Agenda
              </button>
              <button
                // ⭐️ AJUSTADO: Ao clicar em Add Curso, limpamos o estado de edição, se houver
                onClick={() => { setEditingCourse(null); setShowAddCourse(true); }}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-secondary text-white hover:bg-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Curso
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'courses' && (
          <CourseList 
            courses={courses} 
            updateCourse={updateCourse} 
            deleteCourse={deleteCourse} 
            // ⭐️ PASSA A NOVA FUNÇÃO PARA O CourseList
            startEditCourse={startEditCourse} 
          />
        )}
        {activeTab === 'schedule' && <Schedule courses={courses} />}
      </main>

      {showAddCourse && (
        <AddCourse 
          onAdd={addCourse} 
          onClose={closeAddCourse} // ⭐️ USA A NOVA FUNÇÃO PARA LIMPAR E FECHAR
          courseToEdit={editingCourse} // ⭐️ PASSA O CURSO PARA O MODAL
        />
      )}
    </div>
  )
}