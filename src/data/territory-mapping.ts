/**
 * Mapping between Natural Earth territory codes and French department codes (INSEE)
 */
export const TERRITORY_TO_DEPARTMENT_CODE: Record<string, string> = {
  // DOM territories (already in departements.json)
  'FR-GP': '971', // Guadeloupe
  'FR-MQ': '972', // Martinique
  'FR-GF': '973', // Guyane
  'FR-RE': '974', // La Réunion
  'FR-YT': '976', // Mayotte

  // Missing COM and territories (from Natural Earth)
  'FR-PM': '975', // Saint-Pierre-et-Miquelon
  'FR-BL': '977', // Saint-Barthélemy
  'FR-MF': '978', // Saint-Martin
  'FR-WF': '986', // Wallis-et-Futuna
  'FR-PF': '987', // Polynésie française
  'FR-NC': '988', // Nouvelle-Calédonie

  // Special cases (not in standard INSEE codes, but in projection)
  'FR-PF-2': '987-2', // Polynésie française (îles éloignées) - duplicate view
  'FR-TF': '984', // Terres australes et antarctiques françaises
}

/**
 * Department codes that should be present in the final dataset
 */
export const REQUIRED_DEPARTMENT_CODES = [
  // Metropolitan France (01-95, excluding 2A/2B which are separate)
  ...Array.from({ length: 95 }, (_, i) => String(i + 1).padStart(2, '0')),
  '2A', // Corse-du-Sud
  '2B', // Haute-Corse

  // DOM
  '971', // Guadeloupe
  '972', // Martinique
  '973', // Guyane
  '974', // La Réunion
  '976', // Mayotte

  // COM and overseas territories
  '975', // Saint-Pierre-et-Miquelon
  '977', // Saint-Barthélemy
  '978', // Saint-Martin
  '984', // Terres australes et antarctiques françaises
  '986', // Wallis-et-Futuna
  '987', // Polynésie française
  '988', // Nouvelle-Calédonie
]

/**
 * Check if a department code is missing from a list
 */
export function getMissingDepartmentCodes(existingCodes: string[]): string[] {
  const existingSet = new Set(existingCodes)
  return REQUIRED_DEPARTMENT_CODES.filter(code => !existingSet.has(code))
}

/**
 * Get territory code from department code
 */
export function getTerritoryCode(deptCode: string): string | undefined {
  return Object.entries(TERRITORY_TO_DEPARTMENT_CODE)
    .find(([_, dept]) => dept === deptCode)?.[0]
}
