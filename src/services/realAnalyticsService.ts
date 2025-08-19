// src/services/realAnalyticsService.ts
export interface RealAnalyticsData {
  activeUsers: number;
  totalUsers: number;
  totalPageViews: number;
  totalSessions: number;
  todayUsers: number;
  todayPageViews: number;
  timestamp: string;
  success: boolean;
}

class RealAnalyticsService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api'
      : '/api';
  }

  async getAnalyticsData(): Promise<RealAnalyticsData> {
    try {
      const response = await fetch(`${this.apiUrl}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API 응답 실패');
      }

      return data;
    } catch (error) {
      console.error('Real Analytics API 오류:', error);
      throw error;
    }
  }

  // 폴백용 로컬 데이터
  getLocalFallback(): RealAnalyticsData {
    const today = new Date().toDateString();
    const sessionKey = 'analytics_session';
    const dataKey = 'analytics_fallback';
    
    let data = JSON.parse(localStorage.getItem(dataKey) || '{}');
    
    if (!data.totalUsers) {
      data = {
        totalUsers: 0,
        totalPageViews: 0,
        totalSessions: 0,
        todayUsers: 0,
        todayPageViews: 0,
        lastVisit: null,
      };
    }
    
    // 새 방문자 체크
    if (data.lastVisit !== today && !sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, 'visited');
      data.todayUsers += 1;
      data.todayPageViews += 1;
      data.totalUsers += 1;
      data.totalPageViews += 1;
      data.totalSessions += 1;
      data.lastVisit = today;
      localStorage.setItem(dataKey, JSON.stringify(data));
    }
    
    return {
      activeUsers: sessionStorage.getItem(sessionKey) ? 1 : 0,
      totalUsers: data.totalUsers,
      totalPageViews: data.totalPageViews,
      totalSessions: data.totalSessions,
      todayUsers: data.todayUsers,
      todayPageViews: data.todayPageViews,
      timestamp: new Date().toISOString(),
      success: false
    };
  }
}

export default new RealAnalyticsService();