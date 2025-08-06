export type PersonalDetails = {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob?: string;
};

export type ContactInformation = {
  email: string;
  phone: string;
  city?: string;
  country?: string;
};

export type ProfessionalDetails = {
  occupation?: string;
  website?: string;
};

export type AdditionalInformation = {
  statusMessage?: string;
  bio?: string;
};

export interface EditUserProfileRequest {
  profilePhotoUrl?: string;
  personal_details: PersonalDetails;
  contact_information: ContactInformation;
  professional_details: ProfessionalDetails;
  additional_information: AdditionalInformation;
}
