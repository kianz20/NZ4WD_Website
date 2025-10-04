import type { Layout } from "react-grid-layout";
import ScheduledArticlesCard from "./ScheduledArticlesCard";

interface DashboardCard {
  id: string;
  title: string;
  defaultLayout: Layout;
  content: React.ReactNode;
}

export const DASHBOARD_CARDS: DashboardCard[] = [
  {
    id: "scheduled",
    title: "Scheduled Articles",
    defaultLayout: { i: "scheduled", x: 0, y: 0, w: 4, h: 2 },
    content: <ScheduledArticlesCard />,
  },
  {
    id: "analytics",
    title: "Analytics",
    defaultLayout: { i: "analytics", x: 4, y: 0, w: 4, h: 2 },
    content: <></>,
  },
  {
    id: "quickActions",
    title: "Quick Actions",
    defaultLayout: { i: "quickActions", x: 8, y: 0, w: 4, h: 2 },
    content: <></>,
  },
];
