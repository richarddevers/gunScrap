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

export function httpRequest(
  url: string,
  header?: headers,
  method?: string
): Observable<XMLHttpRequest> {
  const checkedMethod = method ? method : "GET";
  const xhr = new XMLHttpRequest();

  xhr.open(checkedMethod, url);

  if (header) {
    for (let [k, v] of Object.entries(header)) {
      xhr.setRequestHeader(k, v);
    }
  }

  return from(
    new Promise<XMLHttpRequest>((resolve, reject) => {
      // in case of reject, if status code === 0 , it's an onerror
      // else it's onload then not a 2XX code

      xhr.onerror = () => {
        reject(xhr);
      };

      xhr.onload = () => {
        const toto = Math.floor(xhr.status / 100);
        if (toto === 2) {
          // every code 2XX
          resolve(xhr);
        } else {
          reject(xhr);
        }
      };

      xhr.send();
    })
  );
}

var myHeaders = { Accept: "text/html", Content: "text/html" };

// // With proper url
let nani0 = httpRequest(url0, myHeaders).subscribe(
  (res) => console.log(`OK 0 ${res.responseText}`),
  (err) => console.log(`KO 0 ${err}`),
  () => console.log("====== Finito 0 ======")
);

// with proper url returning 404
// let nani1 = httpRequest(url1).subscribe(
//   (res) => console.log(`OK 1 ${res.responseText}`),
//   (err) => console.log(`KO 1  ${err.status}:${err.statusText}`),
//   // (err)=>console.log(`KO 1  ${err.response}`),
//   () => console.log("====== Finito 1 ======")
// );

// let nani2 = httpRequest(url2).subscribe(
//   (res) => console.log(`OK 2 ${res.responseText}`),
//   (err) => console.log(`KO 2  ${err.status}:${err.statusText}`),
//   () => console.log("====== Finito 2 ======")
// );
