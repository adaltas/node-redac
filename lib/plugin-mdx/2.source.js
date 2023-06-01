import fs from "node:fs/promises";
import path from "path";
import { glob } from "glob";
import each from "each";
import { merge } from "mixme";

export default async function pluginMdxSource(plugin) {
  const { config: { cwd, pattern } } = plugin
  let documents = await glob(pattern, { cwd: cwd });
  documents = await each(documents, async (file) => ({
    content_raw: await fs.readFile(path.resolve(cwd, file)),
    path_absolute: path.resolve(cwd, file),
    path_relative: file,
  }));
  plugin.documents = documents.sort((a, b) =>
    a.path_absolute > b.path_absolute ? 1 : -1
  );
  return plugin;
}
