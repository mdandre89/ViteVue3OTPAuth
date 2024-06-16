import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TwoFactorAuth from './../TwoFactorAuth.vue'

describe('TwoFactorAuth', () => {
  it('renders properly', () => {
    const wrapper = mount(TwoFactorAuth, {
      props: {
        otpauth_url:
          'otpauth://totp/micheleOTPtest:random_name?issuer=micheleOTPtest&secret=2HNTUG7P2ZLN36FONZ4KBWUK&algorithm=SHA1&digits=6&period=30',
        base32: '2HNTUG7P2ZLN36FONZ4KBWUK',
        user_id: 1
      }
    })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
