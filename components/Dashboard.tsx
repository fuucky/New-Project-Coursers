"use client"

import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Plus, LogOut } from 'lucide-react'
import { Course } from '../types' 
import CourseList from './CourseList'
import Schedule from './Schedule'
import AddCourse from './AddCourse'

const theme = {
  primary: 'text-gray-900',
  secondary: 'text-blue-600',
  accent: 'bg-blue-500'
}

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('courses')
  const [courses, setCourses] = useState([])
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null) 

  useEffect(() => {
    const savedCourses = localStorage.getItem('courses')
    if (savedCourses) setCourses(JSON.parse(savedCourses))
  }, [])

  const saveCourses = (newCourses) => {
    setCourses(newCourses)
    localStorage.setItem('courses', JSON.stringify(newCourses))
  }

  const addCourse = (course) => {
    if (courses.some(c => c.id === course.id)) updateCourse(course)
    else saveCourses([...courses, course])
    closeAddCourse()
  }

  const updateCourse = (updatedCourse) => {
    const newCourses = courses.map(c => c.id === updatedCourse.id ? updatedCourse : c)
    saveCourses(newCourses)
  }

  const deleteCourse = (courseId) => {
    const newCourses = courses.filter(c => c.id !== courseId)
    saveCourses(newCourses)
  }

  const startEditCourse = (course) => {
    setEditingCourse(course)
    setShowAddCourse(true)
  }

  const closeAddCourse = () => {
    setEditingCourse(null)
    setShowAddCourse(false)
  }

  return (
    <div className="h-screen w-screen bg-gray-300 font-inter flex-center flex-col overflow-hidden">
      {/* HEADER */}
      <header className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <h1 className={`text-3xl font-bold ${theme.primary}`}>
              Study Manager
            </h1>
            <nav className="flex space-x-1 sm:space-x-3 items-center">
              {/* Cursos */}
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex items-center px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'courses'
                    ? `${theme.accent} text-white shadow-md`
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Cursos</span>
              </button>

              {/* Agenda */}
              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === 'schedule'
                    ? `${theme.accent} text-white shadow-md`
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <Calendar className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Agenda</span>
              </button>

              {/* Add Curso */}
              <button
                onClick={() => { setEditingCourse(null); setShowAddCourse(true) }}
                className="flex items-center px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md"
              >
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Add Curso</span>
              </button>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="flex items-center p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-grow overflow-auto max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"> 
        {activeTab === 'courses' && (
          <CourseList
            courses={courses}
            updateCourse={updateCourse}
            deleteCourse={deleteCourse}
            startEditCourse={startEditCourse}
          />
        )}
        {activeTab === 'schedule' && <Schedule courses={courses} />}
      </main>

      {showAddCourse && (
        <AddCourse
          onAdd={addCourse}
          onClose={closeAddCourse}
          courseToEdit={editingCourse}
        />
      )}
    </div>
  )
}
