/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const { exec } = __nccwpck_require__(129);

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
            processMessage(message, tag);
        });
    });
});
})();

module.exports = __webpack_exports__;
/******/ })()
;