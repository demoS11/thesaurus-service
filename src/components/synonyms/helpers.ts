import { Mutex } from "async-mutex";

// Interface to represent the synonym store
export interface SynonymStore {
    [word: string]: string[];
}

// In-memory synonym store initialized as an empty object
export const synonymStore: SynonymStore = {};

// Mutex to ensure thread-safe access to the synonym store
const synonymStoreMutex = new Mutex();

// Function to add a new synonym to the store
export async function addSynonym({
    word,
    synonym,
}: {
    word: string;
    synonym: string;
}) {
    const release = await synonymStoreMutex.acquire();

    try {
        if (!synonymStore[word]) {
            synonymStore[word] = [synonym];
        } else {
            synonymStore[word].push(...[synonym]);
        }

        if (!synonymStore[synonym]) {
            synonymStore[synonym] = [word];
        } else {
            synonymStore[synonym].push(word);
        }
    } finally {
        // Release the mutex to allow other threads to access the store
        release();
    }
}

// Function to find synonyms of a given word
export async function findSynonyms(word: string): Promise<string[]> {
    const release = await synonymStoreMutex.acquire();

    try {
        const visited = new Set<string>();
        const stack: string[] = [];
        const synonyms: string[] = [];

        stack.push(word);

        while (stack.length > 0) {
            const currentWord = stack.pop()!;
            if (visited.has(currentWord)) {
                continue;
            }

            visited.add(currentWord);
            if (currentWord !== word) {
                synonyms.push(currentWord);
            }

            const wordSynonyms = synonymStore[currentWord];
            if (wordSynonyms) {
                for (const synonym of wordSynonyms) {
                    if (!visited.has(synonym)) {
                        stack.push(synonym);
                    }
                }
            }
        }

        return synonyms;
    } finally {
        // Release the mutex to allow other threads to access the store
        release();
    }
}
