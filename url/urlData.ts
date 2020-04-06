import * as fs from "fs";
import { urlFile } from '../config';

interface Url {
  url: string;
  comment?: string;
}

export class urlData {
  urlContents: string;
  urlToDo: Url[];
  urlDone: Url[];
  urlError: Url[];
  
  constructor(urlFilePath?: string, encoding?: string) {
    this.urlContents = fs.readFileSync(urlFilePath ? urlFilePath : urlFile, encoding ? encoding:"utf8");

    const urlContentsData = JSON.parse(this.urlContents);
    this.urlToDo = urlContentsData.url.todo;
    this.urlDone = urlContentsData.url.done;
    this.urlError = urlContentsData.url.error;
  }
}


