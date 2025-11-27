import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "المنصة",
      links: [
        { label: "عن بذرة", href: "/about" },
        { label: "كيف يعمل", href: "/how-it-works" },
        { label: "الأسئلة الشائعة", href: "/faq" },
        { label: "المدونة", href: "/blog" },
      ],
    },
    {
      title: "المشاريع",
      links: [
        { label: "تصفح المشاريع", href: "/projects" },
        { label: "ابدأ مشروعك", href: "/create-project" },
        { label: "قصص نجاح", href: "/success-stories" },
        { label: "الإحصائيات", href: "/stats" },
      ],
    },
    {
      title: "المجتمع",
      links: [
        { label: "المجتمع", href: "/community" },
        { label: "لوحة الصدارة", href: "/leaderboard" },
        { label: "الفعاليات", href: "/events" },
        { label: "الشركاء", href: "/partners" },
      ],
    },
    {
      title: "قانوني",
      links: [
        { label: "الشروط والأحكام", href: "/terms" },
        { label: "سياسة الخصوصية", href: "/privacy" },
        { label: "سياسة الاسترجاع", href: "/refund" },
        { label: "اتفاقية المستخدم", href: "/user-agreement" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/bithrah", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/bithrah", label: "Facebook" },
    { icon: Linkedin, href: "https://linkedin.com/company/bithrah", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com/bithrah", label: "Instagram" },
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
                  src="/logo-light.png" 
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
                href="tel:+966500000000"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span dir="ltr">+966 50 000 0000</span>
              </a>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>الرياض، المملكة العربية السعودية</span>
              </div>
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

            {/* Language & Currency (Optional) */}
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
