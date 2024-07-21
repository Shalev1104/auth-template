export interface EntityMapper<Domain, Persistence, ResponseDTO = any> {
  toPersistence?: (domain: Domain) => Persistence;
  toDomain?: (persistence: Persistence) => Domain;
  toResponseDTO?: (domain: Domain) => ResponseDTO;
}
