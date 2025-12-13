/**
 * FedSecure AI - Backend Status Badge Component
 * 
 * Displays real-time connection status to Python Flask backend.
 * Shows online/offline state with visual indicator and tooltip details.
 * 
 * @author FedSecure AI Team
 */

import { Badge } from '@/components/ui/badge';
import { Server, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useBackendConnection } from '@/hooks/useBackendConnection';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

export const BackendStatusBadge = () => {
  const { 
    isOnline, 
    isChecking, 
    errorMessage,
    serverInfo,
    lastChecked,
    refreshStatus 
  } = useBackendConnection();

  // Determine visual configuration based on current state
  const getDisplayConfig = () => {
    if (isChecking && !lastChecked) {
      // Initial connection check
      return {
        badgeVariant: 'secondary' as const,
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
        label: 'Connecting...',
        description: 'Attempting to reach Flask backend server',
      };
    }

    if (isOnline) {
      // Backend is accessible
      return {
        badgeVariant: 'default' as const,
        icon: <Server className="h-3 w-3" />,
        label: 'Backend Online',
        description: serverInfo 
          ? `${serverInfo.service} v${serverInfo.version}` 
          : 'Flask server connected',
      };
    }

    // Backend unreachable
    return {
      badgeVariant: 'destructive' as const,
      icon: <AlertCircle className="h-3 w-3" />,
      label: 'Backend Offline',
      description: errorMessage || 'Flask server not responding',
    };
  };

  const config = getDisplayConfig();

  // Format last check time for display
  const formatLastChecked = () => {
    if (!lastChecked) return null;
    return lastChecked.toLocaleTimeString();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge 
              variant={config.badgeVariant} 
              className="flex items-center gap-1.5 cursor-help"
            >
              {config.icon}
              <span className="text-xs">{config.label}</span>
            </Badge>
            
            {/* Manual refresh button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={refreshStatus}
              disabled={isChecking}
            >
              <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </TooltipTrigger>
        
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="text-xs font-medium">{config.description}</p>
            
            {lastChecked && (
              <p className="text-xs text-muted-foreground">
                Last checked: {formatLastChecked()}
              </p>
            )}
            
            {!isOnline && (
              <div className="pt-1 border-t border-border mt-2">
                <p className="text-xs text-muted-foreground">
                  Ensure Flask backend is running on port 8000.
                  Check VITE_PYTHON_API_URL in environment.
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
