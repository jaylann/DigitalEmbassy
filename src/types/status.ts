
/**
 * Defines the possible operational statuses for the system.
 * - `Online`: System is active and functioning normally.
 * - `Offline`: System is not connected or is inactive.
 * - `Crisis`: An urgent, critical event is in progress.
 * - `Transmitting`: Actively sending or receiving data.
 */
export type SystemStatus = "Online" | "Offline" | "Crisis" | "Transmitting";