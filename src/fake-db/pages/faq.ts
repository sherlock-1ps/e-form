// Type Imports
import type { FaqType } from '@/types/pages/faqTypes'

export const db: FaqType[] = [
  {
    id: 'payment',
    title: 'บัญชี',
    icon: 'tabler-brand-cashapp',
    subtitle: 'ต้องการความช่วยเหลือเกี่ยวกับบัญชี',
    questionsAnswers: [
      {
        id: 'order-payment',
        question: 'ระบบตัดรอบบัญชีเวลาไหน ?',
        answer:
          'ระบบจะตัดรอบบัญชีทุกวัน เวลา 0:00'
      },
      {
        id: 'order',
        question: 'สามารถถอนเงินออกได้ตอนไหน ?',
        answer:
          'ทุกเวลา 24 ชั่วโมง'
      },
      {
        id: 'placing-order',
        question: "auto license คืออะไร ทำงานยังไง",
        answer:
          'auto license............'
      },

    ]
  },

  // delivery
  {
    id: 'delivery',
    title: 'ระบบหวย',
    icon: 'tabler-briefcase',
    subtitle: 'ต้องการความช่วยเหลือระบบหวย',
    questionsAnswers: [
      {
        id: 'ship-order',
        question: 'สามารถส่งโพยหวยได้ตอนไหน ?',
        answer:
          'ทุกวันที่หวยออก โดยทั่วไปวันที่ 1 และ 16'
      },
      {
        id: 'delivery-cost',
        question: 'หวยมีกี่ประเภท?',
        answer:
          'ทุกประเภทในจักรวาล'
      },

    ]
  },

  // cancellation and return
  // {
  //   icon: 'tabler-refresh',
  //   id: 'cancellation-return',
  //   title: 'Cancellation & Return',
  //   subtitle: 'Get help with cancellation & return',
  //   questionsAnswers: [
  //     {
  //       id: 'cancel-order',
  //       question: 'Can I cancel my order?',
  //       answer:
  //         'Scheduled delivery orders can be cancelled 72 hours prior to your selected delivery date for full refund. Parcel delivery orders cannot be cancelled, however a free return label can be provided upon request.'
  //     },
  //     {
  //       id: 'product-return',
  //       question: 'Can I return my product?',
  //       answer:
  //         'You can return your product within 15 days of delivery, by contacting our support team, All merchandise returned must be in the original packaging with all original items.'
  //     },
  //     {
  //       id: 'return-status',
  //       question: 'Where can I view status of return?',
  //       answer: 'Locate the item from Your Orders. Select Return/Refund status'
  //     }
  //   ]
  // },

  // my orders
  // {
  //   id: 'my-orders',
  //   title: 'My Orders',
  //   icon: 'tabler-box',
  //   subtitle: 'Order details',
  //   questionsAnswers: [
  //     {
  //       id: 'order-success',
  //       question: 'Has my order been successful?',
  //       answer:
  //         'All successful order transactions will receive an order confirmation email once the order has been processed. If you have not received your order confirmation email within 24 hours, check your junk email or spam folder. Alternatively, log in to your account to check your order summary. If you do not have a account, you can contact our Customer Care Team on 1-000-000-000.'
  //     },
  //     {
  //       id: 'promo-code',
  //       question: 'My Promotion Code is not working, what can I do?',
  //       answer: 'If you are having issues with a promotion code, please contact us at 1 000 000 000 for assistance.'
  //     },
  //     {
  //       id: 'track-orders',
  //       question: 'How do I track my Orders?',
  //       answer:
  //         'If you have an account just sign into your account from here and select “My Orders”. If you have a a guest account track your order from here using the order number and the email address.'
  //     }
  //   ]
  // },

  // product and services
  {
    icon: 'tabler-settings',
    id: 'product-services',
    title: 'ตั้งค่าเว็บไซด์',
    subtitle: 'ตกแต่งหน้าเล่น',
    questionsAnswers: [
      {
        id: 'shipping-notification',
        question: 'สามารถเปลี่ยนสีได้ที่ไหน?',
        answer:
          'ได้ที่เมนู ...........'
      },
      {
        id: 'warranty-coverage',
        question: 'คืนยอดเสีย ทำงานอย่างไร?',
        answer:
          'สอบถามอีลอนมัสสักครู่ครับ ..............'
      },
      {
        id: 'warranty-notification',
        question: 'รองรับสกุลเงินต่างประเทศไหม?',
        answer:
          'รองทุกเงินทุกสกุลของจักรวาล.'
      },

    ]
  }
]
