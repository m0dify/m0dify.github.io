// src/components/SimpleCounter.tsx
import React, { useEffect, useState } from 'react';
import './SimpleCounter.css';

const SimpleCounter: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);

  useEffect(() => {
    // 방문자 추적
    const trackVisitor = () => {
      const today = new Date().toDateString();
      const totalKey = 'blog_total_visitors';
      const todayKey = `blog_today_${today}`;
      const sessionKey = `blog_session_${today}`;
      
      // 오늘 이미 방문했는지 확인
      const hasVisitedToday = sessionStorage.getItem(sessionKey);
      
      if (!hasVisitedToday) {
        // 새 방문자
        sessionStorage.setItem(sessionKey, 'visited');
        
        // 총 방문자 수 증가
        const currentTotal = parseInt(localStorage.getItem(totalKey) || '0');
        const newTotal = currentTotal + 1;
        localStorage.setItem(totalKey, newTotal.toString());
        
        // 오늘 방문자 수 증가
        const currentToday = parseInt(localStorage.getItem(todayKey) || '0');
        const newToday = currentToday + 1;
        localStorage.setItem(todayKey, newToday.toString());
        
        setVisitorCount(newTotal);
        setTodayCount(newToday);
        
        // Google Analytics 이벤트 전송
        if (window.gtag) {
          window.gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
          });
        }
      } else {
        // 기존 방문자
        const currentTotal = parseInt(localStorage.getItem(totalKey) || '0');
        const currentToday = parseInt(localStorage.getItem(todayKey) || '0');
        setVisitorCount(currentTotal);
        setTodayCount(currentToday);
      }
    };

    trackVisitor();
  }, []);

  return (
    <div className="simple-counter">
      <div className="counter-stats">
        <div className="stat-item">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{visitorCount.toLocaleString()}</span>
          <span className="stat-label">총 방문자</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📅</span>
          <span className="stat-value">{todayCount}</span>
          <span className="stat-label">오늘 방문</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleCounter;