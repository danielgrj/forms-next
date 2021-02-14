import formAnswer from '@api/form-answer'

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: jest.fn(),
  })),
}))

describe('POST /form-answer', () => {
  it('sends status code 200 if the info is correct', async () => {
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({
        json,
      })),
    }

    const req = {
      method: 'POST',
      body: {
        firstNames: 'Urano',
        lastNames: 'Matsumoto',
        zipCode: '42832',
        phoneNumber: '5537936130',
        email: 'mat@example.com',
        initiative: 'one',
      },
    }

    await formAnswer(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(json).toHaveBeenCalledWith({ success: true, message: 'Answer saved' })
  })

  it('sends error 400 if the info is incorrect or missing', async () => {
    const json = jest.fn()
    const res = {
      status: jest.fn(() => ({
        json,
      })),
    }

    const req = {
      method: 'POST',
      body: {
        firstNames: 'Urano',
        lastNames: 'Matsumoto',
        zipCode: '42832',
        phoneNumber: '55379361301',
        email: 'mat@example.com',
        initiative: 'one',
      },
    }

    await formAnswer(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ error: 'The phone number is not valid' })

    await formAnswer(
      { ...req, body: { ...req.body, phoneNumber: '5537936130', email: 'anemail' } },
      res,
    )

    expect(res.status).toHaveBeenLastCalledWith(400)
    expect(json).toHaveBeenLastCalledWith({ error: 'The email is not valid' })

    await formAnswer(
      { ...req, body: { ...req.body, phoneNumber: '5537936130', zipCode: '232322' } },
      res,
    )

    expect(res.status).toHaveBeenLastCalledWith(400)
    expect(json).toHaveBeenLastCalledWith({ error: 'The zip code is not valid' })

    await formAnswer({ ...req, body: { ...req.body, phoneNumber: undefined } }, res)

    expect(res.status).toHaveBeenLastCalledWith(400)
    expect(json).toHaveBeenLastCalledWith({ error: 'Could not save answer, params missing' })
  })
})
