"use client"

import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Plus, LogOut } from 'lucide-react'
import { Course } from '../types' 
import CourseList from './CourseList'
import Schedule from './Schedule'
import AddCourse from './AddCourse'

const theme = {
  primary: 'text-gray-100',
  accent: 'bg-gray-700 hover:bg-gray-600',
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
    <div className="h-screen w-screen bg-gray-800 font-inter flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="bg-gray-900 shadow flex-shrink-0">
        <div className="flex justify-between items-center px-12 py-3">
          <h1 className="text-2xl font-bold text-gray-100">Study Manager</h1>
          <nav className="flex space-x-2 sm:space-x-3 items-center">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'courses'
                  ? `${theme.accent} text-white shadow-md`
                  : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Cursos</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'schedule'
                  ? `${theme.accent} text-white shadow-md`
                  : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              <Calendar className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Agenda</span>
            </button>

            <button
              onClick={() => { setEditingCourse(null); setShowAddCourse(true) }}
              className="flex items-center px-3 py-1.5 rounded-lg text-white font-medium bg-gray-700 hover:bg-gray-600 transition-colors shadow-md"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Add Curso</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center p-2 rounded-lg text-white hover:text-red-500 transition-colors"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-auto p-6 w-full flex justify-center">
        <div className="w-full max-w-screen-xl">
          {activeTab === 'courses' && (
            <CourseList
              courses={courses}
              updateCourse={updateCourse}
              deleteCourse={deleteCourse}
              startEditCourse={startEditCourse}
            />
          )}
          {activeTab === 'schedule' && <Schedule courses={courses} />}
        </div>
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
