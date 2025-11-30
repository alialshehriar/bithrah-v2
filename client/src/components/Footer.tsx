import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "المنصة",
      links: [
        { label: "عن بذرة", href: "/about" },
        { label: "الأسئلة الشائعة", href: "/faq" },
        { label: "اتصل بنا", href: "/contact" },
        { label: "التسجيل المبكر", href: "/early-access" },
      ],
    },
    {
      title: "المشاريع",
      links: [
        { label: "تصفح المشاريع", href: "/projects" },
        { label: "التسجيل المبكر", href: "/early-access" },
      ],
    },
    {
      title: "المجتمع",
      links: [
        { label: "المجتمع", href: "/community" },
        { label: "لوحة الصدارة", href: "/leaderboard" },
      ],
    },
    {
      title: "قانوني",
      links: [
        { label: "الشروط والأحكام", href: "/terms" },
        { label: "سياسة الخصوصية", href: "/privacy" },
        { label: "حماية الملكية الفكرية", href: "/ip-protection" },
        { label: "الأسئلة الشائعة", href: "/faq" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/bithrahapp", label: "X (Twitter)" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/">
              <a className="flex items-center gap-2 mb-4 hover:opacity-90 transition-opacity">
                <img 
                  src="/logo-dark-bg.png" 
                  alt="بذرة" 
                  className="h-12 w-auto"
                />
              </a>
            </Link>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              منصة وساطة ذكية تربط أصحاب الأفكار والمستثمرين في بيئة سعودية احترافية مدعومة
              بالذكاء الاصطناعي
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:info@bithrahapp.com"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@bithrahapp.com</span>
              </a>
              <a
                href="tel:+966592725341"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span dir="ltr">+966 59 272 5341</span>
              </a>
              <a
                href="https://wa.me/966592725341"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>واتساب</span>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <a className="text-sm hover:text-white transition-colors">{link.label}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} بذرة. جميع الحقوق محفوظة.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gradient-bg transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Language & Currency */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>العربية</span>
              <span className="text-gray-600">|</span>
              <span>SAR</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
