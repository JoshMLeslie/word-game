import type { MouseEventHandler } from 'react';
import type { UseGameStateReturn } from '../util/hooks';
import { FinalizedRow } from './FinalizeRow';
import { InputRow } from './InputRow';

interface GameScreenProps {
	wordLength: number;
	targetWord: string;
	discoveredLetters: string[];
	currentGuess: string[];
	setCurrentGuess: UseGameStateReturn['setCurrentGuess'];
	letterStates: LetterState[];
	onSubmit: MouseEventHandler<HTMLButtonElement>;
	onNext: MouseEventHandler<HTMLButtonElement>;
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
	const isRowFull = currentGuess.every((letter) => letter !== '');
	const hasEvaluation = letterStates.some((state) => state !== '');

	return (
		<div style={styles.container}>
			<div style={styles.gameContent}>
				<h2 style={styles.gameTitle}>Guess the {wordLength}-letter word</h2>

				<FinalizedRow letters={discoveredLetters} />
				<InputRow
					wordLength={wordLength}
					currentGuess={currentGuess}
					setCurrentGuess={setCurrentGuess}
					letterStates={letterStates}
					discoveredLetters={discoveredLetters}
				/>

				<button
					style={{
						...styles.actionButton,
						...(!isRowFull && !hasEvaluation
							? styles.actionButtonDisabled
							: {}),
					}}
					onClick={hasEvaluation ? onNext : onSubmit}
					disabled={!isRowFull && !hasEvaluation}
				>
					{hasEvaluation ? 'Next Guess' : 'Submit Guess'}
				</button>

				{/* Debug info - remove later */}
				<div style={styles.debug}>Target: {targetWord}</div>
			</div>
		</div>
	);
};
