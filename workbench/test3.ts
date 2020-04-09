const axios = require("axios").default;

// axios.get("https://www.google.fr").then((x) => console.log(x));

import { XMLHttpRequest } from "xmlhttprequest";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { from, of, throwError, Observable } from "rxjs";
// import { mergeMap, catchError, tap, map } from 'rxjs/operators';
let url0 = "https://www.google.fr";
let url1 = "https://api.github.com/404";
let url2 = "https://www.piouigyftydgjukijb.com";

interface headers {
  [propName: string]: string;
}

export function httpRequest2(url: string): Observable<any> {
  return from(axios.get(url));
}



// With proper url
let nani0 = httpRequest2(url1).subscribe(
  (res) => {
    console.log(`OK 0 ${res.config.url}`);
    console.log(`OK 0 ${res.status}`);

    
  },
  (err) => {
    console.log(`KO 0 ${err}`);
  },
  () => console.log("====== Finito 0 ======")
);

// with proper url returning 404
// let nani1 = httpRequest2(url1).subscribe(
//   (res) => console.log(`OK 1 ${res.responseText}`),
//   (err) => console.log(`KO 1  ${err.status}:${err.statusText}`),
//   // (err)=>console.log(`KO 1  ${err.response}`),
//   () => console.log("====== Finito 1 ======")
// );

// let nani2 = httpRequest2(url2).subscribe(
//   (res) => console.log(`OK 2 ${res.responseText}`),
//   (err) => console.log(`KO 2  ${err.status}:${err.statusText}`),
//   () => console.log("====== Finito 2 ======")
// );
