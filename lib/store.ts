import type { RegistrationFormData, RegistrationRequest, RequestStatus } from '../types/registration'

const STORAGE_KEY = 'hooks_registration_requests'

const dummyRequests: RegistrationRequest[] = [
  {
    id: '1',
    student_name: 'أحمد محمد',
    age: 10,
    parent_name: 'محمد علي',
    email: 'parent1@example.com',
    phone: '01012345678',
    program: 'programming',
    notes: 'مهتم بالبرمجة',
    status: 'pending',
    admin_notes: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    student_name: 'سارة خالد',
    age: 12,
    parent_name: 'خالد إبراهيم',
    email: 'parent2@example.com',
    phone: '01098765432',
    program: 'robotics',
    notes: null,
    status: 'accepted',
    admin_notes: 'تم التواصل مع ولي الأمر',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: '3',
    student_name: 'يوسف عمر',
    age: 9,
    parent_name: 'عمر حسن',
    email: 'parent3@example.com',
    phone: '01155443322',
    program: 'design',
    notes: 'يفضل الدروس مساءً',
    status: 'rejected',
    admin_notes: 'المقاعد ممتلئة',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
]

function loadRequests(): RegistrationRequest[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const requests = JSON.parse(stored) as RegistrationRequest[]
      return requests.map((r) => ({ ...r, email: r.email ?? '' }))
    }
  } catch {
    /* use defaults */
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyRequests))
  return dummyRequests
}

function saveRequests(requests: RegistrationRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests))
}

export function getRequests(): RegistrationRequest[] {
  return loadRequests().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
}

export function addRequest(data: RegistrationFormData): RegistrationRequest {
  const requests = loadRequests()
  const now = new Date().toISOString()
  const request: RegistrationRequest = {
    id: crypto.randomUUID(),
    student_name: data.student_name,
    age: data.age,
    parent_name: data.parent_name,
    email: data.email,
    phone: data.phone,
    program: data.program,
    notes: data.notes || null,
    status: 'pending',
    admin_notes: null,
    created_at: now,
    updated_at: now,
  }
  requests.unshift(request)
  saveRequests(requests)
  return request
}

export function updateRequestStatus(id: string, status: RequestStatus): RegistrationRequest | null {
  const requests = loadRequests()
  const index = requests.findIndex((r) => r.id === id)
  if (index === -1) return null

  requests[index] = {
    ...requests[index],
    status,
    updated_at: new Date().toISOString(),
  }
  saveRequests(requests)
  return requests[index]
}

export function updateRequestNotes(id: string, admin_notes: string): RegistrationRequest | null {
  const requests = loadRequests()
  const index = requests.findIndex((r) => r.id === id)
  if (index === -1) return null

  requests[index] = {
    ...requests[index],
    admin_notes,
    updated_at: new Date().toISOString(),
  }
  saveRequests(requests)
  return requests[index]
}

export function resetToDummyData(): void {
  saveRequests(dummyRequests)
}
