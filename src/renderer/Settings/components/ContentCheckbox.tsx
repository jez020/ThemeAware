import './ContentCheckbox.css';

export default function ContentCheckbox({
  checkboxId,
  currentBoolean,
  updateBoolean,
  labelText,
}: {
  checkboxId: string;
  currentBoolean: boolean;
  updateBoolean: (value: boolean) => void;
  labelText: string;
}) {
  return (
    <label
      className="settings-checkbox-row"
      data-node-id="13:534"
      htmlFor={checkboxId}
    >
      <input
        id={checkboxId}
        className="settings-checkbox"
        type="checkbox"
        checked={currentBoolean}
        onChange={(event) => updateBoolean(event.target.checked)}
      />
      <span className="settings-checkbox-label">{labelText}</span>
    </label>
  );
}
