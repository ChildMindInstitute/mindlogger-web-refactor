import path from "path";
import fs from "fs";

/**
 * Build a platform-safe storage filename from path segments.
 *
 * @param paths - Individual path segments.
 * @returns The joined filename.
 */
export const generateStorageFilename = (...paths: string[]): string => {
    return path.join(...paths);
}

/**
 * Write raw string data to a storage file, creating parent directories as needed.
 *
 * @param data - The contents to write.
 * @param filename - The target filename.
 * @returns The filename that was written.
 */
export const writeStorageFile = (data: string, filename: string): string => {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, data);

    return filename;
}

/**
 * Read the contents of a storage file as UTF-8.
 *
 * @param filename - The file to read.
 * @returns The file contents.
 */
export const readStorageFile = (filename: string): string => {
  return fs.readFileSync(filename, 'utf-8')
}
