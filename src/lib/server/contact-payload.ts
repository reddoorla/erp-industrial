// The visitor fields of the contact form, mapped for the central ingest.
//
// `testMode` is the fleet form-e2e probe's marker: the probe injects a hidden
// `testMode=true` input into the form, and central ingest short-circuits a
// payload carrying top-level `testMode: true` (no row, no email). It must be read
// from the submitted FormData — the probe's input is not part of any bound state —
// and `/health` declares `forms.testMode: true` only because this forwards it.
export function contactFields(form: FormData) {
	return {
		email: form.get('email')?.toString(),
		message: form.get('message')?.toString(),
		interest: form.get('interest')?.toString() || undefined, // → extraFields.interest, the routing key
		...(form.get('testMode') === 'true' ? { testMode: true as const } : {})
	};
}
