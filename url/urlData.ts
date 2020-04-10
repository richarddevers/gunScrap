import * as fs from "fs";
import { urlFile, scrappedFolder } from "../config";
import { _ } from "lodash";
interface Url {
  url: string;
  comment?: string;
}

export class UrlData {
  // basic data
  private urlContents: string;
  private filePath: string;
  private encoding: string;

  // url from urlData.json
  public urlToDo: Url[];
  public urlDone: Url[];
  public urlError: Url[];

  //
  // private urlToRemoveFromDone: Url[];

  constructor(urlFilePath?: string, encoding?: string) {
    // Init
    this.filePath = urlFilePath ? urlFilePath : urlFile;
    this.encoding = encoding ? encoding : "utf8";

    // Generate backup file
    const bkpName = () => {
      const splitName = this.filePath.split(".");
      return splitName[0] + "-bkp." + splitName[1];
    };

    fs.copyFileSync(this.filePath, bkpName());
    this.urlContents = fs.readFileSync(this.filePath, this.encoding);

    // Load url Data
    const urlContentsData = JSON.parse(this.urlContents);
    this.urlToDo = urlContentsData.url.todo;
    this.urlDone = urlContentsData.url.done;
    this.urlError = urlContentsData.url.error;
  }

  public saveDoneData(response: any) {
    const urlStringSplit = response.config.url.split("/");
    const fileName = urlStringSplit[urlStringSplit.length - 1] + ".html";
    const fullFileName = scrappedFolder + fileName;

    fs.writeFileSync(fullFileName, response.data, this.encoding);
    this.urlDone.push({ url: response.config.url, comment: "" });
  }

  public saveErrorData(url: string, comment: string) {
    this.urlError.push({ url: url, comment: comment });
  }

  public consolidateResult() {
    this.urlToDo = this.urlToDo.filter(a=>this.urlDone.map(b=>b.url).indexOf(a.url)==-1);
    const newData = {
      url:{
        todo:this.urlToDo,
        done:this.urlDone,
        error:this.urlError
      }
    };
    fs.writeFileSync(this.filePath, JSON.stringify(newData), this.encoding);
  }
}
