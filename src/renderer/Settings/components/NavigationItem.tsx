import './NavigationItem.css';

export default function NavigationItem({ text }: { text: string }) {
  if (!text) {
    return null;
  }
  return (
    <button
      type="button"
      className="utility-tab utility-tab-active"
      data-node-id="I9:840;586:167;204:9721"
    >
      {text}
    </button>
  );
}
