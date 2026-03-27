import './TitleBar.css';

export default function TitleBar({
  emoji,
  title,
}: {
  emoji: string;
  title: string;
}) {
  return (
    <div className="utility-title-bar" data-node-id="I9:840;585:3765">
      <div className="utility-title" data-node-id="I9:840;585:3765;650:5965">
        <span
          className="utility-title-icon"
          data-node-id="I9:840;585:3765;650:5965;650:5926"
        >
          {emoji || '⚙️'}
        </span>
        <span
          className="utility-title-text"
          data-node-id="I9:840;585:3765;650:5965;650:5928"
        >
          {title || 'Settings'}
        </span>
      </div>
    </div>
  );
}
