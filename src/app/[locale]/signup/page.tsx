import React from 'react'
import { useTranslations } from 'next-intl'

const SignUp = () => {
  const t = useTranslations()

  return (
    <div>SignUp, {t('apiNotifications.accountDeleteError')}</div>
  )
}

export default SignUp