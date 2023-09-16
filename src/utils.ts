import fs from "fs";

export const collectDepFiles = (root: string, list: any[] = []) => {
    fs.readdirSync(root).forEach(f => {
        if (fs.statSync(`${root}/${f}`)?.isDirectory()) {
            list = collectDepFiles(`${root}/${f}`, list);
        } else {
            if (f.includes('deps.json')) {
                list.push(`${root}/${f}`);
            }
        }
    })

    return list;
}
