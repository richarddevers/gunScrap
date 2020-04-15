import * as fs from "fs";
import { urlFile, scrappedFolder, picRegex, nopeRegex } from "../config";
import { httpRequest } from "../scrapper/scrapper";

import getUrls from "get-urls";

interface Url {
  url: string;
  comment?: string;
  folder?: string;
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

  public saveDoneData(response: any, pic: boolean) {
    const urlStringSplit = response.config.url.split("/");
    const folderName = urlStringSplit[urlStringSplit.length - 1];
    const fileName = folderName + ".html";
    const fullFileName = scrappedFolder + folderName + "/" + fileName;
    const fullFolderName = scrappedFolder + folderName;

    // Make folder to save data
    try {
      fs.readdirSync(fullFolderName);
    } catch (e) {
      fs.mkdirSync(fullFolderName);
    }

    // Scrap picture
    if (pic) scrapPicture(response, fullFolderName);

    // Save data
    fs.writeFileSync(fullFileName, response.data, this.encoding);
    this.urlDone.push({ url: response.config.url, folder: folderName });
  }

  public saveErrorData(url: string, comment: string) {
    const alreadyErrored = this.urlError.map((x) => {
      return x.url;
    });
    if (alreadyErrored.indexOf(url) === -1)
      this.urlError.push({ url: url, comment: comment });
  }

  public consolidateResult() {
    this.urlToDo = this.urlToDo.filter(
      (a) => this.urlDone.map((b) => b.url).indexOf(a.url) == -1
    );
    const newData = {
      url: {
        todo: this.urlToDo,
        done: this.urlDone,
        error: this.urlError,
      },
    };
    fs.writeFileSync(this.filePath, JSON.stringify(newData), this.encoding);
  }
}

function scrapPicture(res: any, folder: string) {
  const urls = Array.from(getUrls(res.data));
  for (let u of urls) {
    const regexpResult = u.match(picRegex);
    if (regexpResult && !nopeRegex.test(regexpResult[0])) {
      const fullFileName = folder + "/" + regexpResult[0];
      httpRequest(u, { responseType: "stream" }).subscribe((x) =>
        x.data.pipe(fs.createWriteStream(fullFileName))
      );
    }
  }
}
