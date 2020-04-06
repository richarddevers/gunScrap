import { ajax } from 'rxjs/ajax';
import { maxConcurrentGet } from '../config';
import { map, filter, tap, takeWhile, switchMap, mergeMap, exhaustMap, mergeMapTo, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { XMLHttpRequest } from 'xmlhttprequest';

function createXHR() {
    return new XMLHttpRequest();
  }
  
function createAjax(url: string, method: string, type: string) {
  return ajax({
    createXHR,
    url: url,
    crossDomain: true,
    method: method,
    headers: {
      'Content-Type': type 
    },
    responseType: type
  });
}

export function StartScrapping(urls:Observable<string>){
        let currentConcurrentGet = 0;
        const myPipe = urls.pipe(
            tap(x => console.log("Getting url " + x)),
            takeWhile(_ => { return currentConcurrentGet < maxConcurrentGet }),
            tap(_ => currentConcurrentGet++),
            mergeMap(url => createAjax(url, 'GET', 'text/html'))
        ).subscribe(
            res => console.info("OK " + res.request.url),
            err => console.error("KO " + err)
        )
  }