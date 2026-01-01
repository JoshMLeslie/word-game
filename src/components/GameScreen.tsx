import { useState, useRef, useEffect } from 'react';
import type { UseGameStateReturn } from '../util/hooks';
import { FinalizedRow } from './FinalizeRow';
import { InputRow, type InputRowHandle } from './InputRow';

interface GameScreenProps {
	wordLength: number;
	targetWord: string;
	discoveredLetters: string[];
	currentGuess: string[];
	setCurrentGuess: UseGameStateReturn['setCurrentGuess'];
	letterStates: LetterState[];
	onSubmit: () => void;
	onNext: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
	wordLength,
	targetWord,
	discoveredLetters,
	currentGuess,
	setCurrentGuess,
	letterStates,
	onSubmit,
	onNext,
}) => {
	const [showAnswer, setShowAnswer] = useState(false);
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

				<button
					className="action-button"
					onClick={hasEvaluation ? handleNext : onSubmit}
					disabled={!isRowFull && !hasEvaluation}
				>
					{hasEvaluation ? 'Next Guess' : 'Submit Guess'}
				</button>

				<div className="debug">
					Answer: {showAnswer ? targetWord : 'HIDDEN'}
					<button
						className="debug-toggle"
						onClick={() => setShowAnswer(!showAnswer)}
					>
						{showAnswer ? 'Hide' : 'Show'}
					</button>
				</div>
			</div>
		</div>
	);
};
