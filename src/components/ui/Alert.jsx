import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import clsx from 'clsx';

const Alert = ({ type = 'info', title, message, onClose, className }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const variants = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info',
  };

  const Icon = icons[type];

  return (
    <div className={clsx('alert flex items-start gap-3', variants[type], className)}>
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        {message && <p className="text-sm">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
