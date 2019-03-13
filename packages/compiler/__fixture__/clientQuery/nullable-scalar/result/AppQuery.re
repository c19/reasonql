/* Generated by ReasonQL Compiler, PLEASE EDIT WITH CARE */

/* Original Query
query AppQuery {
  id
  name
  married
  age
  closeRate
}
*/
let query = {|query AppQuery{id
name
married
age
closeRate}|}

type queryResult = {
  id: option(string),
  name: option(string),
  married: option(bool),
  age: option(int),
  closeRate: option(float),
};

type variablesType = Js.Dict.t(Js.Json.t);
let encodeVariables: variablesType => Js.Json.t = vars => Js.Json.object_(vars);

[%%raw {|
var decodeQueryResult = function (res) {
  return [
    res.id,
    res.name,
    res.married,
    res.age,
    res.closeRate,
  ]
}
|}]

[@bs.val]external decodeQueryResultJs: Js.Json.t => queryResult = "decodeQueryResult";
let decodeQueryResult = decodeQueryResultJs;