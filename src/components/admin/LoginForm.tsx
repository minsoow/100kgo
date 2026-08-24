"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/admin/actions";
import { initialActionState } from "@/lib/action-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-btn bg-brand-900 px-5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "확인 중…" : "로그인"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-[13px] font-bold text-ink-700"
        >
          아이디
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="mt-2 w-full rounded-btn border border-line px-4 py-3 text-[15px] outline-none transition-colors focus:border-brand-400"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[13px] font-bold text-ink-700"
        >
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 w-full rounded-btn border border-line px-4 py-3 text-[15px] outline-none transition-colors focus:border-brand-400"
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-btn bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700"
        >
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
