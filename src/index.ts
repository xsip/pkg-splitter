import {installAll} from "./install-all";
import yargs from "yargs";
import {installToProject} from "./install-to-project";

// installToProject(['express', '@types/express'], 'project1');

// installAll();

const options = yargs.usage('Usage dnpm')
    .option('i', {requiresArg: false, alias: 'Install', describe: 'List packages to install to project',type: 'string'})
    .option('a', {requiresArg: false , alias: 'Install All', describe: 'Install from all projects',type: 'string'})
    .option('p', {alias: 'Project', describe: 'Select project to install to',type: 'string'})
    .option('d', {alias: 'Dependencies', describe: 'Dependnecies to install',type: 'string'})
    .argv;

(async() => {
    const _options = await options;
    console.log(_options);
    if(_options.i === '') {
        installToProject(_options.d.split(','), _options.p);
    } else if(_options.ia === '') {
        installAll();
    }
})()



