import { LayoutShell } from "./components/LayoutShell";
import { WorkspaceProvider, useWorkspace } from "./context/WorkspaceContext";
import { BuilderPage } from "./pages/BuilderPage";
import { ChallengesPage } from "./pages/ChallengesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { GeneratorPage } from "./pages/GeneratorPage";
import { InstallPage } from "./pages/InstallPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { UpgradePage } from "./pages/UpgradePage";

function ActivePageRouter() {
  const { currentPage } = useWorkspace();

  switch (currentPage) {
    case "dashboard":
      return <DashboardPage />;
    case "generator":
      return <GeneratorPage />;
    case "builder":
      return <BuilderPage />;
    case "challenges":
      return <ChallengesPage />;
    case "discover":
      return <DiscoverPage />;
    case "profile":
      return <ProfilePage />;
    case "upgrade":
      return <UpgradePage />;
    case "install":
      return <InstallPage />;
    case "settings":
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
}

export default function App() {
  return (
    <WorkspaceProvider>
      <LayoutShell>
        <ActivePageRouter />
      </LayoutShell>
    </WorkspaceProvider>
  );
}
