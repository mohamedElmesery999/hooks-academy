'use client'

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from '@tanstack/react-query'
import {
  createProgram,
  createStudent,
  createHomeTestimonial,
  createHomeVideo,
  deleteProgram,
  deleteStudent,
  deleteHomeTestimonial,
  deleteHomeVideo,
  getHomeTestimonials,
  getHomeVideos,
  getProgram,
  getPrograms,
  getStudent,
  getStudents,
  getCycles,
  openNextCycle,
  queryKeys,
  registerStudent,
  sendStudentEmail,
  updateProgram,
  updateStudent,
  updateStudentStatus,
  type CreateProgramPayload,
  type CreateStudentPayload,
  type HomeTestimonial,
  type HomeVideo,
  type Cycle,
  type Program,
  type RegisterPayload,
  type RegisterResponse,
  type RequestStatus,
  type Student,
  type StudentStatusUpdateResponse,
  type UpdateProgramPayload,
  type UpdateStudentPayload,
} from '@/lib/api-utils'

export function usePrograms(options?: Omit<UseQueryOptions<Program[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.programs.all,
    queryFn: getPrograms,
    ...options,
  })
}

export function useProgram(
  id: string,
  options?: Omit<UseQueryOptions<Program>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.programs.detail(id),
    queryFn: () => getProgram(id),
    enabled: Boolean(id),
    ...options,
  })
}

export function useCreateProgram(
  options?: UseMutationOptions<Program, Error, CreateProgramPayload>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: createProgram,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useUpdateProgram(
  options?: UseMutationOptions<
    Program,
    Error,
    { id: string; payload: UpdateProgramPayload }
  >,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => updateProgram(id, payload),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.detail(variables.id) })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useDeleteProgram(
  options?: UseMutationOptions<{ success: boolean }, Error, string>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: deleteProgram,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useStudents(
  filters?: { status?: RequestStatus; cycleId?: string },
  options?: Omit<UseQueryOptions<Student[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.students.all(filters),
    queryFn: () => getStudents(filters),
    ...options,
    enabled: Boolean(filters?.cycleId) && (options?.enabled ?? true),
  })
}

export function useCycles(options?: Omit<UseQueryOptions<Cycle[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: queryKeys.cycles.all,
    queryFn: getCycles,
    ...options,
  })
}

export function useOpenNextCycle(
  options?: UseMutationOptions<{ closed: Cycle; next: Cycle }, Error, void>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: openNextCycle,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cycles.all })
      queryClient.invalidateQueries({ queryKey: ['students'] })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useStudent(
  id: string,
  options?: Omit<UseQueryOptions<Student>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => getStudent(id),
    enabled: Boolean(id),
    ...options,
  })
}

export function useCreateStudent(
  options?: UseMutationOptions<Student, Error, CreateStudentPayload>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: createStudent,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.cycles.all })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useUpdateStudent(
  options?: UseMutationOptions<
    Student,
    Error,
    { id: string; payload: UpdateStudentPayload }
  >,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, payload }) => updateStudent(id, payload),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.cycles.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(variables.id) })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useUpdateStudentStatus(
  options?: UseMutationOptions<
    StudentStatusUpdateResponse,
    Error,
    { id: string; status: RequestStatus; sendEmail?: boolean; customMessage?: string }
  >,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, status, sendEmail, customMessage }) =>
      updateStudentStatus(id, status, { sendEmail, customMessage }),
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.cycles.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(variables.id) })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useSendStudentEmail(
  options?: UseMutationOptions<
    { success: boolean },
    Error,
    { id: string; message?: string; subject?: string }
  >,
) {
  return useMutation({
    ...options,
    mutationFn: ({ id, message, subject }) => sendStudentEmail(id, { message, subject }),
  })
}

export function useDeleteStudent(
  options?: UseMutationOptions<{ success: boolean }, Error, string>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: deleteStudent,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.cycles.all })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useRegisterStudent(
  options?: UseMutationOptions<RegisterResponse, Error, RegisterPayload>,
) {
  return useMutation({
    mutationFn: registerStudent,
    ...options,
  })
}

export function useHomeVideos(
  options?: Omit<UseQueryOptions<HomeVideo[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.videos.all,
    queryFn: getHomeVideos,
    ...options,
  })
}

export function useCreateHomeVideo(
  options?: UseMutationOptions<HomeVideo, Error, { title: string; url: string }>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: createHomeVideo,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useDeleteHomeVideo(
  options?: UseMutationOptions<{ success: boolean }, Error, string>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: deleteHomeVideo,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos.all })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useHomeTestimonials(
  options?: Omit<UseQueryOptions<HomeTestimonial[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.testimonials.all,
    queryFn: getHomeTestimonials,
    ...options,
  })
}

export function useCreateHomeTestimonial(
  options?: UseMutationOptions<HomeTestimonial, Error, FormData>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: createHomeTestimonial,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}

export function useDeleteHomeTestimonial(
  options?: UseMutationOptions<{ success: boolean }, Error, string>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: deleteHomeTestimonial,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all })
      options?.onSuccess?.(data, variables, onMutateResult, context)
    },
  })
}
