// src/hooks/useGoogleAnalytics.ts
import { useCallback } from 'react';

interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const useGoogleAnalytics = () => {
  const trackEvent = useCallback((event: GAEvent) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }, []);

  const trackPageView = useCallback((pagePath: string, pageTitle: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', process.env.REACT_APP_GA_MEASUREMENT_ID!, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  }, []);

  return { trackEvent, trackPageView };
};