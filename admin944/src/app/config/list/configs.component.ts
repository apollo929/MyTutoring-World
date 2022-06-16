import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service';
import { ToastrService } from 'ngx-toastr';
import { CurrenciesService } from '../../shared/services/currency.service';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.html'
})
export class ConfigsComponent implements OnInit {
  public items = [];
  public smtpServices = [
    '123',
    '163',
    '1und1',
    'AOL',
    'DebugMail',
    'DynectEmail',
    'FastMail',
    'GandiMail',
    'Gmail',
    'Godaddy',
    'GodaddyAsia',
    'GodaddyEurope',
    'hot.ee',
    'Hotmail',
    'iCloud',
    'mail.ee',
    'Mail.ru',
    'Maildev',
    'Mailgun',
    'Mailjet',
    'Mailosaur',
    'Mandrill',
    'Naver',
    'OpenMailBox',
    'Outlook365',
    'Postmark',
    'QQ',
    'QQex',
    'SendCloud',
    'SendGrid',
    'SendinBlue',
    'SendPulse',
    'SES',
    'SES-US-EAST-1',
    'SES-US-WEST-2',
    'SES-EU-WEST-1',
    'Sparkpost',
    'Yahoo',
    'Yandex',
    'Zoho',
    'qiye.aliyun'
  ];
  public logoOptions: any;
  public faviconOptions: any;
  public bannerOptions: any;
  public logoSelected: any;
  public faviconSelected: any;
  public bannerSelected: any;
  public signupImageOptions: any;
  public signupImageSelected: any;
  public currencies: any[];
  constructor(
    private configService: ConfigService,
    private toasty: ToastrService,
    private currencyService: CurrenciesService
  ) {}

  ngOnInit() {
    this.logoOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.items.map(item => {
          if (item.key === 'siteLogo') {
            item.value = resp.data.fileUrl;
          }
        });
      },
      onFileSelect: resp => (this.logoSelected = resp),
      accept: 'image/*',
      maxSize: 2 // MB
    };
    this.bannerOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.items.map(item => {
          if (item.key === 'siteBanner') {
            item.value = resp.data.fileUrl;
          }
        });
      },
      onFileSelect: resp => (this.faviconSelected = resp),
      accept: 'image/*',
      maxSize: 5 // MB
    };
    this.faviconOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.items.map(item => {
          if (item.key === 'siteFavicon') {
            item.value = resp.data.fileUrl;
          }
        });
      },
      onFileSelect: resp => (this.bannerSelected = resp),
      accept: 'image/*',
      maxSize: 0.5 // MB
    };
    this.signupImageOptions = {
      url: window.appConfig.apiBaseUrl + '/media/photos',
      fileFieldName: 'file',
      onFinish: resp => {
        this.items.map(item => {
          if (item.key === 'signupImage') {
            item.value = resp.data.fileUrl;
          }
        });
      },
      onFileSelect: resp => (this.signupImageSelected = resp),
      accept: 'image/*',
      maxSize: 5 // MB
    };
    this.currencies = this.currencyService.getCurrencies();
    this.query();
  }

  query() {
    this.configService
      .list({ sort: 'ordering', sortType: 'asc' })
      .then(resp => {
        resp.data.items.map(item => {
          if (item.key != 'commissionCourse') this.items.push(item);
        });
      })
      .catch(() => this.toasty.error('Something went wrong, please try again!'));
  }

  async save(item: any) {
    if (item.type === 'number' && item.value < 0) {
      return this.toasty.error('Please enter positive number!');
    }
    if (item.key === 'commissionRate' && item.value > 1) {
      return this.toasty.error('Allowable value from 0 - 1, for example 0.1 = 10%!');
    }

    await this.configService
      .update(item._id, item.value)
      .then(() => this.toasty.success('Updated successfully!'))
      .catch(e => this.toasty.error('Something went wrong, please try again!'));
  }

  changeCurrency(event) {
    const { value } = event.target;
    const currency = this.currencies.find(item => item.name === value);
    const currencySymbol = this.items.find(item => item.key === 'currencySymbol');
    currencySymbol.value = currency['symbol-alt-narrow'] || currency['symbol'];
  }

  async saveCurrency() {
    const currencyConfigs = this.items.filter(item => item.key === 'currency' || item.key === 'currencySymbol');
    for (const item of currencyConfigs) {
      await this.save(item);
    }
  }
}
