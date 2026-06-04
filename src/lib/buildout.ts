interface BuildOutApi {
	embed: (opts: Record<string, unknown>) => void;
}

/**
 * Runs `run` once the BuildOut embed script (loaded with `defer` in app.html) is available.
 * Polls briefly because the script no longer blocks parsing, so page `onMount` can fire first.
 */
export function withBuildOut(run: (buildOut: BuildOutApi) => void, tries = 50): void {
	const buildOut = (window as unknown as { BuildOut?: BuildOutApi }).BuildOut;
	if (buildOut) {
		run(buildOut);
		return;
	}
	if (tries <= 0) {
		console.error('BuildOut embed script failed to load');
		return;
	}
	setTimeout(() => withBuildOut(run, tries - 1), 100);
}
