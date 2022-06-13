import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import { StripeElementsOptions } from '@stripe/stripe-js';
import { ToastrService } from 'ngx-toastr';
import { IWebinar } from '../interface';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.html'
})
export class StripeModalComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Input() webinar: IWebinar;
  @Input() type: any;
  @Input() salePrice: any;
  @Input() appliedCoupon: any;
  public cardHolderName: any = '';
  public cardOptions: any = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
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
  public loading: Boolean = false;
  public emailRecipient: any = '';
  constructor(
    private stripeService: StripeService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toasty: ToastrService
  ) {}

  ngOnInit() {
    this.stripeService.setKey(window.appConfig.stripeKey);
    this.stripeTest = this.fb.group({
      cardName: ['', [Validators.required]],
      emailRecipient: ['', [Validators.required, Validators.email]]
    });
  }

  buy() {
    this.loading = true;
    const name = this.stripeTest.get('cardName').value;
    const emailRecipient = this.stripeTest.get('emailRecipient').value || '';
    if (this.type === 'gift' && !emailRecipient) {
      this.loading = false;
      return this.toasty.error('Please enter email of recipient');
    }
    if (!name) {
      this.loading = false;
      return this.toasty.error('Please enter your name');
    }
    this.stripeService.createToken(this.card.getCard(), { name }).subscribe(result => {
      if (result.token) {
        this.loading = false;
        this.activeModal.close(Object.assign(result, { emailRecipient, type: this.type }));
        // Use the token to create a charge or a customer
        // https://stripe.com/docs/charges
      } else if (result.error) {
        // Error creating the token
        this.loading = false;
        this.toasty.error(result.error.message);
      }
    });
  }
}
