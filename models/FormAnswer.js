import { query } from '@db'

const FormAnswer = {
  create: values => {
    const { firstNames, lastNames, zipCode, phoneNumber, email, initiative } = values
    const statement = `INSERT INTO public.form_answers (
      first_names, 
      last_names, 
      zip_code, 
      phone_number, 
      email, 
      initiative
    ) VALUES ($1, $2, $3, $4, $5, $6)`

    const params = [firstNames, lastNames, zipCode, phoneNumber, email, initiative]

    return query(statement, params)
  },
}

export default FormAnswer
