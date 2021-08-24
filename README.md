# pg-explain
Simple module for posting query plan to [explain.tensor.ru](https://explain.tensor.ru) and getting URL of the page with plan analysis.

## Install

```
npm install node-pg-explain
```

## Usage
The module accepts json with parameters:

| name | type | description | mandatory |
|----------|:------:|----------|------|
|plan|string |plan in text / JSON / YAML format as a single line| required |
|name|string|the name of the plan in the archive| optional |
|private|boolean|plan is visible only in personal archive, default: false| optional |
|query|string|the text of the associated query| optional |
|params|string|$ n-parameters as a single line| optional |
|group|UUID(string)|group root plan ID| optional |
|parent|UUID(string)|parent plan ID| optional |

and returns Promise fulfilled with text of URL or rejected with error.

## Examples
See [example](/example)

*simple plan*
```js
const pgexplain = require('node-pg-explain');

const data = {
  "plan" : "Index Scan using pg_class_oid_index on pg_class\n  Index Cond: (oid = '1259'::oid)"
};

pgexplain(JSON.stringify(data)).then(console.log).catch(console.error);
```
https://explain.tensor.ru/archive/explain/d77e3bb025f0799da918597dd2d26900:0:2021-08-23


*named plan*

```json
{
"name" : "Plan-name",
"plan" : "Index Scan using pg_class_oid_index on pg_class\n  Index Cond: (oid = '1259'::oid)"
}
```
https://explain.tensor.ru/archive/explain/1a7c876320b891dbb4e9c4ae4fb05d33:0:2021-08-23

*associated query*
```json
{
"plan"  : "Index Scan using pg_class_oid_index on pg_class\n  Index Cond: (oid = '1259'::oid)",
"query" : "SELECT * FROM pg_class WHERE oid = 'pg_class'::regclass"
}
```
https://explain.tensor.ru/archive/explain/09157b4bcd3d71723c8cb4ad6ba15dfe:0:2021-08-23

*parameterized query*
```json
{
"plan"  : "Bitmap Heap Scan on pg_class  (cost=503.84..1720.79 rows=4781 width=265)\n  Recheck Cond: (relnamespace ='99'::oid)\n Filter: (relowner = '10'::oid)\n ->  Bitmap Index Scan on pg_class_relname_nsp_index (cost=0.00..502.64 rows=4781 width=0)\n Index Cond: (relnamespace = '99'::oid)",
"query" : "SELECT * FROM pg_class WHERE relnamespace = $1 and relowner = $2",
"params" : "$1=100,$2=10"
}
```
https://explain.tensor.ru/archive/explain/e3b09dc3fa0e8059d62d7aec9632aa0e:0:2021-08-23

*adding to the tree*

```json
{
"name"  : "Plan-name1",
"plan"  : "Index Scan using pg_class_oid_index on pg_class\n  Index Cond: (oid = '1259'::oid)",
"query" : "SELECT * FROM pg_class"
}
```
https://explain.tensor.ru/archive/explain/29ad1808994f5d0071985444e5cbc632:0:2021-08-23

```json
{
"name"  : "Plan-name2",
"plan"  : "Index Scan using pg_class_oid_index on pg_class\n  Index Cond: (oid = '1259'::oid)",
"query" : "SELECT * FROM pg_class",
"group" : "29ad1808994f5d0071985444e5cbc632",
"parent": "29ad1808994f5d0071985444e5cbc632"
}
```
https://explain.tensor.ru/archive/explain/f271de41cb66c2f295f7c2a5be76b264:0:2021-08-23

```json
{
"name"  : "Plan-name3",
"plan"  : "Index Scan using pg_class_oid_index on pg_class\n  Index Cond: (oid = '1259'::oid)",
"query" : "SELECT * FROM pg_class",
"group" : "29ad1808994f5d0071985444e5cbc632",
"parent": "f271de41cb66c2f295f7c2a5be76b264"
}
```
https://explain.tensor.ru/archive/explain/2d1f695a6ba4a07a66e4d86cce813b7c:0:2021-08-23
