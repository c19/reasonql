/* Generated by ReasonQL Compiler, PLEASE EDIT WITH CARE */

/* Original Query
query AppQuery {
  posts @singular(name:"post") {
    ...PostSummary_post
  }
}
fragment PostSummary_post on Post {
  title
  slug
  summary
}
*/
let query = {|query AppQuery{posts{...F0}}fragment F0 on Post{title
slug
summary}|}

type post = {
  f_post: PostSummary.post,
};

type queryResult = {
  posts: array(post),
};

type variablesType = Js.Dict.t(Js.Json.t);
let encodeVariables: variablesType => Js.Json.t = vars => Js.Json.object_(vars);

[%%raw {|
var decodePost = function (res) {
  return [
    PostSummary_decodePost(res),
  ]
}

var decodeQueryResult = function (res) {
  return [
    decodePostArray(res.posts),
  ]
}

var decodePostArray = function (arr) {
  return arr.map(item =>
    item ? decodePost(item) : undefined
  )
}

var PostSummary_decodePost = function (res) {
  return [
    res.title,
    res.slug,
    res.summary,
  ]
}
|}]

[@bs.val]external decodeQueryResultJs: Js.Json.t => queryResult = "decodeQueryResult";
let decodeQueryResult = decodeQueryResultJs;