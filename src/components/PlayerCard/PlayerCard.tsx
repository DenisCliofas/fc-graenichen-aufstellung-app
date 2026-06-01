import { Player } from '../../types';
import { avatarSrc } from '../../utils/avatar';
import './PlayerCard.css';

interface Props {
  player: Player;
  position?: string;
  size?: 'sm' | 'md' | 'lg';
  showPosition?: boolean;
}

export default function PlayerCard({ player, position, size = 'md', showPosition = true }: Props) {
  return (
    <div className={`player-card player-card-${size}`}>
      <div className="player-card-number">
        <img
          src={avatarSrc(player.photoUrl)}
          alt={`${player.firstName} ${player.lastName}`}
          className="player-card-photo"
        />
      </div>
      <div className="player-card-info">
        <div className="player-card-name">
          <span className="player-card-firstname">{player.firstName}</span>
          <span className="player-card-lastname">{player.lastName.toUpperCase()}</span>
        </div>
        {showPosition && position && (
          <div className="player-card-position">{position}</div>
        )}
      </div>
    </div>
  );
}
