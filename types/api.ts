export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue | undefined };

export interface RequestOptions {
  method?: HttpMethod;
  body?: JsonValue;
  headers?: Record<string, string>;
}
