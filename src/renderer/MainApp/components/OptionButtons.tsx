import './OptionButtons.css';

interface ActionButtonsProps {
  buttonOneText?: string;
  buttonTwoText?: string;
  buttonThreeText?: string;
}

function OptionButtons({
  buttonOneText = 'Reset All',
  buttonTwoText = 'Options',
  buttonThreeText = 'Convert Now',
}: ActionButtonsProps) {
  return (
    <div className="option-buttons" data-node-id="9:965">
      <button type="button" className="action-btn" data-node-id="9:936">
        {buttonOneText}
      </button>
      <button
        type="button"
        className="action-btn"
        data-node-id="9:936"
        onClick={() => {
          window.electron?.ipcRenderer?.sendMessage('OpenSettings', []);
        }}
      >
        {buttonTwoText}
      </button>
      <button type="button" className="action-btn" data-node-id="9:959">
        {buttonThreeText}
      </button>
    </div>
  );
}

OptionButtons.defaultProps = {
  buttonOneText: 'Reset All',
  buttonTwoText: 'Options',
  buttonThreeText: 'Convert Now',
};

export default OptionButtons;
