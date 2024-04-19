import { StyleSheet, Text, View } from 'react-native'
import React, { memo, useCallback, useRef, useState } from 'react'
import { Input } from './Input'
import { Colors, Layout } from '../themes'
import { fontScale, formatDate, formatPriority, PriorityType, scale } from '../common'
import DatePicker from 'react-native-date-picker'
import { TouchableOpacity } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import isEqual from 'react-fast-compare'
import CustomModal from './CustomModal'
import { ModalRef } from './type'
import Icon from 'react-native-vector-icons/FontAwesome'

type Props = {
    onPressSave: () => void;
    onDeleteTask: () => void;
    inputRef: any;
    onChangeText: (text: string) => void
    date: Date
    setDate: (date: Date) => void
    setPriority: (priority: PriorityType) => void
    priority: PriorityType
}

const EditTask = ({ onPressSave, onDeleteTask, inputRef, onChangeText, date, setDate, setPriority, priority }: Props) => {
    const modalPriorityRef = useRef<ModalRef>()

    const [openTimePick, setOpenTimePick] = useState(false)

    const onPickPriority = useCallback((priority: PriorityType) => {
        setPriority(priority)
        onPressPriority(false)
    }, [])

    const onPressPriority = useCallback((visible: boolean) => {
        visible ? modalPriorityRef?.current?.show() : modalPriorityRef?.current?.close()
    }, [])

    const onPressEdit = () => {
        onPressSave()
    }


    return (
        <>
            <TouchableOpacity style={styles.delete} activeOpacity={0.7} hitSlop={25} onPress={onDeleteTask}>
                <Icon name='trash-o' color={Colors.black} size={scale(22)} />
                <Text style={styles.txtDelete}>Xoá</Text>
            </TouchableOpacity>

            <Animated.View ref={inputRef}>
                <Text numberOfLines={1} style={styles.txtTitle}>{''}</Text>
                <View style={styles.divider} />
            </Animated.View>

            <View style={styles.time}>
                <TouchableOpacity style={[Layout.rowBetween, styles.time]} activeOpacity={0.7} onPress={() => { setOpenTimePick(true) }}>
                    <Text style={styles.txtTime}>Thời hạn</Text>
                    <Text style={styles.txtDate}>{formatDate(date)}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
            </View>

            <View style={styles.time}>
                <TouchableOpacity style={[Layout.rowBetween, styles.time]} activeOpacity={0.7} onPress={() => onPressPriority(true)}>
                    <Text style={styles.txtTime}>Mức độ ưu tiên</Text>
                    <Text style={styles.txtDate}>{formatPriority(priority)}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
            </View>

            <View style={Layout.center}>
                <TouchableOpacity
                    style={styles.done}
                    activeOpacity={0.7}
                    hitSlop={25}
                    onPress={onPressEdit}>
                    <Text style={styles.txtDone}>Xong</Text>
                </TouchableOpacity>
            </View>


            <CustomModal ref={modalPriorityRef}>
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
            </CustomModal>

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

export const EditTaskComponent = memo(EditTask, isEqual)

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
        borderRadius: scale(15),
        marginTop: scale(40),
        backgroundColor: Colors.green
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
        width: '100%',
    },
    priorityItem: {
        paddingVertical: scale(15),
        marginVertical: scale(5),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    delete: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: scale(5)
    },
    txtDelete: {
        fontSize: fontScale(12),
        fontWeight: '400',
        color: Colors.black
    },
    input: {
        color: 'transparent',
    },
    txtTitle: {
        fontWeight: '500',
        fontSize: fontScale(16),
        color: Colors.black,
        marginLeft: scale(10),
        marginBottom: scale(10)
    },
})