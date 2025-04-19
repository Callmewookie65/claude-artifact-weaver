
/**
 * Map a value to a valid enum value using fuzzy matching
 * @param value The input value to map
 * @param validValues Array of valid values
 * @param defaultValue Default value to use if no match is found
 * @returns The mapped enum value
 */
export const mapValueToEnum = <T extends string>(
  value: string | undefined | null,
  validValues: T[],
  defaultValue: T
): T => {
  if (!value) return defaultValue;
  
  const lowerValue = String(value).toLowerCase();
  
  // Try exact match first
  const exactMatch = validValues.find(v => v.toLowerCase() === lowerValue);
  if (exactMatch) return exactMatch;
  
  // Try partial match
  const partialMatch = validValues.find(v => lowerValue.includes(v.toLowerCase()) || v.toLowerCase().includes(lowerValue));
  if (partialMatch) return partialMatch;
  
  return defaultValue;
};

/**
 * Clean and normalize text for better comparison
 * @param text Text to clean
 * @returns Cleaned text
 */
export const cleanTextForComparison = (text: string): string => {
  return String(text)
    .toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/[^\w\s]/g, '')
    .trim();
};

/**
 * Calculate similarity score between two strings
 * @param str1 First string
 * @param str2 Second string
 * @returns Similarity score (0-1)
 */
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  const s1 = cleanTextForComparison(str1);
  const s2 = cleanTextForComparison(str2);
  
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) {
    return Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
  }
  
  // Simple word overlap calculation for a basic similarity score
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  
  const intersection = [...words1].filter(word => words2.has(word));
  return intersection.length / Math.max(words1.size, words2.size);
};

/**
 * Extract a numeric value from various formats
 * @param value Input value which could be a string, number, etc.
 * @returns Extracted number or 0 if not parseable
 */
export const extractNumberValue = (value: any): number => {
  if (value === null || value === undefined) return 0;
  
  if (typeof value === 'number') return value;
  
  if (typeof value === 'string') {
    // Remove currency symbols, commas, etc.
    const cleanValue = value.replace(/[$€£¥,]/g, '').trim();
    const parsedValue = parseFloat(cleanValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }
  
  return 0;
};

/**
 * Extract a date value from various formats
 * @param dateValue Input date value
 * @returns ISO date string or empty string if invalid
 */
export const extractDateValue = (dateValue: any): string => {
  if (!dateValue) return '';
  
  try {
    // Handle ISO strings
    if (typeof dateValue === 'string') {
      // Try to parse various date formats
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
      }
    }
    
    return '';
  } catch {
    return '';
  }
};
