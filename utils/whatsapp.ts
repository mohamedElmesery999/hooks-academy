import { PROGRAMS } from '../types/registration'

export const WHATSAPP_GROUP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK as string | undefined

export function normalizePhoneForWhatsApp(phone: string): string {
  let digits = phone.replace(/\D/g, '')

  if (digits.startsWith('0')) {
    digits = '20' + digits.slice(1)
  } else if (!digits.startsWith('20') && digits.length === 10) {
    digits = '20' + digits
  }

  return digits
}

export function openWhatsAppGroup(): void {
  if (WHATSAPP_GROUP_LINK) {
    window.open(WHATSAPP_GROUP_LINK, '_blank')
  }
}

export function buildWhatsAppUrl(message: string, phone: string): string {
  const number = normalizePhoneForWhatsApp(phone)
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function getProgramLabel(program: string): string {
  return PROGRAMS.find((p) => p.value === program)?.label ?? program
}
