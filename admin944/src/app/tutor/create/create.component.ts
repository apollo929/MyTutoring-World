import { Component, OnInit } from '@angular/core';
import { TutorService } from '../tutor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from '../../subject/subject.service';
import { LanguageService, CountryService } from '../../shared/services';
import * as _ from 'lodash';
import { responseError } from '../../shared/util';
@Component({
  selector: 'app-tutor-create',
  templateUrl: '../form.html'
})
export class TutorCreateComponent implements OnInit {
  public info: any = {
    name: '',
    username: '',
    password: '',
    email: '',
    isActive: false,
    emailVerified: false,
    phoneNumber: '',
    phoneVerified: false,
    address: '',
    bio: '',
    subjectIds: [],
    certificatedTeacher: false,
    languages: [],
    grades: [],
    isHomePage: false,
    zipCode: '',
    idYoutube: '',
    featured: false,
    price1On1Class: 0,
    avatar: '',
    avatarUrl: '',
    timezone: ''
  };
  public languages: any[];
  public subjects: any;
  public isSubmitted: any = false;
  public countries: any[];
  public options: Object = {
    placeholderText: 'Enter bio',
    charCounterCount: false,
    imageUpload: false
  };
  public config: any;
  public loading: boolean = false;
  public quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['code-block'],
        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ font: [] }],
        [{ align: [] }],

        ['clean']
        // ['image']
      ]
    },
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: (range, context) => {
            return true;
          }
        }
      }
    }
  };

  constructor(
    private router: Router,
    private tutorService: TutorService,
    private toasty: ToastrService,
    private subjectService: SubjectService,
    private languageService: LanguageService,
    private countryService: CountryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.querySubjects();
    this.languages = this.languageService.getLang();
    this.countries = this.countryService.getCountry();
    this.config = this.route.snapshot.data['appConfig'];
  }

  querySubjects() {
    this.subjectService.search({ take: 100 }).then(resp => {
      this.subjects = resp.data.items;
    });
  }

  submit(frm: any) {
    this.isSubmitted = true;
    if (!frm.valid || !this.info.timezone) {
      return this.toasty.error('Please complete the required fields!');
    }
    const data = _.pick(this.info, [
      'name',
      'username',
      'subjectIds',
      'bio',
      'email',
      'isActive',
      'emailVerified',
      'address',
      'emailNotification',
      'phoneNumber',
      'phoneVerified',
      'grades',
      'languages',
      'password',
      'isHomePage',
      'zipCode',
      'idYoutube',
      'country',
      'featured',
      'price1On1Class',
      'avatar',
      'state',
      'city',
      'timezone'
    ]);
    this.tutorService
      .create(data)
      .then(resp => {
        this.toasty.success('Created successfully!');
        this.router.navigate(['/tutor/list']);
      })
      .catch(err => this.toasty.error(responseError(err)));
  }
  afterUpload(evt) {
    if (!this.info._id) {
      this.info.avatar = evt;
    }
  }
  changeTimezone(event) {
    if (event === 'Asia/Saigon') {
      this.info.timezone = 'Asia/Ho_Chi_Minh';
    } else {
      this.info.timezone = event;
    }
  }
}
