import { useEffect } from "react";
import { Easing } from "react-native";
import { SharedValue, useDerivedValue, useSharedValue, withTiming, WithTimingConfig } from "react-native-reanimated";

export const sharedBin = (value: boolean): 0 | 1 => {
  'worklet';
  return value ? 1 : 0;
};
/**
 * Return value runs from 0 to 1 when state change using withTiming
 */
export const useSharedTransition = (
  state: boolean | number,
  config?: WithTimingConfig,
): SharedValue<number> => {
  const value = useSharedValue(0);
  useEffect(() => {
    value.value = typeof state === 'boolean' ? sharedBin(state) : state;
  }, [state, value]);
  return useDerivedValue(() =>
    withTiming(
      value.value,
      { duration: 500, ...config }
    ),
  );
};
