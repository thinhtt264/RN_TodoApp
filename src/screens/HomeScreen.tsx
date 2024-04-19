import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ListItem } from '../components/ListItem';
import { Colors, Layout } from '../themes';
import { scale, TodoItemType } from '../common';
import { appInit, sortedTodoListSelector, todoActions, useAppDispatch, useAppSelector } from '../store';
import { Button } from '../components/Button';
import CustomModal from '../components/CustomModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModalRef } from '../components/type';
import Animated, { LinearTransition } from 'react-native-reanimated';
import AddTaskComponent from '../components/AddTask';
import Icon from 'react-native-vector-icons/FontAwesome';

const AnimatedList = Animated.FlatList
let deboune: string | number | NodeJS.Timeout | undefined;

const HomeScreen = () => {
    const modalAddTaskRef = useRef<ModalRef>()

    const dispatch = useAppDispatch();
    const [isAppInited, setIsAppInited] = useState<boolean>(false);
    const [isAscending, setisAscending] = useState(false)
    // const translationY = useSharedValue(0);
    const sortedTodoList = useAppSelector(state => sortedTodoListSelector(state, isAscending))

    useEffect(() => {
        const init = async () => {
            await dispatch(appInit());
        };
        init().finally(async () => {
            setIsAppInited(true)
        })
    }, [])

    // const scrollHandler = useAnimatedScrollHandler(event => {
    //     translationY.value = event.contentOffset.y;
    // });

    const onPressCreateTask = () => {
        modalAddTaskRef?.current?.show()
    }

    const onPressSave = (item: TodoItemType) => {
        modalAddTaskRef?.current?.close()
        dispatch(todoActions.onAddTask(item))
    }

    const onSaveEdit = (item: TodoItemType) => {
        dispatch(todoActions.onEditTask(item))
    }

    const onChangeAscending = () => {
        clearTimeout(deboune)
        deboune = setTimeout(() => {
            setisAscending(prev => !prev)
        }, 200);
    }

    const onDeleteTask = (id: string) => {
        dispatch(todoActions.onDeleteTask({ id }))
    }

    const renderItem = (item: TodoItemType, index: number) => {
        return <ListItem item={item} index={index} onSaveEdit={onSaveEdit} onDeleteTask={onDeleteTask} />
    }

    return (
        <View style={[Layout.fill, styles.container]}>
            <SafeAreaView style={Layout.fill}>
                <View style={[Layout.rowBetween, styles.header]}>
                    <View />
                    <Text style={styles.title}>Todo List</Text>
                    <TouchableOpacity hitSlop={25} activeOpacity={0.7} onPress={onChangeAscending}>
                        <Icon name={isAscending ? 'sort-amount-asc' : 'sort-amount-desc'} size={scale(18)} color={Colors.black} />
                    </TouchableOpacity>
                </View>
                {
                    isAppInited ?
                        <AnimatedList
                            data={sortedTodoList}
                            extraData={sortedTodoList}
                            itemLayoutAnimation={LinearTransition.duration(500)}
                            keyExtractor={item => item.id.toString()}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={Sperator}
                            ListFooterComponent={<View style={styles.divider} />}
                            renderItem={({ item, index }) => renderItem(item, index)}
                        />
                        : null
                }
                <Button onPress={onPressCreateTask} />
            </SafeAreaView>

            <CustomModal ref={modalAddTaskRef}>
                <View style={styles.wrap}>
                    <AddTaskComponent onPressSave={onPressSave} />
                </View>
            </CustomModal>
        </View>
    );
}
const Sperator = () => <View style={{ height: scale(20) }} />
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.yellow,
        paddingHorizontal: scale(25)
    },
    header: {
        paddingVertical: scale(15),
    },
    title: {
        fontSize: 18,
        color: Colors.white,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    wrap: {
        width: '100%',
        backgroundColor: Colors.white,
        padding: scale(30),
        borderRadius: scale(15)
    },
    divider: { height: scale(100) }
});

export default HomeScreen;
