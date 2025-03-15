/**
 * Validation utilities for Convex functions
 * 
 * This file contains validators and constants for application-level validation
 * of data before it's stored in the database.
 */

// Valid government levels
export const VALID_GOVERNMENT_LEVELS = [
  "Federal",
  "federal",
  "State", 
  "state",
  "Local",
  "local",
  "County",
  "county",
  "Municipal",
  "municipal",
  "City",
  "city",
  "School District",
  "school district"
];

// Valid jurisdictions
export const VALID_JURISDICTIONS = [
  "National",
  "national",
  "State",
  "state",
  "County",
  "county",
  "Municipal",
  "municipal",
  "District",
  "district",
  "Precinct",
  "precinct",
  "Texas District 15",
  "Harris County"
];

/**
 * Validates a government level value
 * @param governmentLevel - The government level to validate
 * @returns true if valid, false if invalid
 */
export function isValidGovernmentLevel(governmentLevel: string): boolean {
  return VALID_GOVERNMENT_LEVELS.includes(governmentLevel);
}

/**
 * Validates a jurisdiction value
 * @param jurisdiction - The jurisdiction to validate
 * @returns true if valid, false if invalid
 */
export function isValidJurisdiction(jurisdiction: string): boolean {
  return VALID_JURISDICTIONS.includes(jurisdiction);
}

/**
 * Normalizes a government level value to the standard case
 * @param governmentLevel - The government level to normalize
 * @returns The normalized government level
 */
export function normalizeGovernmentLevel(governmentLevel: string): string {
  const lowercase = governmentLevel.toLowerCase();
  
  // Map of lowercase to properly cased values
  const caseMap: Record<string, string> = {
    "federal": "Federal",
    "state": "State",
    "local": "Local",
    "county": "County",
    "municipal": "Municipal",
    "city": "City",
    "school district": "School District"
  };
  
  return caseMap[lowercase] || governmentLevel;
}

/**
 * Normalizes a jurisdiction value to the standard case
 * @param jurisdiction - The jurisdiction to normalize
 * @returns The normalized jurisdiction
 */
export function normalizeJurisdiction(jurisdiction: string): string {
  const lowercase = jurisdiction.toLowerCase();
  
  // Map of lowercase to properly cased values
  const caseMap: Record<string, string> = {
    "national": "National",
    "state": "State",
    "county": "County",
    "municipal": "Municipal",
    "district": "District",
    "precinct": "Precinct",
    "texas district 15": "Texas District 15",
    "harris county": "Harris County"
  };
  
  return caseMap[lowercase] || jurisdiction;
}
