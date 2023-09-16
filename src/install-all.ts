import {collectDepFiles} from "./utils";
import fs from "fs";
import {PkgJson} from "./interfaces";
import {execSync} from "child_process";

export const installAll = () => {
    const matchingProject = collectDepFiles('./src');
    const pkgs: PkgJson = {
        dependencies: {},
        devDependencies: {}
    }
    for(const projectPath of matchingProject) {
        const project: PkgJson = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));
        pkgs.devDependencies = {
            ...pkgs.devDependencies,
            ...project.devDependencies
        };
        pkgs.dependencies = {
            ...pkgs.dependencies,
            ...project.dependencies
        };
    }
    const originalPackageJson: PkgJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    const cpy = {...originalPackageJson};
    fs.writeFileSync('./_o.json', JSON.stringify(originalPackageJson, null, 2));
    cpy.dependencies = {
        ...cpy.dependencies,
        ...pkgs.dependencies,
    }
    cpy.devDependencies = {
        ...cpy.devDependencies,
        ...pkgs.devDependencies,
    }

    fs.writeFileSync('./package.json', JSON.stringify(cpy, null,2));
    execSync(`npm i`, {stdio: 'inherit'});
    fs.writeFileSync('./package.json', JSON.stringify(originalPackageJson, null,2));


}