const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = path.join(dir, file);
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else if (name.endsWith('.js') || name.endsWith('.jsx')) {
            files.push(name);
        }
    }
    return files;
}

const files = getFiles(path.join(process.cwd(), 'src'));
let allCss = '';

const regex = /\s*<style jsx>\{\`([\s\S]*?)\`\}<\/style>\s*/g;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let match;
    let fileModified = false;

    while ((match = regex.exec(content)) !== null) {
        allCss += `\n/* Styles from ${path.basename(file)} */\n` + match[1];
        fileModified = true;
    }

    if (fileModified) {
        content = content.replace(regex, '');
        fs.writeFileSync(file, content, 'utf8');
        console.log('Processed', file);
    }
}

if (allCss) {
    fs.appendFileSync(path.join(process.cwd(), 'src', 'app', 'globals.css'), allCss, 'utf8');
    console.log('Appended CSS to globals.css');
}
