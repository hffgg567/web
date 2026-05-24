/**
 * Cloudflare Analytics 工具
 * 通过 Cloudflare GraphQL Analytics API 获取网站访问数据
 */

/**
 * Cloudflare GraphQL Analytics API 端点
 */
const CF_GRAPHQL_ENDPOINT = 'https://api.cloudflare.com/client/v4/graphql';

/**
 * 获取过去 30 天的 Analytics 数据
 * @param {Object} env - 环境变量，需要 CF_ACCOUNT_ID 和 CF_API_TOKEN
 * @returns {Promise<Object>} - 返回格式:
 *   {
 *     pageViews: number,
 *     visitors: number,
 *     requests: number,
 *     dailyData: [{ date: string, pageViews: number, visitors: number }]
 *   }
 */
export async function getAnalytics(env) {
  const accountId = env.CF_ACCOUNT_ID;
  const apiToken = env.CF_API_TOKEN;

  if (!accountId || !apiToken) {
    console.warn('Cloudflare Analytics: CF_ACCOUNT_ID or CF_API_TOKEN not configured');
    return {
      pageViews: 0,
      visitors: 0,
      requests: 0,
      dailyData: [],
    };
  }

  // 计算日期范围（过去 30 天）
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const formatDate = (date) => date.toISOString().split('T')[0];
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);

  // GraphQL 查询：获取每日和汇总的 Analytics 数据
  const query = `
    query GetAnalytics($accountId: String!, $filter: FilterObject) {
      viewer {
        accounts(filter: { accountTag: $accountId }) {
          httpRequests1dGroups(
            filter: $filter
            limit: 30
            orderBy: [date_ASC]
          ) {
            dimensions {
              date
            }
            sum {
              requests
              pageViews
            }
            uniq {
              uniques
            }
          }
          httpRequests1dGroupsAggregate(
            filter: $filter
          ) {
            sum {
              requests
              pageViews
            }
            uniq {
              uniques
            }
          }
        }
      }
    }
  `;

  const variables = {
    accountId,
    filter: {
      AND: [
        { date_geq: startDateStr },
        { date_leq: endDateStr },
      ],
    },
  };

  try {
    const response = await fetch(CF_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.error('Cloudflare Analytics API error:', response.status, response.statusText);
      return {
        pageViews: 0,
        visitors: 0,
        requests: 0,
        dailyData: [],
      };
    }

    const result = await response.json();

    // 检查 GraphQL 错误
    if (result.errors) {
      console.error('Cloudflare Analytics GraphQL errors:', JSON.stringify(result.errors));
      return {
        pageViews: 0,
        visitors: 0,
        requests: 0,
        dailyData: [],
      };
    }

    // 解析数据
    const accounts = result.data?.viewer?.accounts;
    if (!accounts || accounts.length === 0) {
      console.warn('Cloudflare Analytics: No account data returned');
      return {
        pageViews: 0,
        visitors: 0,
        requests: 0,
        dailyData: [],
      };
    }

    const account = accounts[0];

    // 解析每日数据
    const dailyGroups = account.httpRequests1dGroups || [];
    const dailyData = dailyGroups.map((group) => ({
      date: group.dimensions.date,
      pageViews: group.sum?.pageViews || 0,
      visitors: group.uniq?.uniques || 0,
    }));

    // 解析汇总数据
    const aggregateGroups = account.httpRequests1dGroupsAggregate || [];
    const aggregate = aggregateGroups[0] || {};
    const totalPageViews = aggregate.sum?.pageViews || 0;
    const totalRequests = aggregate.sum?.requests || 0;
    const totalVisitors = aggregate.uniq?.uniques || 0;

    return {
      pageViews: totalPageViews,
      visitors: totalVisitors,
      requests: totalRequests,
      dailyData,
    };
  } catch (err) {
    console.error('Cloudflare Analytics fetch error:', err);
    return {
      pageViews: 0,
      visitors: 0,
      requests: 0,
      dailyData: [],
    };
  }
}
