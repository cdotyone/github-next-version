const { exec } = require('child_process');
const fs = require('fs');
const core = require('@actions/core');

let commit_message = core.getInput('message');
let version_file = core.getInput('version_file') || 'package.json';

const processMessage = function(message,tag) {
    let parts = tag.replace(/v/,'').trim().split('.');
    parts.length = 3;

    if (message.indexOf("fix:") > 0) {
        parts[2] = parseInt(parts[2]);
        parts[2]++;
    }
    if (message.indexOf("feat:") > 0) {
        parts[1] = parseInt(parts[1]);
        parts[1]++;
        parts[2] = 0;
    }
    if (message.indexOf("BREAKING") > 0) {
        parts[0] = parseInt(parts[0]);
        parts[0]++;
        parts[1] = '0';
        parts[2] = '0';
    }

    tag = parts.join('.');
    console.log('\x1b[32m%s\x1b[0m', `Next version: ${tag}`);
    console.log(`::set-output name=version::${tag}`);
};

exec('git rev-list --tags --max-count=1', (err, rev, stderr) => {
    if (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
        console.log('\x1b[31m%s\x1b[0m', stderr);
        console.log('::set-output name=version::v1.0.0');
        process.exit(0);
        return;
    }
    if(rev && rev.length>0) {
        console.log('git describe --tags ' + rev);
        exec(`git describe --tags ${rev}`, (err, tag, stderr) => {
            if (err) {
                console.log('\x1b[33m%s\x1b[0m', 'Could not find any tags because: ');
                console.log('\x1b[31m%s\x1b[0m', stderr);
                console.log('::set-output name=version::v1.0.0');
                process.exit(0);
                return;
            }

            tag = tag.trim();
            console.log('\x1b[32m%s\x1b[0m', `Found tag: ${tag}`);
            console.log(`::set-output name=tag::${tag}`);

            console.log(`git log ${tag}..HEAD --oneline`);
            exec(`git log ${tag}..HEAD --oneline`, (err, message, stderr) => {
                if (err) {
                    console.log('\x1b[33m%s\x1b[0m', 'Could not find last commit message because: ');
                    console.log('\x1b[31m%s\x1b[0m', stderr);
                    process.exit(1);
                    return;
                }

                console.log('\x1b[32m%s\x1b[0m', `Found message: ${message}`);
                processMessage(message, tag);
            });
        });
    } else {
        console.log('\x1b[32m%s\x1b[0m', 'Tag not found trying config file');

        if(!commit_message) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find last commit message because it was empty');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            process.exit(1);
        }
        try {
            fs.readFile(version_file, 'utf8', (err, data) => {
                let tag = JSON.parse(data).version;
                tag = tag.trim();
                console.log('\x1b[32m%s\x1b[0m', `Found tag: ${tag}`);
                console.log(`::set-output name=tag::${tag}`);
                processMessage(commit_message, tag);
            });
        } catch {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find last or next version: ');
            console.log(`::set-output name=tag::v0.0.0`);
            console.log(`::set-output name=version::v0.0.1`);
        }
    }
});