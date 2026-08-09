"use client"
import { GraduationCap, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { siteConfig } from '@/lib/seo/site'

function FacebookIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-dark-border bg-dark-card">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-6 sm:py-12">
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
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1877F2]/25 transition-all hover:bg-[#166FE5] hover:shadow-[#1877F2]/40 sm:w-auto"
            >
              <FacebookIcon size={18} />
              صفحتنا على فيسبوك
            </a>
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
                {siteConfig.email}
              </li>
            </ul>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center gap-3 rounded-xl border border-[#1877F2]/40 bg-[#1877F2]/10 px-4 py-3 text-sm font-semibold text-[#5B9EFF] transition-colors hover:border-[#1877F2]/70 hover:bg-[#1877F2]/20 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1877F2] text-white">
                <FacebookIcon size={18} />
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span>صفحتنا على فيسبوك</span>
                <span className="text-xs font-normal text-slate-500">تابع آخر الأخبار والدروس</span>
              </span>
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-dark-border pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Hooks Academy. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}
