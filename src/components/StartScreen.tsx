import { useState } from 'react';

export const StartScreen = ({ onStart }: { onStart: (length: number) => void }) => {
	const [selectedLength, setSelectedLength] = useState(5);

	return (
		<div className="container">
			<div className="content">
				<h1 className="title">Word Guess</h1>
				<p className="subtitle">Select word length to begin</p>

				<div className="length-selector">
					{[4, 5, 6, 7, 8].map((length) => (
						<button
							key={length}
							className={`length-button${selectedLength === length ? ' active' : ''}`}
							onClick={() => setSelectedLength(length)}
						>
							{length}
						</button>
					))}
				</div>

				<button className="start-button" onClick={() => onStart(selectedLength)}>
					Start Game
				</button>
			</div>
		</div>
	);
};
