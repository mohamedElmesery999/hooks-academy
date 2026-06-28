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
  deleteProgram,
  deleteStudent,
  getProgram,
  getPrograms,
  getStudent,
  getStudents,
  queryKeys,
  registerStudent,
  sendStudentEmail,
  updateProgram,
  updateStudent,
  updateStudentStatus,
  type CreateProgramPayload,
  type CreateStudentPayload,
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
  status?: RequestStatus,
  options?: Omit<UseQueryOptions<Student[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.students.all(status),
    queryFn: () => getStudents(status),
    ...options,
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
