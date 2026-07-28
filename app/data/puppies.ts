export type Puppy = {
  id: string;
  name: string;
  breed: string;
  sex: "male" | "female";
  price: number;
  status: "available" | "reserved" | "sold";
};

export const PUPPIES: Puppy[] = [
  { id: "1", name: "Willow", breed: "Golden Retriever", sex: "female", price: 2400, status: "available" },
  { id: "2", name: "Bram", breed: "French Bulldog", sex: "male", price: 3100, status: "available" },
  { id: "3", name: "Sable", breed: "Cavalier King Charles Spaniel", sex: "female", price: 2800, status: "reserved" },
  { id: "4", name: "Otis", breed: "Labradoodle", sex: "male", price: 2200, status: "available" },
  { id: "5", name: "Nell", breed: "Maltipoo", sex: "female", price: 1900, status: "sold" },
  { id: "6", name: "Ranger", breed: "German Shepherd Dog", sex: "male", price: 2600, status: "available" },
  { id: "7", name: "Poppy", breed: "Pomeranian", sex: "female", price: 2100, status: "available" },
  { id: "8", name: "Duke", breed: "Rottweiler", sex: "male", price: 2500, status: "reserved" },
];