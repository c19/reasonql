const {
  generateFullQueryCode,
} = require('../fragment')

const {
  lowerTheFirstCharacter,
  getValidTypeName,
  commentOnTop,
} = require('./util')

function generateReasonCode(node, typeInfo, argsTypeInfo) {
  return `
${commentOnTop()}

let query = {|
${generateFullQueryCode(node)}
|}

${generateTypeCode(typeInfo)}

${generateVariablesEncoder(argsTypeInfo)}

[@bs.module "./AppQuery.codec"]external decodeQueryResult: Js.Json.t => queryResult = "decodeQueryResult";
`.trim();
}

function generateTypeCode(typeInfo) {
  return typeInfo.list.map(type => {
    let name = getValidTypeName(typeInfo, type.name);
    
    return (type.abstract ? `[@bs.deriving abstract]\n` : ``)
+ `type ${lowerTheFirstCharacter(name)} = {
${
  type.fields.map(field => {
    return `  ${field.name}: ${wrapTypeName(typeInfo, field)},`
  }).join('\n')
}
};
`.trim();
  }).join('\n\n');
}

function wrapTypeName(typeInfo, field) {
  let typeName = getValidTypeName(typeInfo, field.type);

  typeName = field.contentOption
    ? `option(${typeName})`
    : typeName;
  
  typeName = field.array
    ? `array(${typeName})`
    : typeName;

  return field.option? `option(${typeName})` : typeName;
}

function generateVariablesEncoder(argsTypeInfo) {
  if(argsTypeInfo.list.length > 0) {
    let variableArgs = generateVariablesArgs(argsTypeInfo.map['variablesType'].fields);
    return `
${generateTypeCode(argsTypeInfo)}

let encodeVariables: variablesType => queryVars = (vars) => queryVars(${variableArgs});
`.trim();
  } else {
    return `
type variablesType = Js.Dict.t(Js.Json.t);
let encodeVariables: variablesType => Js.Json.t = vars => Js.Json.object_(vars);
`.trim();
  }
}

function generateVariablesArgs(fields) {
  return fields.map(field => `~${field.name}=vars.${field.name}`).join(',')
}

exports.generateReasonCode = generateReasonCode;