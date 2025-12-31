type DictionarySource = 'local' | 'cdn' | 'api';
const DICTIONARY_SOURCE: DictionarySource = 'local' as const; // 'local' | 'cdn' | 'api'

const SAMPLE_WORDS: Record<number, string[]> = {
	4: ['WORD', 'GAME', 'PLAY', 'TEST', 'CODE', 'BETA', 'DEMO', 'TYPE'],
	5: ['REACT', 'GUESS', 'WORDS', 'LOGIC', 'BUILD', 'CRAFT', 'LEARN', 'SMART'],
	6: ['MOBILE', 'TYPING', 'PUZZLE', 'CHANGE', 'CREATE', 'SIMPLE', 'DESIGN'],
	7: ['BUILDER', 'PATTERN', 'AWESOME', 'DISPLAY', 'CRYSTAL', 'DYNAMIC'],
	8: ['KEYBOARD', 'SOLUTION', 'THINKING', 'PROGRESS', 'ADVANCED', 'ABSTRACT'],
};

export class DictionaryService {
	static async getWords(length: number) {
		switch (DICTIONARY_SOURCE) {
			case 'local':
				return SAMPLE_WORDS[length] || [];
			case 'cdn':
				// Placeholder: fetch from CDN
				return await fetch(`/words/words-${length}.json`).then((r) => r.json());
			case 'api':
				// Placeholder: fetch from API
				return await fetch(`https://api.example.com/words/${length}`).then(
					(r) => r.json()
				);
			default:
				return SAMPLE_WORDS[length] || [];
		}
	}

	static getRandomWord(words: string[]): string {
		return words[Math.floor(Math.random() * words.length)].toUpperCase();
	}
}
