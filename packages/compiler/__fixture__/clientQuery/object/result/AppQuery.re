/* Generated by ReasonQL Compiler, PLEASE EDIT WITH CARE */

/* Original Query
query AppQuery($j: Int!, $ss: String) {
  i
  a(j:$j) {
    id
    ii
    b {
      id
      iii
    }
    ff
  }
  s
  c(ss:$ss) {
    id
    ss
  }
}
*/
let query = {|query AppQuery($j:Int!,$ss:String){i
a(j:$j){id
ii
b{id
iii}ff}s
c(ss:$ss){id
ss}}|}

type b = {
  id: string,
  iii: option(int),
};

type a = {
  id: string,
  ii: option(int),
  b: b,
  ff: float,
};

type c = {
  id: string,
  ss: option(string),
};

type queryResult = {
  i: int,
  a: option(a),
  s: option(string),
  c: c,
};

type variablesType = {
  j: int,
  ss: option(string),
};

[%%raw {|
var encodeVariables = function (v) {
  return {
    j: v[0],
    ss: v[1],
  }
}
|}]

[@bs.val]external encodeVariablesJs: variablesType => Js.Json.t = "encodeVariables";
let encodeVariables = encodeVariablesJs;

[%%raw {|
var decodeB = function (res) {
  return [
    res.id,
    res.iii,
  ]
}

var decodeA = function (res) {
  return [
    res.id,
    res.ii,
    decodeB(res.b),
    res.ff,
  ]
}

var decodeC = function (res) {
  return [
    res.id,
    res.ss,
  ]
}

var decodeQueryResult = function (res) {
  return [
    res.i,
    res.a ? decodeA(res.a) : undefined,
    res.s,
    decodeC(res.c),
  ]
}
|}]

[@bs.val]external decodeQueryResultJs: Js.Json.t => queryResult = "decodeQueryResult";
let decodeQueryResult = decodeQueryResultJs;