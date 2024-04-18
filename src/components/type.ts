import {StyleProp, TextInputProps, ViewStyle} from 'react-native';
import {ReactNode} from 'react';

export interface CheckBoxProps {
  defaultValue?: boolean;
  ref: React.RefObject<CheckBoxRef>;
}

export interface CheckBoxRef {
  isCheck: Function;
}

export interface ModalRef {
  show: Function;
  close: Function;
}

export interface ModalProps {
  children: ReactNode;
}

export interface InputProps extends TextInputProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  validate?: boolean;
  onChangeTextValue?: (input: string) => void;
  contentRight?: () => React.ReactNode;
  contentLeft?: () => React.ReactNode;
  defaultValue: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export interface InputRef {
  value: string;
  setValue: (valueInput: string) => void;
  setError: (textError: string) => void;
  clearError: () => void;
  clear: () => void;
}
