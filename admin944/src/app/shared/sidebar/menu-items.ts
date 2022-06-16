import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {
    path: '/starter',
    title: 'Dashboard',
    icon: 'fa fa-dashboard',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/starter',
        title: 'Analytics',
        icon: 'fa fa-dashboard',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  {
    path: '/tutor/list',
    title: 'Tutors',
    icon: 'fa fa-user',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/tutor/list',
        title: 'List tutors',
        icon: 'fa fa-user',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/tutor/create',
        title: 'Create new',
        icon: 'fa fa-user-plus',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  {
    path: '/users/list',
    title: 'Students',
    icon: 'fa fa-users',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/users/list',
        title: 'List students',
        icon: 'fa fa-users',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/users/create',
        title: 'Create new',
        icon: 'fa fa fa-user-plus',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  {
    path: '/appointment/list',
    title: 'Appointments',
    icon: 'fa fa-calendar',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/appointment/list',
        title: 'List appointment',
        icon: 'fa fa-calendar',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  {
    path: '/',
    title: 'Filters',
    icon: 'fa fa-filter',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/grades/list',
        title: 'Grades',
        icon: 'fa fa-graduation-cap',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
          {
            path: '/grades/list',
            title: 'List grades',
            icon: 'fa fa-graduation-cap',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          },
          {
            path: '/grades/create',
            title: 'Create new',
            icon: 'fa fa-plus',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          }
        ]
      },
      {
        path: '/categories/list',
        title: 'Categories',
        icon: 'fa fa-bars',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
          {
            path: '/categories/list',
            title: 'List categories',
            icon: 'fa fa-bars',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          },
          {
            path: '/categories/create',
            title: 'Create new',
            icon: 'fa fa-plus',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          }
        ]
      },
      {
        path: '/subjects/list',
        title: 'Subjects',
        icon: 'fa fa-address-book',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
          {
            path: '/subjects/list',
            title: 'List subjects',
            icon: 'fa fa-address-book',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          },
          {
            path: '/subjects/create',
            title: 'Create new',
            icon: 'fa fa-plus',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          }
        ]
      },
      {
        path: '/topics/list',
        title: 'Topics',
        icon: 'fa fa-address-book',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
          {
            path: '/topics/list',
            title: 'List topics',
            icon: 'fa fa-address-book',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          },
          {
            path: '/topics/create',
            title: 'Create new',
            icon: 'fa fa-plus',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          }
        ]
      }
    ]
  },
  // {
  //   path: '/subjects/list',
  //   title: 'Subjects',
  //   icon: 'fa fa-address-book',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/subjects/list',
  //       title: 'List subjects',
  //       icon: 'fa fa-address-book',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     },
  //     {
  //       path: '/subjects/create',
  //       title: 'Create new',
  //       icon: 'fa fa-plus',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  {
    path: '/testimonials/list',
    title: 'Classes',
    icon: 'fa fa-text-width',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/webinars/list',
        title: 'Group Classes',
        icon: 'fa fa-text-width',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
          {
            path: '/webinars/list',
            title: 'List Group Classes',
            icon: 'fa fa-text-width',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          },
          {
            path: '/webinars/create',
            title: 'Create new',
            icon: 'fa fa-plus',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          }
        ]
      }
    ]
  },
  // {
  //   path: '/testimonials/list',
  //   title: 'Testimonials',
  //   icon: 'fa fa-certificate',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/testimonials/list',
  //       title: 'List testimonials',
  //       icon: 'fa fa-certificate',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     },
  //     {
  //       path: '/testimonials/create',
  //       title: 'Create new',
  //       icon: 'fa fa-plus',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  // {
  //   path: '/grades/list',
  //   title: 'Grades',
  //   icon: 'fa fa-graduation-cap',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/grades/list',
  //       title: 'List grades',
  //       icon: 'fa fa-graduation-cap',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     },
  //     {
  //       path: '/grades/create',
  //       title: 'Create new',
  //       icon: 'fa fa-plus',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  // {
  //   path: '/categories/list',
  //   title: 'Categories',
  //   icon: 'fa fa-bars',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/categories/list',
  //       title: 'List categories',
  //       icon: 'fa fa-bars',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     },
  //     {
  //       path: '/categories/create',
  //       title: 'Create new',
  //       icon: 'fa fa-plus',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  // {
  //   path: '/webinars/list',
  //   title: 'Group Classes',
  //   icon: 'fa fa-text-width',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/webinars/list',
  //       title: 'List Group Classes',
  //       icon: 'fa fa-text-width',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     },
  //     {
  //       path: '/webinars/create',
  //       title: 'Create new',
  //       icon: 'fa fa-plus',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  // {
  //   path: '/courses/list',
  //   title: 'Courses',
  //   icon: 'fa fa-text-width',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/courses/list',
  //       title: 'List courses',
  //       icon: 'fa fa-text-width',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     },
  //     {
  //       path: '/courses/create',
  //       title: 'Create new',
  //       icon: 'fa fa-plus',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  {
    path: '/coupons/list',
    title: 'Coupons',
    icon: 'fa fa-percent',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/coupons/list',
        title: 'List coupons',
        icon: 'fa fa-percent',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/coupons/create',
        title: 'Create new',
        icon: 'fa fa-plus',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      }
    ]
  },

  // {
  //   path: '/banners', title: 'Banners', icon: 'fa fa-image', class: 'has-arrow', label: '', labelClass: '', extralink: false, submenu: [
  //     { path: '/banners', title: 'Banners', icon: 'fa fa-image', class: '', label: '', labelClass: '', extralink: false, submenu: [] },
  //     { path: '/banners/create', title: 'New banner', icon: 'fa fa-plus', class: '', label: '', labelClass: '', extralink: false, submenu: [] }
  //   ]
  // },
  // {
  //   path: '/newsletter/contacts',
  //   title: 'Newsletter',
  //   icon: 'fa fa-envelope',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     // {
  //     //   path: '/newsletter/contacts',
  //     //   title: 'Contacts',
  //     //   icon: 'fa fa-users',
  //     //   class: '',
  //     //   label: '',
  //     //   labelClass: '',
  //     //   extralink: false,
  //     //   submenu: []
  //     // },
  //     {
  //       path: '/newsletter/sendmail',
  //       title: 'Sendmail',
  //       icon: 'fa fa-envelope',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  {
    path: '/posts/list',
    title: 'Pages',
    icon: 'fa fa-envelope',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/posts/list',
        title: 'List pages',
        icon: 'fa fa-users',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/posts/create',
        title: 'Create page',
        icon: 'fa fa-plus',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  {
    path: '/refunds',
    title: 'Payment',
    icon: 'fa fa-money',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/refunds',
        title: 'Refund request',
        icon: 'fa fa-money',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
          {
            path: '/refunds',
            title: 'Refund request list',
            icon: 'fa fa-money',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          }
        ]
      },
      {
        path: '/payment/transaction',
        title: 'Payment manager',
        icon: 'fa fa-money',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
          {
            path: '/payment/transaction',
            title: 'Listing',
            icon: 'fa fa-money',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          }
        ]
      }
      // {
      //   path: '/payout/requests',
      //   title: 'Payout request',
      //   icon: 'fa fa-money',
      //   class: 'has-arrow',
      //   label: '',
      //   labelClass: '',
      //   extralink: false,
      //   submenu: [
      //     {
      //       path: '/payout/requests',
      //       title: 'Listing',
      //       icon: 'fa fa-money',
      //       class: '',
      //       label: '',
      //       labelClass: '',
      //       extralink: false,
      //       submenu: []
      //     }
      //   ]
      // }
    ]
  },
  // {
  //   path: '/payment/transaction',
  //   title: 'Payment manager',
  //   icon: 'fa fa-money',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/payment/transaction',
  //       title: 'Listing',
  //       icon: 'fa fa-money',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  // {
  //   path: '/payout/requests',
  //   title: 'Payout request',
  //   icon: 'fa fa-money',
  //   class: 'has-arrow',
  //   label: '',
  //   labelClass: '',
  //   extralink: false,
  //   submenu: [
  //     {
  //       path: '/payout/requests',
  //       title: 'Listing',
  //       icon: 'fa fa-money',
  //       class: '',
  //       label: '',
  //       labelClass: '',
  //       extralink: false,
  //       submenu: []
  //     }
  //   ]
  // },
  {
    path: '/earnings/stats',
    title: 'Earning stats',
    icon: 'fa fa-money',
    class: 'has-arrow',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/earnings/stats',
        title: 'Earning stats',
        icon: 'fa fa-money',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      }
    ]
  },
  {
    path: '/configs',
    title: 'Config',
    icon: 'fa fa-cogs',
    class: '',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/configs',
        title: 'Config',
        icon: 'fa fa-cogs',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/testimonials/list',
        title: 'Testimonials',
        icon: 'fa fa-certificate',
        class: 'has-arrow',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: [
          {
            path: '/testimonials/list',
            title: 'List testimonials',
            icon: 'fa fa-certificate',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          },
          {
            path: '/testimonials/create',
            title: 'Create new',
            icon: 'fa fa-plus',
            class: '',
            label: '',
            labelClass: '',
            extralink: false,
            submenu: []
          }
        ]
      }
    ]
  },
  {
    path: '/i18n/languages',
    title: 'Language',
    icon: 'fa fa-flag',
    class: '',
    label: '',
    labelClass: '',
    extralink: false,
    submenu: [
      {
        path: '/i18n/languages',
        title: 'Languages',
        icon: 'fa fa-flag',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      },
      {
        path: '/i18n/text',
        title: 'Text',
        icon: 'fa fa-font',
        class: '',
        label: '',
        labelClass: '',
        extralink: false,
        submenu: []
      }
    ]
  }
];
