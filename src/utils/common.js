import {randomBytes} from 'crypto'

export const randomUserId = () =>
  randomBytes(3).toString('base64url'); 