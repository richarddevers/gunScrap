import { Observable, from } from "rxjs";
import { XMLHttpRequest } from "xmlhttprequest";
const axios = require("axios").default;

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
      xhr.onerror = () => {
        reject(xhr);
      };

      xhr.ontimeout = () => {
        reject(xhr);
      };

      xhr.onloadend = () => {
        const status = Math.floor(xhr.status / 100);
        if (status === 2) {
          resolve(xhr);
        } else {
          reject(xhr);
        }
      };

      xhr.send();
    })
  );
}
