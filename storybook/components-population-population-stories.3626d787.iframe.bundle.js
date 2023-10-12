"use strict";(self.webpackChunkcapitalens=self.webpackChunkcapitalens||[]).push([[538],{"./node_modules/@babel/runtime/helpers/esm/defineProperty.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function _typeof(o){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o},_typeof(o)}function _toPropertyKey(arg){var key=function _toPrimitive(input,hint){if("object"!==_typeof(input)||null===input)return input;var prim=input[Symbol.toPrimitive];if(void 0!==prim){var res=prim.call(input,hint||"default");if("object"!==_typeof(res))return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===hint?String:Number)(input)}(arg,"string");return"symbol"===_typeof(key)?key:String(key)}function _defineProperty(obj,key,value){return(key=_toPropertyKey(key))in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}__webpack_require__.d(__webpack_exports__,{Z:()=>_defineProperty})},"./src/components/population/population.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,default:()=>__WEBPACK_DEFAULT_EXPORT__});var _Basic$parameters,_Basic$parameters2,_home_runner_work_capitalens_capitalens_frontend_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js");function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){(0,_home_runner_work_capitalens_capitalens_frontend_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var meta={component:__webpack_require__("./src/components/population/population.tsx").Z,parameters:{layout:"fullscreen"}},Basic={args:{countries:[{name:"Japan",code:"JP",emoji:"🇯🇵",image:"https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JP.svg",unicode:"U+1F1EF U+1F1F5"}],transformedData:[{country_id:"JP",country_value:"Japan",date:"2022",indicator_id:"SP.POP.TOTL",indicator_value:"Population, total",value:125124989}]}};const __WEBPACK_DEFAULT_EXPORT__=meta;Basic.parameters=_objectSpread(_objectSpread({},Basic.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Basic$parameters=Basic.parameters)||void 0===_Basic$parameters?void 0:_Basic$parameters.docs),{},{source:_objectSpread({originalSource:'{\n  args: {\n    countries: [{\n      name: "Japan",\n      code: "JP",\n      emoji: "🇯🇵",\n      image: "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/JP.svg",\n      unicode: "U+1F1EF U+1F1F5"\n    }],\n    transformedData: [{\n      country_id: "JP",\n      country_value: "Japan",\n      date: "2022",\n      indicator_id: "SP.POP.TOTL",\n      indicator_value: "Population, total",\n      value: 125124989\n    }]\n  }\n}'},null===(_Basic$parameters2=Basic.parameters)||void 0===_Basic$parameters2||null===(_Basic$parameters2=_Basic$parameters2.docs)||void 0===_Basic$parameters2?void 0:_Basic$parameters2.source)})})},"./src/components/population/population.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>Population});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),recharts__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/recharts/es6/component/ResponsiveContainer.js"),recharts__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/recharts/es6/chart/LineChart.js"),recharts__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/recharts/es6/cartesian/CartesianGrid.js"),recharts__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/recharts/es6/cartesian/XAxis.js"),recharts__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/recharts/es6/cartesian/YAxis.js"),recharts__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/recharts/es6/component/Tooltip.js"),recharts__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/recharts/es6/cartesian/Line.js"),console=__webpack_require__("./node_modules/console-browserify/index.js"),__jsx=react__WEBPACK_IMPORTED_MODULE_0__.createElement;function formatJapaneseNumber(num){return num>=1e8?(num/1e8).toFixed(1)+"億":num>=1e4?(num/1e4).toFixed(1)+"万":num.toString()}function CustomTooltip(_ref){var active=_ref.active,label=_ref.label,payload=_ref.payload;return active&&payload&&payload.length?__jsx("div",{className:"custom-tooltip border bg-white p-3"},__jsx("p",{className:"label"},label),__jsx("p",{className:"desc"},"人口: ",formatJapaneseNumber(payload[0].value))):null}function Population(_ref2){var _findCountryByCode,_findCountryByCode2,countries=_ref2.countries,transformedData=_ref2.transformedData;function findCountryByCode(code){return countries.find((function(country){return country.code===code}))}return console.log(transformedData),__jsx("div",{className:"w-full rounded border px-3 py-4"},__jsx("h3",{className:"mb-5 text-lg font-medium text-gray-800"},null===(_findCountryByCode=findCountryByCode(transformedData[0].country_id))||void 0===_findCountryByCode?void 0:_findCountryByCode.emoji," ",null===(_findCountryByCode2=findCountryByCode(transformedData[0].country_id))||void 0===_findCountryByCode2?void 0:_findCountryByCode2.name,"の人口推移"),__jsx(recharts__WEBPACK_IMPORTED_MODULE_1__.h,{width:"100%",height:300},__jsx(recharts__WEBPACK_IMPORTED_MODULE_2__.w,{data:transformedData,margin:{bottom:5,left:20,right:30,top:5}},__jsx(recharts__WEBPACK_IMPORTED_MODULE_3__.q,{strokeDasharray:"3 3"}),__jsx(recharts__WEBPACK_IMPORTED_MODULE_4__.K,{dataKey:"date"}),__jsx(recharts__WEBPACK_IMPORTED_MODULE_5__.B,{tickFormatter:formatJapaneseNumber}),__jsx(recharts__WEBPACK_IMPORTED_MODULE_6__.u,{content:__jsx(CustomTooltip,null)}),__jsx(recharts__WEBPACK_IMPORTED_MODULE_7__.x,{type:"monotone",dataKey:"value",stroke:"#8884d8",activeDot:{r:8}}))),__jsx("span",{className:"text-sm text-gray-500"},"ソース:"," ",__jsx("a",{href:"https://www.worldbank.org/en/home",className:"text-primary"},"世界銀行")))}Population.displayName="Population",Population.__docgenInfo={description:"",methods:[],displayName:"Population",props:{countries:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:"{\n  name: string;\n  code: string;\n  emoji: string;\n  image: string;\n  unicode: string;\n}",signature:{properties:[{key:"name",value:{name:"string",required:!0}},{key:"code",value:{name:"string",required:!0}},{key:"emoji",value:{name:"string",required:!0}},{key:"image",value:{name:"string",required:!0}},{key:"unicode",value:{name:"string",required:!0}}]}}],raw:"Country[]"},description:""},transformedData:{required:!0,tsType:{name:"any"},description:""}}};try{population.displayName="population",population.__docgenInfo={description:"",displayName:"population",props:{countries:{defaultValue:null,description:"",name:"countries",required:!0,type:{name:"Country[]"}},transformedData:{defaultValue:null,description:"",name:"transformedData",required:!0,type:{name:"any"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/population/population.tsx#population"]={docgenInfo:population.__docgenInfo,name:"population",path:"src/components/population/population.tsx#population"})}catch(__react_docgen_typescript_loader_error){}}}]);