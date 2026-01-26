const ideas = [
  "Local tourism blog for Maramureș",
  "Seasonal offers landing page",
  "Video testimonials pipeline",
];

export default function IdeasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ideas</h1>
        <p className="text-sm text-neutral-500">Capture and track ideas.</p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <ul className="space-y-2 text-sm">
          {ideas.map((idea) => (
            <li key={idea} className="rounded-md border border-neutral-100 p-2">
              {idea}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
