export function buildAdminReplyMessage(
  studentName: string,
  parentName: string,
  status: 'accepted' | 'rejected',
  customMessage?: string,
): string {
  if (customMessage?.trim()) return customMessage.trim()

  if (status === 'accepted') {
    return `مرحباً ${parentName}!

تم قبول طلب تسجيل ${studentName} في Hooks Academy.

سيتم إضافتكم إلى مجموعة الواتساب الخاصة بالدورة قريباً باستخدام رقم الهاتف المسجّل.

سنتواصل معكم قريباً لتحديد موعد البدء.

Hooks Academy`
  }

  return `مرحباً ${parentName},

نشكركم على اهتمامكم بتسجيل ${studentName} في Hooks Academy.

للأسف لا يمكننا قبول الطلب حالياً، لكن يمكنكم التواصل معنا لمعرفة البدائل المتاحة.

Hooks Academy`
}

export function buildAdminReplySubject(status: 'accepted' | 'rejected'): string {
  if (status === 'accepted') return 'تم قبول طلب التسجيل - Hooks Academy'
  return 'بخصوص طلب التسجيل - Hooks Academy'
}

export function buildCustomEmailSubject(): string {
  return 'رسالة من Hooks Academy'
}
