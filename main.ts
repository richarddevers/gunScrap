import { urlData } from "./url/urlData";
import { from } from "rxjs";
import { StartScrapping } from "./request/request";

let myUrlData = new urlData();

console.log(myUrlData.urlToDo);

const urlToDo = from(
  myUrlData.urlToDo.map(function (item) {
    return item.url;
  })
);
StartScrapping(urlToDo);
