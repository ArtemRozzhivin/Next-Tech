'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@src/navigation'

const SignUp = () => {
  const t = useTranslations()

  return (
    <div>SignUp, {t('apiNotifications.accountDeleteError')}
    <span>
    <Link href="/signup" locale="uk">Switch to Ukraine </Link>
    </span>
    <div>
    <Link href="/signup" locale="en">Switch to Enslish </Link>
    </div>

    </div>
  )
}

export default SignUp