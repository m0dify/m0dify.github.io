import { BetaAnalyticsDataClient } from '@google-analytics/data';

interface AnalyticsData {
  activeUsers: number;
  totalUsers: number;
  pageViews: number;
  sessions: number;
}

class AnalyticsService {
  private client: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor() {
    this.propertyId = process.env.REACT_APP_GA_PROPERTY_ID || '';
    
    // 서비스 계정 인증 설정
    this.client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });
  }

  async getRealTimeData(): Promise<AnalyticsData> {
    try {
      const [response] = await this.client.runRealtimeReport({
        property: `properties/${this.propertyId}`,
        metrics: [
          { name: 'activeUsers' },
        ],
        dimensions: [
          { name: 'unifiedPageScreen' },
        ],
      });

      const activeUsers = response.rows?.[0]?.metricValues?.[0]?.value || '0';

      return {
        activeUsers: parseInt(activeUsers),
        totalUsers: 0, // 실시간에서는 제공되지 않음
        pageViews: 0,
        sessions: 0,
      };
    } catch (error) {
      console.error('Analytics API 호출 실패:', error);
      throw error;
    }
  }

  async getHistoricalData(startDate: string, endDate: string): Promise<AnalyticsData> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        metrics: [
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' },
        ],
      });

      const totalUsers = response.rows?.[0]?.metricValues?.[0]?.value || '0';
      const pageViews = response.rows?.[0]?.metricValues?.[1]?.value || '0';
      const sessions = response.rows?.[0]?.metricValues?.[2]?.value || '0';

      return {
        activeUsers: 0,
        totalUsers: parseInt(totalUsers),
        pageViews: parseInt(pageViews),
        sessions: parseInt(sessions),
      };
    } catch (error) {
      console.error('Historical Analytics API 호출 실패:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();