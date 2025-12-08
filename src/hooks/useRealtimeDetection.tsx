import { useState, useEffect, useCallback } from "react";
import { ATTACK_TYPES, getAttackById, AttackType } from "@/config/attackTypes";

export interface DetectedThreat {
  id: string;
  attackType: AttackType;
  confidence: number;
  sourceIp: string;
  targetIp: string;
  timestamp: Date;
  status: "active" | "mitigated" | "investigating";
  detectionLatency: number;
}

// Simulate real-time threat detection from federated model
const generateRandomThreat = (): DetectedThreat => {
  const attackIds = ATTACK_TYPES.map((a) => a.id);
  const randomAttackId = attackIds[Math.floor(Math.random() * attackIds.length)];
  const attack = getAttackById(randomAttackId);

  const generateIp = () =>
    `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

  return {
    id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    attackType: attack,
    confidence: Math.floor(Math.random() * 25) + 75, // 75-100%
    sourceIp: generateIp(),
    targetIp: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    timestamp: new Date(),
    status: "active",
    detectionLatency: Math.floor(Math.random() * 200) + 50, // 50-250ms
  };
};

export const useRealtimeDetection = (enabled: boolean = true) => {
  const [threats, setThreats] = useState<DetectedThreat[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(enabled);
  const [stats, setStats] = useState({
    totalDetected: 0,
    mitigated: 0,
    activeThreats: 0,
    avgLatency: 0,
  });

  const mitigateThreat = useCallback((threatId: string) => {
    setThreats((prev) =>
      prev.map((t) =>
        t.id === threatId ? { ...t, status: "mitigated" as const } : t
      )
    );
  }, []);

  const dismissThreat = useCallback((threatId: string) => {
    setThreats((prev) => prev.filter((t) => t.id !== threatId));
  }, []);

  const clearAllThreats = useCallback(() => {
    setThreats([]);
  }, []);

  useEffect(() => {
    if (!isMonitoring) return;

    // Simulate incoming threats at random intervals
    const simulateThreats = () => {
      const newThreat = generateRandomThreat();
      setThreats((prev) => [newThreat, ...prev].slice(0, 50)); // Keep last 50 threats
    };

    // Random interval between 3-8 seconds
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 3000;

    let timeoutId: NodeJS.Timeout;

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        simulateThreats();
        scheduleNext();
      }, getRandomInterval());
    };

    // Start with an initial threat after 2 seconds
    timeoutId = setTimeout(() => {
      simulateThreats();
      scheduleNext();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isMonitoring]);

  // Update stats whenever threats change
  useEffect(() => {
    const activeThreats = threats.filter((t) => t.status === "active").length;
    const mitigated = threats.filter((t) => t.status === "mitigated").length;
    const avgLatency =
      threats.length > 0
        ? Math.round(
            threats.reduce((acc, t) => acc + t.detectionLatency, 0) /
              threats.length
          )
        : 0;

    setStats({
      totalDetected: threats.length,
      mitigated,
      activeThreats,
      avgLatency,
    });
  }, [threats]);

  return {
    threats,
    stats,
    isMonitoring,
    setIsMonitoring,
    mitigateThreat,
    dismissThreat,
    clearAllThreats,
  };
};
