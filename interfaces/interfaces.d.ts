export interface PatientDto {
  Id: number;
  name: string;
  paternalSurname?: string | null;
  maternalSurname?: string | null;
  gender: string;
  identityDocument: string;
  cellphoneNumber?: string | null;
  telephoneNumber?: string | null;
  placeOfBirth?: string | null;
  birthdate: string;
  occupation?: string | null;
  address?: string | null;
}

export interface CreatePatientDto {
  name: string;
  paternalSurname?: string | null;
  maternalSurname?: string | null;
  gender: string;
  cellphoneNumber?: string | null;
  telephoneNumber?: string | null;
  identityDocument: string;
  placeOfBirth?: string | null;
  birthdate: string;
  occupation?: string | null;
  address?: string | null;
}

export interface AppointmentRequestDto {
  Id: number;
  patientFullName: string;
  dateHourRequest: string;
  phoneNumber: string;
  message: string;
  registerDate: string;

  status: boolean;
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
  image: {
    uri: string;
    name: string;
    type: string;
  };
  captureDate?: Date;
  description?: string;
  Patient_Id: number;
}

export interface MedicalHistoryDto {
  Id?: number;
  registerDate?: Date | string;
  personalPathologieshistory: {
    Id: number;
    name: string;
  }[];
  habits: {
    Id: number;
    name: string;
  }[];
  familyPathologicalHistory: string | null;
  allergies: string | null;
  pregnantMonths: string | null;
  medicalTreatment: string | null;
  takingMedicine: string | null;
  hemorrhageType: string | null;
  tmj: string | null;
  lymphNodes: string | null;
  breathingType: string | null;
  others: string | null;
  lipsStatus: string | null;
  tongueStatus: string | null;
  palateStatus: string | null;
  mouthFloorStatus: string | null;
  buccalMucousStatus: string | null;
  gumsStatus: string | null;
  prosthesisLocation: string | null;
  lastTimeVisitedDentist: string | null;
  useDentalFloss: boolean;
  useMouthWash: boolean;
  toothBrushingFrequency: string | null;
  hasBleedOnToothBrushing: boolean;
  oralHygiene: string | null;
}

export interface DiagnosedProcedureDto {
  Id?: number;
  description: string | null;
  totalCost: number | null;
  Treatment: {
    Id: number;
    name: string;
    description: string | null;
  };
  dentalPieces: number;
  registerDate: string;
  updateDate?: string;
}

export interface AppUserDto {
  Id: number;
  username: string;
  name: string;
  paternalSurname?: string | null;
  maternalSurname?: string | null;
  gender: string;
  phoneNumber?: string;
  defaultMessage?: string | null;
  sessionDurationMinutes: number;

  registerDate: string;
  updateDate?: string | null;
  status: boolean;
}
