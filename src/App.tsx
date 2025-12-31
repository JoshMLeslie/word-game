import { useEffect } from 'react';
import './App.scss';
import { EndScreen } from './components/EndScreen';
import { GameScreen } from './components/GameScreen';
import { StartScreen } from './components/StartScreen';
import { DictionaryService } from './util/dict-service';
import { useGameState, useStats } from './util/hooks';
import { removeFromStorage, saveToStorage } from './util/storage';

export default function App() {
	const [stats, setStats] = useStats();

	const {
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
	} = useGameState();

	// Save game state
	useEffect(() => {
		if (gameState === 'playing') {
			saveToStorage('wordgame_state', {
				gameState,
				wordLength,
				targetWord,
				discoveredLetters,
				currentGuess,
				guessHistory,
				letterStates,
			});
		}
	}, [
		gameState,
		wordLength,
		targetWord,
		discoveredLetters,
		currentGuess,
		guessHistory,
		letterStates,
	]);

	

	const startGame = async (length: number) => {
		const words = await DictionaryService.getWords(length);
		const word = DictionaryService.getRandomWord(words);

		setWordLength(length);
		setTargetWord(word);
		setDiscoveredLetters(Array(length).fill(''));
		setCurrentGuess(Array(length).fill(''));
		setLetterStates(Array(length).fill(''));
		setGuessHistory([]);
		setGameState('playing');
	};

	const submitGuess = () => {
		const guess = currentGuess.join('');
		if (guess.length !== wordLength) return;

		const newDiscovered = [...discoveredLetters];
		const newStates: LetterState[] = [];
		let allCorrect = true;

		// Evaluate each letter
		for (let i = 0; i < wordLength; i++) {
			const letter = currentGuess[i];
			if (letter === targetWord[i]) {
				newDiscovered[i] = letter;
				newStates[i] = 'correct';
			} else if (targetWord.includes(letter)) {
				newStates[i] = 'present';
				allCorrect = false;
			} else {
				newStates[i] = 'absent';
				allCorrect = false;
			}
		}

		setDiscoveredLetters(newDiscovered);
		setLetterStates(newStates);
		setGuessHistory([
			...guessHistory,
			{guess: currentGuess, states: newStates},
		]);

		if (allCorrect) {
			setGameState('won');
			setStats((prev) => ({
				gamesPlayed: prev.gamesPlayed + 1,
				gamesWon: prev.gamesWon + 1,
				currentStreak: prev.currentStreak + 1,
			}));
			removeFromStorage('wordgame_state');
		}
	};

	const nextGuess = () => {
		// Pre-fill discovered letters
		const newGuess = discoveredLetters.map((letter) => letter || '');
		setCurrentGuess(newGuess);
		setLetterStates(Array(wordLength).fill(''));
	};

	const changeLength = () => {
		setGameState('setup');
		removeFromStorage('wordgame_state');
	};

	const continueWithSettings = () => {
		startGame(wordLength);
	};

	if (gameState === 'setup') {
		return <StartScreen onStart={startGame} />;
	}

	if (gameState === 'won') {
		return (
			<EndScreen
				stats={stats}
				targetWord={targetWord}
				guessCount={guessHistory.length}
				onContinue={continueWithSettings}
				onChangeLength={changeLength}
			/>
		);
	}

	return (
		<GameScreen
			wordLength={wordLength}
			targetWord={targetWord}
			discoveredLetters={discoveredLetters}
			currentGuess={currentGuess}
			setCurrentGuess={setCurrentGuess}
			letterStates={letterStates}
			onSubmit={submitGuess}
			onNext={nextGuess}
		/>
	);
}
