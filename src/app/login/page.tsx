export default function LoginPage() {
  return (
    <div className="mx-auto flex h-full max-w-md flex-col justify-center">
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Use your username and password.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-neutral-500">Username</label>
            <input
              className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              type="text"
              placeholder="daniel"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500">Password</label>
            <input
              className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-md bg-neutral-900 px-3 py-2 text-sm text-white"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
