export const calculateTokens = (difference) => {
    // If the difference is negative or zero, return zero
    if (difference <= 1800000) {
      return 0;
    }
  
    // Calculate the number of 30-minute slots
    const numSlots = Math.floor(difference / (30 * 60 * 1000));
  
    // Calculate the total duration considering only the 30-minute slots
    const totalDuration = numSlots * (30 * 60 * 1000);
  
    return numSlots;
  };

export const calculateCost = (plannedDuration, costPerUnit) => {
    const numSlots = Math.floor(plannedDuration / (30 * 60 * 1000));
    return costPerUnit * numSlots;
};

export const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export const calculateRemainingTime = (startTime, endTime) => {
  const now = Date.now();
  if (!endTime) {
    // Handle case where endTime is not available (optional)
    return null;
  } else if (now >= endTime) {
    return 0; // Session has ended
  } else {
    const remainingTime = endTime - now;
    return remainingTime;
  }
};