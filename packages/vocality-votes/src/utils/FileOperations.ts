import fs from 'fs';
import { Vote } from '../types/Vote';
import { BACKUP } from '../config';

export class FileOperations {
  static readFromFile() {
    let data = undefined;
    if (fs.existsSync(BACKUP.path)) {
      data = fs.readFileSync(BACKUP.path, {
        encoding: 'utf-8',
      });
    } else {
      return data;
    }

    return data;
  }
  static writeToFile(data: Map<string, Vote>) {
    console.log(BACKUP.path);

    fs.writeFileSync(BACKUP.path, JSON.stringify([...data]));
  }
}
