export async function checkBanned(req, res, next) {
  const session = await getSession({ req });

  if (session?.user?.isBanned) {
    return res.status(403).json({ message: 'คุณถูกแบน' });
  }
  next();
}
