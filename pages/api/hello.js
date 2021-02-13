// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import '../../config/db';

export default (req, res) => {
  res.status(200).json({ name: 'John Doe' });
};
