import reservation from "../models/Reservation.js";
//Generate a random alphanumeric string
const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
};
//Check if confirmation code already exists in database
const codeExists = async (code: string): Promise<boolean> => {
  const existingReservation = await reservation.findOne({
    where: { confirmationCode: code }
  });
  
  return existingReservation !== null;
};
//Generate unique confirmation code Format: CINE-XXXXX (5 alphanumeric characters)
export const generateConfirmationCode = async (): Promise<string> => {
  let code: string;
  let isUnique = false;
  
  // Keep generating until we find a unique code
  while (!isUnique) {
    const randomPart = generateRandomString(5);
    code = `CINE-${randomPart}`;
    
    // Check if this code already exists
    isUnique = !(await codeExists(code));
  }
  
  return code!;
};