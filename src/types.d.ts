type LetterState = 'correct' | 'present' | 'absent' | '';

interface GameStats {
	gamesPlayed: number;
	gamesWon: number;
	currentStreak: number;
}

type GameState = 'setup' | 'playing' | 'won';

type GuessHistory = Array<{guess: string[]; states: LetterState[]}>;

interface GameData {
	currentGuess: string[];
	discoveredLetters: string[];
	gameState: GameState;
	guessHistory: GuessHistory;
	letterStates: LetterState[];
	targetWord: string;
	wordLength: number;
}
