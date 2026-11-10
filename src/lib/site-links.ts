// The site's own sections, as the footer lists them. The header nav normally comes from the
// Prismic `nav` document; the 404 page renders without a page load of its own, so it uses this
// list (plus Contact) instead of a Prismic call on every unknown URL.
export const siteLinks = [
	{ href: '/about', text: 'About' },
	{ href: '/portfolio', text: 'Industrial Portfolio' },
	{ href: '/investors', text: 'Investors' },
	{ href: '/office', text: 'Office' }
];

// The investor and tenant portals, external, listed in every footer.
export const portalLinks = [
	{ href: 'https://icx.efrontcloud.com/@9894/ERP/login.aspx', text: 'PE Investor Portal' },
	{ href: 'https://starportal2.star.vistra.com/erp/#/index', text: 'DST Investor Portal' },
	{
		href: 'https://tenantportal-erpfunds.securecafe3.com/newtenantportal/content2/login/?companyId=161',
		text: 'Tenant Portal'
	}
];
