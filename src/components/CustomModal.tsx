import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { ModalProps } from './type'
import Modal from "react-native-modal";

const CustomModal = forwardRef(({ children }: ModalProps, ref) => {
    const [isVisible, setIsVisible] = useState(false)

    useImperativeHandle(ref, () => ({
        show: () => setIsVisible(true),
        close: () => setIsVisible(false)
    }), []);

    if (!isVisible) return null
    return (
        <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
            {children}
        </Modal>
    )
})

export default CustomModal