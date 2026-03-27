import UploadButtons from './UploadButtons';
import './UploadWrapper.css';

export default function UploadWrapper() {
  return (
    <div className="segmented-control" data-node-id="9:1588">
      <UploadButtons
        label="Upload Light Mode Picture"
        nodeId="I9:1588;647:1737"
      />
      <div
        className="segmented-separator"
        aria-hidden="true"
        data-node-id="I9:1588;647:1765"
      />
      <UploadButtons
        label="Upload Dark Mode Picture"
        nodeId="I9:1588;647:1738"
      />
    </div>
  );
}
