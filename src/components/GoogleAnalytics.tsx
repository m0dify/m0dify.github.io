// src/components/GoogleAnalytics.tsx
import React, { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

const GoogleAnalytics: React.FC = () => {
  const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;

  useEffect(() => {
    if (!measurementId) {
      console.warn('Google Analytics Measurement ID가 설정되지 않았습니다.');
      return;
    }

    // Google Analytics 스크립트 로드
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    // gtag 초기화
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);

    // 전역 gtag 함수 설정
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    return () => {
      // 컴포넌트 언마운트 시 정리
      if (document.head.contains(script1)) {
        document.head.removeChild(script1);
      }
      if (document.head.contains(script2)) {
        document.head.removeChild(script2);
      }
    };
  }, [measurementId]);

  return null; // 렌더링할 내용 없음
};

export default GoogleAnalytics;