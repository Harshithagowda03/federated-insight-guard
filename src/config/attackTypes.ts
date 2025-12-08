import {
  Zap,
  Database,
  Code,
  Bot,
  Key,
  Globe,
  Network,
  Shield,
  FileOutput,
  UserX,
  LucideIcon
} from "lucide-react";

export interface AttackType {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
  severity: "critical" | "high" | "medium" | "low";
}

// Central configuration for all attack types
export const ATTACK_TYPES: AttackType[] = [
  // Existing attacks
  {
    id: "ddos",
    label: "DDoS Attack",
    description: "Distributed Denial of Service",
    icon: Zap,
    color: "hsl(0, 84%, 60%)",
    severity: "critical",
  },
  {
    id: "sql-injection",
    label: "SQL Injection",
    description: "Database manipulation attack",
    icon: Database,
    color: "hsl(25, 95%, 53%)",
    severity: "high",
  },
  {
    id: "xss",
    label: "Cross-Site Scripting",
    description: "JavaScript injection attack",
    icon: Code,
    color: "hsl(45, 93%, 47%)",
    severity: "medium",
  },
  {
    id: "gan-evasion",
    label: "GAN Evasion",
    description: "Adversarial ML attack",
    icon: Bot,
    color: "hsl(280, 87%, 65%)",
    severity: "high",
  },
  {
    id: "brute-force",
    label: "Brute Force",
    description: "Password cracking attack",
    icon: Key,
    color: "hsl(200, 98%, 39%)",
    severity: "medium",
  },
  {
    id: "port-scan",
    label: "Port Scan",
    description: "Network reconnaissance",
    icon: Globe,
    color: "hsl(142, 76%, 36%)",
    severity: "low",
  },
  // New attack types
  {
    id: "dns-tunneling",
    label: "DNS Tunneling",
    description: "Covert data exfiltration via DNS queries",
    icon: Globe,
    color: "hsl(190, 90%, 50%)",
    severity: "high",
  },
  {
    id: "arp-spoofing",
    label: "ARP Spoofing",
    description: "MAC address impersonation attack",
    icon: Network,
    color: "hsl(320, 85%, 55%)",
    severity: "high",
  },
  {
    id: "mitm-attack",
    label: "Man-in-the-Middle",
    description: "Traffic interception and manipulation",
    icon: Shield,
    color: "hsl(350, 90%, 55%)",
    severity: "critical",
  },
  {
    id: "data-exfiltration",
    label: "Data Exfiltration",
    description: "Unauthorized data transfer over DNS/HTTPS",
    icon: FileOutput,
    color: "hsl(260, 80%, 60%)",
    severity: "critical",
  },
  {
    id: "insider-misuse",
    label: "Insider Misuse",
    description: "Suspicious admin or privileged user activity",
    icon: UserX,
    color: "hsl(30, 100%, 50%)",
    severity: "high",
  },
];

// Model class count for ML - TODO: Update training data to include all attack classes
export const MODEL_CLASS_COUNT = ATTACK_TYPES.length;

// Attack ID to index mapping for model output
export const ATTACK_ID_TO_INDEX: Record<string, number> = ATTACK_TYPES.reduce(
  (acc, attack, index) => {
    acc[attack.id] = index;
    return acc;
  },
  {} as Record<string, number>
);

// Index to attack mapping for model predictions
export const INDEX_TO_ATTACK: Record<number, AttackType> = ATTACK_TYPES.reduce(
  (acc, attack, index) => {
    acc[index] = attack;
    return acc;
  },
  {} as Record<number, AttackType>
);

// Helper to get attack by ID with fallback for unknown attacks
export const getAttackById = (id: string): AttackType => {
  const attack = ATTACK_TYPES.find((a) => a.id === id);
  if (attack) return attack;
  
  // Fallback for unknown attacks
  return {
    id: "unknown",
    label: "Unknown Attack",
    description: "Unrecognized attack pattern",
    icon: Shield,
    color: "hsl(0, 0%, 50%)",
    severity: "medium",
  };
};

// Get attacks by severity
export const getAttacksBySeverity = (severity: AttackType["severity"]): AttackType[] => {
  return ATTACK_TYPES.filter((a) => a.severity === severity);
};

// Severity colors for charts
export const SEVERITY_COLORS: Record<AttackType["severity"], string> = {
  critical: "hsl(0, 84%, 60%)",
  high: "hsl(25, 95%, 53%)",
  medium: "hsl(45, 93%, 47%)",
  low: "hsl(142, 76%, 36%)",
};
