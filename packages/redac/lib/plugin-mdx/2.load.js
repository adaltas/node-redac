import fs from "node:fs/promises";
import path from "path";
import { glob } from "glob";
import each from "each";
import { merge } from "mixme";

export default async function pluginMdxLoad(plugin) {
  const { config: { target, pattern } } = plugin
  let documents = await glob(pattern, { cwd: target });
  documents = await each(documents, async (file) => ({
    content_raw: await fs.readFile(path.resolve(target, file)),
    path_absolute: path.resolve(target, file),
    path_relative: file,
  }));
  plugin.documents = documents.sort((a, b) =>
    a.path_absolute > b.path_absolute ? 1 : -1
  );
  return plugin;
}
