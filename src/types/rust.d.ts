/** The 32-bit unsigned integer type. */
export type u32 = number;

/** The 64-bit unsigned integer type. */
export type u64 = number;

/** The 8-bit unsigned integer type. */
export type u8 = number;

/** The `Option` type. See the module level documentation for more. */
export type Option<T> = T | null;

/** A contiguous growable array type, written as Vec<T>, short for ‘vector’. */
export type Vec<T> = T[];

/**
 * A 64-bit floating point type (specifically, the “binary64” type defined in IEEE 754-2008).
 *
 * This type is very similar to f32, but has increased precision by using twice as many bits. Please see the documentation for f32 or Wikipedia on double precision values for more information.
 *
 * See also the std::f64::consts module.
 */
export type f64 = number;

/** The 64-bit signed integer type. */
export type i64 = number;
