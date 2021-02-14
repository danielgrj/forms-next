import validator from 'validator'
import parsePhoneNumberFromString from 'libphonenumber-js/max'

import FormAnswer from '@models/FormAnswer'

const ALLOWED_COUNTRY = 'MX'

export default async (req, res) => {
  const { method, body } = req
  const { zipCode, phoneNumber, email } = body

  switch (method) {
    case 'POST':
      try {
        const formattedPhoneNumber = parsePhoneNumberFromString(phoneNumber, ALLOWED_COUNTRY)

        if (email && !validator.isEmail(email)) {
          res.status(400).json({ error: 'The email is not valid' })
          return
        }

        if (!/[0-9]{5}/.test(zipCode)) {
          res.status(400).json({ error: 'The zip code is not valid' })
          return
        }

        if (!formattedPhoneNumber || !formattedPhoneNumber.isValid()) {
          res.status(400).json({ error: 'The phone number is not valid' })
          return
        }

        await FormAnswer.create({ ...body, phoneNumber: formattedPhoneNumber.number })
        res.status(200).json({ success: true, message: 'Answer saved' })
      } catch (e) {
        res.status(400).json({ error: 'Could not save answer, params missing' })
      }
      break
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
