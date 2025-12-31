export const FinalizedRow = ({letters}: {letters: string[]}) => {
	return (
		<div style={styles.row}>
			{letters.map((letter, index) => (
				<div
					key={index}
					style={{
						...styles.tile,
						...styles.tileFinalized,
						...(letter ? styles.tileCorrect : {}),
					}}
				>
					{letter || ''}
				</div>
			))}
		</div>
	);
};
