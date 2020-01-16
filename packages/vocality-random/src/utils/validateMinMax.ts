import { API_MAX_VALUE } from '../randomApis/RandomDotOrg';

/**
 * Checks if a minMax tuple is valid.
 *
 * `min` must be smaller than `max` and both can't be greater than the
 * random.org max value
 */
export function validateMinMax(tuple: [number, number]): boolean {
  return tuple[0] < tuple[1] && tuple.every(n => Math.abs(n) <= API_MAX_VALUE);
}
