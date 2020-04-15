const axios = require("axios").default;
import { Observable } from "rxjs";
import { tap, mergeMap, distinct, catchError, finalize } from "rxjs/operators";
import { UrlData } from "../url/urlData";
import { from, of } from "rxjs";

export function httpRequest(url: string, option?: any): Observable<any> {
  if(option)return from(axios.get(url, option));
  return from(axios.get(url));
}


export function StartScrapping(myUrlData: UrlData, pic:boolean=false) {
  const urlToDo = from(
    myUrlData.urlToDo.map(function (item) {
      return item.url;
    })
  );

  urlToDo
    .pipe(
      distinct(),
      tap((url) => console.log("Getting url " + url)),
      mergeMap((url) =>
        httpRequest(url).pipe(
          catchError((err) => {
            return of({message:err.message, url:url});
          })
        )
      ),
      finalize(()=>myUrlData.consolidateResult())
    )
    .subscribe(
      (res) => {
        if (res.status) {
          console.log(`OK:${res.status}:${res.config.url}`);
          myUrlData.saveDoneData(res, pic);
        } else {
          console.log(`KO:${res.message}:${res.url}`);
          myUrlData.saveErrorData(res.url, res.message);
        }
      },
      (err) => console.log(`err ${err}`),
      () => console.log("All url done")
    );
}

