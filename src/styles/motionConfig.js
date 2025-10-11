// Стандартные параметры анимаций для всего проекта
export const MOTION = {
  duration: 0.6,
  delay: 0,
  ease: [0.4, 0, 0.2, 1],
};

export const MOTION_FAST = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};

export function MOTION_LIST(index = 0, baseDelay = 0.1) {
  return {
    duration: 0.6,
    delay: baseDelay + index * 0.1,
    ease: [0.4, 0, 0.2, 1],
  };
} 
