import { useState } from "react";
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

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));
  };

  const handleRemoveCard = (cardIdToRemove: string) => {
    console.log(cardIdToRemove);
    const newVisibleCards = visibleCards.filter((id) => id !== cardIdToRemove);
    setVisibleCards(newVisibleCards);
    localStorage.setItem(
      "dashboardVisibleCards",
      JSON.stringify(newVisibleCards)
    );

    const newLayout = layout.filter((l) => l.i !== cardIdToRemove);
    setLayout(newLayout);
    localStorage.setItem("dashboardLayout", JSON.stringify(newLayout));
  };

  const handleAddCard = (cardToAdd: (typeof DASHBOARD_CARDS)[0]) => {
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
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
        width={2000}
        onLayoutChange={handleLayoutChange}
      >
        {DASHBOARD_CARDS.filter((card) => visibleCards.includes(card.id)).map(
          (card) => (
            <div key={card.id}>
              {/* Assuming InfoCard can take a custom action component */}
              <InfoCard title={card.title}>
                <>
                  {card.content}
                  <Button
                    onClick={() => handleRemoveCard(card.id)}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    Remove From Dash
                  </Button>
                </>
              </InfoCard>
            </div>
          )
        )}
      </GridLayout>
    </>
  );
};

export default Dashboard;
