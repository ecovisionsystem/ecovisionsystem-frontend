export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-semibold">Access not assigned</h1>
        <p className="text-gray-600">
          Your account exists, but no EcoVision role has been assigned yet.
          Please contact an administrator.
        </p>
      </div>
    </main>
  );
}
