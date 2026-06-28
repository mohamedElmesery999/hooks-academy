import nodemailer from 'nodemailer'
import {
  buildAdminReplyMessage,
  buildAdminReplySubject,
  buildCustomEmailSubject,
} from '@/lib/email-templates'

function getSmtpConfig() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_APP_PASSWORD

  if (!user || !pass) {
    throw new Error('إعدادات البريد غير مكتملة. أضف SMTP_USER و SMTP_APP_PASSWORD في ملف .env')
  }

  return { user, pass }
}

function createTransporter() {
  const { user, pass } = getSmtpConfig()

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

type SendEmailParams = {
  to: string
  subject: string
  text: string
}

async function sendEmail({ to, subject, text }: SendEmailParams) {
  const { user } = getSmtpConfig()
  const fromName = process.env.SMTP_FROM_NAME ?? 'Hooks Academy'
  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to,
    subject,
    text,
  })
}

export async function sendStudentStatusEmail(params: {
  to: string
  studentName: string
  parentName: string
  status: 'accepted' | 'rejected'
  customMessage?: string | null
}) {
  const subject = buildAdminReplySubject(params.status)
  const text = buildAdminReplyMessage(
    params.studentName,
    params.parentName,
    params.status,
    params.customMessage ?? undefined,
  )

  await sendEmail({ to: params.to, subject, text })
}

export async function sendStudentCustomEmail(params: {
  to: string
  studentName: string
  parentName: string
  message: string
  status?: 'accepted' | 'rejected' | 'pending'
  subject?: string
}) {
  const trimmed = params.message.trim()

  let text = trimmed
  if (!text && params.status && params.status !== 'pending') {
    text = buildAdminReplyMessage(
      params.studentName,
      params.parentName,
      params.status,
    )
  }

  if (!text) {
    throw new Error('نص الرسالة مطلوب')
  }

  const subject =
    params.subject?.trim() ||
    (params.status === 'accepted' || params.status === 'rejected'
      ? buildAdminReplySubject(params.status)
      : buildCustomEmailSubject())

  await sendEmail({ to: params.to, subject, text })
}

export async function verifyEmailConfig() {
  const transporter = createTransporter()
  await transporter.verify()
}
