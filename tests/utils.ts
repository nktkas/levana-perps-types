import { assert } from "jsr:@std/assert@0.226.0";
import type { Ajv } from "npm:ajv@8.16.0";
import type { Definition as TSJDefinition } from "npm:ts-json-schema-generator@2.3.0";

export function assertTSJSchema(ajv: Ajv, schema: TSJDefinition, data: unknown) {
    const validate = ajv.compile(schema);
    assert(validate(data), JSON.stringify(validate.errors));
}
