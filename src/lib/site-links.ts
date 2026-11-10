// The site's own sections, as the footer lists them. The header nav normally comes from the
// Prismic `nav` document; the 404 page renders without a page load of its own, so it uses this
// list (plus Contact) instead of a Prismic call on every unknown URL.
export const siteLinks = [
	{ href: '/about', text: 'About' },
	{ href: '/portfolio', text: 'Industrial Portfolio' },
	{ href: '/investors', text: 'Investors' },
	{ href: '/office', text: 'Office' }
];
