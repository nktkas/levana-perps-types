import { Ajv } from "npm:ajv@^8.17.1";
import type { Definition } from "npm:ts-json-schema-generator@^2.3.0";
import { assert } from "jsr:@std/assert@^1.0.2";

const ajv = new Ajv({ strict: true });

/**
 * Asserts that the data matches the JSON schema
 * @param schema - A JSON schema definition
 * @param data - Data to validate
 */
export function assertJsonSchema(schema: Definition, data: unknown) {
    const validate = ajv.compile(schema);
    assert(validate(data), JSON.stringify(validate.errors));
}
