import { useState, useMemo, useCallback } from "react";
import { Typography, Button, Menu, MenuItem, Box } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GridLayout, { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { Header, Navbar, HeadlineBanner, InfoCard } from "../../components";
import { useRequireAuth } from "../../hooks";
import { DASHBOARD_CARDS } from "./DashboardCards";

const Dashboard = () => {
  useRequireAuth();

  const [visibleCards, setVisibleCards] = useState<string[]>(() => {
    const savedVisible = localStorage.getItem("dashboardVisibleCards");

    return savedVisible
      ? JSON.parse(savedVisible)
      : DASHBOARD_CARDS.map((c) => c.id);
  });

  const [layout, setLayout] = useState<Layout[]>(() => {
    const savedLayout = localStorage.getItem("dashboardLayout");

    const initialLayouts = savedLayout
      ? JSON.parse(savedLayout)
      : DASHBOARD_CARDS.map((c) => c.defaultLayout);

    return initialLayouts.filter((l: { i: string }) =>
      visibleCards.includes(l.i)
    );
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const hiddenCards = DASHBOARD_CARDS.filter(
    (card) => !visibleCards.includes(card.id)
  );

  const handleLayoutChange = useCallback((newLayout: Layout[]) => {
    localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));
    setLayout(newLayout);
  }, []); // No dependencies, as setLayout is stable

  const handleRemoveCard = useCallback(
    (cardIdToRemove: string) => {
      const newVisibleCards = visibleCards.filter(
        (id) => id !== cardIdToRemove
      );
      setVisibleCards(newVisibleCards);
      localStorage.setItem(
        "dashboardVisibleCards",
        JSON.stringify(newVisibleCards)
      );

      const newLayout = layout.filter((l) => l.i !== cardIdToRemove);
      setLayout(newLayout);
      localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));
    },
    [visibleCards, layout]
  );

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddCard = useCallback(
    (cardToAdd: (typeof DASHBOARD_CARDS)[0]) => {
      const newVisibleCards = [...visibleCards, cardToAdd.id];
      setVisibleCards(newVisibleCards);
      localStorage.setItem(
        "dashboardVisibleCards",
        JSON.stringify(newVisibleCards)
      );

      const newLayout = [...layout, cardToAdd.defaultLayout];
      setLayout(newLayout);
      localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));

      handleMenuClose();
    },
    [visibleCards, layout]
  );

  const memoizedCards = useMemo(() => {
    return DASHBOARD_CARDS.filter((card) => visibleCards.includes(card.id)).map(
      (card) => {
        const CardContent = card.content; // 👈 Assign to a PascalCase variable
        return (
          <div key={card.id}>
            <InfoCard title={card.title}>
              <>
                <CardContent /> {/* 👈 Render the component here */}
                <Button
                  onClick={() => handleRemoveCard(card.id)}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  Remove From Dash
                </Button>
              </>
            </InfoCard>
          </div>
        );
      }
    );
  }, [visibleCards, handleRemoveCard]);

  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        px={3} // Adding some padding for better layout
      >
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleMenuClick}
          disabled={hiddenCards.length === 0}
        >
          Add Card
        </Button>
        <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
          {hiddenCards.map((card) => (
            <MenuItem key={card.id} onClick={() => handleAddCard(card)}>
              {card.title}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={150}
        width={2000} // Consider making this dynamic, e.g., based on screen width
        onLayoutChange={handleLayoutChange}
      >
        {memoizedCards}
      </GridLayout>
    </>
  );
};

export default Dashboard;
