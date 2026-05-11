/**
 * Parses a full address string into components: street, city, state, zip
 * Works with common US address formats like:
 * - "123 Main St, Austin, TX 78701"
 * - "123 Main Street, Austin, Texas 78701"
 * - "123 Main St, Austin, TX, 78701"
 */
export interface AddressComponents {
  street: string;
  city: string;
  state: string;
  zip: string;
}

// Common US state abbreviations and full names
const statePatterns = [
  // Full state names (common ones)
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
  "New Hampshire", "New Jersey", "New Mexico", "New York", 
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
  "West Virginia", "Wisconsin", "Wyoming", "District of Columbia",
  // Abbreviations
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
];

export function parseAddress(fullAddress: string): AddressComponents {
  if (!fullAddress || typeof fullAddress !== "string") {
    return { street: "", city: "", state: "", zip: "" };
  }

  const trimmed = fullAddress.trim();
  
  // Default result
  const result: AddressComponents = {
    street: "",
    city: "",
    state: "",
    zip: "",
  };

  // Try to extract ZIP code (5 digits or 5+4 format)
  const zipMatch = trimmed.match(/\b(\d{5}(?:-\d{4})?)\b/);
  if (zipMatch) {
    result.zip = zipMatch[1];
  }

  // Remove the ZIP from the string for further parsing
  let remaining = trimmed.replace(/\s*\d{5}(?:-\d{4})?\s*$/, "").trim();
  
  // Remove trailing comma if present
  remaining = remaining.replace(/,\s*$/, "").trim();

  // Split by comma
  const parts = remaining.split(",").map(p => p.trim()).filter(Boolean);

  if (parts.length >= 3) {
    // Format: "Street, City, State" or "Street, City, State ZIP"
    result.street = parts.slice(0, -2).join(", ");
    result.city = parts[parts.length - 2];
    result.state = parts[parts.length - 1];
  } else if (parts.length === 2) {
    // Could be "Street, City State" or "City, State"
    const lastPart = parts[1];
    
    // Check if the last part contains a state
    const stateInLastPart = statePatterns.find(state => 
      new RegExp(`\\b${state}\\b`, "i").test(lastPart)
    );
    
    if (stateInLastPart) {
      // Extract state from last part
      const stateRegex = new RegExp(`\\b(${stateInLastPart})\\b`, "i");
      const stateMatch = lastPart.match(stateRegex);
      
      if (stateMatch) {
        result.state = stateMatch[1];
        // City is what's before the state
        const cityPart = lastPart.replace(stateRegex, "").trim();
        if (cityPart) {
          result.city = cityPart;
          result.street = parts[0];
        } else {
          // "City, State" format - no street
          result.city = parts[0];
        }
      }
    } else {
      // No state found, assume "Street, City"
      result.street = parts[0];
      result.city = parts[1];
    }
  } else if (parts.length === 1) {
    // Just one part - try to parse "Street City State ZIP"
    const words = parts[0].split(/\s+/);
    
    // Look for state abbreviation or name
    for (let i = words.length - 1; i >= 0; i--) {
      const potentialState = words[i];
      if (statePatterns.some(s => s.toUpperCase() === potentialState.toUpperCase())) {
        result.state = potentialState;
        // Assume the word before state is city (if exists)
        if (i > 0) {
          result.city = words[i - 1];
          result.street = words.slice(0, i - 1).join(" ");
        }
        break;
      }
    }
    
    // If no state found, put everything in street
    if (!result.state && !result.city) {
      result.street = parts[0];
    }
  }

  // Clean up any extra spaces
  result.street = result.street.replace(/\s+/g, " ").trim();
  result.city = result.city.replace(/\s+/g, " ").trim();
  result.state = result.state.replace(/\s+/g, " ").trim();
  result.zip = result.zip.trim();

  return result;
}
