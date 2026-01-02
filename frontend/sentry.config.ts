import * as Sentry from '@sentry/react-native';

export const initSentry = () => {
    Sentry.init({
        dsn: 'YOUR_SENTRY_DSN_HERE',
        environment: 'development',
        enabled: true,
        tracesSampleRate: 1.0,
    });
};