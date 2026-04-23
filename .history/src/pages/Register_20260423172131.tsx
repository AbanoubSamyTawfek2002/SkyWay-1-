import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Mail, Lock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
// 🛑 تم استيراد الرابط الموحد هنا
import { API_URL } from "../App";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"register" | "otp">("register");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
      setError("Please verify you're not a robot.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      // 🔄 التعديل هنا: استخدام API_URL لطلب التسجيل
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("otp");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError(
        "An error occurred during registration. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 🔄 التعديل هنا: استخدام API_URL لطلب التأكيد
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user, data.token);
        navigate("/");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="text-primary" size={24} />
            </div>
            <CardTitle className="text-3xl font-black uppercase tracking-tighter">
              Verify Email
            </CardTitle>
            <CardDescription>
              We've sent a 6-digit code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg animate-in fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  placeholder="123456"
                  className="h-14 text-center text-2xl font-black tracking-[0.5em]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-bold uppercase tracking-widest shadow-lg hover:shadow-primary/20 transition-all"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Register"}
              </Button>

              <button
                type="button"
                onClick={() => setStep("register")}
                className="w-full text-center text-sm text-muted-foreground hover:text-primary underline transition-colors"
              >
                Use a different email
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl transition-all border-t-4 border-t-primary">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserIcon className="text-primary" size={24} />
          </div>
          <CardTitle className="text-3xl font-black uppercase tracking-tighter">
            {t("register")}
          </CardTitle>
          <CardDescription>
            Create an account to start booking your dream trips
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg animate-in fade-in">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email") || "Email"}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password") || "Password"}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Mock CAPTCHA */}
            <div className="p-4 border border-border rounded-lg flex items-center gap-4 bg-muted/30 transition-colors hover:bg-muted/50">
              <Checkbox
                id="captcha"
                onCheckedChange={(checked) =>
                  setCaptchaVerified(checked === true)
                }
              />
              <Label
                htmlFor="captcha"
                className="cursor-pointer font-medium flex items-center gap-2 text-sm"
              >
                I'm not a robot
                <ShieldCheck size={16} className="text-green-600" />
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold uppercase tracking-widest mt-4 shadow-lg hover:shadow-primary/20 transition-all"
              disabled={loading}
            >
              {loading ? "Creating..." : t("register")}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-4 pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline transition-colors"
              >
                {t("login")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
