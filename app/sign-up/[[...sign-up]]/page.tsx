import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="auth-page">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
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
