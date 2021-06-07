import { MedioPago } from "./medio_pago.models";
import { Titular } from "./titular.models";

export class TitularTarjeta{
    id: number;
    titular: Titular;
    medio_pago: MedioPago;
    pan: string;
    bin: string;
    card_number: string;
    card_expiration_month: string;
    last_four_digit: string;
    card_expiration_year: string;
    create_at: string;
    updated_at: string;
}