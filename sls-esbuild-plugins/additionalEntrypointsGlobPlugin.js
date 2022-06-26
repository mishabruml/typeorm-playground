"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/globrex/index.js
var require_globrex = __commonJS({
  "node_modules/globrex/index.js"(exports, module2) {
    var isWin = process.platform === "win32";
    var SEP = isWin ? `\\\\+` : `\\/`;
    var SEP_ESC = isWin ? `\\\\` : `/`;
    var GLOBSTAR = `((?:[^/]*(?:/|$))*)`;
    var WILDCARD = `([^/]*)`;
    var GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}]*(?:${SEP_ESC}|$))*)`;
    var WILDCARD_SEGMENT = `([^${SEP_ESC}]*)`;
    function globrex(glob, { extended = false, globstar = false, strict = false, filepath = false, flags = "" } = {}) {
      let regex = "";
      let segment = "";
      let path = { regex: "", segments: [] };
      let inGroup = false;
      let inRange = false;
      const ext = [];
      function add(str, { split, last, only } = {}) {
        if (only !== "path")
          regex += str;
        if (filepath && only !== "regex") {
          path.regex += str === "\\/" ? SEP : str;
          if (split) {
            if (last)
              segment += str;
            if (segment !== "") {
              if (!flags.includes("g"))
                segment = `^${segment}$`;
              path.segments.push(new RegExp(segment, flags));
            }
            segment = "";
          } else {
            segment += str;
          }
        }
      }
      let c, n;
      for (let i = 0; i < glob.length; i++) {
        c = glob[i];
        n = glob[i + 1];
        if (["\\", "$", "^", ".", "="].includes(c)) {
          add(`\\${c}`);
          continue;
        }
        if (c === "/") {
          add(`\\${c}`, { split: true });
          if (n === "/" && !strict)
            regex += "?";
          continue;
        }
        if (c === "(") {
          if (ext.length) {
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ")") {
          if (ext.length) {
            add(c);
            let type = ext.pop();
            if (type === "@") {
              add("{1}");
            } else if (type === "!") {
              add("([^/]*)");
            } else {
              add(type);
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "|") {
          if (ext.length) {
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "+") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "@" && extended) {
          if (n === "(") {
            ext.push(c);
            continue;
          }
        }
        if (c === "!") {
          if (extended) {
            if (inRange) {
              add("^");
              continue;
            }
            if (n === "(") {
              ext.push(c);
              add("(?!");
              i++;
              continue;
            }
            add(`\\${c}`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "?") {
          if (extended) {
            if (n === "(") {
              ext.push(c);
            } else {
              add(".");
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "[") {
          if (inRange && n === ":") {
            i++;
            let value = "";
            while (glob[++i] !== ":")
              value += glob[i];
            if (value === "alnum")
              add("(\\w|\\d)");
            else if (value === "space")
              add("\\s");
            else if (value === "digit")
              add("\\d");
            i++;
            continue;
          }
          if (extended) {
            inRange = true;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "]") {
          if (extended) {
            inRange = false;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "{") {
          if (extended) {
            inGroup = true;
            add("(");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "}") {
          if (extended) {
            inGroup = false;
            add(")");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ",") {
          if (inGroup) {
            add("|");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "*") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          let prevChar = glob[i - 1];
          let starCount = 1;
          while (glob[i + 1] === "*") {
            starCount++;
            i++;
          }
          let nextChar = glob[i + 1];
          if (!globstar) {
            add(".*");
          } else {
            let isGlobstar = starCount > 1 && (prevChar === "/" || prevChar === void 0) && (nextChar === "/" || nextChar === void 0);
            if (isGlobstar) {
              add(GLOBSTAR, { only: "regex" });
              add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
              i++;
            } else {
              add(WILDCARD, { only: "regex" });
              add(WILDCARD_SEGMENT, { only: "path" });
            }
          }
          continue;
        }
        add(c);
      }
      if (!flags.includes("g")) {
        regex = `^${regex}$`;
        segment = `^${segment}$`;
        if (filepath)
          path.regex = `^${path.regex}$`;
      }
      const result = { regex: new RegExp(regex, flags) };
      if (filepath) {
        path.segments.push(new RegExp(segment, flags));
        path.regex = new RegExp(path.regex, flags);
        path.globstar = new RegExp(!flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT, flags);
        result.path = path;
      }
      return result;
    }
    module2.exports = globrex;
  }
});

// node_modules/globalyzer/src/index.js
var require_src = __commonJS({
  "node_modules/globalyzer/src/index.js"(exports, module2) {
    "use strict";
    var os = require("os");
    var path = require("path");
    var isWin = os.platform() === "win32";
    var CHARS = { "{": "}", "(": ")", "[": "]" };
    var STRICT = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\)|(\\).|([@?!+*]\(.*\)))/;
    var RELAXED = /\\(.)|(^!|[*?{}()[\]]|\(\?)/;
    function isglob(str, { strict = true } = {}) {
      if (str === "")
        return false;
      let match, rgx = strict ? STRICT : RELAXED;
      while (match = rgx.exec(str)) {
        if (match[2])
          return true;
        let idx = match.index + match[0].length;
        let open = match[1];
        let close = open ? CHARS[open] : null;
        if (open && close) {
          let n = str.indexOf(close, idx);
          if (n !== -1)
            idx = n + 1;
        }
        str = str.slice(idx);
      }
      return false;
    }
    function parent(str, { strict = false } = {}) {
      if (isWin && str.includes("/"))
        str = str.split("\\").join("/");
      if (/[\{\[].*[\/]*.*[\}\]]$/.test(str))
        str += "/";
      str += "a";
      do {
        str = path.dirname(str);
      } while (isglob(str, { strict }) || /(^|[^\\])([\{\[]|\([^\)]+$)/.test(str));
      return str.replace(/\\([\*\?\|\[\]\(\)\{\}])/g, "$1");
    }
    function globalyzer(pattern, opts = {}) {
      let base = parent(pattern, opts);
      let isGlob = isglob(pattern, opts);
      let glob;
      if (base != ".") {
        glob = pattern.substr(base.length);
        if (glob.startsWith("/"))
          glob = glob.substr(1);
      } else {
        glob = pattern;
      }
      if (!isGlob) {
        base = path.dirname(pattern);
        glob = base !== "." ? pattern.substr(base.length) : pattern;
      }
      if (glob.startsWith("./"))
        glob = glob.substr(2);
      if (glob.startsWith("/"))
        glob = glob.substr(1);
      return { base, glob, isGlob };
    }
    module2.exports = globalyzer;
  }
});

// node_modules/tiny-glob/index.js
var require_tiny_glob = __commonJS({
  "node_modules/tiny-glob/index.js"(exports, module2) {
    var fs = require("fs");
    var globrex = require_globrex();
    var { promisify } = require("util");
    var globalyzer = require_src();
    var { join, resolve, relative } = require("path");
    var isHidden = /(^|[\\\/])\.[^\\\/\.]/g;
    var readdir = promisify(fs.readdir);
    var stat = promisify(fs.stat);
    var CACHE = {};
    async function walk(output, prefix, lexer, opts, dirname = "", level = 0) {
      const rgx = lexer.segments[level];
      const dir = resolve(opts.cwd, prefix, dirname);
      const files = await readdir(dir);
      const { dot, filesOnly } = opts;
      let i = 0, len = files.length, file;
      let fullpath, relpath, stats, isMatch;
      for (; i < len; i++) {
        fullpath = join(dir, file = files[i]);
        relpath = dirname ? join(dirname, file) : file;
        if (!dot && isHidden.test(relpath))
          continue;
        isMatch = lexer.regex.test(relpath);
        if ((stats = CACHE[relpath]) === void 0) {
          CACHE[relpath] = stats = fs.lstatSync(fullpath);
        }
        if (!stats.isDirectory()) {
          isMatch && output.push(relative(opts.cwd, fullpath));
          continue;
        }
        if (rgx && !rgx.test(file))
          continue;
        !filesOnly && isMatch && output.push(join(prefix, relpath));
        await walk(output, prefix, lexer, opts, relpath, rgx && rgx.toString() !== lexer.globstar && level + 1);
      }
    }
    module2.exports = async function(str, opts = {}) {
      if (!str)
        return [];
      let glob = globalyzer(str);
      opts.cwd = opts.cwd || ".";
      if (!glob.isGlob) {
        try {
          let resolved = resolve(opts.cwd, str);
          let dirent = await stat(resolved);
          if (opts.filesOnly && !dirent.isFile())
            return [];
          return opts.absolute ? [resolved] : [str];
        } catch (err) {
          if (err.code != "ENOENT")
            throw err;
          return [];
        }
      }
      if (opts.flush)
        CACHE = {};
      let matches = [];
      const { path } = globrex(glob.glob, { filepath: true, globstar: true, extended: true });
      path.globstar = path.globstar.toString();
      await walk(matches, glob.base, path, opts, ".", 0);
      return opts.absolute ? matches.map((x) => resolve(opts.cwd, x)) : matches;
    };
  }
});

// sls-esbuild-plugins/additionalEntrypointsGlobPlugin.ts
var additionalEntrypointsGlobPlugin_exports = {};
__export(additionalEntrypointsGlobPlugin_exports, {
  additionalEntrypointsGlobPlugin: () => additionalEntrypointsGlobPlugin
});
module.exports = __toCommonJS(additionalEntrypointsGlobPlugin_exports);
var import_tiny_glob = __toESM(require_tiny_glob());
var additionalEntrypointsGlobPlugin = ({
  additionalEntrypoints
}) => {
  const plugin = {
    name: "additionalGlobEntrypoints",
    async setup(build) {
      const initialEntrypoints = build.initialOptions.entryPoints;
      if (!Array.isArray(initialEntrypoints)) {
        throw new TypeError("additionalGlobEntrypoints plugin currently only supports array entrypoints");
      }
      if (!Array.isArray(additionalEntrypoints) || !additionalEntrypoints.every((s) => typeof s === "string")) {
        throw new TypeError(`additionalEntrypoints must be an array of strings. Recieved ${additionalEntrypoints}`);
      }
      console.info(`Resolving additionalEntrypoints [ ${additionalEntrypoints.map((s) => `'${s}'`).join(",")} ]`);
      const resolvedAdditionalEntrypoints = (await Promise.all(additionalEntrypoints.map((str) => (0, import_tiny_glob.default)(str)))).flat();
      console.info(`Resolved additional files [ ${resolvedAdditionalEntrypoints.map((s) => `'${s}'`).join(",")} ] from additional entrypoints`);
      build.initialOptions.entryPoints = [
        ...initialEntrypoints,
        ...resolvedAdditionalEntrypoints
      ];
    }
  };
  return plugin;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  additionalEntrypointsGlobPlugin
});
