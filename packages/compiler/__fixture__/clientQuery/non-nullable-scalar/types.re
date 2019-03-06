/* Generated by Reason Relay Compiler, PLEASE EDIT WITH CARE */

type queryResponse = {
  id: string,
  name: string,
  married: bool,
  age: int,
  closeRate: float,
};

type variablesType = Js.Dict.t(Js.Json.t);
let encodeVariables: variablesType => Js.Json.t = vars => Js.Json.object_(vars);

type schemaQueryResponse = SchemaTypes.queryResponse;
let decodeResponse = SchemaTypes.decodeQueryResponse;