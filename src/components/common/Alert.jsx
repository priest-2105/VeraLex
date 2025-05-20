import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa'; // Using react-icons

const alertVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

const Alert = ({ type = 'info', message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!message || !isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  let bgColor, borderColor, textColor, Icon;

  switch (type) {
    case 'success':
      bgColor = 'bg-green-50';
      borderColor = 'border-green-400';
      textColor = 'text-green-700';
      Icon = FaCheckCircle;
      break;
    case 'error':
      bgColor = 'bg-red-50';
      borderColor = 'border-red-400';
      textColor = 'text-red-700';
      Icon = FaExclamationCircle;
      break;
    // Add 'warning', 'info' types if needed
    default:
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-400';
      textColor = 'text-blue-700';
      Icon = FaExclamationCircle; // Or an info icon
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={alertVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3 }}
          className={`border-l-4 p-4 mb-4 rounded-md shadow-sm ${bgColor} ${borderColor}`}
          role="alert"
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${textColor}`}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className={`ml-3 flex-grow ${textColor}`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
            {onClose && (
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={handleClose}
                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${bgColor} ${textColor} hover:bg-opacity-80`}
                    aria-label="Dismiss"
                  >
                    <span className="sr-only">Dismiss</span>
                    <FaTimes className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert; 