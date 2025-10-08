'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Plus, Settings } from 'lucide-react'
import CourseList from './CourseList'
import Schedule from './Schedule'
import AddCourse from './AddCourse'

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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('courses')
  const [courses, setCourses] = useState<Course[]>([])
  const [showAddCourse, setShowAddCourse] = useState(false)

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

  const addCourse = (course: Course) => {
    const newCourses = [...courses, course]
    saveCourses(newCourses)
    setShowAddCourse(false)
  }

  const updateCourse = (updatedCourse: Course) => {
    const newCourses = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c)
    saveCourses(newCourses)
  }

  const deleteCourse = (courseId: string) => {
    const newCourses = courses.filter(c => c.id !== courseId)
    saveCourses(newCourses)
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
                onClick={() => setShowAddCourse(true)}
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
          <CourseList courses={courses} updateCourse={updateCourse} deleteCourse={deleteCourse} />
        )}
        {activeTab === 'schedule' && <Schedule courses={courses} />}
      </main>

      {showAddCourse && (
        <AddCourse onAdd={addCourse} onClose={() => setShowAddCourse(false)} />
      )}
    </div>
  )
}