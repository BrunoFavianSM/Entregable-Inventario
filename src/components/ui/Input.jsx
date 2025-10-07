import clsx from 'clsx';

const Input = ({ 
  label, 
  error, 
  className, 
  type = 'text',
  icon: Icon,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={clsx(
            'input',
            Icon && 'pl-10',
            error && 'input-error',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
