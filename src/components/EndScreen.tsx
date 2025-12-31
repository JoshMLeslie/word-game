interface EndScreenProps {
	stats: GameStats,
	targetWord: string,
	guessCount: number,
	onContinue: Function,
	onChangeLength: Function,
}

export const EndScreen = ({
	stats,
	targetWord,
	guessCount,
	onContinue,
	onChangeLength,
}: EndScreenProps) => {
	return (
		<div style={styles.container}>
			<div style={styles.content}>
				<h1 style={styles.winTitle}>🎉 You Won!</h1>
				<p style={styles.winSubtitle}>
					The word was: <strong>{targetWord}</strong>
				</p>
				<p style={styles.winSubtitle}>Guesses: {guessCount}</p>

				<div style={styles.statsBox}>
					<h3 style={styles.statsTitle}>Your Stats</h3>
					<div style={styles.statsGrid}>
						<div style={styles.statItem}>
							<div style={styles.statValue}>{stats.gamesPlayed}</div>
							<div style={styles.statLabel}>Played</div>
						</div>
						<div style={styles.statItem}>
							<div style={styles.statValue}>{stats.gamesWon}</div>
							<div style={styles.statLabel}>Won</div>
						</div>
						<div style={styles.statItem}>
							<div style={styles.statValue}>
								{stats.gamesPlayed > 0
									? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
									: 0}
								%
							</div>
							<div style={styles.statLabel}>Win Rate</div>
						</div>
						<div style={styles.statItem}>
							<div style={styles.statValue}>{stats.currentStreak}</div>
							<div style={styles.statLabel}>Streak</div>
						</div>
					</div>
				</div>

				<button style={styles.startButton} onClick={onContinue}>
					Continue
				</button>
				<button style={styles.secondaryButton} onClick={onChangeLength}>
					Change Length
				</button>
			</div>
		</div>
	);
};
