import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory training state (for demo purposes)
const trainingSessions = new Map<string, {
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed';
  current_round: number;
  max_rounds: number;
  accuracy: number;
  loss: number;
  total_samples: number;
  nodes: Array<{
    id: string;
    name: string;
    status: 'active' | 'syncing' | 'idle' | 'offline';
    accuracy: number;
    samples: number;
    contribution: number;
  }>;
  started_at: string;
  updated_at: string;
}>();

// Simulate federated nodes
const generateNodes = () => [
  { id: 'node1', name: 'Node Alpha', status: 'active' as const, accuracy: 0.925, samples: 15000, contribution: 0 },
  { id: 'node2', name: 'Node Beta', status: 'active' as const, accuracy: 0.941, samples: 18500, contribution: 0 },
  { id: 'node3', name: 'Node Gamma', status: 'syncing' as const, accuracy: 0.918, samples: 12000, contribution: 0 },
  { id: 'node4', name: 'Node Delta', status: 'idle' as const, accuracy: 0.932, samples: 16200, contribution: 0 },
];

// Simulate training progress for a round
const simulateRoundProgress = (session: any, roundNumber: number) => {
  // Randomly update node statuses
  session.nodes = session.nodes.map((node: any) => {
    const rand = Math.random();
    let newStatus = node.status;
    if (rand < 0.7) newStatus = 'active';
    else if (rand < 0.9) newStatus = 'syncing';
    else newStatus = 'idle';
    
    // Simulate accuracy improvement with some variance
    const accuracyDelta = (Math.random() * 0.02) - 0.005;
    const newAccuracy = Math.min(0.99, Math.max(0.85, node.accuracy + accuracyDelta));
    
    return {
      ...node,
      status: newStatus,
      accuracy: newAccuracy,
      contribution: Math.floor(Math.random() * 100),
    };
  });

  // Calculate global accuracy as weighted average of node accuracies
  const totalSamples = session.nodes.reduce((sum: number, n: any) => sum + n.samples, 0);
  const weightedAccuracy = session.nodes.reduce((sum: number, n: any) => {
    return sum + (n.accuracy * n.samples / totalSamples);
  }, 0);

  // Simulate gradual improvement
  const baseAccuracy = 0.85 + (roundNumber / session.max_rounds) * 0.12;
  session.accuracy = Math.min(0.98, baseAccuracy + (Math.random() * 0.02 - 0.01));
  session.loss = Math.max(0.02, 0.5 - (roundNumber / session.max_rounds) * 0.45 + (Math.random() * 0.05));
  session.current_round = roundNumber;
  session.total_samples = totalSamples;
  session.updated_at = new Date().toISOString();

  return session;
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Health check endpoint
    if (action === 'health') {
      return new Response(
        JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Start training
    if (action === 'start' && req.method === 'POST') {
      const body = await req.json();
      const { max_rounds = 10 } = body;
      
      const roundId = crypto.randomUUID();
      const session = {
        status: 'running' as const,
        current_round: 0,
        max_rounds,
        accuracy: 0.85,
        loss: 0.5,
        total_samples: 61700,
        nodes: generateNodes(),
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      trainingSessions.set(roundId, session);
      
      console.log(`Training started: ${roundId} with ${max_rounds} rounds`);
      
      return new Response(
        JSON.stringify({
          status: 'success',
          message: 'Federated training started',
          round_id: roundId,
          session,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get training status
    if (action === 'status') {
      const roundId = url.searchParams.get('round_id');
      
      if (!roundId) {
        return new Response(
          JSON.stringify({ error: 'round_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const session = trainingSessions.get(roundId);
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Training session not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ round_id: roundId, ...session }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Advance training by one round
    if (action === 'advance' && req.method === 'POST') {
      const body = await req.json();
      const { round_id } = body;
      
      if (!round_id) {
        return new Response(
          JSON.stringify({ error: 'round_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const session = trainingSessions.get(round_id);
      if (!session) {
        return new Response(
          JSON.stringify({ error: 'Training session not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (session.status === 'paused') {
        return new Response(
          JSON.stringify({ round_id, ...session, message: 'Training is paused' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (session.current_round >= session.max_rounds) {
        session.status = 'completed';
        return new Response(
          JSON.stringify({ round_id, ...session }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Simulate next round
      const updatedSession = simulateRoundProgress(session, session.current_round + 1);
      
      if (updatedSession.current_round >= updatedSession.max_rounds) {
        updatedSession.status = 'completed';
      }

      trainingSessions.set(round_id, updatedSession);
      
      console.log(`Training advanced: ${round_id} - Round ${updatedSession.current_round}/${updatedSession.max_rounds}`);
      
      return new Response(
        JSON.stringify({ round_id, ...updatedSession }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pause training
    if (action === 'pause' && req.method === 'POST') {
      const body = await req.json();
      const { round_id } = body;
      
      const session = trainingSessions.get(round_id);
      if (session) {
        session.status = 'paused';
        session.updated_at = new Date().toISOString();
        trainingSessions.set(round_id, session);
      }
      
      return new Response(
        JSON.stringify({ status: 'paused', round_id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Resume training
    if (action === 'resume' && req.method === 'POST') {
      const body = await req.json();
      const { round_id } = body;
      
      const session = trainingSessions.get(round_id);
      if (session && session.status === 'paused') {
        session.status = 'running';
        session.updated_at = new Date().toISOString();
        trainingSessions.set(round_id, session);
      }
      
      return new Response(
        JSON.stringify({ status: 'running', round_id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get nodes status
    if (action === 'nodes') {
      const roundId = url.searchParams.get('round_id');
      
      if (roundId) {
        const session = trainingSessions.get(roundId);
        if (session) {
          return new Response(
            JSON.stringify({ nodes: session.nodes }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      // Return default nodes if no active session
      return new Response(
        JSON.stringify({ nodes: generateNodes() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Federated training error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
