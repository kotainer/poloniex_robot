import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

const apiUrl = '/api/cms/';

@Injectable()
export class ApiService {
    constructor(private http: Http) { }

    public register(value: Object) {
        const body = new URLSearchParams();
        Object.keys(value).forEach(key => {
            body.set(key, value[key]);
        });
        return this.http.post(apiUrl + 'auth/register', body)
            .map((res: Response) => res.json());
    }

    public login(login: string, password: string) {
        const body = new URLSearchParams();
        body.set('login', login);
        body.set('password', password);
        body.set('type', 'admin');
        return this.http.post(apiUrl + 'auth/login', body)
            .map((res: Response) => res.json());
    }

    public authJWT(jwt: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(apiUrl + 'auth/validate',
            { headers: headers })
            .map((res: Response) => res.json());
    }


    public attachPhoto(jwt: string, file: File, id: string, type: string) {
        const formData: FormData = new FormData();
        formData.append('files', file, file.name);

        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.post(`${apiUrl}${type}/${id}/attach`, formData, { headers: headers, body: formData })
            .map(res => res.json())
            .catch(error => Observable.throw(error))
    }

    // Settings

    public getSettingsByTag(jwt: string, tag: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(apiUrl + 'settings/' + tag,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public updateSettings(jwt: string, id: string, data: any) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('data', JSON.stringify(data));

        return this.http.put(apiUrl + 'settings/' + id, body, { headers: headers })
            .map((res: Response) => res.json());
    }
    // -----------------------------------------

    // Users

    public getUsersList(jwt: string, query: object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const params: URLSearchParams = new URLSearchParams();
        params.set('query', JSON.stringify(query));

        return this.http.get(`${apiUrl}users`,
            { headers: headers , params})
            .map((res: Response) => res.json());
    }

    public removeUser(jwt: string, id: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.delete(`${apiUrl}users/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getUser(jwt: string, id: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(`${apiUrl}users/${id}`,
            { headers: headers})
            .map((res: Response) => res.json());
    }

    public changeBan(jwt: string, id: string, isBanned: boolean) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('isBanned', isBanned.toString());

        return this.http.post(`${apiUrl}users/${id}/banned`, body,
            { headers })
            .map((res: Response) => res.json());
    }

    // -----------------------------------------

    // Statistics dashboard

    public getLastUsers(jwt: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(`${apiUrl}statistics/lastusers`,
            { headers: headers})
            .map((res: Response) => res.json());
    }

    public getLastOrders(jwt: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(`${apiUrl}orders/last`,
            { headers: headers})
            .map((res: Response) => res.json());
    }

    public getUsersStats(jwt: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(`${apiUrl}statistics/users`,
            { headers: headers})
            .map((res: Response) => res.json());
    }

    public getConvers(jwt: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(`${apiUrl}statistics/convers`,
            { headers: headers})
            .map((res: Response) => res.json());
    }

    public getShareStats(jwt: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(`${apiUrl}statistics/share`,
            { headers: headers})
            .map((res: Response) => res.json());
    }

    // -----------------------------------------

    // Tariffs

    public getTariffsList(jwt: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(`${apiUrl}tariffs`,
            { headers: headers})
            .map((res: Response) => res.json());
    }

    public addTariff(jwt: string, value: object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        Object.keys(value).forEach(key => {
            body.set(key, value[key]);
        });

        return this.http.post(`${apiUrl}tariff`,  body,
            { headers: headers})
            .map((res: Response) => res.json());
    }

    public removeTariff(jwt: string, id: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.delete(`${apiUrl}tariff/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    // -----------------------------------------

    // Accruals

    public getAccrualsList(jwt: string, query: object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const params: URLSearchParams = new URLSearchParams();
        params.set('query', JSON.stringify(query));

        return this.http.get(`${apiUrl}accruals`,
            { headers: headers , params})
            .map((res: Response) => res.json());
    }

    // -----------------------------------------

    // Bills

    public getBillsList(jwt: string, query: object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const params: URLSearchParams = new URLSearchParams();
        params.set('query', JSON.stringify(query));

        return this.http.get(`${apiUrl}bills`,
            { headers: headers , params})
            .map((res: Response) => res.json());
    }

    public payBill(jwt: string, billId: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();

        return this.http.post(`${apiUrl}bill/${billId}`, body,
            { headers: headers})
            .map((res: Response) => res.json());
    }

    // -----------------------------------------

};