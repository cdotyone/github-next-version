const { exec } = require('child_process');
exec('git rev-list --tags --max-count=1', (err, rev, stderr) => {
    if (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
        console.log('\x1b[31m%s\x1b[0m', stderr);

        console.log('::set-output name=version::v1.0.0');
        process.exit(0);
        return;
    }

    let message = '';
    exec('git log -1 --pretty=%B', (err, msg, stderr) => {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find last commit message because: ');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            process.exit(1);
            return;
        }

        message = msg;
        console.log('\x1b[32m%s\x1b[0m', `Found message: ${message}`);
    });

    exec(`git describe --tags ${rev}`, (err, tag, stderr) => {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find any tags because: ');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            console.log('::set-output name=version::v1.0.0');
            process.exit(0);
            return;
        }

        console.log('\x1b[32m%s\x1b[0m', `Found tag: ${tag}`);
        console.log(`::set-output name=tag::${tag}`);

        var parts = tag.replace(/v/,'').trim().split('.');
        parts.length = 3;

        if (message.substr(0, 4) === 'fix:') {
            parts[2] = parseInt(parts[2]);
            parts[2]++;
        }
        if (message.substr(0, 5) === 'feat:') {
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

        process.exit(0);
    });
});
