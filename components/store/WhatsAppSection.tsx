import { MessageCircle, Phone, Clock } from "lucide-react";

export default function WhatsAppSection() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "218922613675";

  return (
    <section className="container mx-auto px-4">
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 md:p-12 text-white">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-2xl font-bold">اطلب عبر واتساب</h2>
            </div>
            <p className="text-green-100 max-w-md">
              تواصل معنا مباشرة عبر واتساب لطلب أي منتج أو الاستفسار عن التوفر والأسعار
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-green-100">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                رد فوري
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                متاح طوال اليوم
              </div>
            </div>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}?text=مرحباً، أريد الاستفسار عن منتج من متجر HALIZ`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <MessageCircle className="w-6 h-6" />
            ابدأ المحادثة
          </a>
        </div>
      </div>
    </section>
  );
}
