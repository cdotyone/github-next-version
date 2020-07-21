const { exec } = require('child_process');

console.log('===', process.env.GITHUB_SHA);

exec('git rev-list --tags --max-count=1', (err, rev, stderr) => {
    if (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
        console.log('\x1b[31m%s\x1b[0m', stderr);

        console.log('::set-output name=version::v1.0.0');
        process.exit(0);
        return;
    }
    console.log(rev);
});

exec('git rev-list --tags --max-count=1', (err, rev, stderr) => {
    if (err) {
        console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
        console.log('\x1b[31m%s\x1b[0m', stderr);

        console.log('::set-output name=version::v1.0.0');
        process.exit(0);
        return;
    }
    console.log(rev);
    console.log('git describe --tags '+rev);
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
        });
    });
});
