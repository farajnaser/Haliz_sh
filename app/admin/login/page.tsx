"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@haliz.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("خطأ في البيانات");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("حدث خطأ ما");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-10 shadow-xl shadow-pink-100 border border-pink-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-pink-900">تسجيل دخول الإدارة</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-pink-100 focus:border-pink-500"
            />
          </div>
          <div className="space-y-2">
            <Label>كلمة المرور</Label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-pink-100 focus:border-pink-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button 
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 h-12 rounded-full font-bold"
          >
            {loading ? <Loader2 className="animate-spin" /> : "دخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
