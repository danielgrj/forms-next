import FormAnswer from '@models/FormAnswer'

export default async (req, res) => {
  const { method, body } = req

  switch (method) {
    case 'POST':
      try {
        await FormAnswer.create(body)
        res.status(200).end({ success: true, message: 'Answer saved' })
      } catch (e) {
        console.log(e)
        res.status(400).json({ error: 'Could not save answer, params missing' })
      }
      break
    default:
      res.status(405).json({ error: 'Method not allowed' })
  }
}
