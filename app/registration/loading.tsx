export default function Loading() {
  return (
    <div className="mx-auto flex w-full flex-1 flex-col rounded-md border border-neutral-200 bg-gray-100 md:flex-row h-screen animate-pulse">
      <div className="h-full w-[60px] bg-neutral-100 dark:bg-neutral-800 hidden md:flex md:flex-col" />
      <div className="flex flex-1">
        <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black overflow-hidden p-4 md:p-10 gap-6">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-4 w-96 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-4 w-72 bg-neutral-200 dark:bg-neutral-700 rounded" />
          <div className="h-32 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
        </div>
      </div>
    </div>
  );
}