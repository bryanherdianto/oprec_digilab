"use client";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex items-center justify-center">
			<div className="text-center space-y-4">
				<h2 className="text-2xl font-bold">Something went wrong</h2>
				<p className="text-gray-500 dark:text-gray-400">
					{error.message || "An unexpected error occurred."}
				</p>
				<button
					onClick={reset}
					className="rounded-md bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
				>
					Try again
				</button>
			</div>
		</div>
	);
}
