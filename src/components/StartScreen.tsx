import { useState } from 'react';

export const StartScreen = ({onStart}: {onStart: Function}) => {
	const [selectedLength, setSelectedLength] = useState(5);

	return (
		<div className="container">
			<div className="content">
				<h1 className="title">Word Guess</h1>
				<p className="subtitle">Select word length to begin</p>

				<div className="lengthSelector">
					{[4, 5, 6, 7, 8].map((length) => (
						<button
							key={length}
							className={
								'lengthButton' +
								(selectedLength === length ? ' lengthButtonActive' : '')
							}
							onClick={() => setSelectedLength(length)}
						>
							{length}
						</button>
					))}
				</div>

				<button className="startButton" onClick={() => onStart(selectedLength)}>
					Start Game
				</button>
			</div>
		</div>
	);
};
