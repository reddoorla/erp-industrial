interface BuildOutApi {
	embed: (opts: Record<string, unknown>) => void;
}

/**
 * Runs `run` once the BuildOut embed script (loaded with `defer` in app.html) is available.
 * Polls briefly because the script no longer blocks parsing, so page `onMount` can fire first.
 *
 * Returns a cancel function: call it from the caller's `onMount` cleanup so the poll stops (and
 * never fires `run` into a detached/removed target) if the component unmounts mid-poll.
 */
export function withBuildOut(run: (buildOut: BuildOutApi) => void, tries = 50): () => void {
	let timer: ReturnType<typeof setTimeout> | undefined;
	let cancelled = false;

	const attempt = (remaining: number) => {
		if (cancelled) return;
		const buildOut = (window as unknown as { BuildOut?: BuildOutApi }).BuildOut;
		if (buildOut) {
			run(buildOut);
			return;
		}
		if (remaining <= 0) {
			console.error('BuildOut embed script failed to load');
			return;
		}
		timer = setTimeout(() => attempt(remaining - 1), 100);
	};

	attempt(tries);

	return () => {
		cancelled = true;
		if (timer) clearTimeout(timer);
	};
}
