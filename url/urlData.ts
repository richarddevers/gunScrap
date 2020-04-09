import * as fs from "fs";
import { urlFile, scrappedFolder } from '../config';
import { AjaxResponse } from "rxjs/ajax";

interface Url {
  url: string;
  comment?: string;
}

export class UrlData {
  private urlContents: string;
  private filePath: string;
  private encoding: string;
  public urlToDo: Url[];
  public urlDone: Url[];
  public urlError: Url[];
  // private urlToRemoveFromDone: Url[];

  constructor(urlFilePath?: string, encoding?: string) {
    // Init
    this.filePath = urlFilePath ? urlFilePath : urlFile;
    this.encoding = encoding ? encoding:"utf8";
    
    // Generate backup file
    const bkpName = () => {
      const splitName = this.filePath.split('.');
      return splitName[0] + "-bkp." + splitName[1];
    }
    
    fs.copyFileSync(this.filePath, bkpName())
    this.urlContents = fs.readFileSync(this.filePath,this.encoding);

    // Load url Data
    const urlContentsData = JSON.parse(this.urlContents);
    this.urlToDo = urlContentsData.url.todo;
    this.urlDone = urlContentsData.url.done;
    this.urlError = urlContentsData.url.error;
  }

  public saveDoneData(response: any){
    const urlString = response.request.url;
    const urlStringSplit = response.config.url.split("/");
    const fileName = urlStringSplit[urlStringSplit.length-1]+".html";
    const fullFileName = scrappedFolder + fileName;

    try{
      fs.writeFileSync(fullFileName, response.data, this.encoding);
    }catch(e){
      // this.saveErrorData(urlString, `Error saving url data to file:${e}`);
      console.log("rien")
    }

    this.urlDone.push({url:urlString , comment:""});
  }

  // public saveErrorData(url:string, error:any){
  //   this.urlError.push({url:url, comment:String(error)});
  //   console.log(`UrlError: ${url}`);
  // }

}


