import { useEffect, useRef } from 'react';
import type { UseGameStateReturn } from '../util/hooks';

interface InputRowProps {
	wordLength: number;
	currentGuess: string[];
	setCurrentGuess: UseGameStateReturn['setCurrentGuess'];
	letterStates: LetterState[];
	discoveredLetters: string[];
}

export const InputRow: React.FC<InputRowProps> = ({
	wordLength,
	currentGuess,
	setCurrentGuess,
	letterStates,
	discoveredLetters,
}) => {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, wordLength);
	}, [wordLength]);

	const handleChange = (index: number, value: string) => {
		const letter = value.toUpperCase().slice(-1);
		if (!/^[A-Z]?$/.test(letter)) return;

		const newGuess = [...currentGuess];
		newGuess[index] = letter;
		setCurrentGuess(newGuess);

		// Auto-advance with 100ms delay
		if (letter && index < wordLength - 1) {
			setTimeout(() => {
				// Find next empty slot
				let nextIndex = index + 1;
				while (nextIndex < wordLength && discoveredLetters[nextIndex]) {
					nextIndex++;
				}
				if (nextIndex < wordLength) {
					inputRefs.current[nextIndex]?.focus();
				}
			}, 100);
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !currentGuess[index] && index > 0) {
			// Find previous editable slot
			let prevIndex = index - 1;
			while (prevIndex >= 0 && discoveredLetters[prevIndex]) {
				prevIndex--;
			}
			if (prevIndex >= 0) {
				inputRefs.current[prevIndex]?.focus();
			}
		}
	};

	const handleFocus = (index: number) => {
		inputRefs.current[index]?.select();
	};

	return (
		<div style={styles.row}>
			{currentGuess.map((letter, index) => {
				const isDiscovered = discoveredLetters[index] !== '';
				const state = letterStates[index];

				return (
					<input
						key={index}
						ref={(el) => {
							inputRefs.current[index] = el;
						}}
						type="text"
						inputMode="text"
						maxLength={1}
						value={letter}
						onChange={(e) => handleChange(index, e.target.value)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						onFocus={() => handleFocus(index)}
						disabled={isDiscovered}
						style={{
							...styles.tile,
							...styles.tileInput,
							...(isDiscovered && styles.tileInputDisabled),
							...(state === 'correct' && styles.tileCorrect),
							...(state === 'present' && styles.tilePresent),
							...(state === 'absent' && styles.tileAbsent),
						}}
					/>
				);
			})}
		</div>
	);
};
