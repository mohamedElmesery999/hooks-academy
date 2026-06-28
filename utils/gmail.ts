import { buildAdminReplyMessage, buildAdminReplySubject } from './adminReply'

export function buildGmailUrl(
  email: string,
  studentName: string,
  parentName: string,
  status: 'accepted' | 'rejected',
  customMessage?: string,
): string {
  const subject = buildAdminReplySubject(status)
  const body = buildAdminReplyMessage(studentName, parentName, status, customMessage)
  const params = new URLSearchParams({ subject, body })
  return `mailto:${email}?${params.toString()}`
}

export function openGmailReply(
  email: string,
  studentName: string,
  parentName: string,
  status: 'accepted' | 'rejected',
  customMessage?: string,
): void {
  const url = buildGmailUrl(email, studentName, parentName, status, customMessage)
  window.location.href = url
}
