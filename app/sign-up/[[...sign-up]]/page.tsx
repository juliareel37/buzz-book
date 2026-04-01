import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="auth-page">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
        appearance={{
          elements: {
            card: "clerk-card",
            rootBox: "clerk-root",
          },
        }}
      />
    </section>
  );
}
