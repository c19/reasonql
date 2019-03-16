function generateReasonCode(node) {
  let {typeList, args} = node;
  return node.isFragment
    ? generateFragment(typeList)
    : generateQueryCode(node, typeList, args)
}

function generateFragment(typeList) {
  return `
${commentOnTop()}

${generateTypeCode(typeList)}
`.trim();
}

function generateQueryCode(node, typeList, args) {
  return `
${commentOnTop()}

/* Original Query
${node.code}
*/
let query = {|${cleanCode(node.code)}|}

${generateTypeCode(typeList)}

${generateVariablesEncoder(args)}

[%%raw {|
${node.codec}
|}]

[@bs.val]external decodeQueryResultJs: Js.Json.t => queryResult = "decodeQueryResult";
let decodeQueryResult = decodeQueryResultJs;
`.trim();
}

function commentOnTop() {
  return '/* Generated by ReasonQL Compiler, PLEASE EDIT WITH CARE */'
}

function cleanCode(code) {
  let result = code;
  
  // 1. Remove directives
  let directives = [
    'singular',
    'reasontype',
  ]
  let re = new RegExp(`@(${directives.join('|')})\\(.+\\)`, 'g');
  result = result.replace(re, '');

  // 2. Normalize newline
  result = result.replace(/\r\n?/g, '\n');

  // 3. Trim lines
  let lines = result.split('\n');
  result = 
    lines.map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
  
  // 4. Remove unnecessary spaces around delimiters({}:,)
  result = result.replace(/\s*({|}|:|,)\s*/g, '$1');
  
  // 5. Shorten fragment names into F0, F1, F2, and so on. 
  let fre = /\.\.\.([A-Za-z0-9_]+)/g;

  let fragments = []
  let m;
  do {
    m = fre.exec(result);
    if (m) {
      fragments.push(m[1]);
    }
  }while(m);

  result = fragments.reduce((result, fragment, i) => {
    return result.replace(new RegExp(`${fragment}`, 'g'), `F${i}`)
  }, result);
  
  return result;
}

function generateTypeCode(typeList) {
  return typeList.map(type => {    
    return (type.abstract ? `[@bs.deriving abstract]\n` : ``)
+ `type ${type.typeName} = {
${
  type.fields.map(field => {
    return `  ${field.name}: ${wrapTypeName(field)},`
  }).join('\n')
}
};
`.trim();
  }).join('\n\n');
}

function wrapTypeName(field) {
  let typeName = field.typeName;

  typeName = field.contentOption
    ? `option(${typeName})`
    : typeName;
  
  typeName = field.array
    ? `array(${typeName})`
    : typeName;

  return field.option? `option(${typeName})` : typeName;
}

function generateVariablesEncoder(args) {
  if(args.length > 0) {
    let variableArgs = generateVariablesArgs(args[0].fields);
    return `
${generateTypeCode(args)}

let encodeVariables: variablesType => queryVars = (vars) => queryVars(${variableArgs});
`.trim();
  } else {
    return `
type variablesType = Js.Dict.t(Js.Json.t);

[%%raw {|
var encodeVariables = function (v) {
  return {}
}
|}]

[@bs.val]external encodeVariablesJs: variablesType => Js.Json.t = "encodeVariables";
let encodeVariables = encodeVariablesJs;
`.trim();
  }
}

function generateVariablesArgs(fields) {
  return fields.map(field => `~${field.name}=vars.${field.name}`).join(',')
}

exports.generateReasonCode = generateReasonCode;