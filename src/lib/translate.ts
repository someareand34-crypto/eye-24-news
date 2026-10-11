/**
 * Translation utility with Google Translate API + MyMemory free fallback
 */

export async function translateText(
  text: string,
  targetLang: string = 'bn',
  sourceLang: string = 'en',
  googleApiKey?: string
): Promise<string> {
  if (!text || text.trim() === '') return '';

  const cleanText = text.trim();

  // 1. Try Google Translate official API if key provided
  if (googleApiKey && googleApiKey.trim().length > 5) {
    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: cleanText,
          source: sourceLang,
          target: targetLang,
          format: 'text',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const translated = data?.data?.translations?.[0]?.translatedText;
        if (translated) return translated;
      }
    } catch (err) {
      console.warn('Google Translate API error, falling back to MyMemory:', err);
    }
  }

  // 2. Try MyMemory free API fallback
  try {
    const chunk = cleanText.length > 450 ? cleanText.substring(0, 450) : cleanText;
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      chunk
    )}&langpair=${sourceLang}|${targetLang}`;

    const res = await fetch(myMemoryUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        const result = data.responseData.translatedText;
        // Check if MyMemory returned quota exceeded warning
        if (!result.includes('MYMEMORY WARNING') && !result.includes('QUERY LENGTH LIMIT')) {
          return result;
        }
      }
    }
  } catch (err) {
    console.warn('MyMemory translation error:', err);
  }

  // 3. Graceful fallback dictionary for typical news keywords if external network fails
  return fallbackBengaliTranslation(cleanText);
}

function fallbackBengaliTranslation(text: string): string {
  // If text is already mostly Bengali, return it
  if (/[\u0980-\u09FF]/.test(text)) {
    return text;
  }

  // Standard news vocabulary replacements for instant readability
  const dictionary: Record<string, string> = {
    'Breaking News': 'ব্রেকিং নিউজ',
    'Exclusive': 'বিশেষ সংবাদ',
    'World Cup': 'বিশ্বকাপ',
    'Championship': 'চ্যাম্পিয়নশিপ',
    'President': 'রাষ্ট্রপতি',
    'Prime Minister': 'প্রধানমন্ত্রী',
    'Economy': 'অর্থনীতি',
    'Technology': 'প্রযুক্তি',
    'Artificial Intelligence': 'কৃত্রিম বুদ্ধিমত্তা',
    'NASA': 'নাসা',
    'Space': 'মহাকাশ',
    'Cricket': 'ক্রিকেট',
    'Football': 'ফুটবল',
    'Election': 'নির্বাচন',
    'Market': 'বাজার',
    'Inflation': 'মুদ্রাস্ফীতি',
    'Gold': 'স্বর্ণের দাম',
    'Oil': 'জ্বালানি তেল',
    'Deal': 'সেরা অফার',
    'Discount': 'ছাড়',
  };

  let translated = text;
  for (const [en, bn] of Object.entries(dictionary)) {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, bn);
  }

  return translated;
}
