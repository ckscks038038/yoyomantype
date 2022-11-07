import { motion } from 'framer-motion';

const Caret = ({ className }) => {
  return (
    <motion.div
      aria-hidden={true}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: 'easeInOut' }}
      className={className}
    />
  );
};

export default Caret;
