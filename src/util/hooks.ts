import { useEffect, useState } from 'react';
import { loadFromStorage, saveToStorage } from './storage';

export const useStats = (): [
	GameStats,
	React.Dispatch<React.SetStateAction<GameStats>>
] => {
	const [stats, setStats] = useState<GameStats>(
		loadFromStorage<GameStats>('wordgame_stats', {
			gamesPlayed: 0,
			gamesWon: 0,
			currentStreak: 0,
		})
	);

	useEffect(() => {
		saveToStorage('wordgame_stats', stats);
	}, [stats]);

	return [stats, setStats];
};

export type UseGameStateReturn = ReturnType<typeof useGameState>;

export const useGameState = () => {
	const [gameState, setGameState] = useState<GameState>('setup');
	const [wordLength, setWordLength] = useState(5);
	const [targetWord, setTargetWord] = useState('');
	const [discoveredLetters, setDiscoveredLetters] = useState<string[]>([]);
	const [currentGuess, setCurrentGuess] = useState<string[]>([]);
	const [guessHistory, setGuessHistory] = useState<GuessHistory>([]);
	const [letterStates, setLetterStates] = useState<LetterState[]>([]);
	useEffect(() => {
		const savedState = loadFromStorage<GameData | null>('wordgame_state', null);
		if (savedState && savedState.gameState === 'playing') {
			setGameState(savedState.gameState);
			setWordLength(savedState.wordLength);
			setTargetWord(savedState.targetWord);
			setDiscoveredLetters(savedState.discoveredLetters);
			setCurrentGuess(savedState.currentGuess);
			setGuessHistory(savedState.guessHistory);
			setLetterStates(savedState.letterStates);
		}
	}, []);

	return {
		currentGuess,
		discoveredLetters,
		gameState,
		guessHistory,
		letterStates,
		setCurrentGuess,
		setDiscoveredLetters,
		setGameState,
		setGuessHistory,
		setLetterStates,
		setTargetWord,
		setWordLength,
		targetWord,
		wordLength,
	};
};
