const axios = require("axios").default;
import { Observable } from "rxjs";
import { tap, mergeMap, distinct, catchError } from "rxjs/operators";
import { UrlData } from "../url/urlData";
import { from, of } from "rxjs";

function httpRequest(url: string): Observable<any> {
  return from(axios.get(url));
}

export function StartScrapping(myUrlData: UrlData) {
  const urlToDo = from(
    myUrlData.urlToDo.map(function (item) {
      return item.url;
    })
  );

  urlToDo
    .pipe(
      distinct(),
      tap((x) => console.log("Getting url " + x)),
      mergeMap((url) =>
        httpRequest(url).pipe(
          catchError((err) => {
            return of({message:err.message, url:url});
          })
        )
      )
    )
    .subscribe(
      (res) => {
        if (res.status) {
          console.log(`OK:${res.status}:${res.config.url}`);
          myUrlData.saveDoneData(res);
        } else {
          console.log(`KO:${res.message}:${res.url}`);
        }
      },
      (err) => console.log(`err ${err}`),
      () => console.log("All url done")
    );
}
