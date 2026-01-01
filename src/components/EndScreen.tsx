interface EndScreenProps {
	stats: GameStats;
	targetWord: string;
	guessCount: number;
	didWin: boolean;
	onContinue: () => void;
	onChangeLength: () => void;
	onResetGame: () => void;
}

export const EndScreen = ({
	stats,
	targetWord,
	guessCount,
	didWin,
	onContinue,
	onChangeLength,
	onResetGame,
}: EndScreenProps) => {
	return (
		<div className="container">
			<div className="content">
				<h1 className="win-title">{didWin ? 'You Won!' : 'Game Over'}</h1>
				<p className="win-subtitle">
					The word was: <strong>{targetWord}</strong>
				</p>
				{didWin && <p className="win-subtitle">Guesses: {guessCount}</p>}

				<div className="stats-box">
					<h3 className="stats-title">Your Stats</h3>
					<div className="stats-grid">
						<div className="stat-item">
							<div className="stat-value">{stats.gamesPlayed}</div>
							<div className="stat-label">Played</div>
						</div>
						<div className="stat-item">
							<div className="stat-value">{stats.gamesWon}</div>
							<div className="stat-label">Won</div>
						</div>
						<div className="stat-item">
							<div className="stat-value">
								{stats.gamesPlayed > 0
									? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
									: 0}
								%
							</div>
							<div className="stat-label">Win Rate</div>
						</div>
						<div className="stat-item">
							<div className="stat-value">{stats.currentStreak}</div>
							<div className="stat-label">Streak</div>
						</div>
					</div>
				</div>

				<button className="start-button" onClick={onContinue}>
					Continue
				</button>
				<button className="secondary-button" onClick={onChangeLength}>
					Change Length
				</button>
				<button className="secondary-button" onClick={onResetGame}>
					Reset Stats
				</button>
			</div>
		</div>
	);
};
