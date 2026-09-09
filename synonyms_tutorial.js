import synonyms from "synonyms";

// Get all synonyms grouped by part of speech (nouns, verbs, etc.)
console.log(synonyms("screen")); 
// Output: { n: ['screen', 'cover', ...], v: ['screen', 'sieve', ...] }

// Strictly target verbs
console.log(synonyms("screen", "v")); 
// Output: ['screen', 'sieve', 'sort', 'test']