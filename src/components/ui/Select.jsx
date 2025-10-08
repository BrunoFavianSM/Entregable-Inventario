import clsx from 'clsx';
import Tooltip from './Tooltip';

const Select = ({ 
  label, 
  error, 
  className, 
  icon: Icon,
  tooltip,
  children,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="label flex items-center gap-2">
          {label}
          {tooltip && (
            <Tooltip content={tooltip} position="right" />
          )}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        <select
          className={clsx(
            'input',
            Icon && 'pl-10',
            error && 'input-error',
            className
          )}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
};

export default Select;
