import { useState, useRef, useEffect } from 'react';
import type { UseGameStateReturn } from '../util/hooks';
import { FinalizedRow } from './FinalizeRow';
import { InputRow, type InputRowHandle } from './InputRow';

interface GuessHistoryEntry {
	guess: string[];
	states: LetterState[];
}

interface GameScreenProps {
	wordLength: number;
	targetWord: string;
	discoveredLetters: string[];
	currentGuess: string[];
	setCurrentGuess: UseGameStateReturn['setCurrentGuess'];
	letterStates: LetterState[];
	guessHistory: GuessHistoryEntry[];
	onSubmit: () => void;
	onNext: () => void;
	onGiveUp: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
	wordLength,
	targetWord,
	discoveredLetters,
	currentGuess,
	setCurrentGuess,
	letterStates,
	guessHistory,
	onSubmit,
	onNext,
	onGiveUp,
}) => {
	const [isFading, setIsFading] = useState(false);
	const inputRowRef = useRef<InputRowHandle>(null);
	const isRowFull = currentGuess.every((letter) => letter !== '');
	const hasEvaluation = letterStates.some((state) => state !== '');

	const handleNext = () => {
		setIsFading(true);
		setTimeout(() => {
			onNext();
			setIsFading(false);
		}, 200);
	};

	// Focus first available input on mount
	useEffect(() => {
		inputRowRef.current?.focusFirstAvailable();
	}, []);

	// Focus first available input after nextGuess (when letterStates become empty)
	const prevHasEvaluation = useRef(hasEvaluation);
	useEffect(() => {
		if (prevHasEvaluation.current && !hasEvaluation) {
			// Transitioned from having evaluation to no evaluation (nextGuess was called)
			setTimeout(() => inputRowRef.current?.focusFirstAvailable(), 0);
		}
		prevHasEvaluation.current = hasEvaluation;
	}, [hasEvaluation]);

	const handleEnter = () => {
		if (hasEvaluation) {
			handleNext();
		} else if (isRowFull) {
			onSubmit();
		}
	};

	// Collect present letters from history (excluding already discovered)
	const discoveredSet = new Set(discoveredLetters.filter(Boolean));
	const presentLetters = new Set<string>();
	for (const entry of guessHistory) {
		for (let i = 0; i < entry.states.length; i++) {
			if (entry.states[i] === 'present' && !discoveredSet.has(entry.guess[i])) {
				presentLetters.add(entry.guess[i]);
			}
		}
	}
	const clueLetters = Array.from(presentLetters).sort();

	return (
		<div className="container">
			<div className="game-content">
				<h2 className="game-title">Guess the {wordLength}-letter word</h2>

				<FinalizedRow letters={discoveredLetters} />
				<InputRow
					ref={inputRowRef}
					wordLength={wordLength}
					currentGuess={currentGuess}
					setCurrentGuess={setCurrentGuess}
					letterStates={letterStates}
					discoveredLetters={discoveredLetters}
					onEnter={handleEnter}
					isFading={isFading}
				/>

				<div className="button-row">
					<button
						className="secondary-button"
						onClick={onGiveUp}
					>
						Show Answer
					</button>
					<button
						className="action-button"
						onClick={hasEvaluation ? handleNext : onSubmit}
						disabled={!isRowFull && !hasEvaluation}
					>
						{hasEvaluation ? 'Next Guess' : 'Submit Guess'}
					</button>
				</div>

				{clueLetters.length > 0 && (
					<div className="clues">
						<div className="clues-label">Contains</div>
						<div className="clues-letters">
							{clueLetters.map((letter) => (
								<span key={letter} className="clue-letter">{letter}</span>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
