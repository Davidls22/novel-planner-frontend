export default function HomePage() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Plan Your Novel with Ease</h1>
          <p className="py-6">
            Organize your novel with the STAR method, manage your characters, and build your world.
          </p>
          <a href="/register" className="btn btn-primary">Get Started</a>
          <a href="/login" className="btn btn-secondary ml-4">Login</a>
        </div>
      </div>
    </div>
  );
}