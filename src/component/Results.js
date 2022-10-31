import { motion } from 'framer-motion';
import { formatPercentage } from '../utils/helper';

const Results = ({ errors, accuracyPercentage, total, className }) => {
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };

  return (
    <motion.ul
      className={`flex flex-col items-center space-y-3 
			text-primary-400 ${className}`}>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ duration: 0.3 }}
        className="text-xl font-semibold">
        Results
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ duration: 0.3, delay: 0.5 }}>
        Accuracy: {formatPercentage(accuracyPercentage)}
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ duration: 0.3, delay: 3.8 }}
        className="text-red-500">
        Errors : {errors}
      </motion.li>
      <motion.li
        initial={initial}
        animate={animate}
        transition={{ duration: 0.3, delay: 1.2 }}>
        Typed: {total}
      </motion.li>
    </motion.ul>
  );
};

export default Results;
