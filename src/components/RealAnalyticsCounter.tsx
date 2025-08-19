// src/components/RealAnalyticsCounter.tsx
import React, { useEffect, useState } from 'react';
import realAnalyticsService, { RealAnalyticsData } from '../services/realAnalyticsService';
import './RealAnalyticsCounter.css';

const RealAnalyticsCounter: React.FC = () => {
  const [analytics, setAnalytics] = useState<RealAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isRealData, setIsRealData] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadAnalytics = async () => {
    try {
      setError('');
      const data = await realAnalyticsService.getAnalyticsData();
      setAnalytics(data);
      setIsRealData(true);
      setLastUpdate(new Date());
      console.log('✅ Real Analytics 데이터 로드 성공');
    } catch (error) {
      console.warn('⚠️ Real Analytics 실패, 로컬 데이터 사용:', error);
      const fallbackData = realAnalyticsService.getLocalFallback();
      setAnalytics(fallbackData);
      setIsRealData(false);
      setError('실시간 데이터 연결 실패');
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
    
    // 실시간 데이터인 경우에만 주기적 업데이트
    const interval = setInterval(() => {
      if (isRealData) {
        loadAnalytics();
      }
    }, 30000); // 30초마다 업데이트
    
    return () => clearInterval(interval);
  }, [isRealData]);

  if (loading) {
    return (
      <div className="real-analytics-counter loading">
        <div className="loading-spinner"></div>
        <span>📊 실시간 분석 로딩 중...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="real-analytics-counter error">
        <span>📊 분석 데이터 없음</span>
      </div>
    );
  }

  return (
    <div className="real-analytics-counter">
      <div className="analytics-header">
        <h3>📊 실시간 통계</h3>
        <div className="status-indicator">
          {isRealData ? (
            <span className="real-data">🔴 실시간</span>
          ) : (
            <span className="fallback-data">🟡 로컬</span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-notice">
          ⚠️ {error}
        </div>
      )}

      <div className="analytics-grid">
        <div className="stat-card highlight">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.activeUsers}</div>
            <div className="stat-label">현재 방문자</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.todayUsers}</div>
            <div className="stat-label">오늘 방문자</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.totalUsers.toLocaleString()}</div>
            <div className="stat-label">총 사용자 (30일)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👀</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.totalPageViews.toLocaleString()}</div>
            <div className="stat-label">페이지뷰 (30일)</div>
          </div>
        </div>
      </div>

      <div className="last-updated">
        <span>마지막 업데이트: {lastUpdate.toLocaleTimeString()}</span>
        {isRealData && (
          <button 
            className="refresh-btn" 
            onClick={loadAnalytics}
            title="수동 새로고침"
          >
            🔄
          </button>
        )}
      </div>
    </div>
  );
};

export default RealAnalyticsCounter;