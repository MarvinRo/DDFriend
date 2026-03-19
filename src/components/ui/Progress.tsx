import { useEffect, useRef } from 'react';
import { Animated, View as RnView, type View } from 'react-native';

import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  max,
  ...props
}: { className?: string; value: number; max?: number } & React.ComponentPropsWithoutRef<
  typeof View
>) {
  const safeMax = max && max > 0 ? max : 100;
  const isOver = value > safeMax;

  const targetBasePercent = isOver ? (safeMax / value) * 100 : (value / safeMax) * 100;
  const targetExcessPercent = isOver ? ((value - safeMax) / value) * 100 : 0;

  const baseAnim = useRef(new Animated.Value(0)).current;
  const excessAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(baseAnim, {
        toValue: targetBasePercent,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(excessAnim, {
        toValue: targetExcessPercent,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [targetBasePercent, targetExcessPercent]);

  return (
    <RnView
      className={cn(
        'h-4 w-full overflow-hidden rounded-full bg-secondary flex-row',
        className
      )}
      {...props}
    >
      <Animated.View
        className={cn('bg-red-600 h-full')}
        style={{
          width: baseAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'], extrapolate: 'clamp' }),
        }}
      />
      <Animated.View
        className={cn('bg-cyan-500 h-full')}
        style={{
          width: excessAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'], extrapolate: 'clamp' }),
        }}
      />
    </RnView>
  );
}

export { Progress };
