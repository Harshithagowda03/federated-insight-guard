import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simulate federated nodes
const generateNodes = () => [
  { id: 'node1', name: 'Node Alpha', status: 'active' as const, accuracy: 0.925, samples: 15000, contribution: 0 },
  { id: 'node2', name: 'Node Beta', status: 'active' as const, accuracy: 0.941, samples: 18500, contribution: 0 },
  { id: 'node3', name: 'Node Gamma', status: 'syncing' as const, accuracy: 0.918, samples: 12000, contribution: 0 },
  { id: 'node4', name: 'Node Delta', status: 'idle' as const, accuracy: 0.932, samples: 16200, contribution: 0 },
];

// Simulate training progress for a round (pure function - no state mutation)
const simulateRoundProgress = (currentRound: number, maxRounds: number, nodes: any[]) => {
  // Update node statuses with some randomness
  const updatedNodes = nodes.map((node: any) => {
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

  // Calculate totals
  const totalSamples = updatedNodes.reduce((sum: number, n: any) => sum + n.samples, 0);
  
  // Simulate gradual improvement
  const nextRound = currentRound + 1;
  const accuracy = Math.min(0.98, 0.85 + (nextRound / maxRounds) * 0.12 + (Math.random() * 0.02 - 0.01));
  const loss = Math.max(0.02, 0.5 - (nextRound / maxRounds) * 0.45 + (Math.random() * 0.05));

  return {
    current_round: nextRound,
    accuracy,
    loss,
    total_samples: totalSamples,
    nodes: updatedNodes,
    status: nextRound >= maxRounds ? 'completed' : 'running',
  };
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

    // Start training - returns initial session state to be managed client-side
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

    // Advance training - client sends current state, server computes next state
    if (action === 'advance' && req.method === 'POST') {
      const body = await req.json();
      const { round_id, current_round, max_rounds, nodes, is_paused } = body;
      
      if (!round_id) {
        return new Response(
          JSON.stringify({ error: 'round_id is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If paused, return current state without advancing
      if (is_paused) {
        return new Response(
          JSON.stringify({ 
            round_id, 
            status: 'paused',
            current_round,
            max_rounds,
            nodes,
            message: 'Training is paused' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if already completed
      if (current_round >= max_rounds) {
        return new Response(
          JSON.stringify({ 
            round_id, 
            status: 'completed',
            current_round,
            max_rounds,
            nodes,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Simulate next round
      const progress = simulateRoundProgress(
        current_round || 0, 
        max_rounds || 10, 
        nodes || generateNodes()
      );
      
      console.log(`Training advanced: ${round_id} - Round ${progress.current_round}/${max_rounds}`);
      
      return new Response(
        JSON.stringify({ 
          round_id, 
          max_rounds,
          updated_at: new Date().toISOString(),
          ...progress 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pause training - just acknowledge (state managed client-side)
    if (action === 'pause' && req.method === 'POST') {
      const body = await req.json();
      const { round_id } = body;
      
      console.log(`Training paused: ${round_id}`);
      
      return new Response(
        JSON.stringify({ status: 'paused', round_id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Resume training - just acknowledge (state managed client-side)
    if (action === 'resume' && req.method === 'POST') {
      const body = await req.json();
      const { round_id } = body;
      
      console.log(`Training resumed: ${round_id}`);
      
      return new Response(
        JSON.stringify({ status: 'running', round_id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get nodes status
    if (action === 'nodes') {
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
