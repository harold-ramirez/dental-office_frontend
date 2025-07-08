export interface Patient {
  Id: number;
  name: string;
  paternalSurname?: string | null;
  maternalSurname?: string | null;
  birthdate: string;
  phoneNumber?: string | null;
  gender: string;
}