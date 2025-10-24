interface ThreatDetails {
  type: string;
  location?: string;
  time: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  userName: string;
  action?: string;
}

interface GeneratedMessages {
  sms: string;
  pushTitle: string;
  pushBody: string;
  whatsapp: string;
  freeSendOptions: string[];
}

const severityEmojis = {
  critical: "🚨",
  high: "⚠️",
  medium: "💛",
  low: "💙",
  info: "💫",
};

const endingMessages = [
  "We're with you ❤️",
  "Stay safe 💕",
  "You're protected 🛡️",
  "We've got your back 💖",
  "Help is on the way ❤️",
];

export const generateThreatMessages = (details: ThreatDetails): GeneratedMessages => {
  const emoji = severityEmojis[details.severity];
  const ending = endingMessages[Math.floor(Math.random() * endingMessages.length)];
  const severityText = details.severity.toUpperCase();
  
  // SMS (under 160 chars)
  const locationText = details.location ? ` at ${details.location}` : "";
  const sms = `${details.userName} — ${emoji} ${severityText}: ${details.type}${locationText} (${details.time}). ${ending}`;
  
  // Push Notification
  const pushTitle = details.severity === "critical" || details.severity === "high" 
    ? `🚨 Urgent: Security Alert`
    : `${emoji} Security Notice`;
  
  const pushBody = `${details.type} detected${locationText}. Stay safe, ${details.userName} ❤️`;
  
  // WhatsApp (warm and detailed)
  const actionText = details.action 
    ? ` ${details.action}.` 
    : " Please stay alert and follow safety protocols.";
  
  const whatsapp = `Hi ${details.userName} 🌼 — we noticed a ${details.type.toLowerCase()}${locationText} at ${details.time}.${actionText} Stay calm, you're safe with us. ${ending}`;
  
  // Free send options
  const freeSendOptions = [
    "Use your carrier's email-to-SMS gateway (e.g., phonenumber@carrier.com) to send via email.",
    "Send manually via WhatsApp Web or Telegram by copying the message and pasting to your contact."
  ];
  
  return {
    sms: sms.substring(0, 160), // Ensure SMS is under 160 chars
    pushTitle,
    pushBody,
    whatsapp,
    freeSendOptions,
  };
};
