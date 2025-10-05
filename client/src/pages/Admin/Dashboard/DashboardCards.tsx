import type { Layout } from "react-grid-layout";
import ScheduledArticlesCard from "./ScheduledArticlesCard";
import AnalyticsCard from "./AnalyticsCard";
import QuickActionsCard from "./QuickActionsCard";

interface DashboardCard {
  id: string;
  title: string;
  defaultLayout: Layout;
  content: React.FC;
}

export const DASHBOARD_CARDS: DashboardCard[] = [
  {
    id: "scheduled",
    title: "Scheduled Articles",
    defaultLayout: { i: "scheduled", x: 0, y: 0, w: 4, h: 2 },
    content: ScheduledArticlesCard,
  },
  {
    id: "analytics",
    title: "Analytics",
    defaultLayout: { i: "analytics", x: 4, y: 0, w: 4, h: 2 },
    content: AnalyticsCard,
  },
  {
    id: "quickActions",
    title: "Quick Actions",
    defaultLayout: { i: "quickActions", x: 8, y: 0, w: 4, h: 2 },
    content: QuickActionsCard,
  },
];
