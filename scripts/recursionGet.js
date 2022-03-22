const templateJson = {
  "x-component": "aa",
  "asdf": "rf3f33fe",
  "bb": {
    "x-component": "cc"
  },
  "dasfa": [
    {
      "asdfd": "dadasds"
    },
    {
      "ggr": {
        "x-component": "dd"
      },
      "x-component": "ee"
    }
  ]
}

const isObject = jsonData => Object.prototype.toString.call(jsonData) === '[object Object]';
const isArray = jsonData => Object.prototype.toString.call(jsonData) === '[object Array]';

const list = [];

const recursionGet = (json) => {
  if (!isObject(json)){
    return;
  }

  Object.keys(json).forEach(i => {
    if (isObject(json[i])) {
      recursionGet(json[i]);
      return;
    }
    if (isArray(json[i])) {
      json[i].forEach(j => recursionGet(j))
      return;
    }
    if (i === 'x-component') {
      list.push(json[i]);
    }
  })
}

recursionGet(templateJson);

console.log(list, '222')