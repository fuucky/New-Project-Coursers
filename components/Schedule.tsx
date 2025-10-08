'use client'

import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

interface ScheduleProps {
  courses: Course[]
}

export default function Schedule({ courses }: ScheduleProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [scheduledLessons, setScheduledLessons] = useState<{ [key: string]: string[] }>({})

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const scheduleLesson = (date: Date, lessonId: string) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    setScheduledLessons(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), lessonId]
    }))
  }

  const getLessonsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return scheduledLessons[dateKey] || []
  }

  const allLessons = courses.flatMap(course =>
    course.lessons.map(lesson => ({ ...lesson, courseTitle: course.title }))
  )

  return (
    <div>
      <h2 className="text-xl font-semibold text-text mb-4">Agenda de Estudos</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-md">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-medium text-text">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-md">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-secondary">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const lessonsForDay = getLessonsForDate(day)
            return (
              <div
                key={day.toString()}
                className={`p-2 border border-gray-200 min-h-[80px] cursor-pointer hover:bg-gray-50 ${
                  !isSameMonth(day, currentMonth) ? 'text-gray-400' : ''
                } ${isSameDay(day, selectedDate || new Date()) ? 'bg-accent text-white' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-sm font-medium mb-1">
                  {format(day, 'd')}
                </div>
                {lessonsForDay.length > 0 && (
                  <div className="text-xs">
                    {lessonsForDay.length} Lição{lessonsForDay.length > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {selectedDate && (
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-text mb-4">
            Agendar para {format(selectedDate, 'dd MMMM yyyy', { locale: ptBR })}
          </h3>
          <div className="mb-4">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  scheduleLesson(selectedDate, e.target.value)
                  e.target.value = ''
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Add Lição...</option>
              {allLessons.map(lesson => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.courseTitle} - {lesson.title}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            {getLessonsForDate(selectedDate).map(lessonId => {
              const lesson = allLessons.find(l => l.id === lessonId)
              return lesson ? (
                <div key={lessonId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-sm">{lesson.courseTitle} - {lesson.title}</span>
                  <button
                    onClick={() => {
                      const dateKey = format(selectedDate, 'yyyy-MM-dd')
                      setScheduledLessons(prev => ({
                        ...prev,
                        [dateKey]: prev[dateKey].filter(id => id !== lessonId)
                      }))
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              ) : null
            })}
          </div>
        </div>
      )}
    </div>
  )
}