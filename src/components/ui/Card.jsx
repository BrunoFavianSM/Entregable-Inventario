import clsx from 'clsx';

const Card = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        'card',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className }) => {
  return (
    <h3 className={clsx('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  );
};

const CardBody = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className }) => {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-gray-200', className)}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
