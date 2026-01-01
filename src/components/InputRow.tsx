import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import type { UseGameStateReturn } from '../util/hooks';

interface InputRowProps {
	wordLength: number;
	currentGuess: string[];
	setCurrentGuess: UseGameStateReturn['setCurrentGuess'];
	letterStates: LetterState[];
	discoveredLetters: string[];
	onEnter: () => void;
	isFading?: boolean;
}

export interface InputRowHandle {
	focusFirstAvailable: () => void;
}

export const InputRow = forwardRef<InputRowHandle, InputRowProps>(({
	wordLength,
	currentGuess,
	setCurrentGuess,
	letterStates,
	discoveredLetters,
	onEnter,
	isFading = false,
}, ref) => {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const rowRef = useRef<HTMLDivElement>(null);

	const focusFirstAvailable = () => {
		for (let i = 0; i < wordLength; i++) {
			if (!discoveredLetters[i]) {
				inputRefs.current[i]?.focus();
				return;
			}
		}
	};

	useImperativeHandle(ref, () => ({
		focusFirstAvailable,
	}));

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, wordLength);
	}, [wordLength]);

	const handleChange = (index: number, value: string) => {
		const letter = value.toUpperCase().slice(-1);
		if (!/^[A-Z]?$/.test(letter)) return;

		const newGuess = [...currentGuess];
		newGuess[index] = letter;
		setCurrentGuess(newGuess);

		// Auto-advance to next empty slot
		if (letter && index < wordLength - 1) {
			let nextIndex = index + 1;
			while (nextIndex < wordLength && discoveredLetters[nextIndex]) {
				nextIndex++;
			}
			if (nextIndex < wordLength) {
				inputRefs.current[nextIndex]?.focus();
			}
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			onEnter();
			return;
		}
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
		// Scroll row into view when keyboard opens on mobile
		setTimeout(() => {
			rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}, 150);
	};

	const getClassName = (index: number) => {
		const isDiscovered = discoveredLetters[index] !== '';
		const state = letterStates[index];
		const classes = ['tile', 'tile-input'];

		if (isDiscovered) classes.push('tile-input-disabled');
		if (state === 'correct') classes.push('tile-correct');
		if (state === 'present') classes.push('tile-present');
		if (state === 'absent') classes.push('tile-absent');
		if (isFading) classes.push('tile-fading');

		return classes.join(' ');
	};

	return (
		<div className="row" ref={rowRef}>
			{currentGuess.map((letter, index) => {
				const isDiscovered = discoveredLetters[index] !== '';

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
						className={getClassName(index)}
					/>
				);
			})}
		</div>
	);
});
