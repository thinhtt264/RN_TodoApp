import React, { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    LinearTransition,
    withSpring,
} from 'react-native-reanimated';
import isEqual from 'react-fast-compare';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { formatPriority, formatTime, PriorityType, fontScale, scale, TodoItemType } from '../common';
import { Colors, Layout } from '../themes';
import CheckBox from './Checkbox';
import { EditTaskComponent } from './EditTask';

type ListItemProps = {
    item: TodoItemType,
    onSaveEdit: (item: TodoItemType) => void;
    index: number;
    onDeleteTask: (id: string) => void;
    // translationY: SharedValue<number>;
};

const getPriorityTextStyle = (priority: PriorityType) => {
    switch (priority) {
        case 'low':
            return {
                color: 'gray',
            };
        case 'medium':
            return {
                color: Colors.orange,
            };
        case 'high':
            return {
                color: Colors.green,
            };
        default:
            return {
                color: 'black',
            };
    }
};

const existing = () => {
    'worklet';
    const animations = {
        opacity: withSpring(0, { duration: 500 }),
        transform: [
            { scale: withSpring(0.4, { damping: 7, stiffness: 100, mass: 0.5 }) },
        ],
    };
    const initialValues = {
        opacity: 1,
        transform: [{ scale: 1 }],
    };
    const callback = (finished: boolean) => {
        if (finished) {
            console.log('zo k');
        }
    };
    return {
        initialValues,
        animations,
        callback
    };
};


const Item_Height = scale(160)

const ListItemComponent = ({ item, onSaveEdit, onDeleteTask, index }: ListItemProps) => {
    const [isEdit, setIsEdit] = useState(false)
    const { isDone = false, title, priority, time } = item
    const priorityTextStyle = useMemo(() => getPriorityTextStyle(priority), [priority]);

    const onPressSaveEdit = useCallback((item: TodoItemType) => {
        onSaveEdit(item)
        setIsEdit(false)
    }, [])

    const entering = useCallback(() => {
        'worklet';
        const animations = {
            opacity: withSpring(1, { duration: 500 }),
            transform: [
                { scale: withSpring(1, { damping: 6, stiffness: 80, mass: 0.4 }) },
            ],
        };
        const initialValues = {
            opacity: 0,
            transform: [{ scale: 0.4 }],
        };
        return {
            initialValues,
            animations,
        };
    }, []);

    // const stylez = useAnimatedStyle(() => {
    //     const scale = interpolate(
    //         translationY.value,
    //         [-1, 0, Item_Height * index, Item_Height * (index + 2.1)],
    //         [1, 1, 1, 0],
    //         'clamp',
    //     );
    //     return {
    //         transform: [{ scale }],
    //     };
    // }); không có height cố định không làm trò này được

    const onPressDeleteTask = (id: string) => {
        setIsEdit(false)
        setTimeout(() => {
            onDeleteTask(id)
        }, 300);
    }

    return (
        <Animated.View
            layout={LinearTransition}
            entering={entering}
            exiting={existing}
            style={styles.container}>
            <Animated.View
                style={styles.card}>
                {
                    isEdit ?
                        <EditTaskComponent item={item} onPressSave={onPressSaveEdit} onDeleteTask={onPressDeleteTask} />
                        :
                        <Animated.View entering={entering}>
                            <View style={Layout.rowBetween}>
                                <View style={Layout.rowBetween}>
                                    <CheckBox defaultValue={isDone} />
                                    <Text numberOfLines={1} style={styles.txtTitle}>{title}</Text>
                                </View>
                                <TouchableOpacity activeOpacity={0.7} hitSlop={25} onPress={() => setIsEdit(prev => !prev)}>
                                    <Icon name='pencil' color={Colors.black} size={scale(15)} />
                                </TouchableOpacity>
                            </View>
                            <View style={[Layout.rowBetween, styles.row2]}>
                                <Text style={[styles.txtPriority, priorityTextStyle]}>{`Ưu tiên ${formatPriority(priority)?.toLowerCase()}`}</Text>
                                <Text style={styles.time}>{formatTime(time)}</Text>
                            </View>
                        </Animated.View>
                }

            </Animated.View>
        </Animated.View >
    );
}
export const ListItem = memo(ListItemComponent, isEqual)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.white,
        alignSelf: 'center',
        borderRadius: 15,
    },
    card: {
        paddingHorizontal: scale(15),
        paddingVertical: scale(30),
        flex: 1
    },
    txtTitle: {
        fontWeight: '500',
        fontSize: fontScale(15),
        color: Colors.black,
        marginLeft: scale(10)
    },
    txtPriority: {
        fontSize: fontScale(12),
        marginLeft: scale(30),
        fontWeight: '500'
    },
    row2: {
        marginTop: scale(35)
    },
    time: {
        fontSize: fontScale(12),
        color: Colors.black,
        fontWeight: '500'
    }
});