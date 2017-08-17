import { Component, ViewContainerRef } from '@angular/core';
import { ClientComponent } from '../../app/client.component';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { ShareLinkComponent } from './share-link/share-link.component';

@Component({
    selector: 'app-backoffice-promotions-list',
    templateUrl: './backoffice-promotions-list.component.html',
    styleUrls: ['./../backoffice.component.css'],
    providers: [ClientComponent]
})
export class BackofficePromotionsListComponent {
    public repoUrl = 'https://github.com/Epotignano/ng2-social-share';
    public imageUrl = 'https://avatars2.githubusercontent.com/u/10674541?v=3&s=200';


    public promos: any;
    public user: any;

    public Share = {
        vkontakte: (purl, ptitle, pimg, text, promoId) => {
            let url = 'http://vkontakte.ru/share.php?';
            url += 'url=' + encodeURIComponent(purl);
            url += '&title=' + encodeURIComponent(ptitle);
            url += '&description=' + encodeURIComponent(text);
            url += '&image=' + encodeURIComponent(pimg);
            url += '&noparse=true';
            this.Share.popup(url, 'vk', promoId);
        },

        facebook: (purl, pimg, text, promoId, ptitle) => {
            let url = 'https://www.facebook.com/sharer/sharer.php?';
            url += '&u=' + encodeURIComponent(purl);
            url += '&title=' + encodeURIComponent(ptitle);
            url += '&picture=' + encodeURIComponent(pimg);
            url += '&description=' + encodeURIComponent(text);
            this.Share.popup(url, 'fb', promoId);
        },

        twitter: (purl, ptitle, pdesc, promoId, promoSiteName) => {
            let url = 'http://twitter.com/share?';
            url += 'text=' + encodeURIComponent(ptitle + '\n' + pdesc + '\n');
            url += '&url=' + encodeURIComponent(purl);
            url += '&counturl=' + encodeURIComponent(purl);
            url += '&hashtags=sarafan,' + encodeURIComponent(promoSiteName);
            this.Share.popup(url, 'tw', promoId);
        },

        popup: (url, source, promoId) => {
            window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
            this.sharePromo(source, promoId);
        }
    };

    constructor(
        private clientComponent: ClientComponent,
        public dialog: MdDialog,
        public viewContainerRef: ViewContainerRef,
    ) {
        clientComponent.userAuth$.subscribe(
            user => {
                this.user = user;
                this.getPromo();
            });
    }

    public openLinkDialog(promo: any) {
        const config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        const dialogRef = this.dialog.open(ShareLinkComponent, config);
        dialogRef.componentInstance.sharedItemLink =
            `http://sarafan.online/promo/${promo._id}?user=${this.user._id}&source=directLink`;
    }

    public openHTMLDialog(promo: any) {
        const config = new MdDialogConfig();
        config.viewContainerRef = this.viewContainerRef;

        const dialogRef = this.dialog.open(ShareLinkComponent, config);
        dialogRef.componentInstance.sharedItemLink =
        `
          <div style="background:#fafafa;padding:10px 20px; font-family:Helvetica Nue,sans-serif;color:rgb(49, 52, 54)">
            <a href="http://sarafan.online">
               <img src="http://sarafan.online/images/logo.png" alt="">
            </a>
            <div style="display:flex;margin-top:15px" >
              <div>
                <img src="http://sarafan.online${promo.photo.original.url}" alt=""
                style="width:100px;object-fit:contain;margin-right:10px;padding-top:5px">
              </div>
               <div>
                 <a style="font-weight:700;font-size:16px;margin-top:5px;text-decoration:none;display:block;color:rgb(49, 52, 54)"
                  href="http://sarafan.online/promo/${promo._id}?user=${this.user._id}&source=directLink">
                   ${promo.name}
                 </a>
                 <div style="font-weight:300;font-size:15px;margin-top:5px">
                   ${promo.description}
                 </div>
                 <a
                   style="text-decoration:underline; color: #6EBF33;margin-top:10px;display:block;font-size:15px"
                   href="http://sarafan.online/promo/${promo._id}?user=${this.user._id}&source=directLink">
                   Просмотреть акцию
                 </a>
               </div>
            </div>
          </div>
        `;
    }

    private getPromo() {
        this.clientComponent._apiService.getUserPromoList(this.clientComponent.jwtToken, this.user._id).subscribe(
            data => {
                this.promos = data;
            },
            err => {
                this.clientComponent._notificationsService.error('Ошибка при получении данных', '');
            }
        );
    }

    private sharePromo(source, promoId) {
        this.clientComponent._apiService.sharePromo(this.clientComponent.jwtToken,
            {source, sender: this.user._id, promoId}).subscribe(
            data => {
            },
            err => {
            }
        );
    }

}

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'safeHtml'})
export class SafeHtml implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
