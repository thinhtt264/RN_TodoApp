import React, { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    interpolate,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    measure,
    useAnimatedRef,
    runOnUI,
} from 'react-native-reanimated';
import isEqual from 'react-fast-compare';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { formatPriority, formatTime, PriorityType, fontScale, scale, TodoItemType, useSharedTransition } from '../common';
import { Colors, Layout } from '../themes';
import CheckBox from './Checkbox';
import { EditTaskComponent } from './EditTask';
import { Input } from './Input';

type ListItemProps = {
    item: TodoItemType,
    onSaveEdit: (item: TodoItemType) => void;
    onDeleteTask: (id: string) => void;
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

    return {
        initialValues,
        animations,
    };
};


const entering = () => {
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
};
const scaleInputDiff = scale(8);
const editorHeight = scale(320)
const defaultHeight = scale(135)

const ListItemComponent = ({ item, onSaveEdit, onDeleteTask }: ListItemProps) => {
    const { isDone = false, title, time = Date.now() } = item
    const [isEdit, setIsEdit] = useState(false)

    const [taskTitle, setTaskTitle] = useState(title)
    const [date, setDate] = useState(new Date(time))
    const [priority, setPriority] = useState<PriorityType>(item.priority)

    const targetRef = useAnimatedRef();
    const sourceRef = useAnimatedRef();

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const priorityTextStyle = useMemo(() => getPriorityTextStyle(priority), [priority]);

    const animation = useSharedTransition(isEdit);


    const onPressSaveEdit = useCallback(() => {
        setIsEdit(false)
        moveComponentToTarget(false)
        onSaveEdit({
            ...item,
            title: taskTitle,
            priority: priority,
            time: date.getTime()
        })
    }, [date, taskTitle, priority])

    const hiddingTaskInfoStylez = useAnimatedStyle(() => {
        const opacity = interpolate(animation.value, [0, 1], [1, 0])
        const translateX = interpolate(animation.value, [0, 0.9, 1], [0, 0, -300])  //icon che mất

        return {
            opacity,
            transform: [{ translateX }]
        }
    }, [isEdit])

    const hiddingTaskEditStylez = useAnimatedStyle(() => {
        const opacity = interpolate(animation.value, [0, 1], [0, 1])

        return {
            opacity,
        }
    }, [isEdit])

    const moveComponentToTarget = (isEdit: boolean) => {
        runOnUI(() => {
            'worklet';
            const measurement = measure(targetRef);
            const measurement1 = measure(sourceRef);

            if (measurement === null || measurement1 === null) {
                return;
            }

            translateX.value = withTiming(isEdit ? (measurement.pageX - measurement1.pageX - scaleInputDiff) : 0, { duration: 500 });
            translateY.value = withTiming(isEdit ? (measurement.pageY - measurement1.pageY) : 0, { duration: 500 });
        })();
    };

    const titleStylez = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
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

    const onPressDeleteTask = () => {
        setIsEdit(false)
        moveComponentToTarget(false)
        setTimeout(() => {
            onDeleteTask(item.id)
        }, 300);
    }

    const onOpenEditor = () => {
        setIsEdit(true)
        moveComponentToTarget(true)
    }

    const onChangeText = (value: string) => {
        setTaskTitle(value)
    }

    return (
        <Animated.View
            layout={LinearTransition.duration(500)}
            entering={entering}
            exiting={existing}
            style={[styles.container, { height: isEdit ? editorHeight : defaultHeight }]}>
            <Animated.View style={styles.card}>
                <Animated.View style={hiddingTaskEditStylez}>
                    <EditTaskComponent
                        onChangeText={onChangeText}
                        inputRef={targetRef}
                        date={date}
                        priority={priority}
                        setPriority={setPriority}
                        setDate={setDate}
                        onPressSave={onPressSaveEdit}
                        onDeleteTask={onPressDeleteTask} />
                </Animated.View>

                <View style={styles.taskInfo}>
                    <View style={Layout.rowBetween}>
                        <View style={[Layout.rowBetween, Layout.fill]}>
                            <Animated.View style={hiddingTaskInfoStylez}>
                                <CheckBox defaultValue={isDone} />
                            </Animated.View>

                            <Animated.View ref={sourceRef} style={titleStylez}>
                                <Input
                                    editable={isEdit}
                                    defaultValue={taskTitle}
                                    onChangeTextValue={onChangeText}
                                    style={styles.input}
                                    inputStyle={styles.txtTitle} />
                            </Animated.View>
                        </View>

                        <Animated.View style={[hiddingTaskInfoStylez, { width: scale(15) }]}>
                            <TouchableOpacity activeOpacity={0.7} hitSlop={25} onPress={onOpenEditor}>
                                <Icon name='pencil' color={Colors.black} size={scale(15)} />
                            </TouchableOpacity>
                        </Animated.View>

                    </View>
                    <Animated.View style={[Layout.rowBetween, styles.row2, hiddingTaskInfoStylez]}>
                        <Text style={[styles.txtPriority, priorityTextStyle]}>{`Ưu tiên ${formatPriority(priority)?.toLowerCase()}`}</Text>
                        <Text style={styles.time}>{formatTime(time)}</Text>
                    </Animated.View>
                </View>
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
        fontSize: fontScale(16),
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
    },
    taskInfo: {
        position: 'absolute',
        left: scale(15),
        top: scale(20),
        right: scale(15),
        // zIndex:-1
    },
    input: {},
});