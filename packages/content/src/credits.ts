// Credit text for outside work It uses, kept in one place so the pages that
// show it can't disagree: the /licensing essay (public-pages, licensing-page)
// and the Help build It page (help-build-it task 1.1). The essay repeats each
// `text` word for word; credits.test.ts checks that it does.

export interface Credit {
  /** The credit sentence, plain text with no Markdown. */
  text: string;
  /** Where the work is published. */
  url: string;
  /** The license text, when the reuse terms are known. */
  licenseUrl?: string;
}

export const escoCredit: Credit = {
  text: "Occupation and skill names come from ESCO, the European classification of skills, competences and occupations, published by the European Commission under the Creative Commons Attribution 4.0 International license (CC BY 4.0). We've changed some of the names to make them clearer, so a name you see in It may differ from ESCO's.",
  url: "https://esco.ec.europa.eu",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
};

// ISCED 2011's reuse terms are still being checked (help-build-it task 1.1),
// so this credit names no license yet.
export const iscedCredit: Credit = {
  text: "Education levels and fields of study come from the International Standard Classification of Education (ISCED 2011), published by the UNESCO Institute for Statistics.",
  url: "https://uis.unesco.org/en/topic/international-standard-classification-education-isced",
};
