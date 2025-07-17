export interface PatientDto {
  Id: number;
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

export interface CreatePatientDto {
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

export interface AppointmentRequestDto {
  Id: number;
  patientFullName: string;
  dateHourRequest: string;
  phoneNumber: string;
  message: string;
  registerDate: string;
  AppUser_Id: number;
}
