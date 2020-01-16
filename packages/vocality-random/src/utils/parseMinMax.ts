import { API_MAX_VALUE } from '../randomApis/RandomDotOrg';

/**
 * This function takes an input string and returns a min and max tuple, but is not
 * responsibe for validating the result (see last example). Returns undefined if
 * could not parse into anything.
 *
 * @example
 * //input  -> [min, max]
 * ""       -> [0, 100]             // numbers from 0 to 100
 * "100"    -> [0, 100]
 * "1-5"    -> [1, 5]               // range: numbers from 1 to 5
 *  "-4--2" -> [-4, -2]             // range: numbers from -4 to -2
 * "<20,5>" -> [15,25]              // rangeBuilder: numbers within a range of 5 from 20 (second value must be positive)
 *
 * // (10e9 is the max for random dot org), (we include the boundary value 500)
 * "<500"   -> [-1000000000, 500]   // upperBoundary: number under 500
 * "<-500"  -> [-1000000000, -500]  // upperBoundary: numbers under -500
 * ">500"   -> [500, 1000000000]    // lowerBoundary: numbers above 500
 * ">-500"  -> [-500, 1000000000]   // lowerBoundary: numbers above -500
 *
 * // this function only parses a string to a min and max tuple of numbers
 * "10-5"   -> [10, 5]              //! numbers from 10 to 5, which is wrong but correctly parsed
 */
export function parseMinMax(minMax: string): [number, number] | undefined {
  if (!minMax) {
    return [0, 100];
  }

  if (!isNaN(parseInt(minMax, 10))) {
    return [0, parseInt(minMax, 10)];
  }

  if (REGEX.range.test(minMax)) {
    const splitted = minMax.split('-');
    const result: number[] = [];

    for (let index = 0; index < splitted.length; index++) {
      if (splitted[index] === '') {
        result.push(-1 * parseInt(splitted[index + 1]));
        index++;
      } else {
        result.push(parseInt(splitted[index]));
      }
    }

    return [result[0], result[1]];
  }

  if (REGEX.rangeBuilder.test(minMax)) {
    const result = minMax
      .split(',')
      .map(s => s.replace(/<|>/, ''))
      .map(s => parseInt(s));

    return [result[0] - result[1], result[0] + result[1]];
  }

  if (REGEX.lowerBoundary.test(minMax)) {
    const result = parseInt(minMax.replace('>', ''));

    return [result, API_MAX_VALUE];
  }

  if (REGEX.upperBoundary.test(minMax)) {
    const result = parseInt(minMax.replace('<', ''));

    return [result, -1 * API_MAX_VALUE];
  }

  return undefined;
}

const REGEX = {
  range: /-?\d+--?\d+/,
  rangeBuilder: /<-?\d+,\d+>/,
  lowerBoundary: />-?\d+/,
  upperBoundary: /<-?\d+/,
};
