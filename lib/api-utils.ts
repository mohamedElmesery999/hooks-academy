import axios, { type AxiosError } from 'axios'
import type { z } from 'zod'
import type { createProgramSchema, updateProgramSchema } from '@/lib/validations/programs'
import type {
  createStudentSchema,
  registerStudentSchema,
  updateStudentSchema,
} from '@/lib/validations/students'

type ApiErrorBody = { error?: string }

export type RequestStatus = 'pending' | 'accepted' | 'rejected'

export type Program = {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  _count?: { students: number }
}

export type Student = {
  id: string
  name: string
  parentName: string
  age: number
  email: string
  phone: string
  programId: string
  notes: string | null
  adminNotes: string | null
  totalAmount: number | null
  paidAmount: number | null
  status: RequestStatus
  createdAt: string
  updatedAt: string
  program?: Program
}

export type StudentStatusUpdateResponse = Student & {
  emailSent?: boolean
  emailError?: string
}

export type RegisterPayload = z.infer<typeof registerStudentSchema>
export type CreateStudentPayload = z.infer<typeof createStudentSchema>
export type UpdateStudentPayload = z.infer<typeof updateStudentSchema>
export type CreateProgramPayload = z.infer<typeof createProgramSchema>
export type UpdateProgramPayload = z.infer<typeof updateProgramSchema>

export type RegisterResponse = {
  id: string
  student_name: string
  parent_name: string
  age: number
  email: string
  phone: string
  program: string
  notes: string | null
  status: RequestStatus
  created_at: string
}

export type HomeVideo = {
  id: string
  title: string
  youtubeId: string
  startSeconds: number | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type HomeTestimonial = {
  id: string
  name: string
  role: string
  imageUrl: string
  alt: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const message = error.response?.data?.error ?? 'حدث خطأ في الخادم'
    return Promise.reject(new Error(message))
  },
)

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'حدث خطأ غير متوقع'
}

export async function getPrograms() {
  const { data } = await api.get<Program[]>('/programs')
  return data
}

export async function getProgram(id: string) {
  const { data } = await api.get<Program>(`/programs/${id}`)
  return data
}

export async function createProgram(payload: CreateProgramPayload) {
  const { data } = await api.post<Program>('/programs', payload)
  return data
}

export async function updateProgram(id: string, payload: UpdateProgramPayload) {
  const { data } = await api.patch<Program>(`/programs/${id}`, payload)
  return data
}

export async function deleteProgram(id: string) {
  const { data } = await api.delete<{ success: boolean }>(`/programs/${id}`)
  return data
}

export async function getStudents(status?: RequestStatus) {
  const { data } = await api.get<Student[]>('/students', {
    params: status ? { status } : undefined,
  })
  return data
}

export async function getStudent(id: string) {
  const { data } = await api.get<Student>(`/students/${id}`)
  return data
}

export async function createStudent(payload: CreateStudentPayload) {
  const { data } = await api.post<Student>('/students', payload)
  return data
}

export async function updateStudent(id: string, payload: UpdateStudentPayload) {
  const { data } = await api.patch<Student>(`/students/${id}`, payload)
  return data
}

export async function updateStudentStatus(
  id: string,
  status: RequestStatus,
  options?: { sendEmail?: boolean; customMessage?: string },
) {
  const { data } = await api.patch<StudentStatusUpdateResponse>(`/students/${id}/status`, {
    status,
    ...options,
  })
  return data
}

export async function sendStudentEmail(
  id: string,
  payload: { message?: string; subject?: string },
) {
  const { data } = await api.post<{ success: boolean }>(`/students/${id}/email`, payload)
  return data
}

export async function deleteStudent(id: string) {
  const { data } = await api.delete<{ success: boolean }>(`/students/${id}`)
  return data
}

export async function registerStudent(payload: RegisterPayload) {
  const { data } = await api.post<RegisterResponse>('/register', payload)
  return data
}

export async function getHomeVideos() {
  const { data } = await api.get<HomeVideo[]>('/videos')
  return data
}

export async function createHomeVideo(payload: { title: string; url: string; startSeconds?: number | null }) {
  const { data } = await api.post<HomeVideo>('/videos', payload)
  return data
}

export async function deleteHomeVideo(id: string) {
  const { data } = await api.delete<{ success: boolean }>(`/videos/${id}`)
  return data
}

export async function getHomeTestimonials() {
  const { data } = await api.get<HomeTestimonial[]>('/testimonials')
  return data
}

export async function createHomeTestimonial(payload: FormData) {
  const { data } = await api.post<HomeTestimonial>('/testimonials', payload)
  return data
}

export async function deleteHomeTestimonial(id: string) {
  const { data } = await api.delete<{ success: boolean }>(`/testimonials/${id}`)
  return data
}

export const queryKeys = {
  programs: {
    all: ['programs'] as const,
    detail: (id: string) => ['programs', id] as const,
  },
  students: {
    all: (status?: RequestStatus) =>
      status ? (['students', status] as const) : (['students'] as const),
    detail: (id: string) => ['students', id] as const,
  },
  videos: {
    all: ['videos'] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
  },
}
