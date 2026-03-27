import './UploadButtons.css';

export default function UploadButtons({
  label,
  nodeId,
}: {
  label: string;
  nodeId: string;
}) {
  return (
    <button type="button" className="segment-btn" data-node-id={nodeId}>
      {label}
    </button>
  );
}
