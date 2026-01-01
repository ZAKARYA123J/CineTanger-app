import { useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export function useColorScheme(): ColorSchemeName {
    const [scheme, setScheme] = useState<ColorSchemeName>(Appearance.getColorScheme() ?? 'light');

    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setScheme(colorScheme);
        });
        return () => {
            // new RN returns subscription with remove(); older versions use subscription.remove
            if (typeof (subscription as any).remove === 'function') {
                (subscription as any).remove();
            } else if (typeof subscription === 'function') {
                (subscription as any)();
            }
        };
    }, []);

    return scheme;
}