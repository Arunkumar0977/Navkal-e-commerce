import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-soft-pattern flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(245,208,222,0.4)" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl" style={{ background: "rgba(232,224,245,0.3)" }} />
      </div>
      <div className="relative flex flex-col items-center gap-6">
        <a href="/" className="text-center">
          <h1 className="font-cormorant text-4xl font-semibold" style={{ color: "#5c3a2e" }}>Navkala</h1>
          <p style={{ fontSize: "10px", letterSpacing: "4px", color: "#8B4B5A", textTransform: "uppercase", marginTop: "2px" }}>Crochet</p>
        </a>
        <SignIn fallbackRedirectUrl="/" signUpUrl="/sign-up" />
      </div>
    </div>
  );
}
