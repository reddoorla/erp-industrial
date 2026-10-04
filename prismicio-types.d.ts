import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

/**
 * Item in *form replies → replies*
 */
export interface FormRepliesDocumentDataRepliesItem {
	/**
	 * form field in *form replies → replies*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Pick the form this reply answers — one row per form
	 * - **API ID Path**: form_replies.replies[].form_type
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	form_type: prismic.SelectField<"contact" | "inquiry" | "newsletter" | "rsvp" | "reserve">;
	
	/**
	 * subject field in *form replies → replies*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Subject line of the email the visitor receives
	 * - **API ID Path**: form_replies.replies[].subject
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	subject: prismic.KeyTextField;
	
	/**
	 * body field in *form replies → replies*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: What the visitor reads. Bold, italic, links and lists are sent; other formatting is not.
	 * - **API ID Path**: form_replies.replies[].body
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	body: prismic.RichTextField;
}

/**
 * Content for form replies documents
 */
interface FormRepliesDocumentData {
	/**
	 * replies field in *form replies*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: form_replies.replies[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	replies: prismic.GroupField<Simplify<FormRepliesDocumentDataRepliesItem>>;
	
	/**
	 * signature field in *form replies*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Sign-off appended to every reply, whatever the form
	 * - **API ID Path**: form_replies.signature
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	signature: prismic.RichTextField;
}

/**
 * form replies document from Prismic
 *
 * - **API ID**: `form_replies`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type FormRepliesDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<FormRepliesDocumentData>, "form_replies", Lang>;

/**
 * Item in *nav → links*
 */
export interface NavDocumentDataLinksItem {
	/**
	 * text field in *nav → links*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: nav.links[].text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	text: prismic.KeyTextField;
	
	/**
	 * href field in *nav → links*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: nav.links[].href
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	href: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for nav documents
 */
interface NavDocumentData {
	/**
	 * links field in *nav*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: nav.links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	links: prismic.GroupField<Simplify<NavDocumentDataLinksItem>>;
}

/**
 * nav document from Prismic
 *
 * - **API ID**: `nav`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type NavDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<NavDocumentData>, "nav", Lang>;

type PageDocumentDataSlicesSlice = HeroSlice | FullScreenSlideSlice | RichTextSlice

/**
 * Content for Page documents
 */
interface PageDocumentData {
	/**
	 * Title field in *Page*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	title: prismic.RichTextField;
	
	/**
	 * Slice Zone field in *Page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<PageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *Page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Page document from Prismic
 *
 * - **API ID**: `page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type PageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<PageDocumentData>, "page", Lang>;

export type AllDocumentTypes = FormRepliesDocument | NavDocument | PageDocument;

/**
 * Primary content in *FullScreenSlide → with popup buttons → Primary*
 */
export interface FullScreenSlideSliceDefaultPrimary {
	/**
	 * background image field in *FullScreenSlide → with popup buttons → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.default.primary.background_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	background_image: prismic.ImageField<never>;
	
	/**
	 * eyebrow field in *FullScreenSlide → with popup buttons → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.default.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * title field in *FullScreenSlide → with popup buttons → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * stacks? field in *FullScreenSlide → with popup buttons → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.default.primary.doesStack
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	doesStack: prismic.BooleanField;
	
	/**
	 * body text field in *FullScreenSlide → with popup buttons → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.default.primary.body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
	
	/**
	 * isBackgroundBlurred field in *FullScreenSlide → with popup buttons → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.default.primary.isBackgroundBlurred
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isBackgroundBlurred: prismic.BooleanField;
	
	/**
	 * isNavLight field in *FullScreenSlide → with popup buttons → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.default.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
}

/**
 * Primary content in *FullScreenSlide → Items*
 */
export interface FullScreenSlideSliceDefaultItem {
	/**
	 * button text field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].button_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_text: prismic.KeyTextField;
	
	/**
	 * eyebrow field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * title field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * body text field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].body_text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	body_text: prismic.RichTextField;
	
	/**
	 * button_link field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * with popup buttons variation for FullScreenSlide Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSliceDefault = prismic.SharedSliceVariation<"default", Simplify<FullScreenSlideSliceDefaultPrimary>, Simplify<FullScreenSlideSliceDefaultItem>>;

/**
 * Primary content in *FullScreenSlide → custom embed → Primary*
 */
export interface FullScreenSlideSliceEmbedPrimary {
	/**
	 * title field in *FullScreenSlide → custom embed → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.embed.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * external embed field in *FullScreenSlide → custom embed → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.embed.primary.external_embed
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	external_embed: prismic.KeyTextField;
	
	/**
	 * stacks? field in *FullScreenSlide → custom embed → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.embed.primary.doesStack
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	doesStack: prismic.BooleanField;
	
	/**
	 * isNavLight field in *FullScreenSlide → custom embed → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.embed.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
}

/**
 * custom embed variation for FullScreenSlide Slice
 *
 * - **API ID**: `embed`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSliceEmbed = prismic.SharedSliceVariation<"embed", Simplify<FullScreenSlideSliceEmbedPrimary>, never>;

/**
 * Primary content in *FullScreenSlide → with video popup → Primary*
 */
export interface FullScreenSlideSliceWithVideoPopupPrimary {
	/**
	 * background image field in *FullScreenSlide → with video popup → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.withVideoPopup.primary.background_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	background_image: prismic.ImageField<never>;
	
	/**
	 * eyebrow field in *FullScreenSlide → with video popup → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.withVideoPopup.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * title field in *FullScreenSlide → with video popup → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.withVideoPopup.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * button text field in *FullScreenSlide → with video popup → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.withVideoPopup.primary.button_text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	button_text: prismic.RichTextField;
	
	/**
	 * body_text field in *FullScreenSlide → with video popup → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.withVideoPopup.primary.body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
	
	/**
	 * video embed field in *FullScreenSlide → with video popup → Primary*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.withVideoPopup.primary.video_embed
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	video_embed: prismic.EmbedField
	
	/**
	 * stacks? field in *FullScreenSlide → with video popup → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.withVideoPopup.primary.doesStack
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	doesStack: prismic.BooleanField;
	
	/**
	 * isBackgroundBlurred field in *FullScreenSlide → with video popup → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.withVideoPopup.primary.isBackgroundBlurred
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isBackgroundBlurred: prismic.BooleanField;
	
	/**
	 * isNavLight field in *FullScreenSlide → with video popup → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.withVideoPopup.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
}

/**
 * with video popup variation for FullScreenSlide Slice
 *
 * - **API ID**: `withVideoPopup`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSliceWithVideoPopup = prismic.SharedSliceVariation<"withVideoPopup", Simplify<FullScreenSlideSliceWithVideoPopupPrimary>, never>;

/**
 * Primary content in *FullScreenSlide → Basic → Primary*
 */
export interface FullScreenSlideSliceBasicPrimary {
	/**
	 * background image field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.basic.primary.background_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	background_image: prismic.ImageField<never>;
	
	/**
	 * eyebrow field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.basic.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * title field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.basic.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * body text field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.basic.primary.body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
	
	/**
	 * stacks? field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.basic.primary.doesStack
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	doesStack: prismic.BooleanField;
	
	/**
	 * isBackgroundBlurred field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.basic.primary.isBackgroundBlurred
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isBackgroundBlurred: prismic.BooleanField;
	
	/**
	 * isNavLight field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.basic.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
	
	/**
	 * button_text_1 field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.basic.primary.button_text_1
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_text_1: prismic.KeyTextField;
	
	/**
	 * button_link_1 field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.basic.primary.button_link_1
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link_1: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * button_text_2 field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.basic.primary.button_text_2
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_text_2: prismic.KeyTextField;
	
	/**
	 * button_link_2 field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.basic.primary.button_link_2
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link_2: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * isImageLeft field in *FullScreenSlide → Basic → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.basic.primary.isimageleft
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isimageleft: prismic.BooleanField;
}

/**
 * Basic variation for FullScreenSlide Slice
 *
 * - **API ID**: `basic`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSliceBasic = prismic.SharedSliceVariation<"basic", Simplify<FullScreenSlideSliceBasicPrimary>, never>;

/**
 * Primary content in *FullScreenSlide → icon boxes → Primary*
 */
export interface FullScreenSlideSliceIconBoxesPrimary {
	/**
	 * background image field in *FullScreenSlide → icon boxes → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.iconBoxes.primary.background_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	background_image: prismic.ImageField<never>;
	
	/**
	 * eyebrow field in *FullScreenSlide → icon boxes → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.iconBoxes.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * title field in *FullScreenSlide → icon boxes → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.iconBoxes.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * body text field in *FullScreenSlide → icon boxes → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.iconBoxes.primary.body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
	
	/**
	 * stacks? field in *FullScreenSlide → icon boxes → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.iconBoxes.primary.doesStack
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	doesStack: prismic.BooleanField;
	
	/**
	 * isBackgroundBlurred field in *FullScreenSlide → icon boxes → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.iconBoxes.primary.isBackgroundBlurred
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isBackgroundBlurred: prismic.BooleanField;
	
	/**
	 * isNavLight field in *FullScreenSlide → icon boxes → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.iconBoxes.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
}

/**
 * Primary content in *FullScreenSlide → Items*
 */
export interface FullScreenSlideSliceIconBoxesItem {
	/**
	 * icon field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	icon: prismic.ImageField<never>;
	
	/**
	 * eyebrow field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * body_text field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
}

/**
 * icon boxes variation for FullScreenSlide Slice
 *
 * - **API ID**: `iconBoxes`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSliceIconBoxes = prismic.SharedSliceVariation<"iconBoxes", Simplify<FullScreenSlideSliceIconBoxesPrimary>, Simplify<FullScreenSlideSliceIconBoxesItem>>;

/**
 * Primary content in *FullScreenSlide → teams → Primary*
 */
export interface FullScreenSlideSliceTeamsPrimary {
	/**
	 * background image field in *FullScreenSlide → teams → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.teams.primary.background_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	background_image: prismic.ImageField<never>;
	
	/**
	 * eyebrow field in *FullScreenSlide → teams → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.teams.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * title field in *FullScreenSlide → teams → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.teams.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * body text field in *FullScreenSlide → teams → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.teams.primary.body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
	
	/**
	 * stacks? field in *FullScreenSlide → teams → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.teams.primary.doesStack
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	doesStack: prismic.BooleanField;
	
	/**
	 * isBackgroundBlurred field in *FullScreenSlide → teams → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.teams.primary.isBackgroundBlurred
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isBackgroundBlurred: prismic.BooleanField;
	
	/**
	 * isNavLight field in *FullScreenSlide → teams → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.teams.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
}

/**
 * Primary content in *FullScreenSlide → Items*
 */
export interface FullScreenSlideSliceTeamsItem {
	/**
	 * headshot field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].headshot
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	headshot: prismic.ImageField<never>;
	
	/**
	 * name field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * job title field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * body_text field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].body_text
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	body_text: prismic.RichTextField;
}

/**
 * teams variation for FullScreenSlide Slice
 *
 * - **API ID**: `teams`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSliceTeams = prismic.SharedSliceVariation<"teams", Simplify<FullScreenSlideSliceTeamsPrimary>, Simplify<FullScreenSlideSliceTeamsItem>>;

/**
 * Primary content in *FullScreenSlide → halfPage → Primary*
 */
export interface FullScreenSlideSliceHalfPagePrimary {
	/**
	 * background image field in *FullScreenSlide → halfPage → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.halfPage.primary.background_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	background_image: prismic.ImageField<never>;
	
	/**
	 * eyebrow field in *FullScreenSlide → halfPage → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.halfPage.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * title field in *FullScreenSlide → halfPage → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.halfPage.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * body text field in *FullScreenSlide → halfPage → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.halfPage.primary.body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
	
	/**
	 * stacks? field in *FullScreenSlide → halfPage → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.halfPage.primary.doesStack
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	doesStack: prismic.BooleanField;
	
	/**
	 * isBackgroundBlurred field in *FullScreenSlide → halfPage → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.halfPage.primary.isBackgroundBlurred
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isBackgroundBlurred: prismic.BooleanField;
	
	/**
	 * isImageLeft field in *FullScreenSlide → halfPage → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.halfPage.primary.isImageLeft
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isImageLeft: prismic.BooleanField;
	
	/**
	 * isNavLight field in *FullScreenSlide → halfPage → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.halfPage.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
}

/**
 * Primary content in *FullScreenSlide → Items*
 */
export interface FullScreenSlideSliceHalfPageItem {
	/**
	 * button_text field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].button_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_text: prismic.KeyTextField;
	
	/**
	 * button_link field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * halfPage variation for FullScreenSlide Slice
 *
 * - **API ID**: `halfPage`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSliceHalfPage = prismic.SharedSliceVariation<"halfPage", Simplify<FullScreenSlideSliceHalfPagePrimary>, Simplify<FullScreenSlideSliceHalfPageItem>>;

/**
 * Primary content in *FullScreenSlide → big text → Primary*
 */
export interface FullScreenSlideSliceBigTextPrimary {
	/**
	 * background image field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.bigText.primary.background_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	background_image: prismic.ImageField<never>;
	
	/**
	 * eyebrow field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.bigText.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * title field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.bigText.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * body text field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.bigText.primary.body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
	
	/**
	 * stacks? field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.bigText.primary.doesStack
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	doesStack: prismic.BooleanField;
	
	/**
	 * isBackgroundBlurred field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.bigText.primary.isBackgroundBlurred
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isBackgroundBlurred: prismic.BooleanField;
	
	/**
	 * isNavLight field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.bigText.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
	
	/**
	 * button_text_1 field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.bigText.primary.button_text_1
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_text_1: prismic.KeyTextField;
	
	/**
	 * button_link_1 field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.bigText.primary.button_link_1
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link_1: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * button_text_2 field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.bigText.primary.button_text_2
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_text_2: prismic.KeyTextField;
	
	/**
	 * button_link_2 field in *FullScreenSlide → big text → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.bigText.primary.button_link_2
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link_2: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * big text variation for FullScreenSlide Slice
 *
 * - **API ID**: `bigText`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSliceBigText = prismic.SharedSliceVariation<"bigText", Simplify<FullScreenSlideSliceBigTextPrimary>, never>;

/**
 * Primary content in *FullScreenSlide → halfPageWithButtonOverlays → Primary*
 */
export interface FullScreenSlideSliceHalfPageWithButtonOverlaysPrimary {
	/**
	 * background image field in *FullScreenSlide → halfPageWithButtonOverlays → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.halfPageWithButtonOverlays.primary.background_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	background_image: prismic.ImageField<never>;
	
	/**
	 * eyebrow field in *FullScreenSlide → halfPageWithButtonOverlays → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.halfPageWithButtonOverlays.primary.eyebrow
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	eyebrow: prismic.KeyTextField;
	
	/**
	 * title field in *FullScreenSlide → halfPageWithButtonOverlays → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.halfPageWithButtonOverlays.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * body text field in *FullScreenSlide → halfPageWithButtonOverlays → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.halfPageWithButtonOverlays.primary.body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
	
	/**
	 * stacks? field in *FullScreenSlide → halfPageWithButtonOverlays → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.halfPageWithButtonOverlays.primary.doesStack
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	doesStack: prismic.BooleanField;
	
	/**
	 * isBackgroundBlurred field in *FullScreenSlide → halfPageWithButtonOverlays → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.halfPageWithButtonOverlays.primary.isBackgroundBlurred
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isBackgroundBlurred: prismic.BooleanField;
	
	/**
	 * isImageLeft field in *FullScreenSlide → halfPageWithButtonOverlays → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.halfPageWithButtonOverlays.primary.isImageLeft
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isImageLeft: prismic.BooleanField;
	
	/**
	 * isNavLight field in *FullScreenSlide → halfPageWithButtonOverlays → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: full_screen_slide.halfPageWithButtonOverlays.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
}

/**
 * Primary content in *FullScreenSlide → Items*
 */
export interface FullScreenSlideSliceHalfPageWithButtonOverlaysItem {
	/**
	 * button_text field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].button_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_text: prismic.KeyTextField;
	
	/**
	 * button_link field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * overlay_title field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].overlay_title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	overlay_title: prismic.KeyTextField;
	
	/**
	 * overlay_subtitle field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].overlay_subtitle
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	overlay_subtitle: prismic.KeyTextField;
	
	/**
	 * overlay_body field in *FullScreenSlide → Items*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: full_screen_slide.items[].overlay_body
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	overlay_body: prismic.RichTextField;
}

/**
 * halfPageWithButtonOverlays variation for FullScreenSlide Slice
 *
 * - **API ID**: `halfPageWithButtonOverlays`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSliceHalfPageWithButtonOverlays = prismic.SharedSliceVariation<"halfPageWithButtonOverlays", Simplify<FullScreenSlideSliceHalfPageWithButtonOverlaysPrimary>, Simplify<FullScreenSlideSliceHalfPageWithButtonOverlaysItem>>;

/**
 * Slice variation for *FullScreenSlide*
 */
type FullScreenSlideSliceVariation = FullScreenSlideSliceDefault | FullScreenSlideSliceEmbed | FullScreenSlideSliceWithVideoPopup | FullScreenSlideSliceBasic | FullScreenSlideSliceIconBoxes | FullScreenSlideSliceTeams | FullScreenSlideSliceHalfPage | FullScreenSlideSliceBigText | FullScreenSlideSliceHalfPageWithButtonOverlays

/**
 * FullScreenSlide Shared Slice
 *
 * - **API ID**: `full_screen_slide`
 * - **Description**: FullScreenSlide
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type FullScreenSlideSlice = prismic.SharedSlice<"full_screen_slide", FullScreenSlideSliceVariation>;

/**
 * Primary content in *Hero → Default → Primary*
 */
export interface HeroSliceDefaultPrimary {
	/**
	 * Title field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * vimeo embed (used only when the three video files below are empty) field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.default.primary.video_embed
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	video_embed: prismic.EmbedField
	
	/**
	 * background video (mp4) field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: H.264 mp4, 1080p or less, from `reddoor-maint video`
	 * - **API ID Path**: hero.default.primary.video_mp4
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	video_mp4: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * background video (webm) field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: VP9 webm, same clip, from `reddoor-maint video`
	 * - **API ID Path**: hero.default.primary.video_webm
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	video_webm: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * background video (mp4, phone) field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: 720p phone mp4 (…-phone-720.mp4) from `reddoor-maint video`
	 * - **API ID Path**: hero.default.primary.video_mp4_mobile
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	video_mp4_mobile: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * loading placeholder (also the video's poster) field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.default.primary.loading_placeholder
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	loading_placeholder: prismic.ImageField<never>;
	
	/**
	 * body_text field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.default.primary.body_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	body_text: prismic.KeyTextField;
	
	/**
	 * isNavLight field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: hero.default.primary.isnavlight
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	isnavlight: prismic.BooleanField;
	
	/**
	 * button text field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.default.primary.button_text
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	button_text: prismic.KeyTextField;
	
	/**
	 * button_link field in *Hero → Default → Primary*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: hero.default.primary.button_link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	button_link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Default variation for Hero Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSliceDefault = prismic.SharedSliceVariation<"default", Simplify<HeroSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Hero*
 */
type HeroSliceVariation = HeroSliceDefault

/**
 * Hero Shared Slice
 *
 * - **API ID**: `hero`
 * - **Description**: Hero
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type HeroSlice = prismic.SharedSlice<"hero", HeroSliceVariation>;

/**
 * Primary content in *RichText → Default → Primary*
 */
export interface RichTextSliceDefaultPrimary {
	/**
	 * Content field in *RichText → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: Lorem ipsum...
	 * - **API ID Path**: rich_text.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Default variation for RichText Slice
 *
 * - **API ID**: `default`
 * - **Description**: RichText
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RichTextSliceDefault = prismic.SharedSliceVariation<"default", Simplify<RichTextSliceDefaultPrimary>, never>;

/**
 * Slice variation for *RichText*
 */
type RichTextSliceVariation = RichTextSliceDefault

/**
 * RichText Shared Slice
 *
 * - **API ID**: `rich_text`
 * - **Description**: RichText
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type RichTextSlice = prismic.SharedSlice<"rich_text", RichTextSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			FormRepliesDocument,
			FormRepliesDocumentData,
			FormRepliesDocumentDataRepliesItem,
			NavDocument,
			NavDocumentData,
			NavDocumentDataLinksItem,
			PageDocument,
			PageDocumentData,
			PageDocumentDataSlicesSlice,
			AllDocumentTypes,
			FullScreenSlideSlice,
			FullScreenSlideSliceDefaultPrimary,
			FullScreenSlideSliceDefaultItem,
			FullScreenSlideSliceEmbedPrimary,
			FullScreenSlideSliceWithVideoPopupPrimary,
			FullScreenSlideSliceBasicPrimary,
			FullScreenSlideSliceIconBoxesPrimary,
			FullScreenSlideSliceIconBoxesItem,
			FullScreenSlideSliceTeamsPrimary,
			FullScreenSlideSliceTeamsItem,
			FullScreenSlideSliceHalfPagePrimary,
			FullScreenSlideSliceHalfPageItem,
			FullScreenSlideSliceBigTextPrimary,
			FullScreenSlideSliceHalfPageWithButtonOverlaysPrimary,
			FullScreenSlideSliceHalfPageWithButtonOverlaysItem,
			FullScreenSlideSliceVariation,
			FullScreenSlideSliceDefault,
			FullScreenSlideSliceEmbed,
			FullScreenSlideSliceWithVideoPopup,
			FullScreenSlideSliceBasic,
			FullScreenSlideSliceIconBoxes,
			FullScreenSlideSliceTeams,
			FullScreenSlideSliceHalfPage,
			FullScreenSlideSliceBigText,
			FullScreenSlideSliceHalfPageWithButtonOverlays,
			HeroSlice,
			HeroSliceDefaultPrimary,
			HeroSliceVariation,
			HeroSliceDefault,
			RichTextSlice,
			RichTextSliceDefaultPrimary,
			RichTextSliceVariation,
			RichTextSliceDefault
		}
	}
}