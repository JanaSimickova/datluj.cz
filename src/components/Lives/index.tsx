import './style.css';
import heartSymbol from '../../assets/heart-symbol.svg';

export interface LivesProps {
  livesNumber: number;
}

export const Lives = ({ livesNumber }: LivesProps) => {
  const heartsArray = Array.from({ length: livesNumber });

  return (
    <div className="lives">
      {heartsArray.map((_, i) => (
        <img key={i} src={heartSymbol} alt="Život" className="heart-icon" />
      ))}
    </div>
  );
};

