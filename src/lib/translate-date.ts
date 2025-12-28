/**
 * Translates month names in a date string based on locale.
 * Preserves HTML tags in the string.
 */
export function translateDate(dateString: string, locale: string): string {
  if (!dateString) return dateString;

  // Extract HTML tags and their content
  const htmlRegex = /<[^>]*>[^<]*<\/[^>]*>/g;
  const htmlTags: string[] = [];
  let plainString = dateString.replace(htmlRegex, (match) => {
    htmlTags.push(match);
    return "{{HTML_TAG_" + (htmlTags.length - 1) + "}}";
  });

  // Translate English months to French if the locale is fr
  if (locale === "fr") {
    const months = {
      January: "Janvier",
      February: "Février",
      March: "Mars",
      April: "Avril",
      May: "Mai",
      June: "Juin",
      July: "Juillet",
      August: "Août",
      September: "Septembre",
      October: "Octobre",
      November: "Novembre",
      December: "Décembre",
    };

    for (const [en, fr] of Object.entries(months)) {
      const regex = new RegExp(en, "g");
      plainString = plainString.replace(regex, fr);
    }
  }

  // Restore HTML tags
  return plainString.replace(/{{HTML_TAG_(\d+)}}/g, (_, index) => {
    return htmlTags[parseInt(index)];
  });
}

