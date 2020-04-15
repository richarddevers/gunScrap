import * as fs from "fs";
import getUrls from 'get-urls'
import { from, Observable } from "rxjs";
const axios = require("axios").default;

const data = fs.readFileSync('scrapped/ASW-G-08_Gundam_Barbatos.html', 'utf-8');
const urls = Array.from(getUrls(data))

const regexp = new RegExp('.png');

const filteredUrl = urls.filter((x)=>{
    return regexp.test(x);
})
console.log(filteredUrl)
console.log(urls.length)
console.log(filteredUrl.length)

function httpRequest(url: string): Observable<any> {
    return from(axios.get(url, {responseType: "stream"}));
  }

httpRequest(filteredUrl[2]).subscribe(
    (x)=>x.data.pipe(fs.createWriteStream("./scrapped/toto.png"))
)