import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { ToastrService } from 'ngx-toastr';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService, CountryService } from '../../../shared/services';
import { filter } from 'rxjs/operators';
import { AppointmentService } from '../../../appointment/services/appointment.service';
import { PaymentService } from '../../payment.service';
import { IUser } from '../../../user/interface';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.html'
})
export class PayComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  public cardHolderName: any = '';
  public cardOptions: any = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: 'rgba(0, 157, 151, 0.75)'
        }
      }
    }
  };
  // optional parameters
  public elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
  public stripeTest: FormGroup;
  public stripeToken: any = null;
  public loading: boolean = false;
  public errorCard: any;
  public errorText: string;
  public paymentParams: any;
  public type: string;
  public targetType: string;
  public paymentIntent: any;
  public submitted: boolean = false;
  public countries: any;
  public targetName: string;
  public tutorName: string;
  public currentUser: IUser;
  constructor(
    private router: Router,
    private stripeService: StripeService,
    private fb: FormBuilder,
    private auth: AuthService,
    private toasty: ToastrService,
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private paymentService: PaymentService,
    private countryService: CountryService,
    private translate: TranslateService
  ) {
    if (this.auth.isLoggedin()) {
      this.auth.getCurrentUser().then(resp => (this.currentUser = resp));
    }
    this.type = this.route.snapshot.queryParams.type;
    this.targetType = this.route.snapshot.queryParams.targetType;
    this.targetName = this.route.snapshot.queryParams.targetName;
    this.tutorName = this.route.snapshot.queryParams.tutorName;
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        this.paymentParams = navigation.extras.state;
      }
    });
  }
  ngOnInit() {
    if (!this.paymentParams) {
      const params = localStorage.getItem('paymentParams');
      if (params) {
        this.paymentParams = JSON.parse(params);
      } else {
        this.router.navigate(['/home']);
      }
    }
    this.countries = this.countryService.getCountry();
    this.stripeService.setKey(window.appConfig.stripeKey);
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]],
      emailRecipient: ['', [Validators.email]],
      address_line1: ['', [Validators.required]],
      address_city: ['', [Validators.required]],
      address_state: ['', [Validators.required]],
      address_country: [undefined, [Validators.required]]
      //address_zip: ['']
    });
  }

  buy() {
    this.submitted = true;
    if (this.stripeTest.invalid) {
      return this.toasty.error(this.translate.instant('Please complete the required fields'));
    }
    this.loading = true;
    const name = this.stripeTest.get('name').value;
    const emailRecipient = this.stripeTest.get('emailRecipient').value;
    if (this.type === 'gift' && !emailRecipient) {
      this.loading = false;
      return this.toasty.error(this.translate.instant('Please enter email of recipient'));
    }
    if (!name) {
      this.loading = false;
      return this.toasty.error(this.translate.instant('Please enter your name'));
    }
    if (!this.paymentParams) {
      return this.toasty.error(this.translate.instant('Can not found payment info, please try again!'));
    }
    if (this.targetType === 'webinar' || this.targetType === 'course') {
      this.paymentParams.emailRecipient = emailRecipient || '';
      this.paymentService
        .enroll(this.paymentParams)
        .then(resp => {
          this.submitted = false;
          this.paymentIntent = resp.data;
          if (this.paymentIntent.paymentMode === 'test') return this.router.navigate(['/payments/success']);
          this.confirmPayment();
        })
        .catch(err => {
          this.loading = false;
          this.submitted = false;
          this.toasty.error(
            this.translate.instant(
              (err.data && err.data.data && err.data.data.message) ||
                err.data.message ||
                'Something went wrong, please try again!'
            )
          );
          this.router.navigate(['/payments/cancel']);
        });
    } else {
      this.appointmentService
        .create(this.paymentParams)
        .then(resp => {
          this.submitted = false;
          this.paymentIntent = resp.data;
          if (this.paymentIntent.paymentMode === 'test') return this.router.navigate(['/payments/success']);
          this.confirmPayment();
        })
        .catch(err => {
          this.loading = false;
          this.submitted = false;
          localStorage.removeItem('title');
          localStorage.removeItem('paymentParams');
          this.toasty.error(
            this.translate.instant(
              (err.data && err.data.data && err.data.data.message) ||
                err.data.message ||
                'Something went wrong, please try again!'
            )
          );
          this.router.navigate(['/payments/cancel']);
        });
    }
  }

  confirmPayment() {
    const name = this.stripeTest.get('name').value;
    const address_line1 = this.stripeTest.get('address_line1').value;
    const address_city = this.stripeTest.get('address_city').value;
    const address_state = this.stripeTest.get('address_state').value;
    const address_country = this.stripeTest.get('address_country').value;
    //const address_zip = this.stripeTest.get('address_zip').value;
    this.stripeService
      .confirmCardPayment(this.paymentIntent.stripeClientSecret, {
        payment_method: {
          card: this.card.element,
          billing_details: {
            name
          }
        },
        shipping: {
          name: name,
          address: {
            line1: address_line1,
            city: address_city,
            country: address_country,
            //postal_code: address_zip,
            state: address_state
          }
        }
      })
      .subscribe(result => {
        this.loading = false;
        localStorage.removeItem('title');
        localStorage.removeItem('paymentParams');
        if (result && result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          return this.router.navigate(['/payments/success']);
        } else if (result && result.error) {
          this.toasty.error(this.translate.instant(result.error.message));
          return this.router.navigate(['/payments/cancel']);
        }
      });
  }
}
