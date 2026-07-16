import { getStatistics } from './Statistics';
import { getRevenue } from './Revenue';
import { getTopDoctors } from './Analytics';
import { getCaseStatusChart, getCasesPerMonth } from './Charts';
import {
  getDeliveryPerformance,
  getLatestCases,
  getTopCaseTypes,
} from './Cases';

// export const getDashboard = async () => {
//   const [
//     statistics,
//     revenue,
//     topDoctors,
//     caseStatusChart,
//     casesPerMonth,
//     latestCases,
//     topCaseTypes,
//     deliveryPerformance,
//   ] = await Promise.all([
//     getStatistics(),
//     getRevenue(),
//     getTopDoctors(),
//     getCaseStatusChart(),
//     getCasesPerMonth(),
//     getLatestCases(),
//     getTopCaseTypes(),
//     getDeliveryPerformance(),
//   ]);

//   return {
//     ...statistics,
//     ...revenue,
//     topCaseTypes,
//     latestCases,
//     deliveryPerformance,
//     topDoctors,
//     caseStatusChart,
//     casesPerMonth,
//   };
// };

export const getDashboard = async () => {
  const [
    statistics,
    revenue,
    topDoctors,
    caseStatusChart,
    casesPerMonth,
    latestCases,
    topCaseTypes,
    deliveryPerformance,
  ] = await Promise.all([
    getStatistics(),
    getRevenue(),
    getTopDoctors(),
    getCaseStatusChart(),
    getCasesPerMonth(),
    getLatestCases(),
    getTopCaseTypes(),
    getDeliveryPerformance(),
  ]);

  return {
    statistics,

    revenue,

    analytics: {
      topDoctors,
      topCaseTypes,
      deliveryPerformance,
    },

    charts: {
      caseStatusChart,
      casesPerMonth,
    },

    latestCases,
  };
};
