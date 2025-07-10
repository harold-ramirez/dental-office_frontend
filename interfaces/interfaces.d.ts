export interface Patient {
  Id: number;
  name: string;
  paternalSurname?: string | null;
  maternalSurname?: string | null;
  birthdate: string;
  phoneNumber?: string | null;
  gender: string;
}

export interface CreatePatient {
  name: string;
  paternalSurname?: string | null;
  maternalSurname?: string | null;
  gender: string;
  phoneNumber?: string | null;
  placeOfBirth?: string | null;
  birthdate: string;
  occupation?: string | null;
  address?: string | null;
  AppUser_Id: number;
}