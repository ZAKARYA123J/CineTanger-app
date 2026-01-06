import React from 'react';
import { View, ViewProps, ViewStyle, StyleSheet, StyleProp } from 'react-native';

type Props = ViewProps & {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export const ThemedView: React.FC<Props> = ({ children, style, ...rest }) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});