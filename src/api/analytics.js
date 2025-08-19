const { BetaAnalyticsDataClient } = require('@google-analytics/data');

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 환경 변수 확인
    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!propertyId || !clientEmail || !privateKey) {
      throw new Error('필수 환경 변수가 설정되지 않았습니다');
    }

    // Analytics 클라이언트 초기화
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
    });

    // 병렬로 여러 요청 실행
    const [realtimeResponse, last30DaysResponse, todayResponse] = await Promise.all([
      // 실시간 활성 사용자
      analyticsDataClient.runRealtimeReport({
        property: `properties/${propertyId}`,
        metrics: [{ name: 'activeUsers' }],
      }),
      
      // 지난 30일 총 데이터
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: '30daysAgo', endDate: 'yesterday' }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' }
        ],
      }),
      
      // 오늘 데이터
      analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'screenPageViews' }
        ],
      }),
    ]);

    // 데이터 파싱
    const activeUsers = parseInt(realtimeResponse[0].rows?.[0]?.metricValues?.[0]?.value || '0');
    const totalUsers = parseInt(last30DaysResponse[0].rows?.[0]?.metricValues?.[0]?.value || '0');
    const totalPageViews = parseInt(last30DaysResponse[0].rows?.[0]?.metricValues?.[1]?.value || '0');
    const totalSessions = parseInt(last30DaysResponse[0].rows?.[0]?.metricValues?.[2]?.value || '0');
    const todayUsers = parseInt(todayResponse[0].rows?.[0]?.metricValues?.[0]?.value || '0');
    const todayPageViews = parseInt(todayResponse[0].rows?.[0]?.metricValues?.[1]?.value || '0');

    const responseData = {
      activeUsers,
      totalUsers,
      totalPageViews,
      totalSessions,
      todayUsers,
      todayPageViews,
      timestamp: new Date().toISOString(),
      success: true
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error('Analytics API 오류:', error);
    res.status(500).json({
      error: 'Analytics 데이터를 가져올 수 없습니다',
      message: error.message,
      success: false
    });
  }
}