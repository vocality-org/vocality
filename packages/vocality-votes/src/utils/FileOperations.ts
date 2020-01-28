import fs from 'fs';
import path from 'path';

export class FileOperations {
  static readFromFile() {
    let data = undefined;
    if (fs.existsSync(path.join(__dirname, 'votingResults.json'))) {
      data = fs.readFileSync(path.join(__dirname, 'votingResults.json'), {
        encoding: 'utf-8',
      });
    } else {
      return data;
    }

    return data;
  }
  static writeToFile(data: Map<any, any>) {
    console.log([...data]);
    fs.writeFileSync(
      path.join(__dirname, 'votingResults.json'),
      JSON.stringify([...data])
    );
  }
}
