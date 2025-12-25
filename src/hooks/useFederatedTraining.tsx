import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FederatedNode {
  id: string;
  name: string;
  status: 'active' | 'syncing' | 'idle' | 'offline';
  accuracy: number;
  samples: number;
  contribution: number;
}

export interface TrainingSession {
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  current_round: number;
  max_rounds: number;
  accuracy: number;
  loss: number;
  total_samples: number;
  nodes: FederatedNode[];
}

export interface FederatedTrainingState {
  isConnected: boolean;
  isLoading: boolean;
  isTraining: boolean;
  error: string | null;
  roundId: string | null;
  session: TrainingSession | null;
}

export const useFederatedTraining = () => {
  const [state, setState] = useState<FederatedTrainingState>({
    isConnected: false,
    isLoading: true,
    isTraining: false,
    error: null,
    roundId: null,
    session: null,
  });

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Check backend health
  const checkHealth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState(prev => ({ ...prev, isConnected: false, isLoading: false, error: 'Not authenticated' }));
        return false;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/federated-training?action=health`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setState(prev => ({ ...prev, isConnected: true, isLoading: false, error: null }));
        return true;
      } else {
        throw new Error('Backend health check failed');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Backend unavailable',
      }));
      return false;
    }
  }, []);

  // Start training
  const startTraining = useCallback(async (maxRounds: number = 10) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/federated-training?action=start`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ max_rounds: maxRounds }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start training');
      }

      const data = await response.json();

      setState(prev => ({
        ...prev,
        isLoading: false,
        isTraining: true,
        roundId: data.round_id,
        session: data.session,
      }));

      toast.success('Federated training started!');
      return data.round_id;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start training';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      toast.error(message);
      return null;
    }
  }, []);

  // Advance training (poll for next round) - sends current state since edge functions are stateless
  const advanceTraining = useCallback(async () => {
    if (!state.roundId || !state.isTraining || !state.session) return;

    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/federated-training?action=advance`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authSession.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            round_id: state.roundId,
            current_round: state.session.current_round,
            max_rounds: state.session.max_rounds,
            nodes: state.session.nodes,
            is_paused: state.session.status === 'paused',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to advance training');
      }

      const data = await response.json();

      setState(prev => ({
        ...prev,
        session: {
          status: data.status,
          current_round: data.current_round,
          max_rounds: data.max_rounds,
          accuracy: data.accuracy,
          loss: data.loss,
          total_samples: data.total_samples,
          nodes: data.nodes,
        },
        isTraining: data.status === 'running',
      }));

      if (data.status === 'completed') {
        toast.success(`Training Complete - ${(data.accuracy * 100).toFixed(2)}% accuracy`);
      }
    } catch (error) {
      console.error('Failed to advance training:', error);
    }
  }, [state.roundId, state.isTraining, state.session]);

  // Pause training
  const pauseTraining = useCallback(async () => {
    if (!state.roundId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/federated-training?action=pause`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ round_id: state.roundId }),
        }
      );

      if (response.ok) {
        setState(prev => ({
          ...prev,
          isTraining: false,
          session: prev.session ? { ...prev.session, status: 'paused' } : null,
        }));
        toast.info('Training paused');
      }
    } catch (error) {
      toast.error('Failed to pause training');
    }
  }, [state.roundId]);

  // Resume training
  const resumeTraining = useCallback(async () => {
    if (!state.roundId) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/federated-training?action=resume`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ round_id: state.roundId }),
        }
      );

      if (response.ok) {
        setState(prev => ({
          ...prev,
          isTraining: true,
          session: prev.session ? { ...prev.session, status: 'running' } : null,
        }));
        toast.success('Training resumed');
      }
    } catch (error) {
      toast.error('Failed to resume training');
    }
  }, [state.roundId]);

  // Reset training
  const resetTraining = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setState(prev => ({
      ...prev,
      isTraining: false,
      roundId: null,
      session: null,
    }));
    toast.info('Training reset');
  }, []);

  // Fetch nodes
  const fetchNodes = useCallback(async (): Promise<FederatedNode[]> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const url = state.roundId
        ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/federated-training?action=nodes&round_id=${state.roundId}`
        : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/federated-training?action=nodes`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.nodes;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch nodes:', error);
      return [];
    }
  }, [state.roundId]);

  // Check health on mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Polling for training progress
  useEffect(() => {
    if (state.isTraining && state.roundId) {
      pollingRef.current = setInterval(advanceTraining, 2000);
    } else if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [state.isTraining, state.roundId, advanceTraining]);

  return {
    ...state,
    startTraining,
    pauseTraining,
    resumeTraining,
    resetTraining,
    fetchNodes,
    checkHealth,
  };
};
