import { ERequest, EResponse } from '../../types';

const authLogoutPOST = async (req: ERequest, res: EResponse) => {
  res.clearCookie('token');
  res.clearCookie('access_token');
  res.clearCookie('user_name');
  res.json({ message: 'Logged out successfully' });
};

export default authLogoutPOST;
