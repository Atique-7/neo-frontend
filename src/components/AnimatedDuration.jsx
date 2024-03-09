import React from 'react';
import { useSpring, animated } from 'react-spring';
import { format } from 'date-fns'; // Import format function from date-fns

const AnimatedDuration = ({ duration }) => {
  const { value } = useSpring({
    from: { value: 0 },
    to: { value: duration },
    config: { duration: 1000 }, // Adjust animation speed as needed
  });

  return (
    <div className="">
      <animated.span>
        {value.interpolate((val) => format(new Date(val), 'HH:mm:ss'))} {/* Format duration using date-fns */}
      </animated.span>
    </div>
  );
};

export default AnimatedDuration;
