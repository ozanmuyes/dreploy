'use strict';

const fs = require('fs');
const path = require('path');

const { CONFIG_FILENAME } = require('./constants');

/** @param {import('../../typings/dreploy').ProjectInfo} projectInfo */
function getProjectConfig(projectInfo) {
  const projectConfigFilepath = path.join(projectInfo.root, CONFIG_FILENAME);

  if (!fs.existsSync(projectConfigFilepath)) {
    return null;
  }

  const contents = fs.readFileSync(projectConfigFilepath);
  let projectConfig;
  try {
    projectConfig = JSON.parse(contents);
  } catch (error) {
    // couldn't read the file
    // TODO MAYBE show warning
    return null;
  }

  return projectConfig;
}

module.exports = getProjectConfig;
