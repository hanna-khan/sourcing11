"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/app/admin/actions";
import { TextField } from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(loginAction, {});
  return (
    <form action={action} className="mt-8 space-y-5" noValidate>
      {state.error && (
        <p role="alert" className="rounded-field border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-medium text-danger">
          {state.error}
        </p>
      )}
      <TextField label="Email" name="email" type="email" autoComplete="username" required optionalLabel={false} />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" required optionalLabel={false} />
      <input type="hidden" name="next" value={next} />
      <Button type="submit" variant="dark" className="w-full" loading={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
