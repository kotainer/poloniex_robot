import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

const apiUrl = '/api/';

@Injectable()
export class ApiService {
    constructor(private http: Http) { }

    public register(value: Object) {
        const body = new URLSearchParams();
        Object.keys(value).forEach(key => {
            body.set(key, value[key]);
        });
        return this.http.post(`${apiUrl}auth/register`, body)
            .map((res: Response) => res.json());
    }

    public login(login: string, password: string) {
        const body = new URLSearchParams();
        body.set('login', login);
        body.set('password', password);
        return this.http.post(`${apiUrl}auth/login`, body)
            .map((res: Response) => res.json());
    }

    public restorePass(email: string) {
        const body = new URLSearchParams();
        body.set('email', email);
        return this.http.post(`${apiUrl}auth/restore`, body)
            .map((res: Response) => res.json());
    }

    public authJWT(jwt: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}auth/validate`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public saveUserInfo(jwt: string, value: Object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('user', JSON.stringify(value));

        return this.http.put(`${apiUrl}user`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

    public getUserNotify(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}notify/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public setNotifyViewed(jwt: string, id: string, tag: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('tag', tag);

        return this.http.put(`${apiUrl}notify/${id}`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

    public saveSiteInfo(jwt: string, value: Object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('site', JSON.stringify(value));

        return this.http.put(`${apiUrl}site`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

    public getReferers(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}user/${id}/referers`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getSite(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}site/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getSiteOrders(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}orders/site/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public updateOrder(jwt: string, value: Object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('order', JSON.stringify(value));

        return this.http.put(`${apiUrl}orders`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

    public getSiteAccruals(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}accruals/site/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getUserAccruals(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}accruals/user/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getSitePayments(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}payments/site/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getUserPayments(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}payments/user/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getUserOrders(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}orders/user/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getUserBalance(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}user/${id}/balance`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getUserRequests(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}requests/user/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getSiteRequests(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}requests/site/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getCompaniesList() {
        return this.http.get(`${apiUrl}companies/list`)
            .map((res: Response) => res.json());
    }

    public sendCompanyInvite(email: string) {
        const body = new URLSearchParams();
        body.set('email', email);
        return this.http.post(`${apiUrl}companies/invite`, body)
            .map((res: Response) => res.json());
    }

    public subscribeToCompany(jwt: string, userId: string, companyId: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('userId', userId);
        body.set('companyId', companyId);

        return this.http.post(`${apiUrl}companies/subscribe`, body,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public unsubscribeCompany(jwt: string, userId: string, companyId: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('userId', userId);
        body.set('companyId', companyId);

        return this.http.post(`${apiUrl}companies/unsubscribe`, body,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getCompanyReferer(jwt: string, companyId: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(`${apiUrl}companies/${companyId}/referer`,
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
            .catch(error => Observable.throw(error));
    }

    public getPromoList() {
        return this.http.get(`${apiUrl}promo/list`)
            .map((res: Response) => res.json());
    }

    public getUserPromoList(jwt: string, userId: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.get(`${apiUrl}promo/user/list/${userId}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public getSitePromoList(jwt: string, id: String) {
        const headers = new Headers();
        headers.append('Authorization', jwt);
        return this.http.get(`${apiUrl}promo/list/${id}`,
            { headers: headers })
            .map((res: Response) => res.json());
    }

    public addNewPromo(jwt: string, value: Object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        Object.keys(value).forEach(key => {
            body.set(key, value[key]);
        });

        return this.http.post(`${apiUrl}promo`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

    public updatePromo(jwt: string, value: Object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('promo', JSON.stringify(value));

        return this.http.put(`${apiUrl}promo`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

    public deletePromo(jwt: string, id: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        return this.http.delete(`${apiUrl}promo/${id}`, { headers: headers })
            .map((res: Response) => res.json());
    }

    public addRequestOnOut(jwt: string, value: Object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        Object.keys(value).forEach(key => {
            body.set(key, value[key]);
        });

        return this.http.post(`${apiUrl}requests`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

    public addBill(jwt: string, value: string) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        body.set('bill', value);

        return this.http.post(`${apiUrl}bill`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

    public sharePromo(jwt: string, value: Object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        Object.keys(value).forEach(key => {
            body.set(key, value[key]);
        });

        return this.http.post(`${apiUrl}share`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

    public getPromo(id: any) {
        return this.http.get(`${apiUrl}promo/show/${id}`)
            .map((res: Response) => res.json());
    }

    public sendQuestionMail(value: Object) {
        const body = new URLSearchParams();
        Object.keys(value).forEach(key => {
            body.set(key, value[key]);
        });
        return this.http.post(`${apiUrl}question`, body)
            .map((res: Response) => res.json());
    }

    public updateUserTariff(jwt: string, userId: string,value: Object) {
        const headers = new Headers();
        headers.append('Authorization', jwt);

        const body = new URLSearchParams();
        Object.keys(value).forEach(key => {
            body.set(key, value[key]);
        });

        return this.http.post(`${apiUrl}user/${userId}/tariff`, body, { headers: headers })
            .map((res: Response) => res.json());
    }

};
