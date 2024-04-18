import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, {
    forwardRef,
    useState,
    useRef,
    useImperativeHandle,
} from 'react';
import { InputProps, InputRef } from './type';
import isEqual from 'react-fast-compare';
import { fontScale, scale } from '../common';
import { Colors, Layout } from '../themes';

const InputComponent = forwardRef<InputRef, InputProps>(
    (
        {
            onChangeTextValue,
            contentRight,
            contentLeft,
            editable = true,
            defaultValue,
            onFocus,
            onBlur,
            inputStyle,
            style,
            ...props
        },
        ref,
    ) => {
        const [value, setValue] = useState<string>(defaultValue);
        const [errorMessage, setErrorMessage] = useState<string>('');
        const [isFocusing, setFocusing] = useState<boolean>(false);
        const inputRef = useRef<TextInput>(null);

        useImperativeHandle(ref, () => ({
            value,
            setValue: valueInput => setValue(valueInput),
            setError: textError => setErrorMessage(textError),
            clearError: () => setErrorMessage(''),
            clear: () => setValue(''),
        }));

        const onChangeText = (valueInput: string) => {
            if (errorMessage) setErrorMessage('');
            setValue(valueInput);
            onChangeTextValue?.(valueInput);
        };

        const _onClear = () => {
            onChangeText('');
            inputRef.current?.clear();
        };

        return (
            <View style={style}>
                <View style={[{ paddingVertical: scale(8) }, Layout.rowVCenter]}>
                    {contentLeft?.()}
                    <TextInput
                        style={[inputStyle, styles.inputStyle]}
                        ref={inputRef}
                        value={value}
                        onChangeText={onChangeText}
                        editable={editable}
                        autoCorrect={false}
                        autoComplete={'off'}
                        onFocus={() => {
                            setFocusing(true);
                            onFocus?.();
                        }}
                        onBlur={() => {
                            setFocusing(false);
                            onBlur?.();
                        }}
                        {...props}
                    />
                    {contentRight?.()}
                </View>
                <View style={[styles.divider, { backgroundColor: isFocusing ? Colors.black : Colors.grey }]} />
            </View>

        );
    },
);

export const Input = React.memo(InputComponent, isEqual);

const styles = StyleSheet.create({
    inputStyle: {
        color: Colors.black,
        textAlignVertical: 'center',
        padding: 0,
        margin: 0,
        width: '100%',
        fontWeight: '500',
        fontSize: fontScale(16)
    },
    divider: {
        width: '100%',
        height: 1,
    }
});