// types/index.ts

export type ContentBlock = {
  id: string
  content: string // O URL, ou o texto em si
  type: 'text' | 'video' | 'link' | 'image'
}

export type Lesson = {
  id: string
  title: string
  completed: boolean
  contents: ContentBlock[] 
}

export type Course = {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  progress: number
}

// Se você precisar de outros tipos no futuro (como User, etc.), adicione aqui.