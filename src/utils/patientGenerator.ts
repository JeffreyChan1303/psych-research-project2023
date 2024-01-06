import { faker } from '@faker-js/faker';

export type PatientData = {
  patientName: string;
  dob: string;
  currentAge: number;
  sex: string;
  patientId: string;
  hr: number;
  qtIntervals: string;
  femaleRange: string;
  maleRange: string;
};

// acts as a dummy data request to get random patient data
export function generateRandomPatientData(): PatientData {
  // 0 = male, 1 = female
  const gender = faker.person.sex() as 'male' | 'female';
  const firstName = faker.person.firstName(gender);
  const lastName = faker.person.lastName(gender);
  const patientName = firstName + ' ' + lastName;

  // generate a random date of birth
  const dob: Date = faker.date.birthdate({ min: 1934, max: 2020, mode: 'year' });

  // calculate age
  const today = new Date();
  let currentAge = today.getFullYear() - dob.getFullYear();
  const monthsDiff = today.getMonth() - dob.getMonth();
  // Adjust age if birthday hasn't occurred yet this year
  if (monthsDiff < 0 || (monthsDiff === 0 && today.getDate() < dob.getDate())) {
    currentAge -= 1;
  }

  const sex = gender.charAt(0).toUpperCase() + gender.slice(1);

  // generate patient id
  const patientIdString = faker.string.alpha({ length: 3 }).toUpperCase();
  const patientIdNumber = faker.number.int({ min: 0, max: 999 }).toString().padStart(3, '0');
  const patientId = `${patientIdString}-${patientIdNumber}`;

  const hr = faker.number.int({ min: 70, max: 170 });
  const qtIntervals = faker.number.float({ min: 0.1, max: 0.5, precision: 0.02 }).toPrecision(2);

  // male and female ranges
  const femaleRangeMin = faker.number.int({ min: 70, max: 100 });
  const femaleRangeMax = faker.number.int({ min: 110, max: 165 });
  const femaleRange = `${femaleRangeMin} to ${femaleRangeMax}`;

  const maleRangeMin = faker.number.int({ min: 70, max: 100 });
  const maleRangeMax = faker.number.int({ min: 110, max: 165 });
  const maleRange = `${maleRangeMin} to ${maleRangeMax}`;

  const data: PatientData = {
    patientName,
    dob: dob.toISOString().split('T')[0],
    currentAge,
    sex,
    patientId,
    hr,
    qtIntervals,
    femaleRange,
    maleRange
  };

  return data;
}
