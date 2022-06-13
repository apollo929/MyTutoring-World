import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { ToastrService } from 'ngx-toastr';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
declare var Stripe: any;
import { AuthService } from '../../../shared/services';
@Component({
  selector: 'app-pay',
  templateUrl: './pay2.html'
})
export class Pay2Component implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardInfo') cardInfo: ElementRef;
  public card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  public cardHolderName: any = '';
  public cardOptions: any = {
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

  constructor(
    private router: Router,
    private stripeService: StripeService,
    private fb: FormBuilder,
    public auth: AuthService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit() {
    // const stripe = Stripe(window.appConfig.stripeKey);
    // const elements = stripe.elements();
    // const style = {
    //   base: {
    //     iconColor: '#666EE8',
    //     color: '#31325F',
    //     fontWeight: 400,
    //     fontFamily: 'Helvetica Neue',
    //     fontSize: '15px'
    //   }
    // };
    // const cardNumberElement = elements.create('cardNumber', {
    //   style: style
    // });
    // cardNumberElement.mount('#card-number-element');
    // const cardExpiryElement = elements.create('cardExpiry', {
    //   style: style
    // });
    // cardExpiryElement.mount('#card-expiry-element');
    // const cardCvcElement = elements.create('cardCvc', {
    //   style: style
    // });
    // cardCvcElement.mount('#card-cvc-element');
    // function setOutcome(result) {
    //   const successElement = document.querySelector('.success');
    //   const errorElement = document.querySelector('.error');
    //   if (successElement) {
    //     successElement.classList.remove('visible');
    //   }
    //   if (errorElement) {
    //     errorElement.classList.remove('visible');
    //   }
    //   if (result.token) {
    //     // successElement.querySelector('.token').textContent = result.token.id;
    //     successElement.classList.add('visible');
    //   } else if (result.error) {
    //     errorElement.textContent = result.error.message;
    //     errorElement.classList.add('visible');
    //   }
    // }
    // const cardBrandToPfClass = {
    //   visa: 'pf-visa',
    //   mastercard: 'pf-mastercard',
    //   amex: 'pf-american-express',
    //   discover: 'pf-discover',
    //   diners: 'pf-diners',
    //   jcb: 'pf-jcb',
    //   unknown: 'pf-credit-card'
    // };
    // function setBrandIcon(brand) {
    //   const brandIconElement = document.getElementById('brand-icon');
    //   let pfClass = 'pf-credit-card';
    //   if (brand in cardBrandToPfClass) {
    //     pfClass = cardBrandToPfClass[brand];
    //   }
    //   for (let i = brandIconElement.classList.length - 1; i >= 0; i--) {
    //     brandIconElement.classList.remove(brandIconElement.classList[i]);
    //   }
    //   brandIconElement.classList.add('pf');
    //   brandIconElement.classList.add(pfClass);
    // }
    // cardNumberElement.on('change', function (event) {
    //   // Switch brand logo
    //   if (event.brand) {
    //     setBrandIcon(event.brand);
    //   }
    //   setOutcome(event);
    // });
    // document.querySelector('form').addEventListener('submit', function (e) {
    //   e.preventDefault();
    //   const options = {
    //     address_zip: (<HTMLInputElement>document.getElementById('postal-code')).value,
    //     name: (<HTMLInputElement>document.getElementById('name')).value
    //   };
    //   stripe.createToken(cardNumberElement, options).then(setOutcome);
    // });
    const stripe = Stripe(window.appConfig.stripeKey);
    const elements = stripe.elements();
    const style = {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: 400,
        fontFamily: 'Helvetica Neue',
        fontSize: '15px'
      }
    };
    // const cardNumberElement = elements.create('cardNumber', {
    //   style: style
    // });
    // cardNumberElement.mount('#card-number-element');
    // cardNumberElement.addEventListener('change', this.cardHandler);
    // const cardExpiryElement = elements.create('cardExpiry', {
    //   style: style
    // });
    // cardExpiryElement.mount('#card-expiry-element');
    // cardExpiryElement.addEventListener('change', this.cardHandler);
    // const cardCvcElement = elements.create('cardCvc', {
    //   style: style
    // });
    // cardCvcElement.mount('#card-cvc-element');
    // cardCvcElement.addEventListener('change', this.cardHandler);
    this.card = elements.create('cardNumber', {
      style: style
    });
    this.card.mount('#card-number-element');
    this.card = elements.create('cardExpiry', {
      style: style
    });
    this.card.mount('#card-expiry-element');
    this.card = elements.create('cardCvc', {
      style: style
    });
    this.card.mount('#card-cvc-element');
    this.card.addEventListener('change', this.cardHandler);
  }

  onChange({ error }) {
    console.log(error);
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  async onSubmit() {
    const stripe = Stripe(window.appConfig.stripeKey);
    const { token, error } = await stripe.createToken(this.card);
    if (error) {
      console.log('Something is wrong:', error);
    } else {
      console.log('Success!', token);
    }
  }

  //   buy() {
  //     this.loading = true;
  //     const name = this.stripeTest.get('name').value;
  //     this.stripeService.createToken(this.card.element, { name }).subscribe(result => {
  //       if (result.token) {
  //         console.log(result);
  //         this.loading = false;
  //       }
  //     });
  //   }
}
