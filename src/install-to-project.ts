import {collectDepFiles} from "./utils";
import fs from "fs";
import {PkgJson} from "./interfaces";
import {execSync} from "child_process";

export const installToProject = (packages: string[], project: string) => {
    const matchingProject = collectDepFiles('./src')?.find((p: string) => p.includes(project));
    const projectDeps: PkgJson = JSON.parse(fs.readFileSync(matchingProject, 'utf-8'));
    let originalPackageJson: PkgJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    fs.writeFileSync('./_o.json', JSON.stringify(originalPackageJson, null, 2));
    execSync(`npm i --save ${packages.join(' ')}`, {stdio: 'inherit'});
    originalPackageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    for (const newPackage of packages) {
        const fixedPackageName = newPackage.split('@')[0];
        if (originalPackageJson.dependencies[fixedPackageName]) {
            projectDeps.dependencies[fixedPackageName] = originalPackageJson.dependencies[fixedPackageName];
            delete originalPackageJson.dependencies[fixedPackageName];
        } else if (originalPackageJson.devDependencies[fixedPackageName]) {
            projectDeps.devDependencies[fixedPackageName] = originalPackageJson.devDependencies[fixedPackageName];
            delete originalPackageJson.devDependencies[fixedPackageName];
        }
    }
    fs.writeFileSync('./package.json', JSON.stringify(originalPackageJson, null, 2), 'utf-8');
    fs.writeFileSync(matchingProject, JSON.stringify(projectDeps, null, 2), 'utf-8');
    fs.rmSync('./_o.json');
}