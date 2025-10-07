import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  disabled,
  loading,
  icon: Icon,
  ...props 
}) => {
  const baseClasses = 'btn inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
    outline: 'btn-outline',
  };
  
  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };
  
  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="spinner w-4 h-4 border-2" />
      )}
      {!loading && Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;
