import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import { fontScale, scale } from '../common'
import { Colors } from '../themes'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

type Props = {
    onPress: () => void
}
const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity)
export const Button = ({ onPress }: Props) => {
    const scale = useSharedValue(1);

    const stylez = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    }, [])

    const handlePressIn = () => {
        'worklet';
        scale.value = withSpring(1.1);
    };

    const handlePressOut = () => {
        'worklet';
        scale.value = withSpring(1);
    };


    return (
        <AnimatedButton style={[styles.container, stylez]} activeOpacity={1} onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Text style={styles.txt}>Tạo task mới +</Text>
        </AnimatedButton>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.pink,
        borderRadius: 20,
        paddingVertical: scale(10),
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: scale(15)
    },
    txt: {
        fontSize: fontScale(16),
        color: Colors.white,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})