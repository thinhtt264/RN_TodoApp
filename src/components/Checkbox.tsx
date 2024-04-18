import React, {
    forwardRef,
    memo,
    useImperativeHandle,
    useState,
} from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { CheckBoxProps, CheckBoxRef } from './type';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Colors from '../themes/Colors';
import Layout from '../themes/Layout';
import { scale, sharedBin } from '../common';
import isEqual from 'react-fast-compare';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const CheckBox = forwardRef<CheckBoxRef, CheckBoxProps>(({ defaultValue = false }, ref) => {

    useImperativeHandle(ref, () => ({
        isCheck: () => {
            return check;
        },
    }));


    const [check, setCheck] = useState<boolean>(defaultValue);

    const progress = useSharedValue(sharedBin(defaultValue) ? 1 : 0);
    const onToggle = (): void => {
        progress.value = withTiming(check ? 0 : 1);
        setCheck(prev => !prev);
    };
    const stylez = useAnimatedStyle(() => {
        const bg = interpolateColor(
            progress.value,
            [0, 1],
            [Colors.grey, Colors.green],
        );
        return {
            backgroundColor: bg,
        };
    }, [check]);

    const iconStylez = useAnimatedStyle(() => {
        const scaleIcon = interpolate(progress.value, [0, 0.5, 1], [0, 1.2, 1]);
        return {
            transform: [{ scale: scaleIcon }],
        };
    }, [check]);

    // useEffect(() => {
    //     progress.value = withTiming(defaultValue ? 0 : 1);
    //     setCheck(defaultValue);
    // }, [])

    return (
        <Animated.View style={[styles.container, stylez]}>
            <TouchableOpacity
                onPress={onToggle}
                hitSlop={15}
                style={[styles.checkbox, Layout.center]}>
                <AnimatedIcon
                    name={'done'}
                    size={scale(16)}
                    color={Colors.white}
                    style={iconStylez}
                />
            </TouchableOpacity>
        </Animated.View>
    );
});

export default memo(CheckBox, isEqual);

const styles = StyleSheet.create({
    container: {
        width: scale(22),
        height: scale(22),
        borderRadius: 5,
        alignSelf: 'center'
    },
    checkbox: {
        flex: 1,
    },
});
