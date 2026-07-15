export interface ProofOfDeliveryEntity {
  id: string;
  attemptId: string;
  signatureUrl: string | null;
  photoUrl: string | null;
  otpVerified: string | null;
  receiverName: string | null;
  gpsLatitude: string | null;
  gpsLongitude: string | null;
  deviceId: string | null;
  deliveryTimestamp: Date;
  createdAt: Date;
}
