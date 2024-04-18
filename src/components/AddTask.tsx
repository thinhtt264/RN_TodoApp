import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Input } from './Input'
import { Colors, Layout } from '../themes'
import { fontScale, formatDate, formatPriority, PriorityType, scale, TodoItemType } from '../common'
import DatePicker from 'react-native-date-picker'
import { TouchableOpacity } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type Props = {
    onPressSave: (item: TodoItemType) => void;
}

const AddTaskComponent = ({ onPressSave }: Props) => {
    const [date, setDate] = useState(new Date())
    const [openTimePick, setOpenTimePick] = useState(false)
    const [openPriorityPick, setPriorityPick] = useState(false)
    const [priority, setPriority] = useState<PriorityType>('high')
    const [taskTitle, setTaskTitle] = useState('')

    const onPickPriority = useCallback((priority: PriorityType) => {
        setPriority(priority)
        setPriorityPick(false)
    }, [])

    return (
        <>
            <Input defaultValue='' placeholder='Task Title' onChangeTextValue={setTaskTitle} />

            <View style={styles.time}>
                <TouchableOpacity style={[Layout.rowBetween, styles.time]} activeOpacity={0.7} onPress={() => setOpenTimePick(true)}>
                    <Text style={styles.txtTime}>Thời hạn</Text>
                    <Text style={styles.txtDate}>{formatDate(date)}</Text>
                </TouchableOpacity>
                <View style={[styles.divider]} />
            </View>

            <View style={styles.time}>
                <TouchableOpacity style={[Layout.rowBetween, styles.time]} activeOpacity={0.7} onPress={() => setPriorityPick(true)}>
                    <Text style={styles.txtTime}>Mức độ ưu tiên</Text>
                    <Text style={styles.txtDate}>{formatPriority(priority)}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
            </View>

            <View style={Layout.center}>
                <TouchableOpacity disabled={taskTitle === ''} style={[styles.done, {
                    backgroundColor: !!taskTitle ? Colors.green : Colors.grey,
                }]} activeOpacity={0.7} onPress={() => onPressSave({
                    id: uuidv4(),
                    isDone: false,
                    priority: priority,
                    time: date.getTime(),
                    title: taskTitle
                })}>
                    <Text style={styles.txtDone}>Xong</Text>
                </TouchableOpacity>
            </View>


            {openPriorityPick ?
                <View style={[Layout.fill, Layout.absolute, Layout.center, styles.priorityPicker]}>
                    <Pressable style={[Layout.fill, Layout.absolute]} onPress={() => setPriorityPick(false)} />
                    <Animated.View style={styles.wrapPicker} entering={FadeInDown.duration(300)} exiting={FadeOutDown.duration(300)}>

                        <TouchableOpacity style={styles.priorityItem} onPress={() => onPickPriority('high')} activeOpacity={0.7}>
                            <Text style={styles.txtTime}>{formatPriority('high')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.priorityItem} onPress={() => onPickPriority('medium')} activeOpacity={0.7}>
                            <Text style={styles.txtTime}>{formatPriority('medium')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.priorityItem} onPress={() => onPickPriority('low')} activeOpacity={0.7}>
                            <Text style={styles.txtTime}>{formatPriority('low')}</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
                : null
            }



            <DatePicker
                mode='date'
                modal
                open={openTimePick}
                date={date}
                onConfirm={(date) => {
                    setOpenTimePick(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpenTimePick(false)
                }}
            />
        </>

    )
}

export default AddTaskComponent

const styles = StyleSheet.create({
    time: {
        marginTop: scale(15)
    },
    txtTime: {
        fontSize: fontScale(16),
        fontWeight: '500',
        color: Colors.black
    },
    txtDate: {
        color: Colors.black
    },
    done: {
        justifyContent: 'center',
        alignItems: 'center',
        width: scale(120),
        paddingVertical: scale(8),
        borderRadius: 15,
        marginTop: scale(40)
    },
    txtDone: {
        color: Colors.white,
        fontSize: fontScale(14),
        fontWeight: '500'
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.grey,
        marginTop: scale(10)
    },
    priorityPicker: {
        backgroundColor: Colors.backdrop,
        zIndex: 999,
    },
    wrapPicker: {
        backgroundColor: Colors.white,
        borderRadius: scale(15),
        width: '100%'
    },
    priorityItem: {
        paddingVertical: scale(15),
        marginVertical: scale(5),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})