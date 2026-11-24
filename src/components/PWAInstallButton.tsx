import { Download, WifiOff } from "lucide-react";
import { useWorkspace } from "../context/WorkspaceContext";
import { useOnlineStatus, usePWAInstall } from "../hooks/usePWAInstall";

interface PWAInstallButtonProps {
  compact?: boolean;
  onNavigateInstallPage?: () => void;
}

export function PWAInstallButton({
  compact = false,
  onNavigateInstallPage,
}: PWAInstallButtonProps) {
  const { t, setCurrentPage, showToast } = useWorkspace();
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Hide automatically when running inside installed standalone mode
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome === "accepted") {
        showToast(t.pwa.installSuccessToast, "success");
        return;
      }
    }
    if (onNavigateInstallPage) {
      onNavigateInstallPage();
    } else {
      setCurrentPage("install");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        compact
          ? "inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-purple-500/40 bg-[#121A35] px-3 py-1.5 text-xs font-medium text-purple-200 whitespace-nowrap shrink-0 transition-colors hover:border-purple-400 hover:text-white focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
          : "flex min-h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-[#7C3AED]/18 px-3.5 py-2 text-xs font-semibold text-purple-100 whitespace-nowrap transition-colors hover:bg-[#7C3AED]/30 focus-visible:outline-2 focus-visible:outline-[#8B5CF6]"
      }
    >
      <Download className="h-3.5 w-3.5 shrink-0 text-purple-300" />
      <span>{t.pwa.installButton}</span>
    </button>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { t } = useWorkspace();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 start-5 z-50 flex items-center gap-2 rounded-lg border border-amber-500/40 bg-[#16120B]/95 px-3.5 py-2 text-xs font-medium text-amber-200 shadow-lg backdrop-blur-sm"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-400" />
      <span>{t.pwa.offlineBanner}</span>
    </div>
  );
}
