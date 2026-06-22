import assert from "node:assert";
import { parseReadme } from "./content.ts";

// single line
let f = parseReadme("name | Foo");
assert.equal(f.name, "Foo");

// multi-line value continues until next "key |" line
f = parseReadme("name | Foo\ndescription | line one\nline two\ngithub | http://x");
assert.equal(f.name, "Foo");
assert.equal(f.description, "line one\nline two");
assert.equal(f.github, "http://x");

// blank lines inside a value preserved; ends trimmed
f = parseReadme("description | a\n\nb\n");
assert.equal(f.description, "a\n\nb");

console.log("ok");
