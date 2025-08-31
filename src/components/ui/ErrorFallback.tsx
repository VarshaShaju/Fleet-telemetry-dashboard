type Props = { error: unknown; resetErrorBoundary: () => void };

export default function ErrorFallback({ error, resetErrorBoundary }: Props) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div role="alert" className="p-4 border rounded m-4">
      <p className="font-semibold mb-2">Something went wrong:</p>
      <pre className="text-red-600 whitespace-pre-wrap">{message}</pre>
      <button onClick={resetErrorBoundary} className="mt-3 px-3 py-1 border rounded">
        Try again
      </button>
    </div>
  );
}
