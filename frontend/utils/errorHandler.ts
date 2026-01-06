import * as Sentry from '@sentry/react-native';

export const logError = (error: Error, context?: Record<string, any>) => {
    if (__DEV__) {
        console.error('Error:', error, context);
    }
    
    Sentry.captureException(error, {
        extra: context,
    });
};

export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
    if (__DEV__) {
        console.log(`[${level.toUpperCase()}]:`, message);
    }
    
    Sentry.captureMessage(message, level);
};

export const setUser = (user: { id: string; email?: string; username?: string }) => {
    Sentry.setUser({
        id: user.id,
        email: user.email,
        username: user.username,
    });
};

export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
    Sentry.addBreadcrumb({
        message,
        category,
        data,
        level: 'info',
    });
};