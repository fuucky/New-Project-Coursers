'use client'

import { Edit, Trash2, CheckCircle, Circle } from 'lucide-react'
import { Course, Lesson } from '../types'


interface CourseListProps {
  courses: Course[]
  updateCourse: (course: Course) => void
  // edit: (course: Course) => void
  deleteCourse: (courseId: string) => void
}

export default function CourseList({ courses, updateCourse, deleteCourse }: CourseListProps) {
  const toggleLesson = (courseId: string, lessonId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (course) {
      const updatedLessons = course.lessons.map(l =>
        l.id === lessonId ? { ...l, completed: !l.completed } : l
      )

      const progress = Math.round((updatedLessons.filter(l => l.completed).length / updatedLessons.length) * 100)
      updateCourse({ ...course, lessons: updatedLessons, progress })
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-text mb-4">Seus Cursos</h2>
      {courses.length === 0 ? (
        <p className="text-secondary">Nenhum curso ainda. Adicione seu primeiro curso!</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-text mb-2">{course.title}</h3>
              <p className="text-secondary mb-4">{course.description}</p>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-secondary mb-1">
                  <span>Progresso</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                {course.lessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center">
                    <button
                      onClick={() => toggleLesson(course.id, lesson.id)}
                      className="mr-2"
                    >
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <span className={`text-sm ${lesson.completed ? 'line-through text-secondary' : 'text-text'}`}>
                      {lesson.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button className="text-secondary hover:text-primary">
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}