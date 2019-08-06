#! /usr/bin/env node

const requirejs = require('requirejs');
const fs = require('fs');
const path = require('path');
const async = require("async");
const _ = require("underscore");
Q = require('q');
const pluralize = require('pluralize');
const appDir = path.dirname(require.main.filename);

const capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const uncapitalize = function (string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const simplePluralize = function (string) {
  return pluralize(string);
};

let models = {};
let directory;
let mainDirectory;

let string = `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Ember ERD</title>
    <meta name='description' content=''>
    <meta name='viewport' content='width=device-width', initial-scale='1'>
    <style>
      body,
      html {
        width: 100%;
        height: 100%;
      }

      .models {
        /*display: flex;
        flex-direction: row;
        overflow-x: scroll;
        flex-wrap: wrap;*/
        display: block;

      }

      .model {
        display: inline-block;
        border: 1px solid black;
        width: 400px;
        // height: 200px;
        margin: 20px;
        /*display: flex;*/
        align-items: center;
        justify-content: center;
        z-index: 100;
      }

      .model .name,
      .model .attrs,
      .model .relations {        
        width: 30%;
        display: inline-block;
        padding: 2px;
        z-index: 100;
        height: 100%;
      }

      .model .attrs {
        border-left: 1px solid black;
        border-right: 1px solid black;
        min-height: 150px;
      }

      .model .name {        
        font-weight: 900;
      }

      .model .attrs .attr-val {
        color: lightgrey;
        display: inline-block;
      }

      .arrow {
        position: absolute;
        background: black;
        width: 40px;
        height: 3px;
        transform-origin: 0% 50%;
        transition: all 100ms cubic-bezier(.8,.5,1,.8);
        /*border-radius: 50%/100px 100px 0 0;*/
        /*background-image: url("http://www.iconsdb.com/icons/preview/black/arrow-18-xxl.png");
        background-size: cover;
        background-position: center;*/
        z-index: -1000;
      }

      .arrow:after {
        display: block;
        content:'';
        border-top: 7px solid transparent;
        border-bottom: 8px solid transparent;
        border-left: 20px solid red;
        transform: translate(40px, -5px);  
      }

      .row {        
        text-align: center;
      }

      .row.offset .model {
        width: 400px;
      }
    </style>
  </head>
  <body>
    <h1> Ember ERD Model Visualizer</h1>
    <div class="models">
`;

function addStringScript() {
return `                      
  </div>
  <script>
    function angle(p1,p2) { 
      let dx=p2.x-p1.x,
          dy=p2.y-p1.y,
          c=Math.sqrt(dx*dx+dy*dy),
          deg;
      deg=(c>0) ? Math.asin(dy/c)/(Math.PI/180) : 0;
      deg=(dx>0) ? deg : 180-deg;  
      return (deg).toFixed(2); 
    }

    function pythagoras(point1, point2) {
      return (Math.sqrt(Math.pow(Math.abs(point1.x-point2.x), 2) + Math.pow(Math.abs(point1.y-point2.y), 2)))
    }

    init = function() {
      let arrows = document.getElementsByClassName('arrow');

      for (let i = 0; i < arrows.length; i++) {
        (function() {
          arrows[i].remove();
        })()
      }
      
      let models = document.getElementsByClassName('model');
      let belongsTo, hasMany, modelName;
      for (let i =0; i < models.length; i++) {
        belongsTo = models[i].dataset.belongsto;
        hasMany = models[i].dataset.hasmany;
        modelName = models[i].dataset.model;
        let divFrom = models[i];

        if (hasMany.length !== 0) {
          // name is pluralized so remove s to search
          let rels = hasMany.split(" ");
          for (let j = 0; j <  rels.length; j++) {

            let toName = rels[j].slice(0, -1);
            let divTo = document.querySelectorAll("[data-model='"+toName+"']")[0];

            let divFromCoords = divFrom.getBoundingClientRect();
            let divToCoords = divTo.getBoundingClientRect();
            let divFromCenter = {
              "x": divFromCoords.left + divFromCoords.width/2,
              "y": divFromCoords.top + divFromCoords.height/2,
            };

            let divToCenter = {
              "x": divToCoords.left + divToCoords.width/2,
              "y": divToCoords.top + divToCoords.height/2,
            };

            // need to figure out where to put arrow,
            // if the model from is above model to, then we aim for top of container
            // if model from is below to (via top in coords), aim for the bottom of the model container
            let newArrow = document.createElement("div"); 
            newArrow.className += "arrow";
            newArrow.className += " " + modelName + "_to_" + toName;
            newArrow.style.top = divFromCenter.y + "px";
            newArrow.style.left = (divFromCenter.x) + "px";
            // newArrow.style.bottom = divFromCoords.bottom + "px"
            // newArrow.style.right = divFromCoords.right + "px";

            let deg = angle({"x": divFromCenter.x,
                           "y": divFromCenter.y
                          }, 
                        {"x": divToCenter.x, 
                         "y": divToCenter.y
                        });
            
            let distanceForArrow = pythagoras(divFromCenter, divToCenter) + "px";
            
            let prefixTransform = "transform";


            newArrow.style[prefixTransform]="rotate(" + deg + "deg)";
            newArrow.style.width = distanceForArrow;
            
            document.body.appendChild(newArrow);

            if (divFromCoords.top > divToCoords.top) {
              // arrow needs to point down
              
            } else {
              // arrow needs to point up
            }                              
          }
        }
        
      }
      
    };

    window.onresize = init;

    init()
  </script>
  </body></html>`
}

function formatNonData(data, regex) {
  // console.log("DATA CONSOLING HERE", data);
  // console.log("RETURNING, ", data.slice(-1)[0].split("'")[1].replace(/[\(\);']/g, ''))
  return data.slice(-1)[0].split("'")[1].replace(/[\(\);']/g, '');
}

function addToModels(data, model) {
  data = data.trim().replace(",", '');

  if (/attr/.test(data) && !/import/.test(data) && !/delete/.test(data)) {
    models[model]["attributes"].push(data);
  } else if ((/hasMany/.test(data) || /belongsTo/.test(data)) && !/import/.test(data)) {
    let formattedData = data.trim().split(":")[0];
    let returnedStrung;

    if (/return/.test(data)) {
      if (/hasMany/.test(formattedData)) {
        returnedStrung = formatNonData(formattedData.split(/hasMany/), /hasMany/);
        // console.log("RETURNED OVER HERE FOR SOME REASION", returnedStrung);
      } else if (/belongsToMany/) {
        returnedStrung = formatNonData(formattedData.split(/belongsToMany/), /belongsToMany/)
      } else {
        returnedStrung = formatNonData(formattedData.split(/belongsTo/), /belongsTo/)
      }

      if (/return/.test(returnedStrung)) {
        returnedStrung = returnedStrung.substring(returnedStrung.lastIndexOf("'") + 1, returnedStrung.lastIndexOf("'"));
      }
    }

    let inputModelData = uncapitalize(returnedStrung || formattedData);

    if (/hasMany/.test(data) || /belongsToMany/.test(data)) {
      inputModelData = simplePluralize(inputModelData);
      models[model]["relationships"]["hasMany"].push(inputModelData);
    } else {
      models[model]["relationships"]["belongsTo"].push(inputModelData);
    }
  }
}

function orderKeysBasedOnRelationships(keys) {
  let modelArray = [];
  for (let i = 0; i < keys.length; i++) {
    const numRelationships = [models[keys[i]].relationships.hasMany.length, keys[i]]

    modelArray.push(numRelationships)
  }

  let newKeys = _.sortBy(modelArray, function(key) { return key[0] })

  return newKeys.reverse();
}

function readLines(data, addToModels, model) {
  let remaining = "";

  remaining += data;
  let index = remaining.indexOf('\n');
  let last = 0;
  while (index > -1) {
    let line = remaining.substring(last, index);
    last = index + 1;
    addToModels(line, model);
    index = remaining.indexOf('\n', last);
  }

  remaining = remaining.substring(last);

  if (remaining.length > 0) {
    addToModels(remaining, model);
  }
}

function readLinesFromFile(keys, j, model, newRow) {
  let key = keys[j][1];
  let numRelationships = keys[j][0];
  let modelString = '';

  let attributes;
  if (models[key]["attributes"] !== undefined) {
    try {
      attributes = _.map(models[key]["attributes"], function (item) {
        return " " + item.trim().split(":")[0] + " <span class='attr-val'>" + item.trim().split(":")[1].trim().replace(/[\(\)']/, "").split('attr')[1].replace('\'', '') + "</span><br />"
      })
    } catch (error) {
      // this is problematic, because in ghost's file the attrs are not determined via
      attributes = []
    }
  } else {
    attributes = models[key]["attributes"]
  }

  let relationships = models[key]["relationships"];


  if (newRow && j !== 0) {
    // need to close old new row
    modelString += `</div><div class='row ${j % 2 === 0 ? 'offset' : ''}'>`
  } else if (newRow && j === 0) {
    modelString += `<div class='row'>`
  }

  modelString += `<div class="model" data-model="${[key]}" 
                                     data-belongsTo="${relationships["belongsTo"].join(" ")}" 
                                     data-hasMany="${relationships["hasMany"].join(" ")}">
                  <div class="name">
                    ${[key]}
                  </div>
                  <div class="attrs">
                    ${attributes.join(" ")}
                  </div>
                  <div class="relations">
                    belongsTo: ${relationships["belongsTo"].join(", ")}
                    <br />
                    hasMany: ${relationships["hasMany"].join(", ")}
                  </div>
                </div>`;

  string += modelString;
}

function readAll(options, mainDirectory, callback) {
  // console.log("RUNNING WITH DIRECTORY", directory);
  fs.readdir(path.join(mainDirectory, directory), function (err, data) {
    if (err) {
      // console.log(err);
      return "ERROR. No such directory";
    }

    // console.log("FOUND DIRECTORY", directory);
    // console.log(data);

    for (let i = 0; i < data.length; i++) {
      if (/\.js/.test(data[i])) {
        // console.log("good file at", data[i]);
        (function() {
          let model = data[i].split(".")[0].split("-");
          let file = directory + data[i];

          if (model.length >= 2) {
            model = model[0] + capitalize(model[1]);
          } else {
            model = model[0];
          }

          models[model] = {
                          "attributes": [],
                          "relationships": {"belongsTo": [], "hasMany": []}
                        };

          // console.log('Looking for', file);
          // console.log(path.join(process.cwd(), file));

          fs.readFile(path.join(process.cwd(), file), "utf-8", function (err, fileData) {
            // console.log("FOUND FILE", file);
            if (err) {
              console.log(err);
              return "ERROR. No such file " + (file);
            }

            // console.log("FOUND FILE below", file);
            readLines(fileData, addToModels, model);

            if (data[data.length - 1].split(".")[0] === model) {
              let keys = _.keys(models);

              let modelString = '';

              keys = orderKeysBasedOnRelationships(keys);
              let startKey = 0;

              for (let j = 0; j < keys.length; j++) {
                let num = keys[j][0];
                readLinesFromFile(keys, j, model, startKey !== num);
                startKey = num;
              }

              string += addStringScript();

              fs.writeFile(path.join(process.cwd(), 'index.html'), string, function(err) {
                if (err) {
                    return console.log(err);
                }
                // console.log(models);
                // console.log("The file was saved!");
                callback(null, models);
              });
            }
          })
        })();
      }
    }
  });
}

function start(options, callback) {
  directory = options || 'app/models/';

  // console.log("SEARCHING IN", directory);
  if (options !== undefined) {
    mainDirectory = '';
  } else {
    mainDirectory = process.cwd();
  }
  readAll(options, mainDirectory, function(err, modelsPassed) {
    if (err) {
      return err;
    }

    // console.log("Returned models", modelsPassed);
    return modelsPassed;
    // callback(err, data);
  });
}

start();

module.exports = start;
