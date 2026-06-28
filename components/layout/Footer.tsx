"use client"
import { GraduationCap, Mail, Phone } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-dark-border bg-dark-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img src="/logo.png" alt="Hooks Academy" className="h-12 w-12 rounded-xl object-cover" />
              <div>
                <p className="text-lg font-bold text-white">Hooks Academy</p>
                <p className="text-sm text-slate-400">أكاديمية هوكس التعليمية</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              نقدّم محتوى تعليمي ممتع وتفاعلي للأطفال من 8 إلى 15 سنة، لبناء مهارات المستقبل.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">روابط سريعة</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">الرئيسية</Link></li>
              <li><Link href="/services" className="hover:text-primary-400 transition-colors">الخدمات</Link></li>
              <li><Link href="/content" className="hover:text-primary-400 transition-colors">المحتوى</Link></li>
              <li><Link href="/register" className="hover:text-primary-400 transition-colors">التسجيل</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <GraduationCap size={16} className="text-primary-400" />
                للأطفال 8 - 15 سنة
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary-400" />
                واتساب: متاح عبر التسجيل
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary-400" />
                info@hooksacademy.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-dark-border pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Hooks Academy. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}
