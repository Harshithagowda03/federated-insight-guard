/**
 * FedSecure AI - Python Backend Hook
 * 
 * Legacy hook for backward compatibility.
 * New code should use useBackendConnection from './useBackendConnection'
 * 
 * @deprecated Use useBackendConnection instead
 */

export { usePythonBackend } from './useBackendConnection';
export type { BackendConnectionState } from './useBackendConnection';

// Re-export the main hook for modules still using this file
import { usePythonBackend as _usePythonBackend } from './useBackendConnection';
export default _usePythonBackend;
