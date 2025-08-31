import { useEffect, useState } from "react";
export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    // Currently mocked: this hook is a placeholder for real WebSocket integration
    setConnected(false);
  }, []);
  return { connected };
}
