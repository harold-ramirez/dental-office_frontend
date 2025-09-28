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

export interface MedicalImageDto {
  Id: number;
  filename: string;
  filepath: string;
  captureDate: Date;
  description: string;
  registerDate: Date;
  updateDate: Date;
  user: string;
}

export interface UploadMedicalImageDto {
  image:{
    uri: string;
    name: string;
    type: string;
  }
  captureDate?: Date;
  description?: string;
  Patient_Id: number;
  AppUser_Id: number;
}
