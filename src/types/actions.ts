/**
 * Standard return shape for all Server Actions.
 * NEVER throw from a Server Action — always return ActionResult.
 *
 * Usage:
 *   const result = await someAction(data)
 *   if (result.success) { toast.success(...) }
 *   else { toast.error(result.error) }
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; field?: string };
