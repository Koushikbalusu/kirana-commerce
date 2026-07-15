import { z } from 'zod';
import { reservationValidator } from './validators';

export type CreateReservationDTO = z.infer<typeof reservationValidator.create>;
export type ReservationResponseDTO = z.infer<typeof reservationValidator.response>;
