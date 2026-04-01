import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="auth-page">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
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
