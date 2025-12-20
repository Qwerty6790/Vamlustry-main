export type Category = {
  label: string;
  searchName: string;
  href?: string;
  aliases?: string[];
  subcategories?: Category[];
  isOpen?: boolean;
};

export type Brand = {
  name: string;
}; 