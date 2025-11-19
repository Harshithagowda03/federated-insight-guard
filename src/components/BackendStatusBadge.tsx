import { Badge } from '@/components/ui/badge';
import { Server, AlertCircle, Loader2 } from 'lucide-react';
import { usePythonBackend } from '@/hooks/usePythonBackend';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const BackendStatusBadge = () => {
  const { connected, loading, error } = usePythonBackend();

  const getStatusConfig = () => {
    if (loading) {
      return {
        variant: 'secondary' as const,
        icon: <Loader2 className="h-3 w-3 animate-spin" />,
        text: 'Checking',
        tooltip: 'Connecting to Python backend...',
      };
    }

    if (connected) {
      return {
        variant: 'default' as const,
        icon: <Server className="h-3 w-3" />,
        text: 'Backend Online',
        tooltip: 'Python FastAPI backend is connected',
      };
    }

    return {
      variant: 'destructive' as const,
      icon: <AlertCircle className="h-3 w-3" />,
      text: 'Backend Offline',
      tooltip: error || 'Python backend is not available',
    };
  };

  const config = getStatusConfig();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={config.variant} className="flex items-center gap-1.5">
            {config.icon}
            <span className="text-xs">{config.text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{config.tooltip}</p>
          {!connected && !loading && (
            <p className="text-xs text-muted-foreground mt-1">
              Set VITE_PYTHON_API_URL in .env
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
