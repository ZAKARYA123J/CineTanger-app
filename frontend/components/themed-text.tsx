import { Text, type TextProps, StyleSheet } from 'react-native';

import { CinetangerColors, CinetangerFonts } from '@/components/constants/theme';
import { useColorScheme } from 'react-native';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...rest
}: ThemedTextProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const color = colorScheme === 'dark' ? darkColor ?? CinetangerColors.text.dark : lightColor ?? CinetangerColors.text.light;

    return (
        <Text
            style={[
                { color },
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: CinetangerFonts.sizes.md,
        lineHeight: 24,
        fontWeight: CinetangerFonts.weights.regular,
    },
    defaultSemiBold: {
        fontSize: CinetangerFonts.sizes.md,
        lineHeight: 24,
        fontWeight: CinetangerFonts.weights.semibold,
    },
    title: {
        fontSize: CinetangerFonts.sizes.xxl,
        fontWeight: CinetangerFonts.weights.bold,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: CinetangerFonts.sizes.lg,
        fontWeight: CinetangerFonts.weights.bold,
    },
    link: {
        lineHeight: 30,
        fontSize: CinetangerFonts.sizes.md,
        color: CinetangerColors.info, // Use info color for links
    },
});