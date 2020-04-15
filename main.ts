import { UrlData } from "./url/urlData";
import { StartScrapping } from "./scrapper/scrapper";

let myUrlData = new UrlData();
if (myUrlData.urlToDo.length > 0) {
  StartScrapping(myUrlData, true);
} else {
  console.log("No url to do");
}
