export const FinalizedRow = ({ letters }: { letters: string[] }) => {
	return (
		<div className="row">
			{letters.map((letter, index) => (
				<div
					key={index}
					className={`tile tile-finalized${letter ? ' tile-correct' : ''}`}
				>
					{letter || ''}
				</div>
			))}
		</div>
	);
};
